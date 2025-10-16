// Interface for the draft document state
interface DraftState {
    draft: string | null;
    title: string | null;
  }
  
  // Module-level state variables with explicit types
  let currentDraft: string | null = null;
  let currentTitle: string | null = null;
  
  /**
   * Sets the current draft document and title in the context
   * @param draft - The generated document text
   * @param title - The title of the document
   */
  export const setDraft = (draft: string, title: string): void => {
    currentDraft = draft;
    currentTitle = title;
  };
  
  /**
   * Retrieves the current draft document state
   * @returns Object containing the draft text and title
   */
  export const getDraft = (): DraftState => {
    return { draft: currentDraft, title: currentTitle };
  };
  
  /**
   * Clears the current draft from the context
   */
  export const clearDraft = (): void => {
    currentDraft = null;
    currentTitle = null;
  };
  
  /**
   * Checks if a draft currently exists
   * @returns True if a draft is present, false otherwise
   */
  export const hasDraft = (): boolean => {
    return currentDraft !== null && currentTitle !== null;
  };
  
  /**
   * Updates only the draft content while keeping the title
   * @param draft - The new draft content
   */
  export const updateDraftContent = (draft: string): void => {
    currentDraft = draft;
  };
  
  /**
   * Updates only the draft title while keeping the content
   * @param title - The new title
   */
  export const updateDraftTitle = (title: string): void => {
    currentTitle = title;
  };