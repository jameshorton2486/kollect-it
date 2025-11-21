"use client";

/**
 * Enhanced Sales Analytics Component
 * Phase 6 Step 2 - Advanced sales reporting and forecasting
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
  Package,
} from "lucide-react";

interface EnhancedSalesData {
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  paymentMethods: Array<{ method: string; count: number; revenue: number }>;
  hourlyDistribution: Array<{ hour: number; orders: number }>;
  shippingStatus: Array<{ status: string; count: number }>;
}

interface Props {
  data: EnhancedSalesData;
  period: string;
}

const COLORS = [
  "#D3AF37",
  "#B1874C",
  "#8B6937",
  "#C7A85E",
  "#E5C65A",
  "#F4E4A6",
];

export function EnhancedSalesAnalytics({ data, period: _period }: Props) {
  // Calculate peak hour
  const peakHour = data.hourlyDistribution.reduce(
    (max, curr) => (curr.orders > max.orders ? curr : max),
    { hour: 0, orders: 0 },
  );

  return (
    <div className="space-y-8">
      {/* Revenue Trend Chart */}
      <div className="bg-surface-0 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">
              Revenue Trend
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              Daily revenue over the selected period
            </p>
          </div>
          <TrendingUp className="text-green-600" size={24} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D3AF37"
              strokeWidth={2}
              dot={{ fill: "#D3AF37", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Methods & Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Payment Methods
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Distribution by payment type
              </p>
            </div>
            <CreditCard className="text-blue-600" size={24} />
          </div>
          <div className="space-y-4">
            {data.paymentMethods.map((method, index) => (
              <div key={method.method}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-ink-700 capitalize">
                    {method.method}
                  </span>
                  <span className="text-ink-900">
                    {method.count} orders • ${method.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={
                      {
                        width: `${(method.count / data.paymentMethods.reduce((sum, m) => sum + m.count, 0)) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      } as React.CSSProperties
                    }
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Orders by Hour
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Peak hour: {peakHour.hour}:00 ({peakHour.orders} orders)
              </p>
            </div>
            <Clock className="text-purple-600" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value} orders`, "Orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="orders" fill="#9333EA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shipping Status & Order Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Status */}
        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Shipping Status
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Current order fulfillment status
              </p>
            </div>
            <Package className="text-amber-600" size={24} />
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.shippingStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.status}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.shippingStatus.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.shippingStatus.map((status, index) => (
              <div
                key={status.status}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={
                      {
                        backgroundColor: COLORS[index % COLORS.length],
                      } as React.CSSProperties
                    }
                  />
                  <span className="capitalize text-ink-700">
                    {status.status}
                  </span>
                </div>
                <span className="font-medium text-ink-900">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Orders Over Time
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Daily order count trend
              </p>
            </div>
            <TrendingDown className="text-indigo-600" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value} orders`, "Orders"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: "#6366F1", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

