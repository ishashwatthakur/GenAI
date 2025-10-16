/**
 * Clause Library for Legal Document Drafting
 * Contains reusable legal clauses organized by category
 */

// Type definition for a single clause
interface Clause {
    id: string;           // Unique identifier (e.g., "conf-001")
    category: string;     // Category name (e.g., "Confidentiality")
    title: string;        // User-friendly title
    text: string;         // Full legal text of the clause
    explanation: string;  // Plain-language explanation
    tags: string[];       // Keywords for searching
    riskLevel?: 'low' | 'medium' | 'high'; // Optional risk assessment
    jurisdiction?: string[]; // Optional jurisdictions where applicable
  }
  
  // Type for clause categories
  type ClauseCategory = 
    | 'Confidentiality'
    | 'Intellectual Property'
    | 'Termination'
    | 'Liability'
    | 'Payment Terms'
    | 'Dispute Resolution'
    | 'General Provisions';
  
  // Main clause library with type safety
  export const CLAUSE_LIBRARY: Clause[] = [
    {
      id: 'conf-001',
      category: 'Confidentiality',
      title: 'Mutual Non-Disclosure',
      text: `Each party acknowledges that it may have access to certain confidential and proprietary information of the other party. Each party agrees to maintain the confidentiality of all such information and not to disclose it to any third party without the prior written consent of the disclosing party.`,
      explanation: 'Both parties agree to keep each other\'s confidential information secret.',
      tags: ['nda', 'confidentiality', 'mutual', 'privacy'],
      riskLevel: 'low'
    },
    {
      id: 'conf-002',
      category: 'Confidentiality',
      title: 'One-Way Non-Disclosure',
      text: `The Receiving Party agrees to hold in confidence and not disclose to any third party any Confidential Information received from the Disclosing Party. The Receiving Party shall use the Confidential Information solely for the purposes set forth in this Agreement.`,
      explanation: 'Only one party is required to keep information confidential.',
      tags: ['nda', 'confidentiality', 'one-way', 'unilateral'],
      riskLevel: 'medium'
    },
    {
      id: 'ip-001',
      category: 'Intellectual Property',
      title: 'Work for Hire',
      text: `All work product created by the Service Provider under this Agreement shall be considered "work made for hire" and shall be the sole and exclusive property of the Client. The Service Provider hereby assigns all right, title, and interest in such work product to the Client.`,
      explanation: 'Everything created under this agreement belongs to the client.',
      tags: ['ip', 'ownership', 'work-for-hire', 'assignment'],
      riskLevel: 'high'
    },
    {
      id: 'term-001',
      category: 'Termination',
      title: 'Termination for Convenience',
      text: `Either party may terminate this Agreement at any time, with or without cause, upon thirty (30) days written notice to the other party.`,
      explanation: 'Either party can end the agreement with 30 days notice.',
      tags: ['termination', 'convenience', 'notice', 'exit'],
      riskLevel: 'low'
    },
    {
      id: 'liab-001',
      category: 'Liability',
      title: 'Limitation of Liability',
      text: `IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
      explanation: 'Limits the types of damages that can be claimed.',
      tags: ['liability', 'limitation', 'damages', 'cap'],
      riskLevel: 'medium'
    },
  ];
  
  /**
   * Find a clause by its ID
   */
  export function findClauseById(id: string): Clause | undefined {
    return CLAUSE_LIBRARY.find(clause => clause.id === id);
  }
  
  /**
   * Get all clauses in a specific category
   */
  export function getClausesByCategory(category: string): Clause[] {
    return CLAUSE_LIBRARY.filter(clause => clause.category === category);
  }
  
  /**
   * Search clauses by tags
   */
  export function searchClausesByTags(tags: string[]): Clause[] {
    return CLAUSE_LIBRARY.filter(clause =>
      clause.tags.some(tag => tags.includes(tag))
    );
  }
  
  /**
   * Get all unique categories
   */
  export function getAllCategories(): string[] {
    const categories = new Set(CLAUSE_LIBRARY.map(clause => clause.category));
    return Array.from(categories);
  }
  
  /**
   * Get clauses by risk level
   */
  export function getClausesByRiskLevel(riskLevel: 'low' | 'medium' | 'high'): Clause[] {
    return CLAUSE_LIBRARY.filter(clause => clause.riskLevel === riskLevel);
  }
  
  /**
   * Search clauses by text content
   */
  export function searchClausesByText(searchTerm: string): Clause[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return CLAUSE_LIBRARY.filter(clause =>
      clause.text.toLowerCase().includes(lowerSearchTerm) ||
      clause.title.toLowerCase().includes(lowerSearchTerm) ||
      clause.explanation.toLowerCase().includes(lowerSearchTerm)
    );
  }
  
  /**
   * Get a random clause from a category
   */
  export function getRandomClauseFromCategory(category: string): Clause | undefined {
    const categoryClauses = getClausesByCategory(category);
    if (categoryClauses.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * categoryClauses.length);
    return categoryClauses[randomIndex];
  }
  
  /**
   * Export clause library statistics
   */
  export function getLibraryStats(): {
    totalClauses: number;
    categoriesCount: number;
    riskDistribution: Record<string, number>;
  } {
    const riskDistribution = CLAUSE_LIBRARY.reduce((acc, clause) => {
      const risk = clause.riskLevel || 'unspecified';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return {
      totalClauses: CLAUSE_LIBRARY.length,
      categoriesCount: getAllCategories().length,
      riskDistribution
    };
  }