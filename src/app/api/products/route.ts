import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/auth-helpers";
import { validateSKU, formatSKU as formatSkuNew } from "@/lib/domain/sku";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/request-context";
import { respondError } from "@/lib/api-error";
import { rateLimiters } from "@/lib/rate-limit";
import { securityMiddleware, applySecurityHeaders } from "@/lib/security";
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
    const cached = await cache.get<any>(cacheKey);
    if (cached) {
      logger.info("[Cache] Product list cache hit", {
        requestId: getRequestId(request),
      });
      const response = NextResponse.json(cached);
      response.headers.set("X-Request-ID", getRequestId(request));
      response.headers.set("X-Cache", "HIT");
      return applySecurityHeaders(response);
    }

    // =================================================================
    // CRITICAL FIX: Filter out draft products from public listings
    // Defense-in-depth: check both status AND isDraft
    // =================================================================
    const where: Prisma.ProductWhereInput = {
      status: "active",
      isDraft: false,  // <-- ADDED: Explicit draft exclusion
    };

    if (category) {
      // First find category by slug, then filter by categoryId
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
        select: { id: true },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      } else {
        // If category not found, return empty results
        where.categoryId = "non-existent-id";
      }
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
        Image: { orderBy: { order: "asc" } },
        Category: true,
      },
      orderBy: { createdAt: "desc" },
      take,
    });

    // Cache the product list results
    await cache.set(cacheKey, products, cacheTTL.medium); // 5-minute cache

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
  const securityCheck = await securityMiddleware(request, {
    maxBodySize: 5 * 1024 * 1024,
    allowedContentTypes: ["application/json"],
  });
  if (securityCheck) return securityCheck;

  const rateLimitCheck = await rateLimiters.standard(request);
  if (rateLimitCheck) return rateLimitCheck;

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
      sku: providedSku,  // Allow admin to provide SKU
      categoryPrefix,    // Allow admin to specify category prefix
      origin,
      source,
    } = body;

    // Required fields
    const required = ["title", "categoryId"] as const;
    for (const field of required) {
      if (body[field] == null || body[field] === "") {
        const res = NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
        return applySecurityHeaders(res);
      }
    }

    // Price: must be present and numeric
    if (price == null || price === "") {
      const res = NextResponse.json(
        { error: "Missing required field: price" },
        { status: 400 }
      );
      return applySecurityHeaders(res);
    }
    const priceNum = parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      const res = NextResponse.json(
        { error: "Invalid price: must be a non-negative number" },
        { status: 400 }
      );
      return applySecurityHeaders(res);
    }

    // Generate slug from title and handle collision
    const baseSlug = (title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    let slugExists = await prisma.product.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    }

    // =================================================================
    // SKU GENERATION - Use unified format (PREFIX-YYYY-NNNN)
    // =================================================================
    let sku: string;
    let skuYear: number;
    let skuNumber: number;

    const hasProvidedSku = "sku" in body;

    if (hasProvidedSku) {
      const validation = validateSKU(providedSku);
      if (!validation.valid) {
        const res = NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
        return applySecurityHeaders(res);
      }
      sku = validation.parsed!.formatted;
      skuYear = validation.parsed!.year;
      skuNumber = validation.parsed!.sequence;
    } else {
      skuYear = new Date().getFullYear();
      const prefix = categoryPrefix || "KOL";
      if (!/^[A-Za-z]{3,4}$/.test(prefix)) {
        const res = NextResponse.json(
          { error: "categoryPrefix must be 3-4 letters when provided" },
          { status: 400 }
        );
        return applySecurityHeaders(res);
      }

      const maxSku = await prisma.product.aggregate({
        _max: { skuNumber: true },
        where: {
          skuYear,
          sku: { startsWith: `${String(prefix).toUpperCase()}-${skuYear}-` },
        },
      });
      skuNumber = (maxSku._max.skuNumber ?? 0) + 1;
      sku = formatSkuNew(prefix, skuYear, skuNumber);
      const generatedValidation = validateSKU(sku);
      if (!generatedValidation.valid) {
        const res = NextResponse.json(
          { error: generatedValidation.error },
          { status: 400 }
        );
        return applySecurityHeaders(res);
      }
    }

    const product = await prisma.product.create({
      data: {
        sku,
        skuYear,
        skuNumber,
        title,
        slug,
        description: description ?? "",
        price: priceNum,
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        origin: origin ?? null,
        source: source ?? null,
        featured: featured || false,
        status: "active",
        isDraft: false,
        Image: {
          create:
            (images as ImageInput[] | undefined)?.map((img, index) => ({
              url: img.url,
              alt: img.alt || title,
              order: index,
            })) || [],
        },
      },
      include: {
        Image: true,
        Category: true,
      },
    });

    const res = NextResponse.json(product, { status: 201 });
    res.headers.set("X-Request-ID", getRequestId(request));
    return applySecurityHeaders(res);
  } catch (error) {
    logger.error(
      "Error creating product",
      { requestId: getRequestId(request) },
      error,
    );
    const errRes = respondError(request, error, {
      status: 500,
      code: "products_create_failed",
    });
    return applySecurityHeaders(errRes);
  }
}
