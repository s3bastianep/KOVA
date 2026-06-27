import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GuiaPageLayout from '@/components/guia/GuiaPageLayout';
import GuiaIssuesSummary from '@/components/guia/GuiaIssuesSummary';
import { GUIA_CONTRATAR } from '@/components/guia/guiaRoutes';
import { TOC_CONTRATAR } from '@/components/guia/guiaToc';
import { ISSUES, SKILLS } from '@/components/guia/guiaContent';

const prose = 'text-[17px] leading-[1.85]';
const proseColor = { color: '#334155' };

function SectionTitle({ id, children }) {
  return (
    <h2
      id={id}
      className="font-heading font-bold text-[1.65rem] leading-tight mb-5 scroll-mt-28"
      style={{ color: '#0F172A', letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  );
}

function IssueBlock({ issue }) {
  return (
    <article id={issue.id} className="scroll-mt-28 mb-12 last:mb-0">
      <h3 className="font-heading font-bold text-xl mb-4" style={{ color: '#0F172A' }}>
        {issue.num}. {issue.title}
      </h3>
      {issue.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className={`${prose} mb-5`} style={proseColor}>
          {p}
        </p>
      ))}
      <div
        className="rounded-xl p-5 mt-6"
        style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#6366F1' }}>
          Cómo lo resuelve Kova
        </p>
        <p className="text-base leading-relaxed font-medium" style={{ color: '#1E293B', lineHeight: 1.75 }}>
          {issue.solution}
        </p>
      </div>
    </article>
  );
}

