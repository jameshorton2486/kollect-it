// src/app/api/admin/products/ingest/route.ts
// Product Ingestion API - Receives products from Desktop App
// Creates products as DRAFT for admin review
// 
// FIX APPLIED: status changed from 'active' to 'draft' to prevent public visibility
// FIX APPLIED: SKU validation now accepts PREFIX-YYYY-NNNN format (3-4 letter category prefix)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from "@prisma/client";

// Service API key for desktop app authentication
// Add to .env: PRODUCT_INGEST_API_KEY=your-secure-key-here
const INGEST_API_KEY = process.env.PRODUCT_INGEST_API_KEY;

// Payload schema from desktop app
interface IngestPayload {
  sku: string;
  title: string;
  description: string;
  price: number;
  condition?: string;
  category: string;        // Category slug or name
  subcategory?: string;    // Subcategory slug or name
  images: {
    url: string;
    alt?: string;
    order: number;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  era?: string;
  year?: string;
  artist?: string;
  medium?: string;
  period?: string;
  rarity?: string;
  productNotes?: string;
  origin?: string;
  source?: string;
  aiAnalysis?: Record<string, unknown>;
  priceConfidence?: number;
  pricingReasoning?: string;
  last_valuation?: {
    low: number;
    high: number;
    recommended: number;
    confidence: string;
    notes?: string;
  };
}

// Generate URL-safe slug from title
function generateSlug(title: string, sku: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);

  // Append SKU for uniqueness
  return `${baseSlug}-${sku.toLowerCase()}`;
}

// Validate the incoming payload
function validatePayload(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const payload = data as Partial<IngestPayload>;

  if (!payload.sku || typeof payload.sku !== 'string') {
    errors.push('Missing or invalid SKU');
  }
  if (!payload.title || typeof payload.title !== 'string') {
    errors.push('Missing or invalid title');
  }
  if (!payload.description || typeof payload.description !== 'string') {
    errors.push('Missing or invalid description');
  }
  if (typeof payload.price !== 'number' || payload.price < 0) {
    errors.push('Missing or invalid price');
  }
  if (!payload.category || typeof payload.category !== 'string') {
    errors.push('Missing or invalid category');
  }
  if (!payload.images || !Array.isArray(payload.images) || payload.images.length === 0) {
    errors.push('At least one image is required');
  }

  return { valid: errors.length === 0, errors };
}

// =============================================================================
// UNIFIED SKU VALIDATION - Accepts PREFIX-YYYY-NNNN format
// Supports both desktop app format (MILI-2025-0001) and KOL format (KOL-2025-0001)
// =============================================================================
function validateSkuFormat(sku: string): { valid: boolean; error?: string; parsed?: { prefix: string; year: number; sequence: number } } {
  // Pattern: 3-4 uppercase letters, hyphen, 4-digit year (2020-2099), hyphen, 4-digit sequence
  const SKU_PATTERN = /^([A-Z]{3,4})-(\d{4})-(\d{4})$/;
  
  const match = sku.toUpperCase().match(SKU_PATTERN);
  
  if (!match) {
    return {
      valid: false,
      error: `Invalid SKU format: "${sku}". Expected format: PREFIX-YYYY-NNNN (e.g., MILI-2026-0001, COLL-2025-0042, KOL-2026-0001)`
    };
  }
  
  const prefix = match[1] as string;
  const yearStr = match[2] as string;
  const sequenceStr = match[3] as string;
  
  const year = parseInt(yearStr, 10);
  const sequence = parseInt(sequenceStr, 10);
  const currentYear = new Date().getFullYear();
  
  // Validate year range
  if (year < 2020 || year > currentYear + 1) {
    return {
      valid: false,
      error: `SKU year ${year} is invalid. Must be between 2020 and ${currentYear + 1}`
    };
  }
  
  // Validate sequence (must be 1-9999)
  if (sequence < 1 || sequence > 9999) {
    return {
      valid: false,
      error: `SKU sequence ${sequence} is invalid. Must be between 0001 and 9999`
    };
  }
  
  return { 
    valid: true,
    parsed: { prefix, year, sequence }
  };
}

