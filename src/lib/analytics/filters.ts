/**
 * Advanced Analytics Filtering
 * Phase 5 - Filter metrics by category, status, date range
 */

import { prisma } from "@/lib/prisma";

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  status?: "APPROVED" | "REJECTED" | "PENDING";
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get filtered approval metrics
 */
export async function getFilteredApprovalMetrics(filters: FilterOptions) {
  const where: any = {};

  if (filters.startDate || filters.endDate) {
    where.reviewedAt = {};
    if (filters.startDate) {
      where.reviewedAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.reviewedAt.lte = endDate;
    }
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.categories && filters.categories.length > 0) {
    where.category = {
      in: filters.categories,
    };
  }

  const count = await (prisma as any).aIGeneratedProduct.count({ where });
  const items = await (prisma as any).aIGeneratedProduct.findMany({
    where,
    take: filters.limit || 50,
    skip: filters.offset || 0,
    orderBy: {
      reviewedAt: "desc",
    },
  });

  return {
    total: count,
    items,
    pageInfo: {
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      hasMore: count > (filters.offset || 0) + (filters.limit || 50),
    },
  };
}

/**
 * Get filtered revenue metrics
 */
export async function getFilteredRevenueMetrics(filters: FilterOptions) {
  const where: any = {
    status: "COMPLETED",
  };

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  if (filters.categories && filters.categories.length > 0) {
    where.categoryId = {
      in: filters.categories,
    };
  }

  const orders = await (prisma as any).order.groupBy({
    by: ["categoryId", "status"],
    _sum: {
      total: true,
    },
    _count: {
      id: true,
    },
    where,
    take: filters.limit || 50,
    skip: filters.offset || 0,
  });

  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + (order._sum.total || 0),
    0,
  );

  return {
    total: totalRevenue,
    byCategory: orders.map((order: any) => ({
      category: order.categoryId || "Unknown",
      revenue: order._sum.total || 0,
      orderCount: order._count.id || 0,
      percentage:
        totalRevenue > 0 ? ((order._sum.total || 0) / totalRevenue) * 100 : 0,
    })),
    pageInfo: {
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    },
  };
}

/**
 * Get filtered pricing metrics
 */
export async function getFilteredPricingMetrics(filters: FilterOptions) {
  const where: any = {
    status: "APPROVED",
  };

  if (filters.startDate || filters.endDate) {
    where.reviewedAt = {};
    if (filters.startDate) {
      where.reviewedAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.reviewedAt.lte = endDate;
    }
  }

  if (filters.categories && filters.categories.length > 0) {
    where.category = {
      in: filters.categories,
    };
  }

  const products = await (prisma as any).aIGeneratedProduct.findMany({
    where,
    select: {
      suggestedPrice: true,
      finalPrice: true,
      priceConfidence: true,
      Category: true,
    },
    take: filters.limit || 50,
    skip: filters.offset || 0,
  });

  if (products.length === 0) {
    return {
      averageConfidence: 0,
      accuracyByCategory: [],
      priceDeviations: [],
      total: 0,
    };
  }

  const accuracyByCategory: any = {};
  let totalDeviation = 0;
  let totalAccuracy = 0;

  for (const product of products) {
    const confidence = product.priceConfidence || 0;
    totalAccuracy += confidence;

    if (!accuracyByCategory[product.Category]) {
      accuracyByCategory[product.Category] = {
        category: product.Category,
        averageConfidence: 0,
        count: 0,
        totalConfidence: 0,
      };
    }

    accuracyByCategory[product.Category].totalConfidence += confidence;
    accuracyByCategory[product.Category].count += 1;

    // Calculate deviation if both prices exist
    if (product.suggestedPrice && product.finalPrice) {
      const deviation = Math.abs(
        (product.finalPrice - product.suggestedPrice) / product.suggestedPrice,
      );
      totalDeviation += deviation;
    }
  }

  // Calculate averages
  for (const category in accuracyByCategory) {
    const cat = accuracyByCategory[category];
    cat.averageConfidence =
      Math.round((cat.totalConfidence / cat.count) * 100) / 100;
    delete cat.totalConfidence;
  }

  return {
    averageConfidence:
      Math.round((totalAccuracy / products.length) * 100) / 100,
    accuracyByCategory: Object.values(accuracyByCategory),
    averageDeviation:
      Math.round((totalDeviation / products.length) * 10000) / 100,
    total: products.length,
  };
}

/**
 * Get filtered product metrics
 */
export async function getFilteredProductMetrics(filters: FilterOptions) {
  const where: any = {};

  if (filters.categories && filters.categories.length > 0) {
    where.category = {
      in: filters.categories,
    };
  }

  if (filters.searchQuery) {
    where.name = {
      contains: filters.searchQuery,
      mode: "insensitive",
    };
  }

  const total = await (prisma as any).product.count({ where });
  const products = await (prisma as any).product.findMany({
    where,
    select: {
      id: true,
      name: true,
      Category: true,
      price: true,
      createdAt: true,
    },
    take: filters.limit || 50,
    skip: filters.offset || 0,
    orderBy: {
      createdAt: "desc",
    },
  });

  const byCategory: any = {};
  for (const product of products) {
    if (!byCategory[product.Category]) {
      byCategory[product.Category] = 0;
    }
    byCategory[product.Category] += 1;
  }

  return {
    total,
    items: products,
    byCategory: Object.entries(byCategory).map(([category, count]) => ({
      category,
      count,
    })),
    pageInfo: {
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      hasMore: total > (filters.offset || 0) + (filters.limit || 50),
    },
  };
}

/**
 * Build filter summary for UI display
 */
export function buildFilterSummary(filters: FilterOptions): string {
  const parts: string[] = [];

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate).toLocaleDateString();
    const end = new Date(filters.endDate).toLocaleDateString();
    parts.push(`${start} to ${end}`);
  }

  if (filters.categories && filters.categories.length > 0) {
    parts.push(`Categories: ${filters.categories.join(", ")}`);
  }

  if (filters.status) {
    parts.push(`Status: ${filters.status}`);
  }

  if (filters.searchQuery) {
    parts.push(`Search: "${filters.searchQuery}"`);
  }

  return parts.length > 0 ? parts.join(" | ") : "No filters applied";
}

