import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/analytics/products
 *
 * Product performance analytics and inventory insights
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "30");

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - period);

    // Fetch all products with order items
    const products = await prisma.product.findMany({
      include: {
        category: true,
        orderItems: {
          where: {
            order: {
              paymentStatus: "paid",
              createdAt: {
                gte: startDate,
              },
            },
          },
          include: {
            order: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    // Overview metrics
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const soldProducts = products.filter((p) => p.status === "sold").length;
    const draftProducts = products.filter((p) => p.status === "draft").length;
    const totalValue = products
      .filter((p) => p.status === "active" || p.status === "draft")
      .reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    // Product performance
    const performance = products
      .map((product) => {
        const sales = product.orderItems.length;
        const revenue = product.orderItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0,
        );
        const views = 0; // TODO: Implement view tracking
        const daysListed = Math.floor(
          (now.getTime() - new Date(product.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const conversionRate = views > 0 ? (sales / views) * 100 : 0;

        return {
          id: product.id,
          title: product.title,
          views,
          sales,
          revenue,
          conversionRate,
          daysListed,
          status: product.status,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    // Category performance
    const categoryMap = new Map<
      string,
      {
        category: string;
        productCount: number;
        sales: number;
        revenue: number;
        totalPrice: number;
      }
    >();

    products.forEach((product) => {
      const categoryName = product.category?.name || "Uncategorized";
      const existing = categoryMap.get(categoryName) || {
        category: categoryName,
        productCount: 0,
        sales: 0,
        revenue: 0,
        totalPrice: 0,
      };

      existing.productCount += 1;
      existing.totalPrice += product.price;
      existing.sales += product.orderItems.length;
      existing.revenue += product.orderItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      categoryMap.set(categoryName, existing);
    });

    const categoryPerformance = Array.from(categoryMap.values())
      .map((cat) => ({
        ...cat,
        avgPrice: cat.productCount > 0 ? cat.totalPrice / cat.productCount : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Inventory alerts
    const inventoryAlerts = products
      .filter((product) => {
        const daysListed = Math.floor(
          (now.getTime() - new Date(product.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return (
          product.status === "active" &&
          (daysListed > 90 || product.orderItems.length === 0)
        );
      })
      .map((product) => {
        const daysListed = Math.floor(
          (now.getTime() - new Date(product.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );

        let issue = "";
        let severity: "high" | "medium" | "low" = "low";

        if (daysListed > 180 && product.orderItems.length === 0) {
          issue = "No sales in 180+ days - consider repricing or promotion";
          severity = "high";
        } else if (daysListed > 90 && product.orderItems.length === 0) {
          issue = "No sales in 90+ days - review pricing strategy";
          severity = "medium";
        } else if (product.orderItems.length === 0) {
          issue = "No sales yet - monitor performance";
          severity = "low";
        }

        return {
          id: product.id,
          title: product.title,
          issue,
          severity,
          daysListed,
        };
      })
      .sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

    // Sales velocity (weekly)
    const weeksToShow = Math.min(12, Math.ceil(period / 7));
    const salesVelocity = Array.from({ length: weeksToShow }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const sold = products.filter((p) => {
        const soldDate = p.updatedAt;
        return (
          p.status === "sold" && soldDate >= weekStart && soldDate < weekEnd
        );
      }).length;

      const listed = products.filter((p) => {
        const createdDate = new Date(p.createdAt);
        return createdDate >= weekStart && createdDate < weekEnd;
      }).length;

      return {
        period: `Week ${weeksToShow - i}`,
        sold,
        listed,
      };
    }).reverse();

    // Price distribution
    const priceRanges = [
      { range: "$0-$50", min: 0, max: 50 },
      { range: "$50-$100", min: 50, max: 100 },
      { range: "$100-$250", min: 100, max: 250 },
      { range: "$250-$500", min: 250, max: 500 },
      { range: "$500-$1000", min: 500, max: 1000 },
      { range: "$1000+", min: 1000, max: Number.POSITIVE_INFINITY },
    ];

    const priceDistribution = priceRanges.map((range) => ({
      range: range.range,
      count: products.filter((p) => p.price >= range.min && p.price < range.max)
        .length,
    }));

    const metrics = {
      overview: {
        totalProducts,
        activeProducts,
        soldProducts,
        draftProducts,
        totalValue,
        averagePrice,
      },
      performance,
      categoryPerformance,
      inventoryAlerts,
      salesVelocity,
      priceDistribution,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 },
    );
  }
}

