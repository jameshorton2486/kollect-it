import { prisma } from "@/lib/prisma";

export async function getRecommendations(
  userId?: string,
  productId?: string,
  limit = 6,
) {
  try {
    // Get recommendations based on user or product
    if (userId) {
      // Get user's purchase and view history
      const userOrders = await prisma.orderItem.findMany({
        where: {
          order: { userId },
        },
        select: { productId: true },
        distinct: ["productId"],
        take: 10,
      });

      const viewedCategoryIds = await prisma.product.findMany({
        where: {
          id: { in: userOrders.map((o: { productId: string }) => o.productId) },
        },
        select: { categoryId: true },
        distinct: ["categoryId"],
      });

      // Recommend from similar categories
      const recommendations = await prisma.product.findMany({
        where: {
          categoryId: {
            in: viewedCategoryIds.map(
              (c: { categoryId: string }) => c.categoryId,
            ),
          },
          id: {
            notIn: userOrders.map((o: { productId: string }) => o.productId),
          },
          status: "active",
        },
        take: limit,
        include: {
          Image: {
            take: 1,
            select: { url: true },
          },
          category: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return recommendations;
    }

    if (productId) {
      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true, price: true },
      });

      if (!product) return [];

      // Find similar products (same category, similar price)
      const recommendations = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          status: "active",
          price: {
            gte: product.price * 0.7,
            lte: product.price * 1.3,
          },
        },
        take: limit,
        include: {
          Image: {
            take: 1,
            select: { url: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return recommendations;
    }

    // Default: return trending/featured products
    const trending = await prisma.product.findMany({
      where: {
        status: "active",
        featured: true,
      },
      take: limit,
      include: {
        Image: {
          take: 1,
          select: { url: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return trending;
  } catch (error) {
    console.error("Recommendations error:", error);
    return [];
  }
}
