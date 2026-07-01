import { Check } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import BookingScheduler from '@/components/landing/BookingScheduler';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const PHONE_DISPLAY = '+57 300 000 0000';
const PHONE_TEL = '+573000000000';
const WHATSAPP_URL = 'https://wa.me/573000000000';

const beneficios = [
  'Evaluación por competencias adaptada a cada rol comercial.',
  'Informe comparativo con evidencia para decidir con respaldo.',
  'Consultor dedicado exclusivamente a tu vacante.',
  'Primera sesión de diagnóstico sin costo ni compromiso.',
];

export default function Contacto() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 border-t" style={{ borderColor: KOVA.borderSoft }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-14 lg:pb-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_28rem] gap-10 lg:gap-12 xl:gap-14 items-start">
            <div className="lg:pt-1 max-w-lg">
              <p className="kova-eyebrow-pill mb-4">Hable con un especialista</p>
              <h1
                className="font-heading font-bold leading-tight mb-4 text-balance kova-text-h1"
                style={{ color: BRAND.navy }}
              >
                Encuentra el talento comercial que tu organización necesita.
              </h1>
              <p className="kova-text-body mb-8" style={{ color: KOVA.body }}>
                Agenda una consultoría gratuita de 30 minutos. Un especialista entiende tu vacante y
                te explica cómo Kova puede ayudarte a contratar con criterio y evidencia.
              </p>

              <ul className="space-y-3.5">
                {beneficios.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: KOVA.paleGreen }}
                    >
                      <Check className="w-3 h-3" style={{ color: BRAND.greenDark }} strokeWidth={3} />
                    </span>
                    <span className="text-[14px] leading-relaxed" style={{ color: KOVA.body }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:sticky lg:top-24 w-full">
              <BookingScheduler
                alternateContact={{
                  phoneDisplay: PHONE_DISPLAY,
                  phoneTel: PHONE_TEL,
                  whatsAppUrl: WHATSAPP_URL,
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
