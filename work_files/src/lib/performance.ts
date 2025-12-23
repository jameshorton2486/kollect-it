/**
 * Performance Monitoring Utilities
 * Phase 6 Step 10 - Track and log performance metrics
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();
  private readonly maxMetrics = 1000; // Keep last 1000 metrics

  /**
   * Start timing an operation
   */
  start(name: string): void {
    this.timers.set(name, Date.now());
  }

  /**
   * End timing and record metric
   */
  end(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Performance timer "${name}" was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(name);

    this.recordMetric({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    return duration;
  }

  /**
   * Measure an async function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: true },
      });

      // Log slow operations (>1s)
      if (duration > 1000) {
        console.warn(
          `Slow operation detected: ${name} took ${duration}ms`,
          metadata,
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: false, error: String(error) },
      });

      throw error;
    }
  }

  /**
   * Record a metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Performance] ${metric.name}: ${metric.duration}ms`,
        metric.metadata,
      );
    }
  }

  /**
   * Get statistics for a specific operation
   */
  getStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const operationMetrics = this.metrics.filter((m) => m.name === name);

    if (operationMetrics.length === 0) {
      return null;
    }

    const durations = operationMetrics
      .map((m) => m.duration)
      .sort((a, b) => a - b);
    const sum = durations.reduce((acc, d) => acc + d, 0);

    return {
      count: durations.length,
      avg: sum / durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      p50: durations[Math.floor(durations.length * 0.5)],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
    };
  }

  /**
   * Get all metrics summary
   */
  getAllStats(): Record<string, ReturnType<typeof this.getStats>> {
    const names = [...new Set(this.metrics.map((m) => m.name))];
    const stats: Record<string, any> = {};

    names.forEach((name) => {
      stats[name] = this.getStats(name);
    });

    return stats;
  }

  /**
   * Get recent slow operations
   */
  getSlowOperations(
    thresholdMs: number = 1000,
    limit: number = 10,
  ): PerformanceMetric[] {
    return this.metrics
      .filter((m) => m.duration > thresholdMs)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Export metrics for analysis
   */
  export(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for monitoring async methods
 */
export function monitored(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const operationName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return performanceMonitor.measure(
        operationName,
        () => originalMethod.apply(this, args),
        { args: args.length },
      );
    };

    return descriptor;
  };
}

/**
 * Simple wrapper for measuring function performance
 */
export async function withMonitoring<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  return performanceMonitor.measure(name, fn);
}

/**
 * API route performance wrapper
 */
export async function withApiMonitoring<T>(
  route: string,
  method: string,
  fn: () => Promise<T>,
): Promise<T> {
  return performanceMonitor.measure(`API:${method}:${route}`, fn, {
    route,
    method,
  });
}

/**
 * Database query performance wrapper
 */
export async function withDbMonitoring<T>(
  operation: string,
  fn: () => Promise<T>,
): Promise<T> {
  return performanceMonitor.measure(`DB:${operation}`, fn, { operation });
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  stats: Record<string, any>;
  slowOperations: PerformanceMetric[];
  timestamp: string;
} {
  return {
    stats: performanceMonitor.getAllStats(),
    slowOperations: performanceMonitor.getSlowOperations(),
    timestamp: new Date().toISOString(),
  };
}

