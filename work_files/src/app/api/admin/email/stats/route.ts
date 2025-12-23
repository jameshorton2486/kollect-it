import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Email Statistics API
 * Phase 6 Step 7 - Email performance statistics
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mock data - replace with database aggregation in production
    const stats = {
      totalSent: 25678,
      avgOpenRate: 68,
      avgClickRate: 42,
      bounceRate: 2.3,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching email stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch email stats" },
      { status: 500 },
    );
  }
}

