import '@/styles/contacto-kova.css';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/contact';

const BookingScheduler = lazy(() => import('@/components/landing/BookingScheduler'));

const PASOS = [
  { num: '01', title: 'Agenda', desc: 'Elige el día y la hora que te convenga.' },
  { num: '02', title: 'Diagnóstico', desc: 'Entendemos tu vacante y tu modelo comercial.' },
  { num: '03', title: 'Propuesta', desc: 'Recibes alcance, perfil y siguiente paso.' },
];

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
              emailDisplay: CONTACT_EMAIL,
              emailMailto: CONTACT_MAILTO,
            }}
          />
        </Suspense>
      ) : (
        <div className="kv-booking-loading" aria-hidden />
      )}
    </div>
  );
}

export default function Contacto() {
  usePageMeta({
    title: 'Agenda una asesoría sin costo',
    description:
      'Agenda una asesoría sin costo de 30 minutos. Un especialista entiende tu vacante y te explica cómo Kova puede ayudarte a contratar con criterio y evidencia.',
    path: '/contacto',
  });

  useEffect(() => {
    document.documentElement.classList.add('kova-home-chrome', 'kova-contacto-active');
    return () => document.documentElement.classList.remove('kova-home-chrome', 'kova-contacto-active');
  }, []);

  return (
    <div className="kova-contacto">
      <header className="kc-head">
        <div className="kc-wrap">
          <p className="kc-eyebrow">Hablemos</p>
          <h1>
            Agenda una <span>asesoría sin costo</span>.
          </h1>
          <p className="kc-head__lead">
            En 30 minutos revisamos tu vacante, el perfil que necesitas y cómo reducir el
            riesgo de contratar mal.
          </p>
          <ul className="kc-chips">
            <li>30 minutos</li>
            <li>Sin costo</li>
            <li>Sin compromiso</li>
          </ul>
        </div>
      </header>

      <main className="kc-main">
        <div className="kc-wrap kc-grid">
          <aside className="kc-side">
            <h2>Cómo funciona</h2>
            <ol className="kc-steps">
              {PASOS.map(({ num, title, desc }) => (
                <li key={num}>
                  <span className="kc-steps__n">{num}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href={CONTACT_MAILTO} className="kc-whatsapp">
              <Mail aria-hidden />
              <span>
                <strong>¿Prefieres escribirnos?</strong>
                <span>{CONTACT_EMAIL}</span>
              </span>
            </a>
          </aside>

          <div className="kc-booking kova-landing-wave" id="agendar">
            <BookingMount />
          </div>
        </div>
      </main>

      <footer className="kc-footer">
        <div className="kc-wrap">
          <p>© {new Date().getFullYear()} Kova</p>
        </div>
      </footer>
    </div>
  );
}
