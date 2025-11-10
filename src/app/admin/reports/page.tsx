/**
 * Admin Reports Page
 * Phase 5 - Schedule and manage automated reports
 */

import ReportScheduler from '@/components/admin/ReportScheduler';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ReportScheduler />
      </div>
    </div>
  );
}
