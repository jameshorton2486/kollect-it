import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";
import { cache, cacheTTL } from "@/lib/cache";

/**
 * GET /api/admin/analytics/sales
 *
 * Detailed sales analytics with revenue, trends, and forecasting
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitCheck = await rateLimiters.standard(request);
    if (rateLimitCheck) return rateLimitCheck;

    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      const response = NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
      return applySecurityHeaders(response);
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30"; // days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Check cache
    const cacheKey = `analytics:sales:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = cache.get<any>(cacheKey);
    if (cached) {
      const response = NextResponse.json(cached);
      response.headers.set("X-Cache", "HIT");
      return applySecurityHeaders(response);
    }

    // Fetch orders with items
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
              select: {
                id: true,
                title: true,
                categoryId: true,
                Category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by day
    const revenueByDay = orders.reduce(
      (acc, order) => {
        const dateParts = order.createdAt.toISOString().split("T");
        const date = dateParts[0];
        if (date) {
          acc[date] = (acc[date] || 0) + order.total;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const dailyRevenue = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Revenue by category
    const revenueByCategory = orders.reduce(
      (acc, order) => {
        order.OrderItem.forEach((item) => {
          const categoryName = item.product?.category?.name || "Uncategorized";
          const categoryId = item.product?.categoryId || "unknown";
          if (!acc[categoryId]) {
            acc[categoryId] = { name: categoryName, revenue: 0, orders: 0 };
          }
          acc[categoryId].revenue += item.price * item.quantity;
          acc[categoryId].orders += 1;
        });
        return acc;
      },
      {} as Record<string, { name: string; revenue: number; orders: number }>,
    );

    const categoryData = Object.values(revenueByCategory).sort(
      (a, b) => b.revenue - a.revenue,
    );

    // Top products by revenue
    const productRevenue = orders.reduce(
      (acc, order) => {
        order.OrderItem.forEach((item) => {
          if (!item.product) return;
          const productId = item.product.id;
          if (!acc[productId]) {
            acc[productId] = {
              id: productId,
              title: item.title,
              revenue: 0,
              quantity: 0,
              orders: 0,
            };
          }
          acc[productId].revenue += item.price * item.quantity;
          acc[productId].quantity += item.quantity;
          acc[productId].orders += 1;
        });
        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          title: string;
          revenue: number;
          quantity: number;
          orders: number;
        }
      >,
    );

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate trends (compare to previous period)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));
    const previousEndDate = new Date(startDate);

    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
        paymentStatus: "paid",
      },
      select: {
        total: true,
      },
    });

    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const orderGrowth =
      previousOrders.length > 0
        ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
        : 0;

    // Enhanced analytics: Payment methods
    const paymentMethodsMap = orders.reduce((acc: any, order: any) => {
      const method = order.paymentMethod || "card";
      if (!acc[method]) {
        acc[method] = { method, count: 0, revenue: 0 };
      }
      acc[method].count += 1;
      acc[method].revenue += order.total;
      return acc;
    }, {});
    const paymentMethods = Object.values(paymentMethodsMap);

    // Enhanced analytics: Hourly distribution
    const hourlyMap = orders.reduce((acc: any, order: any) => {
      const hour = new Date(order.createdAt).getHours();
      if (!acc[hour]) {
        acc[hour] = { hour, orders: 0 };
      }
      acc[hour].orders += 1;
      return acc;
    }, {});
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: hourlyMap[i]?.orders || 0,
    }));

    // Enhanced analytics: Shipping status
    const shippingStatusMap = orders.reduce((acc: any, order: any) => {
      const status = order.status || "pending";
      if (!acc[status]) {
        acc[status] = { status, count: 0 };
      }
      acc[status].count += 1;
      return acc;
    }, {});
    const shippingStatus = Object.values(shippingStatusMap);

    // Enhanced analytics: Daily orders count
    const ordersByDay = orders.reduce((acc: any, order: any) => {
      const date = order.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Merge daily revenue with order counts
    const enhancedDailyRevenue = dailyRevenue.map((day: any) => ({
      ...day,
      orders: ordersByDay[day.date] || 0,
    }));

    // Sales analytics response
    const analytics = {
      period: `Last ${period} days`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
      },
      dailyRevenue: enhancedDailyRevenue,
      categoryData,
      topProducts,
      // Enhanced analytics
      paymentMethods,
      hourlyDistribution,
      shippingStatus,
      generatedAt: new Date().toISOString(),
    };

    // Cache for 1 hour
    cache.set(cacheKey, analytics, cacheTTL.hour);

    const response = NextResponse.json(analytics);
    response.headers.set("X-Cache", "MISS");
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    const response = NextResponse.json(
      {
        error: "Failed to fetch sales analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
    return applySecurityHeaders(response);
  }
}

