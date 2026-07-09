'use client';

import { useEffect, useMemo, useState } from 'react';
import { getStoredUser } from '@/lib/api';

function toTitleCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/(^|[\s('-])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function PortalTopbar() {
  const [name, setName] = useState('Candidato');

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      const full = `${user.firstName} ${user.lastName}`.trim();
      if (full) setName(full);
    }
  }, []);

  const displayName = useMemo(() => toTitleCase(name), [name]);
  const initials = useMemo(() => initialsFromName(displayName), [displayName]);

  return (
    <header className="kova-topbar sticky top-0 z-10 border-b border-[var(--kova-border)] bg-white">
      <div className="flex items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-xs font-bold tracking-tight"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 border-l border-[var(--kova-border)] pl-3">
            <p className="kova-portal-eyebrow">Portal candidato</p>
            <p className="truncate font-heading text-[15px] font-bold leading-snug tracking-[-0.025em] text-[var(--kova-navy)]">
              {displayName}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--kova-navy-muted)]" aria-hidden />
          <span className="text-xs font-medium text-[var(--kova-navy-muted)]">Sesión activa</span>
        </div>
      </div>
    </header>
  );
}
