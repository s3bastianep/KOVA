import { NextRequest } from 'next/server';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  cvSummaryFromMetadata,
  mergeCommercialProfile,
  persistPortalProfile,
  profileFromCandidate,
} from '@/lib/portal-profile';
import { isMockMode } from '@/lib/mock';
import { handlePortalRoute } from '@/lib/portal-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ candidate }) => {
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
    },
    'portal/perfil',
  );
}

export async function PATCH(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const body = await req.json().catch(() => ({}));
      const patch = (body.profile ?? body) as Partial<CommercialProfile>;

      if (isMockMode()) {
        return Response.json({
          ok: true,
          profile: patch,
          message: 'Perfil actualizado.',
        });
      }

      const current = profileFromCandidate(candidate);
      const merged = mergeCommercialProfile(current, patch);

      if (!merged.nombre?.trim() || !merged.email?.trim() || !merged.telefono?.trim() || !merged.ciudad?.trim()) {
        return Response.json({ message: 'Nombre, correo, teléfono y ciudad son obligatorios.' }, { status: 400 });
      }

      if (!/.+@.+\..+/.test(merged.email)) {
        return Response.json({ message: 'Correo electrónico no válido.' }, { status: 400 });
      }

      const profile = await persistPortalProfile(user.tenantId, candidate.id, merged);

      return Response.json({
        ok: true,
        profile,
        message: 'Perfil actualizado.',
      });
    },
    'portal/perfil',
  );
}
