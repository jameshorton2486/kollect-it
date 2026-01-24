/**
 * GET /api/admin/products/history
 * Fetch approval history for AI-generated products
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "10"));
    const status = searchParams.get("status"); // APPROVED or REJECTED
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (status && ["APPROVED", "REJECTED"].includes(status)) {
      query.status = status;
    } else if (status) {
      // If status is provided but not valid, return error
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED" },
        { status: 400 },
      );
    }

    // Date range filter
    if (startDate || endDate) {
      query.reviewedAt = {};
      if (startDate) {
        (query.reviewedAt as any).gte = new Date(startDate);
      }
      if (endDate) {
        (query.reviewedAt as any).lte = new Date(endDate);
      }
    }

    // Only get products that have been reviewed
    (query as any).reviewedAt = {
      ...(query as any).reviewedAt,
      not: null,
    };

    // Fetch products
    const products = await (prisma as any).aIGeneratedProduct.findMany({
      where: query,
      orderBy: { reviewedAt: "desc" },
      skip,
      take: limit,
    });

    const total = await (prisma as any).aIGeneratedProduct.count({
      where: query,
    });

    // Format response
    const formattedProducts = products.map((p: any) => ({
      id: p.id,
      aiTitle: p.aiTitle,
      aiCategory: p.aiCategory,
      suggestedPrice: p.suggestedPrice,
      status: p.status,
      reviewedBy: p.reviewedBy,
      reviewedAt: p.reviewedAt,
      rejectionReason: p.rejectionReason,
      productId: p.productId, // Link to created product if approved
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[History API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

