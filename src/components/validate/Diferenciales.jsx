import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const diferenciales = [
  { titulo: 'Especialización exclusiva en talento comercial', desc: 'No somos una bolsa de empleo ni una consultora generalista. Solo selección comercial.', color: '#6366F1', bg: '#EEF2FF' },
  { titulo: 'Evaluación por competencias específicas', desc: 'Medimos lo que la vacante exige — no lo que un test genérico asume que todo vendedor necesita.', color: '#0EA5E9', bg: '#F0F9FF' },
  { titulo: 'Proceso diseñado para cada vacante', desc: 'La metodología se adapta al rol, al sector y al contexto de tu empresa.', color: '#10B981', bg: '#ECFDF5' },
  { titulo: 'Claridad durante todo el proceso', desc: 'Sabes qué estamos evaluando, por qué y qué significa cada resultado.', color: '#F59E0B', bg: '#FFFBEB' },
  { titulo: 'Recomendación sustentada', desc: 'Un informe que facilita la conversación entre comercial, talento humano y dirección.', color: '#8B5CF6', bg: '#F5F3FF' },
];

export default function Diferenciales() {
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F59E0B', letterSpacing: '0.15em' }}>Por qué Kova</p>
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Especialización, método y precisión.
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            No queremos parecer una firma tradicional de recursos humanos. Queremos transmitir especialización, método y tecnología aplicada a la selección comercial.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {diferenciales.map(({ titulo, desc, color, bg }) => (
            <div key={titulo} className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${color}18` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-4" style={{ background: color }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: '#0F0A2A' }}>{titulo}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
