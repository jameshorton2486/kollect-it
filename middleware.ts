import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/logger";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const method = req.method;
  const pathname = url.pathname;

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || token.role !== "admin") {
      logger.warn("Unauthorized admin access attempt", { 
        pathname,
        method,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Structured request log
  // Note: durationMs only reflects middleware execution time, not full request duration
  logger.info("Request", {
    method,
    path: pathname,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.next();
}

export const config = {
  // Skip static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
