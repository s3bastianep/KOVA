import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, getMockVacanciesForList } from '../../../lib/mock';
import { computeProcessPipelineMetrics } from '../../../lib/process-metrics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  if (isMockMode()) return Response.json(getMockVacanciesForList());

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    select: { id: true },
  });
  const companyIds = companies.map((c) => c.id);

  const vacancies = await prisma.vacancy.findMany({
    where: { tenantId: user.tenantId, companyId: { in: companyIds } },
    include: {
      company: { select: { id: true, name: true } },
      candidates: { select: { stage: true } },
    },
    orderBy: { updatedAt: 'desc' },
    // Same rationale as /api/candidatos: without a cap this loads every vacancy in the tenant,
    // each with its full candidate-stage list, in one response.
    take: 200,
  });

  return Response.json(
    vacancies.map(({ candidates, ...vacancy }) => ({
      ...vacancy,
      _count: { candidates: candidates.length },
      pipelineMetrics: computeProcessPipelineMetrics(candidates.map((c) => c.stage)),
    })),
  );
}
