import '@/styles/landing-wave-inner.css';
import '@/styles/landing-wave-contact.css';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Clock, MessageCircle } from 'lucide-react';
import SiteLayout from '@/components/landing/SiteLayout';
import InnerPageHero from '@/components/landing/InnerPageHero';
import { CN_CTA_NOTE } from '@/theme/landingConsult';

const PHONE_DISPLAY = '+57 300 000 0000';
const PHONE_TEL = '+573000000000';
const WHATSAPP_URL = 'https://wa.me/573000000000';

const BookingScheduler = lazy(() => import('@/components/landing/BookingScheduler'));

function BookingMount() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="kv-booking-stage">
      {active ? (
        <Suspense fallback={<div className="kv-booking-loading" aria-busy="true" aria-label="Cargando calendario" />}>
          <BookingScheduler
            alternateContact={{
              phoneDisplay: PHONE_DISPLAY,
              phoneTel: PHONE_TEL,
              whatsAppUrl: WHATSAPP_URL,
            }}
          />
        </Suspense>
      ) : (
        <div className="kv-booking-loading" aria-hidden />
      )}
    </div>
  );
}

const trustChips = CN_CTA_NOTE.split('·').map((s) => s.trim());

const pasos = [
  { num: '01', title: 'Agenda', desc: 'Elija día y hora que le convenga' },
  { num: '02', title: 'Diagnóstico', desc: 'Entendemos su vacante y modelo comercial' },
  { num: '03', title: 'Propuesta', desc: 'Recibe alcance, perfil y siguiente paso' },
];

export default function Contacto() {
  return (
    <SiteLayout>
      <main>
        <InnerPageHero
          compact
          eyebrow="Hable con un especialista"
          title="Encuentre el"
          highlight="talento comercial que su organización necesita"
          subtitle="Agende una consultoría gratuita de 30 minutos. Un especialista entiende su vacante y le explica cómo Kova puede ayudarle a contratar con criterio y evidencia."
        />

        <div className="kv-contact-trust">
          <div className="kv-wrap">
            <div className="kv-contact-trust-bar">
              {trustChips.map((chip) => (
                <span key={chip} className="kv-contact-trust-chip font-mono">
                  <Clock className="kv-contact-trust-icon" aria-hidden />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="kv-section kv-section--paper-2 kv-contact-section">
          <div className="kv-wrap kv-contact-layout">
            <div className="kv-contact-main">
              <p className="kv-eyebrow kv-eyebrow--ink font-mono">Qué obtiene</p>
              <h2 className="kv-contact-heading font-display">
                Una sesión que aclara su próxima contratación comercial
              </h2>
              <p className="kv-contact-lead">
                En 30 minutos revisamos su vacante, el perfil que necesita y cómo una evaluación por competencias
                reduce el riesgo de contratar mal.
              </p>

              <div className="kv-contact-steps">
                <p className="kv-contact-steps-label font-mono">Cómo funciona</p>
                <ol className="kv-contact-steps-list">
                  {pasos.map(({ num, title, desc }) => (
                    <li key={num}>
                      <span className="kv-contact-step-num font-mono">{num}</span>
                      <div>
                        <p className="font-display">{title}</p>
                        <p>{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="kv-contact-whatsapp">
                <MessageCircle aria-hidden />
                <span>
                  <strong>¿Prefiere escribirnos?</strong>
                  <span>
                    {PHONE_DISPLAY} · WhatsApp
                  </span>
                </span>
              </a>
            </div>

            <div className="kv-contact-booking" id="agendar">
              <BookingMount />
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
