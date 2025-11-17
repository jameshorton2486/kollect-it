import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiters } from "@/lib/rate-limit";
import { securityMiddleware, applySecurityHeaders } from "@/lib/security";

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
      imageUrl,
      category,
      title,
      description,
      // Note: These fields will be fully utilized after database migration
      // shortDescription,
      // estimatedEra,
      // rarity,
      // authenticity,
      // investmentPotential,
      // priceReasoning,
      // seoTitle,
      // seoDescription,
      // keywords,
      // aiAnalysis,
      // isDraft = true,
      suggestedPrice,
    } = body;

    console.log(`\n📦 [API] Create product request`);
    console.log(`   Admin: ${session.user?.email}`);
    console.log(`   Title: "${title}"`);

    // Validate required fields
    const required = [
      "imageUrl",
      "category",
      "title",
      "description",
      "suggestedPrice",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Find category by name
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category not found: ${category}` },
        { status: 400 },
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product with similar title already exists" },
        { status: 400 },
      );
    }

    // Create product with image
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: suggestedPrice,
        categoryId: categoryRecord.id,
        images: {
          create: {
            url: imageUrl,
            alt: `${title} - High quality photo`,
          },
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    console.log(`✅ [API] Product created: ${product.id}`);
    const response = NextResponse.json({
      ...product,
      message: "Product created successfully as draft",
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

