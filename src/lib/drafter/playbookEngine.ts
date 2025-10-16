// playbookEngine.ts

/**
 * Represents a playbook that guides AI document generation
 */
export interface Playbook {
    id: string;
    name: string;
    description: string;
    category?: 'general' | 'industry-specific' | 'regional' | 'custom';
    rules: Record<string, string>;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  /**
   * Default playbooks available in the system
   */
  export const PLAYBOOKS: Playbook[] = [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard legal best practices applicable to most contracts',
      category: 'general',
      rules: {
        governingLaw: 'Include governing law clause',
        disputeResolution: 'Include dispute resolution mechanism',
        termination: 'Define clear termination conditions',
        notices: 'Specify how notices should be delivered',
        amendments: 'Require written amendments signed by both parties',
        severability: 'Include severability clause',
        entireAgreement: 'Include entire agreement clause',
      },
      tags: ['general', 'standard', 'best-practices'],
    },
    {
      id: 'tech-startup',
      name: 'Tech Startup',
      description: 'Optimized for technology companies and startups',
      category: 'industry-specific',
      rules: {
        governingLaw: 'Delaware or California law preferred',
        ipOwnership: 'Company owns all work product and intellectual property',
        liabilityCap: 'Cap liability at contract value or 12 months of fees',
        confidentiality: 'Strong confidentiality and NDA provisions',
        dataProtection: 'Include GDPR and CCPA compliance clauses',
        indemnification: 'Mutual indemnification with carve-outs for IP infringement',
        disputeResolution: 'Arbitration in San Francisco or Delaware',
        terminationForConvenience: 'Allow termination with 30 days notice',
      },
      tags: ['technology', 'startup', 'software', 'saas'],
    },
    {
      id: 'enterprise-saas',
      name: 'Enterprise SaaS',
      description: 'For enterprise software-as-a-service agreements',
      category: 'industry-specific',
      rules: {
        governingLaw: 'Customer location or Delaware',
        serviceLevel: 'Include SLA with 99.9% uptime guarantee',
        dataProtection: 'Comprehensive data processing and privacy terms',
        security: 'SOC 2 Type II compliance and security standards',
        liabilityCap: 'Cap at 12 months fees, uncapped for data breaches',
        ipOwnership: 'Provider owns platform, customer owns their data',
        termination: 'Allow termination for cause with cure period',
        renewalTerms: 'Auto-renewal with opt-out notice period',
        auditRights: 'Customer audit rights for security and compliance',
      },
      tags: ['saas', 'enterprise', 'software', 'subscription'],
    },
    {
      id: 'freelance-services',
      name: 'Freelance Services',
      description: 'For independent contractors and freelancers',
      category: 'general',
      rules: {
        scopeOfWork: 'Clearly define deliverables and milestones',
        payment: 'Specify payment terms, schedule, and method',
        ipOwnership: 'Transfer IP rights upon full payment',
        revisions: 'Limit number of revision rounds',
        expenses: 'Define which expenses are reimbursable',
        termination: 'Either party may terminate with notice',
        independentContractor: 'Clarify independent contractor relationship',
        liabilityCap: 'Cap liability at project fee',
      },
      tags: ['freelance', 'contractor', 'services', 'consulting'],
    },
    {
      id: 'employment',
      name: 'Employment Agreement',
      description: 'Standard employment contract terms',
      category: 'general',
      rules: {
        atWill: 'Include at-will employment disclaimer (where applicable)',
        compensation: 'Define salary, bonuses, and benefits',
        duties: 'Describe job responsibilities and reporting structure',
        workingHours: 'Specify standard working hours and overtime policy',
        confidentiality: 'Protect company confidential information',
        ipAssignment: 'Employee assigns work-related IP to company',
        nonCompete: 'Include reasonable non-compete (where enforceable)',
        termination: 'Define notice periods and severance terms',
        disputeResolution: 'Specify arbitration or mediation process',
      },
      tags: ['employment', 'hr', 'full-time'],
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Mutual or one-way NDA templates',
      category: 'general',
      rules: {
        confidentialityScope: 'Define what constitutes confidential information',
        exclusions: 'List standard exclusions (public info, independently developed)',
        term: 'Confidentiality obligations survive for 2-5 years',
        useRestriction: 'Limit use to business purpose only',
        returnOfInfo: 'Require return or destruction of confidential materials',
        noLicense: 'Clarify that no license or rights are granted',
        remedies: 'Equitable relief available for breaches',
        governingLaw: 'Specify applicable jurisdiction',
      },
      tags: ['nda', 'confidentiality', 'protection'],
    },
    {
      id: 'consulting',
      name: 'Consulting Agreement',
      description: 'Professional consulting services',
      category: 'general',
      rules: {
        scopeOfServices: 'Define consulting services and deliverables',
        fees: 'Specify hourly rate or project fee',
        expenses: 'Define reimbursable expenses with approval process',
        term: 'Initial term with renewal options',
        independentContractor: 'Confirm independent contractor status',
        ipOwnership: 'Client owns work product created during engagement',
        confidentiality: 'Protect client confidential information',
        liabilityCap: 'Cap liability at fees paid in last 6 months',
        termination: 'Either party may terminate with 30 days notice',
      },
      tags: ['consulting', 'professional-services', 'advisory'],
    },
    {
      id: 'vendor-agreement',
      name: 'Vendor/Supplier Agreement',
      description: 'For purchasing goods or services from vendors',
      category: 'general',
      rules: {
        scopeOfSupply: 'Define products or services to be supplied',
        pricing: 'Specify pricing, payment terms, and price adjustments',
        deliveryTerms: 'Define delivery schedule, location, and acceptance criteria',
        qualityStandards: 'Specify quality requirements and inspection rights',
        warranties: 'Include product warranties and service level commitments',
        indemnification: 'Vendor indemnifies for product defects and IP infringement',
        terminationRights: 'Termination for material breach or insolvency',
        liabilityCap: 'Cap at purchase price or 12 months of payments',
        disputeResolution: 'Escalation process followed by arbitration',
      },
      tags: ['vendor', 'supplier', 'procurement', 'purchasing'],
    },
    {
      id: 'partnership',
      name: 'Partnership Agreement',
      description: 'For business partnerships and joint ventures',
      category: 'general',
      rules: {
        partnerContributions: 'Define capital contributions and ownership percentages',
        profitSharing: 'Specify how profits and losses are distributed',
        managementRoles: 'Define decision-making authority and voting rights',
        restrictionsOnTransfer: 'Include right of first refusal for ownership transfers',
        addingPartners: 'Require unanimous consent for new partners',
        disputeResolution: 'Mediation followed by arbitration',
        dissolution: 'Define dissolution triggers and wind-down process',
        nonCompete: 'Partners may not compete during partnership',
        buyoutProvisions: 'Define buy-out terms if partner exits',
      },
      tags: ['partnership', 'joint-venture', 'business'],
    },
    {
      id: 'license-agreement',
      name: 'Software License Agreement',
      description: 'For licensing software products',
      category: 'industry-specific',
      rules: {
        grantOfLicense: 'Define license scope (perpetual vs subscription, users, locations)',
        restrictions: 'Prohibit reverse engineering, modification, and redistribution',
        fees: 'Specify license fees and payment terms',
        support: 'Define support and maintenance terms',
        updates: 'Specify rights to updates and upgrades',
        warranties: 'Limited warranty with disclaimer of other warranties',
        liabilityCap: 'Cap at license fees paid',
        termination: 'Terminate for breach or non-payment',
        dataProtection: 'Include privacy and data security terms',
      },
      tags: ['software', 'licensing', 'intellectual-property'],
    },
    {
      id: 'real-estate-lease',
      name: 'Commercial Lease',
      description: 'Commercial real estate lease agreement',
      category: 'industry-specific',
      rules: {
        premises: 'Clearly describe the leased premises',
        term: 'Define lease term and renewal options',
        rent: 'Specify base rent, escalations, and additional charges',
        use: 'Define permitted use of premises',
        maintenance: 'Allocate maintenance and repair responsibilities',
        utilities: 'Specify who pays for utilities and services',
        insurance: 'Require tenant insurance and define landlord coverage',
        default: 'Define events of default and remedies',
        termination: 'Include early termination provisions if applicable',
      },
      tags: ['real-estate', 'lease', 'commercial'],
    },
    {
      id: 'agency-agreement',
      name: 'Agency/Reseller Agreement',
      description: 'For sales agents and resellers',
      category: 'general',
      rules: {
        territory: 'Define geographic territory and exclusivity',
        products: 'Specify products/services covered',
        commissions: 'Define commission structure and payment terms',
        targets: 'Set sales targets and performance metrics',
        marketing: 'Allocate marketing responsibilities and costs',
        customerOwnership: 'Define who owns customer relationships',
        termination: 'Notice period and post-termination obligations',
        nonCompete: 'Reasonable non-compete during and after term',
        indemnification: "Agent indemnifies for unauthorized representations",
      },
      tags: ['agency', 'reseller', 'sales', 'distribution'],
    },
    {
      id: 'subscription',
      name: 'Subscription Agreement',
      description: 'For recurring subscription services',
      category: 'general',
      rules: {
        subscriptionTerm: 'Define initial term and auto-renewal',
        fees: 'Specify subscription fees and payment frequency',
        servicesIncluded: 'Detail what services are included in subscription',
        userAccounts: 'Define number of user accounts and access rights',
        cancellation: 'Allow cancellation with notice, define refund policy',
        priceChanges: 'Give advance notice of price increases',
        suspension: 'Right to suspend for non-payment',
        dataRetention: 'Define what happens to customer data upon cancellation',
        freeTrial: 'Include free trial terms if applicable',
      },
      tags: ['subscription', 'recurring', 'saas'],
    },
    {
      id: 'privacy-focused',
      name: 'Privacy-First',
      description: 'Emphasizes data privacy and compliance',
      category: 'regional',
      rules: {
        dataMinimization: 'Collect only necessary personal data',
        consentRequirements: 'Obtain explicit consent for data processing',
        rightToDelete: 'Honor data deletion requests within 30 days',
        dataPortability: 'Provide data in machine-readable format upon request',
        breachNotification: 'Notify affected parties within 72 hours of breach',
        dataProcessing: 'Use data only for specified purposes',
        thirdPartySharing: 'Disclose all third-party data sharing',
        crossBorderTransfers: 'Use appropriate safeguards for international transfers',
        dpo: 'Designate Data Protection Officer if required',
      },
      tags: ['privacy', 'gdpr', 'ccpa', 'compliance'],
    },
    {
      id: 'api-terms',
      name: 'API Terms of Service',
      description: 'For API access and integration',
      category: 'industry-specific',
      rules: {
        apiAccess: 'Define API access levels and authentication',
        rateLimits: 'Specify rate limits and throttling policies',
        restrictions: 'Prohibit misuse, reverse engineering, and excessive calls',
        dataUsage: 'Define how API data may be used and stored',
        availability: 'Include SLA or disclaimer of availability guarantees',
        changes: 'Reserve right to modify or deprecate API endpoints',
        fees: 'Specify any usage-based fees or free tier limits',
        termination: 'Right to suspend API access for violations',
        attribution: 'Require attribution or branding if applicable',
      },
      tags: ['api', 'integration', 'developer', 'technology'],
    },
    {
      id: 'marketplace-seller',
      name: 'Marketplace Seller Agreement',
      description: 'For sellers on online marketplaces',
      category: 'industry-specific',
      rules: {
        listingRequirements: 'Define product listing standards and prohibited items',
        commissionFees: 'Specify marketplace commission and fee structure',
        paymentTerms: 'Define payout schedule and payment methods',
        fulfillment: 'Allocate shipping and fulfillment responsibilities',
        returns: 'Define return and refund policies',
        qualityStandards: 'Require products to meet quality standards',
        customerSupport: 'Allocate customer service responsibilities',
        suspensionTerms: 'Right to suspend for policy violations',
        intellectualProperty: 'Seller warrants they own or have rights to sell products',
      },
      tags: ['marketplace', 'ecommerce', 'seller', 'platform'],
    },
  ];
  
  /**
   * Retrieves all available playbooks.
   * @returns An array of all playbook objects.
   */
  export const getAllPlaybooks = (): Playbook[] => {
    return PLAYBOOKS;
  };
  
  /**
   * Finds a single playbook by its unique ID.
   * @param id - The ID of the playbook to find.
   * @returns The playbook object or undefined if not found.
   */
  export const getPlaybookById = (id: string): Playbook | undefined => {
    return PLAYBOOKS.find(p => p.id === id);
  };
  
  /**
   * Gets playbooks filtered by category.
   * @param category - The category to filter by.
   * @returns An array of playbooks in that category.
   */
  export const getPlaybooksByCategory = (
    category: 'general' | 'industry-specific' | 'regional' | 'custom'
  ): Playbook[] => {
    return PLAYBOOKS.filter(p => p.category === category);
  };
  
  /**
   * Searches playbooks by name, description, or tags.
   * @param searchTerm - The term to search for.
   * @returns An array of matching playbooks.
   */
  export const searchPlaybooks = (searchTerm: string): Playbook[] => {
    const term = searchTerm.toLowerCase();
    return PLAYBOOKS.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  };
  
  /**
 * Translates a playbook's rules into a string prompt for the AI.
 * @param playbookId - The ID of the playbook to use.
 * @returns A formatted string of instructions for the AI, or an empty string if not found.
 */
