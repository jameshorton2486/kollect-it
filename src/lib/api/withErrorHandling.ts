import type { NextRequest } from "next/server";
import { respondError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

/**
 * Wrap a Next.js App Router route handler with standardized error handling.
 * Usage:
 * export const POST = withErrorHandling(async (req: NextRequest) => {
 *   // ... your logic
 *   return respondOk(req, { ok: true });
 * });
 */
export function withErrorHandling<T extends (req: NextRequest) => Promise<Response> | Response>(
  handler: T,
) {
  return (async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (err) {
      logger.error("Unhandled API route error", undefined, err);
      return respondError(req, err);
    }
  }) as T;
}
