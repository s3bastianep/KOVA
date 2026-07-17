import { NextRequest } from 'next/server';
import { clearRefreshCookie, readRefreshCookie, revokeRefreshToken } from '../../../../lib/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = readRefreshCookie(req);
  if (raw) await revokeRefreshToken(raw);

  return Response.json(
    { message: 'Sesión cerrada' },
    { headers: { 'Set-Cookie': clearRefreshCookie() } },
  );
}
