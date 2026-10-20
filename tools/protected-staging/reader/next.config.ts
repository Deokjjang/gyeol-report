import path from 'node:path';
import type { NextConfig } from 'next';
const config: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, '../../..'),
  poweredByHeader: false,
  // Dedicated app: never initialize customer services or include generated Books.
  devIndicators: false,
  async headers() { return [{ source: '/:path*', headers: [
    { key: 'Cache-Control', value: 'private, no-store, max-age=0' }, { key: 'Referrer-Policy', value: 'no-referrer' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Content-Security-Policy', value: `default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" && !process.env.VERCEL ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'` },
  ] }]; },
};
export default config;
