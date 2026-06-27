import { CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';
import EntregableReportMockup from '@/components/validate/EntregableReportMockup';

const contenido = [
  {
    title: 'Ranking comparativo',
    desc: 'Tres candidatos ordenados por coincidencia con el puesto. Ves quién encaja mejor y en qué medida.',
  },
  {
    title: 'Puntaje por competencia',
    desc: 'Desglose de habilidades comerciales evaluadas para ese cargo, con el sustento de cada calificación.',
  },
  {
    title: 'Recomendación del evaluador',
    desc: 'Conclusión documentada para que dirección comercial y talento humano decidan con el mismo criterio.',
  },
];

export default function Entregable() {
  return (
    <section id="entregable" className="py-24 lg:py-28 px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div>
            <SectionHeader
              align="left"
              className="mb-8 lg:mb-10 max-w-none"
              eyebrow="El entregable"
              title="Un informe comparativo para decidir quién contratar."
              description="Al cerrar el proceso recibes tres perfiles comerciales evaluados con el mismo criterio: rankeados, comparados y documentados en un solo informe."
            />

            <ul className="space-y-5">
              {contenido.map(({ title, desc }) => (
                <li key={title} className="flex gap-3.5">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: '#4338CA' }}
                    strokeWidth={2.25}
                  />
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <EntregableReportMockup />
        </div>
      </div>
    </section>
  );
}
