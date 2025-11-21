/**
 * WebSocket Server Implementation
 * Phase 5 - Real-time analytics streaming
 */

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "@/lib/prisma";
import type {
  WebSocketEvent,
  SubscriptionOptions,
  MetricsCache,
} from "./types";

let io: SocketIOServer | null = null;
let metricsCache: MetricsCache | null = null;
let cacheUpdateInterval: NodeJS.Timeout | null = null;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocketServer(
  httpServer: HTTPServer,
): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Connection handler
  io.on("connection", (socket: Socket) => {
    console.log(`WebSocket client connected: ${socket.id}`);

    // Subscribe to real-time updates
    socket.on("subscribe", (options: SubscriptionOptions) => {
      socket.data.subscriptions = options;
      socket.data.userId = socket.handshake.auth.userId || "anonymous";
      socket.emit("subscribed", {
        success: true,
        subscriptions: options,
      });
    });

    // Request metrics update
    socket.on("request-metrics", async () => {
      if (metricsCache) {
        socket.emit("metrics-update", metricsCache);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`WebSocket client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`WebSocket error for ${socket.id}:`, error);
    });
  });

  // Start cache update interval (every 5 seconds)
  startMetricsCacheUpdate();

  return io;
}

/**
 * Get or create WebSocket server instance
 */
export function getWebSocketServer(): SocketIOServer {
  if (!io) {
    throw new Error("WebSocket server not initialized");
  }
  return io;
}

/**
 * Broadcast metrics update to all connected clients
 */
export async function broadcastMetricsUpdate() {
  if (!io) return;

  try {
    const cache = await updateMetricsCache();
    io.emit("metrics-update", cache);
  } catch (error) {
    console.error("Error broadcasting metrics update:", error);
  }
}

/**
 * Broadcast approval trend update
 */
export function broadcastApprovalTrend(event: WebSocketEvent) {
  if (!io) return;
  io.emit("approval-trend", event);
}

/**
 * Broadcast revenue update
 */
export function broadcastRevenueUpdate(event: WebSocketEvent) {
  if (!io) return;
  io.emit("revenue-update", event);
}

/**
 * Broadcast alert to specific user or all users
 */
export function broadcastAlert(event: WebSocketEvent, userId?: string) {
  if (!io) return;

  if (userId) {
    // Send to specific user
    io.to(`user-${userId}`).emit("alert", event);
  } else {
    // Broadcast to all
    io.emit("alert", event);
  }
}

/**
 * Update metrics cache from database
 */
async function updateMetricsCache(): Promise<MetricsCache> {
  try {
    // Get approval metrics
    const approvals = await (prisma as any).aIGeneratedProduct.count({
      where: { status: "APPROVED" },
    });
    const rejections = await (prisma as any).aIGeneratedProduct.count({
      where: { status: "REJECTED" },
    });
    const pending = await (prisma as any).aIGeneratedProduct.count({
      where: { status: "PENDING" },
    });

    const total = approvals + rejections + pending;
    const approvalRate = total > 0 ? (approvals / total) * 100 : 0;

    // Get revenue metrics
    const orders = await (prisma as any).order.groupBy({
      by: ["categoryId"],
      _sum: {
        total: true,
      },
      where: {
        status: "COMPLETED",
      },
    });

    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + (order._sum.total || 0),
      0,
    );
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get revenue by category
    const revenueByCategory = orders.map((order: any) => ({
      category: order.categoryId || "Unknown",
      revenue: order._sum.total || 0,
      percentage:
        totalRevenue > 0 ? ((order._sum.total || 0) / totalRevenue) * 100 : 0,
    }));

    // Get product metrics
    const totalProducts = await (prisma as any).product.count();
    const categories = await (prisma as any).category.count();

    // Build cache
    const cache: MetricsCache = {
      timestamp: new Date(),
      approvalRate: Math.round(approvalRate * 100) / 100,
      approvedCount: approvals,
      rejectedCount: rejections,
      pendingCount: pending,
      avgTimeToApprove: 0, // TODO: Calculate from order data
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      revenueByCategory,
      approvalTrend: [], // Updated separately by polling service
      avgPriceConfidence: 0, // TODO: Calculate from pricing data
      autoApprovedCount: 0, // TODO: Track auto-approvals
      manualReviewCount: 0, // TODO: Track manual reviews
      lowConfidenceCount: 0, // TODO: Track low confidence items
      priceAccuracy: 0, // TODO: Calculate accuracy
      totalProducts,
      activeProducts: totalProducts, // TODO: Filter active only
      averagePrice: 0, // TODO: Calculate from products
      minPrice: 0, // TODO: Get min price
      maxPrice: 0, // TODO: Get max price
      pricingMetrics: {
        averagePricingAccuracy: 0, // Updated separately
        avgConfidenceScore: 0,
      },
      productMetrics: {
        totalProducts,
        categoriesCount: categories,
      },
    };

    metricsCache = cache;
    return cache;
  } catch (error) {
    console.error("Error updating metrics cache:", error);
    // Return cached value or minimal valid MetricsCache
    return (
      metricsCache || {
        timestamp: new Date(),
        approvalRate: 0,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 0,
        avgTimeToApprove: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        revenueByCategory: [],
        approvalTrend: [],
        avgPriceConfidence: 0,
        autoApprovedCount: 0,
        manualReviewCount: 0,
        lowConfidenceCount: 0,
        priceAccuracy: 0,
        totalProducts: 0,
        activeProducts: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        pricingMetrics: {
          averagePricingAccuracy: 0,
          avgConfidenceScore: 0,
        },
        productMetrics: {
          totalProducts: 0,
          categoriesCount: 0,
        },
      }
    );
  }
}

/**
 * Start automatic metrics cache update
 */
function startMetricsCacheUpdate() {
  // Initial update
  updateMetricsCache().catch(console.error);

  // Update every 5 seconds
  cacheUpdateInterval = setInterval(async () => {
    if (!io) return;

    try {
      const cache = await updateMetricsCache();
      io.emit("metrics-cache-update", cache);
    } catch (error) {
      console.error("Error in metrics cache update interval:", error);
    }
  }, 5000);
}

/**
 * Stop metrics cache update
 */
export function stopMetricsCacheUpdate() {
  if (cacheUpdateInterval) {
    clearInterval(cacheUpdateInterval);
    cacheUpdateInterval = null;
  }
}

/**
 * Get current metrics cache
 */
export function getMetricsCache(): MetricsCache | null {
  return metricsCache;
}

/**
 * Get connected clients count
 */
export function getConnectedClientsCount(): number {
  if (!io) return 0;
  return io.engine.clientsCount;
}

/**
 * Get rooms information
 */
export function getRoomsInfo() {
  if (!io) return {};
  return io.sockets.adapter.rooms;
}

