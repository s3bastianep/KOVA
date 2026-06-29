import { Link } from 'react-router-dom';
import { ArrowRight, Gauge } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function KovaScore() {
  return (
    <section
      id="kova-score"
      className="py-12 lg:py-16 px-6 lg:px-8 border-b relative overflow-hidden"
      style={{ background: KOVA.surface, borderColor: KOVA.border }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(26,63,170,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 max-w-2xl !mb-6"
              eyebrow="Kova Score"
              title="El índice que predice el potencial comercial de cada candidato."
              description="Un índice desarrollado a partir de datos reales que estima la probabilidad de éxito de cada candidato en su modelo de negocio específico. No evaluamos actitud. Evaluamos lo que predice desempeño en ventas."
            />

            <Link
              to="/contacto"
              className="hidden md:inline-flex group kova-btn-primary items-center gap-2 font-semibold px-6 py-3.5 rounded-lg text-sm transition-all text-white"
            >
              Conozca cómo funciona
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div
            className="flex items-center justify-center w-full max-w-xs mx-auto lg:mx-0 lg:max-w-[280px] aspect-square rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${KOVA.white} 0%, ${KOVA.paleGreen} 100%)`,
              border: `1px solid ${KOVA.border}`,
              boxShadow: '0 8px 32px rgba(15,31,61,0.08)',
            }}
          >
            <div className="text-center px-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
              >
                <Gauge className="w-8 h-8" style={{ color: BRAND.blue }} strokeWidth={1.75} />
              </div>
              <p className="font-heading font-bold text-4xl tabular-nums mb-1" style={{ color: BRAND.navy }}>
                87
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.green }}>
                Kova Score
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: KOVA.muted }}>
                Potencial predictivo por candidato y modelo de ventas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
