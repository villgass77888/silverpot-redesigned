import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content-Security-Policy (§5.8).
 * Pages are statically generated, so per-request nonces are not available;
 * inline scripts (Next hydration data, JSON-LD, the hero-replay flag) need
 * 'unsafe-inline'. See docs/DECISIONS.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-insights.com${isDev ? ' ws: wss:' : ''}`,
  'frame-src https://challenges.cloudflare.com https://www.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Let phones on the local network load the dev server (`pnpm dev:wifi`, e.g. http://192.168.1.59:3000).
  // Without this, Next 16 blocks dev assets for non-localhost origins: no hydration, so no animations.
  allowedDevOrigins: ['192.168.1.59', '192.168.*.*', '10.*.*.*', '172.*.*.*', '*.local'],
  // The proxy normalises trailing slashes itself, so legacy spam paths 410 in one hop (§11.5).
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [78],
    // Never hotlink the old WordPress uploads in production (§10.3).
    remotePatterns: isDev
      ? [{ protocol: 'https', hostname: 'silverpot.org', pathname: '/wp-content/uploads/**' }]
      : [],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

// Messages are precompiled at build time, so the ICU parser never ships to the browser (§12.1).
const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/i18n/request.ts',
  experimental: { messages: { path: './messages', format: 'json', locales: 'infer', precompile: true } },
});
export default withNextIntl(nextConfig);
