/**
 * Image Pipeline Invariant Tests
 * 
 * Validates image data integrity across the product catalog.
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

describe('Image Pipeline Invariants', () => {

  test('all active products have at least one image', async () => {
    const productsWithoutImages = await prisma.product.findMany({
      where: {
        isDraft: false,
        status: 'active',
        images: { none: {} },
      },
      select: { id: true, title: true, sku: true },
    });

    if (productsWithoutImages.length > 0) {
      console.warn('⚠️ Active products without images:');
      productsWithoutImages.forEach(p => 
        console.warn(`  - ${p.title} (${p.sku})`)
      );
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(productsWithoutImages).toHaveLength(0);
  });

  test('all images have valid URLs', async () => {
    const images = await prisma.image.findMany({
      select: { id: true, url: true, productId: true },
    });

    const invalidUrls: { id: string; url: string }[] = [];

    for (const image of images) {
      if (!image.url) {
        invalidUrls.push({ id: image.id, url: '(empty)' });
        continue;
      }

      // Must start with http(s) or be a valid path
      const isValidUrl = 
        image.url.startsWith('http://') || 
        image.url.startsWith('https://') ||
        image.url.startsWith('/');

      if (!isValidUrl) {
        invalidUrls.push({ id: image.id, url: image.url });
      }
    }

    if (invalidUrls.length > 0) {
      console.warn('⚠️ Images with invalid URLs:');
      invalidUrls.slice(0, 10).forEach(i => 
        console.warn(`  - Image ${i.id}: "${i.url}"`)
      );
      if (invalidUrls.length > 10) {
        console.warn(`  ... and ${invalidUrls.length - 10} more`);
      }
    }

    expect(invalidUrls).toHaveLength(0);
  });

  test('no orphan images (images without products)', async () => {
    // This should be prevented by CASCADE delete, but verify
    const orphanCount = await prisma.image.count({
      where: {
        product: null,
      },
    });

    if (orphanCount > 0) {
      console.warn(`⚠️ Found ${orphanCount} orphan images without products`);
    }

    expect(orphanCount).toBe(0);
  });

  test('image order values are sequential per product', async () => {
    const products = await prisma.product.findMany({
      where: {
        images: { some: {} },
      },
      select: {
        id: true,
        title: true,
        images: {
          select: { order: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    const gapsFound: { title: string; orders: number[] }[] = [];

    for (const product of products) {
      const orders = product.images.map(i => i.order);
      
      // Check for gaps or duplicates
      const expected = orders.map((_, i) => i);
      const hasGaps = JSON.stringify(orders) !== JSON.stringify(expected);
      
      if (hasGaps && orders.length > 1) {
        gapsFound.push({ title: product.title, orders });
      }
    }

    if (gapsFound.length > 0) {
      console.warn('⚠️ Products with non-sequential image orders:');
      gapsFound.slice(0, 5).forEach(p => 
        console.warn(`  - ${p.title}: [${p.orders.join(', ')}]`)
      );
    }

    // This is a warning, not a hard requirement
    // Phase 3: Decide if this should be enforced
  });

  test('primary images (order=0) exist for products with images', async () => {
    const productsWithImages = await prisma.product.findMany({
      where: {
        images: { some: {} },
      },
      select: {
        id: true,
        title: true,
        images: {
          where: { order: 0 },
          select: { id: true },
        },
      },
    });

    const missingPrimary = productsWithImages.filter(p => p.images.length === 0);

    if (missingPrimary.length > 0) {
      console.warn('⚠️ Products with images but no primary (order=0):');
      missingPrimary.forEach(p => console.warn(`  - ${p.title}`));
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(missingPrimary).toHaveLength(0);
  });
});
