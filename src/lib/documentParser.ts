import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Define a simple interface for the result of mammoth.extractRawText
interface MammothResult {
  value: string;
  messages: any[];
}

/**
 * Extracts text content from various file formats (PDF, DOCX, TXT)
 * @param file - The File object to extract text from
 * @returns Promise that resolves to the extracted text string
 */
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
    
    if (file.type === 'application/pdf') {
      // Handle PDF files
      const buffer: Buffer = Buffer.from(arrayBuffer);
      // The `pdf` function returns an object with a `text` property
      const data: { text: string } = await pdf(buffer);
      
      // Check if text extraction was successful
      if (!data.text || data.text.trim().length < 50) {
        throw new Error('Could not extract text from PDF. The file might be image-based or corrupted.');
      }
      
      // Clean and normalize the text
      const cleanedText: string = data.text
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[^\x20-\x7E\n\r]/g, '') // Remove non-printable characters
        .trim();
      
      console.log('PDF parsed successfully. Text length:', cleanedText.length);
      
      return cleanedText;
      
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle DOCX files
      const buffer: Buffer = Buffer.from(arrayBuffer);
      const result: MammothResult = await mammoth.extractRawText({ buffer });
      
      if (!result.value || result.value.trim().length < 50) {
        throw new Error('Could not extract text from DOCX file.');
      }
      
      // Clean and normalize the text
      const cleanedText: string = result.value
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      console.log('DOCX parsed successfully. Text length:', cleanedText.length);
      
      return cleanedText;
      
    } else if (file.type === 'text/plain') {
      // Handle plain text files
      const text: string = new TextDecoder().decode(arrayBuffer);
      return text;
      
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error: unknown) {
    // Type-safe error handling
    let errorMessage: string = 'Failed to extract text from file';
    
    if (error instanceof Error) {
      console.error('Error extracting text:', error.message);
      errorMessage = `Failed to extract text: ${error.message}`;
    } else {
      console.error('Unknown error extracting text:', error);
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Checks if extracted text is meaningful and not corrupted
 * @param text - The text to validate
 * @returns True if the text appears to be meaningful content
 */
export function isTextMeaningful(text: string | null | undefined): boolean {
  if (!text || text.length < 50) return false;
  
  // Check for excessive special characters (indicates corrupted/binary data)
  const specialCharMatches = text.match(/[^a-zA-Z0-9\s.,;:!?'"()-]/g);
  const specialCharRatio: number = (specialCharMatches?.length || 0) / text.length;
  if (specialCharRatio > 0.3) return false;
  
  // Check average word length
  const words: string[] = text.split(/\s+/);
  if (words.length === 0) return false; // Avoid division by zero
  const avgWordLength: number = text.replace(/\s+/g, '').length / words.length;
  if (avgWordLength < 2 || avgWordLength > 20) return false;
  
  return true;
}

/**
 * Cleans extracted text for analysis by removing headers, footers, and normalizing formatting
 * @param text - The raw extracted text
 * @returns Cleaned text ready for analysis
 */
export function cleanTextForAnalysis(text: string): string {
  // Normalize whitespace
  let cleaned: string = text.replace(/\s+/g, ' ').trim();
  
  // Remove common headers/footers
  cleaned = cleaned.replace(/Page \d+ of \d+/gi, '');
  cleaned = cleaned.replace(/^\d+$/gm, ''); // Remove standalone page numbers
  
  // Normalize line breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}