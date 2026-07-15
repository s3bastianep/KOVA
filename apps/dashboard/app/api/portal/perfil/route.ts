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
import { invalidatePortalCandidateCaches } from '@/lib/portal-server-cache';
import { invalidateCandidateAuthCache } from '@/lib/candidate-auth';
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
          onboardingSubStep: meta.onboardingSubStep ?? 0,
          onboardingReviewed: meta.onboardingReviewed ?? [],
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
        onboardingSubStep: meta.onboardingSubStep ?? 0,
        onboardingReviewed: meta.onboardingReviewed ?? [],
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
      const onboardingSubStep =
        typeof body.onboardingSubStep === 'number' ? body.onboardingSubStep : undefined;
      const onboardingReviewed = Array.isArray(body.onboardingReviewed)
        ? (body.onboardingReviewed as string[])
        : undefined;
      const completeOnboarding = Boolean(body.completeOnboarding);

      const invalidateCaches = () => {
        invalidatePortalCandidateCaches(candidate.id);
        // Also drop the 60s candidate-by-user cache (lib/candidate-auth.ts) — otherwise a GET
        // right after this PATCH can still serve the pre-write profile for up to a minute.
        invalidateCandidateAuthCache(user.id);
      };

      const existingMeta = readOnboardingMeta(candidate.metadata);
      const alreadyComplete = isOnboardingComplete(existingMeta);

      if (isMockMode()) {
        const current = profileFromCandidate(candidate);
        const merged = mergeCommercialProfile(current, patch);
        // Never let a mid-flow autosave downgrade a finished onboarding back to in_progress —
        // that is what sent users through the whole form again after they had reached the dashboard.
        const keepComplete = alreadyComplete && !completeOnboarding;
        updateMockPortalProfile(user.id, merged, {
          onboardingStep: completeOnboarding
            ? 'done'
            : keepComplete
              ? 'done'
              : (onboardingStep as import('@/lib/registro-session').OnboardingStep | undefined),
          profileStatus: completeOnboarding || keepComplete
            ? 'complete'
            : onboardingStep
              ? 'in_progress'
              : undefined,
        });
        invalidateCaches();
        return Response.json({
          ok: true,
          profile: merged,
          message: 'Perfil actualizado.',
          onboardingComplete: completeOnboarding || keepComplete,
          onboardingStep: completeOnboarding || keepComplete ? 'done' : onboardingStep,
        });
      }

      if (completeOnboarding) {
        const profile = await persistPortalOnboarding(user.tenantId, candidate.id, {
          profile: patch,
          onboardingStep: 'done',
          profileStatus: 'complete',
        });
        invalidateCaches();
        return Response.json({
          ok: true,
          profile,
          message: '¡Perfil completado!',
          onboardingComplete: true,
          onboardingStep: 'done',
        });
      }

      if (onboardingStep) {
        // Profile edits after finishing onboarding must not reopen/reset the immersive flow.
        if (alreadyComplete) {
          const profile = await persistPortalOnboarding(user.tenantId, candidate.id, {
            profile: Object.keys(patch).length > 0 ? patch : undefined,
            onboardingStep: 'done',
            profileStatus: 'complete',
            onboardingSubStep,
            onboardingReviewed,
          });
          invalidateCaches();
          return Response.json({
            ok: true,
            profile,
            message: 'Perfil actualizado.',
            onboardingComplete: true,
            onboardingStep: 'done',
          });
        }

        const profile = await persistPortalOnboarding(user.tenantId, candidate.id, {
          profile: Object.keys(patch).length > 0 ? patch : undefined,
          onboardingStep: onboardingStep as import('@/lib/registro-session').OnboardingStep,
          onboardingSubStep,
          onboardingReviewed,
          profileStatus: 'in_progress',
        });
        invalidateCaches();
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
      invalidateCaches();

      return Response.json({
        ok: true,
        profile,
        message: 'Perfil actualizado.',
      });
    },
    'portal/perfil',
  );
}
