import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-admin";

/**
 * Dashboard Metrics API
 * Phase 6 - Comprehensive business metrics endpoint
 */

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "30");

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - period);

    // Previous period for trend calculation
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - period);

    // Fetch orders for revenue calculations
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        paymentStatus: "paid",
      },
      include: {
        OrderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
        paymentStatus: "paid",
      },
    });

    // Calculate revenue
    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + (order.total || 0),
      0,
    );
    const previousRevenue = previousOrders.reduce(
      (sum: number, order: any) => sum + (order.total || 0),
      0,
    );
    const revenueTrend =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    // Calculate orders metrics
    const totalOrders = orders.length;
    const previousOrderCount = previousOrders.length;
    const ordersTrend =
      previousOrderCount > 0
        ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100
        : 0;

    const pendingOrders = await prisma.order.count({
      where: {
        status: {
          in: ["pending", "processing"],
        },
      },
    });

    const completedOrders = orders.filter(
      (o: any) => o.status === "delivered" || o.status === "completed",
    ).length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue for chart
    const dailyRevenue = [];
    for (let i = 0; i < period; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayOrders = orders.filter(
        (o: any) => o.createdAt >= dayStart && o.createdAt <= dayEnd,
      );
      const dayRevenue = dayOrders.reduce(
        (sum: number, o: any) => sum + (o.total || 0),
        0,
      );

      dailyRevenue.push({
        date: dayStart.toISOString().split("T")[0],
        revenue: dayRevenue,
      });
    }

    // Products metrics
    const [totalProducts, activeProducts, soldProducts, draftProducts] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: "active" } }),
        prisma.product.count({ where: { status: "sold" } }),
        prisma.product.count({ where: { status: "draft" } }),
      ]);

    // Products by category
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const productsByCategory = categories.map((cat: any) => ({
      name: cat.name,
      count: cat._count.products,
    }));

    // Customer metrics
    const totalCustomers = await prisma.user.count();
    const newCustomersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });

    // Calculate returning customer rate
    const customersWithOrders = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            paymentStatus: "paid",
          },
        },
      },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                paymentStatus: "paid",
              },
            },
          },
        },
      },
    });

    const returningCustomers = customersWithOrders.filter(
      (u: any) => u._count.orders > 1,
    ).length;
    const returningRate =
      customersWithOrders.length > 0
        ? (returningCustomers / customersWithOrders.length) * 100
        : 0;

    // Top products by revenue
    const productSales = new Map<
      string,
      { title: string; sales: number; revenue: number }
    >();

    orders.forEach((order: any) => {
      order.OrderItem.forEach((item: any) => {
        if (item.product) {
          const existing = productSales.get(item.product.id) || {
            title: item.product.title,
            sales: 0,
            revenue: 0,
          };
          existing.sales += item.quantity;
          existing.revenue += item.price * item.quantity;
          productSales.set(item.product.id, existing);
        }
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Compile metrics
    const metrics = {
      revenue: {
        total: totalRevenue,
        trend: revenueTrend,
        thisMonth: totalRevenue,
        lastMonth: previousRevenue,
        dailyRevenue,
      },
      orders: {
        total: totalOrders,
        trend: ordersTrend,
        pending: pendingOrders,
        completed: completedOrders,
        averageValue: averageOrderValue,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        sold: soldProducts,
        draft: draftProducts,
        byCategory: productsByCategory,
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth,
        returningRate,
      },
      topProducts,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 },
    );
  }
}

