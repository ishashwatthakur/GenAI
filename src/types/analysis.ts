// src/types/analysis.ts

/**
 * Type definitions for legal document analysis results
 * This file serves as the single source of truth for all analysis-related types
 */

// ============================================================================
// SEVERITY AND RISK TYPES
// ============================================================================

/** Severity levels for flagged clauses - must match ClauseSeverityCards */
export type Severity = 'critical' | 'high' | 'warning' | 'medium' | 'low' | 'safe';

/** Priority levels for action items and obligations */
export type Priority = 'high' | 'medium' | 'low';
export type PriorityCapitalized = 'High' | 'Medium' | 'Low';

/** Overall risk assessment levels */
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// ============================================================================
// OBLIGATION AND TIMELINE TYPES
// ============================================================================

/** Frequency types for obligations - must match ObligationsTimeline */
export type ObligationFrequency = 'Monthly' | 'Annual' | 'One-time' | 'Ongoing';

/** Key date event types - must match ObligationsTimeline */
export type KeyDateType = 'Deadline' | 'Renewal' | 'Payment' | 'Event';

// ============================================================================
// DOCUMENT METADATA
// ============================================================================

/**
 * Metadata about the analyzed document
 */
export interface Metadata {
  fileName: string;
  wordCount?: number;
  estimatedReadTime?: string;
  pageCount?: number;
  uploadDate?: string;
  fileSize?: number;
  documentHash?: string;
  documentText?: string; 
}


// ============================================================================
// FLAGGED CLAUSES AND ISSUES
// ============================================================================

/**
 * Represents a risky, problematic, or noteworthy clause identified in the document
 * Must match ClauseSeverityCards component expectations
 */
export interface FlaggedClause {
  id: string | number;
  severity: Severity;
  title: string;
  description: string;
  category: string;
  location: string;
  fullText: string; // The actual clause text
  recommendation: string; // What to do about it
  text?: string; // Alternative field name for compatibility
  suggestion?: string; // Alternative field name for mitigation advice
  negotiable?: boolean;
  riskLevel?: number; // Numeric risk score (0-100)
  impact?: string; // Description of potential impact
  legalBasis?: string; // Legal reasoning or citation
}

// ============================================================================
// POSITIVE PROVISIONS
// ============================================================================

/**
 * Represents favorable or beneficial terms in the document
 */
export interface PositiveProvision {
  title: string;
  benefit: string;
  description: string;
  location: string;
  category?: string;
  importance?: Priority;
}

// ============================================================================
// ACTION ITEMS
// ============================================================================

/**
 * Recommended actions for the user to take
 */
export interface ActionItem {
  priority: Priority;
  action: string;
  description: string;
  context: string;
  reason: string;
  deadline?: string;
  responsibleParty?: string;
  completed?: boolean;
}

// ============================================================================
// NEGOTIATION POINTS
// ============================================================================

/**
 * Points or clauses that should be negotiated
 * Simple string array for flexibility
 */
export type NegotiationPoint = string;

// ============================================================================
// MISSING CLAUSES
// ============================================================================

/**
 * Clauses that are typically expected but missing from the document
 */
export interface MissingClause {
  clause: string;
  importance: string;
  suggestion: string;
  category?: string;
  riskIfMissing?: string;
  standardLanguage?: string;
}

// ============================================================================
// OBLIGATIONS
// ============================================================================

/**
 * Contractual obligations identified for parties
 * Must match ObligationsTimeline component expectations
 */
export interface Obligation {
  obligation: string;
  dueDate: string;
  frequency: ObligationFrequency;
  party: string;
  description?: string;
  priority?: Priority;
  responsibleParty?: string;
  status?: 'pending' | 'completed' | 'overdue';
  category?: string;
}

// ============================================================================
// KEY DATES
// ============================================================================

/**
 * Important dates and deadlines in the document
 * Must match ObligationsTimeline component expectations
 */
export interface KeyDate {
  event: string;
  date: string;
  type: KeyDateType;
  description?: string;
  priority?: Priority;
  eventName?: string;
  reminderSet?: boolean;
  associatedObligation?: string;
}

