import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerationConfig, GenerativeModel } from '@google/generative-ai';

// --- TYPE DEFINITIONS ---

interface IFormData {
  prompt: string;
  jurisdiction?: string;
}

interface IDraftRequestBody {
  mode: string;
  formData: IFormData;
  userId: string;
}

interface ApiResponse {
  success: boolean;
  draft?: string;
  metadata?: {
    model: string;
    timestamp: string;
    jurisdiction: string;
  };
  error?: string;
}

// --- CORE LOGIC ---

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse and validate request body
    const body = await request.json() as IDraftRequestBody;
    const { mode, formData, userId } = body;

    // Validate required fields
    if (!formData?.prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (typeof formData.prompt !== 'string' || formData.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be a non-empty string' },
        { status: 400 }
      );
    }

    // Check API key
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    const generationConfig: GenerationConfig = {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig
    });

    const systemPrompt = `You are an expert legal document drafter. Generate a complete, professionally formatted legal document.

CRITICAL FORMATTING INSTRUCTIONS - FOLLOW EXACTLY:

1. DOCUMENT TITLE:
   - First line MUST be the document type in ALL CAPS (e.g., "NON-DISCLOSURE AGREEMENT")
   - NO quotation marks around the title
   - Leave ONE blank line after title

2. MAJOR SECTION HEADINGS (use for main sections):
   - Format: "1. SECTION NAME IN ALL CAPS" (e.g., "1. DEFINITIONS", "2. OBLIGATIONS")
   - Must start with a number followed by period and space
   - Section name in ALL CAPS
   - Leave ONE blank line before each major heading
   - Leave ONE blank line after each major heading

3. SUB-HEADINGS (use for subsections):
   - Format: "1.1 Subsection Name" or "2.1 Specific Topic"
   - Use title case (first letter capitalized)
   - Leave ONE blank line before each sub-heading

4. BODY TEXT (regular paragraphs):
   - Write in complete sentences
   - Each paragraph should be 2-4 sentences
   - Leave ONE blank line between paragraphs
   - NO quotation marks at the start of paragraphs
   - Use proper legal language

5. RECITALS (if applicable):
   - Start with "RECITALS" as a major heading
   - Each recital starts with "WHEREAS" in the same line
   - Example: "WHEREAS the Disclosing Party possesses confidential information..."

6. SIGNATURE BLOCKS:
   - End with "IN WITNESS WHEREOF" section
   - Include spaces for signatures like:
   
   _________________________
   [Party Name]
   Date: _______________

EXAMPLE FORMAT:

NON-DISCLOSURE AGREEMENT

RECITALS

WHEREAS the Disclosing Party possesses certain confidential information relating to its business operations and strategic plans.

WHEREAS the Receiving Party desires to receive such confidential information for the purpose of evaluating a potential business relationship.

1. DEFINITIONS

For purposes of this Agreement, the following terms shall have the meanings set forth below.

1.1 Confidential Information

"Confidential Information" means any and all technical and non-technical information disclosed by the Disclosing Party to the Receiving Party.

1.2 Purpose

"Purpose" means the evaluation of a potential business relationship between the parties.

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to maintain the confidentiality of all Confidential Information received from the Disclosing Party.

2.1 Non-Disclosure

The Receiving Party shall not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.

2.2 Use Restrictions

The Receiving Party shall use the Confidential Information solely for the Purpose and for no other reason.

NOW GENERATE THE DOCUMENT FOLLOWING THIS EXACT FORMAT.`;

    const userPrompt = `DRAFTING REQUEST: ${formData.prompt}

JURISDICTION: ${formData.jurisdiction || 'US Federal'}

Generate a complete legal document following the formatting rules exactly. Do NOT use quotation marks anywhere in the document except within actual quoted text.`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    let draft = response.text();

    // Clean up the generated text
    draft = draft
      .replace(/```[\w]*\n?/g, '') // Remove code blocks
      .replace(/^["'\`]+|["'\`]+$/gm, '') // Remove quotes at start/end of lines
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/##\s/g, '') // Remove markdown headings
      .trim();

    return NextResponse.json({
      success: true,
      draft: draft,
      metadata: {
        model: 'gemini-2.0-flash-exp',
        timestamp: new Date().toISOString(),
        jurisdiction: formData.jurisdiction || 'US Federal'
      }
    });

  } catch (error) {
    console.error('Draft generation error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Generation failed';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}