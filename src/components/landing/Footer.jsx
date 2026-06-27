import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

const links = [
  ['Problema', 'problema'],
  ['Proceso', 'proceso'],
  ['Entregable', 'entregable'],
  ['Precios', '/precios'],
  ['Contacto', 'acceso'],
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <footer style={{ background: '#0F172A' }} className="px-6 lg:px-8 py-5">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#4338CA' }}>
              <span className="font-heading font-bold text-xs text-white">K</span>
            </div>
            <span className="font-heading font-semibold text-sm text-white">Kova</span>
          </Link>
          <a
            href="mailto:contacto@kova.com.co"
            className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
            contacto@kova.com.co
          </a>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map(([label, id]) =>
            id.startsWith('/') ? (
              <Link
                key={label}
                to={id}
                className="text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {label}
              </Link>
            ) : (
              <button
                key={label}
                type="button"
                onClick={() => goToSection(id)}
                className="text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {label}
              </button>
            ),
          )}
        </nav>
      </div>

      <div
        className="max-w-6xl mx-auto mt-4 pt-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-[10px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.28)' }}
      >
        <p>© 2026 Kova. Todos los derechos reservados.</p>
        <p>Selección comercial · Latinoamérica</p>
      </div>
    </footer>
  );
}
