import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatSKU, getSuggestedPrefix } from "@/lib/domain/sku";

/**
 * GET /api/admin/products/next-sku?year=2025&category=collectibles
 * Returns the next available SKU for the given year
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get year + category from query params
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const categoryParam = searchParams.get("category");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 2020 || year > currentYear + 1) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // Find the highest SKU number for this year + prefix
    const prefix = categoryParam ? getSuggestedPrefix(categoryParam) : "KOL";
    const latestProduct = await prisma.product.findFirst({
      where: {
        skuYear: year,
        sku: { startsWith: `${prefix}-${year}-` },
      },
      orderBy: { skuNumber: "desc" },
      select: { skuNumber: true },
    });

    const nextNumber = (latestProduct?.skuNumber || 0) + 1;
    const suggestedSKU = formatSKU(prefix, year, nextNumber);

    return NextResponse.json({
      suggestedSKU,
      prefix,
      year,
      nextNumber,
      message: `Next available SKU for ${year}`,
    });
  } catch (error) {
    console.error("Error generating next SKU:", error);
    return NextResponse.json(
      { error: "Failed to generate SKU" },
      { status: 500 }
    );
  }
}
