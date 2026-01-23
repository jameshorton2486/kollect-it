import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "relevance";
    const categories = searchParams.getAll("category");
    const conditions = searchParams.getAll("condition");
    const minPrice = searchParams.get("price.0");
    const maxPrice = searchParams.get("price.1");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    // Build where clause
    const where: any = {
      status: "active",
      isDraft: false,
    };

    const andConditions: any[] = [];

    // Search query
    if (query && query.trim()) {
      andConditions.push({
        OR: [
          { title: { contains: query.trim(), mode: "insensitive" } },
          { description: { contains: query.trim(), mode: "insensitive" } },
        ],
      });
    }

    // Category filter
    if (categories.length > 0) {
      andConditions.push({
        categoryId: { in: categories },
      });
    }

    // Condition filter
    if (conditions.length > 0) {
      andConditions.push({
        condition: { in: conditions },
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      andConditions.push({ price: priceFilter });
    }

    // Only add AND if there are conditions
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Sort options
    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { createdAt: "desc" }; // fallback since we don't have views
        break;
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          Category: {
            select: {
              name: true,
            },
          },
          Image: {
            select: {
              url: true,
              alt: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      filters: [], // Can add dynamic filter counts here
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
