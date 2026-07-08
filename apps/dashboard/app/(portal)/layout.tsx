'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { getStoredUser } from '@/lib/api';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('kova_access_token');
    const user = getStoredUser();
    if (!token) {
      router.replace('/login');
      return;
    }
    if (user && user.role !== 'CANDIDATE') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex kova-shell-bg">
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0 kova-main-panel">
        <PortalTopbar />
        <main className="flex-1 overflow-auto">
          <div className="p-5 lg:p-8 max-w-[1200px] mx-auto w-full kova-animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
