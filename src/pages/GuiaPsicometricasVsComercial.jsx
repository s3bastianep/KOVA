import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import {
  GuiaHeroSplit,
  GuiaDivider,
  GuiaSectionTitle,
  GuiaProse,
  GuiaNumberedItem,
  GuiaCallout,
  GuiaArticleCTA,
  GuiaArticleShell,
  GuiaInlineImage,
} from '@/components/guia/GuiaArticleLayout';
import { GUIA_PSICOMETRICAS } from '@/components/guia/guiaRoutes';

export default function GuiaPsicometricasVsComercial() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <GuiaHeroSplit
        label="Recursos para la contratación"
        title="Pruebas psicométricas frente a evaluación comercial: ¿Cuál predice mejor el desempeño?"
        readTime="16 minutos"
        image="/images/guia-psicometricas-hero.png"
        imageAlt="Profesionales en evaluación comercial de candidatos"
      />

      <GuiaArticleShell currentPath={GUIA_PSICOMETRICAS}>
        <GuiaProse>
          Contratar comercial es una de las decisiones con mayor impacto en ingresos. Sin embargo, muchas empresas
          siguen apoyándose en pruebas psicométricas genéricas, entrevistas subjetivas y currículums que no demuestran
          si alguien realmente puede vender en su contexto.
        </GuiaProse>
        <GuiaProse>
          El costo de una mala contratación comercial no es solo el salario mal invertido: es pipeline estancado,
          rotación elevada y meses perdidos antes de reconocer el error. Por eso cada vez más organizaciones B2B
          están reemplazando métodos genéricos por evaluación comercial especializada.
        </GuiaProse>
        <GuiaProse>
          En esta guía comparamos las pruebas psicométricas tradicionales con la evaluación comercial que aplica Kova,
          y explicamos cuál predice mejor el desempeño real en roles de venta.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="que-son-psicometricas">¿Qué son las pruebas psicométricas?</GuiaSectionTitle>
        <GuiaProse>
          Las pruebas psicométricas miden rasgos de personalidad, aptitudes cognitivas o comportamientos generales
          mediante cuestionarios estandarizados. Se usan ampliamente en reclutamiento porque prometen objetividad
          y comparabilidad entre candidatos.
        </GuiaProse>
        <GuiaProse>
          En la práctica, suelen aplicarse como filtro temprano: el candidato responde un cuestionario, recibe un
          perfil (por ejemplo, extrovertido, analítico, orientado al detalle) y el reclutador decide si avanza o no.
        </GuiaProse>
        <GuiaProse>
          El problema en comercial es que estos tests fueron diseñados para roles generales, no para medir prospección,
          manejo de objeciones, venta consultiva ni cierre en un mercado B2B específico.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="limites-psicometricas">
          Los límites de las pruebas psicométricas en selección comercial
        </GuiaSectionTitle>

        <GuiaInlineImage
          src="/images/guia-seleccion-digital.png"
          alt="Selección de talento comercial con criterio objetivo"
          caption="Contratar comercial requiere identificar quién puede desempeñar el rol, no solo quién encaja en un perfil psicológico genérico."
        />

        <GuiaProse>
          Usar pruebas psicométricas para contratar vendedores puede parecer riguroso, pero en comercial presenta
          limitaciones serias que afectan la calidad de la contratación:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Baja correlación con el desempeño comercial">
          Meta-análisis de investigación en selección de personal muestran que muchas pruebas de personalidad tienen
          una correlación limitada con el desempeño laboral real. En ventas, donde los resultados son cuantificables,
          contratar por rasgos genéricos como extroversión ignora competencias críticas como prospección consultiva
          o manejo de objeciones complejas.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Riesgo de sesgo en la interpretación">
          Los resultados psicométricos dependen de cómo los interpreta cada evaluador. Sin criterios comerciales
          claros, es fácil favorecer perfiles que se parecen al entrevistador o encajan con estereotipos de
          vendedor, descartando talento con potencial real para la vacante.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Mala experiencia del candidato comercial">
          Candidatos con experiencia en ventas suelen percibir cuestionarios genéricos como irrelevantes para el rol.
          Eso daña la percepción de la empresa, reduce el interés de buenos perfiles y proyecta un proceso poco
          profesional para un cargo estratégico.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Información autodeclarada, no demostrada">
          Las pruebas psicométricas capturan cómo el candidato se percibe o cómo responde en un test, no cómo
          performa en escenarios comerciales reales. Un vendedor puede tener un perfil psicológico atractivo
          y aun así no cerrar una sola oportunidad en los primeros 90 días.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="que-es-evaluacion-kova">¿Qué es la evaluación comercial de Kova?</GuiaSectionTitle>
        <GuiaProse>
          La evaluación comercial de Kova mide competencias específicas del rol: venta consultiva, prospección,
          manejo de objeciones, orientación al logro y ajuste al contexto de la vacante. No pregunta quién eres
          en abstracto; evalúa si puedes desempeñar este rol comercial en esta empresa.
        </GuiaProse>
        <GuiaProse>
          El proceso parte de un diagnóstico de vacante, define criterios medibles, evalúa candidatos con el mismo
          marco y entrega un informe comparativo con ranking y recomendación argumentada para dirección comercial
          y talento humano.
        </GuiaProse>
        <GuiaProse>
          Es selección basada en competencias comerciales, diseñada para roles donde el desempeño se traduce
          directamente en ingresos.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="como-supera">
          Cómo la evaluación comercial de Kova supera a las pruebas psicométricas
        </GuiaSectionTitle>

        <GuiaNumberedItem num={1} title="Fuerte validez predictiva para ventas">
          Kova evalúa competencias directamente ligadas al desempeño comercial: prospectar, comunicar valor,
          negociar y cerrar. Eso tiene mayor relación con resultados en el rol que un perfil de personalidad
          genérico aplicado a cualquier vacante.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Medida directa de ajuste al puesto">
          Cada evaluación se calibra a la vacante: tipo de cliente, ciclo de venta, ticket y modelo comercial.
          Un SDR, un ejecutivo B2B y un account manager no se evalúan con el mismo cuestionario genérico.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Sesgo reducido con criterios objetivos">
          Puntajes por competencia, comparación entre candidatos y sustento documentado reducen la dependencia
          de impresiones subjetivas en la entrevista. Dirección comercial y talento humano deciden con la misma
          evidencia.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Experiencia profesional para el candidato">
          El candidato percibe un proceso serio, alineado al rol que aspira. Eso mejora la percepción de la
          marca empleadora y atrae mejor talento comercial en un mercado competitivo.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={5} title="Informe accionable para la decisión">
          No recibes solo un puntaje abstracto. Recibes ranking comparativo, conclusiones por competencia y
          recomendación de terna final lista para compartir con quien toma la decisión.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={6} title="Defensa documentada de la contratación">
          Cuando la decisión está sustentada en evaluación comercial estructurada, reduces el riesgo de
          arrepentimiento post-contratación y facilitas auditoría interna del proceso de selección.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="roi">
          El retorno de invertir en evaluación comercial para tu organización
        </GuiaSectionTitle>
        <GuiaProse>
          Reemplazar pruebas genéricas por evaluación comercial especializada no es un gasto de RH: es una
          inversión directa en la calidad del equipo que genera ingresos. Estos son los impactos que vemos
          en empresas B2B:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Mejor retención del talento comercial">
          Contratar al perfil correcto desde el inicio reduce rotación temprana, que en ventas puede triplicar
          la de otros roles. Menos reemplazos significa pipeline más estable y menos costos de inducción repetidos.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={2} title="Ciclos de contratación más rápidos">
          Un informe comparativo elimina rondas innecesarias de entrevista y acelera la terna final. La vacante
          deja de estar abierta meses mientras el equipo comercial cubre con recursos limitados.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={3} title="Decisiones más equitativas y consistentes">
          Criterios objetivos por competencia reducen favoritismos y estereotipos sobre qué perfil encaja en
          ventas. Evalúas desempeño potencial, no apariencia de vendedor en una entrevista de 30 minutos.
        </GuiaNumberedItem>
        <GuiaNumberedItem num={4} title="Proceso escalable para crecer el equipo comercial">
          Cuando la metodología está definida, puedes replicarla en nuevas vacantes, mercados y roles comerciales
          sin depender de la intuición de un solo evaluador.
        </GuiaNumberedItem>

        <GuiaCallout
          title="Lo que Kova evalúa vs. lo que no evalúa"
          items={[
            'Sí: prospección, venta consultiva, manejo de objeciones, orientación al logro y ajuste a la vacante.',
            'No: extroversión genérica, tipos de personalidad abstractos ni preguntas irrelevantes para el rol.',
            'Resultado: un informe que predice desempeño comercial, no un label psicológico.',
          ]}
        />

        <GuiaDivider />

        <GuiaSectionTitle id="conclusion">
          Predice el desempeño comercial real con la evaluación de Kova
        </GuiaSectionTitle>
        <GuiaProse>
          Las pruebas psicométricas pueden aportar datos generales sobre personalidad, pero no fueron diseñadas
          para predecir quién vende bien en tu mercado, con tu producto y tu tipo de cliente.
        </GuiaProse>
        <GuiaProse>
          Kova se especializa en evaluación comercial por competencias: diagnosticamos la vacante, medimos
          habilidades relevantes, comparamos candidatos y entregamos la recomendación que necesitas para
          contratar con confianza. Menos corazonada, más criterio de experto.
        </GuiaProse>

        <GuiaArticleCTA
          title="Contrata comercial con evaluación que sí predice desempeño"
          description="Agenda un diagnóstico comercial sin costo. Te mostramos cómo la metodología Kova reemplaza pruebas genéricas por evaluación especializada alineada a tu vacante."
          primaryLabel="Agendar diagnóstico comercial"
          primaryTo="/#acceso"
          secondaryLabel="Leer guía de evaluación comercial"
          secondaryTo="/guia-evaluacion-comercial"
        />

      </GuiaArticleShell>

      <Footer />
    </div>
  );
}
