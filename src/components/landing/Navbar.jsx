import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { GUIAS, isGuiaPath } from '@/components/guia/guiaRoutes';
import { BRAND } from '@/theme/kovaPalette';

const landingLinks = [
  ['Cómo trabajamos', '/como-trabajamos'],
  ['Quiénes somos', '/quienes-somos'],
];

const loginUrl = import.meta.env.VITE_DASHBOARD_URL || '/login';

const linkColor = '#64748B';
const linkHover = BRAND.navy;
const linkActive = BRAND.blueMid;

export default function Navbar() {
  const [recursosOpen, setRecursosOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onGuia = isGuiaPath(location.pathname);

  const goToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const navLinkClass = 'text-sm font-medium transition-colors duration-200 whitespace-nowrap';

  return (
    <nav className="kova-navbar fixed top-0 left-0 right-0 z-50 px-5 sm:px-6 lg:px-8">
      <div className="kova-page-container kova-navbar-inner">
        <div className="flex items-center gap-6 lg:gap-8 min-w-0 flex-1 lg:flex-initial lg:col-start-1">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ background: BRAND.blue }}
            >
              <span className="font-heading font-bold text-sm text-white">K</span>
            </div>
            <span
              className="font-heading font-semibold text-[17px] tracking-tight"
              style={{ color: BRAND.navy }}
            >
              Kova
            </span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10 min-w-0">
          {!onGuia && landingLinks.map(([label, path]) => (
            path.startsWith('/') ? (
              <Link
                key={path}
                to={path}
                className={navLinkClass}
                style={{
                  color: location.pathname === path ? linkActive : linkColor,
                  fontWeight: location.pathname === path ? 600 : 500,
                }}
                onMouseEnter={(e) => { if (location.pathname !== path) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { if (location.pathname !== path) e.currentTarget.style.color = linkColor; }}
              >
                {label}
              </Link>
            ) : (
              <button
                key={path}
                type="button"
                onClick={() => goToSection(path)}
                className={navLinkClass}
                style={{ color: linkColor }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >
                {label}
              </button>
            )
          ))}

          {onGuia && (
            <>
              <Link
                to="/"
                className={navLinkClass}
                style={{ color: linkColor }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >
                Inicio
              </Link>
              <Link
                to="/quienes-somos"
                className={navLinkClass}
                style={{ color: linkColor }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >
                Quiénes somos
              </Link>
            </>
          )}

          <div className="relative" onMouseEnter={() => setRecursosOpen(true)} onMouseLeave={() => setRecursosOpen(false)}>
            <Link
              to="/guias"
              className={`${navLinkClass} inline-flex items-center gap-1`}
              style={{ color: onGuia ? linkActive : linkColor, fontWeight: onGuia ? 600 : 500 }}
            >
              Guías
              <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${recursosOpen ? 'rotate-180' : ''}`} />
            </Link>
            {recursosOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72">
                <div className="rounded-xl py-2 bg-white overflow-hidden" style={{ border: '1px solid #E2E6ED', boxShadow: '0 12px 32px rgba(15,31,61,0.1)' }}>
                  {GUIAS.map(({ path, title, readTime }) => (
                    <Link
                      key={path}
                      to={path}
                      className="block px-4 py-3 transition-colors hover:bg-slate-50"
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
        </div>

        <div className="hidden md:flex kova-nav-actions shrink-0 ml-auto lg:ml-0 lg:col-start-2 lg:w-full lg:justify-end">
          <a href={loginUrl} className="kova-nav-login">
            Iniciar sesión
          </a>
          <Link to="/contacto" className="kova-nav-cta">
            Hablar con un experto
          </Link>
        </div>
      </div>
    </nav>
  );
}
