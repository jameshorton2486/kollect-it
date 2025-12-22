import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";
import { cache, cacheTTL } from "@/lib/cache";

/**
 * GET /api/admin/analytics/customers
 *
 * Customer analytics: new vs returning, lifetime value, purchase frequency
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
    const cacheKey = `analytics:customers:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = cache.get<any>(cacheKey);
    if (cached) {
      const response = NextResponse.json(cached);
      response.headers.set("X-Cache", "HIT");
      return applySecurityHeaders(response);
    }

    // Fetch all orders with customer info
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: "paid",
      },
      select: {
        id: true,
        customerEmail: true,
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group orders by customer email
    const customerData = orders.reduce(
      (acc, order) => {
        const email = order.customerEmail || "guest@unknown.com";
        if (!acc[email]) {
          acc[email] = {
            email,
            totalSpent: 0,
            orderCount: 0,
            firstOrder: order.createdAt,
            lastOrder: order.createdAt,
            orders: [],
          };
        }
        acc[email].totalSpent += order.total;
        acc[email].orderCount += 1;
        if (order.createdAt < acc[email].firstOrder) {
          acc[email].firstOrder = order.createdAt;
        }
        if (order.createdAt > acc[email].lastOrder) {
          acc[email].lastOrder = order.createdAt;
        }
        acc[email].orders.push(order.createdAt);
        return acc;
      },
      {} as Record<string, any>,
    );

    const customers = Object.values(customerData);

    // Calculate metrics
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(
      (c) => c.firstOrder >= startDate,
    ).length;
    const returningCustomers = customers.filter((c) => c.orderCount > 1).length;
    const averageLifetimeValue =
      totalCustomers > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers
        : 0;

    // Top customers by spend
    const topCustomers = customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map((c) => ({
        email: c.email,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
        firstOrder: c.firstOrder.toISOString(),
        lastOrder: c.lastOrder.toISOString(),
      }));

    // Customer retention (customers who made repeat purchases)
    const retentionRate =
      totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    // Average orders per customer
    const totalOrders = orders.length;
    const avgOrdersPerCustomer =
      totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    // Customer analytics response
    const analytics = {
      period: `Last ${period} days`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        retentionRate,
        averageLifetimeValue,
        avgOrdersPerCustomer,
      },
      topCustomers,
      generatedAt: new Date().toISOString(),
    };

    // Cache for 1 hour
    cache.set(cacheKey, analytics, cacheTTL.hour);

    const response = NextResponse.json(analytics);
    response.headers.set("X-Cache", "MISS");
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    const response = NextResponse.json(
      {
        error: "Failed to fetch customer analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
    return applySecurityHeaders(response);
  }
}

