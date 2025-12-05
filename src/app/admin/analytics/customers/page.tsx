"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { exportCustomersCSV } from "@/lib/csv-export";

interface CustomerData {
  period: string;
  summary: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    retentionRate: number;
    averageLifetimeValue: number;
    avgOrdersPerCustomer: number;
  };
  topCustomers: Array<{
    email: string;
    totalSpent: number;
    orderCount: number;
    firstOrder: string;
    lastOrder: string;
  }>;
}

export default function CustomerAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as any).role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Fetch customer data
  useEffect(() => {
    fetchCustomerData();
  }, [period]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics/customers?period=${period}`,
      );
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCustomers = () => {
    if (!customerData) return;
    exportCustomersCSV(customerData.topCustomers);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-ink-600">Loading customer analytics...</p>
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
              Customer Analytics
            </h1>
            <p className="mt-2 text-ink-600">
              Customer lifetime value, retention, and purchase behavior
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <select
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

        {customerData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-700">
                  Total Customers
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  {customerData.summary.totalCustomers}
                </div>
                <div className="mt-2 text-sm text-ink-600">
                  {customerData.summary.newCustomers} new customers
                </div>
              </div>

              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-700">
                  Retention Rate
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  {customerData.summary.retentionRate.toFixed(1)}%
                </div>
                <div className="mt-2 text-sm text-ink-600">
                  {customerData.summary.returningCustomers} returning customers
                </div>
              </div>

              <div className="bg-surface-0 rounded-lg shadow p-6">
                <div className="text-sm font-medium text-ink-700">
                  Average Lifetime Value
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  ${customerData.summary.averageLifetimeValue.toFixed(2)}
                </div>
                <div className="mt-2 text-sm text-ink-600">
                  {customerData.summary.avgOrdersPerCustomer.toFixed(1)} avg
                  orders per customer
                </div>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="bg-surface-0 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-ink-900 mb-4">
                Customer Segments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New vs Returning */}
                <div>
                  <h3 className="text-sm font-medium text-ink-700 mb-3">
                    New vs Returning
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ink-600">New Customers</span>
                        <span className="font-medium text-ink-900">
                          {customerData.summary.newCustomers} (
                          {(
                            (customerData.summary.newCustomers /
                              customerData.summary.totalCustomers) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(customerData.summary.newCustomers / customerData.summary.totalCustomers) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ink-600">
                          Returning Customers
                        </span>
                        <span className="font-medium text-ink-900">
                          {customerData.summary.returningCustomers} (
                          {(
                            (customerData.summary.returningCustomers /
                              customerData.summary.totalCustomers) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(customerData.summary.returningCustomers / customerData.summary.totalCustomers) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex flex-col justify-center">
                  <button
                    onClick={handleExportCustomers}
                    className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Export Top Customers CSV
                  </button>
                  <p className="mt-2 text-sm text-ink-700 text-center">
                    Export top {customerData.topCustomers.length} customers by
                    lifetime value
                  </p>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-surface-0 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-ink-900 mb-4">
                Top Customers by Lifetime Value
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-surface-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                        First Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                        Last Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface-0 divide-y divide-gray-200">
                    {customerData.topCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-900">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700">
                          {customer.orderCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700">
                          {new Date(customer.firstOrder).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700">
                          {new Date(customer.lastOrder).toLocaleDateString()}
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

