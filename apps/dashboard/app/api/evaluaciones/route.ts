import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_ASSESSMENTS, ASSESSMENT_TYPE_LABELS } from '../../../lib/mock';
import { groupAssessmentsByProcess, parseMistakesFromComments, type AssessmentRecord } from '../../../lib/evaluations';

export const dynamic = 'force-dynamic';

function durationMinutes(start: Date, end?: Date | null) {
  if (!end) return null;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
}

function formatDuration(minutes: number | null) {
  if (minutes == null) return '-';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function mapAssessment(a: {
  id: string;
  type: string;
  title: string;
  score: number | null;
  maxScore: number;
  result: string | null;
  comments: string | null;
  createdAt: Date;
  completedAt: Date | null;
  candidate: { firstName: string; lastName: string; id: string };
  vacancy?: { id: string; title: string; company?: { name: string } | null } | null;
}): AssessmentRecord {
  const mins = durationMinutes(a.createdAt, a.completedAt);
  const mistakes = parseMistakesFromComments(a.comments);
  let comments = a.comments ?? undefined;
  try {
    if (comments && comments.startsWith('{')) {
      const parsed = JSON.parse(comments) as { feedback?: string };
      comments = parsed.feedback ?? comments;
    }
  } catch {
    // mantener texto original
  }

  return {
    id: a.id,
    candidateId: a.candidate.id,
    candidateName: `${a.candidate.firstName} ${a.candidate.lastName}`,
    vacancyId: a.vacancy?.id,
    vacancyTitle: a.vacancy?.title ?? undefined,
    companyName: a.vacancy?.company?.name,
    type: ASSESSMENT_TYPE_LABELS[a.type] ?? a.title,
    competency: a.title,
    score: a.score ?? 0,
    maxScore: a.maxScore,
    result: a.result ?? 'Pendiente',
    durationMinutes: mins ?? undefined,
    durationLabel: formatDuration(mins),
    completedAt: a.completedAt?.toISOString() ?? undefined,
    comments,
    mistakes,
  };
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  let items: AssessmentRecord[];

  if (isMockMode()) {
    items = MOCK_ASSESSMENTS.map((a) => ({
      ...a,
      mistakes: a.mistakes ?? [],
      durationLabel: a.durationMinutes < 60
        ? `${a.durationMinutes} min`
        : `${Math.floor(a.durationMinutes / 60)}h ${a.durationMinutes % 60}min`,
    }));
  } else {
    const assessments = await prisma.assessment.findMany({
      where: { tenantId: user.tenantId, completedAt: { not: null } },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true } },
        vacancy: { select: { id: true, title: true, company: { select: { name: true } } } },
      },
      orderBy: { completedAt: 'desc' },
      take: 200,
    }).catch(() => []);

    items = assessments.map(mapAssessment);
  }

  const processes = groupAssessmentsByProcess(items);
  return Response.json({ processes, totalTests: items.length });
}
