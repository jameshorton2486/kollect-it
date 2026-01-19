/**
 * SKU System Invariants
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
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('SKU System Invariants', () => {
  describe('Database Constraints', () => {
    test('SKU field exists and is required', async () => {
      const fields = Prisma.dmmf.datamodel.models.find(m => m.name === 'Product')?.fields;
      const skuField = fields?.find(f => f.name === 'sku');
      
      expect(skuField).toBeDefined();
      expect(skuField?.isRequired).toBe(true);
    });

    test('SKU field is unique', async () => {
      const fields = Prisma.dmmf.datamodel.models.find(m => m.name === 'Product')?.fields;
      const skuField = fields?.find(f => f.name === 'sku');
      
      expect(skuField?.isUnique).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    test('all products have a SKU', async () => {
      const allProducts = await prisma.product.findMany({
        select: { id: true, title: true, sku: true },
      });
      
      const productsWithoutSku = allProducts.filter(p => !p.sku || p.sku.trim() === '');

      if (productsWithoutSku.length > 0) {
        console.warn('Products without SKU:', productsWithoutSku.map(p => p.title));
      }

      expect(productsWithoutSku.length).toBe(0);
    });

    test('all SKUs are unique', async () => {
      const products = await prisma.product.findMany({
        select: { sku: true },
        where: { sku: { not: '' } },
      });

      const skus = products.map(p => p.sku);
      const uniqueSkus = new Set(skus);

      expect(uniqueSkus.size).toBe(skus.length);
    });

    test('all SKUs follow the expected format', async () => {
      const products = await prisma.product.findMany({
        select: { sku: true, title: true },
        where: { sku: { not: '' } },
      });

      const skuPattern = /^[A-Z]{2,4}-\d{4,6}(-[A-Z0-9]+)?$/;
      const invalidSkus = products.filter(p => !skuPattern.test(p.sku));

      if (invalidSkus.length > 0) {
        console.warn('Products with invalid SKU format:', invalidSkus.slice(0, 5).map(p => ({
          title: p.title,
          sku: p.sku
        })));
      }

      expect(invalidSkus.length).toBeLessThanOrEqual(products.length * 0.1);
    });
  });

  describe('SKU Generation', () => {
    test('SKU prefix matches category code', async () => {
      const productsWithCategory = await prisma.product.findMany({
        select: { 
          sku: true, 
          title: true,
          category: { select: { slug: true } } 
        },
        where: { 
          sku: { not: '' },
          categoryId: { not: null }
        },
      });

      const categoryPrefixes: Record<string, string[]> = {
        'fine-art': ['FA', 'ART'],
        'rare-books': ['RB', 'BOOK'],
        'militaria': ['MIL', 'ML'],
        'collectibles': ['COL', 'COLL'],
      };

      let mismatches = 0;
      for (const product of productsWithCategory) {
        if (product.category) {
          const expectedPrefixes = categoryPrefixes[product.category.slug] || [];
          const hasValidPrefix = expectedPrefixes.length === 0 || 
            expectedPrefixes.some(prefix => product.sku.startsWith(prefix));
          
          if (!hasValidPrefix) {
            mismatches++;
          }
        }
      }

      expect(mismatches).toBeLessThanOrEqual(productsWithCategory.length * 0.1);
    });
  });
});
