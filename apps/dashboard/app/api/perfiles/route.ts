import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_JOB_PROFILES } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_JOB_PROFILES);

  const profiles = await prisma.jobProfile.findMany({
    where: { vacancy: { tenantId: user.tenantId } },
    include: { competencies: true, vacancy: { select: { title: true, company: { select: { name: true } } } } },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  }).catch(() => []);
  return Response.json(profiles);
}
