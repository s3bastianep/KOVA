import { NextRequest } from 'next/server';
import { stageLabel } from '@/lib/stages';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import { handlePortalRoute } from '@/lib/portal-api';
import {
  portalAplicacionesCacheKey,
  portalServerCacheGet,
  portalServerCacheSet,
} from '@/lib/portal-server-cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ candidate }) => {
      if (isMockMode()) {
        return Response.json({
          aplicaciones: [
            {
              id: 'mock-app-1',
              vacancyId: 'seed-vacancy-001',
              title: 'Ejecutivo Comercial B2B',
              companyName: 'TechSales Colombia SAS',
              city: 'Bogotá',
              stage: 'SCREENING',
              stageLabel: stageLabel('SCREENING'),
              compatibility: 86,
              appliedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              rejected: false,
            },
          ],
          total: 1,
        });
      }

      const cacheKey = portalAplicacionesCacheKey(candidate.id);
      const cached = portalServerCacheGet<{ aplicaciones: unknown[]; total: number }>(cacheKey);
      if (cached) {
        return Response.json(cached);
      }

      const rows = await prisma.candidateVacancy.findMany({
        where: { candidateId: candidate.id },
        select: {
          id: true,
          stage: true,
          score: true,
          createdAt: true,
          updatedAt: true,
          rejectedAt: true,
          rejectReason: true,
          vacancy: {
            select: {
              id: true,
              title: true,
              city: true,
              status: true,
              company: { select: { name: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const aplicaciones = rows.map((row) => ({
        id: row.id,
        vacancyId: row.vacancy.id,
        title: row.vacancy.title,
        companyName: row.vacancy.company.name,
        city: row.vacancy.city,
        vacancyStatus: row.vacancy.status,
        stage: row.stage,
        stageLabel: stageLabel(row.stage),
        compatibility: row.score ?? 0,
        appliedAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        rejected: Boolean(row.rejectedAt) || row.stage === 'REJECTED' || row.stage === 'WITHDRAWN',
        rejectReason: row.rejectReason,
      }));

      const payload = { aplicaciones, total: aplicaciones.length };
      portalServerCacheSet(cacheKey, payload);
      return Response.json(payload);
    },
    'portal/aplicaciones',
  );
}
