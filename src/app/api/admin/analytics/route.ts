/**
 * Admin Analytics API Endpoint
 * Phase 4 - GET /api/admin/analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAnalyticsSummary } from '@/lib/analytics/queries';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const category = searchParams.get('category') || undefined;
    const statusParam = searchParams.get('status');
    
    // Validate status parameter
    let status: 'APPROVED' | 'REJECTED' | 'ALL' | undefined;
    if (statusParam === 'APPROVED' || statusParam === 'REJECTED' || statusParam === 'ALL') {
      status = statusParam;
    }

    // Get analytics summary
    const analytics = await getAnalyticsSummary({
      startDate,
      endDate,
      category,
      status,
    });

    return NextResponse.json(analytics, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
