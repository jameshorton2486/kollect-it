import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-admin";

/**
 * POST /api/contact
 * Handles contact form submissions
 * Stores in database and optionally sends email notification
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 },
      );
    }

    // Store in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    console.log(`[Contact] New submission from ${email}: ${subject}`);

    // Try to send notification email to admin
    try {
      const emailModule = await import("@/lib/email");

      if (emailModule.isEmailConfigured()) {
        await emailModule.sendContactNotificationEmail({
          name,
          email,
          subject,
          message,
          submissionId: submission.id,
        });
        console.log("[Contact] Admin notification email sent");
      }
    } catch (emailError) {
      // Non-critical - submission is still stored
      console.error("[Contact] Failed to send admin notification:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      id: submission.id,
    });
  } catch (error) {
    console.error("[Contact] Submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit message. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * GET /api/contact
 * Admin endpoint to retrieve contact submissions
 * FIXED: Added admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    // FIXED: Added admin auth check
    await requireAdminAuth();

    const page = parseInt(
      request.nextUrl.searchParams.get("page") || "1",
    );
    const limit = parseInt(
      request.nextUrl.searchParams.get("limit") || "20",
    );
    const unreadOnly = request.nextUrl.searchParams.get("unread") === "true";

    const where = unreadOnly ? { read: false } : {};

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 },
      );
    }
    console.error("[Contact] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
