"use client";

/**
 * Approval Trend Chart Component
 */

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  date: string;
  approved: number;
  rejected: number;
  pending: number;
}

interface ApprovalTrendChartProps {
  data: TrendData[];
}

export function ApprovalTrendChart({ data }: ApprovalTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No approval trend data available
      </div>
    );
  }

  return (
    <div className="border border-gold rounded-lg p-6 bg-ink">
      <h3 className="text-white text-lg font-bold mb-4">Approval Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--surface-2))" />
          <XAxis dataKey="date" stroke="hsl(var(--ink-700))" />
          <YAxis stroke="hsl(var(--ink-700))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--ink-900))",
              border: "1px solid hsl(var(--gold-500))",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="approved"
            stroke="hsl(var(--success-500))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--success-500))", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="hsl(var(--error-500))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--error-500))", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: "#F59E0B", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

