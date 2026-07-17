import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, isStaffRole, candidateWhereForUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isMockMode, getMockCandidate, MOCK_ASSESSMENTS } from '../../../../lib/mock';
import { mapCandidateProcessHistory } from '../../../../lib/candidate-process-history';
import { mapCandidateAssessment } from '../../../../lib/evaluations';

const ASSESSMENT_TYPE_LABELS: Record<string, string> = {
  COMMERCIAL: 'Prueba Comercial',
  TECHNICAL: 'Prueba Técnica',
  BEHAVIORAL: 'Prueba Conductual',
  ROLE_PLAY: 'Role Play',
};

const FINALIST_STAGES = ['CLIENT_REVIEW', 'OFFER', 'HIRED'];

export const dynamic = 'force-dynamic';

function formatPeriod(start?: Date | null, end?: Date | null, isCurrent?: boolean) {
  const fmt = (d: Date) => d.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });
  if (!start) return '-';
  const endStr = isCurrent || !end ? 'Actualidad' : fmt(end);
  return `${fmt(start)} - ${endStr}`;
}

export const GET = withApiErrors('candidatos/[id]', handleGET);

async function handleGET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  const { id } = await params;

  if (isMockMode()) {
    const candidate = getMockCandidate(id);
    if (!candidate) return Response.json({ message: 'Candidato no encontrado' }, { status: 404 });
    const assessments = MOCK_ASSESSMENTS.filter((a) => a.candidateId === id).map((a) =>
      mapCandidateAssessment({
        id: a.id,
        type: a.type,
        competency: a.competency,
        score: a.score,
        maxScore: a.maxScore,
        result: a.result,
        comments: a.comments,
        mistakes: a.mistakes,
        date: a.completedAt,
        durationMinutes: a.durationMinutes,
      }),
    );
    return Response.json({
      ...candidate,
      vacancyTitle: candidate.vacancies[0]?.vacancy.title,
      processHistory: candidate.processHistory ?? [],
      assessments,
      activities: [
        { id: 'a1', description: 'Candidato agregado al proceso', type: 'CREATE', date: new Date(Date.now() - 6 * 86400000).toISOString() },
        { id: 'a2', description: 'Compatibilidad calculada automáticamente', type: 'AUTO_GENERATED', date: new Date(Date.now() - 6 * 86400000).toISOString() },
        { id: 'a3', description: 'Prueba comercial enviada', type: 'UPDATE', date: new Date(Date.now() - 3 * 86400000).toISOString() },
        { id: 'a4', description: 'Movido a Entrevista', type: 'STAGE_CHANGE', date: new Date(Date.now() - 2 * 86400000).toISOString() },
      ],
      educations: [{ id: 'ed1', institution: 'Universidad Nacional', degree: 'Administración de Empresas', year: 2018 }],
      evaluatedCount: 8,
      finalistCount: 2,
    });
  }

  const candidate = await prisma.candidate.findFirst({
    where: { id, ...candidateWhereForUser(user) },
    include: {
      experiences: { orderBy: { startDate: 'desc' } },
      educations: true,
      references: true,
      // Explicit select instead of `true` — Document.content stores the full CV file bytes,
      // which this response never uses (only id/name/type/url/createdAt are mapped below).
      documents: {
        select: { id: true, name: true, type: true, url: true, createdAt: true },
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { firstName: true, lastName: true } } },
      },
      interviews: { include: { questions: true }, orderBy: { scheduledAt: 'desc' }, take: 5 },
      assessments: { orderBy: { updatedAt: 'desc' }, take: 5 },
      vacancies: {
        orderBy: { updatedAt: 'desc' },
        include: {
          vacancy: {
            select: {
              id: true,
              title: true,
              status: true,
              company: { select: { id: true, name: true } },
            },
          },
          stageHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      },
      activities: { orderBy: { createdAt: 'desc' }, take: 15 },
    },
  });

  if (!candidate) return Response.json({ message: 'Candidato no encontrado' }, { status: 404 });

  const primary = candidate.vacancies[0];
  const processHistory = mapCandidateProcessHistory(candidate.vacancies);

  let evaluatedCount = 0;
  let finalistCount = 0;
  if (primary?.vacancy.id) {
    [evaluatedCount, finalistCount] = await Promise.all([
      prisma.candidateVacancy.count({ where: { vacancyId: primary.vacancy.id } }),
      prisma.candidateVacancy.count({
        where: { vacancyId: primary.vacancy.id, stage: { in: FINALIST_STAGES as never } },
      }),
    ]);
  }

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
    processHistory,
    processCount: processHistory.length,
    profileSummary: candidate.profileSummary,
    compatibilityBreakdown: (candidate.metadata as { compatibilityBreakdown?: unknown[] })?.compatibilityBreakdown ?? [],
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
    assessments: candidate.assessments.map((a) =>
      mapCandidateAssessment({
        id: a.id,
        type: ASSESSMENT_TYPE_LABELS[a.type] ?? a.type,
        competency: a.title,
        score: a.score,
        maxScore: a.maxScore,
        result: a.result,
        comments: a.comments,
        date: a.completedAt?.toISOString() ?? a.createdAt.toISOString(),
        durationMinutes: a.completedAt
          ? Math.max(1, Math.round((a.completedAt.getTime() - a.createdAt.getTime()) / 60000))
          : null,
      }),
    ),
    educations: candidate.educations.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: [e.degree, e.field].filter(Boolean).join(' · '),
      year: e.year,
    })),
    documents: candidate.documents.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      url: d.url,
      date: d.createdAt.toISOString(),
    })),
    activities: candidate.activities.map((a) => ({
      id: a.id,
      description: a.description,
      type: a.type,
      date: a.createdAt.toISOString(),
    })),
    evaluatedCount,
    finalistCount,
  });
}
