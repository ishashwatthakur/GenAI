import { NextResponse } from 'next/server';
import geminiDrafter from '@/lib/drafter/geminiClient';

export async function POST(request) {
  try {
    const { draft, documentType, jurisdiction = 'US Federal', playbook } = await request.json();

    // Validate input
    if (!draft) {
      return NextResponse.json(
        { error: 'Draft document is required' },
        { status: 400 }
      );
    }

    // Perform AI review
    const result = await geminiDrafter.reviewDraft(draft, jurisdiction, playbook);

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

  } catch (error) {
    console.error('Draft review error:', error);
    return NextResponse.json(
      { error: 'Internal server error during review' },
      { status: 500 }
    );
  }
}