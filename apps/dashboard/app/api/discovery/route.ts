import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('discovery', handleGET);

async function handleGET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const discoveries = await prisma.commercialDiscovery.findMany({
    where: { tenantId: user.tenantId },
    include: {
      company: { select: { id: true, name: true } },
      vacancy: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  return Response.json(discoveries);
}
