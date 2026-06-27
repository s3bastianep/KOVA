import React from 'react';

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ background: '#0F0A2A', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
                <span className="font-heading font-black text-xs text-white">K</span>
              </div>
              <span className="font-heading font-bold text-base text-white">Kova</span>
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
              Especialistas en selección de talento comercial para Latinoamérica.
            </p>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>contacto@kova.com.co</p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {[['Problema', 'problema'], ['Filosofía', 'filosofia'], ['Proceso', 'proceso'], ['Entregable', 'entregable'], ['Acceso', 'acceso']].map(([label, id]) => (
              <button key={label} onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#FFFFFF'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 Kova. Todos los derechos reservados.</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Firma especializada en talento comercial · Latinoamérica</p>
        </div>
      </div>
    </footer>
  );
}