'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronRight, Star } from 'lucide-react';
import { NAV_MAIN } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-white" style={{ borderColor: 'var(--kova-border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-heading font-bold text-base shadow-sm"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' }}
        >
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm leading-tight" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</p>
          <p className="text-[10px] text-slate-400">Reclutamiento comercial</p>
        </div>
        <button type="button" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors">
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Menú</p>
        <div className="space-y-1">
          {NAV_MAIN.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-800',
                )}
                style={active ? { background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' } : undefined}
              >
                {active && <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full" style={{ background: 'var(--kova-blue)' }} />}
                <Icon className={cn('w-[18px] h-[18px] shrink-0 transition-transform', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110')} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bloques inferiores */}
      <div className="p-3 space-y-2.5">
        {/* Accesos rápidos */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors hover:bg-slate-50"
          style={{ borderColor: 'var(--kova-border)' }}
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
            <Star className="w-4 h-4" />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="block text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>Accesos rápidos</span>
            <span className="block text-[10px] text-slate-400">Tus accesos más usados</span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        </button>

        {/* Actividades hoy */}
        <div className="px-3 py-2.5 rounded-xl border" style={{ borderColor: 'var(--kova-border)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>Actividades hoy</span>
            <span className="text-xs font-bold" style={{ color: 'var(--kova-blue)' }}>6/12</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '50%', background: 'linear-gradient(90deg, var(--kova-blue), #6D5BE3)' }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">50% completado</p>
        </div>

        {/* Tarjeta versión */}
        <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #101B3D, #1A2A5E)' }}>
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/5" />
          <div className="flex items-center gap-2.5 relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0" style={{ background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' }}>
              K
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold">KOVA Talent OS</p>
              <p className="text-[10px] text-white/60">v1.0 · Reclutamiento comercial</p>
            </div>
          </div>
          <p className="text-[10px] text-white/70 mt-2.5 flex items-center gap-1.5 relative">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--kova-green)' }} /> Sistema operativo
          </p>
          <button type="button" className="mt-3 w-full flex items-center gap-2 text-[11px] text-white/70 hover:text-white pt-3 border-t border-white/10 transition-colors relative">
            <ChevronsLeft className="w-3.5 h-3.5" /> Ocultar menú
          </button>
        </div>
      </div>
    </aside>
  );
}
