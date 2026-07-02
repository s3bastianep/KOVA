'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('kova_access_token');
    if (!token) router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--kova-surface)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-5 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
