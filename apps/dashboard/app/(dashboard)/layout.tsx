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
    <div className="min-h-screen flex kova-shell-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 kova-main-panel">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="p-5 lg:p-8 max-w-[1440px] mx-auto w-full kova-animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
