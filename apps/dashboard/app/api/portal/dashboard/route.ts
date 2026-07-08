import { NextRequest } from 'next/server';
import { requireCandidateUser } from '@/lib/candidate-auth';
import { prisma } from '@/lib/prisma';
import {
  calculateProfileCompleteness,
  commercialProfileFromMetadata,
} from '@/lib/candidate-commercial-profile';
import { isMockMode } from '@/lib/mock';
import {
  computeCandidateVacancyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
  PORTAL_RECOMMENDED_MIN_MATCH,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireCandidateUser(req);
  if (auth instanceof Response) return auth;

  const { user, candidate } = auth;

  if (isMockMode()) {
    return Response.json({
      greeting: user.firstName,
      profileCompleteness: 18,
      stats: {
        vacantesRecomendadas: 3,
        aplicacionesActivas: 0,
        entrevistasProximas: 0,
        hasCv: false,
      },
      nextSteps: [
        { id: 'perfil', label: 'Completa tu perfil personal', href: '/portal/perfil', done: false },
        { id: 'documentos', label: 'Sube tu hoja de vida', href: '/portal/documentos', done: false },
        { id: 'comercial', label: 'Define tu perfil comercial', href: '/portal/comercial', done: false },
      ],
    });
  }

  const commercialProfile = commercialProfileFromMetadata(candidate.metadata) ?? {
    nombre: `${candidate.firstName} ${candidate.lastName}`.trim(),
    email: candidate.email ?? user.email,
    telefono: candidate.phone ?? undefined,
    ciudad: candidate.city ?? undefined,
  };

  const profileCompleteness = calculateProfileCompleteness(commercialProfile);

  const [aplicacionesActivas, entrevistasProximas, cvDocument, appliedRows, openVacancies] =
    await Promise.all([
    prisma.candidateVacancy.count({
      where: {
        candidateId: candidate.id,
        rejectedAt: null,
        stage: { notIn: ['HIRED', 'REJECTED', 'WITHDRAWN'] },
      },
    }),
    prisma.interview.count({
      where: {
        candidateId: candidate.id,
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date() },
      },
    }),
    prisma.document.findFirst({
      where: {
        candidateId: candidate.id,
        OR: [{ type: 'CV' }, { name: { contains: 'hoja', mode: 'insensitive' } }],
      },
      select: { id: true },
    }),
    prisma.candidateVacancy.findMany({
      where: { candidateId: candidate.id },
      select: { vacancyId: true },
    }),
    prisma.vacancy.findMany({
      where: {
        tenantId: user.tenantId,
        status: { in: [...PORTAL_OPEN_VACANCY_STATUSES] },
      },
      select: { id: true, metadata: true },
      take: 100,
    }),
  ]);

  const appliedIds = new Set(appliedRows.map((row) => row.vacancyId));
  const vacantesRecomendadas = openVacancies.filter((vacancy) => {
    if (appliedIds.has(vacancy.id)) return false;
    const { total } = computeCandidateVacancyCompatibility(candidate, vacancy.metadata);
    return total >= PORTAL_RECOMMENDED_MIN_MATCH;
  }).length;

  const hasCv = Boolean(cvDocument ?? candidate.cvText?.trim());

  const nextSteps = [
    {
      id: 'perfil',
      label: 'Completa tu perfil personal',
      href: '/portal/perfil',
      done: Boolean(
        commercialProfile.telefono &&
          commercialProfile.ciudad &&
          commercialProfile.disponibilidad &&
          commercialProfile.disponibilidadViajar &&
          commercialProfile.disponibilidadReubicacion,
      ),
    },
    {
      id: 'documentos',
      label: 'Sube tu hoja de vida',
      href: '/portal/documentos',
      done: hasCv,
    },
    {
      id: 'comercial',
      label: 'Define tu perfil comercial',
      href: '/portal/comercial',
      done: Boolean(commercialProfile.nivelRol && commercialProfile.tipoVenta),
    },
  ];

  return Response.json({
    greeting: user.firstName,
    profileCompleteness,
    stats: {
      vacantesRecomendadas,
      aplicacionesActivas,
      entrevistasProximas,
      hasCv,
    },
    nextSteps,
  });
}
