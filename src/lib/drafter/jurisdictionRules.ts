// jurisdictionRules.ts

/**
 * Scope of legal applicability for a rule
 */
type RuleScope = 'employment' | 'consumer' | 'b2b' | 'general' | 'real-estate' | 'ip';

/**
 * Category of legal rules
 */
type RuleCategory = 
  | 'employment'
  | 'privacy'
  | 'consumerProtection'
  | 'liability'
  | 'termination'
  | 'disputeResolution'
  | 'dataRetention'
  | 'licensing'
  | 'intellectual-property'
  | 'payment'
  | 'warranties';

/**
 * Describes a single legal rule or constraint
 */
interface Rule {
  description: string;
  citation?: string;
  scope: RuleScope;
  severity?: 'mandatory' | 'recommended' | 'optional';
  effectiveDate?: string;
  expirationDate?: string;
}

/**
 * Describes the set of rules for a single jurisdiction
 */
interface Jurisdiction {
  name: string;
  code: string;
  type: 'state' | 'country' | 'regulation' | 'international';
  rules: Record<RuleCategory, Rule[]>;
  parentJurisdiction?: string;
}

/**
 * Main jurisdiction rules database
 */
export const JURISDICTION_RULES: Record<string, Jurisdiction> = {
  'california': {
    name: 'California, USA',
    code: 'US-CA',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete clauses in employment contracts are strictly void, except in limited sale-of-business contexts.",
          citation: "Cal. Bus. & Prof. Code § 16600",
          scope: 'employment',
          severity: 'mandatory',
          effectiveDate: '1872-01-01'
        },
        {
          description: "Employees must be reimbursed for all necessary business-related expenses.",
          citation: "Cal. Labor Code § 2802",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "At-will employment disclaimer required in offer letters and employment contracts.",
          scope: 'employment',
          severity: 'recommended'
        },
        {
          description: "Non-solicitation clauses are enforceable only if narrowly tailored and do not restrict employee mobility.",
          citation: "Edwards v. Arthur Andersen LLP, 44 Cal. 4th 937 (2008)",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Meal and rest break provisions must comply with strict California requirements.",
          citation: "Cal. Labor Code §§ 512, 226.7",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      privacy: [
        {
          description: "Consumers have the right to know what personal information is being collected and to have it deleted.",
          citation: "California Consumer Privacy Act (CCPA) § 1798.100",
          scope: 'consumer',
          severity: 'mandatory',
          effectiveDate: '2020-01-01'
        },
        {
          description: "Businesses must provide notice of sale or sharing of personal information and offer opt-out mechanisms.",
          citation: "CCPA § 1798.115",
          scope: 'consumer',
          severity: 'mandatory'
        },
        {
          description: "Privacy policies must be updated to include CCPA-required disclosures.",
          citation: "CCPA § 1798.130",
          scope: 'consumer',
          severity: 'mandatory'
        },
        {
          description: "California Privacy Rights Act (CPRA) expands consumer rights including right to correct inaccurate data.",
          citation: "CPRA (amending CCPA)",
          scope: 'consumer',
          severity: 'mandatory',
          effectiveDate: '2023-01-01'
        }
      ],
      consumerProtection: [
        {
          description: "Limitations of liability for consumer contracts may be subject to unconscionability review.",
          citation: "Cal. Civ. Code § 1670.5",
          scope: 'consumer',
          severity: 'recommended'
        },
        {
          description: "Automatic renewal provisions require clear disclosure and easy cancellation mechanisms.",
          citation: "Cal. Bus. & Prof. Code § 17602",
          scope: 'consumer',
          severity: 'mandatory'
        },
        {
          description: "Contracts must be provided in the same language as the sales presentation if in Spanish, Chinese, Korean, Vietnamese, or Tagalog.",
          citation: "Cal. Civ. Code § 1632",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [
        {
          description: "Indemnification clauses in construction contracts cannot require indemnification for the indemnitee's sole negligence.",
          citation: "Cal. Civ. Code § 2782",
          scope: 'b2b',
          severity: 'mandatory'
        }
      ],
      termination: [
        {
          description: "Notice periods for termination should be clearly specified; no statutory requirement for at-will employment.",
          scope: 'employment',
          severity: 'recommended'
        }
      ],
      disputeResolution: [
        {
          description: "Arbitration agreements must comply with specific procedural and substantive fairness requirements.",
          citation: "Armendariz v. Foundation Health Psychcare Services, Inc., 24 Cal. 4th 83 (2000)",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'new-york': {
    name: 'New York, USA',
    code: 'US-NY',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Choice of law provisions selecting non-NY law are disfavored in employment contracts for NY employees.",
          citation: "N.Y. Gen. Oblig. Law § 5-401",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Non-compete agreements must be reasonable in time, geography, and scope to be enforceable.",
          citation: "BDO Seidman v. Hirshberg, 93 N.Y.2d 382 (1999)",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Wage notices must be provided at hiring detailing rate of pay, regular pay day, and employer information.",
          citation: "N.Y. Lab. Law § 195",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      disputeResolution: [
        {
          description: "Mandatory arbitration agreements for sexual harassment claims are prohibited.",
          citation: "N.Y. C.P.L.R. § 7515",
          scope: 'employment',
          severity: 'mandatory',
          effectiveDate: '2018-07-11'
        }
      ],
      privacy: [
        {
          description: "Biometric privacy protections require written consent before collecting biometric data.",
          citation: "N.Y. Gen. Bus. Law § 899-bb",
          scope: 'consumer',
          severity: 'mandatory',
          effectiveDate: '2021-01-08'
        }
      ],
      consumerProtection: [
        {
          description: "Automatic renewal terms must be clearly disclosed and acknowledged by consumers.",
          citation: "N.Y. Gen. Bus. Law § 527",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'texas': {
    name: 'Texas, USA',
    code: 'US-TX',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements are enforceable if ancillary to an otherwise enforceable agreement and contain reasonable time, geographic, and scope limitations.",
          citation: "Tex. Bus. & Com. Code § 15.50",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Texas is an at-will employment state; employment relationships can be terminated at any time without cause.",
          scope: 'employment',
          severity: 'recommended'
        }
      ],
      consumerProtection: [
        {
          description: "Deceptive trade practices are prohibited under the Texas Deceptive Trade Practices-Consumer Protection Act.",
          citation: "Tex. Bus. & Com. Code § 17.41 et seq.",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      privacy: [],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'gdpr': {
    name: 'General Data Protection Regulation (EU)',
    code: 'EU-GDPR',
    type: 'regulation',
    rules: {
      privacy: [
        {
          description: "Data processing requires a lawful basis: consent, contract, legal obligation, vital interests, public task, or legitimate interests.",
          citation: "GDPR Art. 6",
          scope: 'general',
          severity: 'mandatory',
          effectiveDate: '2018-05-25'
        },
        {
          description: "Data subjects have the right to access their personal data and to request its erasure (Right to be Forgotten).",
          citation: "GDPR Art. 15 & 17",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Data breach notification must occur within 72 hours of discovery to supervisory authority.",
          citation: "GDPR Art. 33",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Data Protection Impact Assessments required for high-risk processing activities.",
          citation: "GDPR Art. 35",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Cross-border data transfers require adequate safeguards (e.g., Standard Contractual Clauses, BCRs, adequacy decisions).",
          citation: "GDPR Art. 44-50",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Privacy policies must be written in clear, plain language accessible to data subjects.",
          citation: "GDPR Art. 12",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      dataRetention: [
        {
          description: "Personal data must not be kept longer than necessary for the purposes for which it was collected.",
          citation: "GDPR Art. 5(1)(e)",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      employment: [],
      consumerProtection: [],
      liability: [],
      termination: [],
      disputeResolution: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'united-kingdom': {
    name: 'United Kingdom',
    code: 'GB',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "UK GDPR applies with similar requirements to EU GDPR but under UK law.",
          citation: "UK GDPR (Data Protection Act 2018)",
          scope: 'general',
          severity: 'mandatory',
          effectiveDate: '2021-01-01'
        }
      ],
      employment: [
        {
          description: "Employees have statutory protection against unfair dismissal after qualifying period.",
          citation: "Employment Rights Act 1996",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Restrictive covenants (non-compete, non-solicitation) must be reasonable to protect legitimate business interests.",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Unfair contract terms in consumer contracts may be unenforceable.",
          citation: "Consumer Rights Act 2015",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'delaware': {
    name: 'Delaware, USA',
    code: 'US-DE',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements are generally enforceable if reasonable in scope, duration, and geography.",
          scope: 'employment',
          severity: 'recommended'
        }
      ],
      disputeResolution: [
        {
          description: "Delaware courts are preferred for corporate dispute resolution; choice of Delaware law is generally upheld.",
          scope: 'b2b',
          severity: 'recommended'
        }
      ],
      consumerProtection: [],
      privacy: [],
      liability: [],
      termination: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'united-states': {
    name: 'United States (Federal)',
    code: 'US',
    type: 'country',
    rules: {
      employment: [
        {
          description: "Title VII prohibits employment discrimination based on race, color, religion, sex, or national origin.",
          citation: "42 U.S.C. § 2000e et seq.",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Americans with Disabilities Act requires reasonable accommodations for qualified individuals with disabilities.",
          citation: "42 U.S.C. § 12101 et seq.",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Fair Labor Standards Act establishes minimum wage, overtime pay, and child labor standards.",
          citation: "29 U.S.C. § 201 et seq.",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      'intellectual-property': [
        {
          description: "Works made for hire belong to the employer if created within the scope of employment.",
          citation: "17 U.S.C. § 201(b)",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Patent rights for inventions made by employees may be assigned to employer via agreement.",
          citation: "35 U.S.C. § 261",
          scope: 'employment',
          severity: 'recommended'
        }
      ],
      privacy: [
        {
          description: "HIPAA protects the privacy and security of health information.",
          citation: "Health Insurance Portability and Accountability Act",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Deceptive or unfair business practices are prohibited.",
          citation: "FTC Act § 5, 15 U.S.C. § 45",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [
        {
          description: "Federal Arbitration Act governs arbitration agreements in contracts involving interstate commerce.",
          citation: "9 U.S.C. § 1 et seq.",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      dataRetention: [],
      licensing: [],
      payment: [
        {
          description: "Electronic signatures are legally valid and enforceable.",
          citation: "Electronic Signatures in Global and National Commerce Act (E-SIGN), 15 U.S.C. § 7001",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      warranties: [
        {
          description: "Implied warranties of merchantability and fitness for a particular purpose may apply to sales of goods.",
          citation: "Uniform Commercial Code § 2-314, 2-315",
          scope: 'b2b',
          severity: 'recommended'
        }
      ]
    }
  },

  'canada': {
    name: 'Canada (Federal)',
    code: 'CA',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "Personal Information Protection and Electronic Documents Act (PIPEDA) requires consent for collection, use, and disclosure of personal information.",
          citation: "PIPEDA, S.C. 2000, c. 5",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Organizations must report breaches of security safeguards involving personal information that pose real risk of significant harm.",
          citation: "PIPEDA, s. 10.1",
          scope: 'general',
          severity: 'mandatory',
          effectiveDate: '2018-11-01'
        }
      ],
      employment: [
        {
          description: "Employment standards vary by province; federally regulated employees have specific protections.",
          citation: "Canada Labour Code",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Consumer protection laws prohibit unfair business practices and false advertising.",
          citation: "Competition Act, R.S.C. 1985, c. C-34",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'australia': {
    name: 'Australia',
    code: 'AU',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "Australian Privacy Principles require transparent handling of personal information and individuals' right to access their data.",
          citation: "Privacy Act 1988 (Cth)",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Notifiable data breaches must be reported when likely to result in serious harm.",
          citation: "Privacy Act 1988, Part IIIC",
          scope: 'general',
          severity: 'mandatory',
          effectiveDate: '2018-02-22'
        }
      ],
      employment: [
        {
          description: "Fair Work Act provides minimum employment standards including minimum wage, leave entitlements, and termination notice.",
          citation: "Fair Work Act 2009 (Cth)",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Restraint of trade clauses must be reasonable to protect legitimate business interests.",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Australian Consumer Law prohibits misleading or deceptive conduct and unfair contract terms.",
          citation: "Competition and Consumer Act 2010, Schedule 2",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'singapore': {
    name: 'Singapore',
    code: 'SG',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "Personal Data Protection Act requires organizations to obtain consent before collecting, using, or disclosing personal data.",
          citation: "PDPA 2012",
          scope: 'general',
          severity: 'mandatory'
        },
        {
          description: "Data breach notification required within 3 calendar days if breach affects 500 or more individuals.",
          citation: "PDPA (Amendment) Act 2020",
          scope: 'general',
          severity: 'mandatory',
          effectiveDate: '2021-02-01'
        }
      ],
      employment: [
        {
          description: "Employment Act sets out basic terms and conditions of employment for certain employees.",
          citation: "Employment Act (Cap. 91)",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Consumer Protection (Fair Trading) Act prohibits unfair practices in consumer transactions.",
          citation: "CPFTA (Cap. 52A)",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'germany': {
    name: 'Germany',
    code: 'DE',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "GDPR applies as EU member state, with additional German Federal Data Protection Act provisions.",
          citation: "Bundesdatenschutzgesetz (BDSG)",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      employment: [
        {
          description: "Termination protection laws require just cause for dismissal after probationary period.",
          citation: "Kündigungsschutzgesetz (KSchG)",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Works councils have co-determination rights in certain employment matters.",
          citation: "Betriebsverfassungsgesetz (BetrVG)",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Standard form contracts are subject to control of unfair terms.",
          citation: "Bürgerliches Gesetzbuch (BGB) §§ 305-310",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'france': {
    name: 'France',
    code: 'FR',
    type: 'country',
    rules: {
      privacy: [
        {
          description: "GDPR applies as EU member state, implemented through French Data Protection Act.",
          citation: "Loi Informatique et Libertés",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      employment: [
        {
          description: "French Labour Code provides strong employee protections including termination requirements and collective bargaining rights.",
          citation: "Code du Travail",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Non-compete clauses must be limited in time, geographic scope, and must include financial compensation.",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Consumer Code protects consumers against unfair contract terms and practices.",
          citation: "Code de la Consommation",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'florida': {
    name: 'Florida, USA',
    code: 'US-FL',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements are enforceable if they protect legitimate business interests.",
          citation: "Fla. Stat. § 542.335",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "At-will employment is the default; either party can terminate employment at any time without cause.",
          scope: 'employment',
          severity: 'recommended'
        }
      ],
      privacy: [
        {
          description: "Florida Information Protection Act requires notification of security breaches affecting personal information.",
          citation: "Fla. Stat. § 501.171",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [
        {
          description: "Florida Deceptive and Unfair Trade Practices Act prohibits unfair methods of competition and deceptive acts.",
          citation: "Fla. Stat. § 501.204",
          scope: 'consumer',
          severity: 'mandatory'
        }
      ],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'washington': {
    name: 'Washington, USA',
    code: 'US-WA',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements for employees earning less than $100,000 annually are void (threshold adjusted for inflation).",
          citation: "RCW 49.62.020",
          scope: 'employment',
          severity: 'mandatory',
          effectiveDate: '2020-01-01'
        },
        {
          description: "Non-compete agreements must be disclosed in writing before acceptance of employment offer.",
          citation: "RCW 49.62.060",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      privacy: [
        {
          description: "My Health My Data Act provides comprehensive health data privacy protections.",
          citation: "RCW 19.373",
          scope: 'consumer',
          severity: 'mandatory',
          effectiveDate: '2024-03-31'
        }
      ],
      consumerProtection: [],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'massachusetts': {
    name: 'Massachusetts, USA',
    code: 'US-MA',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements must be supported by fair and reasonable consideration and are limited to 12 months post-employment.",
          citation: "M.G.L. c. 149, § 24L",
          scope: 'employment',
          severity: 'mandatory',
          effectiveDate: '2018-10-01'
        },
        {
          description: "Non-compete agreements must be provided to employee with formal offer or 10 business days before employment begins.",
          citation: "M.G.L. c. 149, § 24L",
          scope: 'employment',
          severity: 'mandatory'
        },
        {
          description: "Garden leave or other mutually agreed consideration required during non-compete period.",
          citation: "M.G.L. c. 149, § 24L",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      privacy: [],
      consumerProtection: [],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  },

  'illinois': {
    name: 'Illinois, USA',
    code: 'US-IL',
    type: 'state',
    parentJurisdiction: 'united-states',
    rules: {
      employment: [
        {
          description: "Non-compete agreements are subject to reasonableness standards and must protect legitimate business interests.",
          scope: 'employment',
          severity: 'mandatory'
        }
      ],
      privacy: [
        {
          description: "Biometric Information Privacy Act requires written consent and disclosure before collecting biometric identifiers.",
          citation: "740 ILCS 14/",
          scope: 'consumer',
          severity: 'mandatory',
          effectiveDate: '2008-10-03'
        },
        {
          description: "Biometric data must be destroyed within 3 years of last interaction (employees) or 1 year (others).",
          citation: "740 ILCS 14/15",
          scope: 'general',
          severity: 'mandatory'
        }
      ],
      consumerProtection: [],
      liability: [],
      termination: [],
      disputeResolution: [],
      dataRetention: [],
      licensing: [],
      'intellectual-property': [],
      payment: [],
      warranties: []
    }
  }
};

/**
 * Retrieves all rules for a given jurisdiction.
 * @param jurisdictionKey - The key for the jurisdiction (e.g., 'california').
 * @returns A Jurisdiction object or undefined if not found.
 */
export function getJurisdictionRules(jurisdictionKey: string): Jurisdiction | undefined {
  return JURISDICTION_RULES[jurisdictionKey];
}

/**
 * Gets all rules of a specific category for a jurisdiction.
 * @param jurisdictionKey - The key for the jurisdiction.
 * @param category - The category of rules to retrieve.
 * @returns An array of rules for that category.
 */
export function getRulesByCategory(
  jurisdictionKey: string,
  category: RuleCategory
): Rule[] {
  const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
  return jurisdiction?.rules[category] || [];
}

/**
 * Gets all mandatory rules for a jurisdiction (flattened across all categories).
 * @param jurisdictionKey - The key for the jurisdiction.
 * @returns An array of all mandatory rules.
 */
export function getMandatoryRules(jurisdictionKey: string): Rule[] {
  const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
  if (!jurisdiction || !jurisdiction.rules) return [];

  const allRules: Rule[] = [];
  
  (Object.keys(jurisdiction.rules) as RuleCategory[]).forEach(category => {
    const categoryRules = jurisdiction.rules[category];
    if (categoryRules) {
        allRules.push(...categoryRules.filter(rule => rule.severity === 'mandatory'));
    }
  });

  return allRules;
}

/**
 * Gets applicable rules considering jurisdiction hierarchy.
 * E.g., California would include both CA and US federal rules.
 * @param jurisdictionKey - The key for the jurisdiction.
 * @returns An array of all applicable rules including inherited ones.
 */
export function getInheritedRules(jurisdictionKey: string): Rule[] {
  const rules: Rule[] = [];
  let currentKey: string | undefined = jurisdictionKey;

  while (currentKey) {
    // FIX: Added the explicit type here to resolve the error.
    const jurisdiction: Jurisdiction | undefined = JURISDICTION_RULES[currentKey];
    
    if (!jurisdiction || !jurisdiction.rules) break;

    for (const category in jurisdiction.rules) {
      if (Object.prototype.hasOwnProperty.call(jurisdiction.rules, category)) {
        const categoryRules = jurisdiction.rules[category as RuleCategory];
        if (categoryRules) {
          rules.push(...categoryRules);
        }
      }
    }

    currentKey = jurisdiction.parentJurisdiction;
  }

  return rules;
}

/**
 * Searches for rules containing specific keywords.
 * @param jurisdictionKey - The key for the jurisdiction.
 * @param searchTerm - The term to search for in rule descriptions and citations.
 * @returns An array of matching rules.
 */
export function searchRules(
    jurisdictionKey: string,
    searchTerm: string
  ): Rule[] {
    const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
    if (!jurisdiction || !jurisdiction.rules) return [];
  
    const results: Rule[] = [];
    const term = searchTerm.toLowerCase();
  
    // FIX: Switched to Object.keys for type safety
    (Object.keys(jurisdiction.rules) as RuleCategory[]).forEach(category => {
      const categoryRules = jurisdiction.rules[category];
      if (categoryRules) {
        categoryRules.forEach(rule => {
          if (
            rule.description.toLowerCase().includes(term) ||
            rule.citation?.toLowerCase().includes(term)
          ) {
            results.push(rule);
          }
        });
      }
    });
  
    return results;
}
  
  /**
   * Gets all available jurisdiction keys.
   * @returns An array of all jurisdiction identifiers.
   */
  export function getAvailableJurisdictions(): string[] {
    return Object.keys(JURISDICTION_RULES);
  }
  
  /**
   * Gets all available jurisdictions with their metadata.
   * @returns An array of objects containing jurisdiction keys and names.
   */
 export function getJurisdictionList(): Array<{ key: string; name: string; code: string; type: string }> {
  return Object.entries(JURISDICTION_RULES).map(([key, jurisdiction]: [string, Jurisdiction]) => ({
    key,
    name: jurisdiction.name,
    code: jurisdiction.code,
    type: jurisdiction.type
  }));
}
  
  /**
   * Validates if a jurisdiction exists in the database.
   * @param jurisdictionKey - The key to validate.
   * @returns True if the jurisdiction exists.
   */
  export function isValidJurisdiction(jurisdictionKey: string): boolean {
    return jurisdictionKey in JURISDICTION_RULES;
  }
  
  /**
   * Gets all rules across all categories for a jurisdiction.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @returns A flattened array of all rules.
   */
export function getAllRules(jurisdictionKey: string): Rule[] {
  const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
  if (!jurisdiction || !jurisdiction.rules) return [];

  const allRules: Rule[] = [];

  // FIX: Switched to Object.keys for type safety
  (Object.keys(jurisdiction.rules) as RuleCategory[]).forEach(category => {
    const categoryRules = jurisdiction.rules[category];
    if (categoryRules) {
      allRules.push(...categoryRules);
    }
  });

  return allRules;
}
  
  /**
   * Gets rules by scope across all categories.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param scope - The scope to filter by.
   * @returns An array of rules matching the specified scope.
   */
  export function getRulesByScope(
    jurisdictionKey: string,
    scope: RuleScope
  ): Rule[] {
    const allRules = getAllRules(jurisdictionKey);
    return allRules.filter(rule => rule.scope === scope);
  }
  
  /**
   * Gets rules by severity level.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param severity - The severity level to filter by.
   * @returns An array of rules matching the specified severity.
   */
  export function getRulesBySeverity(
    jurisdictionKey: string,
    severity: 'mandatory' | 'recommended' | 'optional'
  ): Rule[] {
    const allRules = getAllRules(jurisdictionKey);
    return allRules.filter(rule => rule.severity === severity);
  }
  
  /**
   * Gets currently active rules (considering effective and expiration dates).
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param asOfDate - The date to check against (defaults to today).
   * @returns An array of currently active rules.
   */
  export function getActiveRules(
    jurisdictionKey: string,
    asOfDate: Date = new Date()
  ): Rule[] {
    const allRules = getAllRules(jurisdictionKey);
    const dateString = asOfDate.toISOString().split('T')[0];
  
    return allRules.filter(rule => {
      const isEffective = !rule.effectiveDate || rule.effectiveDate <= dateString;
      const notExpired = !rule.expirationDate || rule.expirationDate > dateString;
      return isEffective && notExpired;
    });
  }
  
  /**
   * Gets the parent jurisdiction of a given jurisdiction.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @returns The parent jurisdiction object or undefined.
   */
  export function getParentJurisdiction(jurisdictionKey: string): Jurisdiction | undefined {
    const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
    if (!jurisdiction?.parentJurisdiction) return undefined;
    
    return JURISDICTION_RULES[jurisdiction.parentJurisdiction];
  }
  
  /**
   * Gets all child jurisdictions of a given jurisdiction.
   * @param jurisdictionKey - The key for the parent jurisdiction.
   * @returns An array of child jurisdiction keys.
   */
  export function getChildJurisdictions(jurisdictionKey: string): string[] {
  return Object.entries(JURISDICTION_RULES)
    .filter(([_key, jurisdiction]: [string, Jurisdiction]) => jurisdiction.parentJurisdiction === jurisdictionKey)
    .map(([key, _]) => key);
}
  
  /**
   * Compares rules between two jurisdictions.
   * @param jurisdiction1 - First jurisdiction key.
   * @param jurisdiction2 - Second jurisdiction key.
   * @param category - Optional category to limit comparison.
   * @returns An object with rules unique to each jurisdiction and common rules.
   */
  export function compareJurisdictions(
    jurisdiction1: string,
    jurisdiction2: string,
    category?: RuleCategory
  ): {
    uniqueTo1: Rule[];
    uniqueTo2: Rule[];
    common: Rule[];
  } {
    const rules1 = category 
      ? getRulesByCategory(jurisdiction1, category)
      : getAllRules(jurisdiction1);
    
    const rules2 = category
      ? getRulesByCategory(jurisdiction2, category)
      : getAllRules(jurisdiction2);
  
    const uniqueTo1: Rule[] = [];
    const uniqueTo2: Rule[] = [];
    const common: Rule[] = [];
  
    rules1.forEach(rule1 => {
      const foundInRules2 = rules2.some(rule2 => 
        rule2.description === rule1.description && rule2.citation === rule1.citation
      );
      if (foundInRules2) {
        common.push(rule1);
      } else {
        uniqueTo1.push(rule1);
      }
    });
  
    rules2.forEach(rule2 => {
      const foundInRules1 = rules1.some(rule1 => 
        rule1.description === rule2.description && rule1.citation === rule2.citation
      );
      if (!foundInRules1) {
        uniqueTo2.push(rule2);
      }
    });
  
    return { uniqueTo1, uniqueTo2, common };
  }
  
  /**
   * Gets a summary of rule counts by category for a jurisdiction.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @returns An object with category names and rule counts.
   */
  export function getRuleSummary(jurisdictionKey: string): Record<RuleCategory, number> {
    const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
    if (!jurisdiction) {
      return {} as Record<RuleCategory, number>;
    }
  
    const summary = {} as Record<RuleCategory, number>;
    
    (Object.keys(jurisdiction.rules) as RuleCategory[]).forEach(category => {
      summary[category] = jurisdiction.rules[category].length;
    });
  
    return summary;
  }
  
  /**
   * Gets rules that have citations (are based on specific laws).
   * @param jurisdictionKey - The key for the jurisdiction.
   * @returns An array of rules with citations.
   */
  export function getCitedRules(jurisdictionKey: string): Rule[] {
    const allRules = getAllRules(jurisdictionKey);
    return allRules.filter(rule => rule.citation !== undefined);
  }
  
  /**
   * Formats rules for AI prompt injection.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param options - Formatting options.
   * @returns A formatted string ready for AI prompts.
   */
  export function formatRulesForAI(
    jurisdictionKey: string,
    options: {
      includeSeverity?: boolean;
      includeCitations?: boolean;
      includeScope?: boolean;
      categoriesOnly?: RuleCategory[];
      severityFilter?: 'mandatory' | 'recommended' | 'optional';
    } = {}
  ): string {
    const {
      includeSeverity = true,
      includeCitations = true,
      includeScope = false,
      categoriesOnly,
      severityFilter
    } = options;
  
    const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
    if (!jurisdiction) return '';
  
    let output = `# Legal Rules for ${jurisdiction.name}\n\n`;
  
    const categoriesToProcess = categoriesOnly || (Object.keys(jurisdiction.rules) as RuleCategory[]);
  
    categoriesToProcess.forEach(category => {
      const rules = jurisdiction.rules[category];
      if (!rules || rules.length === 0) return;
  
      const filteredRules = severityFilter
        ? rules.filter(rule => rule.severity === severityFilter)
        : rules;
  
      if (filteredRules.length === 0) return;
  
      output += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
  
      filteredRules.forEach((rule, index) => {
        output += `${index + 1}. ${rule.description}`;
        
        if (includeCitations && rule.citation) {
          output += ` [${rule.citation}]`;
        }
        
        if (includeSeverity && rule.severity) {
          output += ` (${rule.severity})`;
        }
        
        if (includeScope) {
          output += ` [Scope: ${rule.scope}]`;
        }
        
        output += '\n';
      });
  
      output += '\n';
    });
  
    return output;
  }
  
  /**
   * Validates a contract type against jurisdiction rules.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param contractType - The type of contract (maps to RuleScope).
   * @returns Applicable mandatory rules for that contract type.
   */
  export function getContractTypeRules(
    jurisdictionKey: string,
    contractType: 'employment' | 'consumer' | 'b2b' | 'general' | 'real-estate' | 'ip'
  ): Rule[] {
    const allRules = getAllRules(jurisdictionKey);
    return allRules.filter(rule => 
      rule.scope === contractType && rule.severity === 'mandatory'
    );
  }
  
  /**
   * Gets a compliance checklist for a jurisdiction.
   * @param jurisdictionKey - The key for the jurisdiction.
   * @param includeInherited - Whether to include rules from parent jurisdictions.
   * @returns An array of mandatory rules formatted as checklist items.
   */
  export function getComplianceChecklist(
    jurisdictionKey: string,
    includeInherited: boolean = true
  ): Array<{ category: string; rule: string; citation?: string }> {
    const rules = includeInherited 
      ? getInheritedRules(jurisdictionKey)
      : getAllRules(jurisdictionKey);
  
    const mandatoryRules = rules.filter(rule => rule.severity === 'mandatory');
  
    const jurisdiction = JURISDICTION_RULES[jurisdictionKey];
    if (!jurisdiction) return [];
  
    const checklist: Array<{ category: string; rule: string; citation?: string }> = [];
  
    (Object.keys(jurisdiction.rules) as RuleCategory[]).forEach(category => {
      jurisdiction.rules[category].forEach(rule => {
        if (rule.severity === 'mandatory') {
          checklist.push({
            category,
            rule: rule.description,
            citation: rule.citation
          });
        }
      });
    });
  
    return checklist;
  }
  
  // Export types for use in other files
  export type { 
    Rule, 
    Jurisdiction, 
    RuleScope, 
    RuleCategory 
  };
  
  // Export a list of all supported scopes and categories for validation
  export const SUPPORTED_SCOPES: RuleScope[] = [
    'employment', 
    'consumer', 
    'b2b', 
    'general', 
    'real-estate', 
    'ip'
  ];
  
  export const SUPPORTED_CATEGORIES: RuleCategory[] = [
    'employment',
    'privacy',
    'consumerProtection',
    'liability',
    'termination',
    'disputeResolution',
    'dataRetention',
    'licensing',
    'intellectual-property',
    'payment',
    'warranties'
  ];