export const buildPlaybookPrompt = (playbookId: string): string => {
    const playbook = getPlaybookById(playbookId);
  
    if (!playbook) {
      return ""; // Return empty string if no playbook is found
    }
  
    // Convert the rules object into a formatted list
    const rulesList = Object.entries(playbook.rules)
      .map(([key, value]) => `- ${value}`)
      .join('\n');
  
    // Return the final, formatted prompt segment
    return `
  You MUST strictly adhere to the following internal rules from the "${playbook.name}" playbook:
  
  ${rulesList}
  
  These rules are mandatory and must be reflected in the generated contract.
    `.trim();
  };
  
  /**
   * Builds a detailed prompt with additional context for the AI.
   * @param playbookId - The ID of the playbook to use.
   * @param options - Additional options for prompt generation.
   * @returns A comprehensive formatted prompt string.
   */
  export const buildDetailedPlaybookPrompt = (
    playbookId: string,
    options: {
      includeDescription?: boolean;
      includeRuleKeys?: boolean;
      customPrefix?: string;
    } = {}
  ): string => {
    const playbook = getPlaybookById(playbookId);
  
    if (!playbook) {
      return "";
    }
  
    const {
      includeDescription = true,
      includeRuleKeys = false,
      customPrefix = "Contract Drafting Guidelines"
    } = options;
  
    let prompt = `# ${customPrefix}: ${playbook.name}\n\n`;
  
    if (includeDescription) {
      prompt += `**Description**: ${playbook.description}\n\n`;
    }
  
    prompt += `## Mandatory Rules\n\n`;
  
    const rulesList = Object.entries(playbook.rules)
      .map(([key, value]) => {
        if (includeRuleKeys) {
          return `- **${formatRuleKey(key)}**: ${value}`;
        }
        return `- ${value}`;
      })
      .join('\n');
  
    prompt += rulesList;
    prompt += '\n\n**Important**: All these rules must be incorporated into the contract.';
  
    return prompt;
  };
  
  /**
   * Formats a camelCase rule key into a readable title.
   * @param key - The rule key in camelCase.
   * @returns A formatted, human-readable string.
   */
  const formatRuleKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };
  
  /**
   * Gets all unique tags from all playbooks.
   * @returns An array of unique tags.
   */
  export const getAllTags = (): string[] => {
    const allTags = PLAYBOOKS.flatMap(p => p.tags || []);
    const uniqueTags = new Set(allTags);
    return Array.from(uniqueTags).sort();
  };
  
  /**
   * Gets playbooks that contain a specific tag.
   * @param tag - The tag to filter by.
   * @returns An array of playbooks with that tag.
   */
  export const getPlaybooksByTag = (tag: string): Playbook[] => {
    return PLAYBOOKS.filter(p => p.tags?.includes(tag));
  };
  
  /**
   * Validates if a playbook exists.
   * @param playbookId - The ID to validate.
   * @returns True if the playbook exists.
   */
  export const isValidPlaybook = (playbookId: string): boolean => {
    return PLAYBOOKS.some(p => p.id === playbookId);
  };
  
  /**
   * Gets a list of all playbook IDs and names for selection UI.
   * @returns An array of objects with id and name.
   */
  export const getPlaybookOptions = (): Array<{ id: string; name: string; description: string }> => {
    return PLAYBOOKS.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description
    }));
  };
  
  /**
   * Compares two playbooks and returns their differences.
   * @param playbookId1 - First playbook ID.
   * @param playbookId2 - Second playbook ID.
   * @returns An object describing the differences.
   */
  export const comparePlaybooks = (
    playbookId1: string,
    playbookId2: string
  ): {
    uniqueToFirst: Record<string, string>;
    uniqueToSecond: Record<string, string>;
    common: Record<string, string>;
    different: Record<string, { first: string; second: string }>;
  } | null => {
    const playbook1 = getPlaybookById(playbookId1);
    const playbook2 = getPlaybookById(playbookId2);
  
    if (!playbook1 || !playbook2) {
      return null;
    }
  
    const uniqueToFirst: Record<string, string> = {};
    const uniqueToSecond: Record<string, string> = {};
    const common: Record<string, string> = {};
    const different: Record<string, { first: string; second: string }> = {};
  
    // Check rules in first playbook
    Object.entries(playbook1.rules).forEach(([key, value]) => {
      if (!(key in playbook2.rules)) {
        uniqueToFirst[key] = value;
      } else if (playbook2.rules[key] === value) {
        common[key] = value;
      } else {
        different[key] = {
          first: value,
          second: playbook2.rules[key]
        };
      }
    });
  
    // Check for rules only in second playbook
    Object.entries(playbook2.rules).forEach(([key, value]) => {
      if (!(key in playbook1.rules)) {
        uniqueToSecond[key] = value;
      }
    });
  
    return { uniqueToFirst, uniqueToSecond, common, different };
  };
  
  /**
   * Merges multiple playbooks into a combined set of rules.
   * Later playbooks override earlier ones for conflicting rules.
   * @param playbookIds - Array of playbook IDs to merge.
   * @returns A merged playbook object.
   */
  export const mergePlaybooks = (playbookIds: string[]): Playbook | null => {
    if (playbookIds.length === 0) return null;
  
    const playbooks = playbookIds
      .map(id => getPlaybookById(id))
      .filter((p): p is Playbook => p !== undefined);
  
    if (playbooks.length === 0) return null;
  
    const mergedRules: Record<string, string> = {};
    const allTags: string[] = [];
  
    playbooks.forEach(playbook => {
      Object.assign(mergedRules, playbook.rules);
      if (playbook.tags) {
        allTags.push(...playbook.tags);
      }
    });
  
    const uniqueTags = new Set(allTags);
  
    return {
      id: `merged-${playbookIds.join('-')}`,
      name: `Merged: ${playbooks.map(p => p.name).join(' + ')}`,
      description: `Combined rules from: ${playbooks.map(p => p.name).join(', ')}`,
      category: 'custom',
      rules: mergedRules,
      tags: Array.from(uniqueTags),
    };
  };
  
  /**
   * Creates a custom playbook.
   * @param playbookData - The playbook data to create.
   * @returns The created playbook.
   */
  export const createCustomPlaybook = (
    playbookData: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>
  ): Playbook => {
    const now = new Date().toISOString();
    const customPlaybook: Playbook = {
      ...playbookData,
      id: `custom-${Date.now()}`,
      category: playbookData.category || 'custom',
      createdAt: now,
      updatedAt: now,
    };
  
    return customPlaybook;
  };
  
  /**
   * Exports a playbook to JSON format.
   * @param playbookId - The ID of the playbook to export.
   * @returns JSON string of the playbook or null if not found.
   */
  export const exportPlaybook = (playbookId: string): string | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
    
    return JSON.stringify(playbook, null, 2);
  };
  
  /**
   * Imports a playbook from JSON string.
   * @param jsonString - JSON string representing a playbook.
   * @returns The imported playbook or null if invalid.
   */
  export const importPlaybook = (jsonString: string): Playbook | null => {
    try {
      const playbook = JSON.parse(jsonString) as Playbook;
      
      // Validate required fields
      if (!playbook.id || !playbook.name || !playbook.rules) {
        return null;
      }
  
      return playbook;
    } catch (error) {
      console.error('Failed to import playbook:', error);
      return null;
    }
  };
  
  /**
   * Gets a summary of all playbooks with rule counts.
   * @returns An array of playbook summaries.
   */
  export const getPlaybookSummaries = (): Array<{
    id: string;
    name: string;
    description: string;
    ruleCount: number;
    category?: string;
    tags?: string[];
  }> => {
    return PLAYBOOKS.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      ruleCount: Object.keys(p.rules).length,
      category: p.category,
      tags: p.tags,
    }));
  };
  
  /**
   * Generates a checklist from a playbook's rules.
   * @param playbookId - The ID of the playbook.
   * @returns An array of checklist items.
   */
  export const generatePlaybookChecklist = (
    playbookId: string
  ): Array<{ id: string; rule: string; category: string }> | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
  
    return Object.entries(playbook.rules).map(([key, value]) => ({
      id: `${playbookId}-${key}`,
      rule: value,
      category: formatRuleKey(key),
    }));
  };
  
  /**
   * Gets recommended playbooks based on contract type and context.
   * @param context - Context information for recommendations.
   * @returns An array of recommended playbook IDs.
   */
  export const getRecommendedPlaybooks = (context: {
    contractType?: string;
    industry?: string;
    jurisdiction?: string;
    tags?: string[];
  }): string[] => {
    const { contractType, industry, jurisdiction, tags } = context;
    const recommended: string[] = [];
  
    // Mapping of contract types to playbook IDs
    const contractTypeMapping: Record<string, string> = {
      'employment': 'employment',
      'nda': 'nda',
      'consulting': 'consulting',
      'freelance': 'freelance-services',
      'saas': 'enterprise-saas',
      'license': 'license-agreement',
      'partnership': 'partnership',
      'vendor': 'vendor-agreement',
      'lease': 'real-estate-lease',
      'subscription': 'subscription',
      'api': 'api-terms',
    };
  
    // Add playbook based on contract type
    if (contractType && contractTypeMapping[contractType.toLowerCase()]) {
      recommended.push(contractTypeMapping[contractType.toLowerCase()]);
    }
  
    // Add industry-specific playbooks
    if (industry) {
      const industryLower = industry.toLowerCase();
      if (industryLower.includes('tech') || industryLower.includes('software')) {
        recommended.push('tech-startup');
      }
      if (industryLower.includes('real estate')) {
        recommended.push('real-estate-lease');
      }
    }
  
    // Add region-specific playbooks
    if (jurisdiction) {
      const jurisdictionLower = jurisdiction.toLowerCase();
      if (jurisdictionLower.includes('gdpr') || jurisdictionLower.includes('eu')) {
        recommended.push('privacy-focused');
      }
    }
  
    // Add playbooks matching tags
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const matchingPlaybooks = getPlaybooksByTag(tag.toLowerCase());
        matchingPlaybooks.forEach(p => {
          if (!recommended.includes(p.id)) {
            recommended.push(p.id);
          }
        });
      });
    }
  
    // Always include default if no specific recommendations
    if (recommended.length === 0) {
      recommended.push('default');
    }
  
    return recommended;
  };
  
  /**
   * Validates playbook rules against a contract draft.
   * @param playbookId - The playbook ID to validate against.
   * @param contractText - The contract text to validate.
   * @returns An object indicating which rules appear to be missing.
   */
  export const validateContractAgainstPlaybook = (
    playbookId: string,
    contractText: string
  ): {
    playbookName: string;
    totalRules: number;
    potentiallyMissing: Array<{ key: string; rule: string }>;
    validationScore: number;
  } | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
  
    const contractLower = contractText.toLowerCase();
    const potentiallyMissing: Array<{ key: string; rule: string }> = [];
  
    Object.entries(playbook.rules).forEach(([key, value]) => {
      // Simple heuristic: check if key words from the rule appear in the contract
      const keywords = extractKeywords(value);
      const found = keywords.some(keyword => 
        contractLower.includes(keyword.toLowerCase())
      );
  
      if (!found) {
        potentiallyMissing.push({ key, rule: value });
      }
    });
  
    const totalRules = Object.keys(playbook.rules).length;
    const foundRules = totalRules - potentiallyMissing.length;
    const validationScore = totalRules > 0 ? (foundRules / totalRules) * 100 : 0;
  
    return {
      playbookName: playbook.name,
      totalRules,
      potentiallyMissing,
      validationScore: Math.round(validationScore),
    };
  };
  
  /**
   * Extracts keywords from a rule description for validation.
   * @param ruleText - The rule text.
   * @returns An array of keywords.
   */
  const extractKeywords = (ruleText: string): string[] => {
    // Remove common words and extract meaningful terms
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'have',
      'include', 'specify', 'define', 'require', 'must', 'should', 'may'
    ]);
  
    return ruleText
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 5); // Take top 5 keywords
  };
  
  /**
 * Gets statistics about the playbook library.
 * @returns Statistics object.
 */
