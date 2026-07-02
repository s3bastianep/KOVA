import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { isMockMode, MOCK_ACADEMIA } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_ACADEMIA);

  return Response.json([]);
}
