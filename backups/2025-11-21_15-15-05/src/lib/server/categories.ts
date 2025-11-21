/**
 * Server-side Category Utilities
 * Centralizes category fetching logic to eliminate duplication across pages
 *
 * This module prevents the same category query from being repeated in
 * multiple page files, reducing maintenance burden and ensuring consistency.
 */

import { prisma } from "@/lib/prisma";

/**
 * Fallback categories if database query fails
 * Used when database is temporarily unavailable
 */
const FALLBACK_CATEGORIES = [
  {
    id: "cat-fine-art",
    name: "Fine Art",
    slug: "fine-art",
    description:
      "Original paintings, drawings, and sculptures from established artists",
    image: "/images/categories/fine-art.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-vintage-collectibles",
    name: "Vintage Collectibles",
    slug: "vintage-collectibles",
    description: "Rare and authentic vintage items from various eras",
    image: "/images/categories/vintage.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-memorabilia",
    name: "Memorabilia",
    slug: "memorabilia",
    description:
      "Signed items, limited editions, and entertainment memorabilia",
    image: "/images/categories/memorabilia.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-sports-collectibles",
    name: "Sports Collectibles",
    slug: "sports-collectibles",
    description: "Autographed memorabilia, vintage cards, and sports equipment",
    image: "/images/categories/sports.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Fetch all categories from database
 * Returns fallback categories if database is unavailable
 *
 * @returns Array of categories sorted alphabetically by name
 * @throws Logs error but doesn't throw - returns fallback instead
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return actual categories if found
    if (categories.length > 0) {
      return categories;
    }

    // Return fallback if database is empty
    console.warn("No categories found in database. Using fallback categories.");
    return FALLBACK_CATEGORIES;
  } catch (error) {
    console.error("[Category Fetch Error]", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Return fallback if database is unavailable
    return FALLBACK_CATEGORIES;
  }
}

/**
 * Fetch a single category by slug with its products
 *
 * @param slug - URL-friendly category slug
 * @returns Category with product count, or null if not found
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            products: {
              where: { status: "active" },
            },
          },
        },
        products: {
          where: { status: "active" },
          select: {
            id: true,
            title: true,
            price: true,
            featured: true,
          },
          take: 20,
        },
      },
    });

    if (!category) {
      console.warn(`Category not found for slug: ${slug}`);
      return null;
    }

    return category;
  } catch (error) {
    console.error("[Category Fetch Error]", {
      slug,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

/**
 * Search categories by name
 *
 * @param searchTerm - Partial or full category name
 * @returns Matching categories
 */
export async function searchCategories(searchTerm: string) {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: { name: "asc" },
      take: 10,
    });

    return categories;
  } catch (error) {
    console.error("[Category Search Error]", {
      searchTerm,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}

/**
 * Get categories with product count
 * Useful for category navigation showing how many items in each
 *
 * @returns Categories with active product count
 */
export async function getCategoriesWithCount() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: {
            products: {
              where: { status: "active" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
    }));
  } catch (error) {
    console.error("[Category Count Error]", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}

