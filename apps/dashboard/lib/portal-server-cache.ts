const store = new Map<string, { data: unknown; at: number }>();
const TTL_MS = 90_000;

export function portalServerCacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > TTL_MS) {
    store.delete(key);
    return undefined;
  }
  return hit.data as T;
}

export function portalServerCacheSet<T>(key: string, data: T) {
  store.set(key, { data, at: Date.now() });
}

export function portalServerCacheInvalidate(prefix?: string) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of [...store.keys()]) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

export function portalVacantesCacheKey(candidateId: string, minMatch: number) {
  return `vacantes:${candidateId}:${minMatch}`;
}

export function portalDashboardCacheKey(candidateId: string) {
  return `dashboard:${candidateId}`;
}

export function portalAplicacionesCacheKey(candidateId: string) {
  return `aplicaciones:${candidateId}`;
}

export function invalidatePortalCandidateCaches(candidateId: string) {
  portalServerCacheInvalidate('vacantes:');
  portalServerCacheInvalidate(portalAplicacionesCacheKey(candidateId));
  portalServerCacheInvalidate(portalDashboardCacheKey(candidateId));
}
