import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(250,251,255,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid rgba(99,102,241,0.08)',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.05)' : 'none',
      }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
            <span className="font-heading font-black text-xs text-white">K</span>
          </div>
          <span className="font-heading font-bold text-base tracking-tight" style={{ color: '#0F0A2A' }}>Kova</span>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {[['Problema', 'problema'], ['Filosofía', 'filosofia'], ['Proceso', 'proceso'], ['Entregable', 'entregable'], ['Acceso', 'acceso']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-sm font-medium transition-colors"
              style={{ color: '#6B7280' }}
              onMouseEnter={e => e.target.style.color = '#0F0A2A'}
              onMouseLeave={e => e.target.style.color = '#6B7280'}>
              {label}
            </button>
          ))}
        </div>

        <button onClick={() => scrollTo('acceso')}
          className="text-sm font-semibold px-4 py-2 rounded-lg transition-all text-white"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 2px 10px rgba(99,102,241,0.25)' }}>
          Acceso anticipado
        </button>
      </div>
    </nav>
  );
}