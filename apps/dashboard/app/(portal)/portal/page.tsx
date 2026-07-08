'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { portalApi, type PortalDashboard } from '@/lib/api';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingStep } from '@/lib/portal-onboarding';
import { PortalDashboardHome } from '@/components/portal/PortalDashboardHome';
import { PortalOnboardingFlow } from '@/components/portal/onboarding/PortalOnboardingFlow';

export default function PortalDashboardPage() {
  const [data, setData] = useState<PortalDashboard | null>(null);
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([portalApi.perfil(), portalApi.dashboard().catch(() => null)])
      .then(([perfil, dashboard]) => {
        setProfile(perfil.profile as CommercialProfile);
        setOnboardingComplete(Boolean(perfil.onboardingComplete));
        setOnboardingStep((perfil.onboardingStep as OnboardingStep) ?? 'welcome');
        if (dashboard) setData(dashboard);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    load();
  };

  if (loading) {
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
        initialStep={onboardingStep === 'done' ? 'questions' : onboardingStep}
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
