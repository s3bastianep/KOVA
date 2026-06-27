import GuiaPageLayout from '@/components/guia/GuiaPageLayout';
import {
  GuiaDivider,
  GuiaSectionTitle,
  GuiaProse,
  GuiaNumberedItem,
  GuiaCallout,
  GuiaArticleCTA,
} from '@/components/guia/GuiaArticleLayout';
import { GUIA_HABILIDADES } from '@/components/guia/guiaRoutes';
import { TOC_HABILIDADES } from '@/components/guia/guiaToc';

export default function GuiaHabilidadesBlandasComercial() {
  return (
    <GuiaPageLayout
      currentPath={GUIA_HABILIDADES}
      title="Guía para líderes comerciales: cómo evaluar habilidades blandas en la contratación por competencias"
      readTime="15 min"
      heroImage="/images/guia-habilidades-hero.png"
      heroImageAlt="Equipo comercial colaborando: evaluación de habilidades blandas en conjunto"
      tocItems={TOC_HABILIDADES}
    >
        <GuiaProse>
          Contratar comercial exige medir mucho más que años de experiencia o cuota alcanzada en el pasado. Las
          habilidades blandas (comunicación, resiliencia, orientación al cliente, trabajo en equipo) determinan si
          un vendedor sostiene pipeline, maneja objeciones y cierra en tu mercado. El problema es que la mayoría
          de los procesos no las evalúa con rigor.
        </GuiaProse>
        <GuiaProse>
          Si eres líder comercial o de talento humano, necesitas un sistema de evaluación justo y objetivo que
          mida competencias reales, no impresiones de una entrevista de 45 minutos. En Kova abordamos esto con
          metodología especializada: evaluación por competencias, sin pruebas genéricas de RH.
        </GuiaProse>
        <GuiaProse>
          En esta guía explicamos qué son las habilidades blandas comerciales, por qué cuesta evaluarlas, cómo
          hacerlo con contratación basada en competencias y qué errores evitar al seleccionar vendedores.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="que-son">
          ¿Qué son las habilidades blandas comerciales y por qué importan?
        </GuiaSectionTitle>
        <GuiaProse>
          Las habilidades blandas son capacidades interpersonales y de comportamiento que influyen en cómo una
          persona trabaja, se comunica y colabora. A diferencia de habilidades técnicas (conocimiento de CRM,
          técnicas de cierre, manejo de producto), no se miden con un certificado ni con años en el currículum.
        </GuiaProse>
        <GuiaProse>
          En ventas B2B, estas competencias son decisivas. Un ejecutivo comercial puede dominar el producto y
          aun así fracasar si no escucha al cliente, no gestiona el rechazo o no sabe construir relaciones a
          largo plazo. Por eso las habilidades blandas suelen diferenciar a quienes superan cuota de forma
          consistente de quienes dependen de un buen trimestre aislado.
        </GuiaProse>

        <GuiaCallout
          title="Habilidades blandas clave en roles comerciales"
          items={[
            'Comunicación efectiva: escuchar, presentar valor y adaptar el mensaje al interlocutor.',
            'Resiliencia comercial: sostener motivación ante rechazos y ciclos de venta largos.',
            'Orientación al cliente: entender necesidades reales antes de empujar una propuesta.',
            'Negociación y manejo de objeciones: resolver tensiones sin perder la relación.',
            'Trabajo en equipo: coordinarse con marketing, operaciones y postventa.',
            'Adaptabilidad: responder a cambios de mercado, producto o estrategia comercial.',
          ]}
        />

        <GuiaProse>
          Estas cualidades influyen en cómo un candidato enfrenta desafíos, se adapta a la cultura de la empresa
          y colabora con el resto del equipo comercial. Ignorarlas al contratar aumenta rotación, estanca el
          pipeline y multiplica el costo de cada error de selección.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="por-que-es-dificil">
          ¿Por qué es difícil evaluar habilidades blandas al contratar comercial?
        </GuiaSectionTitle>
        <GuiaProse>
          Evaluar habilidades técnicas es relativamente directo: puedes revisar historial, pedir casos concretos
          o simular una demo de producto. Las habilidades blandas, en cambio, dependen del contexto, son difíciles
          de cuantificar y los candidatos comerciales, por naturaleza del rol, suelen responder con discursos
          ensayados que suenan convincentes pero no demuestran desempeño real.
        </GuiaProse>

        <GuiaCallout
          title="Por qué las empresas fallan al medir habilidades blandas"
          items={[
            'Dependen del contexto: lo que funciona con un cliente enterprise no es igual que con Pymes.',
            'Los candidatos comerciales dominan la entrevista: comunican bien porque es su oficio.',
            'No hay certificación estándar: a diferencia de habilidades técnicas, no existe un diploma de resiliencia.',
            'Las preguntas genéricas no predicen: cuéntame de ti no revela manejo de objeciones ni cierre.',
            'Pruebas de personalidad miden rasgos, no ventas: un buen perfil psicométrico no garantiza cuota.',
          ]}
        />

        <GuiaProse>
          Estudios de reclutamiento señalan que más de la mitad de los responsables de talento consideran
          difícil evaluar habilidades blandas con los métodos tradicionales. En comercial, ese porcentaje sube
          porque el propio rol entrena a los candidatos para parecer competentes sin demostrarlo.
        </GuiaProse>

        <GuiaDivider />

        <GuiaSectionTitle id="como-evaluar">
          Cómo evaluar habilidades blandas en la contratación por competencias
        </GuiaSectionTitle>
        <GuiaProse>
          La contratación basada en competencias no pregunta si alguien es extrovertido o carismático. Define
          qué comportamientos exige la vacante y mide si el candidato los demuestra. Para roles comerciales,
          eso implica escenarios reales del puesto, criterios comparables y evaluación por especialistas, no
          impresiones subjetivas del entrevistador.
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Evaluaciones de comportamiento comercial">
          Las evaluaciones de comportamiento miden cómo un candidato actúa en situaciones de venta reales:
          prospección, presentación de propuesta, manejo de objeciones y cierre. En Kova, un especialista
          observa y califica cada competencia con rúbricas definidas para la vacante, no con preguntas genéricas
          de RH.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={2} title="Preguntas y escenarios basados en situaciones reales">
          Los tests de juicio situacional presentan escenarios concretos del rol: un cliente frustrado por un
          retraso, un prospecto que compara con la competencia, un pipeline estancado a fin de mes. La clave no
          es la respuesta teórica, sino cómo razona, comunica y prioriza bajo presión comercial.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={3} title="Rúbricas estructuradas para calificar competencias">
          Sin criterios claros, cada entrevistador evalúa distinto. Una rúbrica desglosa cada habilidad blanda
          en indicadores observables: claridad al explicar valor, escucha activa, manejo emocional ante rechazo.
          Kova califica cada candidato con la misma escala para que la comparación sea justa y defendible ante
          dirección comercial.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={4} title="Evaluación por pares y múltiples observadores">
          Incorporar la perspectiva de más de un evaluador (idealmente alguien con experiencia comercial) reduce
          sesgos individuales y enriquece la lectura del candidato. Meta-análisis de investigación en selección
          confirman que evaluaciones estructuradas con múltiples fuentes predicen mejor el desempeño laboral
          que entrevistas informales.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={5} title="Muestras de trabajo en contexto comercial">
          Pedir al candidato que presente una propuesta, simule una llamada de prospección o responda a un caso
          de cliente real ofrece evidencia tangible de estilo, creatividad y atención al detalle. No sustituye
          la evaluación completa, pero complementa la entrevista con comportamiento observable.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={6} title="Observar señales a lo largo de todo el proceso">
          Las habilidades blandas se manifiestan en cada interacción: puntualidad, tono en correos, preguntas
          que hace sobre el rol, reacción ante feedback. Un proceso bien diseñado captura esas señales de forma
          sistemática, no como impresión aislada de un solo encuentro.
        </GuiaNumberedItem>

        <GuiaDivider />

        <GuiaSectionTitle id="errores-comunes">
          Errores comunes al evaluar habilidades blandas en comercial
        </GuiaSectionTitle>
        <GuiaProse>
          Estos son los fallos que vemos con más frecuencia cuando las empresas intentan medir competencias
          interpersonales sin un marco claro:
        </GuiaProse>

        <GuiaNumberedItem num={1} title="Basarse en entrevistas no estructuradas">
          Sin guion ni criterios, cada entrevista es distinta y las comparaciones entre candidatos pierden
          validez. Además, aumenta el sesgo: el evaluador favorece al que le cae bien, no al que demuestra
          competencias comerciales.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={2} title="Depender de pruebas de personalidad genéricas">
          Los tests psicométricos miden rasgos generales, no desempeño en ventas. Un candidato puede tener un
          perfil extrovertido y aun así no saber prospectar en B2B consultivo. Deben complementarse, no
          reemplazar, evaluaciones de comportamiento comercial específicas del rol.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={3} title="Hacer solo preguntas hipotéticas">
          ¿Qué harías si un cliente te rechazara tres veces? invita respuestas ensayadas. Las preguntas
          conductuales (cuéntame la última vez que perdiste una venta importante y qué hiciste) obligan al
          candidato a demostrar experiencia real, no teoría.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={4} title="No reducir el sesgo en la evaluación">
          Sesgos de afinidad, confirmación o similitud distorsionan la calificación de habilidades blandas
          más que la de habilidades técnicas. Rúbricas, evaluadores capacitados y comparación estandarizada
          entre candidatos son la defensa más efectiva.
        </GuiaNumberedItem>

        <GuiaNumberedItem num={5} title="Sobrecargar al candidato con demasiadas etapas">
          Más pruebas no significa mejor evaluación. Un proceso excesivo agota candidatos de calidad y no
          necesariamente mejora la predicción. Lo importante es medir las competencias que la vacante realmente
          exige, con el rigor suficiente para decidir con confianza.
        </GuiaNumberedItem>

        <GuiaCallout
          title="Cómo lo aborda Kova"
          items={[
            'Diagnóstico de vacante antes de evaluar: definimos qué habilidades blandas exige el rol.',
            'Evaluación por competencias comerciales con rúbricas, no impresiones subjetivas.',
            'Comparación estandarizada entre candidatos con informe para dirección comercial.',
            'Especialistas en selección comercial B2B.',
          ]}
        />

        <GuiaDivider />

        <GuiaSectionTitle id="evaluar-mejor">
          Evaluar habilidades blandas de forma más justa y rigurosa
        </GuiaSectionTitle>
        <GuiaProse>
          Las habilidades blandas no son un misterio imposible de medir. Lo que falla es el método: entrevistas
          libres, pruebas genéricas y corazonadas no predicen desempeño comercial. Lo que sí funciona es definir
          competencias, observar comportamiento en escenarios reales y comparar candidatos con el mismo criterio.
        </GuiaProse>
        <GuiaProse>
          Kova ayuda a empresas B2B a evaluar habilidades blandas comerciales con metodología especializada:
          diagnóstico de vacante, evaluación por competencias, comparación entre candidatos e informe
          argumentado para que dirección comercial y talento humano decidan con evidencia.
        </GuiaProse>

        <GuiaArticleCTA
          title="Evalúa habilidades blandas comerciales con criterio de experto"
          description="Agenda un diagnóstico comercial sin costo. Un especialista de Kova te orienta sobre tu vacante y cómo medir competencias interpersonales con rigor, no con intuición."
          primaryLabel="Agendar diagnóstico comercial"
          primaryTo="/#acceso"
          secondaryLabel="Ver guía de evaluación comercial"
          secondaryTo="/guia-evaluacion-comercial"
        />

    </GuiaPageLayout>
  );
}
