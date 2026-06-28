import { Check } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import VacanteForm from '@/components/landing/VacanteForm';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const PHONE_DISPLAY = '+57 300 000 0000';
const PHONE_TEL = '+573000000000';
const WHATSAPP_URL = 'https://wa.me/573000000000';

const beneficios = [
  'Evaluación por competencias adaptada a cada rol comercial.',
  'Informe comparativo con evidencia para decidir con respaldo.',
  'Consultor dedicado exclusivamente a su vacante.',
  'Primera sesión de diagnóstico sin costo ni compromiso.',
  'Especialistas exclusivos en perfiles comerciales.',
];

export default function Contacto() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 relative overflow-hidden kova-section-warm">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[520px] h-[520px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(26,63,170,0.07) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(0,178,122,0.06) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
            <div className="lg:pt-2">
              <p className="kova-eyebrow-pill mb-5">Hable con un especialista</p>
              <h1
                className="font-heading font-bold leading-tight mb-4 text-balance"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.375rem)',
                  letterSpacing: '-0.03em',
                  color: BRAND.navy,
                }}
              >
                Encuentre el talento comercial que su organización necesita.
              </h1>
              <p className="text-[15px] leading-relaxed mb-7 max-w-md" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Cuéntenos su vacante. Un consultor especializado le contactará en menos de 24 horas hábiles
                para entender su necesidad y diseñar juntos el proceso de selección ideal para su organización.
              </p>

              <div
                className="rounded-xl p-5 lg:p-6"
                style={{
                  background: KOVA.white,
                  border: `1px solid ${KOVA.border}`,
                  boxShadow: '0 1px 2px rgba(15,31,61,0.04), 0 8px 28px rgba(15,31,61,0.06)',
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
                  style={{ color: BRAND.blue }}
                >
                  Qué obtiene al contactarnos
                </p>
                <ul className="space-y-3">
                  {beneficios.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: BRAND.green }}
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-[14px] leading-snug" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <VacanteForm
                compact
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
