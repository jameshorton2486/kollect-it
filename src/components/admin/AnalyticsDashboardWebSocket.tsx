"use client";

/**
 * WebSocket-Enhanced Analytics Dashboard
 * Phase 5 - Real-time metrics with auto-refresh via WebSocket
 */

import { useEffect, useState, useCallback } from "react";
import { DashboardMetrics } from "@/lib/analytics/types";
import { useWebSocket } from "@/hooks/useWebSocket";
import { MetricCard } from "./charts/MetricCard";
import { ApprovalTrendChart } from "./charts/ApprovalTrendChart";
import { RevenueByCategory } from "./charts/RevenueByCategory";

export function AnalyticsDashboardWebSocket() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const wsEnabled = Boolean(process.env.NEXT_PUBLIC_WS_URL);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(wsEnabled);

  // WebSocket connection
  const { connected, metricsCache } = useWebSocket({
    enabled: autoRefresh && wsEnabled,
    subscribeToMetrics: true,
  });

  // Update metrics from WebSocket cache when available
  useEffect(() => {
    if (metricsCache) {
      // Transform WebSocket cache to match DashboardMetrics format
      const transformedMetrics: DashboardMetrics = {
        generatedAt: new Date(),
        approval: {
          approved: metricsCache.approvedCount || 0,
          rejected: metricsCache.rejectedCount || 0,
          pending: metricsCache.pendingCount || 0,
          totalSubmitted:
            (metricsCache.approvedCount || 0) +
            (metricsCache.rejectedCount || 0) +
            (metricsCache.pendingCount || 0),
          approvalRate:
            ((metricsCache.approvedCount || 0) /
              ((metricsCache.approvedCount || 0) +
                (metricsCache.rejectedCount || 0) +
                (metricsCache.pendingCount || 0))) *
              100 || 0,
          trend: metricsCache.approvalTrend || [],
          averageTimeToApprove: metricsCache.avgTimeToApprove || 0,
        },
        revenue: {
          totalRevenue: metricsCache.totalRevenue || 0,
          totalOrders: metricsCache.totalOrders || 0,
          averageOrderValue: metricsCache.averageOrderValue || 0,
          revenueByCategory: metricsCache.revenueByCategory || [],
          revenueByMonth: [], // TODO: Add monthly revenue tracking
        },
        pricing: {
          averageConfidence: metricsCache.avgPriceConfidence || 0,
          autoApprovedCount: metricsCache.autoApprovedCount || 0,
          manualReviewCount: metricsCache.manualReviewCount || 0,
          lowConfidenceCount: metricsCache.lowConfidenceCount || 0,
          priceAccuracy: metricsCache.priceAccuracy || 0,
        },
        products: {
          totalProducts: metricsCache.totalProducts || 0,
          activeProducts: metricsCache.activeProducts || 0,
          averagePrice: metricsCache.averagePrice || 0,
          priceRange: {
            min: metricsCache.minPrice || 0,
            max: metricsCache.maxPrice || 0,
          },
          categoryBreakdown: [], // Will be populated by API call if needed
        },
      };
      setMetrics(transformedMetrics);
    }
  }, [metricsCache]);

  // Fetch metrics when dates change or WebSocket is disabled
  const fetchMetrics = useCallback(async () => {
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
  }, [startDate, endDate]);

  // Fetch on date change or when WebSocket is disabled
  useEffect(() => {
    if (!autoRefresh) {
      fetchMetrics();
    }
  }, [startDate, endDate, autoRefresh, fetchMetrics]);

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-lux-pearl p-8">
        <h1 className="heading-section text-lux-black mb-6">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 animate-pulse">
              <div className="h-4 bg-lux-cream rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-lux-cream rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="min-h-screen bg-lux-pearl p-8">
        <h1 className="heading-section text-lux-black mb-6">Analytics Dashboard</h1>
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-12 text-center">
          <p className="text-ink-600 text-lg">Analytics data is being compiled.</p>
          <p className="text-lux-gray text-sm mt-2">Check back soon for insights.</p>
          <button
            onClick={() => fetchMetrics()}
            className="btn-primary rounded-full mt-6"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-lux-white">Analytics Dashboard</h1>
          <div className="flex gap-4 items-center mt-2">
            <span className="text-sm text-lux-gray">
              {wsEnabled ? (
                connected ? (
                  <span className="text-green-400">Real-time Connected</span>
                ) : (
                  <span className="text-yellow-400">Reconnecting...</span>
                )
              ) : (
                <span className="text-lux-gray">Polling Enabled</span>
              )}
            </span>
            <label className="flex items-center gap-2 text-sm text-lux-gray">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
                disabled={!wsEnabled}
              />
              Auto-refresh
            </label>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            title="Start Date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
            disabled={autoRefresh}
          />
          <input
            type="date"
            title="End Date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
            disabled={autoRefresh}
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
              <span>Low Confidence ({'<' }70%):</span>
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
              className="flex justify-between text-lux-gray pb-2 border-b border-lux-silver-soft"
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
