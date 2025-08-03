import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize development experience
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  images: {
    remotePatterns: [new URL('http://127.0.0.1:54321/**'), new URL('https://dpskkabtuhmbpblntsyj.storage.supabase.co/storage/v1/s3/**')]
  },

  // Development-specific optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // TypeScript configuration for development
    typescript: {
      // Type checking is handled by your IDE, but don't ignore build errors
      ignoreBuildErrors: false,
    },
  }),
};

export default nextConfig;
