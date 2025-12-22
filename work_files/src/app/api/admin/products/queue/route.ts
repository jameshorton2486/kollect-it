/**
 * GET /api/admin/products/queue
 * Fetch pending AI-generated products for approval
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "10"));
    const status = searchParams.get("status") || "PENDING";

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    // Fetch products
    const products = await (prisma as any).aIGeneratedProduct.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
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
      aiDescription: p.aiDescription,
      aiCategory: p.aiCategory,
      aiCondition: p.aiCondition,
      suggestedPrice: p.suggestedPrice,
      priceLowRange: p.priceLowRange,
      priceHighRange: p.priceHighRange,
      priceConfidence: p.priceConfidence,
      imageQualityScore: p.imageQualityScore,
      authenticityScore: p.authenticityScore,
      status: p.status,
      reviewedBy: p.reviewedBy,
      reviewedAt: p.reviewedAt,
      createdAt: p.createdAt,
      imageUrl: p.imageUrl,
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Queue API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

