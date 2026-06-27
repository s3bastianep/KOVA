import { TrendingUp, ShieldCheck } from 'lucide-react';

const MATCH_PERCENT = 92;

const kpis = [
  { label: 'Coincidencia perfil', value: `${MATCH_PERCENT}%` },
  { label: 'Competencias', value: '5' },
  { label: 'vs. promedio', value: '+24' },
  { label: 'Estado', value: 'Top' },
];

const competencias = [
  { label: 'Venta consultiva', value: 92, color: '#4F46E5' },
  { label: 'Prospección', value: 88, color: '#059669' },
  { label: 'Manejo de objeciones', value: 90, color: '#D97706' },
  { label: 'Orientación al logro', value: 94, color: '#0284C7' },
];

export default function PreciosCandidatoDashboard() {
  return (
    <div className="relative w-full">
      <div
        className="absolute -inset-3 rounded-3xl pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 mx-2">
            <div className="h-5 rounded-md flex items-center justify-center px-3 mx-auto max-w-[240px]" style={{ background: '#FFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[9px] font-medium truncate" style={{ color: '#94A3B8' }}>
                app.kova.com.co · Perfil del candidato
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b flex items-center justify-between gap-3" style={{ borderColor: '#F1F5F9', background: '#FFFFFF' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
              style={{ background: '#4338CA' }}
            >
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>Candidato A</p>
              <p className="text-[10px] truncate" style={{ color: '#64748B' }}>Ejecutivo Comercial B2B</p>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1 flex-shrink-0"
            style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
          >
            <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
            Recomendado
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9', background: '#FAFBFC' }}>
          {kpis.map(({ label, value }) => (
            <div key={label} className="rounded-lg px-2 py-2 text-center" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <p className="font-heading font-bold text-base tabular-nums leading-none" style={{ color: '#4338CA' }}>{value}</p>
              <p className="text-[8px] font-medium mt-1 leading-tight" style={{ color: '#64748B' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="px-4 py-3">
          <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
            <p className="font-heading font-bold text-xl tabular-nums leading-none mb-1" style={{ color: '#4338CA' }}>
              {MATCH_PERCENT}<span className="text-sm font-bold">%</span>
            </p>
            <p className="text-[11px] font-medium leading-snug" style={{ color: '#3730A3' }}>
              Cumple el {MATCH_PERCENT}% de las habilidades necesarias para el puesto
            </p>
            <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: '#C7D2FE' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${MATCH_PERCENT}%`, background: '#4338CA' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
              Desglose por competencia
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: '#EEF2FF', color: '#4338CA' }}>
              <TrendingUp className="w-3 h-3" />
              Metodología Kova
            </span>
          </div>

          <div className="space-y-2.5">
            {competencias.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium" style={{ color: '#334155' }}>{c.label}</span>
                  <span className="font-bold tabular-nums" style={{ color: c.color }}>{c.value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg px-3 py-2.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#047857' }}>Conclusión del evaluador</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#166534' }}>
              Cumple el {MATCH_PERCENT}% de las habilidades del puesto. Recomendado para la terna final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
