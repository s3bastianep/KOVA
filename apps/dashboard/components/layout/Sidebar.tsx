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
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex w-[268px] shrink-0 flex-col border-r backdrop-blur-xl relative z-20" style={{ borderColor: 'var(--kova-border)', background: 'rgba(246, 247, 242, 0.92)' }}>
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-base"
          style={{
            background: 'linear-gradient(135deg, var(--kova-blue) 0%, var(--kova-blue-mid) 100%)',
            boxShadow: '0 10px 24px -8px rgba(51, 65, 196, 0.45)',
          }}
        >
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-[15px] leading-tight" style={{ color: 'var(--kova-navy)' }}>
            Kova Talent OS
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--kova-navy-muted)' }}>Reclutamiento comercial</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--kv-nav-muted)' }}>
          Navegación
        </p>
        <div className="space-y-1">
          {NAV_MAIN.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn('kova-nav-item', active && 'kova-nav-item-active pl-4')}
              >
                <Icon className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-[var(--kova-blue)]' : 'text-[var(--kv-nav-muted)]')} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>

        <p className="px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--kv-nav-muted)' }}>
          Acceso rápido
        </p>
        <Link
          href="/procesos/nuevo"
          className="group flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all duration-200 hover:shadow-md"
          style={{
            borderColor: 'rgba(51, 65, 196, 0.15)',
            background: 'linear-gradient(135deg, rgba(51, 65, 196, 0.06), rgba(216, 242, 76, 0.08))',
          }}
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'var(--kova-lime)', color: 'var(--kova-navy)', boxShadow: '0 6px 16px -6px rgba(92, 110, 18, 0.35)' }}
          >
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>Nuevo proceso</p>
            <p className="text-[11px]" style={{ color: 'var(--kova-navy-muted)' }}>Abrir solicitud de búsqueda</p>
          </div>
        </Link>
      </nav>

      <div className="p-3 mx-3 mb-4 rounded-2xl border" style={{ borderColor: 'var(--kova-border)', background: 'var(--kova-surface)' }}>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: 'var(--kova-navy-muted)' }}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
