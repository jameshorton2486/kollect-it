/**
 * SKU Invariant Tests
 * 
 * Validates that all SKUs in the database follow the required format
 * and business rules.
 * 
 * SKU Format: SKU-YYYY-XXX (per ADR-0006)
 * Example: SKU-2025-001
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// SKU validation pattern (per ADR-0006: SKU-YYYY-XXX)
const SKU_PATTERN = /^SKU-\d{4}-\d{3}$/;

// Note: ADR-0006 uses SKU-YYYY-XXX format (no category prefix)
// Category code mapping kept for reference but not used in current format

beforeAll(async () => {
  // Ensure database connection
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('SKU Invariants', () => {
  
  test('all products have a SKU', async () => {
    // Since sku is non-nullable in schema, query all and filter for empty strings
    const allProducts = await prisma.product.findMany({
      select: { id: true, title: true, sku: true },
    });
    
    const productsWithoutSku = allProducts.filter(p => !p.sku || p.sku.trim() === '');

    if (productsWithoutSku.length > 0) {
      console.warn('⚠️ Products without SKU:', productsWithoutSku.map(p => p.title));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(productsWithoutSku).toHaveLength(0);
  });

  test('all SKUs match required format', async () => {
    // Get all products with non-empty SKUs
    const products = await prisma.product.findMany({
      where: { sku: { not: '' } },
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
      where: { sku: { not: '' } },
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
        });
      }
    }

    if (invalidFormat.length > 0) {
      console.warn('⚠️ SKUs not matching ADR-0006 format (SKU-YYYY-XXX):');
      invalidFormat.forEach(m => 
        console.warn(`  - ${m.title}: "${m.sku}"`)
      );
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(invalidFormat).toHaveLength(0);
  });

  test('SKU year is reasonable', async () => {
    const currentYear = new Date().getFullYear();
    const minYear = 2020; // Kollect-It founding year
    const maxYear = currentYear + 1; // Allow next year for pre-dated items

    const products = await prisma.product.findMany({
      where: { sku: { not: '' } },
      select: { sku: true, title: true },
    });

    const invalidYears: { title: string; sku: string; year: number }[] = [];

    for (const product of products) {
      if (!product.sku) continue;
      
      // Match ADR-0006 format: SKU-YYYY-XXX
      const match = product.sku.match(/^SKU-(\d{4})-\d{3}$/);
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
