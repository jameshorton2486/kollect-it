import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Email Template Management API
 * Phase 6 Step 7 - Individual template operations
 */

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mock data - replace with database query in production
    const template = {
      id: params.id,
      name: "Order Confirmation",
      subject: "Thank you for your order #{orderNumber}",
      type: "order_confirmation",
      status: "active",
      content: "Your order has been confirmed...",
      recipients: 1234,
      lastSent: "2024-01-15T10:30:00Z",
      openRate: 78,
      clickRate: 45,
    };

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching email template:", error);
    return NextResponse.json(
      { error: "Failed to fetch email template" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    // In production, update in database
    const updatedTemplate = {
      id: params.id,
      ...body,
    };

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating email template:", error);
    return NextResponse.json(
      { error: "Failed to update email template" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // In production, delete from database
    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return NextResponse.json(
      { error: "Failed to delete email template" },
      { status: 500 },
    );
  }
}
