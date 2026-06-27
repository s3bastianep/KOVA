import { Target, ClipboardCheck, Users, ArrowDown } from 'lucide-react';

const etapas = [
  {
    icon: Target,
    title: 'Diagnóstico de vacante',
    detail: 'Entendemos cómo vende tu empresa y traducimos el rol en competencias concretas.',
    entregable: 'Perfil ideal + criterios de éxito',
    color: '#818CF8',
  },
  {
    icon: ClipboardCheck,
    title: 'Evaluación estructurada',
    detail: 'Buscamos talento y medimos habilidades comerciales con la misma escala para todos.',
    entregable: 'Candidatos evaluados por competencia',
    color: '#34D399',
  },
  {
    icon: Users,
    title: 'Terna para decidir',
    detail: 'Comparas perfiles rankeados con sustento para elegir con criterio, no con corazonada.',
    entregable: 'Informe comparativo unificado',
    color: '#FBBF24',
  },
];

export default function ComoFuncionaProceso() {
  return (
    <div className="relative w-full">
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div
        className="relative rounded-2xl p-5 lg:p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-5" style={{ color: '#A5B4FC' }}>
          El proceso, paso a paso
        </p>

        <div className="space-y-0">
          {etapas.map(({ icon: Icon, title, detail, entregable, color }, i) => (
            <div key={title}>
              <div
                className="flex gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}22`, border: `1px solid ${color}44` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(99,102,241,0.2)', color: '#C7D2FE' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-semibold text-white">{title}</p>
                  </div>
                  <p className="text-xs leading-relaxed mb-2.5" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                    {detail}
                  </p>
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    → {entregable}
                  </span>
                </div>
              </div>
              {i < etapas.length - 1 && (
                <div className="flex justify-center py-1.5" aria-hidden>
                  <ArrowDown className="w-4 h-4" style={{ color: 'rgba(165,180,252,0.35)' }} strokeWidth={2} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-5 rounded-xl px-4 py-3 text-center"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(165,180,252,0.2)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Un especialista conduce el proceso. Tú recibes el informe listo para decidir.
          </p>
        </div>
      </div>
    </div>
  );
}
