import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable development features
  devIndicators: {
    buildActivity: false,
  },
  
  // Handle build-time errors
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Don't run ESLint during production builds
    ignoreDuringBuilds: true,
  },

  // Strict mode helps identify potential problems
  reactStrictMode: true,

  // Improve production performance
  swcMinify: true,

  // Enable image optimization
  images: {
    domains: [], // Add any external image domains you need
    // Set reasonable image device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Set reasonable image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Redirects if needed
  async redirects() {
    return [];
  },

  // Enable gzip compression
  compress: true,
};

export default nextConfig;