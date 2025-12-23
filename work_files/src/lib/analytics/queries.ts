/**
 * Analytics Queries and Service
 * Phase 4 - Calculate admin analytics metrics
 */

import { prisma } from "@/lib/prisma";
import type {
  ApprovalMetrics,
  PricingAnalysis,
  ProductPerformance,
  RevenueInsights,
  ApprovalTrends,
  CategoryMetrics,
  AdminAnalyticsSummary,
  AnalyticsQueryParams,
} from "./types";

/**
 * Calculate approval metrics
 */
export async function getApprovalMetrics(
  params: AnalyticsQueryParams,
): Promise<ApprovalMetrics> {
  const { startDate, endDate } = params;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.lte = end;
  }

  const approvals = await (prisma as any).aIGeneratedProduct.count({
    where: {
      status: "APPROVED",
      reviewedAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
  });

  const rejections = await (prisma as any).aIGeneratedProduct.count({
    where: {
      status: "REJECTED",
      reviewedAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
  });

  const pending = await (prisma as any).aIGeneratedProduct.count({
    where: { status: "PENDING" },
  });

  // Calculate approval rate
  const total = approvals + rejections;
  const approvalRate = total > 0 ? (approvals / total) * 100 : 0;

  // Calculate average time to approve/reject (mock implementation)
  // In production, you'd store submission timestamp
  const avgTimeToApprove = 45; // Mock: 45 minutes
  const avgTimeToReject = 30; // Mock: 30 minutes

  // Today's approvals
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayApprovals = await (prisma as any).aIGeneratedProduct.count({
    where: {
      status: "APPROVED",
      reviewedAt: { gte: today, lt: tomorrow },
    },
  });

  // This week approvals
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const thisWeekApprovals = await (prisma as any).aIGeneratedProduct.count({
    where: {
      status: "APPROVED",
      reviewedAt: { gte: weekStart },
    },
  });

  // This month approvals
  const monthStart = new Date(today);
  monthStart.setDate(1);
  const thisMonthApprovals = await (prisma as any).aIGeneratedProduct.count({
    where: {
      status: "APPROVED",
      reviewedAt: { gte: monthStart },
    },
  });

  return {
    totalSubmitted: approvals + rejections + pending,
    approved: approvals,
    rejected: rejections,
    pending,
    totalApprovals: approvals,
    totalRejections: rejections,
    pendingCount: pending,
    approvalRate: Math.round(approvalRate * 100) / 100,
    averageTimeToApprove: avgTimeToApprove,
    averageTimeToReject: avgTimeToReject,
    todayApprovals,
    thisWeekApprovals,
    thisMonthApprovals,
    trend: [],
  };
}

/**
 * Calculate pricing analysis
 */
export async function getPricingAnalysis(
  _params: AnalyticsQueryParams,
): Promise<PricingAnalysis> {
  const approvedProducts = await (prisma as any).aIGeneratedProduct.findMany({
    where: { status: "APPROVED" },
    take: 1000, // Limit to last 1000
  });

  if (approvedProducts.length === 0) {
    return {
      averagePricingAccuracy: 0,
      averageAIPriceDeviation: 0,
      avgConfidenceScore: 0,
      categoriesByDeviation: [],
      priceOverridesPercentage: 0,
    };
  }

  // Calculate average confidence
  const avgConfidence =
    approvedProducts.reduce(
      (sum: number, p: any) => sum + (p.priceConfidence || 0),
      0,
    ) / approvedProducts.length;

  // Assume if productId is set, it was approved and created
  const productsWithFinalPrice = approvedProducts.filter(
    (p: any) => p.productId,
  );

  // Mock pricing accuracy (in production, compare to final price from Product model)
  const pricingAccuracy = Math.min(100, 75 + Math.random() * 20); // 75-95%

  // Calculate average confidence
  const categoryDeviations: Record<
    string,
    { deviations: number[]; count: number }
  > = {};

  approvedProducts.forEach((product: any) => {
    if (!categoryDeviations[product.aiCategory]) {
      categoryDeviations[product.aiCategory] = { deviations: [], count: 0 };
    }
    // Mock deviation calculation
    const deviation = Math.random() * 10; // 0-10%
    categoryDeviations[product.aiCategory].deviations.push(deviation);
    categoryDeviations[product.aiCategory].count++;
  });

  const categoriesByDeviation = Object.entries(categoryDeviations).map(
    ([category, data]) => ({
      category,
      avgDeviation:
        Math.round(
          (data.deviations.reduce((a, b) => a + b, 0) /
            data.deviations.length) *
            100,
        ) / 100,
      count: data.count,
    }),
  );

  const overridesCount = productsWithFinalPrice.length;
  const overridesPercentage = (overridesCount / approvedProducts.length) * 100;

  return {
    averagePricingAccuracy: Math.round(pricingAccuracy * 100) / 100,
    averageAIPriceDeviation:
      Math.round(
        (approvedProducts.reduce((sum: number) => sum + Math.random() * 5, 0) /
          approvedProducts.length) *
          100,
      ) / 100,
    avgConfidenceScore: Math.round(avgConfidence * 100) / 100,
    categoriesByDeviation: categoriesByDeviation.sort(
      (a, b) => b.avgDeviation - a.avgDeviation,
    ),
    priceOverridesPercentage: Math.round(overridesPercentage * 100) / 100,
  };
}

/**
 * Calculate product performance
 */
export async function getProductPerformance(
  _params: AnalyticsQueryParams,
): Promise<ProductPerformance> {
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      orderItems: true,
    },
  });

  if (allProducts.length === 0) {
    return {
      totalProducts: 0,
      averageTimeToSell: 0,
      sellThroughRate: 0,
      averageSellingPrice: 0,
      priceAccuracy: 0,
      bestPerformingCategory: "N/A",
      lowestPerformingCategory: "N/A",
      trendingCategories: [],
    };
  }

  const soldProducts = allProducts.filter((p) => p.orderItems.length > 0);
  const sellThroughRate = (soldProducts.length / allProducts.length) * 100;

  const avgSellingPrice =
    soldProducts.reduce((sum, p) => sum + p.price, 0) /
    (soldProducts.length || 1);

  // Group by category
  const categoryMetrics: Record<
    string,
    { count: number; sold: number; revenue: number }
  > = {};

  allProducts.forEach((p) => {
    const catName = p.category?.name || "Unknown";
    if (!categoryMetrics[catName]) {
      categoryMetrics[catName] = { count: 0, sold: 0, revenue: 0 };
    }
    categoryMetrics[catName].count++;
    if (p.orderItems.length > 0) {
      categoryMetrics[catName].sold++;
      categoryMetrics[catName].revenue += p.price;
    }
  });

  const categoryPerformance = Object.entries(categoryMetrics).map(
    ([name, data]) => ({
      name,
      performance: (data.sold / data.count) * 100,
      revenue: data.revenue,
    }),
  );

  const bestPerforming =
    categoryPerformance.length > 0
      ? categoryPerformance.reduce((prev, current) =>
          prev.performance > current.performance ? prev : current,
        ).name
      : "N/A";

  const lowestPerforming =
    categoryPerformance.length > 0
      ? categoryPerformance.reduce((prev, current) =>
          prev.performance < current.performance ? prev : current,
        ).name
      : "N/A";

  const trendingCategories = categoryPerformance
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((cat) => ({
      category: cat.name,
      growthRate: Math.random() * 20 - 5, // Mock: -5% to +15%
      productCount: categoryMetrics[cat.name].count,
    }));

  return {
    totalProducts: allProducts.length,
    averageTimeToSell: 7, // Mock: 7 days
    sellThroughRate: Math.round(sellThroughRate * 100) / 100,
    averageSellingPrice: Math.round(avgSellingPrice * 100) / 100,
    priceAccuracy: 92, // Mock: 92%
    bestPerformingCategory: bestPerforming,
    lowestPerformingCategory: lowestPerforming,
    trendingCategories,
  };
}

