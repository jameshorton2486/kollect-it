"use client";

/**
 * WebSocket Client Hook
 * Phase 5 - Real-time metrics subscription
 */

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { SubscriptionOptions, MetricsCache } from "@/lib/websocket/types";

interface UseWebSocketOptions extends SubscriptionOptions {
  enabled?: boolean;
  subscribeToMetrics?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [metricsCache, setMetricsCache] = useState<MetricsCache | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options.enabled && options.enabled !== undefined) {
      return undefined;
    }

    try {
      // Connect to WebSocket server
      const newSocket = io(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 10,
        },
      );

      newSocket.on("connect", () => {
        if (process.env.NODE_ENV === "development") {
          console.log("WebSocket connected");
        }
        setConnected(true);
        setError(null);

        // Subscribe to metrics
        newSocket.emit("subscribe", {
          metrics: options.metrics !== false,
          approvalTrends: options.approvalTrends !== false,
          revenue: options.revenue !== false,
          pricing: options.pricing !== false,
          products: options.products !== false,
          alerts: options.alerts !== false,
          updateInterval: options.updateInterval || 5000,
        });
      });

      newSocket.on("disconnect", () => {
        if (process.env.NODE_ENV === "development") {
          console.log("WebSocket disconnected");
        }
        setConnected(false);
      });

      newSocket.on("metrics-cache-update", (data: MetricsCache) => {
        setMetricsCache(data);
      });

      newSocket.on("metrics-update", (data: MetricsCache) => {
        setMetricsCache(data);
      });

      newSocket.on("error", (errorData: any) => {
        console.error("WebSocket error:", errorData);
        setError(errorData.message || "WebSocket error occurred");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (err) {
      console.error("Error initializing WebSocket:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initialize WebSocket",
      );
      return undefined;
    }
  }, [
    options.enabled,
    options.metrics,
    options.approvalTrends,
    options.revenue,
    options.pricing,
    options.products,
    options.alerts,
    options.updateInterval,
  ]);

  const requestMetrics = useCallback(() => {
    if (socket?.connected) {
      socket.emit("request-metrics");
    }
  }, [socket]);

  return {
    socket,
    connected,
    metricsCache,
    error,
    requestMetrics,
  };
}

