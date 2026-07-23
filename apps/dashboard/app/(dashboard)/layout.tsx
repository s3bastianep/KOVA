'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { authApi, clearSession, getStoredUser } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await authApi.me();
        if (cancelled) return;
        if (user.role === 'CANDIDATE') {
          router.replace('/portal');
          return;
        }
      } catch {
        if (cancelled) return;
        clearSession();
        router.replace('/acceso');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Soft gate while me() runs: keep shell if we already have a cached staff user.
  const cached = getStoredUser();
  if (cached?.role === 'CANDIDATE') return null;

  return (
    <div className="flex h-screen overflow-hidden kova-shell-bg">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col kova-main-panel">
        <Topbar />
        <main className="portal-main-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-[1440px] p-5 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
