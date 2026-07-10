import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, getMockClients } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

const ACTIVE_STATUSES = new Set(['SEARCH_ACTIVE', 'EVALUATION', 'FINALISTS', 'OFFER', 'PROFILE_BUILDING', 'DISCOVERY', 'DISCOVERY_PENDING', 'APPROVAL_PENDING']);

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  if (isMockMode()) {
    return Response.json(getMockClients());
  }

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    include: {
      consultants: {
        include: { consultant: { select: { firstName: true, lastName: true } } },
        take: 1,
      },
      vacancies: {
        select: {
          id: true,
          title: true,
          status: true,
          city: true,
          createdAt: true,
          closedAt: true,
          _count: { select: { candidates: true } },
        },
        orderBy: { updatedAt: 'desc' },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { description: true, createdAt: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  const clients = companies.map((co) => {
    const processes = co.vacancies.map((v) => ({
      id: v.id,
      title: v.title,
      status: v.status,
      candidates: v._count.candidates,
      city: v.city ?? undefined,
      createdAt: v.createdAt.toISOString(),
    }));
    const activeProcesses = processes.filter((p) => ACTIVE_STATUSES.has(p.status));
    const hired = co.vacancies.filter((v) => v.status === 'HIRED' && v.closedAt);
    hired.sort((a, b) => b.closedAt!.getTime() - a.closedAt!.getTime());
    const last = hired[0];
    const consultant = co.consultants[0]?.consultant;

    return {
      id: co.id,
      name: co.name,
      sector: co.sector ?? undefined,
      industry: co.industry ?? undefined,
      city: co.city ?? undefined,
      status: co.status,
      email: co.email ?? undefined,
      phone: co.phone ?? undefined,
      primaryContact: co.primaryContact ?? undefined,
      consultantName: consultant ? `${consultant.firstName} ${consultant.lastName}` : undefined,
      processes,
      activeProcesses,
      activeProcessCount: activeProcesses.length,
      totalProcesses: processes.length,
      totalHires: hired.length,
      lastHireDate: last?.closedAt?.toISOString() ?? null,
      lastHireRole: last?.title ?? null,
      lastHireCandidate: null,
      hireHistory: hired.map((h) => ({
        date: h.closedAt!.toISOString(),
        role: h.title,
        candidate: '',
      })),
      lastActivityDate: co.activities[0]?.createdAt.toISOString(),
      lastActivityNote: co.activities[0]?.description,
      nextFollowUpDate: undefined,
      nextFollowUpTitle: undefined,
      relationshipSince: co.createdAt.toISOString(),
    };
  });

  return Response.json(clients);
}
