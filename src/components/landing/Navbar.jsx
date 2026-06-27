import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const GUIDE_PATH = '/guia-contratar-comercial';

const landingLinks = [
  ['Problema', 'problema'],
  ['Cómo funciona', 'proceso'],
  ['Qué recibes', 'entregable'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isGuide = location.pathname === GUIDE_PATH;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
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
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(250,251,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? '#E2E8F0' : 'rgba(226,232,240,0.6)',
        boxShadow: scrolled ? '0 1px 3px rgba(15,23,42,0.04)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-left">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#4338CA', boxShadow: '0 2px 8px rgba(67,56,202,0.2)' }}
          >
            <span className="font-heading font-bold text-sm text-white">K</span>
          </div>
          <div>
            <span className="font-heading font-semibold text-base tracking-tight block leading-none" style={{ color: '#0F172A' }}>
              Kova
            </span>
            <span className="text-[10px] font-medium hidden sm:block mt-0.5" style={{ color: '#64748B' }}>
              Selección comercial B2B
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {!isGuide && landingLinks.map(([label, id]) => (
            <button
              key={id}
              onClick={() => goToSection(id)}
              className="text-sm font-medium transition-colors"
              style={{ color: '#64748B' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
            >
              {label}
            </button>
          ))}

          {isGuide && (
            <Link
              to="/"
              className="text-sm font-medium transition-colors"
              style={{ color: '#64748B' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
            >
              Inicio
            </Link>
          )}

          <Link
            to={GUIDE_PATH}
            className="text-sm font-medium transition-colors"
            style={{ color: isGuide ? '#4338CA' : '#64748B', fontWeight: isGuide ? 600 : 500 }}
            onMouseEnter={e => { if (!isGuide) e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { if (!isGuide) e.currentTarget.style.color = '#64748B'; }}
          >
            Guía
          </Link>
        </div>

        <Link
          to="/#acceso"
          className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-all text-white hover:opacity-95"
          style={{ background: '#4338CA', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}
        >
          Diagnóstico gratuito
        </Link>
      </div>
    </nav>
  );
}
