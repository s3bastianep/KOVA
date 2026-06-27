import React from 'react';

export default function Problema() {
  return (
    <section id="problema" className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>El problema</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Si contratas vendedores, esto probablemente ya te pasó.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              No es un problema de falta de candidatos. Es que los procesos actuales no están diseñados para evaluar lo que predice el éxito en ventas.
            </p>
            <div className="p-5 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <p className="text-sm leading-relaxed italic mb-3" style={{ color: '#374151' }}>
                "El candidato hablaba muy bien en la entrevista. Tres meses después, el pipeline seguía igual."
              </p>
              <p className="text-xs font-bold" style={{ color: '#6366F1' }}>— Gerente Comercial · Bogotá</p>
            </div>
          </div>

          <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            <p style={{ color: '#374151', fontWeight: 500 }}>
              Llevas semanas entrevistando. El candidato conoce el sector, tiene experiencia y un currículum impecable.
            </p>
            <p>
              Tres meses después, las objeciones lo paralizan. El equipo comercial sigue cargando el mismo peso. No fue mala suerte — fue una decisión tomada con información insuficiente.
            </p>
            <p>
              Recibes decenas de currículums, pero pocos perfiles que encajen con lo que la vacante exige. Cada entrevista consume tiempo de gerentes que ya tienen demasiado en su agenda.
            </p>
            <div className="p-6 rounded-2xl" style={{ background: '#EEF2FF', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="font-heading font-bold text-sm mb-2" style={{ color: '#0F0A2A' }}>
                Y cuando la contratación falla, pierdes meses — no solo un puesto vacío.
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Entrevistas a quien habla bien pero vende poco. Muchos CVs, pocos candidatos adecuados. Procesos genéricos que no distinguen un hunter de un account manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
