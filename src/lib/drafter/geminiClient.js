import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export class GeminiDrafter {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',  // Updated model name
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
  }

  async generateFromQuestionnaire(documentType, formData, playbook = null) {
    const systemPrompt = this._buildSystemPrompt(documentType, playbook);
    const userPrompt = this._buildQuestionnairePrompt(documentType, formData);

    try {
      const result = await this.model.generateContent([systemPrompt, userPrompt]);
      const response = await result.response;
      
      return {
        success: true,
        draft: response.text(),
        metadata: {
          model: 'gemini-2.0-flash-exp',
          timestamp: new Date().toISOString(),
          documentType,
          playbook: playbook?.name || 'default'
        }
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateFromPlainLanguage(request, jurisdiction, playbook = null) {
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
      const result = await this.model.generateContent([systemPrompt, `DRAFTING REQUEST: ${request}`]);
      const response = await result.response;
      
      return {
        success: true,
        draft: response.text(),
        metadata: {
          model: 'gemini-2.0-flash-exp',
          timestamp: new Date().toISOString(),
          jurisdiction,
          playbook: playbook?.name || 'default'
        }
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async reviewDraft(draft, jurisdiction, playbook = null) {
    const systemPrompt = `You are a legal document reviewer. Analyze the provided draft and:

1. Identify potential legal risks or missing clauses
2. Check compliance with ${jurisdiction} law
3. Suggest improvements for clarity and enforceability
${playbook ? `4. Verify compliance with playbook rules: ${JSON.stringify(playbook.rules)}` : ''}

Return a JSON object with:
{
  "overallRisk": "low|medium|high",
  "issues": [{"severity": "high|medium|low", "issue": "description", "suggestion": "fix"}],
  "missingClauses": ["clause1", "clause2"],
  "complianceCheck": {"passed": true/false, "details": "explanation"},
  "improvedDraft": "full improved text here"
}`;

    try {
      const result = await this.model.generateContent([systemPrompt, `DRAFT TO REVIEW:\n\n${draft}`]);
      const response = await result.response;
      const reviewText = response.text();
      
      const jsonMatch = reviewText.match(/```json\n([\s\S]*?)\n```/) || 
                        reviewText.match(/```\n([\s\S]*?)\n```/);
      
      const reviewData = jsonMatch 
        ? JSON.parse(jsonMatch[1]) 
        : JSON.parse(reviewText);

      return {
        success: true,
        review: reviewData
      };
    } catch (error) {
      console.error('Gemini review error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  _buildSystemPrompt(documentType, playbook) {
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

  _buildQuestionnairePrompt(documentType, formData) {
    return `Generate a ${documentType} with the following specifications:

${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Ensure all provided information is accurately incorporated into the appropriate sections.`;
  }
}

export default new GeminiDrafter();