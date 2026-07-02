import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isMockMode, getMockVacancy } from '../../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;

  if (isMockMode()) {
    const vacancy = getMockVacancy(id);
    if (!vacancy) return Response.json({ message: 'Vacante no encontrada' }, { status: 404 });
    return Response.json(vacancy);
  }

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    select: { id: true },
  });
  const companyIds = companies.map((c) => c.id);

  const vacancy = await prisma.vacancy.findFirst({
    where: { id, tenantId: user.tenantId, companyId: { in: companyIds } },
    include: {
      company: true,
      discovery: true,
      jobProfile: { include: { competencies: true } },
      candidates: {
        include: { candidate: true, stageHistory: { orderBy: { createdAt: 'desc' }, take: 5 } },
        orderBy: { ranking: 'asc' },
      },
      pipelineStages: { orderBy: { order: 'asc' } },
      tasks: { orderBy: { dueDate: 'asc' }, take: 10 },
    },
  });

  if (!vacancy) return Response.json({ message: 'Vacante no encontrada' }, { status: 404 });
  return Response.json(vacancy);
}
