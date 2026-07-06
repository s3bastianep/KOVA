import LandingSectionHeader from '@/components/validate/LandingSectionHeader';
import { LT } from '@/theme/landingTheme';

const resultados = [
  { title: 'Menor riesgo de contratación', line: 'Detecte incompatibilidades antes de firmar, no cuatro meses después.' },
  { title: 'Curva de aprendizaje más corta', line: 'Integración comercial alineada a cómo vende su empresa.' },
  { title: 'Menor rotación temprana', line: 'Asesores que encajan con su modelo desde el inicio.' },
  { title: 'Decisiones con evidencia', line: 'Score de compatibilidad, no solo intuición en entrevista.' },
  { title: 'Perfil comercial preciso', line: 'Sabe exactamente qué tipo de vendedor necesita antes de buscar.' },
  { title: 'Productividad comercial', line: 'Asesores que generan resultados, no solo cumplen inducción.' },
];

function ResultadoCard({ title, line, index }) {
  return (
    <article
      className="rounded-xl p-5 sm:p-6 border bg-white transition-shadow duration-300 hover:shadow-md"
      style={{ borderColor: LT.border }}
    >
      <p className="kova-b2b-eyebrow mb-3 tabular-nums" style={{ color: LT.tealMid }}>
        {String(index).padStart(2, '0')}
      </p>
      <h3 className="font-heading font-semibold text-base mb-2" style={{ color: LT.textDark }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: LT.textMuted }}>
        {line}
      </p>
    </article>
  );
}

export default function Resultados() {
  return (
    <section id="resultados" className="kova-b2b-section px-5 sm:px-6 lg:px-8" style={{ background: LT.cream }}>
      <div className="kova-page-container">
        <LandingSectionHeader
          index="05"
          eyebrow="Resultados"
          title="El verdadero valor:"
          accent="reducir el riesgo de cada contratación comercial."
          align="center"
          className="mx-auto text-center !max-w-2xl"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {resultados.map((item, i) => (
            <ResultadoCard key={item.title} {...item} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
