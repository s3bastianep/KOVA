import { BRAND, KOVA } from '@/theme/kovaPalette';

const points = [
  {
    title: 'Los currículums no revelan quién sabe vender realmente.',
    desc: 'Para encontrar al candidato ideal para el puesto, se requiere un proceso de selección más exhaustivo.',
  },
  {
    title: 'Las entrevistas premian la confianza, no la capacidad.',
    desc: 'Los mejores entrevistadores no siempre son los mejores vendedores.',
  },
  {
    title: 'Cada contratación se siente como una apuesta.',
    desc: 'Es difícil predecir el éxito de ventas basándose únicamente en currículums, entrevistas e intuición.',
  },
  {
    title: 'El costo de equivocarse es enorme.',
    desc: 'Tiempo de ramp-up, pérdida de ingresos y costos de contratación. Una mala contratación retrasa meses a su equipo.',
  },
];

export default function Problema() {
  return (
    <section id="problema" className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
      <div className="max-w-6xl mx-auto">
        <p className="kova-eyebrow-pill kova-eyebrow-coral mb-3 sm:mb-4">El problema</p>
        <h2 className="font-heading font-bold leading-tight mb-6 sm:mb-8 lg:mb-10 text-balance max-w-2xl kova-text-h2-section" style={{ color: BRAND.navy }}>
          La contratación de talento comercial es diferente.
        </h2>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 sm:gap-8 lg:gap-10 xl:gap-12 lg:items-stretch">
          <div className="space-y-5 sm:space-y-6 lg:space-y-7 max-w-2xl">
            {points.map(({ title, desc }) => (
              <article
                key={title}
                className="pl-4 sm:pl-5 border-l-[3px]"
                style={{ borderColor: BRAND.coral }}
              >
                <h3 className="text-[14px] sm:text-[15px] lg:text-base font-semibold mb-1.5 leading-snug" style={{ color: BRAND.navy }}>
                  {title}
                </h3>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.65 }}>
                  {desc}
                </p>
              </article>
            ))}
          </div>

          <aside
            className="flex flex-col items-center justify-center text-center rounded-xl sm:rounded-2xl px-5 py-8 sm:px-7 sm:py-10 lg:px-8 lg:py-12 w-full lg:min-h-full"
            style={{
              background: 'linear-gradient(180deg, #0F1F3D 0%, #121E32 100%)',
              boxShadow: '0 8px 32px rgba(15,31,61,0.14)',
            }}
          >
            <div className="flex items-baseline justify-center gap-0.5 mb-6">
              <span
                className="font-heading font-bold tabular-nums leading-none kova-text-stat"
                style={{ color: BRAND.coral }}
              >
                67
              </span>
              <span className="text-xl font-bold" style={{ color: BRAND.coral }}>
                %
              </span>
            </div>

            <p
              className="text-[14px] lg:text-[15px] leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, maxWidth: '15.5rem' }}
            >
              De los empleados contratados para ventas B2B tienen un desempeño inferior al esperado o se retiran
              en menos de 18 meses.
            </p>

            <p
              className="text-[10px] leading-relaxed mt-auto"
              style={{ color: 'rgba(255,255,255,0.38)', maxWidth: '13rem' }}
            >
              Investigación de mercado en organizaciones comerciales B2B
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
