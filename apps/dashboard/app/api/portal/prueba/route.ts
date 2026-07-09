import { NextRequest } from 'next/server';
import type { RiskJarResult } from '@/lib/risk-jar-game';
import { jarTestStatus, persistJarTest, readJarTest } from '@/lib/jar-test-store';
import { handlePortalRoute } from '@/lib/portal-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ candidate }) => {
      const status = jarTestStatus(candidate.metadata);
      const record = readJarTest(candidate.metadata);
      return Response.json({
        ...status,
        result: record?.result ?? null,
      });
    },
    'portal/prueba',
  );
}

export async function POST(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const existing = jarTestStatus(candidate.metadata);
      if (existing.completed) {
        return Response.json(
          { message: 'Ya completaste esta actividad.', ...existing },
          { status: 409 },
        );
      }

      const body = await req.json().catch(() => ({}));
      const result = body.result as RiskJarResult | undefined;
      if (!result || typeof result.totalSecured !== 'number') {
        return Response.json({ message: 'Resultado inválido.' }, { status: 400 });
      }

      const record = await persistJarTest(user.tenantId, candidate.id, user.id, result);
      return Response.json({
        ok: true,
        completed: true,
        completedAt: record.completedAt,
        totalPoints: record.totalPoints,
      });
    },
    'portal/prueba',
  );
}
