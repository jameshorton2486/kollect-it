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

  // Calculate average time to approve/reject (minutes)
  const reviewedProducts = await (prisma as any).aIGeneratedProduct.findMany({
    where: {
      status: { in: ["APPROVED", "REJECTED"] },
      reviewedAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
    select: {
      status: true,
      createdAt: true,
      reviewedAt: true,
    },
  });

  const approvedDurations: number[] = [];
  const rejectedDurations: number[] = [];

  for (const p of reviewedProducts) {
    if (!p.reviewedAt) continue;
    const minutes = (p.reviewedAt.getTime() - p.createdAt.getTime()) / 60000;
    if (p.status === "APPROVED") approvedDurations.push(minutes);
    if (p.status === "REJECTED") rejectedDurations.push(minutes);
  }

  const avgTimeToApprove =
    approvedDurations.length > 0
      ? approvedDurations.reduce((a, b) => a + b, 0) / approvedDurations.length
      : 0;
  const avgTimeToReject =
    rejectedDurations.length > 0
      ? rejectedDurations.reduce((a, b) => a + b, 0) / rejectedDurations.length
      : 0;

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
    select: {
      productId: true,
      aiCategory: true,
      suggestedPrice: true,
      priceConfidence: true,
    },
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

  const productIds = approvedProducts
    .map((p: any) => p.productId)
    .filter(Boolean);

  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      })
    : [];

  const productMap = new Map(products.map((p) => [p.id, p]));

  const categoryDeviations: Record<
    string,
    { deviations: number[]; count: number }
  > = {};

  let totalDeviation = 0;
  let deviationCount = 0;
  let overridesCount = 0;

  for (const product of approvedProducts) {
    if (!product.productId || !product.suggestedPrice) continue;
    const finalProduct = productMap.get(product.productId);
    if (!finalProduct) continue;

    const deviation =
      (Math.abs(finalProduct.price - product.suggestedPrice) /
        product.suggestedPrice) *
      100;

    totalDeviation += deviation;
    deviationCount += 1;

    if (Math.abs(finalProduct.price - product.suggestedPrice) > 0.01) {
      overridesCount += 1;
    }

    const category = product.aiCategory || "Unknown";
    if (!categoryDeviations[category]) {
      categoryDeviations[category] = { deviations: [], count: 0 };
    }
    categoryDeviations[category].deviations.push(deviation);
    categoryDeviations[category].count++;
  }

  const avgDeviation = deviationCount > 0 ? totalDeviation / deviationCount : 0;
  const pricingAccuracy = Math.max(0, 100 - avgDeviation);

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

  const overridesPercentage =
    deviationCount > 0 ? (overridesCount / deviationCount) * 100 : 0;

  return {
    averagePricingAccuracy: Math.round(pricingAccuracy * 100) / 100,
    averageAIPriceDeviation: Math.round(avgDeviation * 100) / 100,
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
      Category: true,
      OrderItem: true,
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

  const soldProducts = allProducts.filter((p) => p.OrderItem.length > 0);
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
    const catName = p.Category?.name || "Unknown";
    if (!categoryMetrics[catName]) {
      categoryMetrics[catName] = { count: 0, sold: 0, revenue: 0 };
    }
    categoryMetrics[catName].count++;
    if (p.OrderItem.length > 0) {
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
      growthRate: 0,
      productCount: categoryMetrics[cat.name]?.count ?? 0,
    }));

  const soldDurations: number[] = [];
  for (const product of soldProducts) {
    const firstSale = product.OrderItem
      .map((item) => item.createdAt)
      .sort((a, b) => a.getTime() - b.getTime())[0];
    if (firstSale) {
      const days =
        (firstSale.getTime() - product.createdAt.getTime()) /
        (1000 * 60 * 60 * 24);
      if (days >= 0) soldDurations.push(days);
    }
  }

  const averageTimeToSell =
    soldDurations.length > 0
      ? soldDurations.reduce((a, b) => a + b, 0) / soldDurations.length
      : 0;

  return {
    totalProducts: allProducts.length,
    averageTimeToSell: Math.round(averageTimeToSell * 100) / 100,
    sellThroughRate: Math.round(sellThroughRate * 100) / 100,
    averageSellingPrice: Math.round(avgSellingPrice * 100) / 100,
    priceAccuracy: 0,
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
    where: { paymentStatus: "paid" },
    include: {
      OrderItem: {
        include: {
          Product: {
            include: {
              Category: true,
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
    order.OrderItem.forEach((item) => {
      const catName = item.Product.Category?.name || "Unknown";
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
      daily: 0,
      weekly: 0,
      monthly: 0,
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

    const dayProducts = await (prisma as any).aIGeneratedProduct.findMany({
      where: {
        reviewedAt: { gte: date, lt: nextDate },
      },
      select: {
        priceConfidence: true,
        suggestedPrice: true,
      },
    });

    const avgConfidence =
      dayProducts.length > 0
        ? dayProducts.reduce(
            (sum: number, p: any) => sum + (p.priceConfidence || 0),
            0,
          ) / dayProducts.length
        : 0;

    const avgPrice =
      dayProducts.length > 0
        ? dayProducts.reduce(
            (sum: number, p: any) => sum + (p.suggestedPrice || 0),
            0,
          ) / dayProducts.length
        : 0;

    const dateStr = date.toISOString().split("T")[0];
    if (dateStr) {
      trends.push({
        date: dateStr,
        approvalsCount,
        rejectionsCount,
        averageConfidence: Math.round(avgConfidence * 100) / 100,
        averagePrice: Math.round(avgPrice * 100) / 100,
      });
    }
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
      Product: {
        include: {
          OrderItem: true,
        },
      },
    },
  });

  const metrics = categories.map((cat) => {
    const productCount = cat.Product.length;
    const soldCount = cat.Product.filter(
      (p) => p.OrderItem.length > 0,
    ).length;
    const totalRevenue = cat.Product.reduce(
      (sum, p) => sum + p.price * p.OrderItem.length,
      0,
    );

    return {
      name: cat.name,
      productCount,
      approvalRate: 0,
      averagePrice:
        cat.Product.length > 0
          ? cat.Product.reduce((sum, p) => sum + p.price, 0) /
            cat.Product.length
          : 0,
      averageConfidence: 0,
      revenue: totalRevenue,
      soldCount,
      growthRate: 0,
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
        paymentStatus: "paid",
      },
      include: {
        OrderItem: {
          include: {
            Product: {
              include: { Category: true },
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
      order.OrderItem.forEach((item) => {
        const categoryName = item.Product.Category.name;
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
      include: { Category: true },
    });

    const totalProducts = products.length;
    const prices = products.map((p) => p.price);
    const avgPrice =
      prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    const categoryMap = new Map();
    products.forEach((p) => {
      if (!categoryMap.has(p.Category.name)) {
        categoryMap.set(p.Category.name, {
          category: p.Category.name,
          count: 0,
          totalPrice: 0,
          revenue: 0,
        });
      }
      const entry = categoryMap.get(p.Category.name);
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
      activeProducts: products.filter(
        (p: any) => p.status === "active" && !p.isDraft,
      ).length,
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
        reviewedAt: true,
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
      (p: any) => p.status === "APPROVED" && p.reviewedAt,
    );
    const avgTimeToApprove =
      approvedProducts.length > 0
        ? approvedProducts.reduce((sum: number, p: any) => {
            const time =
              (p.reviewedAt!.getTime() - p.createdAt.getTime()) / 1000 / 60;
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
    dateRange: { 
      startDate: startDate || "", 
      endDate: endDate || "" 
    },
    approvalMetrics,
    pricingAnalysis,
    productPerformance,
    revenueInsights,
    approvalTrends,
    categoryMetrics,
    timestamp: now,
  };
}
