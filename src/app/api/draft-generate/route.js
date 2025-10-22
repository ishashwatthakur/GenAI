import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getJurisdictionRequirements, validateJurisdictionCompliance } from '../../../lib/drafter/jurisdictionRules';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { mode, formData, userId } = await request.json();

    if (!formData?.prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!formData?.jurisdiction || formData.jurisdiction === 'undefined' || formData.jurisdiction === 'null') {
      return NextResponse.json(
        { success: false, error: 'Please select a valid region/jurisdiction before generating the document' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
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

JURISDICTION: ${formData.jurisdiction}

CRITICAL JURISDICTION-SPECIFIC REQUIREMENTS:
You MUST generate this legal document in accordance with the actual laws, regulations, constitution, and legal practices of ${formData.jurisdiction}. This includes:

1. LEGAL FRAMEWORK COMPLIANCE:
   - Apply the specific statutory laws and regulations of ${formData.jurisdiction}
   - Follow the constitutional requirements applicable in this jurisdiction
   - Include all mandatory clauses required by law in ${formData.jurisdiction}
   - Use the legal terminology and language standard in ${formData.jurisdiction}

2. JURISDICTION-SPECIFIC CLAUSES:
   - Include jurisdiction-mandated provisions (e.g., employment law protections, consumer rights, data privacy requirements)
   - Add required notices, disclosures, or warnings specific to ${formData.jurisdiction}
   - Follow the statutory format requirements if any exist in this jurisdiction
   - Include governing law and dispute resolution clauses appropriate for ${formData.jurisdiction}

3. LEGAL SYSTEM CONSIDERATIONS:
   - Adapt the document structure to match ${formData.jurisdiction}'s legal system (common law, civil law, hybrid, or religious law)
   - Use appropriate legal precedents and references from ${formData.jurisdiction}
   - Include all statutory requirements for contract validity in ${formData.jurisdiction}
   - Follow local court rules and procedural requirements

4. LANGUAGE AND FORMATTING:
   - If ${formData.jurisdiction} has an official language other than English, note it but draft in English with legally appropriate terminology
   - Use legal conventions and phrasing standard in ${formData.jurisdiction}
   - Include any required headers, footers, or registration information

5. ENFORCEABILITY:
   - Ensure all terms are enforceable under ${formData.jurisdiction}'s laws
   - Avoid any clauses that would be deemed illegal or void in ${formData.jurisdiction}
   - Include severability clauses appropriate for ${formData.jurisdiction}

IMPORTANT: This document must be legally valid and enforceable in ${formData.jurisdiction}. Research and apply the actual legal requirements of this jurisdiction. Do NOT use generic templates - make this jurisdiction-specific.

Generate a complete legal document following the formatting rules exactly. Do NOT use quotation marks anywhere in the document except within actual quoted text.`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    let draft = response.text();

    // Clean up the generated text
    draft = draft
      .replace(/```[\w]*\n?/g, '') // Remove code blocks
      .replace(/^["'`]+|["'`]+$/gm, '') // Remove quotes at start/end of lines
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/##\s/g, '') // Remove markdown headings
      .trim();

    // Get document type from the prompt or title
    const documentType = draft.toLowerCase().includes('employment agreement') ? 'employment' : 
                        draft.toLowerCase().includes('nda') || draft.toLowerCase().includes('non-disclosure') ? 'nda' : 
                        'other';

    const jurisdiction = formData.jurisdiction;

    // Try to validate jurisdiction compliance for known jurisdictions
    // For international jurisdictions, we rely on the AI's knowledge
    const compliance = validateJurisdictionCompliance(draft, jurisdiction, documentType);

    // Note: We rely primarily on the AI's comprehensive jurisdiction-specific prompt
    // rather than a hardcoded database of requirements for all countries

    return NextResponse.json({
      success: true,
      draft: draft,
      metadata: {
        model: 'gemini-2.0-flash-exp',
        timestamp: new Date().toISOString(),
        jurisdiction: jurisdiction,
        documentType: documentType,
        jurisdictionCompliance: {
          note: 'Document generated with jurisdiction-specific AI instructions',
          jurisdiction: jurisdiction,
          aiInstructed: true
        }
      }
    });

  } catch (error) {
    console.error('Draft generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}