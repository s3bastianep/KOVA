import { NextRequest } from 'next/server';
import { signToken } from '../../../../lib/auth';
import {
  clearSessionCookieHeaders,
  readRefreshCookie,
  rotateRefreshToken,
  sessionCookieHeaders,
} from '../../../../lib/session';
import { clientIp } from '../../../../lib/rate-limit';
import { logSecurityEvent } from '../../../../lib/security-log';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = readRefreshCookie(req);
  if (!raw) {
    return Response.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const rotated = await rotateRefreshToken(raw);
    if (!rotated) {
      // Un refresh token revocado/expirado que sigue llegando puede indicar robo
      // de cookie o replay; queda trazado para poder investigar patrones.
      logSecurityEvent('refresh_token_invalid', { ip: clientIp(req) });
      return Response.json(
        { message: 'Sesión expirada' },
        { status: 401, headers: clearSessionCookieHeaders() },
      );
    }

    const accessToken = signToken(rotated.user);
    return Response.json(
      { user: rotated.user, accessToken },
      { headers: sessionCookieHeaders(accessToken, rotated.refreshToken) },
    );
  } catch (err) {
    console.error('[auth/refresh]', err);
    return Response.json({ message: 'No se pudo renovar la sesión' }, { status: 503 });
  }
}
