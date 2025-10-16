// src/app/api/document-process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from '@google/generative-ai';
import type { AnalysisResult } from '@/types/analysis';

// --- TYPE DEFINITIONS ---

interface ApiResponse {
  success: boolean;
  analysis?: AnalysisResult;
  error?: string;
  retryable?: boolean;
}

interface GetResponse {
  message: string;
  hasApiKey: boolean;
  supportedFormats: string[];
  timestamp: string;
}

// --- CORE LOGIC ---

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set in environment variables');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

async function convertDocxToText(arrayBuffer: ArrayBuffer): Promise<string | null> {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let binaryString = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const docXmlStart = binaryString.indexOf('word/document.xml');
    if (docXmlStart !== -1) {
      const xmlContentStart = binaryString.indexOf('<?xml', docXmlStart);
      if (xmlContentStart !== -1) {
        const xmlContentEnd = binaryString.indexOf('</w:document>', xmlContentStart);
        if (xmlContentEnd !== -1) {
          const xmlContent = binaryString.substring(xmlContentStart, xmlContentEnd + 13);
          
          const textMatches: string[] = [];
          const wtPattern = /<w:t[^>]*>([^<]*)<\/w:t>/g;
          let match;
          while ((match = wtPattern.exec(xmlContent)) !== null) {
            if (match[1]) {
              textMatches.push(match[1]);
            }
          }
          
          if (textMatches.length > 0) {
            let text = textMatches.join(' ');
            
            text = text
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .replace(/&#x([0-9A-F]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
              .replace(/&#([0-9]+);/g, (_match, dec) => String.fromCharCode(parseInt(dec, 10)))
              .replace(/\s+/g, ' ')
              .trim();
            
            console.log('DOCX text extracted, length:', text.length);
            return text;
          }
        }
      }
    }
    
    const textMatches: string[] = [];
    const wtPattern = /<w:t[^>]*>([^<]+)<\/w:t>/g;
    let match;
    while ((match = wtPattern.exec(binaryString)) !== null) {
      if (match[1] && match[1].trim()) {
        textMatches.push(match[1]);
      }
    }
    
    if (textMatches.length > 0) {
      let text = textMatches.join(' ');
      text = text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      return text;
    }
    
    return null;
  } catch (error) {
    console.error('DOCX conversion error:', error);
    return null;
  }
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  initialDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryableError = error instanceof Error && 
        (error.message?.includes('503') || error.message?.includes('overloaded'));
      
      if (isRetryableError && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Gemini API overloaded, retrying in ${delay}ms... (attempt ${i + 2}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached");
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  console.log('=== POST request received ===');
  
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (!genAI) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.'
      }, { status: 500, headers });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error('FormData parsing error:', e);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid form data' 
      }, { status: 400, headers });
    }

    const file = formData.get('file');
    
    if (!file || typeof file === 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded or invalid file type' 
      }, { status: 400, headers });
    }

    console.log(`File received: ${file.name} (${file.size} bytes, ${file.type})`);

    try {
      const model: GenerativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest" 
      });
      
      let result: GenerateContentResult;
      let documentText = '';
      
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                     file.name.toLowerCase().endsWith('.docx');
      
      if (isDocx) {
        console.log('Processing DOCX file...');
        
        const arrayBuffer = await file.arrayBuffer();
        const extractedText = await convertDocxToText(arrayBuffer);
        
        if (extractedText && extractedText.length > 30) {
          console.log('Successfully extracted text from DOCX');
          
          const maxLength = 30000;
          documentText = extractedText.length > maxLength 
            ? extractedText.substring(0, maxLength) + '\n\n[Document truncated for analysis]'
            : extractedText;
          
          const prompt = `Analyze this legal document and provide a comprehensive analysis in JSON format with the following structure:

{
  "summary": "Brief overview of the document",
  "overallRiskScore": <number 0-100>,
  "riskLevel": "Low" | "Medium" | "High",
  "documentType": "string",
  "parties": ["Party 1", "Party 2"],
  "effectiveDate": "YYYY-MM-DD",
  "expirationDate": "YYYY-MM-DD",
  "flaggedClauses": [
    {
      "id": 1,
      "title": "string",
      "severity": "critical" | "warning" | "safe",
      "category": "Payment" | "Termination" | "Liability" | "IP" | "Privacy" | "Other" | "General",
      "description": "string",
      "fullText": "string",
      "location": "string",
      "recommendation": "string",
      "negotiable": boolean
    }
  ],
  "obligations": [
    {
      "party": "string",
      "obligation": "string",
      "dueDate": "YYYY-MM-DD",
      "frequency": "One-time" | "Monthly" | "Annual" | "As needed"
    }
  ],
  "keyDates": [
    {
      "date": "YYYY-MM-DD",
      "event": "string",
      "type": "Deadline" | "Renewal" | "Payment" | "Review"
    }
  ],
  "riskCategories": {
    "financial": <number 0-100>,
    "legal": <number 0-100>,
    "operational": <number 0-100>,
    "reputational": <number 0-100>,
    "compliance": <number 0-100>
  },
  "positiveProvisions": [
    {
      "title": "string",
      "benefit": "string",
      "location": "string"
    }
  ],
  "missingClauses": [
    {
      "clause": "string",
      "importance": "string",
      "suggestion": "string"
    }
  ],
  "industryComparison": {
    "contractLength": "Shorter" | "Average" | "Longer than industry standard",
    "complexity": "Below" | "At" | "Above industry standard",
    "fairness": "More favorable" | "Balanced" | "Less favorable"
  },
  "actionItems": [
    {
      "priority": "High" | "Medium" | "Low",
      "action": "string",
      "reason": "string"
    }
  ],
  "negotiationPoints": ["string"],
  "finalVerdict": {
    "recommendation": "Sign as-is" | "Negotiate first" | "Seek legal counsel" | "Avoid" | "Review carefully",
    "confidence": <number 0-100>,
    "mainConcerns": ["string"]
  }
}

Document text to analyze:

${documentText}`;

          result = await retryWithBackoff(() => model.generateContent(prompt));
          
        } else {
          console.log('DOCX extraction failed, providing guidance');
          return NextResponse.json({
            success: false,
            error: 'Unable to extract text from Word document. Please convert to PDF format and try again.'
          }, { status: 400, headers });
        }
        
      } else {
        console.log('Processing file with Gemini...');
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        const filePart = {
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        };

        const prompt = `Analyze this legal document and provide a comprehensive analysis in JSON format with the following structure:

{
  "summary": "Brief overview of the document",
  "overallRiskScore": <number 0-100>,
  "riskLevel": "Low" | "Medium" | "High",
  "documentType": "string",
  "parties": ["Party 1", "Party 2"],
  "effectiveDate": "YYYY-MM-DD",
  "expirationDate": "YYYY-MM-DD",
  "flaggedClauses": [...],
  "obligations": [...],
  "keyDates": [...],
  "riskCategories": {...},
  "positiveProvisions": [...],
  "missingClauses": [...],
  "industryComparison": {...},
  "actionItems": [...],
  "negotiationPoints": [...],
  "finalVerdict": {...}
}

Provide detailed, accurate analysis based on the document content.`;

        result = await retryWithBackoff(() => model.generateContent([prompt, filePart]));
      }
      
      const aiResponse = result.response.text();
      console.log('Gemini response received');

      let analysisData: Partial<AnalysisResult>;
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('AI Response:', aiResponse.substring(0, 500) + '...');
        
        let summary = "Document analysis completed.";
        let riskScore: 'Low' | 'Medium' | 'High' = "Medium";
        let riskyClauses: AnalysisResult['flaggedClauses'] = [];
        let recommendations = "Please review the analysis carefully.";

        const lines = aiResponse.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('SUMMARY:')) {
            summary = trimmed.substring(8).trim();
          } else if (trimmed.startsWith('RISK:')) {
            const riskValue = trimmed.substring(5).trim();
            if (['Low', 'Medium', 'High'].includes(riskValue)) {
              riskScore = riskValue as 'Low' | 'Medium' | 'High';
            }
          } else if (trimmed.startsWith('CONCERNS:')) {
            const concernsText = trimmed.substring(9).trim();
            if (concernsText.toLowerCase() !== 'none' && concernsText.toLowerCase() !== 'none identified') {
              riskyClauses = concernsText.split(';').filter(c => c.trim()).map((item, index) => ({
                id: index + 1,
                title: `Concern ${index + 1}`,
                severity: 'warning' as const,
                category: 'General' as const,
                description: item.trim(),
                fullText: item.trim().substring(0, 200),
                location: 'Document',
                recommendation: 'Review this clause carefully',
                negotiable: true
              }));
            }
          } else if (trimmed.startsWith('ADVICE:')) {
            recommendations = trimmed.substring(7).trim();
          }
        }
        
        analysisData = {
          summary,
          overallRiskScore: riskScore === 'High' ? 75 : riskScore === 'Medium' ? 50 : 25,
          riskLevel: riskScore,
          documentType: 'Document',
          parties: ['Party A', 'Party B'],
          effectiveDate: 'Not specified',
          expirationDate: 'Not specified',
          flaggedClauses: riskyClauses,
          actionItems: [{
            priority: 'high',
            action: recommendations,
            description: 'Based on document analysis',
            context: 'General document review',
            reason: 'Based on document analysis'
          }],
          finalVerdict: {
            recommendation: 'Seek legal counsel',
            mainConcerns: riskyClauses?.slice(0, 3).map(c => c.description) || []
          }
        };
      }

      const fullAnalysis: AnalysisResult = {
        summary: analysisData.summary || "Document analysis completed.",
        overallRiskScore: analysisData.overallRiskScore || 50,
        riskLevel: analysisData.riskLevel || "Medium",
        riskCategories: analysisData.riskCategories || { 
          financial: 50, 
          legal: 50, 
          operational: 50, 
                    reputational: 50, 
          compliance: 50 
        },
        documentType: analysisData.documentType || "Document",
        parties: analysisData.parties || ['Party A', 'Party B'],
        effectiveDate: analysisData.effectiveDate || 'Not specified',
        expirationDate: analysisData.expirationDate || 'Not specified',
        flaggedClauses: (analysisData.flaggedClauses || []).map((clause, index) => ({
          ...clause,
          id: clause.id || index + 1
        })),
        obligations: analysisData.obligations || [],
        keyDates: analysisData.keyDates || [],
        positiveProvisions: analysisData.positiveProvisions || [],
        missingClauses: analysisData.missingClauses || [],
        industryComparison: analysisData.industryComparison || { 
          contractLength: 'Average', 
          complexity: 'At', 
          fairness: 'Balanced' 
        },
        actionItems: analysisData.actionItems || [],
        negotiationPoints: analysisData.negotiationPoints || [],
        finalVerdict: analysisData.finalVerdict || { 
          recommendation: 'Review carefully',
          mainConcerns: [] 
        }
      };

      const wordCount = documentText ? documentText.split(/\s+/).length : 1000;
      const readingTime = Math.ceil(wordCount / 200);

      fullAnalysis.metadata = {
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        wordCount: wordCount,
        estimatedReadTime: `${readingTime} min`,
        pageCount: Math.ceil(wordCount / 500)
      };

      return NextResponse.json({
        success: true,
        analysis: fullAnalysis,
      }, { headers });

    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      
      if (aiError instanceof Error) {
        if (aiError.message?.includes('404') || aiError.message?.includes('not found')) {
          return NextResponse.json({ 
            success: false, 
            error: 'The AI model is temporarily unavailable. Please try again in a few moments.', 
            retryable: true 
          }, { status: 503, headers });
        } else if (aiError.message?.includes('503') || aiError.message?.includes('overloaded')) {
          return NextResponse.json({ 
            success: false, 
            error: 'The AI service is currently experiencing high demand. Please try again in a few moments.', 
            retryable: true 
          }, { status: 503, headers });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: `Analysis failed: ${aiError.message || 'Unknown error'}` 
          }, { status: 500, headers });
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'An unexpected error occurred during analysis' 
        }, { status: 500, headers });
      }
    }

  } catch (error) {
    console.error('Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${errorMessage}` 
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse<GetResponse>> {
  return NextResponse.json({ 
    message: 'Document processor API is running',
    hasApiKey: !!API_KEY,
    supportedFormats: ['PDF', 'TXT', 'DOCX', 'Images (JPG, PNG)'],
    timestamp: new Date().toISOString()
  });
}