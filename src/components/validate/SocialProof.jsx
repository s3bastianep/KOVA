import SectionHeader from '@/components/landing/SectionHeader';

const stats = [
  { value: '3+', label: 'Candidatos comparados', sub: 'En cada terna con el mismo criterio' },
  { value: '5+', label: 'Competencias por rol', sub: 'Definidas según tu vacante' },
  { value: '24h', label: 'Respuesta inicial', sub: 'Tras solicitar el diagnóstico' },
  { value: '$0', label: 'Diagnóstico inicial', sub: 'Sin compromiso de contratación' },
];

const testimonios = [
  {
    quote: 'Por fin un proceso que nos dice por qué recomiendan a alguien, no solo que tiene buen currículum.',
    author: 'Directora Comercial',
    company: 'Empresa fintech · Bogotá',
  },
  {
    quote: 'La evaluación por competencias nos ahorró semanas de entrevistas que no llevaban a ningún lado.',
    author: 'Gerente General',
    company: 'Tecnología · Medellín',
  },
  {
    quote: 'El informe comparativo nos permitió decidir en equipo con el mismo sustento, no con opiniones distintas.',
    author: 'Líder de Talento Humano',
    company: 'Servicios B2B · Cali',
  },
];

export default function SocialProof() {
  return (
    <section id="resultados" className="py-24 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Confianza"
          title="Empresas que necesitaban contratar comercial con criterio."
          description="Procesos reales de selección comercial: evaluación por competencias, informe comparativo y acompañamiento hasta decidir."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map(({ value, label, sub }) => (
            <div
              key={label}
              className="rounded-xl p-5 text-center"
              style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}
            >
              <p className="font-heading font-bold text-2xl tabular-nums mb-1" style={{ color: '#4338CA' }}>{value}</p>
              <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonios.map(({ quote, author, company }) => (
            <blockquote
              key={author}
              className="rounded-2xl p-6 h-full flex flex-col"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#334155', lineHeight: 1.7 }}>
                &ldquo;{quote}&rdquo;
              </p>
              <footer>
                <p className="text-xs font-semibold" style={{ color: '#0F172A' }}>{author}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6366F1' }}>{company}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
