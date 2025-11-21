"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { exportSalesCSV, exportProductsCSV } from "@/lib/csv-export";
import { EnhancedSalesAnalytics } from "@/components/admin/EnhancedSalesAnalytics";

interface SalesData {
  period: string;
  startDate: string;
  endDate: string;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
  };
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  categoryData: Array<{ name: string; revenue: number; orders: number }>;
  topProducts: Array<{
    id: string;
    title: string;
    revenue: number;
    quantity: number;
    orders: number;
  }>;
  paymentMethods: Array<{ method: string; count: number; revenue: number }>;
  hourlyDistribution: Array<{ hour: number; orders: number }>;
  shippingStatus: Array<{ status: string; count: number }>;
}

export default function SalesAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as any).role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Fetch sales data
  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics/sales?period=${period}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSales = () => {
    if (!salesData) return;
    const exportData = salesData.dailyRevenue.map((day) => ({
      date: day.date,
      revenue: day.revenue,
      orders: 0, // TODO: Add orders per day
      avgOrderValue: 0,
    }));
    exportSalesCSV(exportData);
  };

  const handleExportProducts = () => {
    if (!salesData) return;
    exportProductsCSV(salesData.topProducts);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-ink-600">Loading sales analytics...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">
              Sales Analytics
            </h1>
            <p className="mt-2 text-ink-600">
              Revenue trends, top products, and category performance
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <label htmlFor="period-select" className="sr-only">
              Select time period
            </label>
            <select
              id="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-border-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {salesData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-500">
                  Total Revenue
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  $
                  {salesData.summary.totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                {salesData.summary.revenueGrowth !== 0 && (
                  <div
                    className={`mt-2 text-sm ${salesData.summary.revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {salesData.summary.revenueGrowth > 0 ? "+" : ""}
                    {salesData.summary.revenueGrowth.toFixed(1)}% from previous
                    period
                  </div>
                )}
              </div>

              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-500">
                  Total Orders
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  {salesData.summary.totalOrders}
                </div>
                {salesData.summary.orderGrowth !== 0 && (
                  <div
                    className={`mt-2 text-sm ${salesData.summary.orderGrowth > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {salesData.summary.orderGrowth > 0 ? "+" : ""}
                    {salesData.summary.orderGrowth.toFixed(1)}% from previous
                    period
                  </div>
                )}
              </div>

              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-500">
                  Average Order Value
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  ${salesData.summary.averageOrderValue.toFixed(2)}
                </div>
              </div>

              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-500">
                  Export Data
                </div>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={handleExportSales}
                    className="w-full px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Export Sales CSV
                  </button>
                  <button
                    onClick={handleExportProducts}
                    className="w-full px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Export Products CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Analytics Charts */}
            <div className="mb-8">
              <EnhancedSalesAnalytics
                data={{
                  dailyRevenue: salesData.dailyRevenue,
                  paymentMethods: salesData.paymentMethods,
                  hourlyDistribution: salesData.hourlyDistribution,
                  shippingStatus: salesData.shippingStatus,
                }}
                period={period}
              />
            </div>

            {/* Revenue by Category */}
            <div className="bg-surface-0 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-ink-900 mb-4">
                Revenue by Category
              </h2>
              <div className="space-y-4">
                {salesData.categoryData.slice(0, 10).map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-ink-700">
                        {category.name}
                      </span>
                      <span className="text-ink-900">
                        ${category.revenue.toFixed(2)} ({category.orders}{" "}
                        orders)
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={
                          {
                            width: `${(category.revenue / salesData.summary.totalRevenue) * 100}%`,
                          } as React.CSSProperties
                        }
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-surface-0 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-ink-900 mb-4">
                Top 10 Products by Revenue
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-surface-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface-0 divide-y divide-gray-200">
                    {salesData.topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-900">
                          {product.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                          ${product.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-500">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-500">
                          {product.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

