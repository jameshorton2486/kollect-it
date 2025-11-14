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
    <div className="border border-[#D3AF37] rounded-lg p-6 bg-gray-900">
      <h3 className="text-white text-lg font-bold mb-4">Approval Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #D3AF37",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: "#10B981", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: "#EF4444", r: 4 }}
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