export default function GuiaContratarComercial() {
  return (
    <GuiaPageLayout
      currentPath={GUIA_CONTRATAR}
      title="5 problemas al atraer talento comercial y cómo resolverlos"
      readTime="12 min"
      heroImage="/images/guia-reunion-comercial.png"
      heroImageAlt="Equipo comercial en reunión de resultados y pipeline"
      tocItems={TOC_CONTRATAR}
    >
            <p className={`${prose} mb-8`} style={proseColor}>
              Muchas empresas asumen que atraer talento comercial es cuestión de identificar a los más extrovertidos o a quienes mejor cuentan su experiencia. Pero en B2B hay muchos más obstáculos: roles mal definidos, entrevistas que no predicen desempeño y evaluaciones genéricas que no miden ventas.
            </p>
            <p className={`${prose} mb-8`} style={proseColor}>
              Con presión por crecer el equipo comercial, elegir al perfil equivocado cuesta caro: rotación elevada, pipeline estancado y meses perdidos. En Kova abordamos esto con metodología propia y especialistas en selección comercial: identificamos el talento ideal para tu vacante, sin pruebas genéricas de RH.
            </p>
            <p className={`${prose} mb-12`} style={proseColor}>
              En esta guía repasamos los cinco problemas más comunes y cómo resolverlos con selección basada en competencias comerciales.
            </p>

            <SectionTitle id="por-que-es-dificil">¿Por qué es difícil contratar comercial?</SectionTitle>
            <p className={`${prose} mb-5`} style={proseColor}>
              Toda empresa exitosa depende de un equipo comercial capaz de convertir oportunidades en ingresos. Sin embargo, las vacantes de ventas están entre las más difíciles de llenar: no por falta de candidatos, sino porque el proceso habitual no demuestra quién realmente puede desempeñar el rol.
            </p>
            <p className={`${prose} mb-5`} style={proseColor}>
              La presión por cumplir cuota, los ciclos de venta largos y la necesidad de combinar habilidades técnicas con capacidad de relacionamiento hacen que contratar comercial sea un reto distinto al de otros roles corporativos.
            </p>

            <blockquote
              className="my-10 pl-6 border-l-4 italic"
              style={{ borderColor: '#4338CA', color: '#475569' }}
            >
              <p className={`${prose} mb-0`}>
                "Las empresas que más crecen necesitan equipos comerciales más grandes, pero escalar contratando a ciegas multiplica el costo de cada error."
              </p>
            </blockquote>

            <p className={`${prose} mb-8`} style={proseColor}>
              Además, estereotipos sobre la profesión comercial y la exigencia de resultados inmediatos hacen que menos personas se acerquen al sector, mientras la demanda de talento sigue subiendo. La buena noticia: cada uno de estos problemas tiene solución cuando el proceso está diseñado para ventas.
            </p>

            {/* Callout stat box */}
            <div
              className="rounded-2xl overflow-hidden mb-14"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(15,23,42,0.04)' }}
            >
              <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[260px]">
                  <img
                    src="/images/guia-reunion-comercial.png"
                    alt="Equipo comercial revisando pipeline y criterios de evaluación"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, rgba(15,23,42,0.08) 0%, transparent 55%)' }}
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center" style={{ background: '#F8FAFF' }}>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-3 w-fit px-2.5 py-1 rounded-md"
                    style={{ color: '#4338CA', background: '#EEF2FF', border: '1px solid #C7D2FE' }}
                  >
                    Dato del sector
                  </p>
                  <p className="font-heading font-bold text-xl mb-3 leading-snug" style={{ color: '#0F172A' }}>
                    Atraer talento comercial exige más que publicar una vacante
                  </p>
                  <p className="text-base leading-relaxed mb-5" style={{ color: '#475569', lineHeight: 1.75 }}>
                    Las vacantes de ventas están entre las{' '}
                    <strong style={{ color: '#0F172A' }}>tres más difíciles de cubrir</strong>{' '}
                    a nivel global. No falta gente postulando: falta un proceso que identifique quién tiene el perfil
                    y las competencias que tu rol realmente exige.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-5">
                    <div
                      className="rounded-lg px-4 py-3 min-w-[120px]"
                      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                    >
                      <p className="font-heading font-bold text-2xl tabular-nums leading-none mb-1" style={{ color: '#4338CA' }}>
                        Top 3
                      </p>
                      <p className="text-xs font-medium" style={{ color: '#64748B' }}>Vacantes más difíciles</p>
                    </div>
                    <div
                      className="rounded-lg px-4 py-3 flex-1 min-w-[140px]"
                      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                    >
                      <p className="font-heading font-bold text-sm leading-snug mb-1" style={{ color: '#0F172A' }}>
                        El criterio marca la diferencia
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                        Evaluar bien reduce rotación y acelera la productividad del equipo.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>
                    Fuente: estudios sectoriales de selección comercial · ManpowerGroup
                  </p>
                </div>
              </div>
            </div>

            <SectionTitle id="cinco-problemas">
              5 problemas comunes que enfrentan las empresas al contratar comercial
            </SectionTitle>
            <p className={`${prose} mb-10`} style={proseColor}>
              Estos desafíos aparecen en casi todo proceso de selección comercial. Ignorarlos o no reconocerlos lleva a contrataciones costosas que se repiten ciclo tras ciclo.
            </p>

            {ISSUES.map((issue) => (
              <IssueBlock key={issue.id} issue={issue} />
            ))}

            <SectionTitle id="seleccion-competencias">
              ¿Es la selección por competencias la solución para contratar el equipo comercial correcto?
            </SectionTitle>
            <p className={`${prose} mb-5`} style={proseColor}>
              Sí, cuando está diseñada para ventas. La selección basada en competencias no descarta candidatos por su historial: mide si pueden hacer el trabajo en tu contexto. Eso incluye prospectar, comunicar valor, manejar objeciones, negociar y cerrar.
            </p>
            <p className={`${prose} mb-5`} style={proseColor}>
              En comercial, las habilidades blandas son tan relevantes como las técnicas: gestión, comunicación, orientación al cliente, liderazgo y resiliencia suelen estar entre las más demandadas. Pero medirlas requiere un enfoque específico del rol, no pruebas genéricas.
            </p>
            <p className={`${prose} mb-5`} style={proseColor}>
              Kova aplica este enfoque con especialistas en selección comercial: diagnosticamos la vacante, evaluamos competencias comerciales y entregamos un informe comparativo para que dirección comercial y talento humano decidan con el mismo criterio.
            </p>

            <SectionTitle id="seis-competencias">
              6 competencias clave que debes evaluar al contratar comercial
            </SectionTitle>
            <p className={`${prose} mb-8`} style={proseColor}>
              Ya sea SDR, ejecutivo comercial, account manager o director comercial, estas capacidades son centrales en casi toda vacante de ventas B2B. Kova las evalúa en función de lo que cada rol exige.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-14">
              {SKILLS.map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl p-5"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                >
                  <h4 className="font-heading font-semibold text-sm mb-2" style={{ color: '#0F172A' }}>{title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle id="como-transforma">
              Cómo una evaluación comercial especializada transforma tu proceso de contratación
            </SectionTitle>
            <p className={`${prose} mb-5`} style={proseColor}>
              Menos de una cuarta parte de los representantes de ventas supera su cuota de forma consistente. La rotación en el sector puede triplicar la de otros roles. Eso convierte cada mala contratación en un costo directo para el negocio.
            </p>
            <p className={`${prose} mb-5`} style={proseColor}>
              Una evaluación comercial bien diseñada coloca al candidato en escenarios reales del rol: prospección, presentación de propuesta, manejo de objeciones y cierre. No se trata de saber si "caen bien" en la entrevista, sino de comparar desempeño con criterio.
            </p>
            <p className={`${prose} mb-5`} style={proseColor}>
              En Kova, el proceso cubre distintos perfiles comerciales (SDR, ejecutivo, account manager) con el mismo rigor metodológico: entender la vacante, definir competencias, evaluar candidatos y presentar una terna argumentada.
            </p>
            <p className={`${prose} mb-12`} style={proseColor}>
              El resultado es un informe pensado para quien decide: comparación clara, puntajes por competencia y recomendación sustentada por un evaluador especializado.
            </p>

            <GuiaIssuesSummary />

            {/* CTA inline */}
            <div
              className="mt-14 rounded-2xl overflow-hidden relative"
              style={{ background: '#0F172A' }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 55%)' }}
              />
              <div className="relative p-8 lg:p-10 text-center">
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#A5B4FC' }}
                >
                  Siguiente paso
                </p>
                <h3 className="font-heading font-bold text-xl lg:text-2xl text-white mb-4 leading-tight max-w-xl mx-auto">
                  Identifiquemos el talento comercial ideal para tu vacante
                </h3>
                <p className="text-base mb-7 max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Agenda un diagnóstico sin costo con un especialista de Kova. Revisamos tu contexto comercial y te
                  orientamos sobre el perfil y las competencias que tu rol exige.
                </p>
                <Link
                  to="/#acceso"
                  className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white hover:opacity-95 transition-opacity"
                  style={{ background: '#4338CA' }}
                >
                  Agendar diagnóstico comercial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  Sin compromiso · Diagnóstico personalizado para tu vacante
                </p>
              </div>
            </div>
    </GuiaPageLayout>
  );
}
