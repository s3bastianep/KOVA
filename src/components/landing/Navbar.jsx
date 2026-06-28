import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { GUIAS, isGuiaPath } from '@/components/guia/guiaRoutes';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const landingLinks = [
  ['El servicio', 'proceso'],
  ['Quiénes somos', '/quienes-somos'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [recursosOpen, setRecursosOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onGuia = isGuiaPath(location.pathname);
  const navMuted = '#64748B';
  const navHover = BRAND.navy;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(248,249,251,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? KOVA.border : 'rgba(226,230,237,0.8)',
        boxShadow: scrolled ? '0 1px 3px rgba(15,31,61,0.04)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-left">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: BRAND.blue, boxShadow: '0 2px 8px rgba(26,63,170,0.2)' }}
          >
            <span className="font-heading font-bold text-sm text-white">K</span>
          </div>
          <div>
            <span className="font-heading font-semibold text-base tracking-tight block leading-none" style={{ color: BRAND.navy }}>
              Kova
            </span>
            <span className="text-[10px] font-medium tracking-wide hidden sm:block mt-0.5" style={{ color: KOVA.muted }}>
              Expertos en selección comercial
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {!onGuia && landingLinks.map(([label, id]) => (
            id.startsWith('/') ? (
              <Link
                key={id}
                to={id}
                className="text-sm font-medium transition-colors"
                style={{
                  color: location.pathname === id ? BRAND.blueMid : navMuted,
                  fontWeight: location.pathname === id ? 600 : 500,
                }}
                onMouseEnter={(e) => { if (location.pathname !== id) e.currentTarget.style.color = navHover; }}
                onMouseLeave={(e) => { if (location.pathname !== id) e.currentTarget.style.color = navMuted; }}
              >
                {label}
              </Link>
            ) : (
              <button
                key={id}
                onClick={() => goToSection(id)}
                className="text-sm font-medium transition-colors"
                style={{ color: navMuted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = navHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = navMuted; }}
              >
                {label}
              </button>
            )
          ))}

          {onGuia && (
            <>
              <Link to="/" className="text-sm font-medium transition-colors" style={{ color: navMuted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = navHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = navMuted; }}
              >Inicio</Link>
              <Link to="/quienes-somos" className="text-sm font-medium transition-colors" style={{ color: navMuted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = navHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = navMuted; }}
              >Quiénes somos</Link>
            </>
          )}

          <div className="relative" onMouseEnter={() => setRecursosOpen(true)} onMouseLeave={() => setRecursosOpen(false)}>
            <button type="button" className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: onGuia ? BRAND.blue : navMuted, fontWeight: onGuia ? 600 : 500 }}
            >
              Recursos
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {recursosOpen && (
              <div className="absolute top-full left-0 pt-2 w-72">
                <div className="rounded-xl py-2 bg-white overflow-hidden" style={{ border: '1px solid #E2E6ED', boxShadow: '0 8px 24px rgba(15,31,61,0.08)' }}>
                  {GUIAS.map(({ path, title, readTime }) => (
                    <Link key={path} to={path} className="block px-4 py-3 transition-colors hover:bg-slate-50"
                      style={{ background: location.pathname === path ? '#EEF2FA' : 'transparent' }}
                    >
                      <p className="text-sm font-medium leading-snug mb-0.5" style={{ color: location.pathname === path ? BRAND.blue : BRAND.navy }}>
                        {title}
                      </p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>Lectura de {readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link to="/contacto" className="kova-btn-primary text-sm font-semibold px-4 py-2.5 rounded-lg transition-all text-white hover:opacity-95">
          Hablar con un experto
        </Link>
      </div>
    </nav>
  );
}
