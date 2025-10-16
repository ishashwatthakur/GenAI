import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentResult,
  ModelParams,
} from '@google/generative-ai';

// Type definitions (Your types are perfect, no changes needed)
type FormData = Record<string, string>;

interface Playbook {
  name: string;
  rules: Record<string, any>;
}

interface GenerationMetadata {
  model: string;
  timestamp: string;
  documentType?: string;
  playbook?: string;
  jurisdiction?: string;
}

interface ReviewData {
  overallRisk: 'low' | 'medium' | 'high';
  issues: Array<{
    severity: 'low' | 'medium' | 'high';
    issue: string;
    suggestion: string;
  }>;
  missingClauses: string[];
  complianceCheck: {
    passed: boolean;
    details: string;
  };
  improvedDraft: string;
}

interface GenerationSuccess {
  success: true;
  draft: string;
  metadata: GenerationMetadata;
}

interface ReviewSuccess {
  success: true;
  review: ReviewData;
}

interface GenerationError {
  success: false;
  error: string;
}

// Initialize the Google AI client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set. Please check your .env.local file.");
}
const genAI = new GoogleGenerativeAI(apiKey || '');

export class GeminiDrafter {
  private model: GenerativeModel;

  constructor() {
    const modelParams: ModelParams = {
      model: 'gemini-1.5-flash', // Using a modern, capable model
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    };
    this.model = genAI.getGenerativeModel(modelParams);
  }

  async generateFromQuestionnaire(
    documentType: string,
    formData: FormData,
    playbook: Playbook | null = null
  ): Promise<GenerationSuccess | GenerationError> {
    const systemPrompt = this._buildSystemPrompt(documentType, playbook);
    const userPrompt = this._buildQuestionnairePrompt(documentType, formData);

    try {
      const result: GenerateContentResult = await this.model.generateContent([systemPrompt, userPrompt]);
      const response = result.response;
      
      return {
        success: true,
        draft: response.text(),
        metadata: {
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          documentType,
          playbook: playbook?.name || 'default'
        }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Gemini generation error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async generateFromPlainLanguage(
    request: string,
    jurisdiction: string,
    playbook: Playbook | null = null
  ): Promise<GenerationSuccess | GenerationError> {
    const systemPrompt = `You are an expert legal document drafter. Generate a complete, legally sound document based on the user's plain language request.

CRITICAL RULES:
1. Follow ${jurisdiction} legal standards
2. Use proper legal terminology and structure
3. Include all necessary clauses for enforceability
4. Add placeholder text in [BRACKETS] for user-specific details
5. Include a header comment explaining what review is needed
${playbook ? `6. ENFORCE PLAYBOOK RULES: ${JSON.stringify(playbook.rules)}` : ''}

Format the output as a complete, professional legal document.`;

    try {
      const result: GenerateContentResult = await this.model.generateContent([systemPrompt, `DRAFTING REQUEST: ${request}`]);
      const response = result.response;
      
      return {
        success: true,
        draft: response.text(),
        metadata: {
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          jurisdiction,
          playbook: playbook?.name || 'default'
        }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Gemini generation error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async reviewDraft(
    draft: string,
    jurisdiction: string,
    playbook: Playbook | null = null
  ): Promise<ReviewSuccess | GenerationError> {
    const jsonModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      }
    });

    const systemPrompt = `You are a legal document reviewer. Analyze the provided draft and return a valid JSON object based on the following schema:
{
  "overallRisk": "low|medium|high",
  "issues": [{"severity": "high|medium|low", "issue": "description", "suggestion": "fix"}],
  "missingClauses": ["clause1", "clause2"],
  "complianceCheck": {"passed": true/false, "details": "explanation"},
  "improvedDraft": "full improved text here"
}

CONTEXT:
1. Jurisdiction: ${jurisdiction}
${playbook ? `2. Playbook Rules: ${JSON.stringify(playbook.rules)}` : ''}`;

    try {
      const result: GenerateContentResult = await jsonModel.generateContent([systemPrompt, `DRAFT TO REVIEW:\n\n${draft}`]);
      const response = result.response;
      
      const reviewData: ReviewData = JSON.parse(response.text());

      return {
        success: true,
        review: reviewData
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Gemini review error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private _buildSystemPrompt(documentType: string, playbook: Playbook | null): string {
    return `You are an expert legal document drafter specializing in ${documentType}s.

INSTRUCTIONS:
1. Generate a complete, legally sound ${documentType}
2. Use proper legal formatting and structure
3. Include all standard clauses for this document type
4. Use placeholder text in [BRACKETS] for specific details
5. Follow best practices for the specified jurisdiction
${playbook ? `6. CRITICAL: Enforce these playbook rules:\n${JSON.stringify(playbook.rules, null, 2)}` : ''}

OUTPUT FORMAT:
- Start with document title
- Include execution date placeholder
- Use clear section headings
- Number clauses appropriately
- End with signature blocks

Generate a professional, enforceable document.`;
  }

  private _buildQuestionnairePrompt(documentType: string, formData: FormData): string {
    return `Generate a ${documentType} with the following specifications:

${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Ensure all provided information is accurately incorporated into the appropriate sections.`;
  }
}

// Export a singleton instance
export default new GeminiDrafter();