'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, clearSession, authApi, type AuthUser } from '@/lib/api';
import { NAV_MAIN } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Search, Menu, X, Sparkles } from 'lucide-react';

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '';

  const logout = async () => {
    const refresh = localStorage.getItem('kova_refresh_token') ?? undefined;
    try { await authApi.logout(refresh); } catch { /* ignore */ }
    clearSession();
    router.push('/login');
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/candidatos?q=${encodeURIComponent(q)}`);
    else router.push('/candidatos');
  };

  return (
    <>
      <header
        className="h-[68px] border-b kova-glass flex items-center justify-between gap-2 px-4 sm:px-5 lg:px-8 sticky top-0 z-30"
        style={{ borderColor: 'var(--kova-border)' }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="lg:hidden p-2.5 -ml-1 rounded-xl transition-colors shrink-0"
          style={{ color: 'var(--kova-navy-muted)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <form
          onSubmit={search}
          className="kova-input-shell flex-1 max-w-lg rounded-full py-2 focus-within:rounded-2xl transition-[border-radius] duration-200"
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--kv-nav-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar candidatos, empresas, cargos..."
            aria-label="Buscar"
            className="kova-input"
            style={{ color: 'var(--kova-navy)' }}
          />
        </form>

        <div className="flex items-center gap-2 lg:gap-3">
          <div
            className="hidden md:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border"
            style={{ borderColor: 'var(--kova-border)', background: 'rgba(246, 247, 242, 0.85)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))',
                boxShadow: '0 4px 12px -4px rgba(51, 65, 196, 0.4)',
              }}
            >
              {initials || 'U'}
            </div>
            <div className="text-left hidden sm:block min-w-0">
              <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--kova-navy)' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
              </p>
              <p className="text-[11px] capitalize truncate" style={{ color: 'var(--kova-navy-muted)' }}>
                {user?.role?.replace('_', ' ').toLowerCase() ?? 'Consultor'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: 'var(--kova-navy-muted)' }}
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--kova-navy)]/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="kova-sidebar absolute inset-y-0 left-0 w-[min(300px,88vw)] flex flex-col shadow-2xl kova-animate-in border-r">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="kova-sidebar-logo-mark text-sm" aria-hidden>
                  K
                </div>
                <div>
                  <p className="kova-sidebar-brand font-heading font-bold text-sm">Kova Talent OS</p>
                  <p className="kova-sidebar-brand-sub text-[10px]">Reclutamiento comercial</p>
                </div>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="p-2 rounded-xl transition-colors" style={{ color: 'var(--kv-nav-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {NAV_MAIN.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={cn('kova-nav-item', active && 'kova-nav-item-active pl-4')}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/procesos/nuevo"
                onClick={() => setMenuOpen(false)}
                className="kova-sidebar-quick mt-4 flex items-center gap-3 px-3 py-3 rounded-2xl border"
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--kova-lime)' }} />
                <span className="kova-sidebar-quick-title text-sm font-semibold">Nuevo proceso</span>
              </Link>
            </nav>

            <div className="kova-sidebar-footer p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
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
        </div>
      )}
    </>
  );
}
