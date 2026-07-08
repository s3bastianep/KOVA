import { NextRequest } from 'next/server';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  cvSummaryFromMetadata,
  mergeCommercialProfile,
  persistPortalOnboarding,
  persistPortalProfile,
  profileFromCandidate,
} from '@/lib/portal-profile';
import { isMockMode, updateMockPortalProfile } from '@/lib/mock';
import { handlePortalRoute } from '@/lib/portal-api';
import { isOnboardingComplete, readOnboardingMeta, resolveOnboardingStep } from '@/lib/portal-onboarding';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ candidate }) => {
      if (isMockMode()) {
        const profile = profileFromCandidate(candidate);
        const meta = readOnboardingMeta(candidate.metadata);
        const cv = cvSummaryFromMetadata(candidate.metadata);
        return Response.json({
          candidateId: candidate.id,
          profile,
          cv,
          onboardingStep: resolveOnboardingStep(meta, Boolean(cv)),
          onboardingComplete: isOnboardingComplete(meta),
          profileStatus: meta.profileStatus ?? 'account_only',
        });
      }

      const meta = readOnboardingMeta(candidate.metadata);
      const cv = cvSummaryFromMetadata(candidate.metadata);

      return Response.json({
        candidateId: candidate.id,
        profile: profileFromCandidate(candidate),
        cv,
        onboardingStep: resolveOnboardingStep(meta, Boolean(cv)),
        onboardingComplete: isOnboardingComplete(meta),
        profileStatus: meta.profileStatus ?? 'account_only',
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
      const patch = (body.profile ?? {}) as Partial<CommercialProfile>;
      const onboardingStep = body.onboardingStep as string | undefined;
      const completeOnboarding = Boolean(body.completeOnboarding);

      if (isMockMode()) {
        const current = profileFromCandidate(candidate);
        const merged = mergeCommercialProfile(current, patch);
        updateMockPortalProfile(user.id, merged, {
          onboardingStep: completeOnboarding
            ? 'done'
            : (onboardingStep as import('@/lib/registro-session').OnboardingStep | undefined),
          profileStatus: completeOnboarding ? 'complete' : onboardingStep ? 'in_progress' : undefined,
        });
        return Response.json({
          ok: true,
          profile: merged,
          message: 'Perfil actualizado.',
          onboardingComplete: completeOnboarding,
          onboardingStep: completeOnboarding ? 'done' : onboardingStep,
        });
      }

      if (completeOnboarding) {
        const profile = await persistPortalOnboarding(user.tenantId, candidate.id, {
          profile: patch,
          onboardingStep: 'done',
          profileStatus: 'complete',
        });
        return Response.json({
          ok: true,
          profile,
          message: '¡Perfil completado!',
          onboardingComplete: true,
          onboardingStep: 'done',
        });
      }

      if (onboardingStep) {
        const profile = await persistPortalOnboarding(user.tenantId, candidate.id, {
          profile: Object.keys(patch).length > 0 ? patch : undefined,
          onboardingStep: onboardingStep as import('@/lib/registro-session').OnboardingStep,
          profileStatus: 'in_progress',
        });
        return Response.json({
          ok: true,
          profile,
          message: 'Progreso guardado.',
          onboardingStep,
        });
      }

      const current = profileFromCandidate(candidate);
      const merged = mergeCommercialProfile(current, patch);

      if (!merged.nombre?.trim() || !merged.email?.trim() || !merged.telefono?.trim()) {
        return Response.json({ message: 'Nombre, correo y teléfono son obligatorios.' }, { status: 400 });
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
