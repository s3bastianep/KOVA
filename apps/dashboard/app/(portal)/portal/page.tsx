'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { portalApi, type PortalDashboard } from '@/lib/api';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { calculateProfileCompleteness } from '@/lib/commercial-profile-builder';
import type { OnboardingStep } from '@/lib/portal-onboarding';
import { nextIncompleteOnboardingStep } from '@/lib/portal-onboarding-unified';
import { PortalDashboardHome } from '@/components/portal/PortalDashboardHome';
import { PortalOnboardingFlow } from '@/components/portal/onboarding/PortalOnboardingFlow';
import { usePortalOnboarding } from '@/components/portal/PortalOnboardingProvider';

export default function PortalDashboardPage() {
  const { status, perfil, markComplete, refresh } = usePortalOnboarding();
  const [data, setData] = useState<PortalDashboard | null>(null);
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const dashboard = await portalApi.dashboard();
      setData(dashboard);
      setDashboardError('');
    } catch (err) {
      setDashboardError(err instanceof Error ? err.message : 'Error al cargar');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const profile = perfil?.profile as CommercialProfile | undefined;
  const profileCompleteness = profile ? calculateProfileCompleteness(profile) : 0;
  const mustFinishProfile = status === 'complete' && profileCompleteness < 100;

  useEffect(() => {
    if (status !== 'complete' || mustFinishProfile) return;
    void loadDashboard();
  }, [status, mustFinishProfile, loadDashboard]);

  const handleOnboardingComplete = () => {
    markComplete();
    void refresh().then(() => loadDashboard());
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Cargando tu espacio...
      </div>
    );
  }

  if (status === 'incomplete' || mustFinishProfile) {
    if (!perfil?.profile || !profile) {
      return (
        <div className="kova-card rounded-2xl border p-8 text-center">
          <p className="text-[var(--kova-muted)]">No pudimos cargar tu perfil.</p>
          <button
            type="button"
            className="mt-4 text-sm font-medium text-[var(--kova-navy)] underline"
            onClick={() => void refresh()}
          >
            Reintentar
          </button>
        </div>
      );
    }

    const onboardingStep = mustFinishProfile
      ? nextIncompleteOnboardingStep(profile)
      : ((perfil.onboardingStep as OnboardingStep) ?? 'welcome');

    return (
      <PortalOnboardingFlow
        initialProfile={profile}
        initialStep={onboardingStep === 'done' ? 'complete' : onboardingStep}
        initialSubStep={perfil.onboardingSubStep ?? 0}
        initialReviewed={perfil.onboardingReviewed ?? []}
        onComplete={handleOnboardingComplete}
        onProgressSaved={() => void refresh()}
      />
    );
  }

  if (dashboardLoading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Cargando tu espacio...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center">
        <p className="text-[var(--kova-muted)]">{dashboardError || 'No pudimos cargar el dashboard'}</p>
      </div>
    );
  }

  return <PortalDashboardHome data={data} />;
}
