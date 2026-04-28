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
  // Security headers applied to every response.
  // CSP is intentionally NOT set here yet — the site uses inline <script>
  // tags for next-intl + JSON-LD and inline <style> from Tailwind v4, so
  // a strict CSP would need a careful nonce rollout. Adding the headers
  // below first is a free, low-risk win.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Stops the site being framed by phishing pages on other origins.
          { key: 'X-Frame-Options', value: 'DENY' },
          // Disables MIME sniffing — uploaded files served as image/png
          // can't be reinterpreted as HTML/JS by the browser.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Cross-origin links don't leak full referrer URLs.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Force HTTPS for the next 2 years on this host + subdomains.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Drop access to powerful APIs we never use. Photo enhancer
          // is server-side (Replicate), not browser camera.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ]
  },
};

export default withNextIntl(nextConfig);
