'use client';

import { getStoredUser, clearSession, authApi } from '@/lib/api';
import { Bell, LogOut, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();
  const user = getStoredUser();

  const logout = async () => {
    const refresh = localStorage.getItem('kova_refresh_token') ?? undefined;
    try { await authApi.logout(refresh); } catch { /* ignore */ }
    clearSession();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-5 lg:px-8" style={{ borderColor: 'var(--kova-border)' }}>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          placeholder="Buscar empresas, vacantes, candidatos..."
          className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="relative p-2 rounded-lg hover:bg-slate-50">
          <Bell className="w-4 h-4 text-slate-500" />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>
            {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
          </p>
          <p className="text-xs text-slate-500">{user?.role?.replace('_', ' ')}</p>
        </div>
        <button type="button" onClick={logout} className="p-2 rounded-lg hover:bg-slate-50" title="Cerrar sesión">
          <LogOut className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
