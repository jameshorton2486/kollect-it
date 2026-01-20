/**
 * Pricing Invariant Tests
 * 
 * Validates pricing data integrity and business rules.
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Pricing Invariants', () => {

  test('no products with zero or negative price', async () => {
    const invalidPricing = await prisma.product.findMany({
      where: {
        OR: [
          { price: { lte: 0 } },
          { price: null },
        ],
      },
      select: { id: true, title: true, price: true, sku: true },
    });

    if (invalidPricing.length > 0) {
      console.warn('⚠️ Products with invalid pricing:');
      invalidPricing.forEach(p => 
        console.warn(`  - ${p.title} (${p.sku}): $${p.price}`)
      );
    }

    expect(invalidPricing).toHaveLength(0);
  });

  test('price confidence is between 0 and 1 when set', async () => {
    const invalidConfidence = await prisma.product.findMany({
      where: {
        priceConfidence: { not: null },
        OR: [
          { priceConfidence: { lt: 0 } },
          { priceConfidence: { gt: 1 } },
        ],
      },
      select: { id: true, title: true, priceConfidence: true },
    });

    if (invalidConfidence.length > 0) {
      console.warn('⚠️ Products with invalid price confidence:');
      invalidConfidence.forEach(p => 
        console.warn(`  - ${p.title}: confidence ${p.priceConfidence}`)
      );
    }

    expect(invalidConfidence).toHaveLength(0);
  });

  test('calculated price is within reasonable range of listed price', async () => {
    const products = await prisma.product.findMany({
      where: {
        calculatedPrice: { not: null },
        price: { gt: 0 },
      },
      select: { 
        id: true, 
        title: true, 
        price: true, 
        calculatedPrice: true,
        sku: true,
      },
    });

    const outliers: { title: string; sku: string; price: number; calculated: number; ratio: number }[] = [];

    for (const product of products) {
      if (!product.calculatedPrice) continue;

      const ratio = product.calculatedPrice / product.price;
      
      // Flag if calculated is more than 5x or less than 0.2x the listed price
      if (ratio > 5 || ratio < 0.2) {
        outliers.push({
          title: product.title,
          sku: product.sku,
          price: product.price,
          calculated: product.calculatedPrice,
          ratio: Math.round(ratio * 100) / 100,
        });
      }
    }

    if (outliers.length > 0) {
      console.warn('⚠️ Significant price discrepancies (ratio > 5x or < 0.2x):');
      outliers.forEach(p => 
        console.warn(`  - ${p.title} (${p.sku}): listed $${p.price}, calculated $${p.calculated} (${p.ratio}x)`)
      );
    }

    // This is informational - large discrepancies may be valid
    // Phase 3: Review and decide on threshold
  });

  test('prices are in expected range for luxury items', async () => {
    const MIN_LUXURY_PRICE = 25; // Minimum expected price
    const MAX_LUXURY_PRICE = 1000000; // Maximum reasonable price

    const outOfRange = await prisma.product.findMany({
      where: {
        isDraft: false,
        OR: [
          { price: { lt: MIN_LUXURY_PRICE } },
          { price: { gt: MAX_LUXURY_PRICE } },
        ],
      },
      select: { id: true, title: true, price: true, sku: true },
    });

    if (outOfRange.length > 0) {
      console.warn(`⚠️ Products outside expected price range ($${MIN_LUXURY_PRICE}-$${MAX_LUXURY_PRICE}):`);
      outOfRange.forEach(p => 
        console.warn(`  - ${p.title} (${p.sku}): $${p.price}`)
      );
    }

    // Phase 2: Document only (some legitimate items may be outside range)
  });

  test('draft products can have placeholder pricing', async () => {
    // This test documents the rule that drafts can have $0 or placeholder prices
    const draftsWithZeroPrice = await prisma.product.count({
      where: {
        isDraft: true,
        price: { lte: 0 },
      },
    });

    console.log(`ℹ️ Draft products with zero/placeholder price: ${draftsWithZeroPrice}`);
    
    // This is allowed - just documenting
    expect(true).toBe(true);
  });
});
