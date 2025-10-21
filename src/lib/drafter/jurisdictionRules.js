// @/src/lib/drafter/jurisdictionRules.js

/**
 * This is a simplified placeholder for jurisdiction-specific legal requirements.
 * In a real-world application, this would be a comprehensive and regularly updated
 * database of legal clauses, notices, and formatting rules for different document
 * types and jurisdictions.
 */
const JURISDICTION_RULES = {
  'nda': {
    'California': [
      'Must include a specific clause protecting the disclosure of information related to sexual harassment or assault (Civil Code § 1670.11).',
      'Must clearly state that the agreement does not prohibit the employee from discussing wages, hours, or working conditions.',
    ],
    'New York': [
      'Must include a carve-out for disclosures to law enforcement, government agencies, or an attorney.',
      'Cannot be used to conceal claims of discrimination, harassment, or retaliation.',
    ]
  },
  'employment': {
    'Texas': [
      'Must specify if the employment is "at-will," meaning it can be terminated by either party for any reason.',
      'Must include language regarding non-compete clauses if applicable, outlining scope, duration, and geographic limitations.',
    ],
    'US Federal': [
      'Must include an Equal Opportunity Employer (EOE) statement.',
      'Must comply with the Fair Labor Standards Act (FLSA) regarding wage and hour provisions.',
    ]
  },
  'other': {
    'US Federal': [
      'Must include a severability clause, stating that if one part of the contract is found unenforceable, the rest of the contract remains valid.'
    ]
  }
};

/**
 * Retrieves the specific legal requirements for a given jurisdiction and document type.
 * @param {string} jurisdiction - The jurisdiction (e.g., 'California', 'US Federal').
 * @param {string} documentType - The type of document (e.g., 'nda', 'employment').
 * @returns {string[]} An array of requirement strings, or an empty array if none are found.
 */
export function getJurisdictionRequirements(jurisdiction, documentType) {
  const docRules = JURISDICTION_RULES[documentType] || {};
  return docRules[jurisdiction] || JURISDICTION_RULES['other']['US Federal'] || [];
}

/**
 * Validates if a generated legal draft complies with known jurisdiction requirements.
 * @param {string} draftText - The full text of the legal document draft.
 * @param {string} jurisdiction - The jurisdiction to validate against.
 * @param {string} documentType - The type of document being validated.
 * @returns {{compliant: boolean, missingRequirements: string[]}} An object indicating compliance and listing any missing requirements.
 */
export function validateJurisdictionCompliance(draftText, jurisdiction, documentType) {
  const requirements = getJurisdictionRequirements(jurisdiction, documentType);
  if (!requirements.length) {
    return { compliant: true, missingRequirements: [] };
  }

  const missingRequirements = [];
  const lowerCaseDraft = draftText.toLowerCase();

  // This is a simplified check. A more robust solution would use more sophisticated NLP
  // or keyword/phrase matching to determine if the spirit of the requirement is met.
  requirements.forEach(req => {
    // A simplistic check: does the draft contain a few keywords from the requirement?
    // E.g., for "at-will employment", it checks for "at-will".
    const keywords = req.toLowerCase().match(/\b(\w+)\b/g).slice(0, 5); // Use first 5 words as keywords
    const isPresent = keywords.some(key => lowerCaseDraft.includes(key));
    
    if (!isPresent) {
      missingRequirements.push(req);
    }
  });

  return {
    compliant: missingRequirements.length === 0,
    missingRequirements: missingRequirements
  };
}
