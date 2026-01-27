/**
 * Database Query Optimization
 * Phase 5 - Indexes, caching, and query optimization
 */

import { prisma } from "@/lib/prisma";

interface QueryCache<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in ms
}

// In-memory cache store
const cacheStore = new Map<string, QueryCache<any>>();

/**
 * Cache key generator (used by getFromCache/setInCache indirectly)
 */
function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join("&");

  return `${prefix}:${sorted}`;
}

// Export for external use if needed
export { generateCacheKey };

/**
 * Get value from cache
 */
export function getFromCache<T>(key: string): T | null {
  const cached = cacheStore.get(key);

  if (!cached) return null;

  // Check if expired
  if (Date.now() - cached.timestamp > cached.ttl) {
    cacheStore.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * Set value in cache
 */
export function setInCache<T>(
  key: string,
  data: T,
  ttlMs: number = 300000,
): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

/**
 * Clear cache by prefix
 */
export function clearCacheByPrefix(prefix: string): void {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cacheStore.clear();
}

/**
 * Get cached or fresh approval metrics
 */
export async function getCachedApprovalMetrics(ttlMs: number = 300000) {
  const cacheKey = "approval-metrics:default";
  const cached = getFromCache(cacheKey);

  if (cached) return cached;

  const metrics = {
    approved: await (prisma as any).aIGeneratedProduct.count({
      where: { status: "APPROVED" },
    }),
    rejected: await (prisma as any).aIGeneratedProduct.count({
      where: { status: "REJECTED" },
    }),
    pending: await (prisma as any).aIGeneratedProduct.count({
      where: { status: "PENDING" },
    }),
  };

  setInCache(cacheKey, metrics, ttlMs);
  return metrics;
}

/**
 * Get cached or fresh revenue metrics
 */
export async function getCachedRevenueMetrics(ttlMs: number = 300000) {
  const cacheKey = "revenue-metrics:default";
  const cached = getFromCache(cacheKey);

  if (cached) return cached;

  const totalOrders = await (prisma as any).order.count({
    where: { paymentStatus: "paid" },
  });
  const revenue = await (prisma as any).order.aggregate({
    where: { paymentStatus: "paid" },
    _sum: {
      total: true,
    },
  });

  const metrics = {
    totalOrders,
    totalRevenue: revenue._sum.total || 0,
    averageOrderValue:
      totalOrders > 0 ? (revenue._sum.total || 0) / totalOrders : 0,
  };

  setInCache(cacheKey, metrics, ttlMs);
  return metrics;
}

/**
 * Get cached or fresh product metrics
 */
export async function getCachedProductMetrics(ttlMs: number = 300000) {
  const cacheKey = "product-metrics:default";
  const cached = getFromCache(cacheKey);

  if (cached) return cached;

  const metrics = {
    totalProducts: await (prisma as any).product.count(),
    totalCategories: await (prisma as any).category.count(),
    avgProductsPerCategory: 0,
  };

  if (metrics.totalCategories > 0) {
    metrics.avgProductsPerCategory = Math.round(
      metrics.totalProducts / metrics.totalCategories,
    );
  }

  setInCache(cacheKey, metrics, ttlMs);
  return metrics;
}

/**
 * Invalidate all metrics cache
 */
export function invalidateMetricsCache(): void {
  clearCacheByPrefix("approval-metrics");
  clearCacheByPrefix("revenue-metrics");
  clearCacheByPrefix("product-metrics");
}

/**
 * Create database indexes (run once during migration)
 */
export async function createOptimizationIndexes(): Promise<void> {
  const indexQueries = [
    // Approval metrics indexes
    'CREATE INDEX IF NOT EXISTS idx_ai_product_status ON "AIGeneratedProduct"(status);',
    'CREATE INDEX IF NOT EXISTS idx_ai_product_reviewed_at ON "AIGeneratedProduct"("reviewedAt");',
    'CREATE INDEX IF NOT EXISTS idx_ai_product_category ON "AIGeneratedProduct"("aiCategory");',

    // Revenue indexes
    'CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);',
    'CREATE INDEX IF NOT EXISTS idx_order_created_at ON "Order"("createdAt");',

    // Product indexes
    'CREATE INDEX IF NOT EXISTS idx_product_category_id ON "Product"("categoryId");',
    'CREATE INDEX IF NOT EXISTS idx_product_created_at ON "Product"("createdAt");',

    // Composite indexes for common queries
    'CREATE INDEX IF NOT EXISTS idx_order_status_created ON "Order"(status, "createdAt");',
    'CREATE INDEX IF NOT EXISTS idx_ai_product_status_reviewed ON "AIGeneratedProduct"(status, "reviewedAt");',
  ];

  for (const query of indexQueries) {
    try {
      await (prisma as any).$executeRawUnsafe(query);
    } catch (error) {
      console.warn(`Index creation skipped (may already exist):`, query);
    }
  }
}

/**
 * Analyze query performance
 */
export async function explainQuery(query: string): Promise<any> {
  try {
    const result = await (prisma as any).$executeRawUnsafe(
      `EXPLAIN (FORMAT JSON) ${query}`,
    );
    return result;
  } catch (error) {
    console.error("Error analyzing query:", error);
    return null;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  let totalSize = 0;
  let expiredCount = 0;
  const now = Date.now();

  for (const [, cached] of cacheStore) {
    if (now - cached.timestamp > cached.ttl) {
      expiredCount += 1;
    }
    totalSize += JSON.stringify(cached.data).length;
  }

  return {
    cacheSize: cacheStore.size,
    expiredCount,
    totalBytes: totalSize,
    averageBytesPerEntry:
      cacheStore.size > 0 ? Math.round(totalSize / cacheStore.size) : 0,
  };
}

/**
 * Clean expired cache entries
 */
export function cleanExpiredCache(): number {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, cached] of cacheStore) {
    if (now - cached.timestamp > cached.ttl) {
      cacheStore.delete(key);
      cleanedCount += 1;
    }
  }

  return cleanedCount;
}

/**
 * Optimize database (maintenance function)
 */
export async function optimizeDatabase(): Promise<void> {
  try {
    // Vacuum analyze for PostgreSQL
    await (prisma as any).$executeRawUnsafe("VACUUM ANALYZE;");
    console.log("Database optimization completed");
  } catch (error) {
    console.error("Error optimizing database:", error);
  }
}

