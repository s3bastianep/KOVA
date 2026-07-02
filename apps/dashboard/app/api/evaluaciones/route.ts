import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_ASSESSMENTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_ASSESSMENTS);

  const assessments = await prisma.assessment.findMany({
    where: { tenantId: user.tenantId },
    include: { candidate: { select: { firstName: true, lastName: true } } },
    orderBy: { updatedAt: 'desc' },
  }).catch(() => []);
  return Response.json(assessments);
}
