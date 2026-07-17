import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_INTERVIEWS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_INTERVIEWS);

  const interviews = await prisma.interview.findMany({
    where: { tenantId: user.tenantId },
    include: { candidate: { select: { firstName: true, lastName: true } }, questions: true },
    orderBy: { scheduledAt: 'desc' },
    take: 200,
  }).catch(() => []);
  return Response.json(interviews);
}
