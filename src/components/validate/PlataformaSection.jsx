import { BarChart3, BookOpen, Gauge, Target, TrendingUp, Users } from 'lucide-react';
import LandingSectionHeader from '@/components/validate/LandingSectionHeader';
import { LT } from '@/theme/landingTheme';

const capacidades = [
  { icon: Target, label: 'Definir su metodología comercial' },
  { icon: BookOpen, label: 'Capacitar continuamente a los asesores' },
  { icon: Gauge, label: 'Medir competencias comerciales' },
  { icon: TrendingUp, label: 'Evaluar avance a 30, 60 y 90 días' },
  { icon: BarChart3, label: 'Identificar brechas de habilidades' },
  { icon: Users, label: 'Estandarizar cómo vende toda la organización' },
];

export default function PlataformaSection() {
  return (
    <section
      id="plataforma"
      className="kova-b2b-section relative px-5 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: LT.heroGradient }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232,168,56,0.2) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="kova-page-container relative z-10">
        <LandingSectionHeader
          index="04"
          eyebrow="Plataforma"
          title="Más que contratar:"
          accent="un sistema operativo comercial."
          description="Nuestra plataforma acompaña a la empresa desde la definición del perfil comercial hasta que el asesor alcanza su máximo rendimiento: reduce rotación, acorta la curva de aprendizaje y aumenta productividad."
          dark
          className="!max-w-2xl"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-10">
          {capacidades.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-4 py-4 border"
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: LT.borderDark }}
            >
              <Icon className="w-4 h-4 shrink-0" style={{ color: LT.amberBright }} strokeWidth={2} />
              <p className="text-sm font-medium" style={{ color: LT.textSoft }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm mt-10 max-w-2xl leading-relaxed" style={{ color: LT.textMutedDark }}>
          Deje de competir por precio. Compita por resultados: menos riesgo en cada contratación,
          asesores productivos más rápido y un modelo comercial replicable en toda la organización.
        </p>
      </div>
    </section>
  );
}
