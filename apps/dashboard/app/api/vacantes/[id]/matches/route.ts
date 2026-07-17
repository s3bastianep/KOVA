import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { UserRole } from '@prisma/client';
import { getUserFromRequest, unauthorized } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../../../lib/mock';
import {
  calculateCompatibility,
  profileFromCandidate,
  requirementsFromMetadata,
} from '../../../../../lib/compatibility';
import {
  calculateCommercialProfileMatch,
  commercialCriteriaFromVacancyMetadata,
  commercialProfileFromMetadata,
  mergeCompatibilityScores,
} from '../../../../../lib/candidate-commercial-profile';

export const dynamic = 'force-dynamic';

const STAFF_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.COORDINATOR,
  UserRole.CONSULTANT,
]);

type MatchRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  source: string | null;
  compatibility: number;
  breakdown: ReturnType<typeof calculateCompatibility>['breakdown'];
};

export const GET = withApiErrors('vacantes/[id]/matches', handleGET);

async function handleGET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user || !STAFF_ROLES.has(user.role)) return unauthorized();

  const { id: vacancyId } = await params;
  const limit = Math.min(50, Math.max(5, Number(req.nextUrl.searchParams.get('limit') ?? 20)));

  if (isMockMode()) {
    const requirements = requirementsFromMetadata({});
    const rows: MatchRow[] = MOCK_CANDIDATES.slice(0, limit).map((c) => {
      const answers = profileFromCandidate(c);
      const { total, breakdown } = calculateCompatibility(requirements, answers);
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        city: c.city,
        source: c.source,
        compatibility: total,
        breakdown,
      };
    });
    rows.sort((a, b) => b.compatibility - a.compatibility);
    return Response.json({ vacancyId, matches: rows, total: rows.length });
  }

  const vacancy = await prisma.vacancy.findFirst({
    where: { id: vacancyId, tenantId: user.tenantId },
    select: { id: true, title: true, metadata: true },
  });

  if (!vacancy) {
    return Response.json({ message: 'Vacante no encontrada' }, { status: 404 });
  }

  const linked = await prisma.candidateVacancy.findMany({
    where: { vacancyId },
    select: { candidateId: true },
  });
  const linkedIds = new Set(linked.map((row) => row.candidateId));
  const requirements = requirementsFromMetadata(vacancy.metadata);
  const commercialCriteria = commercialCriteriaFromVacancyMetadata(vacancy.metadata);

  const candidates = await prisma.candidate.findMany({
    where: {
      tenantId: user.tenantId,
      status: { in: ['NEW', 'ACTIVE'] },
      id: { notIn: [...linkedIds] },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      source: true,
      metadata: true,
      experiences: { select: { startDate: true, endDate: true, isCurrent: true }, take: 3 },
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  const matches: MatchRow[] = [];

  for (const candidate of candidates) {
    const answers = profileFromCandidate(candidate);
    const commercialProfile = commercialProfileFromMetadata(candidate.metadata);
    if (Object.keys(answers).length === 0 && !commercialProfile) continue;

    const standard = calculateCompatibility(requirements, answers);
    const commercial =
      commercialProfile && commercialCriteria
        ? calculateCommercialProfileMatch(commercialProfile, commercialCriteria)
        : null;

    const { total, breakdown } = commercial
      ? mergeCompatibilityScores(standard.total, standard.breakdown, commercial)
      : standard;

    matches.push({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      city: candidate.city,
      source: candidate.source,
      compatibility: total,
      breakdown,
    });
  }

  matches.sort((a, b) => b.compatibility - a.compatibility);

  return Response.json({
    vacancyId,
    vacancyTitle: vacancy.title,
    matches: matches.slice(0, limit),
    total: matches.length,
  });
}
