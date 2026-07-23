import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // optimise CSS loading
    optimizeCss: false,
  },
};

export default nextConfig;
