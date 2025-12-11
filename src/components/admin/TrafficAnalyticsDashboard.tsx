"use client";

/**
 * Traffic Analytics Dashboard Component
 * Phase 6 Step 6 - Google Analytics integration and traffic metrics
 */

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  MousePointerClick,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrafficMetrics {
  overview: {
    totalVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
  };
  realTime: {
    activeUsers: number;
    topPages: Array<{ page: string; users: number }>;
  };
  traffic: {
    daily: Array<{ date: string; visitors: number; pageViews: number }>;
    sources: Array<{ source: string; visitors: number; percentage: number }>;
  };
  devices: Array<{ device: string; count: number; percentage: number }>;
  topPages: Array<{
    page: string;
    views: number;
    avgTime: number;
    bounceRate: number;
  }>;
  conversions: {
    funnelSteps: Array<{ step: string; users: number; dropOff: number }>;
    goals: Array<{ name: string; completions: number; value: number }>;
  };
}

const COLORS = [
  "#D4AF37", // gold-500
  "#B8860B", // gold-600
  "#8B6F37", // gold-700
  "#C7A85E", // gold-400 equivalent
  "#E5C65A", // gold-300 equivalent
  "#F4E4A6", // gold-200 equivalent
];

export function TrafficAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<TrafficMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7");

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics/traffic?period=${period}`,
      );
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Error fetching traffic metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lux-gold"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-8 text-center text-ink-600">
        Failed to load traffic analytics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-section text-lux-black">
            Traffic & Analytics
          </h2>
          <p className="text-ink-600 mt-1">
            Real-time visitor metrics and traffic sources
          </p>
        </div>
        <div>
          <label htmlFor="traffic-period-select" className="sr-only">
            Select time period
          </label>
          <select
            id="traffic-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="bg-gradient-to-r from-lux-gold to-lux-gold-light rounded-xl shadow-clean p-6 text-lux-black">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-subsection">Real-Time Activity</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lux-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-4xl font-bold">
              {metrics.realTime.activeUsers}
            </div>
            <div className="text-lux-black/80 mt-1">Active users right now</div>
          </div>
          <div>
            <div className="text-sm text-lux-black/80 mb-2 font-medium">Top Active Pages</div>
            <div className="space-y-1">
              {metrics.realTime.topPages.map((page, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate">{page.page}</span>
                  <span className="font-semibold">{page.users} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-blue-600" size={24} />
            <TrendingUp className="text-green-600" size={16} />
          </div>
          <div className="text-2xl font-bold text-lux-black">
            {metrics.overview.totalVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-ink-600 mt-1">Total Visitors</div>
        </div>

        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="text-purple-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-lux-black">
            {metrics.overview.pageViews.toLocaleString()}
          </div>
          <div className="text-sm text-ink-600 mt-1">Page Views</div>
        </div>

        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
          <div className="flex items-center justify-between mb-2">
            <MousePointerClick className="text-lux-gold" size={24} />
          </div>
          <div className="text-2xl font-bold text-ink-900">
            {metrics.overview.bounceRate}%
          </div>
          <div className="text-sm text-ink-700 mt-1">Bounce Rate</div>
        </div>

        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-indigo-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-ink-900">
            {Math.floor(metrics.overview.avgSessionDuration / 60)}m{" "}
            {metrics.overview.avgSessionDuration % 60}s
          </div>
          <div className="text-sm text-ink-700 mt-1">Avg. Session</div>
        </div>

        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-green-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-ink-900">
            {metrics.overview.conversionRate}%
          </div>
          <div className="text-sm text-ink-700 mt-1">Conversion Rate</div>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
        <h3 className="heading-subsection text-lux-black mb-4">
          Traffic Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.traffic.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(28 8% 80%)" />
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
              formatter={(value: number) => [value, ""]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#D4AF37"
              strokeWidth={2}
              name="Visitors"
              dot={{ fill: "#D4AF37" }}
            />
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke="#B8860B"
              strokeWidth={2}
              name="Page Views"
              dot={{ fill: "#B8860B" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Sources & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-lux-gold" size={24} />
            <h3 className="heading-subsection text-lux-black">
              Traffic Sources
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={metrics.traffic.sources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.source}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="visitors"
              >
                {metrics.traffic.sources.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {metrics.traffic.sources.map((source, index) => (
              <div
                key={source.source}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  {/* Dynamic color from array - inline style required for chart colors */}
                  {/* @ts-ignore - Microsoft Edge Tools: Dynamic inline style required */}
                  <div
                    className="w-3 h-3 rounded-full"
                    style={
                      {
                        "--chart-color": COLORS[index % COLORS.length],
                        backgroundColor: "var(--chart-color)",
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-ink-700">{source.source}</span>
                </div>
                <span className="font-medium text-ink-900">
                  {source.visitors.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-surface-0 rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="text-lux-gold" size={24} />
            <h3 className="text-xl font-semibold text-ink-900">
              Device Breakdown
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics.devices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="device" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {metrics.devices.map((device) => (
              <div key={device.device} className="text-center">
                {device.device === "Mobile" && (
                  <Smartphone
                    className="mx-auto text-lux-gray-dark mb-1"
                    size={24}
                  />
                )}
                {device.device === "Desktop" && (
                  <Monitor className="mx-auto text-lux-gray-dark mb-1" size={24} />
                )}
                {device.device === "Tablet" && (
                  <BarChart3 className="mx-auto text-lux-gray-dark mb-1" size={24} />
                )}
                <div className="text-lg font-bold text-ink-900">
                  {device.percentage}%
                </div>
                <div className="text-xs text-ink-700">{device.device}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-surface-0 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-ink-900 mb-4">
          Top Performing Pages
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                  Avg. Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-200">
              {metrics.topPages.map((page, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                    {page.page}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-600">
                    {Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-600">
                    {page.bounceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-surface-0 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-ink-900 mb-4">
          Conversion Funnel
        </h3>
        <div className="space-y-4">
          {metrics.conversions.funnelSteps.map((step, index) => {
            const percentage =
              index === 0
                ? 100
                : Math.round(
                    (step.users / metrics.conversions.funnelSteps[0].users) *
                      100,
                  );
            return (
              <div key={step.step}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-ink-700">{step.step}</span>
                  <div className="flex gap-4">
                    <span className="text-ink-900">
                      {step.users.toLocaleString()} users ({percentage}%)
                    </span>
                    {step.dropOff > 0 && (
                      <span className="text-red-600">
                        -{step.dropOff} drop-off
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-4">
                  {/* Dynamic width percentage - inline style required for progress bar */}
                  {/* eslint-disable-next-line @next/next/no-inline-styles */}
                  <div
                    className="bg-gradient-to-r from-lux-gold to-lux-gold-light h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                    style={{ width: `${percentage}%` } as React.CSSProperties}
                  >
                    <span className="text-xs text-white font-medium">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

