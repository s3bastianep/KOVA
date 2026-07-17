import type { NextRequest } from 'next/server';

/**
 * Minimal in-memory sliding-window rate limiter for unauthenticated endpoints (e.g. CV parsing
 * during signup, before any account/session exists to key off of). Single-instance only — on a
 * multi-instance deploy each instance tracks its own counters, so the effective limit is
 * `limit * instanceCount`. That's an acceptable tradeoff for a defensive cap against casual abuse;
 * it is not a substitute for a shared store (Redis) if this ever needs to be airtight.
 *
 * Capacidad: si los rechazos se acumulan de forma sostenida, se emite un aviso `[CAPACITY]`
 * en los logs de Railway. Eso no significa "contrata Redis ya"; significa "revisa el panel
 * de CPU/memoria y el tráfico — puede ser un ataque o el primer síntoma de que una sola
 * instancia se está quedando corta".
 */
const buckets = new Map<string, number[]>();

/** Timestamps de rechazos recientes (todas las claves) para detectar saturación. */
const recentRejections: number[] = [];
const REJECTION_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const CAPACITY_THRESHOLD = 40; // 40 rechazos en 5 min → aviso
let lastCapacityWarnAt = 0;
const CAPACITY_WARN_COOLDOWN_MS = 5 * 60 * 1000; // no spamear: máximo 1 aviso cada 5 min

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function noteRejection(bucketKey: string): void {
  const now = Date.now();
  recentRejections.push(now);
  // Mantener solo la ventana reciente.
  while (recentRejections.length > 0 && now - recentRejections[0] >= REJECTION_WINDOW_MS) {
    recentRejections.shift();
  }

  if (recentRejections.length < CAPACITY_THRESHOLD) return;
  if (now - lastCapacityWarnAt < CAPACITY_WARN_COOLDOWN_MS) return;

  lastCapacityWarnAt = now;
  const prefix = bucketKey.split(':')[0] ?? bucketKey;
  console.warn(
    `[CAPACITY] ${JSON.stringify({
      ts: new Date().toISOString(),
      event: 'rate_limiter_saturated',
      rejectionsLast5Min: recentRejections.length,
      sampleKey: prefix,
      hint:
        'Muchos rechazos del rate limiter. Revisa CPU/memoria en Railway. ' +
        'Si es tráfico legítimo y la instancia está al límite, considera escalar. ' +
        'Redis solo hace falta cuando haya 2+ instancias.',
    })}`,
  );
}

export function isRateLimited(req: NextRequest, key: string, limit: number, windowMs: number): boolean {
  return isKeyRateLimited(`${key}:${clientIp(req)}`, limit, windowMs);
}

/**
 * Variante sin IP: limita por una clave arbitraria (p. ej. el correo en login),
 * de modo que un ataque distribuido desde muchas IPs contra la misma cuenta
 * también quede frenado. Mismo trade-off in-memory que isRateLimited.
 */
export function isKeyRateLimited(bucketKey: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(bucketKey) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(bucketKey, hits);
    noteRejection(bucketKey);
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

/** Solo para tests: lee cuántos rechazos hay en la ventana actual. */
export function getRecentRejectionCount(): number {
  const now = Date.now();
  return recentRejections.filter((t) => now - t < REJECTION_WINDOW_MS).length;
}
