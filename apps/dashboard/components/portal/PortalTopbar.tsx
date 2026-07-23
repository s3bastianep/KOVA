'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import { authApi, clearSession, getStoredUser } from '@/lib/api';
import { PORTAL_NAV } from '@/lib/portal-navigation';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('Candidato');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      const full = `${user.firstName} ${user.lastName}`.trim();
      if (full) setName(full);
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const displayName = useMemo(() => toTitleCase(name), [name]);
  const initials = useMemo(() => initialsFromName(displayName), [displayName]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    router.push('/login');
  };

  return (
    <>
      <header className="kova-topbar sticky top-0 z-30 border-b border-[var(--kova-border)] bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="lg:hidden -ml-1 shrink-0 rounded-xl p-2.5 transition-colors"
              style={{ color: 'var(--kova-navy-muted)' }}
            >
              <Menu className="h-5 w-5" />
            </button>

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

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--kova-navy)]/20 backdrop-blur-sm"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="kova-sidebar absolute inset-y-0 left-0 flex w-[min(300px,88vw)] flex-col border-r shadow-2xl kova-animate-in">
            <div
              className="flex items-center justify-between border-b px-5 pb-4 pt-5"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="kova-sidebar-brand font-heading text-sm font-bold lh-mark">
                    litt hunter
                    <span className="lh-mark__sq" aria-hidden="true" />
                  </p>
                  <p className="kova-sidebar-brand-sub text-[10px]">Tu espacio de candidato</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="rounded-xl p-2 transition-colors"
                style={{ color: 'var(--kv-nav-muted)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="kova-sidebar-section-label px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Mi cuenta
              </p>
              <div className="space-y-1">
                {PORTAL_NAV.map(({ href, label, icon: Icon, exact, ...item }) => {
                  const active = exact
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);
                  const shouldPrefetch = 'prefetch' in item ? item.prefetch !== false : true;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={shouldPrefetch}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'kova-nav-item kova-nav-item-portal',
                        active && 'kova-nav-item-active',
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>

              <p className="kova-sidebar-section-label px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.14em]">
                Acción rápida
              </p>
              <Link
                href="/portal/documentos"
                prefetch
                onClick={() => setMenuOpen(false)}
                className="kova-sidebar-quick group mt-1 flex items-center gap-3 rounded-2xl border px-3 py-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="kova-sidebar-quick-title text-sm font-semibold">Subir hoja de vida</p>
                  <p className="kova-sidebar-quick-sub text-[11px]">Importa PDF o Word</p>
                </div>
              </Link>
            </nav>

            <div
              className="kova-sidebar-footer border-t p-3"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
