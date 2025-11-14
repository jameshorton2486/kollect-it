import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Seller Inquiry Notes API
 * Phase 6 Step 5 - Add admin notes to inquiries
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { note } = body;

    // In production, save to database here
    console.log(`Adding note to inquiry ${params.id}: ${note}`);

    return NextResponse.json({
      success: true,
      note: {
        id: Date.now().toString(),
        inquiryId: params.id,
        note,
        createdAt: new Date().toISOString(),
        createdBy: session.user.email,
      },
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
