'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-white" style={{ borderColor: 'var(--kova-border)' }}>
      <div className="h-16 flex items-center gap-3 px-5 border-b" style={{ borderColor: 'var(--kova-border)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm" style={{ background: 'var(--kova-blue)' }}>
          K
        </div>
        <div>
          <p className="font-heading font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Kova Talent OS</p>
          <p className="text-[10px] text-slate-500">Reclutamiento comercial</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'text-white' : 'text-slate-600 hover:bg-slate-50',
              )}
              style={active ? { background: 'var(--kova-navy)' } : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
