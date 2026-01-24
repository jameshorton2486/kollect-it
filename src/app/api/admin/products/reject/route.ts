/**
 * POST /api/admin/products/reject
 * Reject an AI-generated product
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { productId, reason } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required field: productId" },
        { status: 400 },
      );
    }

    // Fetch the AI product
    const aiProduct = await (prisma as any).aIGeneratedProduct.findUnique({
      where: { id: productId },
    });

    if (!aiProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (aiProduct.status !== "PENDING") {
      return NextResponse.json(
        { error: `Cannot reject product with status: ${aiProduct.status}` },
        { status: 400 },
      );
    }

    // Update AI product status
    await (prisma as any).aIGeneratedProduct.update({
      where: { id: productId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "No reason provided",
        reviewedAt: new Date(),
        reviewedBy: "system",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product rejected successfully",
    });
  } catch (error) {
    console.error("[Reject API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to reject product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

