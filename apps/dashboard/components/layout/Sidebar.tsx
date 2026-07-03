'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-white/80 backdrop-blur-sm" style={{ borderColor: 'var(--kova-border)' }}>
      <div className="h-16 flex items-center gap-3 px-5 border-b" style={{ borderColor: 'var(--kova-border)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm shadow-sm"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
        >
          K
        </div>
        <div>
          <p className="font-heading font-bold text-sm leading-tight" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</p>
          <p className="text-[10px] text-slate-400">Reclutamiento comercial</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Menú</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-800',
              )}
              style={active ? { background: 'linear-gradient(135deg, var(--kova-navy), var(--kova-blue))' } : undefined}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white/80" />}
              <Icon className={cn('w-4 h-4 shrink-0 transition-transform', !active && 'group-hover:scale-110')} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: 'var(--kova-border)' }}>
        <div className="rounded-xl p-3 text-white overflow-hidden relative" style={{ background: 'linear-gradient(135deg, var(--kova-navy), var(--kova-blue))' }}>
          <p className="text-xs font-semibold">KOVA Talent OS</p>
          <p className="text-[10px] text-white/60 mt-0.5">v1.0 · Reclutamiento con IA</p>
        </div>
      </div>
    </aside>
  );
}
