import { NextRequest, NextResponse } from 'next/server';
import geminiDrafter from '@/lib/drafter/geminiClient';

// --- TYPE DEFINITIONS ---

interface ReviewRequestBody {
  draft: string;
  documentType?: string;
  jurisdiction?: string;
  playbook?: any; 
}

// Based on the function call, we can infer the result structure
interface ReviewResult {
    success: boolean;
    review?: any; // The exact structure of 'review' is unknown, so 'any' is used.
    error?: string;
}


// --- API ROUTE ---

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { draft, documentType, jurisdiction = 'US Federal', playbook }: ReviewRequestBody = await request.json();

    // Validate input
    if (!draft) {
      return NextResponse.json(
        { error: 'Draft document is required' },
        { status: 400 }
      );
    }

    // Perform AI review
    const result: ReviewResult = await geminiDrafter.reviewDraft(draft, jurisdiction, playbook);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Review failed' },
        { status: 500 }
      );
    }

    // Return review results
    return NextResponse.json({
      success: true,
      review: result.review
    });

  } catch (error: any) {
    console.error('Draft review error:', error);
    return NextResponse.json(
      { error: 'Internal server error during review' },
      { status: 500 }
    );
  }
}
