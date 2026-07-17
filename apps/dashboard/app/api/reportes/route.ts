import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { isMockMode, MOCK_REPORTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('reportes', handleGET);

async function handleGET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

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
