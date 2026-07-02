import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_DASHBOARD } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_DASHBOARD);

  const companyWhere = companyWhereForUser(user);
  const companies = await prisma.company.findMany({ where: companyWhere, select: { id: true } });
  const companyIds = companies.map((c) => c.id);

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    activeVacancies,
    closedVacancies,
    activeClients,
    newClients,
    activeConsultants,
    candidatesCount,
    interviewsScheduled,
    pendingTasks,
    hiresThisMonth,
    recentActivity,
    alerts,
    pipeline,
  ] = await Promise.all([
    prisma.vacancy.count({
      where: { tenantId: user.tenantId, companyId: { in: companyIds }, status: { notIn: ['CLOSED', 'HIRED'] } },
    }),
    prisma.vacancy.count({
      where: { tenantId: user.tenantId, companyId: { in: companyIds }, status: 'CLOSED' },
    }),
    prisma.company.count({ where: { ...companyWhere, status: 'ACTIVE' } }),
    prisma.company.count({
      where: { ...companyWhere, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    user.role === 'CLIENT'
      ? Promise.resolve(0)
      : prisma.user.count({ where: { tenantId: user.tenantId, role: 'CONSULTANT', status: 'ACTIVE' } }),
    prisma.candidate.count({ where: { tenantId: user.tenantId } }),
    prisma.interview.count({
      where: { tenantId: user.tenantId, status: 'SCHEDULED', scheduledAt: { gte: new Date() } },
    }),
    prisma.task.count({
      where: {
        tenantId: user.tenantId,
        status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE'] },
        ...(user.role === 'CONSULTANT' && { assigneeId: user.id }),
      },
    }),
    prisma.candidateVacancy.count({ where: { stage: 'HIRED', hiredAt: { gte: startOfMonth } } }),
    prisma.activityLog.findMany({
      where: { tenantId: user.tenantId, ...(companyIds.length && { companyId: { in: companyIds } }) },
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.task.findMany({
      where: {
        tenantId: user.tenantId,
        status: { in: ['OVERDUE', 'PENDING'] },
        dueDate: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      },
      take: 10,
      orderBy: { dueDate: 'asc' },
    }),
    prisma.candidateVacancy.groupBy({
      by: ['stage'],
      _count: { stage: true },
      where: { vacancy: { companyId: { in: companyIds } } },
    }),
  ]);

  return Response.json({
    kpis: {
      activeVacancies,
      closedVacancies,
      activeClients,
      newClients,
      activeConsultants,
      candidatesCount,
      interviewsScheduled,
      pendingTasks,
      hiresThisMonth,
    },
    pipeline,
    recentActivity,
    alerts,
  });
}
