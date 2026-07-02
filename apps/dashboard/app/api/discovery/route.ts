import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const discoveries = await prisma.commercialDiscovery.findMany({
    where: { tenantId: user.tenantId },
    include: {
      company: { select: { id: true, name: true } },
      vacancy: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Response.json(discoveries);
}
