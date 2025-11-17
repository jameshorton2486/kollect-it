/**
 * Admin Analytics Page
 * Phase 5 - Route for analytics dashboard with WebSocket support
 */

import { AnalyticsDashboardWebSocket } from "@/components/admin/AnalyticsDashboardWebSocket";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AnalyticsDashboardWebSocket />
    </div>
  );
}

