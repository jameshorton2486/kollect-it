"use client";

/**
 * Category Metrics Grid
 */

import { CategoryMetrics } from "@/lib/analytics/types";

interface CategoryMetricsGridProps {
  data: CategoryMetrics[];
}

export function CategoryMetricsGrid({ data }: CategoryMetricsGridProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-ink-500 py-8">
        No category data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-200">
            <th className="text-left py-3 px-4 font-semibold text-ink-700">
              Category
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Products
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Approval Rate
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Avg Price
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Confidence
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Revenue
            </th>
            <th className="text-right py-3 px-4 font-semibold text-ink-700">
              Growth
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: CategoryMetrics) => (
            <tr
              key={item.name}
              className="border-b border-gray-100 hover:bg-surface-50"
            >
              <td className="py-3 px-4 text-ink-900 font-medium">
                {item.name}
              </td>
              <td className="py-3 px-4 text-right text-ink-700">
                {item.productCount}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-green-600 font-medium">
                  {item.approvalRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-ink-700">
                $
                {item.averagePrice.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-blue-600 font-medium">
                  {item.averageConfidence.toFixed(2)}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-ink-900 font-medium">
                $
                {item.revenue.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              <td className="py-3 px-4 text-right">
                <span
                  className={
                    item.growthRate > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {item.growthRate > 0 ? "+" : ""}
                  {item.growthRate.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

