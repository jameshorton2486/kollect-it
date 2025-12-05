"use client";

/**
 * Revenue by Category Chart
 */

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
  productsSold?: number;
}

interface RevenueByCategoryProps {
  data: RevenueByCategory[];
}

const COLORS = ["var(--gold-500)", "var(--gold-600)", "var(--gold-700)", "var(--lux-silver)", "var(--gold-300)"];

export function RevenueByCategory({ data }: RevenueByCategoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-ink-700">
        No revenue data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: `${item.category} (${item.percentage.toFixed(1)}%)`,
    value: item.revenue,
  }));

  return (
    <div className="border border-gold-500 rounded-lg p-6 bg-gray-900">
      <h3 className="text-white text-lg font-bold mb-4">Revenue by Category</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={100}
            fill="var(--gold-500)"
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
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "hsl(var(--ink-900))",
              border: "1px solid hsl(var(--gold-500))",
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
            key={item.category}
            className="flex justify-between text-gray-300"
          >
            <span>{item.category}</span>
            <span className="text-gold-500 font-semibold">
              ${item.revenue.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

