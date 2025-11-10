/**
 * Analytics Types and Interfaces
 * Phase 4 - Admin Analytics Dashboard
 */

export interface ApprovalMetrics {
  totalApprovals: number;
  totalRejections: number;
  pendingCount: number;
  approvalRate: number; // Percentage (0-100)
  averageTimeToApprove: number; // In minutes
  averageTimeToReject: number; // In minutes
  todayApprovals: number;
  thisWeekApprovals: number;
  thisMonthApprovals: number;
}

export interface PricingAnalysis {
  averagePricingAccuracy: number; // Percentage of admin final price within confidence range
  averageAIPriceDeviation: number; // % diff between suggested and final price
  avgConfidenceScore: number; // Average confidence of AI pricing
  categoriesByDeviation: Array<{
    category: string;
    avgDeviation: number;
    count: number;
  }>;
  priceOverridesPercentage: number; // % of products where admin changed price
}

export interface ProductPerformance {
  totalProducts: number;
  averageTimeToSell: number; // In days
  sellThroughRate: number; // Percentage
  averageSellingPrice: number;
  priceAccuracy: number; // Actual selling price vs. suggested
  bestPerformingCategory: string;
  lowestPerformingCategory: string;
  trendingCategories: Array<{
    category: string;
    growthRate: number;
    productCount: number;
  }>;
}

export interface RevenueInsights {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrdersPlaced: number;
  conversionRate: number; // Listed products that sold
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    productsSold: number;
    percentage: number;
  }>;
  revenueGrowth: {
    daily: number; // Percentage change from yesterday
    weekly: number; // Percentage change from last week
    monthly: number; // Percentage change from last month
  };
}

export interface ApprovalTrends {
  date: string; // YYYY-MM-DD format
  approvalsCount: number;
  rejectionsCount: number;
  averageConfidence: number;
  averagePrice: number;
}

export interface CategoryMetrics {
  name: string;
  productCount: number;
  approvalRate: number;
  averagePrice: number;
  averageConfidence: number;
  revenue: number;
  soldCount: number;
  growthRate: number;
}

export interface AdminAnalyticsSummary {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  approvalMetrics: ApprovalMetrics;
  pricingAnalysis: PricingAnalysis;
  productPerformance: ProductPerformance;
  revenueInsights: RevenueInsights;
  approvalTrends: ApprovalTrends[];
  categoryMetrics: CategoryMetrics[];
  timestamp: Date;
}

export interface AnalyticsQueryParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  category?: string;
  status?: 'APPROVED' | 'REJECTED' | 'ALL';
  limit?: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  timestamp?: string;
}

export interface TimeSeriesData {
  dates: string[];
  values: number[];
  label: string;
}

export interface MetricCardData {
  title: string;
  value: number;
  unit: string;
  prefix?: string;
  trendLabel?: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; percentage: number } | number;
  comparison?: string;
  color?: string;
  borderColor?: string;
}

export interface DashboardConfig {
  refreshInterval: number; // In seconds
  defaultDateRange: 'day' | 'week' | 'month' | 'year';
  metricsToDisplay: ('approval' | 'pricing' | 'performance' | 'revenue' | 'trends' | 'categories')[];
  chartsPerRow: number;
}
