import type { NextConfig } from 'next';
import WithBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Enable standalone output for lean production Docker images
  output: 'standalone',
  typescript: {
    tsconfigPath: './tsconfig.prod.json',
  },
  eslint: {
    dirs: ['src/api', 'src/app', 'src/modules', 'src/shared'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Fallback rewrites for API requests
      // This will redirect API requests to the external service URL
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/:path*`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js dev
              "style-src 'self' 'unsafe-inline'", // Required for Tailwind CSS
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

/**
 * @see(https://nextjs.org/docs/app/guides/package-bundling)
 */
export default WithBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZE === 'true',
})(nextConfig);
