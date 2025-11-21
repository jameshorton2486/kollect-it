import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("[Newsletter] Subscription logged:", { email, firstName });
    console.log(
      "[Newsletter] Email service disabled - Google Workspace migration pending",
    );

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 },
    );
  }
}

