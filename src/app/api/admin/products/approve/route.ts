/**
 * POST /api/admin/products/approve
 * Approve an AI-generated product and create a marketplace product
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-admin";
import { formatSKU, validateSKU } from "@/lib/utils/image-parser";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminAuth();
    if (session instanceof Response) return session;

    const body = await request.json();
    const { productId, finalPrice } = body;

    if (!productId || !finalPrice) {
      return NextResponse.json(
        { error: "Missing required fields: productId, finalPrice" },
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
        { error: `Cannot approve product with status: ${aiProduct.status}` },
        { status: 400 },
      );
    }

    // Create the actual marketplace product
    const category = await prisma.category.findFirst({
      where: {
        name: {
          contains: aiProduct.aiCategory,
          mode: "insensitive",
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category not found: ${aiProduct.aiCategory}` },
        { status: 400 },
      );
    }

    // Generate slug
    const slug = aiProduct.aiTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Generate SKU using centralized format (SKU-YYYY-XXX)
    const year = new Date().getFullYear();
    
    // Get max SKU number for this year to ensure uniqueness
    const maxSku = await prisma.product.aggregate({
      _max: { skuNumber: true },
      where: { skuYear: year }
    });
    const skuNumber = (maxSku._max.skuNumber || 0) + 1;
    const sku = formatSKU(year, skuNumber);

    // Validate SKU format
    const skuValidation = validateSKU(sku);
    if (!skuValidation.valid) {
      return NextResponse.json(
        { error: skuValidation.error },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existingSKU = await prisma.product.findUnique({
      where: { sku },
    });
    if (existingSKU) {
      return NextResponse.json(
        { error: `SKU ${sku} already exists` },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku: sku,
        skuYear: year,
        skuNumber: skuNumber,
        title: aiProduct.aiTitle,
        slug: slug + "-" + Math.random().toString(36).substring(7),
        description: aiProduct.aiDescription,
        price: finalPrice,
        categoryId: category.id,
        condition: aiProduct.aiCondition,
        status: "active",
      },
    });

    // Update AI product status
    await (prisma as any).aIGeneratedProduct.update({
      where: { id: productId },
      data: {
        status: "APPROVED",
        productId: product.id,
        reviewedAt: new Date(),
        reviewedBy: "system", // In real app, would be the logged-in admin user ID
      },
    });

    return NextResponse.json({
      success: true,
      productId: product.id,
      message: "Product approved and created successfully",
    });
  } catch (error) {
    console.error("[Approve API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to approve product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