/**
 * Calculate revenue insights
 */
export async function getRevenueInsights(
  _params: AnalyticsQueryParams,
): Promise<RevenueInsights> {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue by category
  const revenueByCategory: Record<
    string,
    { revenue: number; productsSold: number }
  > = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const catName = item.product.category?.name || "Unknown";
      if (!revenueByCategory[catName]) {
        revenueByCategory[catName] = { revenue: 0, productsSold: 0 };
      }
      revenueByCategory[catName].revenue += item.price * item.quantity;
      revenueByCategory[catName].productsSold += item.quantity;
    });
  });

  const categoryRevenue = Object.entries(revenueByCategory)
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      productsSold: data.productsSold,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Mock conversion rate and growth
  const totalListings = await prisma.product.count();
  const conversionRate =
    totalListings > 0 ? (totalOrders / totalListings) * 100 : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    totalOrdersPlaced: totalOrders,
    conversionRate: Math.round(conversionRate * 100) / 100,
    revenueByCategory: categoryRevenue,
    revenueGrowth: {
      daily: Math.random() * 15 - 5, // Mock: -5% to +15%
      weekly: Math.random() * 20 - 5, // Mock: -5% to +20%
      monthly: Math.random() * 25 - 5, // Mock: -5% to +25%
    },
  };
}

/**
 * Get approval trends over time
 */
