/**
 * Security Middleware
 * Production-ready security headers and validation
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Security Headers Configuration
 * Based on OWASP recommendations
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "DENY",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection
  "X-XSS-Protection": "1; mode=block",

  // Referrer policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy (formerly Feature-Policy)
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://ik.imagekit.io https://*.anthropic.com https://api.openai.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; "),

  // Strict Transport Security (HTTPS only)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Validate request body size
 * Prevents large payload attacks
 */
export function validateBodySize(
  request: NextRequest,
  maxSizeBytes: number = 10 * 1024 * 1024, // 10MB default
): NextResponse | null {
  const contentLength = request.headers.get("content-length");

  if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
    return NextResponse.json(
      {
        error: "Payload too large",
        message: `Request body exceeds maximum size of ${maxSizeBytes} bytes`,
        maxSize: maxSizeBytes,
      },
      { status: 413 },
    );
  }

  return null;
}

/**
 * Validate Content-Type header
 */
export function validateContentType(
  request: NextRequest,
  allowedTypes: string[] = ["application/json", "multipart/form-data"],
): NextResponse | null {
  const contentType = request.headers.get("content-type");

  if (!contentType) {
    return NextResponse.json(
      {
        error: "Missing Content-Type",
        message: "Content-Type header is required",
        allowedTypes,
      },
      { status: 400 },
    );
  }

  const isValid = allowedTypes.some((type) =>
    contentType.toLowerCase().includes(type.toLowerCase()),
  );

  if (!isValid) {
    return NextResponse.json(
      {
        error: "Invalid Content-Type",
        message: `Content-Type must be one of: ${allowedTypes.join(", ")}`,
        received: contentType,
      },
      { status: 415 },
    );
  }

  return null;
}

/**
 * Validate API key for sensitive endpoints
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.WEBHOOK_SECRET;

  if (!expectedKey) {
    console.error("⚠️ WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Valid API key required",
      },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": "API-Key",
        },
      },
    );
  }

  return null;
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Check if request is from trusted origin
 */
export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) return true; // Same-origin requests don't have Origin header

  const trustedOrigins = [
    "http://localhost:3000",
    "https://kollect-it-marketplace.vercel.app",
    process.env.NEXTAUTH_URL,
  ].filter(Boolean);

  return trustedOrigins.some(
    (trusted) => origin === trusted || origin?.includes(host || ""),
  );
}

/**
 * Combined security middleware for API routes
 */
export async function securityMiddleware(
  request: NextRequest,
  options: {
    requireApiKey?: boolean;
    maxBodySize?: number;
    allowedContentTypes?: string[];
  } = {},
): Promise<NextResponse | null> {
  // Check origin
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden", message: "Request from untrusted origin" },
      { status: 403 },
    );
  }

  // Validate API key if required
  if (options.requireApiKey) {
    const keyValidation = validateApiKey(request);
    if (keyValidation) return keyValidation;
  }

  // Validate body size for POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const sizeValidation = validateBodySize(request, options.maxBodySize);
    if (sizeValidation) return sizeValidation;

    // Validate Content-Type
    const typeValidation = validateContentType(
      request,
      options.allowedContentTypes,
    );
    if (typeValidation) return typeValidation;
  }

  return null; // All checks passed
}

/**
 * CORS headers for API routes
 * WARNING: Wildcard origins (*) are NOT secure for production
 */
export function corsHeaders(origin?: string) {
  // Secure origin calculation for production
  const allowedOrigin = origin || 
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";
    
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
}

