import SectionHeader from '@/components/landing/SectionHeader';

const cards = [
  {
    title: 'Entrevistan bien, venden distinto',
    desc: 'Un buen discurso no garantiza desempeño comercial real.',
  },
  {
    title: 'El perfil equivocado cuesta caro',
    desc: 'Rotación, pipeline perdido y meses sin cubrir la vacante.',
  },
  {
    title: 'Cada rol exige competencias distintas',
    desc: 'Un SDR no se evalúa igual que un account manager.',
  },
];

export default function Problema() {
  return (
    <section id="problema" className="py-16 lg:py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          align="center"
          className="mb-8 lg:mb-10 max-w-2xl"
          eyebrow="El problema"
          title="El currículum no basta para contratar comercial."
          description="Experiencia y buena entrevista no demuestran que alguien tenga las competencias que tu vacante exige."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map(({ title, desc }) => (
            <article
              key={title}
              className="rounded-xl p-5 bg-white"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#0F1F3D' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#3D3D3D', lineHeight: 1.65 }}>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
