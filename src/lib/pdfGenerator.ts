import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, PDFImage } from 'pdf-lib';

// Type definitions for better code organization
interface TextBlock {
  type: 'title' | 'heading' | 'subheading' | 'body';
  text: string;
}

export async function generatePDFWithTemplate(
  documentText: string,
  documentTitle: string,
  documentType: string
): Promise<Uint8Array> {
  try {
    const pdfDoc: PDFDocument = await PDFDocument.create();
    
    const response: Response = await fetch('/media/Templates-page.png');
    if (!response.ok) throw new Error('Template not found');
    const templateBytes: ArrayBuffer = await response.arrayBuffer();
    const templateImage: PDFImage = await pdfDoc.embedPng(templateBytes);
    
    const { width: pageWidth, height: pageHeight } = templateImage.scale(1);
    
    const regularFont: PDFFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont: PDFFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const FOOTER_SAFE_ZONE: number = 130;
    const MARGIN_LEFT: number = 70;
    const MARGIN_RIGHT: number = 70;
    const MARGIN_TOP: number = 180;
    const MARGIN_BOTTOM: number = FOOTER_SAFE_ZONE + 50;
    const USABLE_WIDTH: number = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;
    const USABLE_HEIGHT: number = pageHeight - MARGIN_TOP - MARGIN_BOTTOM;
    const SIZE_TITLE: number = 55;
    const SIZE_BODY: number = 28;
    const SIZE_MAJOR_HEADING: number = 35;
    const SIZE_SUB_HEADING: number = 28;
    const LINE_HEIGHT_BODY: number = 28;
    const LINE_HEIGHT_HEADING: number = 40;
    const textColor = rgb(0.21, 0.21, 0.21);
    
    const cleanText: string = documentText
      .replace(/^["']+|["']+$/gm, '')
      .replace(/\\/g, '')
      .replace(/#+\s/g, '')
      .trim();
    
    const blocks: TextBlock[] = [];
    const lines: string[] = cleanText.split('\n').filter(l => l.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i].trim();
      
      if (i === 0 && line === line.toUpperCase() && line.length > 10 && !/^\d/.test(line)) {
        blocks.push({ type: 'title', text: line });
        continue;
      }
      if (/^\d+\.\s+[A-Z\s]{5,}$/.test(line)) {
        blocks.push({ type: 'heading', text: line });
        continue;
      }
      if (/^\d+\.\d+\s+[A-Z]/.test(line)) {
        blocks.push({ type: 'subheading', text: line });
        continue;
      }
      blocks.push({ type: 'body', text: line });
    }
    
    const pages: TextBlock[][] = [];
    let currentPage: TextBlock[] = [];
    let currentY: number = 0;
    
    for (const block of blocks) {
      let blockHeight: number = 0;
      
      if (block.type === 'title') {
        blockHeight = SIZE_TITLE + 40;
      } else if (block.type === 'heading') {
        blockHeight = SIZE_MAJOR_HEADING + 70;
      } else if (block.type === 'subheading') {
        blockHeight = SIZE_SUB_HEADING + 35;
      } else {
        const wrappedLines: string[] = wrapText(block.text, USABLE_WIDTH, SIZE_BODY, regularFont);
        blockHeight = wrappedLines.length * LINE_HEIGHT_BODY + 20;
      }
      
      if (currentY + blockHeight > USABLE_HEIGHT) {
        if (currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [];
          currentY = 0;
        }
      }
      
      currentPage.push(block);
      currentY += blockHeight;
    }
    
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    const totalPages: number = pages.length;
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      const page: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);
      
      page.drawImage(templateImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
      
      const pageText: string = `Page ${pageNum + 1} of ${totalPages}`;
      const pageTextWidth: number = regularFont.widthOfTextAtSize(pageText, 20);
      
      page.drawText(pageText, {
        x: pageWidth - MARGIN_RIGHT - pageTextWidth,
        y: pageHeight - 30,
        size: 20,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      let yPos: number = pageHeight - MARGIN_TOP;
      
      for (const block of pages[pageNum]) {
        if (block.type === 'title') {
          const titleWidth: number = boldFont.widthOfTextAtSize(block.text, SIZE_TITLE);
          const titleX: number = (pageWidth - titleWidth) / 2;
          page.drawText(block.text, { x: titleX, y: yPos, size: SIZE_TITLE, font: boldFont, color: textColor });
          yPos -= SIZE_TITLE + 40;
        } else if (block.type === 'heading') {
          yPos -= 30;
          page.drawText(block.text, { x: MARGIN_LEFT, y: yPos, size: SIZE_MAJOR_HEADING, font: boldFont, color: textColor });
          yPos -= SIZE_MAJOR_HEADING + 40;
        } else if (block.type === 'subheading') {
          yPos -= 10;
          page.drawText(block.text, { x: MARGIN_LEFT, y: yPos, size: SIZE_SUB_HEADING, font: boldFont, color: textColor });
          yPos -= SIZE_SUB_HEADING + 25;
        } else {
          const wrappedLines: string[] = wrapText(block.text, USABLE_WIDTH, SIZE_BODY, regularFont);
          for (let i = 0; i < wrappedLines.length; i++) {
            const line: string = wrappedLines[i];
            const isLast: boolean = i === wrappedLines.length - 1;
            
            if (isLast || line.split(' ').length < 3) {
              page.drawText(line, { x: MARGIN_LEFT, y: yPos, size: SIZE_BODY, font: regularFont, color: textColor });
            } else {
              const words: string[] = line.split(' ');
              const wordWidths: number[] = words.map(w => regularFont.widthOfTextAtSize(w, SIZE_BODY));
              const totalWordWidth: number = wordWidths.reduce((a, b) => a + b, 0);
              const spaceWidth: number = (USABLE_WIDTH - totalWordWidth) / (words.length - 1);
              let xPos: number = MARGIN_LEFT;
              for (let j = 0; j < words.length; j++) {
                page.drawText(words[j], { x: xPos, y: yPos, size: SIZE_BODY, font: regularFont, color: textColor });
                xPos += wordWidths[j] + (j < words.length - 1 ? spaceWidth : 0);
              }
            }
            yPos -= LINE_HEIGHT_BODY;
          }
          yPos -= 20;
        }
      }
    }
    
    return await pdfDoc.save();
    
  } catch (error) {
    console.error('PDF Error:', error);
    throw error;
  }
}

function wrapText(text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] {
  const words: string[] = text.split(' ');
  const lines: string[] = [];
  let line: string = '';
  
  for (const word of words) {
    const test: string = line + (line ? ' ' : '') + word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  
  if (line) lines.push(line);
  return lines;
}

export function createPDFBlobUrl(pdfBytes: Uint8Array): string {
  // DEFINITIVE FIX: Use .slice().buffer to create a clean copy of the ArrayBuffer.
  const blob: Blob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  // DEFINITIVE FIX: Use .slice().buffer to create a clean copy of the ArrayBuffer.
  const blob: Blob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
  const url: string = URL.createObjectURL(blob);
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}