import type { NextRequest } from "next/server";
import { respondError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

/**
 * Wrap a Next.js App Router route handler with standardized error handling.
 * Slot-safe: handles null/undefined handlers gracefully
 * Usage:
 * export const POST = withErrorHandling(async (req: NextRequest) => {
 *   // ... your logic
 *   return respondOk(req, { ok: true });
 * });
 */
export function withErrorHandling<T extends (req: NextRequest) => Promise<Response> | Response>(
  handler: T | null | undefined,
) {
  if (!handler) {
    return (async (req: NextRequest) => {
      logger.error("API handler not provided", undefined);
      return respondError(req, new Error("Handler not configured"));
    }) as unknown as T;
  }

  return (async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (err) {
      logger.error("Unhandled API route error", undefined, err);
      return respondError(req, err);
    }
  }) as unknown as T;
}
