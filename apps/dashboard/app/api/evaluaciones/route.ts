import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_ASSESSMENTS, ASSESSMENT_TYPE_LABELS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

function durationMinutes(start: Date, end?: Date | null) {
  if (!end) return null;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
}

function formatDuration(minutes: number | null) {
  if (minutes == null) return '—';
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
  vacancy?: { title: string } | null;
}) {
  const mins = durationMinutes(a.createdAt, a.completedAt);
  return {
    id: a.id,
    candidateId: a.candidate.id,
    candidateName: `${a.candidate.firstName} ${a.candidate.lastName}`,
    vacancyTitle: a.vacancy?.title ?? null,
    type: ASSESSMENT_TYPE_LABELS[a.type] ?? a.title,
    competency: a.title,
    score: a.score ?? 0,
    maxScore: a.maxScore,
    result: a.result ?? 'Pendiente',
    durationMinutes: mins,
    durationLabel: formatDuration(mins),
    completedAt: a.completedAt?.toISOString() ?? null,
    comments: a.comments,
  };
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) {
    return Response.json(
      MOCK_ASSESSMENTS.map((a) => ({
        ...a,
        durationLabel: a.durationMinutes < 60
          ? `${a.durationMinutes} min`
          : `${Math.floor(a.durationMinutes / 60)}h ${a.durationMinutes % 60}min`,
      })),
    );
  }

  const assessments = await prisma.assessment.findMany({
    where: { tenantId: user.tenantId },
    include: {
      candidate: { select: { id: true, firstName: true, lastName: true } },
      vacancy: { select: { title: true } },
    },
    orderBy: { completedAt: 'desc' },
  }).catch(() => []);

  return Response.json(assessments.map(mapAssessment));
}
