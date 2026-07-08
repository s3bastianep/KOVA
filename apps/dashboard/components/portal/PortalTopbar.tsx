'use client';

import { useEffect, useState } from 'react';
import { getStoredUser } from '@/lib/api';

export function PortalTopbar() {
  const [name, setName] = useState('Candidato');

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      const full = `${user.firstName} ${user.lastName}`.trim();
      if (full) setName(full);
    }
  }, []);

  return (
    <header className="kova-topbar sticky top-0 z-10 border-b px-5 lg:px-8 py-4 flex items-center justify-between gap-4 bg-[var(--kova-panel)]">
      <div className="min-w-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
          Portal candidato
        </p>
        <p className="font-heading font-semibold text-[15px] truncate">{name}</p>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--kova-muted)]">
        <span className="w-2 h-2 rounded-full bg-[var(--kova-lime)]" aria-hidden />
        Cuenta activa
      </div>
    </header>
  );
}
