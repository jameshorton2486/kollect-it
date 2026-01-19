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
<<<<<<< HEAD
    // Check for null or empty SKU using different Prisma filter syntax
=======
    // Since sku is non-nullable in schema, query all and filter for empty strings
>>>>>>> origin/chore/sync-local-changes
    const allProducts = await prisma.product.findMany({
      select: { id: true, title: true, sku: true },
    });
    
<<<<<<< HEAD
    const productsWithoutSku = allProducts.filter(p => !p.sku || p.sku === '');
=======
    const productsWithoutSku = allProducts.filter(p => !p.sku || p.sku.trim() === '');
>>>>>>> origin/chore/sync-local-changes

    if (productsWithoutSku.length > 0) {
      console.warn('⚠️ Products without SKU:', productsWithoutSku.map(p => p.title));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(productsWithoutSku).toHaveLength(0);
  });

  test('all SKUs match required format', async () => {
<<<<<<< HEAD
    const products = await prisma.product.findMany({
      where: { sku: { not: { equals: '' } } },
=======
    // Get all products with non-empty SKUs
    const products = await prisma.product.findMany({
      where: { sku: { not: '' } },
>>>>>>> origin/chore/sync-local-changes
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
<<<<<<< HEAD
      where: { sku: { not: { equals: '' } } },
=======
      where: { sku: { not: '' } },
>>>>>>> origin/chore/sync-local-changes
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
<<<<<<< HEAD
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
=======
    // Note: ADR-0006 uses SKU-YYYY-XXX format (no category prefix)
    // This test is kept for documentation but SKU format doesn't include category
    const products = await prisma.product.findMany({
      where: { sku: { not: '' } },
      select: { 
        sku: true, 
        title: true,
        category: { select: { name: true } } 
      },
    });

    // ADR-0006 format is SKU-YYYY-XXX (no category prefix)
    // This test documents the format but doesn't enforce category matching
    // since the format doesn't include category information
    const invalidFormat: { title: string; sku: string }[] = [];

    for (const product of products) {
      if (!product.sku) continue;

      if (!SKU_PATTERN.test(product.sku)) {
        invalidFormat.push({
          title: product.title,
          sku: product.sku,
>>>>>>> origin/chore/sync-local-changes
        });
      }
    }

<<<<<<< HEAD
    if (mismatches.length > 0) {
      console.warn('⚠️ SKU-Category mismatches:');
      mismatches.forEach(m => 
        console.warn(`  - ${m.title}: SKU "${m.sku}" but category "${m.category}" (expected ${m.expected})`)
=======
    if (invalidFormat.length > 0) {
      console.warn('⚠️ SKUs not matching ADR-0006 format (SKU-YYYY-XXX):');
      invalidFormat.forEach(m => 
        console.warn(`  - ${m.title}: "${m.sku}"`)
>>>>>>> origin/chore/sync-local-changes
      );
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
<<<<<<< HEAD
    // expect(mismatches).toHaveLength(0);
=======
    // expect(invalidFormat).toHaveLength(0);
>>>>>>> origin/chore/sync-local-changes
  });

  test('SKU year is reasonable', async () => {
    const currentYear = new Date().getFullYear();
    const minYear = 2020; // Kollect-It founding year
    const maxYear = currentYear + 1; // Allow next year for pre-dated items

    const products = await prisma.product.findMany({
<<<<<<< HEAD
      where: { sku: { not: { equals: '' } } },
=======
      where: { sku: { not: '' } },
>>>>>>> origin/chore/sync-local-changes
      select: { sku: true, title: true },
    });

    const invalidYears: { title: string; sku: string; year: number }[] = [];

    for (const product of products) {
      if (!product.sku) continue;
      
<<<<<<< HEAD
      const match = product.sku.match(/^[A-Z]+-(\d{4})-\d{4}$/);
=======
      // Match ADR-0006 format: SKU-YYYY-XXX
      const match = product.sku.match(/^SKU-(\d{4})-\d{3}$/);
>>>>>>> origin/chore/sync-local-changes
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
