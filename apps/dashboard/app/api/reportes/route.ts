import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { isMockMode, MOCK_REPORTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_REPORTS);

  return Response.json({
    avgTimeToHire: 0,
    avgTimeToHireDelta: 0,
    hires6m: 0,
    hires6mDelta: 0,
    activeConsultants: 0,
    activeConsultantsDelta: 0,
    totalSources: 0,
    avgTimePerStage: [],
    byConsultant: [],
    sources: [],
    hiresByMonth: [],
  });
}
