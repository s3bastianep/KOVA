/** Rutas servidas por Next.js (dashboard), no por el router de la landing. */
const DASHBOARD_PREFIXES = ['/registro', '/login', '/postular', '/dashboard'];

export function isDashboardPath(path) {
  return DASHBOARD_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** URL absoluta o relativa según entorno (mismo dominio en Railway). */
export function dashboardHref(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = (import.meta.env.VITE_DASHBOARD_URL || import.meta.env.VITE_APP_ORIGIN || '')
    .replace(/\/login\/?$/, '')
    .replace(/\/$/, '');
  return base ? `${base}${normalized}` : normalized;
}
