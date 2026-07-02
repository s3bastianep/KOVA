'use client';

import { cn } from '@/lib/utils';

export type TabItem = { id: string; label: string; count?: number };

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b pb-px" style={{ borderColor: 'var(--kova-border)' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            active === tab.id
              ? 'border-[var(--kova-blue)] text-[var(--kova-navy)]'
              : 'border-transparent text-slate-500 hover:text-slate-700',
          )}
        >
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-100">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
