/* eslint-disable */
/** @type {import('next').NextConfig} */

// Only relax type/lint checks in local dev, enforce in CI
const isCI = process.env.CI === 'true';
const isProduction = process.env.NODE_ENV === 'production';

let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === 'true') {
  try {
    const analyzer = require('@next/bundle-analyzer');
    withBundleAnalyzer = analyzer({ enabled: true, openAnalyzer: true });
  } catch (_e) {
    // Analyzer not available; proceed without wrapping
    withBundleAnalyzer = (config) => config;
  }
}

const nextConfig = {
  // Build optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  // Type/lint enforcement
  eslint: {
    ignoreDuringBuilds: !isCI,
  },
  typescript: {
    ignoreBuildErrors: !isCI,
  },
  
  // Output optimization
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  
  // Remove console logs in production
  compiler: {
    removeConsole: isProduction ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'c8.alamy.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.squarespace-cdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    unoptimized: false,
  },
  
  // Caching headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);
