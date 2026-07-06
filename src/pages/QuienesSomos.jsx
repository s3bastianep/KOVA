import { FileBarChart, Target, Users } from 'lucide-react';
import SiteLayout from '@/components/landing/SiteLayout';
import InnerPageHero from '@/components/landing/InnerPageHero';
import PageCta from '@/components/landing/PageCta';
import Reveal from '@/components/validate/Reveal';
import {
  CN_COMPARISON_PAIRS,
  CN_CTA_LABEL,
} from '@/theme/landingConsult';

const pilares = [
  {
    icon: Target,
    title: 'Especialización comercial',
    body: 'Solo selección de talento comercial. Cada proceso se diseña según el rol, el sector y el modelo de ventas de la organización.',
  },
  {
    icon: Users,
    title: 'Consultores con experiencia real',
    body: 'Equipo con trayectoria en liderazgo comercial, evaluación de talento y procesos de contratación en empresas de Latinoamérica.',
  },
  {
    icon: FileBarChart,
    title: 'Metodología con evidencia',
    body: 'Diagnóstico, evaluación estructurada e informe comparativo. Decisiones respaldadas con datos, no con intuición.',
  },
];

const creencias = [
  { title: 'La claridad antes que la velocidad', body: 'Entendemos su negocio antes de buscar. Un buen proceso empieza con diagnóstico, no con volumen de currículums.' },
  { title: 'Los datos por encima de la intuición', body: 'La entrevista importa, pero no basta. Medimos lo que predice éxito comercial en su contexto.' },
  { title: 'Especialización comercial', body: 'No reclutamos de todo. Solo talento comercial, porque cada rol de ventas exige competencias distintas.' },
  { title: 'Evidencia documentada', body: 'Cada recomendación llega con respaldo por competencia. Usted decide con información, no con suposiciones.' },
  { title: 'Alineación con su negocio', body: 'No aplicamos plantillas. Diseñamos el proceso según su producto, mercado y modelo de ventas.' },
  { title: 'Compromiso con el resultado', body: 'Nuestro trabajo no termina en entregar nombres. Buscamos que cada contratación reduzca el riesgo para su equipo.' },
];

