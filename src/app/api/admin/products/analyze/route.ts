import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateProductAnalysis } from '@/lib/ai/product-generator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const { imageUrl, category } = await req.json();

    if (!imageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing imageUrl or category' },
        { status: 400 }
      );
    }

    console.log(`\n🔍 [API] Analyze request received`);
    console.log(`   Admin: ${session.user.email}`);
    console.log(`   Category: ${category}`);

    // Run AI analysis
    const analysis = await generateProductAnalysis(imageUrl, category);

    console.log(`✅ [API] Analysis complete, returning to client`);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('❌ [API] Analysis endpoint error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Analysis failed - please try again',
      },
      { status: 500 }
    );
  }
}
