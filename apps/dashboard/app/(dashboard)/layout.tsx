'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('kova_access_token');
    if (!token) router.replace('/acceso');
  }, [router]);

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
