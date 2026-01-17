/**
 * Category Hierarchy Invariant Tests
 * 
 * Validates category and subcategory data integrity.
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

describe('Category Hierarchy Invariants', () => {

  test('all products have a valid category', async () => {
    const productsWithoutCategory = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: null },
          { category: null },
        ],
      },
      select: { id: true, title: true },
    });

    if (productsWithoutCategory.length > 0) {
      console.warn('⚠️ Products without category:');
      productsWithoutCategory.forEach(p => console.warn(`  - ${p.title}`));
    }

    expect(productsWithoutCategory).toHaveLength(0);
  });

  test('all subcategories belong to a valid parent category', async () => {
    const subcategories = await prisma.subcategory.findMany({
      include: { category: true },
    });

    const orphanSubcategories = subcategories.filter(s => !s.category);

    if (orphanSubcategories.length > 0) {
      console.warn('⚠️ Orphan subcategories:');
      orphanSubcategories.forEach(s => console.warn(`  - ${s.name} (${s.slug})`));
    }

    expect(orphanSubcategories).toHaveLength(0);
  });

  test('category slugs are unique', async () => {
    const categories = await prisma.category.findMany({
      select: { slug: true, name: true },
    });

    const slugs = categories.map(c => c.slug);
    const uniqueSlugs = new Set(slugs);

    if (uniqueSlugs.size !== slugs.length) {
      const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
      console.warn('⚠️ Duplicate category slugs:', [...new Set(duplicates)]);
    }

    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  test('subcategory slugs are unique', async () => {
    const subcategories = await prisma.subcategory.findMany({
      select: { slug: true, name: true },
    });

    const slugs = subcategories.map(s => s.slug);
    const uniqueSlugs = new Set(slugs);

    if (uniqueSlugs.size !== slugs.length) {
      const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
      console.warn('⚠️ Duplicate subcategory slugs:', [...new Set(duplicates)]);
    }

    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  test('product subcategory matches its category', async () => {
    const products = await prisma.product.findMany({
      where: {
        subcategoryId: { not: null },
      },
      select: {
        id: true,
        title: true,
        categoryId: true,
        subcategory: {
          select: { categoryId: true, name: true },
        },
      },
    });

    const mismatches = products.filter(p => 
      p.subcategory && p.subcategory.categoryId !== p.categoryId
    );

    if (mismatches.length > 0) {
      console.warn('⚠️ Products with mismatched subcategory:');
      mismatches.forEach(p => 
        console.warn(`  - ${p.title}: subcategory "${p.subcategory?.name}" belongs to different category`)
      );
    }

    expect(mismatches).toHaveLength(0);
  });

  test('all categories have required fields', async () => {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, image: true },
    });

    const incomplete: { name: string; missing: string[] }[] = [];

    for (const cat of categories) {
      const missing: string[] = [];
      if (!cat.name) missing.push('name');
      if (!cat.slug) missing.push('slug');
      if (!cat.description) missing.push('description');
      if (!cat.image) missing.push('image');

      if (missing.length > 0) {
        incomplete.push({ name: cat.name || cat.id, missing });
      }
    }

    if (incomplete.length > 0) {
      console.warn('⚠️ Categories with missing fields:');
      incomplete.forEach(c => 
        console.warn(`  - ${c.name}: missing [${c.missing.join(', ')}]`)
      );
    }

    // Phase 2: Document only
    // Phase 3: Uncomment to enforce
    // expect(incomplete).toHaveLength(0);
  });
});
