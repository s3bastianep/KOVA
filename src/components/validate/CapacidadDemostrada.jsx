import { CheckCircle2, ArrowRight } from 'lucide-react';
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
    title: 'Mismo criterio para toda la terna',
    desc: 'Todos los candidatos se comparan con la misma escala y las mismas competencias de la vacante.',
  },
  {
    title: 'Perfil adaptado a tu operación',
    desc: 'El criterio cambia según sector, ciclo de venta y tipo de rol comercial que necesitas cubrir.',
  },
];

export default function CapacidadDemostrada() {
  const scrollToMetodos = () => document.getElementById('evaluacion')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-24 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <SectionHeader
            align="left"
            className="mb-0 lg:mb-2"
            eyebrow="Nuestra diferencia"
            title="La mayoría filtra por currículum. Nosotros evaluamos capacidad comercial demostrada."
            description="Pasamos de señales indirectas a evidencia concreta: competencias medidas, comparación objetiva y una recomendación que puedes defender ante tu equipo."
          />

          <div className="space-y-4 lg:pt-2">
            {puntos.map(({ title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl" style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4338CA' }} strokeWidth={2.25} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={scrollToMetodos}
              className="group inline-flex items-center gap-2 text-sm font-semibold mt-2 transition-colors hover:opacity-80"
              style={{ color: '#4338CA' }}
            >
              Ver cómo evaluamos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
