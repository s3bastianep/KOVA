import GuiaPageLayout from '@/components/guia/GuiaPageLayout';
import {
  GuiaDivider,
  GuiaSectionTitle,
  GuiaProse,
  GuiaNumberedItem,
  GuiaCallout,
  GuiaArticleCTA,
} from '@/components/guia/GuiaArticleLayout';
import { GUIA_EVALUACION } from '@/components/guia/guiaRoutes';
import { TOC_EVALUACION } from '@/components/guia/guiaToc';

export default function GuiaEvaluacionComercial() {
  return (
    <GuiaPageLayout
      currentPath={GUIA_EVALUACION}
      title="La guía completa para la evaluación comercial"
      readTime="18 min"
      heroImage="/images/guia-evaluacion-comercial.png"
      heroImageAlt="Equipo comercial evaluando candidatos con datos y criterio"
      tocItems={TOC_EVALUACION}
    >
        {/* Intro */}
        <GuiaProse>
          Contratar comercial sin evaluar competencias es una apuesta. Entrevistas, referencias y años de experiencia
          no demuestran si alguien puede prospectar, manejar objeciones o cerrar en tu mercado. Por eso cada vez más
          empresas B2B están adoptando evaluación comercial especializada antes de tomar la decisión final.
        </GuiaProse>
        <GuiaProse>
          En Kova diseñamos procesos de selección comercial basados en competencias: medimos lo que la vacante exige,
          comparamos candidatos con el mismo criterio y entregamos un informe que facilita la decisión entre dirección
          comercial y talento humano.
        </GuiaProse>
        <GuiaProse>
          Esta guía explica por qué la evaluación comercial supera los métodos tradicionales, qué tipos de evaluación
          existen, cómo implementarlas y en qué momento del proceso conviene aplicarlas.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="evaluacion-vs-tradicional">
          Evaluación comercial frente a contratación tradicional
        </GuiaSectionTitle>
        <GuiaProse>
          La contratación tradicional se apoya en currículums, entrevistas conductuales y referencias. Funciona para
          roles donde el desempeño es difícil de medir antes de contratar, pero en ventas eso genera errores costosos:
          el candidato que mejor se vende en la entrevista no siempre es el que mejor vende en el campo.
        </GuiaProse>
        <GuiaProse>
          La evaluación comercial especializada invierte la lógica: primero se define qué competencias exige la vacante,
          luego se mide si el candidato las tiene. Kova aplica este enfoque para que la decisión se base en evidencia,
          no en corazonada ni en un buen discurso de 45 minutos.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="por-que-fracasan">
          ¿Por qué fracasan los métodos de contratación tradicionales en comercial?
        </GuiaSectionTitle>
        <GuiaProse>
          Estos son los cuatro problemas que vemos con más frecuencia cuando las empresas contratan vendedores sin
          evaluación por competencias:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Malos predictores del desempeño comercial">
          Preguntas genéricas de entrevista, como cuéntame de ti o dónde te ves en cinco años, no predicen cuota
          ni productividad. Un estudio de Leadership IQ encontró que el 46% de los nuevos empleados fracasan en
          los primeros 18 meses, en muchos casos por mala alineación al rol, no por falta de actitud.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Introduce sesgos en la contratación">
          Sin criterios objetivos, los evaluadores tienden a favorecer candidatos similares a ellos, graduados de
          ciertas universidades o con experiencia en empresas reconocidas. Eso reduce diversidad de perfiles y pasa
          por alto talento comercial con el ADN correcto para la vacante.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Los currículums pueden ser engañosos">
          Investigaciones de ResumeLab indican que hasta el 70% de candidatos ha mentido o exagerado en su hoja de
          vida. En comercial, donde los resultados son cuantificables, confiar solo en lo que dice el CV multiplica
          el riesgo de contratar a alguien que no puede cumplir lo que prometió en papel.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Procesos de contratación lentos y costosos">
          Múltiples rondas de entrevista sin criterio claro alargan el ciclo y aumentan el costo por vacante. Mientras
          tanto, los mejores candidatos aceptan otras ofertas. Un proceso estructurado con evaluación comercial reduce
          iteraciones y acelera la decisión.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="beneficios">
          5 beneficios de la evaluación comercial con Kova
        </GuiaSectionTitle>
        <GuiaProse>
          Cuando la evaluación está diseñada para ventas y alineada a la vacante, el impacto en el negocio es directo:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Datos completos y objetivos para decidir">
          Recibes puntajes por competencia, comparación entre candidatos y sustento documentado. Dirección comercial y
          talento humano trabajan con la misma información, no con impresiones distintas de la misma entrevista.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Decisiones de contratación más precisas">
          Kova evalúa prospección, venta consultiva, manejo de objeciones y orientación al logro según lo que exige
          tu vacante. Contratas sabiendo quién tiene mayor probabilidad de desempeñarse, no quién mejor performó en
          una conversación de 30 minutos.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Ciclos de contratación más rápidos y rentables">
          Un informe comparativo reduce rondas innecesarias y acelera la terna final. Menos tiempo vacante, menos costo
          por contratación y menos presión sobre el equipo que ya está cubriendo la cuota.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Mejor experiencia para candidatos y empresa">
          Los candidatos pasan por un proceso estructurado y transparente. La empresa proyecta seriedad y criterio
          profesional, lo cual atrae mejor talento comercial en un mercado competitivo.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Equipo comercial más sólido a largo plazo">
          Contratar bien reduce rotación temprana, que en ventas puede triplicar la de otros roles. Cada acierto de
          contratación se traduce en pipeline más estable y menos costos de reemplazo.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="tipos-evaluacion">
          Tipos de evaluación comercial que aplica Kova
        </GuiaSectionTitle>
        <GuiaProse>
          No todas las evaluaciones sirven para comercial. Estas son las dimensiones que Kova integra según la vacante:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Competencias comerciales específicas">
          Venta consultiva, prospección, negociación, manejo de objeciones y cierre. Cada vacante activa las competencias
          relevantes: un SDR no se evalúa igual que un account manager ni que un director comercial.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Ajuste al contexto de la vacante">
          Tipo de cliente, ciclo de venta, ticket promedio y modelo comercial. Un hunter B2B y un farmer de cuentas
          requieren perfiles distintos aunque ambos se llamen ejecutivos comerciales.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Simulación de escenarios comerciales">
          Situaciones reales del rol: presentar propuesta, responder objeciones, priorizar pipeline. Medimos desempeño
          en contexto, no solo autopercepción del candidato.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Habilidades blandas críticas en ventas">
          Comunicación, resiliencia, orientación al logro y gestión del tiempo. LinkedIn sitúa ventas entre las
          habilidades más demandadas; en comercial, blandas y técnicas van juntas.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Juicio situacional comercial">
          Cómo reacciona el candidato ante escenarios típicos del rol: cliente indeciso, competidor agresivo, meta
          exigente. Predice comportamiento futuro mejor que preguntas teóricas de entrevista.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="como-crear">
          Cómo Kova diseña una evaluación comercial eficaz
        </GuiaSectionTitle>
        <GuiaProse>
          Nuestra metodología sigue cinco pasos estructurados para que la evaluación tenga validez y utilidad real
          para quien decide:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Diagnosticar la vacante">
          Entendemos contexto comercial, perfil de cliente, expectativas de desempeño y criterios de éxito del rol.
          Sin este paso, cualquier evaluación es genérica.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Definir competencias clave">
          Traducimos la vacante en competencias medibles: qué debe demostrar un candidato para tener éxito en los
          primeros 90 días y en el año.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Estructurar la evaluación">
          Diseñamos el proceso para fluir de lo general a lo específico, sin fatigar al candidato ni al equipo
          evaluador. Cada etapa tiene un propósito claro.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Establecer criterios de puntuación">
          Puntajes por competencia, comparación entre candidatos y umbrales de recomendación. La decisión deja de ser
          subjetiva y pasa a estar documentada.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Entregar informe y terna argumentada">
          Reporte listo para dirección comercial y talento humano, con ranking, conclusiones y recomendación de
          terna final para avanzar a entrevista con confianza.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="cuando-implementar">
          ¿En qué etapa del proceso conviene evaluar comercialmente?
        </GuiaSectionTitle>
        <GuiaProse>
          Kova recomienda aplicar la evaluación comercial en el momento que maximice precisión sin alargar innecesariamente
          el ciclo:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Etapa temprana: preselección">
          Ideal para filtrar candidatos antes de entrevistas costosas. Identificas rápidamente quién tiene el perfil
          comercial base y quién no justifica seguir en el proceso.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Etapa intermedia: después del screening">
          Cuando ya redujiste el volumen, la evaluación profundiza en competencias específicas y genera el comparativo
          que alimenta la terna final.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Etapa final: antes de la oferta">
          Confirma que el candidato elegido tiene el sustento evaluativo para respaldar la decisión ante dirección
          y reduce el riesgo de arrepentimiento post-contratación.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="validez">
          Cómo Kova garantiza validez en la evaluación comercial
        </GuiaSectionTitle>
        <GuiaProse>
          Una evaluación solo genera confianza si mide lo que dice medir. Estos son los principios que aplicamos:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Validez aparente">
          La evaluación se ve y se siente relevante para el rol comercial. Candidatos y evaluadores reconocen que
          las pruebas están conectadas con el trabajo real.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Validez de constructo">
          Medimos competencias comerciales reales, no proxies como extroversión o carisma. Lo evaluado corresponde
          a lo que la vacante exige.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Validez de contenido">
          Expertos en selección comercial definen qué se evalúa y cómo. El contenido refleja las demandas actuales
          del mercado B2B latinoamericano.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Validez predictiva">
          El objetivo final es predecir desempeño comercial. Por eso priorizamos escenarios y competencias con
          correlación directa con resultados en el rol.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="consejos">
          5 consejos para una evaluación comercial eficaz
        </GuiaSectionTitle>

        <GuiaNumberedItem num={1} title="Evalúa solo las competencias que la vacante exige">
          Más preguntas no significa mejor evaluación. Kova concentra el proceso en lo que impacta el desempeño
          del rol, evitando ruido y fatiga evaluativa.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Usa escenarios del mundo real">
          Situaciones de prospección, objeciones y cierre del sector del cliente predicen mejor que preguntas
          hipotéticas genéricas.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Compara candidatos con el mismo criterio">
          Un puntaje sin contexto no sirve. El valor está en el ranking comparativo: quién destaca y por qué, con
          el mismo marco para todos.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Involucra a dirección comercial desde el diagnóstico">
          Talento humano y comercial deben alinear criterios desde el inicio. Kova facilita ese lenguaje común
          antes de evaluar a nadie.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Documenta la decisión">
          Un informe argumentado protege la calidad de la contratación y permite aprender de cada proceso para
          mejorar el siguiente.
        </GuiaNumberedItem>

        <GuiaCallout
          title="Buenas prácticas de evaluación comercial · Kova"
          items={[
            'Define la vacante antes de abrir filtros de candidatos.',
            'No confíes en entrevistas solas para roles de venta.',
            'Compara siempre entre candidatos con el mismo criterio.',
            'Entrega a dirección un informe, no solo una recomendación verbal.',
            'Mide competencias comerciales específicas, no pruebas genéricas de RH.',
          ]}
        />

        <GuiaArticleCTA
          title="Contrata comercial con confianza usando la evaluación de Kova"
          description="Kova ayuda a empresas B2B a evaluar candidatos comerciales con criterio especializado: diagnóstico de vacante, evaluación por competencias e informe comparativo para decidir con evidencia, no con intuición."
          primaryLabel="Agendar diagnóstico comercial"
          primaryTo="/#acceso"
          secondaryLabel="Ver cómo funciona Kova"
          secondaryTo="/#proceso"
        />

    </GuiaPageLayout>
  );
}
