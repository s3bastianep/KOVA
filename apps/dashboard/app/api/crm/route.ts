import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CRM } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_CRM);

  const interactions = await prisma.crmInteraction.findMany({
    where: { company: { tenantId: user.tenantId } },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  }).catch(() => []);
  return Response.json(interactions);
}
