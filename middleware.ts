import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export function middleware(req: NextRequest) {
  const start = Date.now();
  const url = req.nextUrl.clone();
  const method = req.method;

  // Proceed with the request
  const res = NextResponse.next();

  const duration = Date.now() - start;
  // Structured request log
  logger.info("Request", {
    method,
    path: url.pathname,
    durationMs: duration,
  });

  return res;
}

export const config = {
  // Skip static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
