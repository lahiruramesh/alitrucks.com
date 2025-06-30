import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize development experience
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
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
