import { CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const puntos = [
  {
    title: 'Candidatos evaluados por desempeño comercial',
    desc: 'Medimos competencias del rol, no solo años de experiencia ni palabras clave en el CV.',
  },
  {
    title: 'Mérito demostrado, no solo buena entrevista',
    desc: 'Vemos cómo resuelven situaciones comerciales reales, no solo cómo se presentan.',
  },
  {
    title: 'Cada puntaje con sustento documentado',
    desc: 'El informe explica por qué un candidato encaja: competencias, evidencia y conclusión del evaluador.',
  },
  {
    title: 'Perfil adaptado a tu operación',
    desc: 'El criterio cambia según sector, ciclo de venta y tipo de rol comercial que necesitas cubrir.',
  },
];

const metodos = [
  'Diagnóstico de vacante',
  'Entrevista por competencias',
  'Simulación comercial',
  'Evaluación psicométrica',
  'Ranking comparativo',
  'Informe con conclusión',
];

export default function CapacidadDemostrada() {
  return (
    <section className="py-24 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-14">
          <SectionHeader
            align="left"
            className="mb-0 lg:mb-2"
            eyebrow="Nuestra diferencia"
            title="La mayoría filtra por currículum. Nosotros evaluamos capacidad comercial demostrada."
            description="Pasamos de señales indirectas a evidencia concreta: competencias medidas, comparación objetiva y una recomendación que puedes defender ante tu equipo."
          />

          <div className="space-y-3 lg:pt-2">
            {puntos.map(({ title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl" style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4338CA' }} strokeWidth={2.25} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 lg:p-8"
          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: '#6366F1' }}>
            Cómo evaluamos
          </p>
          <div className="flex flex-wrap gap-2">
            {metodos.map((m) => (
              <span
                key={m}
                className="text-xs font-medium px-3 py-2 rounded-lg"
                style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #E2E8F0' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
