import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/auth-helpers";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/request-context";
import { respondError } from "@/lib/api-error";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";
import { cache, cacheKeys, cacheTTL } from "@/lib/cache";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    // Apply relaxed rate limiting for public product listing
    const rateLimitCheck = await rateLimiters.relaxed(request);
    if (rateLimitCheck) return rateLimitCheck;

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") ?? undefined;
    const limitStr = searchParams.get("limit");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q") ?? undefined;

    // Generate cache key for this query
    const cacheKey = cacheKeys.products({
      category,
      limit: limitStr,
      featured,
      q,
    });

    // Check cache first
    const cached = cache.get<any>(cacheKey);
    if (cached) {
      logger.info("[Cache] Product list cache hit", {
        requestId: getRequestId(request),
      });
      const response = NextResponse.json(cached);
      response.headers.set("X-Request-ID", getRequestId(request));
      response.headers.set("X-Cache", "HIT");
      return applySecurityHeaders(response);
    }

    const where: Prisma.ProductWhereInput = {
      status: "active",
    };

    if (category) {
      where.category = { slug: category };
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (q) {
      where.title = { contains: q, mode: "insensitive" };
    }

    const take = limitStr ? parseInt(limitStr, 10) : undefined;

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take,
    });

    // Cache the product list results
    cache.set(cacheKey, products, cacheTTL.medium); // 5-minute cache

    const res = NextResponse.json(products);
    res.headers.set("X-Request-ID", getRequestId(request));
    // Cache for 60s at the edge/CDN and allow stale while revalidate
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    // Rate limit headers are now set by rateLimiters.relaxed()
    return applySecurityHeaders(res);
  } catch (error) {
    logger.error(
      "Error fetching products",
      { requestId: getRequestId(request) },
      error,
    );
    return respondError(request, error, {
      status: 500,
      code: "products_fetch_failed",
    });
  }
}

interface ImageInput {
  url: string;
  alt?: string;
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      condition,
      year,
      artist,
      medium,
      period,
      featured,
      images,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const skuYear = new Date().getFullYear();
    const skuNumber = Math.floor(10000 + Math.random() * 90000);
    const sku = `${skuYear}-${skuNumber}`;

    const product = await prisma.product.create({
      data: {
        sku,
        skuYear,
        skuNumber,
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured: featured || false,
        images: {
          create:
            (images as ImageInput[] | undefined)?.map((img, index) => ({
              url: img.url,
              alt: img.alt || title,
              order: index,
            })) || [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    const res = NextResponse.json(product, { status: 201 });
    res.headers.set("X-Request-ID", getRequestId(request));
    return res;
  } catch (error) {
    logger.error(
      "Error creating product",
      { requestId: getRequestId(request) },
      error,
    );
    return respondError(request, error, {
      status: 500,
      code: "products_create_failed",
    });
  }
}

