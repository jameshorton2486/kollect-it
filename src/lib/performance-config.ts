/**
 * Performance Configuration
 *
 * Centralized performance settings for the entire application
 * These can be toggled based on environment or feature flags
 */

export const performanceConfig = {
  // Image optimization settings
  Image: {
    // Quality levels for different image types
    heroQuality: 75, // Hero section images (most critical, but quality reduced for speed)
    productQuality: 80, // Product images
    thumbnailQuality: 60, // Thumbnail images

    // Cache durations (in seconds)
    staticImageCacheTTL: 31536000, // 1 year for static assets
    dynamicImageCacheTTL: 3600, // 1 hour for dynamic content

    // Image sizes for responsive design
    sizes: {
      mobile: "(max-width: 640px) 100vw",
      tablet: "(max-width: 1024px) 90vw",
      desktop: "(max-width: 1536px) 80vw, 100vw",
    },
  },

  // Lazy loading configuration
  lazyLoading: {
    // Components below the fold are lazy loaded
    enableDynamicImports: true,
    showLoadingSkeletons: true, // Show placeholder during loading
    preloadOnHover: true, // Preload route on link hover
    preloadOnVisible: true, // Preload when element becomes visible
  },

  // Script optimization
  scripts: {
    // Third-party scripts configuration
    stripe: {
      strategy: "beforeInteractive" as const, // Load critical payment scripts early
    },
  },

  // Font optimization
  fonts: {
    // Use font-display: swap for better LCP
    display: "swap",
    // Preload critical fonts
    preload: {
      serif: true, // Main headings
      sans: true, // Body text
    },
  },

  // Bundle optimization
  bundling: {
    // Tree-shaking and unused export elimination
    usedExports: true,
    // Prevent side effects
    sideEffects: false,
    // Minification
    minimize: true,
  },

  // API optimization
  api: {
    // Cache strategies
    cache: {
      defaultTTL: 300, // 5 minutes
      imageTTL: 3600, // 1 hour
      staticTTL: 86400, // 24 hours
    },
    // Request deduplication
    deduplicateRequests: true,
    // Compression
    enableCompression: true,
  },

  // Caching strategies
  caching: {
    // Service worker caching
    enableServiceWorker: false, // Set to true if implemented
    // Browser cache control headers
    staticAssetCacheDuration: "31536000", // 1 year
    dynamicContentCacheDuration: "3600", // 1 hour
  },

  // Web Vitals targets (these inform optimization priorities)
  webVitals: {
    // Largest Contentful Paint - target 2.5s (Good)
    lcpTarget: 2500,
    // First Input Delay - target 100ms (Good)
    fidTarget: 100,
    // Cumulative Layout Shift - target 0.1 (Good)
    clsTarget: 0.1,
  },
};

/**
 * Utility function to get responsive image sizes string
 *
 * @example
 * sizes={getImageSizes('desktop')}
 */
export function getImageSizes(
  breakpoint: "mobile" | "tablet" | "desktop",
): string {
  return performanceConfig.images.sizes[breakpoint];
}

/**
 * Utility function to get quality setting based on image type
 *
 * @example
 * quality={getImageQuality('hero')}
 */
export function getImageQuality(
  type: "hero" | "product" | "thumbnail",
): number {
  const qualityMap = {
    hero: performanceConfig.images.heroQuality,
    product: performanceConfig.images.productQuality,
    thumbnail: performanceConfig.images.thumbnailQuality,
  };
  return qualityMap[type];
}

/**
 * Utility function to get cache TTL based on content type
 */
export function getCacheTTL(type: "static" | "dynamic" | "api"): number {
  const ttlMap = {
    static: performanceConfig.images.staticImageCacheTTL,
    dynamic: performanceConfig.images.dynamicImageCacheTTL,
    api: performanceConfig.api.cache.defaultTTL,
  };
  return ttlMap[type];
}

