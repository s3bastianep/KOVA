import GuiaPageLayout from '@/components/guia/GuiaPageLayout';
import {
  GuiaDivider,
  GuiaSectionTitle,
  GuiaProse,
  GuiaNumberedItem,
  GuiaCallout,
  GuiaArticleCTA,
  GuiaInlineImage,
} from '@/components/guia/GuiaArticleLayout';
import { GUIA_ROTACION } from '@/components/guia/guiaRoutes';
import { TOC_ROTACION } from '@/components/guia/guiaToc';

export default function GuiaRotacionComercial() {
  return (
    <GuiaPageLayout
      currentPath={GUIA_ROTACION}
      title="Cómo las señales débiles de contratación convierten la escasez comercial en rotación"
      readTime="14 min"
      heroImage="/images/guia-rotacion-hero.png"
      heroImageAlt="Profesional comercial en transición laboral por mala contratación"
      tocItems={TOC_ROTACION}
    >
        <GuiaProse>
          Muchas empresas viven un ciclo frustrante: les cuesta encontrar vendedores, contratan con prisa,
          el nuevo comercial no rinde y se va en pocos meses. La vacante queda abierta otra vez y el equipo
          absorbe la presión. El problema rara vez empieza en la inducción: empieza en la contratación.
        </GuiaProse>
        <GuiaProse>
          Cuando el proceso no valida competencias comerciales reales, las señales de alerta quedan ocultas hasta
          que la persona ya está en el rol. Ahí aparecen cuota incumplida, pipeline estancado y rotación que
          multiplica el costo de cada error.
        </GuiaProse>
        <GuiaProse>
          En Kova ayudamos a empresas a detectar esas señales débiles antes de contratar. Esta guía explica
          por qué ocurre la rotación comercial y cómo evaluar con criterio especializado reduce el riesgo.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="riesgo-rotacion">¿Qué es el riesgo de rotación comercial?</GuiaSectionTitle>
        <GuiaProse>
          El riesgo de rotación comercial es la probabilidad de que un vendedor recién contratado abandone el
          rol o sea desvincuido antes de ser productivo. No siempre significa que sea un mal profesional:
          muchas veces indica desajuste entre lo que la vacante exige y lo que el proceso evaluó.
        </GuiaProse>
        <GuiaProse>
          En ventas, la rotación puede triplicar la de otros roles. Cada salida temprana implica meses de
          inducción perdidos, oportunidades no cerradas y un equipo comercial que pierde confianza en el
          proceso de contratación.
        </GuiaProse>
        <GuiaProse>
          Kova aborda este riesgo desde el origen: diagnosticando la vacante, evaluando competencias comerciales
          y entregando un informe comparativo antes de que firmes la oferta.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="factores">Factores que influyen en el riesgo de abandono comercial</GuiaSectionTitle>
        <GuiaProse>
          Estos son los factores que más influyen cuando un comercial no encaja. Ignorarlos en la selección
          convierte una vacante difícil en un ciclo de rotación:
        </GuiaProse>

        <GuiaInlineImage
          src="/images/guia-rotacion-inline-1.png"
          alt="Ejecutiva comercial dejando el puesto por desajuste con el rol"
          caption="La rotación comercial temprana suele ser síntoma de un desajuste que el proceso de selección no detectó a tiempo."
        />

        <GuiaNumberedItem num={1} title="Desalineación de competencias comerciales">
          Cuando las habilidades del candidato no coinciden con lo que la vacante exige (prospección, venta
          consultiva, manejo de objeciones, ciclo de venta), la frustración aparece rápido. El vendedor no
          cierra, el gerente presiona y la relación se deteriora en semanas, no en años.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Tendencia de desempeño desde el inicio">
          Un comercial mal contratado muestra señales tempranas: pipeline vacío, seguimiento inconsistente,
          dificultad para calificar oportunidades. Sin evaluación previa por competencias, esas señales solo
          se ven cuando el daño ya está hecho.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Desconexión con el rol y la cuota">
          Si el candidato no entiende el mercado, el producto o el tipo de venta requerido, pierde motivación.
          La rotación comercial muchas veces refleja expectativas mal alineadas que una entrevista convencional
          no reveló.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Contexto del liderazgo comercial">
          La relación con el gerente comercial influye en la retención, pero contratar al perfil incorrecto
          genera microgestión, conflictos de estilo y desgaste del equipo. Empezar con el candidato equivocado
          hace casi imposible que el liderazgo compense.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Presión de compensación sin sustento de desempeño">
          Cuando se contrata por urgencia o por un buen discurso, el salario y la cuota quedan desconectados
          de la capacidad real del vendedor. Eso acelera la salida: el comercial no cumple, no gana lo esperado
          y busca otra oportunidad.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={6} title="Eventos de cambio en la organización">
          Reestructuraciones, cambios de territorio o nuevos productos exponen rápidamente las brechas de
          quien fue contratado sin evaluación rigurosa. El comercial que parecía viable en entrevista colapsa
          ante un contexto más exigente.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="habilidades-no-validadas">
          Cómo las competencias no validadas impulsan la rotación comercial
        </GuiaSectionTitle>

        <GuiaInlineImage
          src="/images/guia-rotacion-inline-2.png"
          alt="Gerente comercial bajo presión por vacante mal cubierta"
          caption="Contratar comercial sin validar competencias traslada la presión al equipo y acelera la rotación."
        />

        <GuiaProse>
          Cuando las competencias comerciales no se validan en la contratación, las deficiencias permanecen
          ocultas hasta que la persona está en el rol. Esto es lo que ocurre en la práctica:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Currículum e entrevista sobreestiman la capacidad">
          La hoja de vida y la entrevista sugieren competencia, pero no la demuestran en escenarios comerciales
          reales. Kova evalúa habilidades demostradas, no solo lo que el candidato declara que puede hacer.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Falta de evaluación específica para la vacante">
          Un hunter de prospección y un account manager requieren perfiles distintos. Aplicar el mismo filtro genérico
          a ambos roles genera desajustes predecibles y rotación evitable.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Brechas ocultas en roles comerciales especializados">
          En venta consultiva o ciclos largos, una brecha no detectada en prospección o manejo de objeciones
          frena todo el pipeline del vendedor y contamina la moral del equipo.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="consecuencias-organizacion">
          Consecuencias para la organización cuando no se valida el talento comercial
        </GuiaSectionTitle>
        <GuiaProse>
          Las empresas con alta rotación comercial no solo pierden vendedores: pierden momentum comercial.
          Estas son las consecuencias más frecuentes:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Vacantes que tardan más en recuperarse">
          Cada mala contratación reinicia el ciclo: nueva búsqueda, nueva inducción, nuevo periodo de
          ramp-up. La vacante permanece abierta más tiempo del necesario y el costo se acumula.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Capacidad del equipo comercial reducida">
          Un vendedor mal contratado consume tiempo del gerente, del equipo y de operaciones sin retorno.
          En papel el equipo está completo; en la práctica opera con menos capacidad real de cierre.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Bloqueo de crecimiento comercial">
          Sin un proceso que identifique talento comercial confiable, escalar el equipo se vuelve un riesgo.
          Cada nueva contratación es una apuesta en lugar de una decisión sustentada.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="escasez-en-rotacion">
          Cómo el desajuste de competencias convierte la escasez comercial en rotación
        </GuiaSectionTitle>
        <GuiaProse>
          Cuando no hay vendedores disponibles, la presión por llenar la vacante empuja a contratar rápido
          en lugar de contratar bien. Eso profundiza el problema:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Equipos comerciales sobrecargados">
          Mientras la vacante sigue abierta o mal cubierta, el resto del equipo absorbe cuota y territorio.
          El agotamiento aumenta y los mejores vendedores también empiezan a considerar salir.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Puestos clave que permanecen vacíos más tiempo">
          Una vacante con historial de rotación se vuelve menos atractiva para buenos candidatos. La escasez
          percibida crea un círculo: contratas mal, se van, y cuesta más atraer talento de calidad.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Desajustes repetidos erosionan la confianza en RH y comercial">
          Cuando las contrataciones fallan una y otra vez, dirección comercial deja de confiar en el proceso.
          Eso genera microgestión, entrevistas redundantes y decisiones cada vez más lentas.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Sin reserva interna de talento comercial">
          Sin evaluar competencias de forma consistente, la empresa no identifica perfiles internos ni
          construye pipeline de talento. Cada vacante depende de contratación externa improvisada.
        </GuiaNumberedItem>

        <GuiaCallout
          title="Cómo Kova reduce el riesgo de rotación comercial"
          items={[
            'Diagnóstico de vacante antes de evaluar candidatos.',
            'Evaluación por competencias comerciales específicas del rol.',
            'Informe comparativo con ranking y recomendación argumentada.',
            'Decisión documentada para que comercial y talento humano actúen con el mismo criterio.',
          ]}
        />

        <GuiaDivider />

        <GuiaSectionTitle id="detectar-antes">
          Detecta el riesgo de rotación antes de contratar comercial
        </GuiaSectionTitle>
        <GuiaProse>
          La rotación comercial no es inevitable. Es, en gran medida, predecible cuando el proceso de selección
          valida competencias antes de la oferta. Kova reemplaza señales débiles (buen discurso, CV llamativo,
          intuición del entrevistador) por evaluación comercial estructurada.
        </GuiaProse>
        <GuiaProse>
          El resultado: contratas vendedores con mayor probabilidad de éxito, reduces rotación temprana y
          conviertes una vacante difícil en una decisión informada. Menos ciclos repetidos, más pipeline estable.
        </GuiaProse>

        <GuiaArticleCTA
          title="Reduce la rotación comercial con evaluación especializada de Kova"
          description="Agenda un diagnóstico comercial sin costo. Te orientamos sobre tu vacante y cómo validar competencias antes de contratar, para que dejes de repetir el ciclo escasez-rotación-escasez."
          primaryLabel="Agendar diagnóstico comercial"
          primaryTo="/#acceso"
          secondaryLabel="Ver guía de evaluación comercial"
          secondaryTo="/guia-evaluacion-comercial"
        />

    </GuiaPageLayout>
  );
}
