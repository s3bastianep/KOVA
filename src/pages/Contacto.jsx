import { Check, Clock } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import VacanteForm from '@/components/landing/VacanteForm';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const beneficios = [
  'Evaluación por competencias adaptada a cada rol comercial.',
  'Informe comparativo con evidencia para decidir con respaldo.',
  'Consultor dedicado exclusivamente a su vacante.',
  'Respuesta de un especialista en 24 horas hábiles.',
  'Metodología probada con empresas en Latinoamérica.',
];

export default function Contacto() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 lg:pb-14 px-6 lg:px-8" style={{ background: KOVA.white }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
            <div>
              <p className="kova-eyebrow-pill mb-4">Contacto comercial</p>
              <h1
                className="font-heading font-bold leading-tight mb-4 text-balance max-w-lg"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
                  letterSpacing: '-0.03em',
                  color: BRAND.navy,
                }}
              >
                Conozca cómo Kova evalúa talento comercial.
              </h1>
              <p className="text-[15px] leading-relaxed mb-6 max-w-md" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                ¿Necesita contratar con criterio? Cuéntenos su vacante y un especialista de Kova le responde en
                menos de 24 horas hábiles.
              </p>

              <ul className="space-y-3 mb-6">
                {beneficios.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: BRAND.green }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-snug" style={{ color: KOVA.body, lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="inline-flex items-center gap-2.5 rounded-lg px-4 py-3 max-w-md"
                style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
              >
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.blue }} strokeWidth={2} />
                <p className="text-sm" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                  Un consultor especializado revisa su solicitud y agenda la primera conversación sin compromiso.
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <VacanteForm compact />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
