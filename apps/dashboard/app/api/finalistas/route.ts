import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { isMockMode, MOCK_FINALISTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('finalistas', handleGET);

async function handleGET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_FINALISTS);

  return Response.json({ vacancy: null, company: null, candidates: [] });
}
