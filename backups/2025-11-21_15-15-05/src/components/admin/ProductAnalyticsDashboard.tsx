"use client";

/**
 * Product Analytics Dashboard Component
 * Phase 6 Step 3 - Product performance tracking and inventory management
 */

import { useEffect, useState } from "react";
import {
  Package,
  Eye,
  ShoppingCart,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProductMetrics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    soldProducts: number;
    draftProducts: number;
    totalValue: number;
    averagePrice: number;
  };
  performance: Array<{
    id: string;
    title: string;
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
    daysListed: number;
    status: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    productCount: number;
    sales: number;
    revenue: number;
    avgPrice: number;
  }>;
  inventoryAlerts: Array<{
    id: string;
    title: string;
    issue: string;
    severity: "high" | "medium" | "low";
    daysListed: number;
  }>;
  salesVelocity: Array<{
    period: string;
    sold: number;
    listed: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
}

export function ProductAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics/products?period=${period}`,
      );
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Error fetching product metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Performance tracking and inventory insights
          </p>
        </div>
        <div>
          <label htmlFor="product-period-select" className="sr-only">
            Select time period
          </label>
          <select
            id="product-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Package className="text-blue-600" size={24} />}
          label="Total Products"
          value={metrics.overview.totalProducts.toString()}
          subtitle={`${metrics.overview.activeProducts} active`}
        />
        <MetricCard
          icon={<ShoppingCart className="text-green-600" size={24} />}
          label="Products Sold"
          value={metrics.overview.soldProducts.toString()}
          subtitle={`${((metrics.overview.soldProducts / metrics.overview.totalProducts) * 100).toFixed(1)}% of total`}
        />
        <MetricCard
          icon={<DollarSign className="text-amber-600" size={24} />}
          label="Total Inventory Value"
          value={`$${metrics.overview.totalValue.toLocaleString()}`}
          subtitle={`Avg: $${metrics.overview.averagePrice.toFixed(2)}`}
        />
        <MetricCard
          icon={<AlertTriangle className="text-red-600" size={24} />}
          label="Inventory Alerts"
          value={metrics.inventoryAlerts.length.toString()}
          subtitle={`${metrics.inventoryAlerts.filter((a) => a.severity === "high").length} high priority`}
        />
      </div>

      {/* Sales Velocity & Price Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Velocity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sales Velocity
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Products sold vs listed over time
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics.salesVelocity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sold"
                stroke="#10B981"
                strokeWidth={2}
                name="Sold"
              />
              <Line
                type="monotone"
                dataKey="listed"
                stroke="#D3AF37"
                strokeWidth={2}
                name="Listed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Price Distribution
          </h2>
          <p className="text-sm text-gray-500 mb-4">Products by price range</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics.priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#D3AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Category Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.categoryPerformance.map((category) => (
                <tr key={category.category}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.productCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${category.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${category.avgPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.productCount > 0
                      ? (
                          (category.sales / category.productCount) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top Performing Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Listed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.performance.slice(0, 10).map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {product.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`${
                        product.conversionRate > 5
                          ? "text-green-600"
                          : product.conversionRate > 2
                            ? "text-yellow-600"
                            : "text-gray-500"
                      }`}
                    >
                      {product.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.daysListed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Alerts */}
      {metrics.inventoryAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Inventory Alerts
          </h2>
          <div className="space-y-3">
            {metrics.inventoryAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === "high"
                    ? "border-red-500 bg-red-50"
                    : alert.severity === "medium"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-blue-500 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        size={18}
                        className={
                          alert.severity === "high"
                            ? "text-red-600"
                            : alert.severity === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }
                      />
                      <h3 className="font-medium text-gray-900">
                        {alert.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.issue}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    {alert.daysListed} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
}

