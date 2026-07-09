'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Sparkles } from 'lucide-react';
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
    router.push('/acceso');
  };

  return (
    <aside className="kova-sidebar relative z-20 hidden h-full w-[268px] min-w-[268px] max-w-[268px] shrink-0 flex-col overflow-hidden border-r lg:flex">
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="kova-sidebar-logo-mark" aria-hidden>
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="kova-sidebar-brand font-heading font-bold text-[15px] leading-tight">
            Kova Talent OS
          </p>
          <p className="kova-sidebar-brand-sub text-[11px] mt-0.5">Reclutamiento comercial</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="kova-sidebar-section-label px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em]">
          Navegación
        </p>
        <div className="space-y-1">
          {NAV_MAIN.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                prefetch
                className={cn('kova-nav-item', active && 'kova-nav-item-active')}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>

        <p className="kova-sidebar-section-label px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-[0.14em]">
          Acceso rápido
        </p>
        <Link
          href="/procesos/nuevo"
          className="kova-sidebar-quick group flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all duration-200"
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="kova-sidebar-quick-title text-sm font-semibold">Nuevo proceso</p>
            <p className="kova-sidebar-quick-sub text-[11px]">Abrir solicitud de búsqueda</p>
          </div>
        </Link>
      </nav>

      <div className="kova-sidebar-footer p-3 mx-3 mb-4 rounded-2xl border">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
