import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiters } from "@/lib/rate-limit";
import { securityMiddleware, applySecurityHeaders } from "@/lib/security";
import { validateSKU } from "@/lib/utils/image-parser";

export async function POST(req: NextRequest) {
  try {
    // Apply security middleware with 5MB body limit for product creation
    const securityCheck = await securityMiddleware(req, {
      maxBodySize: 5 * 1024 * 1024, // 5MB
      allowedContentTypes: ["application/json"],
    });
    if (securityCheck) return securityCheck;

    // Apply standard rate limiting for admin operations
    const rateLimitCheck = await rateLimiters.standard(req);
    if (rateLimitCheck) return rateLimitCheck;

    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      const errorResponse = NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
      return applySecurityHeaders(errorResponse);
    }

    const body = await req.json();
    const {
      sku,                    // ✨ NEW: Required SKU
      imageUrls = [],         // ✨ NEW: Array of image URLs with metadata
      category,
      categoryId,
      subcategoryId,
      title,
      description,
      shortDescription,
      estimatedEra,
      rarity,
      authenticity,
      suggestedPrice,
      seoTitle,
      seoDescription,
      aiAnalysis,
      isDraft = true,
      productNotes,           // ✨ NEW: Raw notes
      appraisalUrls = [],     // ✨ NEW: PDF links
      appraisalDocUrl,       // ✨ NEW: Uploaded appraisal document URL
      provenanceDocUrl,       // ✨ NEW: Uploaded provenance document URL
    } = body;

    console.log(`\n📦 [API] Create product request`);
    console.log(`   Admin: ${session.user?.email}`);
    console.log(`   SKU: ${sku}`);
    console.log(`   Title: "${title}"`);

    // Validate required fields
    const required = ["sku", "title", "category"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate SKU format
    const skuValidation = validateSKU(sku);
    if (!skuValidation.valid) {
      return NextResponse.json(
        { error: skuValidation.error },
        { status: 400 },
      );
    }

    // Check SKU uniqueness
    const existingSKU = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSKU) {
      return NextResponse.json(
        { error: `SKU ${sku} already exists` },
        { status: 400 },
      );
    }

    // Find category by ID or name
    let categoryRecord;
    if (categoryId) {
      categoryRecord = await prisma.category.findUnique({
        where: { id: categoryId },
      });
    } else if (category) {
      categoryRecord = await prisma.category.findFirst({
        where: { name: category },
      });
    }

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category not found: ${categoryId || category}` },
        { status: 400 },
      );
    }

    // Validate subcategory if provided
    if (subcategoryId) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId },
      });
      if (!subcategory || subcategory.categoryId !== categoryRecord.id) {
        return NextResponse.json(
          { error: `Invalid subcategory for category` },
          { status: 400 },
        );
      }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check slug uniqueness (add random suffix if needed)
    let finalSlug = slug;
    let slugExists = await prisma.product.findUnique({
      where: { slug: finalSlug },
    });

    if (slugExists) {
      finalSlug = `${slug}-${Date.now().toString().slice(-6)}`;
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        sku,
        skuYear: skuValidation.parsed!.year,
        skuNumber: skuValidation.parsed!.number,
        title,
        slug: finalSlug,
        description: description || shortDescription,
        price: suggestedPrice || 0,
        categoryId: categoryRecord.id,
        subcategoryId: subcategoryId || null,
        productNotes,
        appraisalUrls,
        appraisalDocUrl: appraisalDocUrl || null,
        provenanceDocUrl: provenanceDocUrl || null,
        
        // AI-generated fields
        estimatedEra,
        rarity,
        authenticity,
        calculatedPrice: suggestedPrice,
        seoTitle,
        seoDescription,
        aiAnalysis,
        isDraft,

        // Create images relation
        images: {
          create: imageUrls.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || `${title} - Image ${index + 1}`,
            imageType: img.type || "additional",
            order: img.order !== undefined ? img.order : index,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    console.log(`✅ [API] Product created: ${product.sku} - ${product.title}`);
    const response = NextResponse.json({
      success: true,
      product,
      message: `Product ${sku} created successfully`,
    });
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("❌ [API] Create product error:", error);
    const errorResponse = NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

