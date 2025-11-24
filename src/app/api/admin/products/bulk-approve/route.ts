/**
 * POST /api/admin/products/bulk-approve
 * Bulk approve multiple AI-generated products
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface BulkApproveRequest {
  productIds: string[];
  useSuggestedPrices: boolean; // If true, use AI suggested prices; otherwise user provides override
  priceOverride?: number; // Optional price to use for all products
}

export async function POST(request: NextRequest) {
  try {
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
      categories.map((c) => [c.name.toLowerCase(), c.id]),
    );

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
        let categoryId = categoryMap.get(categoryLower);

        if (!categoryId) {
          // Fallback: find first category that contains the category name
          const matchingCategory = categories.find((c) =>
            c.name.toLowerCase().includes(categoryLower),
          );
          categoryId = matchingCategory?.id;
        }

        if (!categoryId) {
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

        // Generate SKU
        const year = new Date().getFullYear();
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const sku = `${year}-${randomNum}`;

        // Create product
        const product = await prisma.product.create({
          data: {
            title: aiProduct.aiTitle,
            slug,
            description: aiProduct.aiDescription,
            price: finalPrice,
            categoryId,
            condition: aiProduct.aiCondition || "Good",
            status: "active",
            sku: sku,
            skuYear: year,
            skuNumber: randomNum,
          },
        });

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

