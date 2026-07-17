import { NextRequest } from 'next/server';
import { signToken } from '../../../../lib/auth';
import {
  clearRefreshCookie,
  readRefreshCookie,
  refreshCookie,
  rotateRefreshToken,
} from '../../../../lib/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = readRefreshCookie(req);
  if (!raw) {
    return Response.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const rotated = await rotateRefreshToken(raw);
    if (!rotated) {
      return Response.json(
        { message: 'Sesión expirada' },
        { status: 401, headers: { 'Set-Cookie': clearRefreshCookie() } },
      );
    }

    return Response.json(
      { user: rotated.user, accessToken: signToken(rotated.user) },
      { headers: { 'Set-Cookie': refreshCookie(rotated.refreshToken) } },
    );
  } catch (err) {
    console.error('[auth/refresh]', err);
    return Response.json({ message: 'No se pudo renovar la sesión' }, { status: 503 });
  }
}
