import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/newsletter/subscribe
 * Handles newsletter subscription
 */
export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      // Already subscribed - return success without revealing this
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing!",
      });
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        firstName: firstName?.trim() || null,
        source: "website_footer",
      },
    });

    console.log(`[Newsletter] New subscriber: ${normalizedEmail}`);

    // Optionally send welcome email
    try {
      const emailModule = await import("@/lib/email");

      if (emailModule.isEmailConfigured()) {
        await emailModule.sendNewsletterWelcomeEmail({
          email: normalizedEmail,
          firstName: firstName || null,
        });
      }
    } catch (emailError) {
      // Non-critical
      console.error("[Newsletter] Failed to send welcome email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("[Newsletter] Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/newsletter/subscribe
 * Handles unsubscribe requests
 */
export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await prisma.newsletterSubscriber
      .delete({
        where: { email: normalizedEmail },
      })
      .catch(() => {
        // Ignore if not found
      });

    console.log(`[Newsletter] Unsubscribed: ${normalizedEmail}`);

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed.",
    });
  } catch (error) {
    console.error("[Newsletter] Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again." },
      { status: 500 },
    );
  }
}
