/**
 * POST /api/admin/products/bulk-approve
 * Bulk approve multiple AI-generated products
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatSKU, getSuggestedPrefix } from "@/lib/domain/sku";

interface BulkApproveRequest {
  productIds: string[];
  useSuggestedPrices: boolean; // If true, use AI suggested prices; otherwise user provides override
  priceOverride?: number; // Optional price to use for all products
}

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

    const body = (await request.json()) as BulkApproveRequest;
    const { productIds, useSuggestedPrices, priceOverride } = body;

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: productIds (array)" },
        { status: 400 },
      );
    }

    if (productIds.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 products can be bulk-approved at once" },
        { status: 400 },
      );
    }

    // Fetch all products
    const aiProducts = await (prisma as any).aIGeneratedProduct.findMany({
      where: {
        id: { in: productIds },
        status: "PENDING",
      },
    });

    if (aiProducts.length === 0) {
      return NextResponse.json(
        { error: "No pending products found for the provided IDs" },
        { status: 400 },
      );
    }

    const results = {
      approved: 0,
      failed: 0,
      errors: [] as Array<{ productId: string; error: string }>,
    };

    // Get categories once
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c) => [c.name.toLowerCase(), c]),
    );

    // Get starting SKU number for this year per prefix
    const bulkYear = new Date().getFullYear();
    const nextSkuByPrefix = new Map<string, number>();

    // Process each product
    for (const aiProduct of aiProducts) {
      try {
        const finalPrice =
          priceOverride ??
          (useSuggestedPrices
            ? aiProduct.suggestedPrice
            : aiProduct.suggestedPrice);

        // Find category
        const categoryLower = aiProduct.aiCategory.toLowerCase();
        let category = categoryMap.get(categoryLower);

        if (!category) {
          // Fallback: find first category that contains the category name
          const matchingCategory = categories.find((c) =>
            c.name.toLowerCase().includes(categoryLower),
          );
          category = matchingCategory;
        }

        if (!category) {
          throw new Error(
            `No matching category found for: ${aiProduct.aiCategory}`,
          );
        }

        // Generate slug
        const slug =
          aiProduct.aiTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.random().toString(36).substring(7);

        // Generate SKU using unified format (PREFIX-YYYY-NNNN) with retry on conflicts
        const prefix = getSuggestedPrefix(category.slug || category.name);
        if (!nextSkuByPrefix.has(prefix)) {
          const maxSku = await prisma.product.aggregate({
            _max: { skuNumber: true },
            where: {
              skuYear: bulkYear,
              sku: { startsWith: `${prefix}-${bulkYear}-` },
            },
          });
          nextSkuByPrefix.set(prefix, (maxSku._max.skuNumber || 0) + 1);
        }
        let product;

        for (let attempt = 0; attempt < 3; attempt++) {
          const skuNumber = nextSkuByPrefix.get(prefix)!;
          nextSkuByPrefix.set(prefix, skuNumber + 1);
          const sku = formatSKU(prefix, bulkYear, skuNumber);

          try {
            product = await prisma.product.create({
              data: {
                sku,
                skuYear: bulkYear,
                skuNumber,
                title: aiProduct.aiTitle,
                slug,
                description: aiProduct.aiDescription,
                price: finalPrice,
                categoryId: category.id,
                condition: aiProduct.aiCondition || "Good",
                status: "active",
              },
            });
            break;
          } catch (err: any) {
            if (err?.code === "P2002") {
              const maxSku = await prisma.product.aggregate({
                _max: { skuNumber: true },
                where: {
                  skuYear: bulkYear,
                  sku: { startsWith: `${prefix}-${bulkYear}-` },
                },
              });
              nextSkuByPrefix.set(prefix, (maxSku._max.skuNumber || 0) + 1);
              continue;
            }
            throw err;
          }
        }

        if (!product) {
          throw new Error("Failed to generate unique SKU");
        }

        // Update AI product
        await (prisma as any).aIGeneratedProduct.update({
          where: { id: aiProduct.id },
          data: {
            status: "APPROVED",
            productId: product.id,
            reviewedAt: new Date(),
            reviewedBy: "bulk-system",
          },
        });

        results.approved++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          productId: aiProduct.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Bulk approval complete: ${results.approved} approved, ${results.failed} failed`,
    });
  } catch (error) {
    console.error("[Bulk Approve API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to bulk approve products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
