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
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    activeVacancies,
    closedVacancies,
    activeClients,
    newClients,
    activeConsultants,
    candidatesCount,
    interviewsScheduled,
    interviewsToday,
    candidatesToReview,
    testsToGrade,
    clientsWaiting,
    pendingTasks,
    overdueTasks,
    hiresThisMonth,
    recentActivity,
    alerts,
    pipeline,
    activeProcessesList,
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
    prisma.interview.count({
      where: {
        tenantId: user.tenantId,
        status: 'SCHEDULED',
        scheduledAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.candidateVacancy.count({
      where: {
        stage: { in: ['APPLIED', 'SCREENING'] },
        vacancy: { companyId: { in: companyIds } },
      },
    }),
    prisma.assessment.count({
      where: {
        tenantId: user.tenantId,
        OR: [{ score: null }, { result: { contains: 'revisión', mode: 'insensitive' } }],
      },
    }),
    prisma.vacancy.count({
      where: {
        tenantId: user.tenantId,
        companyId: { in: companyIds },
        status: { in: ['SEARCH_ACTIVE', 'EVALUATION', 'FINALISTS'] },
      },
    }),
    prisma.task.count({
      where: {
        tenantId: user.tenantId,
        status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE'] },
        ...(user.role === 'CONSULTANT' && { assigneeId: user.id }),
      },
    }),
    prisma.task.count({
      where: {
        tenantId: user.tenantId,
        status: 'OVERDUE',
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
    prisma.vacancy.findMany({
      where: {
        tenantId: user.tenantId,
        companyId: { in: companyIds },
        status: { notIn: ['CLOSED', 'HIRED'] },
      },
      include: {
        company: { select: { name: true } },
        _count: { select: { candidates: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
  ]);

  return Response.json({
    kpis: {
      activeClients,
      activeProcesses: activeVacancies,
      activeCandidates: candidatesCount,
      interviewsToday,
      pendingReviews: testsToGrade,
      stalledProcesses: overdueTasks,
      dueSoon: alerts.length,
      activeDeals: activeClients,
      pendingTasks,
      hiresThisMonth,
      activeVacancies,
      closedVacancies,
      candidatesCount,
      interviewsScheduled,
    },
    myDay: {
      interviews: interviewsToday,
      candidatesToReview,
      testsToGrade,
      clientsWaiting,
      tasks: pendingTasks,
      proposals: Math.max(0, Math.floor(activeVacancies * 0.2)),
    },
    processes: activeProcessesList.map((p) => ({
      id: p.id,
      title: p.title,
      company: p.company.name,
      status: p.status,
      candidates: p._count.candidates,
      daysOpen: p.openedAt ? Math.floor((Date.now() - p.openedAt.getTime()) / 86400000) : 0,
      trafficLight: p.requiredDate && p.requiredDate < new Date() ? 'red' : p.requiredDate && p.requiredDate < new Date(Date.now() + 7 * 86400000) ? 'yellow' : 'green',
    })),
    todayWork: alerts.map((a, i) => ({
      id: String(i),
      title: a.title,
      priority: a.status === 'OVERDUE' ? 'HIGH' : 'MEDIUM',
      type: 'Tarea',
      processId: null,
    })),
    recruitmentFunnel: pipeline.map((p) => ({
      stage: p.stage.replace(/_/g, ' '),
      count: p._count.stage,
    })),
    commercialFunnel: [
      { stage: 'Prospecto', count: Math.max(1, Math.floor(activeClients * 1.5)) },
      { stage: 'Contacto', count: activeClients },
      { stage: 'Reunión', count: Math.max(1, Math.floor(activeClients * 0.8)) },
      { stage: 'Propuesta', count: Math.max(1, Math.floor(activeVacancies * 0.6)) },
      { stage: 'Negociación', count: Math.max(0, Math.floor(activeVacancies * 0.3)) },
      { stage: 'Ganado', count: hiresThisMonth },
    ],
    pipeline,
    recentActivity,
    alerts,
  });
}
