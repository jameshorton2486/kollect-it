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
      AND: [],
    };

    // Search query
    if (query) {
      where.AND.push({
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    // Category filter
    if (categories.length > 0) {
      where.AND.push({
        categoryId: { in: categories },
      });
    }

    // Condition filter
    if (conditions.length > 0) {
      where.AND.push({
        condition: { in: conditions },
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.AND.push({ price: priceFilter });
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
          category: {
            select: {
              name: true,
            },
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

