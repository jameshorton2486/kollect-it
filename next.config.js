/* eslint-disable */
/** @type {import('next').NextConfig} */

// Only relax type/lint checks in local dev, enforce in CI
const isCI = process.env.CI === "true";
const isProduction = process.env.NODE_ENV === "production";

let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === "true") {
  try {
    const analyzer = require("@next/bundle-analyzer");
    withBundleAnalyzer = analyzer({ enabled: true, openAnalyzer: true });
  } catch (_e) {
    // Analyzer not available; proceed without wrapping
    withBundleAnalyzer = (config) => config;
  }
}

const nextConfig = {
  // Build optimizations
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header

  // Type/lint enforcement
  eslint: {
    ignoreDuringBuilds: !isCI,
  },
  typescript: {
    ignoreBuildErrors: !isCI,
  },

  // Output optimization
  output: "standalone",

  // Remove console logs in production
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ["error", "warn"],
        }
      : false,
    // Remove unused React imports for faster builds
    reactRemoveProperties: isProduction,
  },

  // Image optimization - aggressive settings
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for static images
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "c8.alamy.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
        pathname: "/**",
      },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Caching headers with aggressive static caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Content-Type", value: "image/*" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Redirects for cache optimization
  async redirects() {
    return [];
  },

  // Rewrites for API optimization
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Note: removed staticGenerationRetryCount (not a supported option)
  },

  // Note: Webpack config removed for Next.js 15 + Turbopack compatibility
  // Tree-shaking and optimization handled automatically by Turbopack
};

module.exports = withBundleAnalyzer(nextConfig);