export async function POST(request: NextRequest) {
  try {
    // =========================================
    // 1. Authenticate request
    // =========================================
    const authHeader = request.headers.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '');

    if (!INGEST_API_KEY) {
      console.error('[INGEST] PRODUCT_INGEST_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!providedKey || providedKey !== INGEST_API_KEY) {
      console.warn('[INGEST] Unauthorized request attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // =========================================
    // 2. Parse and validate payload
    // =========================================
    const payload: IngestPayload = await request.json();

    const validation = validatePayload(payload);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // =========================================
    // 2b. Validate SKU format (UNIFIED - accepts PREFIX-YYYY-NNNN)
    // =========================================
    const skuValidation = validateSkuFormat(payload.sku);
    if (!skuValidation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid SKU format',
          message: skuValidation.error,
          expectedFormat: 'PREFIX-YYYY-NNNN',
          examples: ['MILI-2026-0001', 'COLL-2025-0042', 'BOOK-2025-0001', 'KOL-2026-0001']
        },
        { status: 400 }
      );
    }

    console.log(`[INGEST] Processing product: ${payload.sku}`);

    // =========================================
    // 3. Check for duplicate SKU
    // =========================================
    const existingProduct = await prisma.product.findUnique({
      where: { sku: payload.sku.toUpperCase() }
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: 'Duplicate SKU',
          message: `Product with SKU ${payload.sku} already exists`,
          existingProductId: existingProduct.id,
          adminUrl: `/admin/products/${existingProduct.id}/edit`
        },
        { status: 409 }
      );
    }

    // =========================================
    // 4. Look up category
    // =========================================
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: payload.category.toLowerCase() },
          { name: { equals: payload.category, mode: 'insensitive' } }
        ]
      }
    });

    if (!category) {
      // List available categories for debugging
      const categories = await prisma.category.findMany({
        select: { name: true, slug: true }
      });

      return NextResponse.json(
        {
          error: 'Category not found',
          providedCategory: payload.category,
          availableCategories: categories
        },
        { status: 400 }
      );
    }

    // =========================================
    // 5. Look up subcategory (optional)
    // =========================================
    let subcategoryId: string | null = null;

    if (payload.subcategory) {
      const subcategory = await prisma.subcategory.findFirst({
        where: {
          categoryId: category.id,
          OR: [
            { slug: payload.subcategory.toLowerCase() },
            { name: { equals: payload.subcategory, mode: 'insensitive' } }
          ]
        }
      });

      if (subcategory) {
        subcategoryId = subcategory.id;
      }
    }

    // =========================================
    // 6. Generate unique slug
    // =========================================
    let slug = generateSlug(payload.title, payload.sku);

    // Ensure slug is unique
    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // =========================================
    // 7. Parse SKU components (from validated data)
    // =========================================
    const skuYear = skuValidation.parsed?.year ?? null;
    const skuNumber = skuValidation.parsed?.sequence ?? null;

    // =========================================
    // 8. Build AI analysis JSON
    // =========================================
    const aiAnalysis = payload.aiAnalysis || {};

    if (payload.last_valuation) {
      (aiAnalysis as Record<string, unknown>).valuation = payload.last_valuation;
    }

    const normalizedAiAnalysis: Prisma.InputJsonValue | undefined =
      Object.keys(aiAnalysis).length > 0
        ? (aiAnalysis as Prisma.InputJsonValue)
        : undefined;

    // =========================================
    // 9. Create product (as DRAFT)
    // =================================================================
    // CRITICAL FIX: status is now 'draft' not 'active'
    // This prevents draft products from appearing in public listings
    // =================================================================
    const product = await prisma.product.create({
      data: {
        sku: payload.sku.toUpperCase(),
        title: payload.title,
        slug: slug,
        description: payload.description,
        price: payload.price,
        categoryId: category.id,
        subcategoryId: subcategoryId,
        condition: payload.condition || null,
        year: payload.year || payload.era || null,
        artist: payload.artist || null,
        medium: payload.medium || null,
        period: payload.period || payload.era || null,
        rarity: payload.rarity || null,
        productNotes: payload.productNotes || null,
        origin: payload.origin || null,
        source: payload.source || null,
        seoTitle: payload.seoTitle || payload.title,
        seoDescription: payload.seoDescription || payload.description.substring(0, 160),
        keywords: payload.seoKeywords || [],
        aiAnalysis: normalizedAiAnalysis,
        priceConfidence: payload.priceConfidence || null,
        pricingReasoning: payload.pricingReasoning || null,
        estimatedEra: payload.era || null,

        // =================================================================
        // CRITICAL FIX: Draft products now have status: 'draft'
        // Public API filters on status: 'active', so drafts won't appear
        // =================================================================
        isDraft: true,
        status: 'draft',  // <-- CHANGED from 'active' to 'draft'
        featured: false,

        // SKU parsing
        skuYear: skuYear,
        skuNumber: skuNumber,
      }
    });

    console.log(`[INGEST] Created draft product: ${product.id}`);

    // =========================================
    // 10. Create images
    // =========================================
    if (payload.images && payload.images.length > 0) {
      const imageData = payload.images.map((img, index) => ({
        url: img.url,
        alt: img.alt || `${payload.title} - Image ${index + 1}`,
        order: img.order ?? index,
        productId: product.id,
        imageType: index === 0 ? 'primary' : 'gallery'
      }));

      await prisma.image.createMany({
        data: imageData
      });

      console.log(`[INGEST] Created ${imageData.length} images`);
    }

    // =========================================
    // 11. Return success response
    // =========================================
    const adminUrl = `/admin/products/${product.id}/edit`;
    const publicUrl = `/products/${product.slug}`;

    console.log(`[INGEST] ✓ Product ingested successfully: ${payload.sku}`);

    return NextResponse.json({
      success: true,
      message: 'Product created as draft (not publicly visible until approved)',
      product: {
        id: product.id,
        sku: product.sku,
        title: product.title,
        slug: product.slug,
        isDraft: product.isDraft,
        status: product.status,  // Now 'draft'
        price: product.price,
        imageCount: payload.images.length
      },
      urls: {
        admin: adminUrl,
        adminFull: `https://kollect-it.com${adminUrl}`,
        public: publicUrl,
        publicFull: `https://kollect-it.com${publicUrl}`
      },
      nextStep: 'Review and publish in admin panel (change status to active)'
    }, { status: 201 });

  } catch (error) {
    console.error('[INGEST] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Check API status
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const providedKey = authHeader?.replace('Bearer ', '');

  if (!providedKey || providedKey !== INGEST_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return available categories for desktop app
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      subcategories: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  return NextResponse.json({
    status: 'ok',
    version: '1.1.0',  // Version bump for fix
    skuFormat: 'PREFIX-YYYY-NNNN',
    skuExamples: ['MILI-2026-0001', 'COLL-2025-0042', 'BOOK-2025-0001'],
    categories: categories
  });
}
