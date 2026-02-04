/**
 * Rate Limiting Implementation
 * Protects API endpoints from abuse using in-memory store
 * TODO: Replace with Redis for production multi-instance deployments
 */

import { NextRequest, NextResponse } from "next/server";
import { redisEnabled, redisExpire, redisIncr } from "./redis-rest";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();
let redisWarningLogged = false;

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

/**
 * Rate limit middleware
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns Response if rate limited, null otherwise
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  },
): Promise<NextResponse | null> {
  // Get client identifier (IP address)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "anonymous";

  const now = Date.now();
  const key = `rate-limit:${ip}`;

  if (process.env.NODE_ENV === "production" && !redisEnabled) {
    if (!redisWarningLogged) {
      console.error(
        "[Rate Limit] Redis is not configured in production. Falling back to in-memory rate limiting.",
      );
      redisWarningLogged = true;
    }
  }

  if (redisEnabled) {
    const windowKey = `rate-limit:${ip}:${Math.floor(now / config.interval)}`;
    const count = (await redisIncr(windowKey)) ?? 1;
    if (count === 1) {
      await redisExpire(windowKey, Math.ceil(config.interval / 1000));
    }

    if (count > config.uniqueTokenPerInterval) {
      const retryAfter = Math.ceil(config.interval / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.uniqueTokenPerInterval.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              (now + config.interval) / 1000,
            ).toString(),
            "X-RateLimit-Backend": "redis",
          },
        },
      );
    }

    return null;
  }

  // In-memory fallback
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.interval,
    };
    rateLimitStore.set(key, entry);
    return null;
  }

  entry.count++;

  if (entry.count > config.uniqueTokenPerInterval) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.uniqueTokenPerInterval.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(entry.resetTime / 1000).toString(),
          "X-RateLimit-Backend": "memory",
        },
      },
    );
  }

  rateLimitStore.set(key, entry);
  return null;
}

/**
 * Create a rate limiter with specific configuration
 */
export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig: RateLimitConfig = {
    interval: config.interval || 60 * 1000,
    uniqueTokenPerInterval: config.uniqueTokenPerInterval || 10,
  };

  return (request: NextRequest) => rateLimit(request, finalConfig);
}

/**
 * Preset rate limiters for different use cases
 */
export const rateLimiters = {
  // Strict: For authentication endpoints
  strict: createRateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 min
  }),

  // Standard: For general API endpoints
  standard: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30, // 30 requests per minute
  }),

  // Relaxed: For read-only endpoints
  relaxed: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100, // 100 requests per minute
  }),

  // AI Operations: Expensive operations
  ai: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5, // 5 AI calls per minute
  }),

  // Upload: File upload endpoints
  upload: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 uploads per minute
  }),
};

/**
 * Clear rate limit for a specific IP (admin use)
 */
export function clearRateLimit(ip: string): boolean {
  const key = `rate-limit:${ip}`;
  return rateLimitStore.delete(key);
}

/**
 * Get rate limit stats for monitoring
 */
export function getRateLimitStats() {
  return {
    totalKeys: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
      key: key.replace("rate-limit:", ""),
      count: entry.count,
      resetTime: new Date(entry.resetTime).toISOString(),
    })),
  };
}

