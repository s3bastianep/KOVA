import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, isStaffRole } from '../../../lib/auth';
import { isMockMode, MOCK_ONBOARDING } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_ONBOARDING);

  return Response.json({ candidate: null, role: null, progress: 0, modules: [] });
}
