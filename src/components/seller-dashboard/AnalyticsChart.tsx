
import React from "react";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { StatCards } from "@/components/seller-dashboard/StatCards";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  products: {
    id: string;
    name: string;
    category_id: string;
    price: number;
  };
}

interface AnalyticsChartProps {
  salesData: Order[];
  metrics: {
    totalSales: number;
    averageOrderValue: number;
    totalOrders: number;
    conversionRate: number;
  };
  chartType: "area" | "bar" | "pie";
  timeFrame: "daily" | "weekly" | "monthly";
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function AnalyticsChart({
  salesData,
  metrics,
  chartType,
  timeFrame,
  dateRange,
}: AnalyticsChartProps) {
  return (
    <>
      <StatCards metrics={metrics} />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">Sales Trend</h3>
          <SalesChart 
            data={salesData} 
            chartType={chartType}
            timeFrame={timeFrame}
            dateRange={dateRange}
          />
        </div>
      </div>
    </>
  );
}
