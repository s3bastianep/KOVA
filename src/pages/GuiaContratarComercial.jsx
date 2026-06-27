import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GuiaTableOfContents from '@/components/guia/GuiaTableOfContents';
import GuiaSidebar from '@/components/guia/GuiaSidebar';
import GuiaIssuesSummary from '@/components/guia/GuiaIssuesSummary';
import { GUIA_CONTRATAR, getRelatedGuides } from '@/components/guia/guiaRoutes';
import { TOC_ITEMS, ISSUES, SKILLS } from '@/components/guia/guiaContent';

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
  const [activeId, setActiveId] = useState(TOC_ITEMS[0].id);

  useEffect(() => {
    const ids = TOC_ITEMS.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero editorial */}
      <header className="pt-28 lg:pt-32 pb-10" style={{ background: '#FAFBFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:opacity-80"
            style={{ color: '#64748B' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Recursos para atraer talento comercial
          </Link>

          <h1
            className="font-heading font-bold max-w-4xl mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0F172A' }}
          >
            5 problemas al atraer talento comercial y cómo resolverlos
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: '#4338CA' }}
            >
              K
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Equipo Kova</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Especialistas humanos en selección comercial B2B · Lectura de 12 min</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[21/9] max-h-[420px]" style={{ border: '1px solid #E2E8F0' }}>
            <img
              src="/images/guia-reunion-comercial.png"
              alt="Equipo comercial en reunión de resultados y pipeline"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 3-column body */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px] gap-10 xl:gap-14">

          <GuiaTableOfContents activeId={activeId} />

          <main className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0">
            <p className={`${prose} mb-8`} style={proseColor}>
              Muchas empresas asumen que atraer talento comercial es cuestión de identificar a los más extrovertidos o a quienes mejor cuentan su experiencia. Pero en B2B hay muchos más obstáculos: roles mal definidos, entrevistas que no predicen desempeño y evaluaciones genéricas que no miden ventas.
            </p>
            <p className={`${prose} mb-8`} style={proseColor}>
              Con presión por crecer el equipo comercial, elegir al perfil equivocado cuesta caro: rotación elevada, pipeline estancado y meses perdidos. En Kova abordamos esto con metodología propia y criterio humano especializado: identificamos el talento ideal para tu vacante, sin IA, sin automatismos, sin pruebas genéricas de RH.
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
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto min-h-[200px]">
                  <img
                    src="/images/guia-reunion-comercial.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <p className="font-heading font-bold text-lg mb-3 leading-snug" style={{ color: '#0F172A' }}>
                    Llenar vacantes comerciales no es tarea sencilla
                  </p>
                  <p className="text-base leading-relaxed mb-4" style={{ color: '#475569', lineHeight: 1.75 }}>
                    Las vacantes de ventas están entre las{' '}
                    <strong style={{ color: '#0F172A' }}>tres más difíciles de llenar</strong>{' '}
                    a nivel global. No es un problema de cantidad de candidatos: es un problema de{' '}
                    <strong style={{ color: '#0F172A' }}>criterio de evaluación</strong>.
                  </p>
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Fuente: estudios sectoriales de reclutamiento comercial · ManpowerGroup
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
              Kova aplica este enfoque con especialistas humanos: diagnosticamos la vacante, evaluamos competencias comerciales y entregamos un informe comparativo para que dirección comercial y talento humano decidan con el mismo criterio. Sin algoritmos ni calificación automática.
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
              El resultado es un informe pensado para quien decide: comparación clara, puntajes por competencia y recomendación sustentada por un evaluador especializado. Menos intuición, más criterio humano.
            </p>

            <GuiaIssuesSummary />

            {/* CTA inline */}
            <div
              className="mt-14 rounded-2xl p-8 lg:p-10 text-center"
              style={{ background: '#0F172A' }}
            >
              <h3 className="font-heading font-bold text-xl lg:text-2xl text-white mb-4 leading-tight">
                Hablemos de tu vacante comercial
              </h3>
              <p className="text-base mb-6 max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Agenda un diagnóstico sin costo con un especialista de Kova. Te orientamos sobre tu vacante en menos de 48 horas. Criterio humano, sin IA.
              </p>
              <Link
                to="/#acceso"
                className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white hover:opacity-95 transition-opacity"
                style={{ background: '#4338CA' }}
              >
                Agendar diagnóstico comercial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </main>

          <GuiaSidebar currentPath={GUIA_CONTRATAR} />
        </div>
      </div>

      {/* Mobile related + TOC */}
      <div className="xl:hidden border-t px-6 py-8 space-y-8" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Más recursos de Kova</p>
          <div className="space-y-4">
            {getRelatedGuides(GUIA_CONTRATAR).map(({ path, title, readTime }) => (
              <Link key={path} to={path} className="block rounded-xl p-4 bg-white" style={{ border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-semibold mb-0.5" style={{ color: '#4338CA' }}>{title}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Lectura de {readTime}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>En esta publicación</p>
          <div className="flex flex-wrap gap-2">
            {TOC_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs font-medium px-3 py-2 rounded-lg"
                style={{ background: '#FFFFFF', color: '#4338CA', border: '1px solid #E0E7FF' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
