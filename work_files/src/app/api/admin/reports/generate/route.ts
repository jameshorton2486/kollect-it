import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Report Generation API
 * Phase 6 Step 4 - Generate on-demand sales reports
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { type } = await request.json();

    // Determine date range based on report type
    const now = new Date();
    let startDate = new Date();

    switch (type) {
      case "daily-summary":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly-summary":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly-summary":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Fetch orders for the period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
        paymentStatus: "paid",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                category: {
                  select: {
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

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by status
    const ordersByStatus = orders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Top products
    const productSales = new Map<
      string,
      { title: string; quantity: number; revenue: number }
    >();

    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const key = item.productId;
        const existing = productSales.get(key) || {
          title: item.product?.title || "Unknown",
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSales.set(key, existing);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Generate report data
    const report = {
      type,
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        ordersByStatus,
      },
      topProducts,
      orders: orders.map((order: any) => ({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0,
        ),
      })),
    };

    // For now, return JSON (implement PDF generation later)
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}

