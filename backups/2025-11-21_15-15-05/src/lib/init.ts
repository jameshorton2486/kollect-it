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
    // Start the report scheduler
    startJobScheduler();
    console.log("✅ Background services initialized");
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

