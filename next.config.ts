import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Raise default 1MB limit so admin can upload larger images and long articles
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;
