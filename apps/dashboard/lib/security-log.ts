/**
 * OWASP A09 (Security Logging & Monitoring): registro estructurado de eventos de
 * seguridad. Escribe JSON a stdout con prefijo fijo, así Railway (o cualquier
 * agregador de logs) puede filtrar `[SECURITY]` y alertar sobre patrones
 * (ráfagas de logins fallidos, cuentas bloqueadas, tokens inválidos).
 * No registra contraseñas ni tokens; el correo se trunca para no volcar PII completa.
 */

type SecurityEvent =
  | 'login_failed'
  | 'login_locked'
  | 'login_rate_limited'
  | 'refresh_token_invalid'
  | 'forbidden_access';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.slice(0, 2)}***@${domain}`;
}

export function logSecurityEvent(
  event: SecurityEvent,
  details: { email?: string; ip?: string | null; path?: string; userId?: string } = {},
): void {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...(details.email ? { email: maskEmail(details.email) } : {}),
    ...(details.ip ? { ip: details.ip } : {}),
    ...(details.path ? { path: details.path } : {}),
    ...(details.userId ? { userId: details.userId } : {}),
  };
  console.warn(`[SECURITY] ${JSON.stringify(entry)}`);
}
