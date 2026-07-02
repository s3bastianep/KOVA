import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { isMockMode, MOCK_FINALISTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_FINALISTS);

  return Response.json({ vacancy: null, company: null, candidates: [] });
}
