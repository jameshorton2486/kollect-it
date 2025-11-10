/**
 * Admin Analytics Page
 * Phase 4 - Route for analytics dashboard
 */

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AnalyticsDashboard />
    </div>
  );
}
