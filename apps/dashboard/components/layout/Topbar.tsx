'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, clearSession, authApi, type AuthUser } from '@/lib/api';
import { NAV_MAIN } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Search, Menu, X } from 'lucide-react';

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Se lee después del montaje para evitar el error de hidratación (#418):
  // en el servidor no existe localStorage, así el HTML inicial coincide.
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
        className="h-16 border-b bg-white/70 backdrop-blur-md flex items-center justify-between gap-2 px-4 sm:px-5 lg:px-8 sticky top-0 z-30"
        style={{ borderColor: 'var(--kova-border)' }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={search} className="flex items-center gap-2.5 flex-1 max-w-md rounded-full bg-slate-100/80 px-4 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar candidatos, empresas, cargos..."
            aria-label="Buscar"
            className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
          />
        </form>
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--kova-navy)' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
              </p>
              <p className="text-[11px] text-slate-400 capitalize">{user?.role?.replace('_', ' ').toLowerCase() ?? 'Consultor'}</p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
            >
              {initials || 'U'}
            </div>
          </div>
          <button type="button" onClick={logout} className="p-2.5 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors" title="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Menú lateral móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] flex flex-col text-white shadow-2xl kova-animate-in"
            style={{ background: 'linear-gradient(180deg, #0E1834 0%, #111C3D 55%, #16224A 100%)' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-heading font-bold text-base shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--kova-blue), #6D5BE3)' }}
                >
                  K
                </div>
                <div>
                  <p className="font-heading font-bold text-sm leading-tight text-white">Kova Talent OS</p>
                  <p className="text-[10px] text-white/50">Reclutamiento comercial</p>
                </div>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="p-2 rounded-lg text-white/60 hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3">
              <div className="space-y-1">
                {NAV_MAIN.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        active ? 'text-white shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white',
                      )}
                      style={active ? { background: 'linear-gradient(135deg, rgba(45,91,227,0.45), rgba(109,91,227,0.35))' } : undefined}
                    >
                      <Icon className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-[#B7AEF5]' : 'text-white/40')} />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="p-3 border-t border-white/10">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
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
