import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_VACANCIES } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_VACANCIES);

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    select: { id: true },
  });
  const companyIds = companies.map((c) => c.id);

  const vacancies = await prisma.vacancy.findMany({
    where: { tenantId: user.tenantId, companyId: { in: companyIds } },
    include: {
      company: { select: { id: true, name: true } },
      _count: { select: { candidates: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Response.json(vacancies);
}
