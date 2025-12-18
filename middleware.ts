import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const method = req.method;

  // Proceed with the request
  const res = NextResponse.next();

  // Structured request log
  // Note: durationMs only reflects middleware execution time, not full request duration
  logger.info("Request", {
    method,
    path: url.pathname,
    timestamp: new Date().toISOString(),
  });

  return res;
}

export const config = {
  // Skip static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
