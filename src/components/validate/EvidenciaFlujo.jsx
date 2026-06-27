import { ArrowRight } from 'lucide-react';

const etapas = [
  {
    n: '01',
    title: 'Perfil de competencias',
    desc: 'Traducimos la vacante en habilidades medibles y criterios de éxito del rol.',
    output: 'Coincidencia por puesto',
  },
  {
    n: '02',
    title: 'Evaluación comparativa',
    desc: 'Medimos a cada candidato con la misma escala comercial y documentamos la evidencia.',
    output: 'Ranking con sustento',
  },
  {
    n: '03',
    title: 'Decisión informada',
    desc: 'Recibes la terna con conclusión del evaluador para contratar con confianza.',
    output: 'Informe unificado',
  },
];

export default function EvidenciaFlujo() {
  return (
    <section className="py-16 lg:py-20 px-6 lg:px-8 border-y" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-center mb-3" style={{ color: '#6366F1' }}>
          De la vacante a la decisión
        </p>
        <h2
          className="font-heading font-bold text-center mb-12 max-w-2xl mx-auto"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.65rem)', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.25 }}
        >
          La evidencia recorre todo el proceso, no se queda en una entrevista.
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {etapas.map(({ n, title, desc, output }, i) => (
            <div key={title} className="relative">
              {i < etapas.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute -right-4 lg:-right-5 top-8 w-5 h-5 z-10"
                  style={{ color: '#CBD5E1' }}
                  strokeWidth={2}
                  aria-hidden
                />
              )}
              <div className="rounded-xl p-5 h-full" style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}>
                <span
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded mb-3"
                  style={{ background: '#EEF2FF', color: '#4338CA' }}
                >
                  {n}
                </span>
                <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>{title}</p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#64748B', lineHeight: 1.65 }}>{desc}</p>
                <span
                  className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-md"
                  style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #BBF7D0' }}
                >
                  → {output}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
