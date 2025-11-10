'use client';

/**
 * Admin Analytics Dashboard
 * Phase 4 - Main dashboard component
 */

import { useEffect, useState, useCallback } from 'react';
import { AdminAnalyticsSummary, MetricCardData } from '@/lib/analytics/types';
import { MetricCard } from './charts/MetricCard';
import { ApprovalTrendChart } from './charts/ApprovalTrendChart';
import { RevenueByCategory } from './charts/RevenueByCategory';
import { CategoryMetricsGrid } from './charts/CategoryMetricsGrid';

interface DashboardProps {
  initialData?: AdminAnalyticsSummary;
}

export function AnalyticsDashboard({ initialData }: DashboardProps) {
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: new Date().toISOString().split('T')[0],
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate);
      }

      const response = await fetch(`/api/admin/analytics?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, fetchAnalytics]);

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading Analytics</h3>
        <p>{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
        No analytics data available
      </div>
    );
  }

  // Prepare metric cards
  const metricCards: MetricCardData[] = [
    {
      title: 'Total Approvals',
      value: analytics.approvalMetrics.totalApprovals,
      unit: 'items',
      trend: analytics.approvalMetrics.approvalRate,
      trendLabel: 'approval rate',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Pending Review',
      value: analytics.approvalMetrics.pendingCount,
      unit: 'items',
      trend: 0,
      trendLabel: 'awaiting review',
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Total Revenue',
      value: analytics.revenueInsights.totalRevenue,
      unit: '$',
      prefix: '$',
      trend: analytics.revenueInsights.revenueGrowth.monthly,
      trendLabel: 'monthly growth',
      color: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Avg Order Value',
      value: analytics.revenueInsights.averageOrderValue,
      unit: '$',
      prefix: '$',
      trend: 0,
      trendLabel: 'per order',
      color: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with date range */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <div>
            <label htmlFor="start-date" className="text-sm text-gray-600">
              From
            </label>
            <input
              id="start-date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="text-sm text-gray-600">
              To
            </label>
            <input
              id="end-date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 self-end"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Approval Trends</h2>
          <ApprovalTrendChart data={analytics.approvalTrends} />
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by Category</h2>
          <RevenueByCategory data={analytics.revenueInsights.revenueByCategory} />
        </div>
      </div>

      {/* Category Metrics Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Performance</h2>
        <CategoryMetricsGrid data={analytics.categoryMetrics} />
      </div>

      {/* Pricing Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Pricing Accuracy</p>
            <p className="text-2xl font-bold text-blue-600">
              {analytics.pricingAnalysis.averagePricingAccuracy.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Confidence</p>
            <p className="text-2xl font-bold text-purple-600">
              {analytics.pricingAnalysis.avgConfidenceScore.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Price Overrides</p>
            <p className="text-2xl font-bold text-orange-600">
              {analytics.pricingAnalysis.priceOverridesPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.productPerformance.totalProducts}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Sell-Through Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.productPerformance.sellThroughRate.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Selling Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${analytics.productPerformance.averageSellingPrice.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Time to Sell</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.productPerformance.averageTimeToSell} days
            </p>
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="text-xs text-gray-500 text-right">
        Last updated: {new Date(analytics.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
