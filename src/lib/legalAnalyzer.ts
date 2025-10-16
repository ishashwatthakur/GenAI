import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '../types/analysis';

// A "type guard" to check if an object is a valid AnalysisResult at runtime
function isAnalysisResult(obj: any): obj is AnalysisResult {
  return obj && typeof obj.summary === 'string' && typeof obj.overallRiskScore === 'number';
}

// Initialize the Google AI client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Analyzes a legal document using Google's Gemini AI
 * @param text - The full text of the legal document
 * @returns A promise that resolves to a structured analysis result
 */
export async function analyzeLegalDocument(text: string): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error("Cannot analyze document: Gemini API Key is not configured.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // The prompt remains the same as in your new code, it is excellent.
    const prompt = `
You are a legal document analyzer...
// ... (Your full, detailed prompt goes here) ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean the response
    let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
    
    const parsedJson = JSON.parse(cleanedResponse);

    // Use the type guard to safely validate the object
    if (isAnalysisResult(parsedJson)) {
        return parsedJson;
    } else {
        throw new Error("AI response did not match the expected format.");
    }
    
  } catch (error: unknown) {
    console.error('Error analyzing document:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

    // Return a valid AnalysisResult object for the error state
    return {
      documentType: "Error",
      summary: "Error during analysis. The AI service may be unavailable or the document format is unsupported.",
      overallRiskScore: 100,
      riskLevel: 'High',
      riskCategories: {},
      flaggedClauses: [{
        id: 'error-1',
        severity: 'critical',
        title: 'Analysis Failed',
        description: errorMessage,
        category: 'System Error',
        location: 'N/A',
        fullText: 'Unable to analyze document',
        recommendation: 'Please try uploading the document again or contact support if the issue persists.'
      }],
      actionItems: [{
        priority: 'high',
        action: 'Retry Analysis',
        description: 'The document could not be analyzed due to a technical error.',
        context: 'System encountered an error during AI processing',
        reason: 'Technical failure prevented analysis completion'
      }],
      finalVerdict: {
        mainConcerns: ['Analysis could not be completed'],
        recommendation: 'Do not proceed. Please try again or seek professional legal review.'
      }
      // Ensure other required fields are present if your interface demands them
    } as AnalysisResult; // Cast here is safe as we are explicitly creating the error object
  }
}

// The identifyCommonRisks function you wrote is perfectly typed. No changes needed.
interface IdentifiedRisk {
  risk: string;
  explanation: string;
}
interface RiskPattern {
  pattern: RegExp;
  risk: string;
  explanation: string;
}
export function identifyCommonRisks(text: string): IdentifiedRisk[] {
  const risks: IdentifiedRisk[] = [];
  
  const riskyPatterns: RiskPattern[] = [
    {
      pattern: /automatic renewal|auto-renewal|automatically renew/gi,
      risk: "Automatic renewal clause",
      explanation: "This contract may renew automatically without your explicit consent"
    },
    {
      pattern: /waive|waiver of|waiving/gi,
      risk: "Rights waiver",
      explanation: "You may be giving up certain legal rights"
    },
    {
      pattern: /arbitration|binding arbitration/gi,
      risk: "Mandatory arbitration",
      explanation: "You may be required to resolve disputes through arbitration instead of court"
    },
    {
      pattern: /indemnify|indemnification|hold harmless/gi,
      risk: "Indemnification clause",
      explanation: "You may be responsible for legal costs or damages"
    },
    {
      pattern: /liquidated damages|penalty/gi,
      risk: "Penalty clause",
      explanation: "Specific penalties for breach of contract are defined"
    },
    {
      pattern: /non-compete|non compete|noncompete/gi,
      risk: "Non-compete clause",
      explanation: "Restrictions on your ability to work in similar roles or industries"
    },
    {
      pattern: /confidential|non-disclosure|nda/gi,
      risk: "Confidentiality requirements",
      explanation: "Obligations to keep certain information secret"
    }
  ];
  
  riskyPatterns.forEach(({ pattern, risk, explanation }: RiskPattern) => {
    if (pattern.test(text)) {
      risks.push({ risk, explanation });
    }
  });
  
  return risks;
}