import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Increase timeout for server actions if needed
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  output: "standalone",
};

export default nextConfig;
