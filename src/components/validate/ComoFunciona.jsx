import { ArrowRight, Target, ClipboardCheck, FileText, UserCheck, Search, BarChart3, Handshake, Briefcase } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const pasos = [
  {
    n: '01',
    icon: Target,
    title: 'Definimos el perfil de la vacante',
    desc: 'Entendemos tu contexto comercial, modelo de venta y metas del rol. Traducimos la vacante en competencias concretas antes de evaluar candidatos.',
    entregable: 'Perfil ideal + criterios de éxito',
    color: '#818CF8',
  },
  {
    n: '02',
    icon: ClipboardCheck,
    title: 'Buscamos y evaluamos con el mismo criterio',
    desc: 'Reclutamos talento comercial y lo evaluamos con instrumentos diseñados para tu cargo: entrevista por competencias, simulaciones y criterios alineados al rol.',
    entregable: 'Candidatos evaluados y comparados',
    color: '#34D399',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Te entregamos la terna para decidir',
    desc: 'Recibes un informe comparativo con ranking, coincidencia por puesto y conclusión del evaluador para elegir con datos, no con corazonada.',
    entregable: 'Informe unificado listo para decidir',
    color: '#FBBF24',
  },
];

const valor = [
  {
    icon: UserCheck,
    title: 'Especialista dedicado',
    desc: 'Un consultor comercial conduce tu vacante de principio a fin.',
  },
  {
    icon: Search,
    title: 'Búsqueda activa',
    desc: 'No esperamos postulaciones: buscamos talento que encaje con el perfil.',
  },
  {
    icon: BarChart3,
    title: 'Evaluación personalizada por cargo',
    desc: 'Competencias, simulaciones y criterios definidos para tu vacante. Mismo estándar para todos, adaptado al rol.',
  },
  {
    icon: Handshake,
    title: 'Acompañamiento hasta decidir',
    desc: 'Te apoyamos hasta la contratación, alineando comercial y talento humano.',
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
          className="mb-12 lg:mb-16 max-w-3xl"
          eyebrow="Cómo funciona"
          title="Un proceso completo para contratar comercial con criterio."
          description="Nos especializamos en áreas comerciales para empresas de cualquier sector. Adaptamos el criterio a tu vacante, evaluamos talento por competencias y te entregamos una terna comparada para decidir con claridad."
        />

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mb-12 lg:mb-14">
          {pasos.map(({ n, icon: Icon, title, desc, entregable, color }) => (
            <article
              key={title}
              className="rounded-2xl p-5 lg:p-6 flex flex-col h-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22`, border: `1px solid ${color}44` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#C7D2FE' }}
                >
                  {n}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
                {desc}
              </p>
              <span
                className="inline-block text-[10px] font-semibold px-2.5 py-1.5 rounded-lg w-fit"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                → {entregable}
              </span>
            </article>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 lg:p-8 mb-10"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-4 h-4" style={{ color: '#A5B4FC' }} strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A5B4FC' }}>
              Qué incluye trabajar con Kova
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {valor.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(165,180,252,0.15)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#C7D2FE' }} strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#A5B4FC' }}>
              Vacantes que cubrimos
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((rol) => (
                <span
                  key={rol}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#E0E7FF', border: '1px solid rgba(165,180,252,0.2)' }}
                >
                  {rol}
                </span>
              ))}
            </div>
            <p className="text-xs mt-3 max-w-xl" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
              B2B, B2C, retail, servicios, industria y más. El criterio se adapta a cómo vende tu empresa.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToAcceso}
            className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white transition-all hover:opacity-95 flex-shrink-0"
            style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.35)' }}
          >
            Agendar diagnóstico comercial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
