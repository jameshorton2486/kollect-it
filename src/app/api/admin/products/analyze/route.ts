import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateProductAnalysis } from "@/lib/ai/product-generator";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiters } from "@/lib/rate-limit";
import { securityMiddleware, applySecurityHeaders } from "@/lib/security";
import { cache, cacheKeys, cacheTTL } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    // Apply security middleware
    const securityCheck = await securityMiddleware(req, {
      maxBodySize: 1024 * 1024, // 1MB max
      allowedContentTypes: ["application/json"],
    });
    if (securityCheck) return securityCheck;

    // Apply AI-specific rate limiting (5 requests per minute)
    const rateLimitCheck = await rateLimiters.ai(req);
    if (rateLimitCheck) return rateLimitCheck;

    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
    }

    const { imageUrl, category } = await req.json();

    if (!imageUrl || !category) {
      return NextResponse.json(
        { error: "Missing imageUrl or category" },
        { status: 400 },
      );
    }

    console.log(`\n🔍 [API] Analyze request received`);
    console.log(`   Admin: ${session.user.email}`);
    console.log(`   Category: ${category}`);

    // Check cache first (30 min TTL for AI analysis)
    const cacheKey = cacheKeys.aiAnalysis(imageUrl);
    const cached = cache.get<any>(cacheKey);

    if (cached) {
      console.log(`✅ [API] Returning cached analysis`);
      const response = NextResponse.json({ ...cached, cached: true });
      return applySecurityHeaders(response);
    }

    // Run AI analysis
    const analysis = await generateProductAnalysis(imageUrl, category);

    // Cache the result
    cache.set(cacheKey, analysis, cacheTTL.long);

    console.log(`✅ [API] Analysis complete, returning to client`);
    const response = NextResponse.json(analysis);
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("❌ [API] Analysis endpoint error:", error);
    const errorResponse = NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Analysis failed - please try again",
      },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

