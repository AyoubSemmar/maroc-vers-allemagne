import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Raise default 1MB limit so admin can upload larger images and long articles
      bodySizeLimit: '15mb',
    },
  },
};

export default withNextIntl(nextConfig);
