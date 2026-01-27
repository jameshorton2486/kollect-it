/**
 * Caching Layer
 * In-memory cache with TTL support
 */

import { redisEnabled, redisGet, redisSet } from "./redis-rest";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  hits: number;
  createdAt: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRate: string;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private hits: number;
  private misses: number;
  private evictions: number;
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 1000, defaultTTL: number = 300000) {
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL; // 5 minutes default

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (redisEnabled) {
      const value = await redisGet(key);
      if (!value) {
        this.misses++;
        return null;
      }
      this.hits++;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    }

    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.hits++;

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (redisEnabled) {
      const ttlSeconds = ttl ? Math.ceil(ttl / 1000) : undefined;
      await redisSet(key, JSON.stringify(value), ttlSeconds);
      return;
    }

    // Enforce max size (LRU eviction)
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      this.evictLRU();
    }

    const expiresAt = Date.now() + (ttl || this.defaultTTL);

    this.store.set(key, {
      value,
      expiresAt,
      hits: 0,
      createdAt: Date.now(),
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  /**
   * Get or set with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruHits = Infinity;

    for (const [key, entry] of this.store.entries()) {
      if (entry.hits < lruHits) {
        lruHits = entry.hits;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.store.delete(lruKey);
      this.evictions++;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate =
      totalRequests > 0
        ? ((this.hits / totalRequests) * 100).toFixed(2) + "%"
        : "0%";

    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate,
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get entries with metadata
   */
  entries() {
    return Array.from(this.store.entries()).map(([key, entry]) => ({
      key,
      hits: entry.hits,
      expiresIn: Math.max(0, entry.expiresAt - Date.now()),
      age: Date.now() - entry.createdAt,
    }));
  }
}

/**
 * Global cache instance
 */
export const cache = new Cache(1000, 300000); // 1000 entries, 5 min TTL

/**
 * Cache key generators for different data types
 */
export const cacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (params: Record<string, any>) =>
    `products:${JSON.stringify(params)}`,
  category: (slug: string) => `category:${slug}`,
  categories: () => "categories:all",
  user: (id: string) => `user:${id}`,
  analytics: (startDate: string, endDate: string) =>
    `analytics:${startDate}:${endDate}`,
  aiAnalysis: (imageUrl: string) => `ai:${imageUrl}`,
  pricing: (productId: string) => `pricing:${productId}`,
};

/**
 * Cache TTL presets (in milliseconds)
 */
export const cacheTTL = {
  short: 60 * 1000, // 1 minute
  medium: 5 * 60 * 1000, // 5 minutes
  long: 30 * 60 * 1000, // 30 minutes
  hour: 60 * 60 * 1000, // 1 hour
  day: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Invalidate cache by pattern
 */
export function invalidateCachePattern(pattern: string): number {
  const keys = cache.keys();
  let deleted = 0;

  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
      deleted++;
    }
  }

  return deleted;
}

/**
 * Cache decorator for async functions
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  keyFn: (...args: Parameters<T>) => string,
  ttl: number = cacheTTL.medium,
) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>) {
      const key = keyFn(...args);
      return cache.getOrSet(key, () => originalMethod.apply(this, args), ttl);
    };

    return descriptor;
  };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
  ttl?: number,
): T {
  const localCache = new Map<string, any>();

  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (localCache.has(key)) {
      return localCache.get(key);
    }

    const result = fn(...args);
    localCache.set(key, result);

    if (ttl) {
      setTimeout(() => localCache.delete(key), ttl);
    }

    return result;
  }) as T;
}

/**
 * Cache monitoring endpoint data
 */
export function getCacheMonitoring() {
  return {
    stats: cache.getStats(),
    entries: cache.entries().slice(0, 50), // Top 50 entries
    timestamp: new Date().toISOString(),
  };
}