export default function QuienesSomos() {
  return (
    <SiteLayout>
      <main>
        <InnerPageHero
          eyebrow="Acerca de Kova"
          title="Creamos Kova para solucionar la"
          highlight="contratación comercial"
          subtitle="Nacimos de la experiencia en liderazgo comercial y selección. Vimos empresas contratar por currículum e intuición, y descubrir meses después que el perfil no vendía."
          ctaLabel={CN_CTA_LABEL}
        >
          <div className="kv-inner-media">
            <img src="/images/equipo-kova.png" alt="Equipo Kova" loading="lazy" />
          </div>
        </InnerPageHero>

        <div className="kv-page-band kv-page-band--light">
          <section className="kv-section">
            <div className="kv-wrap kv-narrow-center">
              <div className="kv-section-head-center">
                <span className="kv-section-tag font-mono">Por qué nacimos</span>
                <h2 className="kv-h2 font-display">Nuestra historia</h2>
              </div>
              <div className="kv-prose-stack">
                <p>
                  Durante años vimos el mismo patrón: dirección comercial y talento humano alineados en la urgencia
                  de cubrir la vacante, pero sin un método que midiera si el candidato realmente podía vender en ese
                  contexto.
                </p>
                <p className="kv-prose-emphasis">
                  El problema no era la falta de candidatos. Era la falta de un proceso que evaluara competencias
                  comerciales con el rigor que el rol exige.
                </p>
                <p>
                  Kova nació para cambiar eso: primero entender el negocio del cliente, diseñar evaluaciones a la medida
                  y presentar talento respaldado por evidencia objetiva.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="kv-section kv-comparison">
          <div className="kv-wrap">
            <div className="kv-section-head">
              <span className="kv-section-tag kv-section-tag--lime font-mono">Nuestro enfoque</span>
              <h2 className="kv-h2 kv-h2--light font-display">
                Lo que hacemos <em className="kv-text-lime">diferente</em>
              </h2>
              <p>
                La misma vacante evaluada con dos criterios distintos. Así se ve la diferencia entre contratar por
                intuición y contratar con evidencia.
              </p>
            </div>

            <div className="kv-compare-matrix">
              <div className="kv-compare-matrix-head">
                <span className="font-display">Selección tradicional</span>
                <span className="font-display">Metodología Kova</span>
              </div>
              {CN_COMPARISON_PAIRS.map(({ traditional, kova }) => (
                <div key={traditional} className="kv-compare-matrix-row">
                  <div className="kv-compare-matrix-cell kv-compare-matrix-cell--old">
                    <span className="kv-compare-matrix-label font-mono" aria-hidden>
                      Tradicional
                    </span>
                    <i className="font-mono" aria-hidden>
                      ✕
                    </i>
                    <span>{traditional}</span>
                  </div>
                  <div className="kv-compare-matrix-cell kv-compare-matrix-cell--kova">
                    <span className="kv-compare-matrix-label font-mono" aria-hidden>
                      Kova
                    </span>
                    <i className="font-mono" aria-hidden>
                      ✓
                    </i>
                    <span>{kova}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="kv-section kv-section--paper-2">
          <div className="kv-wrap">
            <div className="kv-section-head-center">
              <span className="kv-section-tag font-mono">Por qué Kova</span>
              <h2 className="kv-h2 font-display">Lo que nos define</h2>
              <p className="kv-section-lead">
                Tres pilares que guían cada proceso de selección comercial que acompañamos.
              </p>
            </div>
            <div className="kv-contact-benefits kv-about-pilares">
              {pilares.map(({ icon: Icon, title, body }, i) => (
                <article key={title} className="kv-contact-benefit">
                  <div className={`kv-contact-benefit-icon kv-contact-benefit-icon--${(i % 4) + 1}`}>
                    <Icon aria-hidden />
                  </div>
                  <h3 className="font-display">{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="kv-page-band kv-page-band--dark">
          <section className="kv-section kv-about-mission">
            <div className="kv-wrap kv-narrow-center">
              <div className="kv-section-head-center">
                <span className="kv-enfoque-eyebrow font-mono">Misión Kova</span>
                <h2 className="kv-h2 font-display">Nuestra misión</h2>
              </div>
              <div className="kv-about-mission-card">
                <p className="kv-about-mission-lead font-display">
                  Ayudar a las empresas a contratar talento comercial con criterio técnico y evidencia documentada
                </p>
                <p>
                  Reemplazamos la contratación basada en intuición por un sistema estructurado: diagnóstico comercial,
                  evaluación por competencias e informe comparativo para que dirección comercial y talento humano
                  decidan con el mismo criterio.
                </p>
                <p className="kv-about-mission-tag font-mono">Menos apuestas. Más decisiones informadas.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="kv-section">
          <div className="kv-wrap">
            <div className="kv-section-head-center">
              <span className="kv-section-tag font-mono">Valores Kova</span>
              <h2 className="kv-h2 font-display">Lo que creemos</h2>
              <p className="kv-section-lead">
                Principios que sostienen cada diagnóstico, cada evaluación y cada recomendación que entregamos.
              </p>
            </div>
            <div className="kv-phil-grid kv-phil-grid--six">
              {creencias.map(({ title, body }, i) => (
                <Reveal key={title} className="kv-phil-tile">
                  <div className="kv-phil-num font-display">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h4 className="font-display">{title}</h4>
                    <p>{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <PageCta
          tag="Trabajemos juntos"
          title="Programe una consultoría con nuestro equipo"
          titleHighlight="consultoría"
          lead="Conozca cómo Kova puede ayudarle a contratar talento comercial con criterio, evidencia y un consultor dedicado a su vacante."
        />
      </main>
    </SiteLayout>
  );
}
