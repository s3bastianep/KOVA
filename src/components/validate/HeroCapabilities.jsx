import {
  ArrowRight,
  Compass,
  FileCheck,
  GraduationCap,
  Scale,
  SlidersHorizontal,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { accentCycle, KOVA } from '@/theme/kovaPalette';

const benefits = [
  { icon: SlidersHorizontal, text: 'Evaluamos según el rol, no con una prueba genérica' },
  { icon: Compass, text: 'Definimos el perfil ideal antes de iniciar la búsqueda' },
  { icon: GraduationCap, text: 'Onboarding comercial especializado.' },
  { icon: FileCheck, text: 'Informe comparativo completo por vacante' },
  { icon: UserCheck, text: 'Recomendación de contratación respaldada con evidencia' },
  { icon: Scale, text: 'Mismo estándar de evaluación para todos los candidatos' },
  { icon: TrendingUp, text: 'Evaluación basada en competencias de desempeño comercial' },
  { icon: UserRoundCheck, text: 'Especialista asignado por vacante' },
];

export default function HeroCapabilities() {
  return (
    <section id="proceso" className="py-12 lg:py-16 px-6 lg:px-8 border-b kova-section-warm" style={{ borderColor: KOVA.border }}>
      <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <p className="kova-eyebrow-pill mb-4">Para empresas</p>
          <p
            className="text-[17px] lg:text-lg font-normal text-balance mx-auto"
            style={{ color: KOVA.body, lineHeight: 1.75, maxWidth: '34rem' }}
          >
            Identificamos, evaluamos y recomendamos el talento comercial que su organización necesita.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
          {benefits.map(({ icon: Icon, text }, i) => {
            const accent = accentCycle[i % accentCycle.length];
            return (
              <article
                key={text}
                className="kova-card kova-card-hover flex gap-3 p-4 lg:p-[18px] h-full min-h-[88px] rounded-xl items-start"
                style={{
                  borderColor: accent.border,
                  boxShadow: '0 1px 2px rgba(15,31,61,0.04), 0 6px 20px rgba(15,31,61,0.05)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: accent.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent.icon }} strokeWidth={2} />
                </div>
                <p
                  className="text-[13px] lg:text-sm font-normal leading-snug flex-1 pt-0.5"
                  style={{ color: KOVA.body, lineHeight: 1.55 }}
                >
                  {text}
                </p>
              </article>
            );
          })}
        </div>

        <div className="relative kova-cta-band flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl px-5 py-4 lg:px-6 lg:py-5">
          <div className="relative text-center sm:text-left max-w-xl">
            <p className="text-sm font-semibold text-white mb-1">¿Vacante comercial activa?</p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Cada día sin el candidato correcto afecta sus resultados.
            </p>
          </div>
          <Link
            to="/contacto"
            className="relative group kova-btn-primary inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm flex-shrink-0 transition-all text-white"
          >
            Hablemos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
