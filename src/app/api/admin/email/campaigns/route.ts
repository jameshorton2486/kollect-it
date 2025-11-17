import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Email Campaigns API
 * Phase 6 Step 7 - Email campaign management
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mock data - replace with database queries in production
    const campaigns = [
      {
        id: "1",
        name: "January Newsletter",
        template: "New Arrivals Template",
        status: "sent",
        sentAt: "2024-01-10T09:00:00Z",
        totalRecipients: 5432,
        sent: 5432,
        opened: 3456,
        clicked: 1234,
      },
      {
        id: "2",
        name: "Holiday Sale Campaign",
        template: "Holiday Sale Template",
        status: "sent",
        sentAt: "2023-12-20T08:00:00Z",
        totalRecipients: 8765,
        sent: 8765,
        opened: 5432,
        clicked: 2345,
      },
      {
        id: "3",
        name: "Abandoned Cart Recovery",
        template: "Abandoned Cart Reminder",
        status: "sending",
        totalRecipients: 234,
        sent: 156,
        opened: 78,
        clicked: 34,
      },
      {
        id: "4",
        name: "Spring Collection Preview",
        template: "New Arrivals Template",
        status: "scheduled",
        scheduledFor: "2024-02-01T10:00:00Z",
        totalRecipients: 6543,
        sent: 0,
        opened: 0,
        clicked: 0,
      },
    ];

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching email campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch email campaigns" },
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

    // In production, save to database and trigger email service
    const newCampaign = {
      id: Date.now().toString(),
      ...body,
      status: body.scheduledFor ? "scheduled" : "sending",
      sent: 0,
      opened: 0,
      clicked: 0,
    };

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    return NextResponse.json(
      { error: "Failed to create email campaign" },
      { status: 500 },
    );
  }
}

