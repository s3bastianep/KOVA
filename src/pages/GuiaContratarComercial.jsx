import GuiaPageLayout from '@/components/guia/GuiaPageLayout';
import GuiaIssuesSummary from '@/components/guia/GuiaIssuesSummary';
import {
  GuiaSectionTitle,
  GuiaProse,
  GuiaQuote,
  GuiaIssueBlock,
  GuiaFeatureCard,
  GuiaSkillGrid,
  GuiaCtaBand,
} from '@/components/guia/GuiaArticleLayout';
import { GUIA_CONTRATAR } from '@/components/guia/guiaRoutes';
import { TOC_CONTRATAR } from '@/components/guia/guiaToc';
import { ISSUES, SKILLS } from '@/components/guia/guiaContent';

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
      <GuiaProse lead>
        Muchas empresas asumen que atraer talento comercial es cuestión de identificar a los más extrovertidos o a
        quienes mejor cuentan su experiencia. Pero en selección comercial hay muchos más obstáculos: roles mal
        definidos, entrevistas que no predicen desempeño y evaluaciones genéricas que no miden ventas.
      </GuiaProse>
      <GuiaProse>
        Con presión por crecer el equipo comercial, elegir al perfil equivocado cuesta caro: rotación elevada,
        pipeline estancado y meses perdidos. En Kova abordamos esto con metodología propia y especialistas en
        selección comercial: identificamos el talento ideal para tu vacante, sin pruebas genéricas de RH.
      </GuiaProse>
      <GuiaProse>
        En este artículo repasamos los cinco problemas más comunes y cómo resolverlos con selección basada en
        competencias comerciales.
      </GuiaProse>

      <GuiaSectionTitle id="por-que-es-dificil">¿Por qué es difícil contratar comercial?</GuiaSectionTitle>
      <GuiaProse>
        Toda empresa exitosa depende de un equipo comercial capaz de convertir oportunidades en ingresos. Sin
        embargo, las vacantes de ventas están entre las más difíciles de llenar: no por falta de candidatos, sino
        porque el proceso habitual no demuestra quién realmente puede desempeñar el rol.
      </GuiaProse>
      <GuiaProse>
        La presión por cumplir cuota, los ciclos de venta largos y la necesidad de combinar habilidades técnicas con
        capacidad de relacionamiento hacen que contratar comercial sea un reto distinto al de otros roles corporativos.
      </GuiaProse>

      <GuiaQuote>
        Las empresas que más crecen necesitan equipos comerciales más grandes, pero escalar contratando a ciegas
        multiplica el costo de cada error.
      </GuiaQuote>

      <GuiaProse>
        Además, estereotipos sobre la profesión comercial y la exigencia de resultados inmediatos hacen que menos
        personas se acerquen al sector, mientras la demanda de talento sigue subiendo. La buena noticia: cada uno de
        estos problemas tiene solución cuando el proceso está diseñado para ventas.
      </GuiaProse>

      <GuiaFeatureCard
        image="/images/guia-reunion-comercial.png"
        imageAlt="Equipo comercial revisando pipeline y criterios de evaluación"
        badge="Dato del sector"
        title="Atraer talento comercial exige más que publicar una vacante"
        source="Fuente: estudios sectoriales de selección comercial · ManpowerGroup"
        stats={[
          { value: 'Top 3', label: 'Vacantes más difíciles' },
          {
            value: 'El criterio marca la diferencia',
            label: 'Evaluar bien reduce rotación y acelera la productividad del equipo',
            wide: true,
          },
        ]}
      >
        <p>
          Las vacantes de ventas están entre las <strong>tres más difíciles de cubrir</strong> a nivel global. No falta
          gente postulando: falta un proceso que identifique quién tiene el perfil y las competencias que tu rol
          realmente exige.
        </p>
      </GuiaFeatureCard>

      <GuiaSectionTitle id="cinco-problemas">
        5 problemas comunes que enfrentan las empresas al contratar comercial
      </GuiaSectionTitle>
      <GuiaProse>
        Estos desafíos aparecen en casi todo proceso de selección comercial. Ignorarlos o no reconocerlos lleva a
        contrataciones costosas que se repiten ciclo tras ciclo.
      </GuiaProse>

      {ISSUES.map((issue) => (
        <GuiaIssueBlock
          key={issue.id}
          id={issue.id}
          num={issue.num}
          title={issue.title}
          paragraphs={issue.paragraphs}
          solution={issue.solution}
        />
      ))}

      <GuiaSectionTitle id="seleccion-competencias">
        ¿Es la selección por competencias la solución para contratar el equipo comercial correcto?
      </GuiaSectionTitle>
      <GuiaProse>
        Sí, cuando está diseñada para ventas. La selección basada en competencias no descarta candidatos por su
        historial: mide si pueden hacer el trabajo en tu contexto. Eso incluye prospectar, comunicar valor, manejar
        objeciones, negociar y cerrar.
      </GuiaProse>
      <GuiaProse>
        En comercial, las habilidades blandas son tan relevantes como las técnicas: gestión, comunicación, orientación
        al cliente, liderazgo y resiliencia suelen estar entre las más demandadas. Pero medirlas requiere un enfoque
        específico del rol, no pruebas genéricas.
      </GuiaProse>
      <GuiaProse>
        Kova aplica este enfoque con especialistas en selección comercial: diagnosticamos la vacante, evaluamos
        competencias comerciales y entregamos un informe comparativo para que dirección comercial y talento humano
        decidan con el mismo criterio.
      </GuiaProse>

      <GuiaSectionTitle id="seis-competencias">
        6 competencias clave que debes evaluar al contratar comercial
      </GuiaSectionTitle>
      <GuiaProse>
        Ya sea SDR, ejecutivo comercial, account manager o director comercial, estas capacidades son centrales en casi
        toda vacante comercial. Kova las evalúa en función de lo que cada rol exige.
      </GuiaProse>

      <GuiaSkillGrid items={SKILLS} />

      <GuiaSectionTitle id="como-transforma">
        Cómo una evaluación comercial especializada transforma tu proceso de contratación
      </GuiaSectionTitle>
      <GuiaProse>
        Menos de una cuarta parte de los representantes de ventas supera su cuota de forma consistente. La rotación en
        el sector puede triplicar la de otros roles. Eso convierte cada mala contratación en un costo directo para el
        negocio.
      </GuiaProse>
      <GuiaProse>
        Una evaluación comercial bien diseñada coloca al candidato en escenarios reales del rol: prospección,
        presentación de propuesta, manejo de objeciones y cierre. No se trata de saber si caen bien en la entrevista,
        sino de comparar desempeño con criterio.
      </GuiaProse>
      <GuiaProse>
        En Kova, el proceso cubre distintos perfiles comerciales (SDR, ejecutivo, account manager) con el mismo rigor
        metodológico: entender la vacante, definir competencias, evaluar candidatos y presentar una terna argumentada.
      </GuiaProse>
      <GuiaProse>
        El resultado es un informe pensado para quien decide: comparación clara, puntajes por competencia y
        recomendación sustentada por un evaluador especializado.
      </GuiaProse>

      <GuiaIssuesSummary />

      <GuiaCtaBand
        eyebrow="Siguiente paso"
        title="Identifiquemos el talento comercial ideal para tu vacante"
        description="Contáctanos. Un especialista de Kova revisa tu contexto comercial y te presenta una propuesta con perfil, alcance y cotización."
        ctaLabel="Contáctanos"
        ctaTo="/contacto"
      />
    </GuiaPageLayout>
  );
}
