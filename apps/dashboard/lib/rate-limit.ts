import type { NextRequest } from 'next/server';

/**
 * Minimal in-memory sliding-window rate limiter for unauthenticated endpoints (e.g. CV parsing
 * during signup, before any account/session exists to key off of). Single-instance only — on a
 * multi-instance deploy each instance tracks its own counters, so the effective limit is
 * `limit * instanceCount`. That's an acceptable tradeoff for a defensive cap against casual abuse;
 * it is not a substitute for a shared store (Redis) if this ever needs to be airtight.
 */
const buckets = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export function isRateLimited(req: NextRequest, key: string, limit: number, windowMs: number): boolean {
  const bucketKey = `${key}:${clientIp(req)}`;
  const now = Date.now();
  const hits = (buckets.get(bucketKey) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(bucketKey, hits);
    return true;
  }
  hits.push(now);
  buckets.set(bucketKey, hits);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (!times.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return false;
}