// ============================================================================
// RISK ASSESSMENT
// ============================================================================

/**
 * Breakdown of risk scores across different categories
 */
export interface RiskCategories {
  financial?: number;
  legal?: number;
  operational?: number;
  reputational?: number;
  compliance?: number;
  [key: string]: number | undefined; // Allow additional custom categories
}

// ============================================================================
// FINAL VERDICT
// ============================================================================

/**
 * Overall assessment and recommendation from the AI
 */
export interface FinalVerdict {
  recommendation?: string;
  mainConcerns?: string[];
  overallAssessment?: string;
  shouldSign?: boolean;
  confidenceLevel?: number;
}

// ============================================================================
// INDUSTRY COMPARISON
// ============================================================================

/**
 * Comparison with industry standards and best practices
 */
export interface IndustryComparison {
  industry?: string;
  comparisonScore?: number;
  deviations?: string[];
  benchmarks?: Record<string, any>;
  [key: string]: any;
}

// ============================================================================
// PARTIES
// ============================================================================

/**
 * Information about parties involved in the contract
 */
export interface Party {
  name: string;
  role: string;
  jurisdiction?: string;
  entityType?: string;
}

// ============================================================================
// MASTER ANALYSIS RESULT
// ============================================================================

/**
 * The complete analysis result structure
 * This is the primary interface that combines all analysis components
 * Used by legalAnalyzer.ts, AnalysisResults.tsx, and documentContext.ts
 */
export interface AnalysisResult {
  // Document Information
  documentType?: string;
  metadata?: Metadata;
  
  // Core Analysis
  summary: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  riskCategories: RiskCategories;
  
  // Parties and Dates
  parties?: string[] | Party[];
  effectiveDate?: string;
  expirationDate?: string;
  termLength?: string;
  
  // Identified Issues and Benefits
  flaggedClauses?: FlaggedClause[];
  positiveProvisions?: PositiveProvision[];
  missingClauses?: MissingClause[];
  
  // Obligations and Timeline
  obligations?: Obligation[];
  keyDates?: KeyDate[];
  
  // Recommendations and Actions
  actionItems?: ActionItem[];
  negotiationPoints?: NegotiationPoint[];
  finalVerdict?: FinalVerdict;
  
  // Comparison and Context
  industryComparison?: IndustryComparison;
  
  // Compliance and Legal
  applicableLaws?: string[];
  jurisdictions?: string[];
  regulatoryRequirements?: string[];
  
  // Financial Terms
  paymentTerms?: string[];
  financialObligations?: string[];
  pricingStructure?: string;
  
  // Termination and Renewal
  terminationClauses?: string[];
  renewalTerms?: string[];
  noticePeriods?: string[];
  
  // Liability and Insurance
  liabilityLimitations?: string[];
  indemnificationClauses?: string[];
  insuranceRequirements?: string[];
  
  // Intellectual Property
  ipOwnership?: string[];
  confidentialityTerms?: string[];
  dataProtectionClauses?: string[];
  
  // Dispute Resolution
  disputeResolution?: string[];
  governingLaw?: string;
  venue?: string;
  
  // Additional flexible fields
  [key: string]: any;
}

// ============================================================================
// ANALYSIS OPTIONS
// ============================================================================

/**
 * Configuration options for the analysis process
 */
export interface AnalysisOptions {
  jurisdiction?: string;
  documentType?: string;
  focusAreas?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
  complianceFrameworks?: string[];
  industryStandards?: string[];
}

// ============================================================================
// ANALYSIS STATUS
// ============================================================================

/**
 * Status information for ongoing analysis
 */
export interface AnalysisStatus {
  stage: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
  error?: string;
  estimatedTimeRemaining?: number;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Partial analysis result for streaming or incremental updates
 */
export type PartialAnalysisResult = Partial<AnalysisResult>;

/**
 * Analysis result with required fields only
 */
export type MinimalAnalysisResult = Pick<
  AnalysisResult,
  'summary' | 'overallRiskScore' | 'riskLevel' | 'riskCategories'
>;

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export all types for convenient importing
export type {
  AnalysisResult as default,
};