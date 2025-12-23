import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatSKU } from "@/lib/utils/image-parser";

/**
 * GET /api/admin/products/next-sku?year=2025
 * Returns the next available SKU for the given year
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get year from query params
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 2020 || year > currentYear + 1) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // Find the highest SKU number for this year
    const latestProduct = await prisma.product.findFirst({
      where: { skuYear: year },
      orderBy: { skuNumber: "desc" },
      select: { skuNumber: true },
    });

    const nextNumber = (latestProduct?.skuNumber || 0) + 1;
    const suggestedSKU = formatSKU(year, nextNumber);

    return NextResponse.json({
      suggestedSKU,
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
