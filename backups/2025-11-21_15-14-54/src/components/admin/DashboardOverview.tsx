"use client";

/**
 * Enhanced Dashboard Overview Component
 * Phase 6 - Comprehensive sales and operational metrics
 */

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardMetrics {
  revenue: {
    total: number;
    trend: number;
    thisMonth: number;
    lastMonth: number;
    dailyRevenue: Array<{ date: string; revenue: number }>;
  };
  orders: {
    total: number;
    trend: number;
    pending: number;
    completed: number;
    averageValue: number;
  };
  products: {
    total: number;
    active: number;
    sold: number;
    draft: number;
    byCategory: Array<{ name: string; count: number }>;
  };
  customers: {
    total: number;
    newThisMonth: number;
    returningRate: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
}

const COLORS = ["#D3AF37", "#B1874C", "#8B6937", "#C7A85E", "#E5C65A"];

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30"); // days

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/dashboard/metrics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12 text-gray-500">
        No metrics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
        <div>
          <label htmlFor="period-select" className="sr-only">
            Select time period
          </label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.revenue.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend={metrics.revenue.trend}
          icon={<DollarSign className="text-green-600" size={24} />}
          trendLabel={`${metrics.revenue.trend > 0 ? "+" : ""}${metrics.revenue.trend.toFixed(1)}% vs previous period`}
        />

        <MetricCard
          title="Total Orders"
          value={metrics.orders.total.toString()}
          trend={metrics.orders.trend}
          icon={<ShoppingCart className="text-blue-600" size={24} />}
          subtitle={`${metrics.orders.pending} pending`}
        />

        <MetricCard
          title="Active Products"
          value={metrics.products.active.toString()}
          subtitle={`${metrics.products.total} total products`}
          icon={<Package className="text-purple-600" size={24} />}
        />

        <MetricCard
          title="Total Customers"
          value={metrics.customers.total.toString()}
          subtitle={`${metrics.customers.newThisMonth} new this month`}
          icon={<Users className="text-indigo-600" size={24} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.revenue.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Revenue",
                ]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D3AF37"
                strokeWidth={2}
                dot={{ fill: "#D3AF37", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.products.byCategory}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.name} (${entry.count})`}
                labelLine={{ stroke: "#999", strokeWidth: 1 }}
              >
                {metrics.products.byCategory.map((_entry, index) => (
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
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Order Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Avg Order Value
            </h3>
            <Clock className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-amber-600">
            ${metrics.orders.averageValue.toFixed(2)}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Based on {metrics.orders.completed} completed orders
          </p>
        </div>

        {/* Customer Retention */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Retention
            </h3>
            <Users className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-indigo-600">
            {metrics.customers.returningRate.toFixed(1)}%
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Customers who made repeat purchases
          </p>
        </div>

        {/* Product Status Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Status
            </h3>
            <Package className="text-gray-400" size={20} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-sm font-semibold text-green-600">
                {metrics.products.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sold</span>
              <span className="text-sm font-semibold text-blue-600">
                {metrics.products.sold}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Draft</span>
              <span className="text-sm font-semibold text-yellow-600">
                {metrics.products.draft}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.sales} {product.sales === 1 ? "sale" : "sales"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  subtitle?: string;
  icon: React.ReactNode;
  trendLabel?: string;
}

function MetricCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  trendLabel,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      {trend !== undefined && (
        <div
          className={`flex items-center text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {trend >= 0 ? (
            <TrendingUp className="mr-1" size={16} />
          ) : (
            <TrendingDown className="mr-1" size={16} />
          )}
          <span>
            {trendLabel || `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`}
          </span>
        </div>
      )}
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}

