"use client";

/**
 * Revenue by Category Chart
 */

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { currencyFormatter } from "@/lib/utils/recharts-formatters";

interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
  productsSold?: number;
}

interface RevenueByCategoryProps {
  data: RevenueByCategory[];
}

const COLORS = ["#D4AF37", "#B8860B", "#CD853F", "#A9A9A9", "#DAA520"];

export function RevenueByCategory({ data }: RevenueByCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-ink-700">
        No revenue data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: `${item.Category} (${item.percentage.toFixed(1)}%)`,
    value: item.revenue,
  }));

  return (
    <div className="border border-lux-gold rounded-xl p-6 bg-lux-charcoal shadow-clean">
      <h3 className="text-lux-cream text-lg font-bold mb-4">Revenue by Category</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={100}
            fill="#D4AF37"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={currencyFormatter}
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #D4AF37",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div
            key={item.Category}
            className="flex justify-between text-lux-cream"
          >
            <span>{item.Category}</span>
            <span className="text-lux-gold font-semibold">
              ${item.revenue.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
