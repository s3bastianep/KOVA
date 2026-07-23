import type { NextRequest } from 'next/server';

/**
 * CORS allowlist for public marketing endpoints (bookings / availability / solicitudes POST).
 * Same-origin requests (no Origin) do not need ACAO.
 */
function allowedOrigins(): string[] {
  const fromEnv = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const defaults = [
    'https://litthunter.com',
    'https://www.litthunter.com',
    process.env.PUBLIC_SITE_URL,
    process.env.VITE_SITE_URL,
  ]
    .filter(Boolean)
    .map((s) => String(s).replace(/\/$/, ''));

  if (process.env.NODE_ENV !== 'production') {
    defaults.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    );
  }

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.replace(/^https?:\/\//, '');
  if (railway) defaults.push(`https://${railway}`);

  return [...new Set([...defaults, ...fromEnv])];
}

export function publicCorsHeaders(
  req: NextRequest,
  methods = 'GET, POST, OPTIONS',
): Record<string, string> {
  const origin = req.headers.get('origin');
  const base: Record<string, string> = {
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };

  if (!origin) return base;

  const allowed = allowedOrigins();
  if (!allowed.includes(origin.replace(/\/$/, ''))) return base;

  return {
    ...base,
    'Access-Control-Allow-Origin': origin,
  };
}
