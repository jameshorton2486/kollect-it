/**
 * WebSocket Types & Events
 * Phase 5 - Real-time Analytics
 */

// WebSocket event types
export enum WebSocketEventType {
  METRICS_UPDATE = "METRICS_UPDATE",
  APPROVAL_TREND = "APPROVAL_TREND",
  REVENUE_UPDATE = "REVENUE_UPDATE",
  PRICING_UPDATE = "PRICING_UPDATE",
  PRODUCT_UPDATE = "PRODUCT_UPDATE",
  ALERT = "ALERT",
  CONNECTION = "CONNECTION",
  DISCONNECTION = "DISCONNECTION",
  ERROR = "ERROR",
}

// Real-time metric update payload
export interface MetricsUpdateEvent {
  type: WebSocketEventType.METRICS_UPDATE;
  timestamp: Date;
  data: {
    approvalRate: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingCount: number;
  };
}

// Approval trend real-time update
export interface ApprovalTrendEvent {
  type: WebSocketEventType.APPROVAL_TREND;
  timestamp: Date;
  data: {
    date: string;
    approved: number;
    rejected: number;
    pending: number;
  };
}

// Revenue real-time update
export interface RevenueUpdateEvent {
  type: WebSocketEventType.REVENUE_UPDATE;
  timestamp: Date;
  data: {
    category: string;
    revenue: number;
    percentage: number;
  };
}

// Pricing confidence update
export interface PricingUpdateEvent {
  type: WebSocketEventType.PRICING_UPDATE;
  timestamp: Date;
  data: {
    averagePricingAccuracy: number;
    avgConfidenceScore: number;
  };
}

// Product metrics update
export interface ProductUpdateEvent {
  type: WebSocketEventType.PRODUCT_UPDATE;
  timestamp: Date;
  data: {
    totalProducts: number;
    categoriesCount: number;
  };
}

// Alert notification
export interface AlertEvent {
  type: WebSocketEventType.ALERT;
  timestamp: Date;
  severity: "info" | "warning" | "error";
  title: string;
  message: string;
}

// Connection event
export interface ConnectionEvent {
  type: WebSocketEventType.CONNECTION;
  timestamp: Date;
  clientId: string;
  status: "connected";
}

// Union type for all events
export type WebSocketEvent =
  | MetricsUpdateEvent
  | ApprovalTrendEvent
  | RevenueUpdateEvent
  | PricingUpdateEvent
  | ProductUpdateEvent
  | AlertEvent
  | ConnectionEvent;

// Client subscription options
export interface SubscriptionOptions {
  metrics?: boolean;
  approvalTrends?: boolean;
  revenue?: boolean;
  pricing?: boolean;
  products?: boolean;
  alerts?: boolean;
  updateInterval?: number; // milliseconds
}

// WebSocket client interface
export interface WebSocketClient {
  id: string;
  userId: string;
  subscriptions: SubscriptionOptions;
  connected: boolean;
  lastUpdate: Date;
}

// Real-time metrics cache
export interface MetricsCache {
  timestamp: Date;

  // Approval metrics
  approvalRate: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  avgTimeToApprove: number;

  // Revenue metrics
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;

  // Category revenue
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
    itemsSold: number;
  }>;

  // Trend data
  approvalTrend: Array<{
    date: string;
    approved: number;
    rejected: number;
    pending: number;
  }>;

  // Pricing metrics
  pricingMetrics: {
    averagePricingAccuracy: number;
    avgConfidenceScore: number;
  };
  avgPriceConfidence: number;
  autoApprovedCount: number;
  manualReviewCount: number;
  lowConfidenceCount: number;
  priceAccuracy: number;

  // Product metrics
  productMetrics: {
    totalProducts: number;
    categoriesCount: number;
  };
  totalProducts: number;
  activeProducts: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

