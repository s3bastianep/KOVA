import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  calculateProfileCompleteness,
  commercialProfileFromMetadata,
} from '@/lib/candidate-commercial-profile';
import { isMockMode } from '@/lib/mock';
import { cvSummaryFromMetadata, getProfileGaps } from '@/lib/portal-profile';
import { handlePortalRoute } from '@/lib/portal-api';
import {
  portalDashboardCacheKey,
  portalServerCacheGet,
  portalServerCacheSet,
} from '@/lib/portal-server-cache';
import { countRecommendedVacantes, loadPortalVacantes } from '@/lib/portal-vacantes-service';

export const dynamic = 'force-dynamic';

function buildNextSteps(commercialProfile: ReturnType<typeof commercialProfileFromMetadata>, hasCv: boolean) {
  return [
    {
      id: 'perfil',
      label: 'Completa tu perfil personal',
      href: '/portal/perfil',
      done: Boolean(
        commercialProfile?.telefono &&
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
      label: 'Completa tus preferencias laborales',
      href: '/portal/preferencias',
      done: Boolean(
        commercialProfile?.tipoVenta &&
          (commercialProfile.industrias?.length ?? 0) > 0 &&
          commercialProfile.expectativaSalarial,
      ),
    },
  ];
}

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      if (isMockMode()) {
        const commercialProfile = commercialProfileFromMetadata(candidate.metadata) ?? {
          nombre: `${candidate.firstName} ${candidate.lastName}`.trim(),
          email: candidate.email ?? user.email,
          telefono: candidate.phone ?? undefined,
          ciudad: candidate.city ?? undefined,
        };
        const profileCompleteness = calculateProfileCompleteness(commercialProfile);
        const hasCv = Boolean(
          (candidate.metadata as { cvFileName?: string } | null)?.cvFileName ||
            (commercialProfile.historialLaboral?.length ?? 0) > 0,
        );

        return Response.json({
          greeting: user.firstName,
          profileCompleteness,
          profileGaps: getProfileGaps(commercialProfile, hasCv),
          stats: {
            vacantesRecomendadas: 3,
            aplicacionesActivas: 0,
            entrevistasProximas: 0,
            hasCv,
          },
          nextSteps: buildNextSteps(commercialProfile, hasCv),
        });
      }

      const cacheKey = portalDashboardCacheKey(candidate.id);
      const cached = portalServerCacheGet<Record<string, unknown>>(cacheKey);
      if (cached) {
        return Response.json(cached);
      }

      const commercialProfile = commercialProfileFromMetadata(candidate.metadata) ?? {
        nombre: `${candidate.firstName} ${candidate.lastName}`.trim(),
        email: candidate.email ?? user.email,
        telefono: candidate.phone ?? undefined,
        ciudad: candidate.city ?? undefined,
      };

      const profileCompleteness = calculateProfileCompleteness(commercialProfile);
      const hasCv = Boolean(cvSummaryFromMetadata(candidate.metadata) ?? candidate.cvText?.trim());

      const [aplicacionesActivas, entrevistasProximas, vacantes] = await Promise.all([
        prisma.candidateVacancy.count({
          where: {
            candidateId: candidate.id,
            rejectedAt: null,
            stage: { notIn: ['HIRED', 'REJECTED', 'WITHDRAWN'] },
          },
        }),
        prisma.interview
          .count({
            where: {
              candidateId: candidate.id,
              status: 'SCHEDULED',
              scheduledAt: { gte: new Date() },
            },
          })
          .catch((error) => {
            console.error('[portal/dashboard] interview count failed:', error);
            return 0;
          }),
        loadPortalVacantes(user, candidate),
      ]);

      const vacantesRecomendadas = countRecommendedVacantes(vacantes);
      const profileGaps = getProfileGaps(commercialProfile, hasCv);

      const payload = {
        greeting: user.firstName,
        profileCompleteness,
        profileGaps,
        stats: {
          vacantesRecomendadas,
          aplicacionesActivas,
          entrevistasProximas,
          hasCv,
        },
        nextSteps: buildNextSteps(commercialProfile, hasCv),
      };
      portalServerCacheSet(cacheKey, payload);
      return Response.json(payload);
    },
    'portal/dashboard',
  );
}
