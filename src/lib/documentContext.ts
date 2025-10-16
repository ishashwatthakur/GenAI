import type { AnalysisResult } from '../types/analysis';

// Interface for the document analysis state
interface DocumentAnalysisState {
  analysis: AnalysisResult | null;
  fileName: string | null;
}

// Module-level state variables with explicit types
let currentAnalysis: AnalysisResult | null = null;
let currentFileName: string | null = null;

/**
 * Sets the current document analysis and filename in the context
 * @param analysis - The analysis result object
 * @param fileName - The name of the analyzed file
 */
export const setDocumentAnalysis = (analysis: AnalysisResult, fileName: string): void => {
  currentAnalysis = analysis;
  currentFileName = fileName;
};

/**
 * Retrieves the current document analysis state
 * @returns Object containing the analysis and filename
 */
export const getDocumentAnalysis = (): DocumentAnalysisState => {
  return { analysis: currentAnalysis, fileName: currentFileName };
};

/**
 * Clears the current document analysis from the context
 */
export const clearDocumentAnalysis = (): void => {
  currentAnalysis = null;
  currentFileName = null;
};

/**
 * Generates suggested questions based on the analysis results
 * @param analysis - The analysis result to generate questions from
 * @returns Array of suggested question strings
 */
export const generateSuggestedQuestions = (analysis: AnalysisResult | null): string[] => {
  if (!analysis) return [];
  
  const questions: string[] = [];
  
  // Risk-based questions
  if (analysis.riskLevel === 'High') {
    questions.push("What are the most critical risks in this document?");
    questions.push("Which clauses should I negotiate immediately?");
  } else if (analysis.riskLevel === 'Medium') {
    questions.push("What are the main concerns in this document?");
    questions.push("Are there any clauses I should pay attention to?");
  }
  
  // Flagged clauses questions
  if (analysis.flaggedClauses && analysis.flaggedClauses.length > 0) {
    const topClause = analysis.flaggedClauses[0];
    questions.push(`Can you explain the "${topClause.title}" clause in detail?`);
    questions.push("What are the potential consequences of the risky clauses?");
  }
  
  // Obligations questions
  if (analysis.obligations && analysis.obligations.length > 0) {
    questions.push("What are my key obligations and when are they due?");
    questions.push("What happens if I don't meet the deadlines?");
  }
  
  // Missing clauses questions
  if (analysis.missingClauses && analysis.missingClauses.length > 0) {
    questions.push("What important protections are missing from this contract?");
  }
  
  // Document type specific questions
  if (analysis.documentType) {
    questions.push(`What should I know about this ${analysis.documentType}?`);
  }
  
  // General questions
  questions.push("Should I sign this document as-is?");
  questions.push("Give me a simple summary of what I'm agreeing to");
  questions.push("What are the payment terms mentioned?");
  
  return questions.slice(0, 6); // Return max 6 questions
};