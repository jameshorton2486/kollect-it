'use client';

/* eslint-disable jsx-a11y/no-style-target-blank */
/**
 * Approval Trend Chart Component
 */

import { ApprovalTrends } from '@/lib/analytics/types';

interface ApprovalTrendChartProps {
  data: ApprovalTrends[];
}

export function ApprovalTrendChart({ data }: ApprovalTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No approval trend data available
      </div>
    );
  }

  // Show last 14 days
  const chartData = data.slice(-14);

  return (
    <div className="space-y-4">
      {/* Text-based summary */}
      <div className="space-y-2">
        {chartData.slice(-7).map((item) => (
          <div key={item.date} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 w-20">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div className="flex gap-4 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium w-8">{item.approvalsCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium w-8">{item.rejectionsCount}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-gray-500 text-xs">
                  Conf: {item.averageConfidence.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend and stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Approvals</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {chartData.reduce((sum, d) => sum + d.approvalsCount, 0)}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Rejections</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {chartData.reduce((sum, d) => sum + d.rejectionsCount, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
          <p className="text-lg font-semibold text-gray-900">
            {(chartData.reduce((sum, d) => sum + d.averageConfidence, 0) / chartData.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
