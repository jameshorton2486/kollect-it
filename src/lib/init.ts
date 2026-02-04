/**
 * Server Initialization
 * Phase 5 - Initialize background services on app startup
 */

import { startJobScheduler } from "@/lib/jobs/reportScheduler";

/**
 * Initialize all background services
 * Call this once on server startup
 */
export function initializeBackgroundServices() {
  try {
    // Start the report scheduler in non-production only.
    // Production should trigger via Vercel cron hitting /api/cron/reports.
    if (process.env.NODE_ENV !== "production") {
      startJobScheduler();
      console.log("✅ Background services initialized");
    } else {
      console.log("ℹ️ Background services skipped in production (cron-driven)");
    }
  } catch (error) {
    console.error("❌ Error initializing background services:", error);
  }
}

/**
 * For use in Next.js API routes or middleware
 * Export for initialization
 */
export const backgroundServicesInitialized = (() => {
  if (typeof window === "undefined") {
    // Server-side only
    initializeBackgroundServices();
    return true;
  }
  return false;
})();

