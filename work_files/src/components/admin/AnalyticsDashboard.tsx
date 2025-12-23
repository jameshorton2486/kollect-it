"use client";

/**
 * Admin Analytics Dashboard
 * Phase 4 - Main dashboard component
 */

import { useEffect, useState } from "react";
import { DashboardMetrics } from "@/lib/analytics/types";
import { MetricCard } from "./charts/MetricCard";
import { ApprovalTrendChart } from "./charts/ApprovalTrendChart";
import { RevenueByCategory } from "./charts/RevenueByCategory";

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format: "dashboard",
      });

      const res = await fetch(`/api/admin/analytics?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.data || data);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-lux-gray">Loading analytics...</div>
    );
  if (!metrics)
    return <div className="text-center text-lux-gray">No data available</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-lux-white">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <input
            type="date"
            title="Start Date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
          />
          <input
            type="date"
            title="End Date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products Approved"
          value={metrics.approval.approved}
          unit="items"
          trend={{ direction: "up", percentage: 5 }}
        />
        <MetricCard
          title="Approval Rate"
          value={Math.round(metrics.approval.approvalRate)}
          unit="%"
          trend={{ direction: "up", percentage: 2 }}
        />
        <MetricCard
          title="Total Revenue"
          value={Math.round(metrics.revenue.totalRevenue)}
          unit="$"
          prefix="$"
          trend={{ direction: "up", percentage: 8 }}
        />
        <MetricCard
          title="Avg Price Confidence"
          value={Math.round(metrics.pricing.averageConfidence)}
          unit="%"
          trend={{ direction: "neutral", percentage: 0 }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApprovalTrendChart data={metrics.approval.trend} />
        <RevenueByCategory data={metrics.revenue.revenueByCategory} />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-lux-gold rounded-lg p-6 bg-lux-carbon">
          <h3 className="text-lux-white text-lg font-bold mb-4">
            Approval Metrics
          </h3>
          <div className="space-y-3 text-lux-gray">
            <div className="flex justify-between">
              <span>Submitted:</span>
              <span className="text-lux-gold font-semibold">
                {metrics.approval.totalSubmitted}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Approved:</span>
              <span className="text-green-400 font-semibold">
                {metrics.approval.approved}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rejected:</span>
              <span className="text-red-400 font-semibold">
                {metrics.approval.rejected}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="text-yellow-400 font-semibold">
                {metrics.approval.pending}
              </span>
            </div>
            <div className="pt-3 border-t border-lux-gold flex justify-between">
              <span>Avg Time to Approve:</span>
              <span className="text-lux-gold font-semibold">
                {metrics.approval.averageTimeToApprove.toFixed(0)} min
              </span>
            </div>
          </div>
        </div>

        <div className="border border-lux-gold rounded-lg p-6 bg-lux-carbon">
          <h3 className="text-lux-white text-lg font-bold mb-4">Pricing Metrics</h3>
          <div className="space-y-3 text-lux-gray">
            <div className="flex justify-between">
              <span>Auto-Approved ({'>'}85%):</span>
              <span className="text-green-400 font-semibold">
                {metrics.pricing.autoApprovedCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Manual Review (70-85%):</span>
              <span className="text-yellow-400 font-semibold">
                {metrics.pricing.manualReviewCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Low Confidence ({'<'}70%):</span>
              <span className="text-red-400 font-semibold">
                {metrics.pricing.lowConfidenceCount}
              </span>
            </div>
            <div className="pt-3 border-t border-lux-gold flex justify-between">
              <span>Price Accuracy:</span>
              <span className="text-lux-gold font-semibold">
                {metrics.pricing.priceAccuracy.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="border border-lux-gold rounded-lg p-6 bg-lux-carbon">
          <h3 className="text-lux-white text-lg font-bold mb-4">Product Metrics</h3>
          <div className="space-y-3 text-lux-gray">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="text-lux-gold font-semibold">
                {metrics.products.totalProducts}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Products:</span>
              <span className="text-green-400 font-semibold">
                {metrics.products.activeProducts}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Price:</span>
              <span className="text-lux-gold font-semibold">
                ${metrics.products.averagePrice.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-lux-gold text-sm">
              <p>Price Range:</p>
              <p className="text-lux-gold font-semibold mt-1">
                ${metrics.products.priceRange.min.toFixed(2)} - $
                {metrics.products.priceRange.max.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Category Details */}
      <div className="border border-lux-gold rounded-lg p-6 bg-lux-carbon">
        <h3 className="text-lux-white text-lg font-bold mb-4">
          Revenue by Category Breakdown
        </h3>
        <div className="space-y-2">
          {metrics.revenue.revenueByCategory.map((cat) => (
            <div
              key={cat.category}
              className="flex justify-between text-lux-gray pb-2 border-b border-lux-silver"
            >
              <span>{cat.category}</span>
              <span className="text-lux-gold font-semibold">
                ${cat.revenue.toFixed(2)} ({cat.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