export async function getApprovalTrends(
  days: number = 30,
): Promise<ApprovalTrends[]> {
  const trends: ApprovalTrends[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const approvalsCount = await (prisma as any).aIGeneratedProduct.count({
      where: {
        status: "APPROVED",
        reviewedAt: { gte: date, lt: nextDate },
      },
    });

    const rejectionsCount = await (prisma as any).aIGeneratedProduct.count({
      where: {
        status: "REJECTED",
        reviewedAt: { gte: date, lt: nextDate },
      },
    });

    trends.push({
      date: date.toISOString().split("T")[0],
      approvalsCount,
      rejectionsCount,
      averageConfidence: 75 + Math.random() * 20, // Mock
      averagePrice: 500 + Math.random() * 1000, // Mock
    });
  }

  return trends;
}

/**
 * Get category metrics
 */
export async function getCategoryMetrics(
  _params: AnalyticsQueryParams,
): Promise<CategoryMetrics[]> {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          orderItems: true,
        },
      },
    },
  });

  const metrics = categories.map((cat) => {
    const productCount = cat.products.length;
    const soldCount = cat.products.filter(
      (p) => p.orderItems.length > 0,
    ).length;
    const totalRevenue = cat.products.reduce(
      (sum, p) => sum + p.price * p.orderItems.length,
      0,
    );

    return {
      name: cat.name,
      productCount,
      approvalRate: 85 + Math.random() * 10, // Mock
      averagePrice:
        cat.products.length > 0
          ? cat.products.reduce((sum, p) => sum + p.price, 0) /
            cat.products.length
          : 0,
      averageConfidence: 80 + Math.random() * 15, // Mock
      revenue: totalRevenue,
      soldCount,
      growthRate: Math.random() * 20 - 5, // Mock
    };
  });

  return metrics.sort((a, b) => b.revenue - a.revenue);
}

/**
 * Get revenue metrics for new DashboardMetrics
 */
export async function getRevenueMetrics(
  startDate: Date,
  endDate: Date,
): Promise<any> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: "COMPLETED",
      },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Revenue by category
    const categoryMap = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const categoryName = item.product.category.name;
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            category: categoryName,
            revenue: 0,
            itemsSold: 0,
          });
        }
        const entry = categoryMap.get(categoryName);
        entry.revenue += item.price * item.quantity;
        entry.itemsSold += item.quantity;
      });
    });

    const revenueByCategory = Array.from(categoryMap.values()).map((cat) => ({
      ...cat,
      percentage: totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0,
    }));

    // Revenue by month
    const monthMap = new Map();
    orders.forEach((order) => {
      const monthStr = order.createdAt.toISOString().substring(0, 7);
      if (!monthMap.has(monthStr)) {
        monthMap.set(monthStr, { month: monthStr, revenue: 0, orders: 0 });
      }
      const entry = monthMap.get(monthStr);
      entry.revenue += order.total;
      entry.orders++;
    });

    const revenueByMonth = Array.from(monthMap.values()).sort(
      (a, b) =>
        new Date(`${a.month}-01`).getTime() -
        new Date(`${b.month}-01`).getTime(),
    );

    return {
      totalRevenue,
      averageOrderValue: avgOrderValue,
      revenueByCategory,
      revenueByMonth,
    };
  } catch (error) {
    console.error("Error getting revenue metrics:", error);
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      revenueByCategory: [],
      revenueByMonth: [],
    };
  }
}

/**
 * Get pricing metrics for new DashboardMetrics
 */
export async function getPricingMetrics(
  startDate: Date,
  endDate: Date,
): Promise<any> {
  try {
    const products = await (prisma as any).aIGeneratedProduct.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        priceConfidence: true,
        status: true,
      },
    });

    const autoApproved = products.filter(
      (p: any) => p.priceConfidence > 85,
    ).length;
    const manualReview = products.filter(
      (p: any) => p.priceConfidence >= 70 && p.priceConfidence <= 85,
    ).length;
    const lowConfidence = products.filter(
      (p: any) => p.priceConfidence < 70,
    ).length;

    const avgConfidence =
      products.length > 0
        ? products.reduce((sum: number, p: any) => sum + p.priceConfidence, 0) /
          products.length
        : 0;

    return {
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      autoApprovedCount: autoApproved,
      manualReviewCount: manualReview,
      lowConfidenceCount: lowConfidence,
      priceAccuracy:
        products.length > 0 ? (autoApproved / products.length) * 100 : 0,
    };
  } catch (error) {
    console.error("Error getting pricing metrics:", error);
    return {
      averageConfidence: 0,
      autoApprovedCount: 0,
      manualReviewCount: 0,
      lowConfidenceCount: 0,
      priceAccuracy: 0,
    };
  }
}

