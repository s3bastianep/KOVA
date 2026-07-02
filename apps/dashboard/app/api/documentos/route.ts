import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_DOCUMENTS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_DOCUMENTS);

  const documents = await prisma.document.findMany({
    where: { tenantId: user.tenantId },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  }).catch(() => []);
  return Response.json(documents);
}
