import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { readRegistroMetadata } from '../../../../lib/registro-session';
import { getPublicTenantId } from '../../../../lib/public-tenant';
import { prisma } from '../../../../lib/prisma';
import { isMockMode } from '../../../../lib/mock';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('registro/resume', handleGET);

async function handleGET(req: NextRequest) {
  const candidateId = String(req.nextUrl.searchParams.get('candidateId') ?? '').trim();
  const resumeToken = String(req.nextUrl.searchParams.get('token') ?? '').trim();

  if (!candidateId || !resumeToken) {
    return Response.json({ message: 'Sesión de registro inválida.' }, { status: 400 });
  }

  if (isMockMode()) {
    return Response.json({
      ok: true,
      candidateId,
      profile: {},
      step: 0,
      profileStatus: 'in_progress',
      accountCreated: true,
    });
  }

  const tenantId = await getPublicTenantId();
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { id: true, metadata: true, email: true },
  });

  if (!candidate) {
    return Response.json({ message: 'No encontramos tu registro.' }, { status: 404 });
  }

  const meta = readRegistroMetadata(candidate.metadata);
  if (!meta.resumeToken || meta.resumeToken !== resumeToken) {
    return Response.json({ message: 'No pudimos validar tu sesión.' }, { status: 403 });
  }

  return Response.json({
    ok: true,
    candidateId: candidate.id,
    profile: meta.commercialProfile ?? {},
    step: typeof meta.registroStep === 'number' ? meta.registroStep : 0,
    profileStatus: meta.profileStatus ?? 'in_progress',
    accountCreated: Boolean(meta.accountCreatedAt),
  });
}
