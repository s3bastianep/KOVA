import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_CANDIDATES);

  const vacancyId = req.nextUrl.searchParams.get('vacancyId') ?? undefined;

  const candidates = await prisma.candidate.findMany({
    where: {
      tenantId: user.tenantId,
      ...(vacancyId && { vacancies: { some: { vacancyId } } }),
    },
    include: {
      vacancies: { include: { vacancy: { select: { id: true, title: true } } } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Response.json(candidates);
}
