import { NextRequest } from 'next/server';
import { handlePortalRoute } from '@/lib/portal-api';
import { filterVacantesByMinMatch, loadPortalVacantes } from '@/lib/portal-vacantes-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const minMatch = Math.max(0, Math.min(100, Number(req.nextUrl.searchParams.get('minMatch') ?? 0)));
      const vacantes = await loadPortalVacantes(user, candidate);
      const filtered = filterVacantesByMinMatch(vacantes, minMatch);
      return Response.json({ vacantes: filtered, total: filtered.length });
    },
    'portal/vacantes',
  );
}
