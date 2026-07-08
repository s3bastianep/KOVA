import React from 'react';
import { ArrowRight } from 'lucide-react';

const datos = [
  { num: '6 a 18×', label: 'el costo de una mala contratación', desc: 'en salarios desperdiciados por rotación. Las empresas lo pierden sin darse cuenta.', color: '#F59E0B', bg: '#FFFBEB' },
  { num: '3 a 6 meses', label: 'tarda un vendedor sin inducción estructurada', desc: 'en ser productivo. Con Kova ese tiempo cae a menos de 4 semanas.', color: '#6366F1', bg: '#EEF2FF' },
  { num: '54%', label: 'retención promedio del mercado', desc: 'en perfiles comerciales. Los procesos de Kova logran 94% al primer año.', color: '#10B981', bg: '#ECFDF5' },
];

export default function NuestraVision() {
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#10B981', letterSpacing: '0.15em' }}>El costo real</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Contratar mal no es un error de RRHH. Es una pérdida financiera.
            </h2>
            <p className="text-sm leading-relaxed mb-7" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Las empresas pierden entre 6 y 18 salarios cada vez que un vendedor se va. Y la mayoría no lo ve: lo atribuye a mala suerte, no a un proceso roto. Kova nació para cambiar eso.
            </p>
            <blockquote className="pl-4 py-1 mb-8" style={{ borderLeft: '3px solid #6366F1' }}>
              <p className="text-sm font-medium leading-relaxed" style={{ color: '#374151' }}>
                "Las empresas que dominan su mercado no tienen más vendedores que las demás. Tienen un sistema que cualquier asesor puede aprender y replicar desde el primer día."
              </p>
            </blockquote>
            <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl text-sm transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              Hablar con un especialista <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {datos.map(({ num, label, desc, color, bg }) => (
              <div key={num} className="flex gap-4 p-5 rounded-2xl" style={{ background: bg, border: `1px solid ${color}1A` }}>
                <div className="flex-shrink-0 w-20">
                  <p className="font-heading font-black text-lg leading-none" style={{ color, letterSpacing: '-0.03em' }}>{num}</p>
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#0F0A2A' }}>{label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}