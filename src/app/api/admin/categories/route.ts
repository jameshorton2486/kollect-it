import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-admin";

/**
 * GET /api/admin/categories - List all categories
 * Public endpoint for category listing on frontend
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[Category Fetch Error]", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: isDevelopment ? errorMessage : "Failed to fetch categories",
        code: "FETCH_ERROR",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/categories - Create new category
 * Requires admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // Require authentication for create operation
    await requireAdminAuth();

    const body = await req.json();
    const { name, slug, description } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required", code: "MISSING_NAME" },
        { status: 400 },
      );
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Category slug is required", code: "MISSING_SLUG" },
        { status: 400 },
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "Category description is required",
          code: "MISSING_DESCRIPTION",
        },
        { status: 400 },
      );
    }

    // Check if category already exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ slug: slug.toLowerCase() }, { name: name.toLowerCase() }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Category with this name or slug already exists",
          code: "DUPLICATE_CATEGORY",
        },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description.trim(),
        image: "",
      },
    });

    return NextResponse.json(
      { data: category, message: "Category created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized", code: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[Category Create Error]", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: isDevelopment ? errorMessage : "Failed to create category",
        code: "CREATE_ERROR",
      },
      { status: 500 },
    );
  }
}

