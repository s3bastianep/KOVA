const path = require('node:path');

const isProd = process.env.NODE_ENV === 'production';

// CSP: se permite 'unsafe-inline' en scripts/estilos porque Next.js inyecta el
// bootstrap de hidratación inline y Tailwind/estilos usan atributos inline. En
// desarrollo se añade 'unsafe-eval' para el refresh de React.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  // Google Fonts: landing y dashboard cargan Manrope vía <link> / next/font / @import.
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "connect-src 'self' https:",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const immutableCache = {
  key: 'Cache-Control',
  value: 'public, max-age=31536000, immutable',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  reactStrictMode: true,
  // OWASP A05: no anunciar el framework en cada respuesta (X-Powered-By).
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas', 'mammoth', 'word-extractor', 'exceljs'],
  // HV uploads are up to 5 MB; keep headroom for multipart overhead.
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
    middlewareClientMaxBodySize: '6mb',
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [immutableCache],
      },
      {
        source: '/www/assets/:path*',
        headers: [immutableCache],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/www/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
