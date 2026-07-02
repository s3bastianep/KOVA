import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isMockMode, getMockCandidate } from '../../../../lib/mock';

export const dynamic = 'force-dynamic';

function formatPeriod(start?: Date | null, end?: Date | null, isCurrent?: boolean) {
  const fmt = (d: Date) => d.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });
  if (!start) return '—';
  const endStr = isCurrent || !end ? 'Actualidad' : fmt(end);
  return `${fmt(start)} – ${endStr}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;

  if (isMockMode()) {
    const candidate = getMockCandidate(id);
    if (!candidate) return Response.json({ message: 'Candidato no encontrado' }, { status: 404 });
    return Response.json({
      ...candidate,
      vacancyTitle: candidate.vacancies[0]?.vacancy.title,
    });
  }

  const candidate = await prisma.candidate.findFirst({
    where: { id, tenantId: user.tenantId },
    include: {
      experiences: { orderBy: { startDate: 'desc' } },
      educations: true,
      references: true,
      documents: true,
      notes: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { firstName: true, lastName: true } } },
      },
      interviews: { include: { questions: true }, orderBy: { scheduledAt: 'desc' }, take: 5 },
      assessments: { orderBy: { updatedAt: 'desc' }, take: 5 },
      vacancies: {
        include: {
          vacancy: { select: { id: true, title: true, company: { select: { name: true } } } },
          stageHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      },
      activities: { orderBy: { createdAt: 'desc' }, take: 15 },
    },
  });

  if (!candidate) return Response.json({ message: 'Candidato no encontrado' }, { status: 404 });

  const primary = candidate.vacancies[0];

  return Response.json({
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    email: candidate.email,
    phone: candidate.phone,
    city: candidate.city,
    linkedinUrl: candidate.linkedinUrl,
    source: candidate.source,
    status: candidate.status,
    compatibility: candidate.compatibility,
    ranking: candidate.ranking ?? primary?.ranking,
    currentStage: primary?.stage,
    vacancyTitle: primary?.vacancy.title,
    vacancyId: primary?.vacancy.id,
    companyName: primary?.vacancy.company?.name,
    profileSummary: candidate.profileSummary,
    experiences: candidate.experiences.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      period: formatPeriod(e.startDate, e.endDate, e.isCurrent),
      achievement: e.results ?? e.description ?? '',
    })),
    competencies: candidate.assessments.map((a) => ({
      name: a.title,
      score: a.score ?? 0,
    })),
    notes: candidate.notes.map((n) => ({
      id: n.id,
      text: n.content,
      author: n.author ? `${n.author.firstName} ${n.author.lastName}` : 'Consultor',
      date: n.createdAt.toISOString(),
    })),
    interviews: candidate.interviews.map((iv) => ({
      id: iv.id,
      title: iv.title,
      status: iv.status,
      scheduledAt: iv.scheduledAt?.toISOString(),
      score: iv.overallScore,
    })),
    stageHistory: primary?.stageHistory.map((h) => ({
      from: h.fromStage,
      to: h.toStage,
      date: h.createdAt.toISOString(),
    })),
  });
}
