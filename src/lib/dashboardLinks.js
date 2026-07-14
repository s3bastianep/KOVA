/** Rutas servidas por Next.js (dashboard), no por el router de la landing. */
const DASHBOARD_PREFIXES = [
  '/postular',
  '/dashboard',
  '/portal',
  '/empresas',
  '/clientes',
  '/vacantes',
  '/procesos',
  '/pipeline-comercial',
  '/crm',
  '/calendario',
  '/agenda',
  '/tareas',
  '/reportes',
  '/configuracion',
  '/candidatos',
  '/discovery',
  '/ats',
  '/entrevistas',
  '/evaluaciones',
  '/finalistas',
  '/onboarding',
  '/academia',
  '/documentos',
  '/perfil-cargo',
  '/privacidad',
];

export function isDashboardPath(path) {
  return DASHBOARD_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** URL absoluta o relativa según entorno (mismo dominio en Railway). */
export function dashboardHref(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = (import.meta.env.VITE_DASHBOARD_URL || import.meta.env.VITE_APP_ORIGIN || '')
    .replace(/\/login\/?$/, '')
    .replace(/\/$/, '');
  // En dev el servidor de :3000 proxea el dashboard Next hacia :3001, así que
  // usamos rutas relativas para nunca sacar al usuario de :3000.
  return base ? `${base}${normalized}` : normalized;
}
