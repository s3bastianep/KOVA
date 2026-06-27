import { Target, Search, BarChart3, FileText, UserCheck } from 'lucide-react';

const highlights = [
  { icon: Target, label: 'Diagnóstico de vacante y perfil ideal' },
  { icon: Search, label: 'Búsqueda activa de talento comercial' },
  { icon: BarChart3, label: 'Evaluación comparativa por competencias' },
  { icon: FileText, label: 'Terna argumentada para decidir' },
  { icon: UserCheck, label: 'Especialista dedicado por proyecto' },
];

export default function PreciosHeroResumen() {
  return (
    <div
      className="rounded-2xl p-6 lg:p-7"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#A5B4FC' }}>
        Proyecto a medida
      </p>
      <p className="text-lg font-semibold text-white mb-1">Todo el proceso, una sola propuesta</p>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
        Cotizamos según tu vacante, no por licencias ni usuarios. El alcance se define en el diagnóstico inicial.
      </p>

      <ul className="space-y-3">
        {highlights.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(165,180,252,0.15)' }}
            >
              <Icon className="w-4 h-4" style={{ color: '#C7D2FE' }} strokeWidth={2} />
            </span>
            <span className="text-sm leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.55 }}>
              {label}
            </span>
          </li>
        ))}
      </ul>

      <div
        className="mt-6 rounded-xl px-4 py-3"
        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(165,180,252,0.2)' }}
      >
        <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
          El diagnóstico comercial inicial no tiene costo. Ahí definimos perfil, entregables y propuesta.
        </p>
      </div>
    </div>
  );
}
