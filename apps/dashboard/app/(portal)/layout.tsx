'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { getStoredUser, portalApi } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';

const ONBOARDING_CACHE_KEY = 'kova_portal_onboarding_complete';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = sessionStorage.getItem(ONBOARDING_CACHE_KEY);
    return cached === null ? null : cached === 'true';
  });
  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const token = localStorage.getItem('kova_access_token');
    const user = getStoredUser();
    if (!token) {
      router.replace('/login');
      return;
    }
    if (user && user.role !== 'CANDIDATE') {
      router.replace('/dashboard');
      return;
    }

    // Precarga diferida: no compite con la página que el usuario abre primero.
    const prefetchLater = () => {
      if (!portalCacheGet(PORTAL_CACHE_KEYS.vacantes(0))) {
        void portalApi.vacantes().catch(() => {});
      }
      if (!portalCacheGet(PORTAL_CACHE_KEYS.aplicaciones)) {
        void portalApi.aplicaciones().catch(() => {});
      }
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        () => prefetchLater(),
        { timeout: 4000 },
      );
    } else {
      setTimeout(prefetchLater, 2000);
    }
  }, [router]);

  useEffect(() => {
    if (onboardingComplete !== null) return;

    const cached = portalCacheGet<{ onboardingComplete?: boolean }>(PORTAL_CACHE_KEYS.perfil);
    if (cached) {
      const complete = Boolean(cached.onboardingComplete);
      sessionStorage.setItem(ONBOARDING_CACHE_KEY, String(complete));
      setOnboardingComplete(complete);
      return;
    }

    portalApi
      .perfil()
      .then((data) => {
        const complete = Boolean(data.onboardingComplete);
        sessionStorage.setItem(ONBOARDING_CACHE_KEY, String(complete));
        setOnboardingComplete(complete);
      })
      .catch(() => {
        sessionStorage.setItem(ONBOARDING_CACHE_KEY, 'true');
        setOnboardingComplete(true);
      });
  }, [onboardingComplete]);

  useEffect(() => {
    if (onboardingComplete === false && pathname !== '/portal') {
      router.replace('/portal');
    }
  }, [onboardingComplete, pathname, router]);

  return (
    <div className="kova-portal flex h-screen overflow-hidden kova-shell-bg">
      <PortalSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col kova-main-panel">
        <PortalTopbar />
        <main className="portal-main-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-[1200px] p-5 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
