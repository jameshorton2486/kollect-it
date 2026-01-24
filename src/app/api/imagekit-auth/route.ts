import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getImageKitAuthParams } from "@/lib/imagekit";

/**
 * ImageKit Authentication Endpoint
 * Returns authentication parameters for client-side uploads
 *
 * Used by ImageKit uploader on admin pages
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authParams = await getImageKitAuthParams();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 },
    );
  }
}
