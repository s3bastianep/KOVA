import { ArrowRight, Target, ClipboardCheck, FileText } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const pasos = [
  {
    n: '01',
    icon: Target,
    title: 'Definición del perfil',
    desc: 'Conocemos tu operación comercial y definimos qué competencias necesita el rol. Sin supuestos, sin plantillas.',
    resultado: 'Perfil ideal y criterios de evaluación',
  },
  {
    n: '02',
    icon: ClipboardCheck,
    title: 'Búsqueda y evaluación',
    desc: 'Encontramos candidatos y los evaluamos con los mismos instrumentos, ajustados al cargo que buscas cubrir.',
    resultado: 'Candidatos calificados y comparados',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Terna e informe',
    desc: 'Te presentamos tres perfiles rankeados con puntajes por competencia y la recomendación del evaluador.',
    resultado: 'Informe unificado para decidir',
  },
];

const roles = [
  'SDR / BDR',
  'Ejecutivo comercial',
  'Inside sales',
  'Account manager',
  'Gerente comercial',
  'Director comercial',
];

export default function ComoFunciona() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="proceso" className="relative py-24 lg:py-28 px-6 lg:px-8 overflow-hidden" style={{ background: '#0F172A' }}>
      <div className="absolute inset-0 kova-grid-bg opacity-80 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          align="center"
          dark
          className="mb-12 lg:mb-14 max-w-2xl"
          eyebrow="El proceso"
          title="De tu vacante a la contratación, con un solo interlocutor."
          description="Nos cuentas el rol. Buscamos, evaluamos y te presentamos a quienes mejor encajan. Tu equipo no pierde tiempo filtrando currículos."
        />

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mb-14 lg:mb-16">
          {pasos.map(({ n, icon: Icon, title, desc, resultado }) => (
            <article
              key={title}
              className="rounded-2xl p-5 lg:p-6 flex flex-col h-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(165,180,252,0.2)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#A5B4FC' }} strokeWidth={2} />
                </div>
                <span
                  className="text-[10px] font-mono font-bold tabular-nums"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {n}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
                {desc}
              </p>
              <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {resultado}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#A5B4FC' }}>
              Roles que cubrimos
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {roles.map((rol) => (
                <span
                  key={rol}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {rol}
                </span>
              ))}
            </div>
            <p className="text-xs max-w-lg" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
              B2B, B2C, retail, servicios e industria. El criterio se adapta a cómo vende tu empresa.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToAcceso}
            className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white transition-all hover:opacity-95 flex-shrink-0"
            style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.35)' }}
          >
            Cuéntanos tu vacante
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
