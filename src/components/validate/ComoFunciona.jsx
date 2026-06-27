import React from 'react';

const pasos = [
  'Entendemos la vacante',
  'Definimos competencias clave',
  'Evaluamos habilidades demostradas',
  'Presentamos una terna argumentada',
];

export default function ComoFunciona() {
  return (
    <section id="proceso" className="py-24 px-6 lg:px-8" style={{ background: '#0F0A2A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#818CF8', letterSpacing: '0.15em' }}>Cómo funciona</p>
            <h2 className="font-heading font-black leading-tight mb-5 text-white" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', letterSpacing: '-0.02em' }}>
              La selección comercial no debería ser genérica.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
              Diseñamos el proceso alrededor de lo que cada vacante realmente necesita: competencias, contexto comercial y criterios de éxito claros.
            </p>
          </div>

          <div className="space-y-3">
            {pasos.map((paso, i) => (
              <div
                key={paso}
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs text-white"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-white">{paso}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
