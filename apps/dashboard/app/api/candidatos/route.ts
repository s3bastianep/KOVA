import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

function mapCandidate(c: {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  source: string | null;
  compatibility: number | null;
  ranking: number | null;
  vacancies: { stage: string; source?: string | null; ranking?: number | null; vacancy: { title: string } }[];
}) {
  const primary = c.vacancies[0];
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    city: c.city,
    status: c.status,
    source: c.source ?? primary?.source,
    compatibility: c.compatibility,
    ranking: c.ranking ?? primary?.ranking,
    currentStage: primary?.stage,
    vacancyTitle: primary?.vacancy.title,
  };
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) {
    return Response.json(
      MOCK_CANDIDATES.map((c) => ({
        ...c,
        vacancyTitle: c.vacancies[0]?.vacancy.title,
      })),
    );
  }

  const vacancyId = req.nextUrl.searchParams.get('vacancyId') ?? undefined;

  const candidates = await prisma.candidate.findMany({
    where: {
      tenantId: user.tenantId,
      ...(vacancyId && { vacancies: { some: { vacancyId } } }),
    },
    include: {
      vacancies: {
        include: { vacancy: { select: { id: true, title: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: [{ ranking: 'asc' }, { updatedAt: 'desc' }],
  });

  return Response.json(candidates.map(mapCandidate));
}
