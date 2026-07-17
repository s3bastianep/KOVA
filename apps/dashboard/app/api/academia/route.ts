import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { isMockMode, MOCK_ACADEMIA } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('academia', handleGET);

async function handleGET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_ACADEMIA);

  return Response.json([]);
}
