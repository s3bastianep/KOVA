'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { portalApi, type PortalPerfilResponse } from '@/lib/api';
import { readOnboardingSession, syncOnboardingSession } from '@/lib/portal-onboarding-session';

export type PortalOnboardingStatus = 'loading' | 'incomplete' | 'complete';

type PortalOnboardingContextValue = {
  status: PortalOnboardingStatus;
  perfil: PortalPerfilResponse | null;
  refresh: () => Promise<void>;
  markComplete: () => void;
};

const PortalOnboardingContext = createContext<PortalOnboardingContextValue | null>(null);

function clearImmersiveClasses() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('portal-onboarding-active', 'portal-onboarding-immersive');
}

export function PortalOnboardingProvider({ children }: { children: React.ReactNode }) {
  const [perfil, setPerfil] = useState<PortalPerfilResponse | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await portalApi.perfilFresh();
      setPerfil(data);
      syncOnboardingSession(Boolean(data.onboardingComplete));
      if (data.onboardingComplete) clearImmersiveClasses();
    } catch {
      const session = readOnboardingSession();
      if (session === null) syncOnboardingSession(false);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    clearImmersiveClasses();
  }, []);

  const markComplete = useCallback(() => {
    syncOnboardingSession(true);
    setPerfil((prev) =>
      prev
        ? {
            ...prev,
            onboardingComplete: true,
            onboardingStep: 'done',
            profileStatus: 'complete',
          }
        : prev,
    );
    clearImmersiveClasses();
  }, []);

  const status = useMemo((): PortalOnboardingStatus => {
    if (!ready) return 'loading';
    if (!perfil?.onboardingComplete) return 'incomplete';
    return 'complete';
  }, [ready, perfil]);

  const value = useMemo(
    () => ({
      status,
      perfil,
      refresh,
      markComplete,
    }),
    [status, perfil, refresh, markComplete],
  );

  return <PortalOnboardingContext.Provider value={value}>{children}</PortalOnboardingContext.Provider>;
}

export function usePortalOnboarding() {
  const ctx = useContext(PortalOnboardingContext);
  if (!ctx) {
    throw new Error('usePortalOnboarding must be used within PortalOnboardingProvider');
  }
  return ctx;
}
