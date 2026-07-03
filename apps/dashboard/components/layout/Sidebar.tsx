'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { NAV_MAIN } from '@/lib/navigation';
import { clearSession, authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const refresh = localStorage.getItem('kova_refresh_token') ?? undefined;
    try { await authApi.logout(refresh); } catch { /* ignore */ }
    clearSession();
    router.push('/login');
  };

  return (
    <aside
      className="hidden lg:flex w-64 shrink-0 flex-col relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(180deg, #0E1834 0%, #111C3D 55%, #16224A 100%)' }}
    >
      {/* Glow decorativo inferior */}
      <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#6D5BE3' }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 relative">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-heading font-bold text-base shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' }}
        >
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm leading-tight text-white">Kova Talent OS</p>
          <p className="text-[10px] text-white/50">Reclutamiento comercial</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 relative">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">Navegación</p>
        <div className="space-y-1">
          {NAV_MAIN.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active ? 'text-white shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white',
                )}
                style={active ? { background: 'linear-gradient(135deg, rgba(45,91,227,0.45), rgba(109,91,227,0.35))' } : undefined}
              >
                {active && <span className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full" style={{ background: '#8B7BF0' }} />}
                <Icon className={cn('w-[18px] h-[18px] shrink-0 transition-transform', active ? 'text-[#B7AEF5]' : 'text-white/40 group-hover:text-white/80 group-hover:scale-110')} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>

        <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">Acceso directo</p>
        <Link
          href="/procesos/nuevo"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-sm font-medium text-white/80"
        >
          + Nuevo proceso
        </Link>
      </nav>

      {/* Tarjeta versión + logout */}
      <div className="p-3 relative">
        <div className="rounded-2xl p-4 relative overflow-hidden border border-white/10" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0" style={{ background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' }}>
              K
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white">KOVA Talent OS</p>
              <p className="text-[10px] text-white/50">v1.0 · Reclutamiento comercial</p>
            </div>
          </div>
          <p className="text-[10px] text-white/60 mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--kova-green)' }} /> Sistema operativo
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full flex items-center justify-between gap-2 text-[11px] text-white/70 hover:text-white pt-3 border-t border-white/10 transition-colors"
          >
            Cerrar sesión
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
