'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import {
  PortalOnboardingProvider,
  usePortalOnboarding,
} from '@/components/portal/PortalOnboardingProvider';
import { authApi, clearSession, portalApi } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = usePortalOnboarding();
  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    let cancelled = false;
    (async () => {
      try {
        const user = await authApi.me();
        if (cancelled) return;
        if (user.role !== 'CANDIDATE') {
          router.replace('/dashboard');
          return;
        }
      } catch {
        if (cancelled) return;
        clearSession();
        router.replace('/login');
        return;
      }

      const prefetchLater = () => {
        if (!portalCacheGet(PORTAL_CACHE_KEYS.vacantes(0))) {
          void portalApi.vacantes().catch(() => {});
        }
        if (!portalCacheGet(PORTAL_CACHE_KEYS.aplicaciones)) {
          void portalApi.aplicaciones().catch(() => {});
        }
      };
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (
          window as Window & {
            requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
          }
        ).requestIdleCallback(() => prefetchLater(), { timeout: 4000 });
      } else {
        setTimeout(prefetchLater, 2000);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (status === 'incomplete' && pathname !== '/portal') {
      router.replace('/portal');
    }
  }, [status, pathname, router]);

  // Skip chrome while resolving session / during onboarding — faster first paint after signup.
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center kova-shell-bg text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" aria-hidden />
        Entrando a tu perfil…
      </div>
    );
  }

  if (status === 'incomplete') {
    return <div className="min-h-screen kova-shell-bg">{children}</div>;
  }

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

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalOnboardingProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </PortalOnboardingProvider>
  );
}
