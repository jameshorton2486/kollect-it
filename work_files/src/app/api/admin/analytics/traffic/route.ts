import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Traffic Analytics API
 * Phase 6 Step 6 - Google Analytics integration and traffic metrics
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "7");

    // In production, fetch from Google Analytics API
    // For now, return mock data
    const metrics = {
      overview: {
        totalVisitors: 15234,
        pageViews: 45678,
        bounceRate: 42,
        avgSessionDuration: 245, // seconds
        conversionRate: 3.2,
      },
      realTime: {
        activeUsers: 23,
        topPages: [
          { page: "/products", users: 8 },
          { page: "/products/antique-clock", users: 5 },
          { page: "/", users: 4 },
          { page: "/products/vintage-chair", users: 3 },
          { page: "/cart", users: 3 },
        ],
      },
      traffic: {
        daily: Array.from({ length: period }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (period - 1 - i));
          return {
            date: date.toISOString().split("T")[0],
            visitors: Math.floor(Math.random() * 1000) + 1500,
            pageViews: Math.floor(Math.random() * 3000) + 4500,
          };
        }),
        sources: [
          { source: "Organic Search", visitors: 6234, percentage: 41 },
          { source: "Direct", visitors: 4567, percentage: 30 },
          { source: "Social Media", visitors: 2345, percentage: 15 },
          { source: "Referral", visitors: 1567, percentage: 10 },
          { source: "Email", visitors: 521, percentage: 4 },
        ],
      },
      devices: [
        { device: "Mobile", count: 8234, percentage: 54 },
        { device: "Desktop", count: 5678, percentage: 37 },
        { device: "Tablet", count: 1322, percentage: 9 },
      ],
      topPages: [
        { page: "/", views: 12345, avgTime: 125, bounceRate: 35 },
        { page: "/products", views: 9876, avgTime: 185, bounceRate: 38 },
        {
          page: "/products/antique-desk",
          views: 3456,
          avgTime: 245,
          bounceRate: 28,
        },
        {
          page: "/products/vintage-lamp",
          views: 2890,
          avgTime: 198,
          bounceRate: 32,
        },
        { page: "/cart", views: 2345, avgTime: 156, bounceRate: 45 },
        { page: "/checkout", views: 1789, avgTime: 298, bounceRate: 52 },
        { page: "/about", views: 1456, avgTime: 142, bounceRate: 41 },
      ],
      conversions: {
        funnelSteps: [
          { step: "Homepage Visit", users: 10000, dropOff: 0 },
          { step: "Product View", users: 6500, dropOff: 3500 },
          { step: "Add to Cart", users: 2800, dropOff: 3700 },
          { step: "Checkout Started", users: 1200, dropOff: 1600 },
          { step: "Purchase Complete", users: 450, dropOff: 750 },
        ],
        goals: [
          { name: "Product Purchase", completions: 450, value: 125000 },
          { name: "Newsletter Signup", completions: 1234, value: 0 },
          { name: "Contact Form Submit", completions: 234, value: 0 },
        ],
      },
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching traffic analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic analytics" },
      { status: 500 },
    );
  }
}

