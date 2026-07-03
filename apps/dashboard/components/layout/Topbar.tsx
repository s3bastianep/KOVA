'use client';

import { getStoredUser, clearSession, authApi } from '@/lib/api';
import { Bell, LogOut, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();
  const user = getStoredUser();

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'U';

  const logout = async () => {
    const refresh = localStorage.getItem('kova_refresh_token') ?? undefined;
    try { await authApi.logout(refresh); } catch { /* ignore */ }
    clearSession();
    router.push('/login');
  };

  return (
    <header
      className="h-16 border-b bg-white/70 backdrop-blur-md flex items-center justify-between px-5 lg:px-8 sticky top-0 z-30"
      style={{ borderColor: 'var(--kova-border)' }}
    >
      <div className="flex items-center gap-2.5 flex-1 max-w-md rounded-full bg-slate-100/80 px-4 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          placeholder="Buscar empresas, vacantes, candidatos..."
          className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <button type="button" className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full ring-2 ring-white" style={{ background: 'var(--kova-coral)' }} />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--kova-navy)' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
            </p>
            <p className="text-[11px] text-slate-400 capitalize">{user?.role?.replace('_', ' ').toLowerCase() ?? 'Consultor'}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
          >
            {initials}
          </div>
        </div>

        <button type="button" onClick={logout} className="p-2.5 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors" title="Cerrar sesión">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
