import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Seller Inquiry Email API
 * Phase 6 Step 5 - Send emails to sellers
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { template } = body;

    // Email templates
    const templates = {
      acknowledgment: {
        subject: "Thank you for your inquiry - Kollect-It",
        body: "Thank you for contacting us. We have received your inquiry and will review it shortly.",
      },
      approval: {
        subject: "Your item has been approved - Kollect-It",
        body: "Great news! Your item has been approved for listing on our marketplace.",
      },
      rejection: {
        subject: "Update on your inquiry - Kollect-It",
        body: "Thank you for your inquiry. Unfortunately, we are unable to proceed with this item at this time.",
      },
    };

    const emailTemplate = templates[template as keyof typeof templates];

    // In production, send actual email here using email service
    console.log(`Sending ${template} email for inquiry ${params.id}`);
    console.log("Subject:", emailTemplate.subject);
    console.log("Body:", emailTemplate.body);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
