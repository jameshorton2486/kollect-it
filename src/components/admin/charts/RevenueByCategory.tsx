'use client';

/**
 * Revenue by Category Chart
 */

interface RevenueByCategory {
  category: string;
  revenue: number;
  productsSold: number;
  percentage: number;
}

interface RevenueByCategoryProps {
  data: RevenueByCategory[];
}

export function RevenueByCategory({ data }: RevenueByCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No revenue data available
      </div>
    );
  }

  const totalRevenue = data.reduce((sum: number, item: RevenueByCategory) => sum + item.revenue, 0);

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item: RevenueByCategory) => {
        const percentage = Math.round((item.revenue / totalRevenue) * 100);
        return (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <span className="text-sm font-semibold text-gray-900">
                ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className={`h-full bg-blue-600 w-${percentage > 100 ? '100' : percentage}`} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {item.percentage.toFixed(1)}% • {item.productsSold} units sold
            </p>
          </div>
        );
      })}
    </div>
  );
}
