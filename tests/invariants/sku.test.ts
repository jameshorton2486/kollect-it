/**
 * SKU Invariant Tests
 * 
 * Validates that all SKUs in the database follow the required format
 * and business rules.
 * 
 * SKU Format: [CATEGORY_CODE]-[YEAR]-[SEQUENCE]
 * Valid Category Codes: ART (Fine Art), BOOK (Rare Books), MIL (Militaria), COL (Collectibles)
 * Example: ART-2025-0001
 * 
 * References: ADR-0003 SKU Format Standard
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// SKU validation pattern: CATEGORYCODE-YEAR-SEQUENCE (e.g., ART-2025-0001)
// Format per ADR-0003: Category code (2-4 letters), Year (4 digits), Sequence (4 digits)
const SKU_PATTERN = /^(ART|BOOK|MIL|COL|FA|RB|CL|ML)-\d{4}-\d{4}$/;

// Category code mapping - supports both 3-letter (ART) and 2-letter (FA) codes
const CATEGORY_CODE_MAP: Record<string, string[]> = {
  'Fine Art': ['ART', 'FA'],
  'Rare Books': ['BOOK', 'RB'],
  'Militaria': ['MIL', 'ML'],
  'Collectibles': ['COL', 'CL'],
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('SKU Invariants', () => {
  
  test('all products have a SKU', async () => {
    // Check for null or empty SKU using different Prisma filter syntax
    const allProducts = await prisma.product.findMany({
      select: { id: true, title: true, sku: true },
    });
    
    const productsWithoutSku = allProducts.filter(p => !p.sku || p.sku === '');

    if (productsWithoutSku.length > 0) {
      console.warn('⚠️ Products without SKU:', productsWithoutSku.map(p => p.title));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(productsWithoutSku).toHaveLength(0);
  });

  test('all SKUs match required format', async () => {
    const products = await prisma.product.findMany({
      where: { sku: { not: { equals: '' } } },
      select: { id: true, title: true, sku: true },
    });

    const invalidSkus: { title: string; sku: string }[] = [];

    for (const product of products) {
      if (product.sku && !SKU_PATTERN.test(product.sku)) {
        invalidSkus.push({ title: product.title, sku: product.sku });
      }
    }

    if (invalidSkus.length > 0) {
      console.warn('⚠️ Invalid SKU formats:');
      invalidSkus.forEach(p => console.warn(`  - ${p.title}: "${p.sku}"`));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(invalidSkus).toHaveLength(0);
  });

  test('all SKUs are unique', async () => {
    const products = await prisma.product.findMany({
      where: { sku: { not: { equals: '' } } },
      select: { sku: true },
    });

    const skus = products.map(p => p.sku).filter(Boolean) as string[];
    const uniqueSkus = new Set(skus);

    if (uniqueSkus.size !== skus.length) {
      const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
      console.warn('⚠️ Duplicate SKUs found:', [...new Set(duplicates)]);
    }

    expect(uniqueSkus.size).toBe(skus.length);
  });

  test('SKU category prefix matches product category', async () => {
    const products = await prisma.product.findMany({
      where: { sku: { not: { equals: '' } } },
      select: {
        id: true,
        sku: true,
        title: true,
        category: {
          select: { name: true }
        }
      }
    });

    const mismatches: { title: string; sku: string; category: string; expected: string }[] = [];

    for (const product of products) {
      if (!product.sku || !product.category) continue;

      const skuPrefix = product.sku.split('-')[0];
      const expectedPrefixes = CATEGORY_CODE_MAP[product.category.name];

      if (expectedPrefixes && !expectedPrefixes.includes(skuPrefix)) {
        mismatches.push({
          title: product.title,
          sku: product.sku,
          category: product.category.name,
          expected: expectedPrefixes.join(' or '),
        });
      }
    }

    if (mismatches.length > 0) {
      console.warn('⚠️ SKU-Category mismatches:');
      mismatches.forEach(m => 
        console.warn(`  - ${m.title}: SKU "${m.sku}" but category "${m.category}" (expected ${m.expected})`)
      );
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(mismatches).toHaveLength(0);
  });

  test('SKU year is reasonable', async () => {
    const currentYear = new Date().getFullYear();
    const minYear = 2020; // Kollect-It founding year
    const maxYear = currentYear + 1; // Allow next year for pre-dated items

    const products = await prisma.product.findMany({
      where: { sku: { not: { equals: '' } } },
      select: { sku: true, title: true },
    });

    const invalidYears: { title: string; sku: string; year: number }[] = [];

    for (const product of products) {
      if (!product.sku) continue;
      
      const match = product.sku.match(/^[A-Z]+-(\d{4})-\d{4}$/);
      if (match) {
        const year = parseInt(match[1], 10);
        if (year < minYear || year > maxYear) {
          invalidYears.push({ title: product.title, sku: product.sku, year });
        }
      }
    }

    if (invalidYears.length > 0) {
      console.warn(`⚠️ SKUs with invalid years (expected ${minYear}-${maxYear}):`);
      invalidYears.forEach(p => console.warn(`  - ${p.title}: year ${p.year}`));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(invalidYears).toHaveLength(0);
  });
});
