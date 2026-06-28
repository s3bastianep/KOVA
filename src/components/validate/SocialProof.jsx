import SectionHeader from '@/components/landing/SectionHeader';

const testimonios = [
  {
    quote: 'Por fin un proceso que nos dice por qué recomiendan a alguien, no solo que tiene buen currículum.',
    author: 'Directora Comercial',
    company: 'Fintech · Bogotá',
  },
  {
    quote: 'La evaluación por competencias nos ahorró semanas de entrevistas que no llevaban a ningún lado.',
    author: 'Gerente General',
    company: 'Tecnología · Medellín',
  },
  {
    quote: 'El informe comparativo nos permitió decidir en equipo con el mismo sustento.',
    author: 'Líder de Talento Humano',
    company: 'Servicios B2B · Cali',
  },
];

export default function SocialProof() {
  return (
    <section id="resultados" className="py-16 lg:py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          align="center"
          className="mb-8 max-w-xl"
          eyebrow="Confianza"
          title="Empresas que contrataron comercial con criterio."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {testimonios.map(({ quote, author, company }) => (
            <blockquote
              key={author}
              className="rounded-xl p-5 h-full flex flex-col"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#3D3D3D', lineHeight: 1.65 }}>
                &ldquo;{quote}&rdquo;
              </p>
              <footer>
                <p className="text-xs font-semibold" style={{ color: '#0F1F3D' }}>{author}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#2D5BE3' }}>{company}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
