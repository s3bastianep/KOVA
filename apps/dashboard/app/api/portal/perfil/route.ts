import { NextRequest } from 'next/server';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { requireCandidateUser } from '@/lib/candidate-auth';
import {
  cvSummaryFromMetadata,
  mergeCommercialProfile,
  persistPortalProfile,
  profileFromCandidate,
} from '@/lib/portal-profile';
import { isMockMode } from '@/lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireCandidateUser(req);
  if (auth instanceof Response) return auth;

  const { candidate } = auth;

  if (isMockMode()) {
    return Response.json({
      candidateId: candidate.id,
      profile: {
        nombre: 'María López',
        email: 'maria@correo.com',
        telefono: '+57 300 000 0000',
        ciudad: 'Bogotá',
        consentimientoDatos: true,
      } satisfies CommercialProfile,
      cv: null,
    });
  }

  return Response.json({
    candidateId: candidate.id,
    profile: profileFromCandidate(candidate),
    cv: cvSummaryFromMetadata(candidate.metadata),
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireCandidateUser(req);
  if (auth instanceof Response) return auth;

  const body = await req.json().catch(() => ({}));
  const patch = (body.profile ?? body) as Partial<CommercialProfile>;

  if (isMockMode()) {
    return Response.json({
      ok: true,
      profile: patch,
      message: 'Perfil actualizado.',
    });
  }

  const current = profileFromCandidate(auth.candidate);
  const merged = mergeCommercialProfile(current, patch);

  if (!merged.nombre?.trim() || !merged.email?.trim() || !merged.telefono?.trim() || !merged.ciudad?.trim()) {
    return Response.json({ message: 'Nombre, correo, teléfono y ciudad son obligatorios.' }, { status: 400 });
  }

  if (!/.+@.+\..+/.test(merged.email)) {
    return Response.json({ message: 'Correo electrónico no válido.' }, { status: 400 });
  }

  const profile = await persistPortalProfile(auth.user.tenantId, auth.candidate.id, merged);

  return Response.json({
    ok: true,
    profile,
    message: 'Perfil actualizado.',
  });
}