/**
 * Get product metrics for new DashboardMetrics
 */
export async function getProductMetrics(): Promise<any> {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });

    const totalProducts = products.length;
    const prices = products.map((p) => p.price);
    const avgPrice =
      prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    const categoryMap = new Map();
    products.forEach((p) => {
      if (!categoryMap.has(p.category.name)) {
        categoryMap.set(p.category.name, {
          category: p.category.name,
          count: 0,
          totalPrice: 0,
          revenue: 0,
        });
      }
      const entry = categoryMap.get(p.category.name);
      entry.count++;
      entry.totalPrice += p.price;
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map((cat) => ({
      category: cat.category,
      count: cat.count,
      averagePrice: cat.totalPrice / cat.count,
      revenue: cat.totalPrice,
    }));

    return {
      totalProducts,
      activeProducts: products.filter((p: any) => !p.archived).length,
      averagePrice: Math.round(avgPrice * 100) / 100,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
      categoryBreakdown,
    };
  } catch (error) {
    console.error("Error getting product metrics:", error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      averagePrice: 0,
      priceRange: { min: 0, max: 0 },
      categoryBreakdown: [],
    };
  }
}

/**
 * Get complete dashboard metrics
 */
export async function getDashboardMetrics(
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date(),
): Promise<any> {
  try {
    console.log(`Getting dashboard metrics from ${startDate} to ${endDate}`);

    const [approval, revenue, pricing, products] = await Promise.all([
      getApprovalMetricsNew(startDate, endDate),
      getRevenueMetrics(startDate, endDate),
      getPricingMetrics(startDate, endDate),
      getProductMetrics(),
    ]);

    return {
      approval,
      revenue,
      pricing,
      products,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    throw error;
  }
}

/**
 * New approval metrics function for DashboardMetrics
 */
async function getApprovalMetricsNew(
  startDate: Date,
  endDate: Date,
): Promise<any> {
  try {
    const products = await (prisma as any).aIGeneratedProduct.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
        approvedAt: true,
      },
    });

    const total = products.length;
    const approved = products.filter(
      (p: any) => p.status === "APPROVED",
    ).length;
    const rejected = products.filter(
      (p: any) => p.status === "REJECTED",
    ).length;
    const pending = products.filter((p: any) => p.status === "PENDING").length;

    // Calculate average time to approve
    const approvedProducts = products.filter(
      (p: any) => p.status === "APPROVED" && p.approvedAt,
    );
    const avgTimeToApprove =
      approvedProducts.length > 0
        ? approvedProducts.reduce((sum: number, p: any) => {
            const time =
              (p.approvedAt!.getTime() - p.createdAt.getTime()) / 1000 / 60;
            return sum + time;
          }, 0) / approvedProducts.length
        : 0;

    // Build trend data (daily)
    const trendMap = new Map();
    products.forEach((p: any) => {
      const dateStr = p.createdAt.toISOString().split("T")[0];
      if (!trendMap.has(dateStr)) {
        trendMap.set(dateStr, {
          date: dateStr,
          approved: 0,
          rejected: 0,
          pending: 0,
        });
      }
      const entry = trendMap.get(dateStr);
      if (p.status === "APPROVED") entry.approved++;
      else if (p.status === "REJECTED") entry.rejected++;
      else entry.pending++;
    });

    const trend = Array.from(trendMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return {
      totalSubmitted: total,
      approved,
      rejected,
      pending,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      averageTimeToApprove: avgTimeToApprove,
      trend,
    };
  } catch (error) {
    console.error("Error getting approval metrics:", error);
    return {
      totalSubmitted: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
      approvalRate: 0,
      averageTimeToApprove: 0,
      trend: [],
    };
  }
}

/**
 * Get complete analytics summary
 */
export async function getAnalyticsSummary(
  params: AnalyticsQueryParams,
): Promise<AdminAnalyticsSummary> {
  const now = new Date();
  const startDate =
    params.startDate ||
    new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  const endDate = params.endDate || now.toISOString().split("T")[0];

  const [
    approvalMetrics,
    pricingAnalysis,
    productPerformance,
    revenueInsights,
    approvalTrends,
    categoryMetrics,
  ] = await Promise.all([
    getApprovalMetrics(params),
    getPricingAnalysis(params),
    getProductPerformance(params),
    getRevenueInsights(params),
    getApprovalTrends(30),
    getCategoryMetrics(params),
  ]);

  return {
    dateRange: { startDate, endDate },
    approvalMetrics,
    pricingAnalysis,
    productPerformance,
    revenueInsights,
    approvalTrends,
    categoryMetrics,
    timestamp: now,
  };
}

