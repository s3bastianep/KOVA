'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { portalApi, type PortalDashboard, type PortalPerfilResponse } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingStep } from '@/lib/portal-onboarding';
import { PortalDashboardHome } from '@/components/portal/PortalDashboardHome';
import { PortalOnboardingFlow } from '@/components/portal/onboarding/PortalOnboardingFlow';

function readCachedHome() {
  const perfil = portalCacheGet<PortalPerfilResponse>(PORTAL_CACHE_KEYS.perfil);
  const dashboard = portalCacheGet<PortalDashboard>(PORTAL_CACHE_KEYS.dashboard);
  return { perfil, dashboard };
}

export default function PortalDashboardPage() {
  const initial = readCachedHome();
  const [data, setData] = useState<PortalDashboard | null>(initial.dashboard ?? null);
  const [profile, setProfile] = useState<CommercialProfile | null>(
    () => (initial.perfil?.profile as CommercialProfile) ?? null,
  );
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(
    () => (initial.perfil?.onboardingStep as OnboardingStep) ?? 'welcome',
  );
  const [onboardingSubStep, setOnboardingSubStep] = useState(
    () => initial.perfil?.onboardingSubStep ?? 0,
  );
  const [onboardingReviewed, setOnboardingReviewed] = useState<string[]>(
    () => initial.perfil?.onboardingReviewed ?? [],
  );
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => Boolean(initial.perfil?.onboardingComplete),
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!initial.perfil);

  const load = useCallback((showSpinner = false) => {
    if (showSpinner) setLoading(true);
    Promise.all([portalApi.perfil(), portalApi.dashboard().catch(() => null)])
      .then(([perfil, dashboard]) => {
        setProfile(perfil.profile as CommercialProfile);
        setOnboardingComplete(Boolean(perfil.onboardingComplete));
        setOnboardingStep((perfil.onboardingStep as OnboardingStep) ?? 'welcome');
        setOnboardingSubStep(perfil.onboardingSubStep ?? 0);
        setOnboardingReviewed(perfil.onboardingReviewed ?? []);
        if (dashboard) setData(dashboard);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kova_portal_onboarding_complete', 'true');
    }
    load(true);
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Cargando tu espacio...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center">
        <p className="text-[var(--kova-muted)]">{error}</p>
      </div>
    );
  }

  if (!onboardingComplete && profile) {
    return (
      <PortalOnboardingFlow
        initialProfile={profile}
        initialStep={onboardingStep === 'done' ? 'complete' : onboardingStep}
        initialSubStep={onboardingSubStep}
        initialReviewed={onboardingReviewed}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (!data) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center">
        <p className="text-[var(--kova-muted)]">{error || 'No pudimos cargar el dashboard'}</p>
      </div>
    );
  }

  return <PortalDashboardHome data={data} />;
}
