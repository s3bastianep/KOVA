const CACHE = new Map<string, { data: unknown; at: number }>();
const INFLIGHT = new Map<string, Promise<unknown>>();
const TTL_MS = 5 * 60 * 1000;

export function portalCacheGet<T>(key: string): T | undefined {
  if (typeof window === 'undefined') return undefined;
  const entry = CACHE.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > TTL_MS) {
    CACHE.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function portalCacheSet<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  CACHE.set(key, { data, at: Date.now() });
}

export function portalCacheHas(key: string) {
  return portalCacheGet(key) !== undefined;
}

export function portalCacheInvalidate(prefix?: string) {
  if (typeof window === 'undefined') return;
  if (!prefix) {
    CACHE.clear();
    return;
  }
  for (const key of [...CACHE.keys()]) {
    if (key.startsWith(prefix)) CACHE.delete(key);
  }
}

/** Devuelve caché al instante; deduplica peticiones en vuelo. */
export async function portalFetchCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = portalCacheGet<T>(key);
  const run = () => {
    const existing = INFLIGHT.get(key);
    if (existing) return existing as Promise<T>;

    const promise = fetcher()
      .then((data) => {
        portalCacheSet(key, data);
        return data;
      })
      .finally(() => {
        INFLIGHT.delete(key);
      });

    INFLIGHT.set(key, promise);
    return promise;
  };

  if (cached !== undefined) {
    void run().catch(() => {});
    return cached;
  }

  return run();
}

export const PORTAL_CACHE_KEYS = {
  perfil: 'portal:perfil',
  dashboard: 'portal:dashboard',
  aplicaciones: 'portal:aplicaciones',
  vacantes: (minMatch = 0) => `portal:vacantes:${minMatch}`,
  vacante: (id: string) => `portal:vacante:${id}`,
  prueba: 'portal:prueba',
} as const;
