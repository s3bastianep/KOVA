import { NextRequest } from 'next/server';
import type { Candidate } from '@prisma/client';
import { requireCandidateUser } from './candidate-auth';
import type { AuthUser } from './auth';

type PortalContext = { user: AuthUser; candidate: Candidate };

export async function handlePortalRoute(
  req: NextRequest,
  handler: (ctx: PortalContext) => Promise<Response>,
  label = 'portal',
) {
  try {
    const auth = await requireCandidateUser(req);
    if (auth instanceof Response) return auth;
    return await handler(auth);
  } catch (error) {
    console.error(`[${label}]`, error);
    return Response.json(
      { message: 'No pudimos cargar esta sección. Intenta de nuevo en unos segundos.' },
      { status: 500 },
    );
  }
}