export const getPlaybookStatistics = (): {
    totalPlaybooks: number;
    byCategory: Record<string, number>;
    totalRules: number;
    averageRulesPerPlaybook: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
  } => {
    const totalPlaybooks = PLAYBOOKS.length;
    
    const byCategory: Record<string, number> = {};
    let totalRules = 0;
    const tagCounts: Record<string, number> = {};
  
    PLAYBOOKS.forEach(playbook => {
      // Count by category
      const category = playbook.category || 'uncategorized';
      byCategory[category] = (byCategory[category] || 0) + 1;
  
      // Count total rules
      totalRules += Object.keys(playbook.rules).length;
  
      // Count tags
      playbook.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
  
    const averageRulesPerPlaybook = totalPlaybooks > 0 
      ? Math.round(totalRules / totalPlaybooks) 
      : 0;
  
    const mostCommonTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  
    return {
      totalPlaybooks,
      byCategory,
      totalRules,
      averageRulesPerPlaybook,
      mostCommonTags,
    };
  };
  
  /**
   * Clones a playbook with a new ID and name.
   * @param playbookId - The ID of the playbook to clone.
   * @param newName - The name for the cloned playbook.
   * @returns The cloned playbook or null if source not found.
   */
  export const clonePlaybook = (
    playbookId: string,
    newName: string
  ): Playbook | null => {
    const sourcePlaybook = getPlaybookById(playbookId);
    if (!sourcePlaybook) return null;
  
    const now = new Date().toISOString();
  
    return {
      ...sourcePlaybook,
      id: `clone-${Date.now()}`,
      name: newName,
      description: `Cloned from ${sourcePlaybook.name}`,
      category: 'custom',
      createdAt: now,
      updatedAt: now,
    };
  };
  
  /**
   * Updates a playbook's rules (for custom playbooks).
   * @param playbookId - The ID of the playbook to update.
   * @param updates - Partial playbook data to update.
   * @returns The updated playbook or null if not found.
   */
  export const updatePlaybook = (
    playbookId: string,
    updates: Partial<Omit<Playbook, 'id' | 'createdAt'>>
  ): Playbook | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
  
    const updatedPlaybook: Playbook = {
      ...playbook,
      ...updates,
      id: playbook.id, // Ensure ID doesn't change
      createdAt: playbook.createdAt,
      updatedAt: new Date().toISOString(),
    };
  
    return updatedPlaybook;
  };
  
  /**
   * Generates a diff-friendly comparison between playbook rules.
   * @param playbookId1 - First playbook ID.
   * @param playbookId2 - Second playbook ID.
   * @returns A formatted comparison string or null if either playbook not found.
   */
  export const generatePlaybookDiff = (
    playbookId1: string,
    playbookId2: string
  ): string | null => {
    const comparison = comparePlaybooks(playbookId1, playbookId2);
    if (!comparison) return null;
  
    const playbook1 = getPlaybookById(playbookId1);
    const playbook2 = getPlaybookById(playbookId2);
  
    let diff = `# Playbook Comparison\n\n`;
    diff += `## ${playbook1?.name} vs ${playbook2?.name}\n\n`;
  
    if (Object.keys(comparison.common).length > 0) {
      diff += `### Common Rules (${Object.keys(comparison.common).length})\n\n`;
      Object.entries(comparison.common).forEach(([key, value]) => {
        diff += `- **${formatRuleKey(key)}**: ${value}\n`;
      });
      diff += '\n';
    }
  
    if (Object.keys(comparison.uniqueToFirst).length > 0) {
      diff += `### Only in ${playbook1?.name} (${Object.keys(comparison.uniqueToFirst).length})\n\n`;
      Object.entries(comparison.uniqueToFirst).forEach(([key, value]) => {
        diff += `- **${formatRuleKey(key)}**: ${value}\n`;
      });
      diff += '\n';
    }
  
    if (Object.keys(comparison.uniqueToSecond).length > 0) {
      diff += `### Only in ${playbook2?.name} (${Object.keys(comparison.uniqueToSecond).length})\n\n`;
      Object.entries(comparison.uniqueToSecond).forEach(([key, value]) => {
        diff += `- **${formatRuleKey(key)}**: ${value}\n`;
      });
      diff += '\n';
    }
  
    if (Object.keys(comparison.different).length > 0) {
      diff += `### Different Rules (${Object.keys(comparison.different).length})\n\n`;
      Object.entries(comparison.different).forEach(([key, values]) => {
        diff += `**${formatRuleKey(key)}**:\n`;
        diff += `  - ${playbook1?.name}: ${values.first}\n`;
        diff += `  - ${playbook2?.name}: ${values.second}\n\n`;
      });
    }
  
    return diff;
  };
  
  /**
   * Converts playbook rules to a structured format for API consumption.
   * @param playbookId - The ID of the playbook.
   * @returns A structured API-friendly format or null if not found.
   */
  export const getPlaybookForAPI = (playbookId: string): {
    id: string;
    name: string;
    description: string;
    rules: Array<{ key: string; value: string; category: string }>;
  } | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
  
    return {
      id: playbook.id,
      name: playbook.name,
      description: playbook.description,
      rules: Object.entries(playbook.rules).map(([key, value]) => ({
        key,
        value,
        category: formatRuleKey(key),
      })),
    };
  };
  
  /**
   * Filters playbooks by multiple criteria.
   * @param filters - Filter criteria.
   * @returns An array of matching playbooks.
   */
  export const filterPlaybooks = (filters: {
    category?: string;
    tags?: string[];
    searchTerm?: string;
    minRules?: number;
    maxRules?: number;
  }): Playbook[] => {
    let results = [...PLAYBOOKS];
  
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
  
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(p => 
        filters.tags!.some(tag => p.tags?.includes(tag))
      );
    }
  
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
  
    if (filters.minRules !== undefined) {
      results = results.filter(p => Object.keys(p.rules).length >= filters.minRules!);
    }
  
    if (filters.maxRules !== undefined) {
      results = results.filter(p => Object.keys(p.rules).length <= filters.maxRules!);
    }
  
    return results;
  };
  
  /**
   * Generates a template contract section based on playbook rules.
   * @param playbookId - The ID of the playbook.
   * @param sectionKey - The specific rule key to generate a section for.
   * @returns A template contract section or null if not found.
   */
  export const generateContractSection = (
    playbookId: string,
    sectionKey: string
  ): string | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook || !playbook.rules[sectionKey]) return null;
  
    const rule = playbook.rules[sectionKey];
    const sectionTitle = formatRuleKey(sectionKey);
  
    return `
  ## ${sectionTitle}
  
  ${rule}
  
  [Detailed provisions to be drafted based on this requirement]
    `.trim();
  };
  
  /**
   * Generates a complete contract outline based on playbook.
   * @param playbookId - The ID of the playbook.
   * @returns A complete contract outline.
   */
  export const generateContractOutline = (playbookId: string): string | null => {
    const playbook = getPlaybookById(playbookId);
    if (!playbook) return null;
  
    let outline = `# ${playbook.name} Contract Outline\n\n`;
    outline += `*${playbook.description}*\n\n`;
  
    const sections = Object.entries(playbook.rules).map(([key, value]) => {
      const sectionTitle = formatRuleKey(key);
      return {
        title: sectionTitle,
        requirement: value,
        key
      };
    });
  
    sections.forEach((section, index) => {
      outline += `## ${index + 1}. ${section.title}\n\n`;
      outline += `**Requirement**: ${section.requirement}\n\n`;
      outline += `**Draft Section**:\n\n`;
      outline += `[To be completed based on the requirement above]\n\n`;
      outline += `---\n\n`;
    });
  
    return outline;
  };
  
  /**
   * Gets conflicting rules between playbooks (same key, different values).
   * @param playbookIds - Array of playbook IDs to check.
   * @returns An array of conflicts.
   */
  export const getPlaybookConflicts = (playbookIds: string[]): Array<{
    ruleKey: string;
    conflicts: Array<{ playbookId: string; playbookName: string; rule: string }>;
  }> => {
    const playbooks = playbookIds
      .map(id => getPlaybookById(id))
      .filter((p): p is Playbook => p !== undefined);
  
    if (playbooks.length < 2) return [];
  
    const rulesByKey: Record<string, Array<{ playbookId: string; playbookName: string; rule: string }>> = {};
  
    playbooks.forEach(playbook => {
      Object.entries(playbook.rules).forEach(([key, value]) => {
        if (!rulesByKey[key]) {
          rulesByKey[key] = [];
        }
        rulesByKey[key].push({
          playbookId: playbook.id,
          playbookName: playbook.name,
          rule: value,
        });
      });
    });
  
    const conflicts: Array<{
      ruleKey: string;
      conflicts: Array<{ playbookId: string; playbookName: string; rule: string }>;
    }> = [];
  
    Object.entries(rulesByKey).forEach(([key, rules]) => {
      if (rules.length > 1) {
        const uniqueRules = new Set(rules.map(r => r.rule));
        if (uniqueRules.size > 1) {
          conflicts.push({
            ruleKey: key,
            conflicts: rules,
          });
        }
      }
    });
  
    return conflicts;
  };
  
  /**
   * Suggests playbook combinations that work well together.
   * @param basePlaybookId - The base playbook to build upon.
   * @returns An array of suggested complementary playbook IDs.
   */
  export const getSuggestedCombinations = (basePlaybookId: string): string[] => {
    const combinations: Record<string, string[]> = {
      'default': ['privacy-focused', 'nda'],
      'tech-startup': ['privacy-focused', 'employment', 'api-terms'],
      'enterprise-saas': ['privacy-focused', 'subscription'],
      'freelance-services': ['nda', 'consulting'],
      'employment': ['nda', 'default'],
      'consulting': ['nda', 'freelance-services'],
      'license-agreement': ['api-terms', 'subscription'],
    };
  
    return combinations[basePlaybookId] || [];
  };
  
  // Export all functions and constants
  export default {
    PLAYBOOKS,
    getAllPlaybooks,
    getPlaybookById,
    getPlaybooksByCategory,
    searchPlaybooks,
    buildPlaybookPrompt,
    buildDetailedPlaybookPrompt,
    getAllTags,
    getPlaybooksByTag,
    isValidPlaybook,
    getPlaybookOptions,
    comparePlaybooks,
    mergePlaybooks,
    createCustomPlaybook,
    exportPlaybook,
    importPlaybook,
    getPlaybookSummaries,
    generatePlaybookChecklist,
    getRecommendedPlaybooks,
    validateContractAgainstPlaybook,
    getPlaybookStatistics,
    clonePlaybook,
    updatePlaybook,
    generatePlaybookDiff,
    getPlaybookForAPI,
    filterPlaybooks,
    generateContractSection,
    generateContractOutline,
    getPlaybookConflicts,
    getSuggestedCombinations,
  };