import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Email Templates API
 * Phase 6 Step 7 - Email template management
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mock data - replace with database queries in production
    const templates = [
      {
        id: "1",
        name: "Order Confirmation",
        subject: "Thank you for your order #{orderNumber}",
        type: "order_confirmation",
        status: "active",
        content: "Your order has been confirmed...",
        recipients: 1234,
        lastSent: "2024-01-15T10:30:00Z",
        openRate: 78,
        clickRate: 45,
      },
      {
        id: "2",
        name: "Shipping Notification",
        subject: "Your order is on its way!",
        type: "shipping_update",
        status: "active",
        content: "Your items have been shipped...",
        recipients: 987,
        lastSent: "2024-01-14T15:20:00Z",
        openRate: 85,
        clickRate: 62,
      },
      {
        id: "3",
        name: "Abandoned Cart Reminder",
        subject: "Complete your purchase",
        type: "abandoned_cart",
        status: "active",
        content: "You left items in your cart...",
        recipients: 456,
        lastSent: "2024-01-13T09:00:00Z",
        openRate: 42,
        clickRate: 28,
      },
      {
        id: "4",
        name: "Holiday Sale",
        subject: "25% Off - Limited Time!",
        type: "promotion",
        status: "paused",
        content: "Special holiday offers...",
        recipients: 5432,
        lastSent: "2023-12-20T08:00:00Z",
        openRate: 65,
        clickRate: 38,
      },
      {
        id: "5",
        name: "New Arrivals",
        subject: "Check out our latest antiques",
        type: "promotion",
        status: "draft",
        content: "New items just added...",
        recipients: 0,
      },
    ];

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch email templates" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    // In production, save to database
    const newTemplate = {
      id: Date.now().toString(),
      ...body,
      recipients: 0,
      status: "draft",
    };

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { error: "Failed to create email template" },
      { status: 500 },
    );
  }
}

