import type { NextConfig } from 'next';
import WithBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  // Add base path only in production for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '',
  // Asset prefix must match basePath for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '',
  typescript: {
    tsconfigPath: './tsconfig.prod.json',
  },
  eslint: {
    dirs: ['src/api', 'src/app', 'src/modules', 'src/shared'],
    // Allow warnings during build for GitHub Pages deployment
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
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
  // Note: rewrites() and headers() are not supported with output: 'export'
};

/**
 * @see(https://nextjs.org/docs/app/guides/package-bundling)
 */
export default WithBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZE === 'true',
})(nextConfig);
