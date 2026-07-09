/**
 * Normaliza la URL de Postgres para Railway (SSL / red privada).
 */
export function resolveDatabaseUrl(): string | undefined {
  const privateUrl = process.env.DATABASE_PRIVATE_URL?.trim();
  const publicUrl = process.env.DATABASE_URL?.trim();
  const url = privateUrl || publicUrl;
  if (!url) return undefined;

  if (url.includes('sslmode=')) return url;

  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
  const isLocal = /localhost|127\.0\.0\.1/i.test(url);
  const isPrivateHost = /\.railway\.internal\b/i.test(url);

  if (isLocal || isPrivateHost) return url;
  if (process.env.NODE_ENV === 'production' || onRailway) {
    return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
  }

  return url;
}

export function applyDatabaseUrl(): string | undefined {
  const resolved = resolveDatabaseUrl();
  if (resolved) process.env.DATABASE_URL = resolved;
  return resolved;
}
