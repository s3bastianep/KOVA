import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

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
