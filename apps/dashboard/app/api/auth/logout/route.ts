import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { clearSessionCookieHeaders, readRefreshCookie, revokeRefreshToken } from '../../../../lib/session';

export const dynamic = 'force-dynamic';

export const POST = withApiErrors('auth/logout', handlePOST);

async function handlePOST(req: NextRequest) {
  const raw = readRefreshCookie(req);
  if (raw) await revokeRefreshToken(raw);

  return Response.json(
    { message: 'Sesión cerrada' },
    { headers: clearSessionCookieHeaders() },
  );
}
