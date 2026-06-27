import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';
import { GUIAS } from '@/components/guia/guiaRoutes';

const landingLinks = [
  ['Problema', 'problema'],
  ['Cómo funciona', 'proceso'],
  ['Qué recibes', 'entregable'],
  ['Solicitar acceso', 'acceso'],
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
    <footer style={{ background: '#0F172A' }} className="py-14 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10 lg:gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4338CA' }}>
                <span className="font-heading font-bold text-sm text-white">K</span>
              </div>
              <span className="font-heading font-semibold text-base text-white">Kova</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
              Especialistas en atraer y evaluar talento comercial ideal para empresas B2B en Latinoamérica.
            </p>
            <a
              href="mailto:contacto@kova.com.co"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: '#A5B4FC' }}
            >
              <Mail className="w-4 h-4" strokeWidth={1.75} />
              contacto@kova.com.co
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Navegación
            </p>
            <div className="flex flex-col gap-2.5">
              {landingLinks.map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => goToSection(id)}
                  className="text-sm text-left font-medium transition-colors w-fit"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {label}
                </button>
              ))}
              {GUIAS.map(({ path, title }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm font-medium transition-colors w-fit block"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Compromiso
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#818CF8' }} strokeWidth={1.75} />
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Información corporativa tratada con confidencialidad.
                </p>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Metodología propia de evaluación comercial por competencias.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 Kova. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Selección comercial · Latinoamérica
          </p>
        </div>
      </div>
    </footer>
  );
}
