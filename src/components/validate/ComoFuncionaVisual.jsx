import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const MATCH_PERCENT = 92;

const flowSteps = [
  { n: 1, label: 'Perfil de vacante' },
  { n: 2, label: 'Evaluación' },
  { n: 3, label: 'Terna comparada' },
];

const competencias = [
  { label: 'Venta consultiva', value: 92, color: '#6366F1' },
  { label: 'Prospección', value: 88, color: '#10B981' },
  { label: 'Manejo de objeciones', value: 90, color: '#F59E0B' },
];

export default function ComoFuncionaVisual() {
  return (
    <div className="relative w-full">
      <div
        className="absolute -inset-3 rounded-3xl pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
      >
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
          {flowSteps.map(({ n, label }, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white"
                style={{ background: '#4338CA' }}
              >
                {n}
              </span>
              <span className="text-[10px] font-semibold truncate hidden sm:block" style={{ color: '#334155' }}>
                {label}
              </span>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="w-3 h-3 flex-shrink-0 ml-auto sm:ml-0" style={{ color: '#CBD5E1' }} />
              )}
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
            Vacante evaluada
          </p>
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Ejecutivo Comercial B2B</p>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>Candidato recomendado</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Candidato A</p>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1 flex-shrink-0"
              style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
            >
              <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
              Listo para decidir
            </span>
          </div>

          <div
            className="rounded-xl px-4 py-3.5 mb-4"
            style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
          >
            <p className="font-heading font-bold text-3xl tabular-nums leading-none mb-1.5" style={{ color: '#4338CA' }}>
              {MATCH_PERCENT}<span className="text-lg font-bold">%</span>
            </p>
            <p className="text-xs font-medium leading-snug mb-2.5" style={{ color: '#3730A3' }}>
              Cumple el {MATCH_PERCENT}% de las habilidades necesarias para el puesto
            </p>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#C7D2FE' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${MATCH_PERCENT}%`, background: 'linear-gradient(90deg, #6366F1, #4338CA)' }}
              />
            </div>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#94A3B8' }}>
            Competencias evaluadas
          </p>
          <div className="space-y-2 mb-4">
            {competencias.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.color }} strokeWidth={2.5} />
                <span className="text-[11px] font-medium flex-1 min-w-0 truncate" style={{ color: '#334155' }}>{c.label}</span>
                <span className="text-[11px] font-bold tabular-nums flex-shrink-0" style={{ color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg px-3 py-2.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#047857' }}>Resultado</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#166534' }}>
              Terna comparada con el mismo criterio. Eliges sabiendo quién encaja mejor con la vacante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
