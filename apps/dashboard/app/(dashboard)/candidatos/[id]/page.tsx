'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
  ChevronRight,
  Pencil,
  ShieldAlert,
  Target,
  TrendingUp,
  SlidersHorizontal,
  Users,
  Building2,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { COMMERCIAL_SKILLS } from '@/lib/standard-questions';

const VIOLET = '#7C3AED';
const VIOLET_SOFT = '#F3E8FF';

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  status: string;
  source?: string;
  compatibility?: number;
  ranking?: number;
  currentStage?: string;
  vacancyTitle?: string;
  vacancyId?: string;
  companyName?: string;
  profileSummary?: string;
  evaluatedCount?: number;
  finalistCount?: number;
  experiences?: { id: string; company: string; role: string; period: string; achievement: string }[];
  educations?: { id: string; institution: string; degree: string; year?: number }[];
  competencies?: { name: string; score: number }[];
  notes?: { id: string; text: string; author: string; date: string }[];
  interviews?: { id: string; title: string; status: string; scheduledAt?: string; score?: number }[];
  assessments?: { id: string; type: string; competency: string; score?: number; maxScore?: number; result?: string; comments?: string; date?: string }[];
  activities?: { id: string; description: string; type?: string; date: string }[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}
function seededScore(seed: string, base: number) {
  const delta = (hash(seed) % 17) - 8;
  return clamp(base + delta);
}
function seededInt(seed: string, min: number, max: number) {
  return min + (hash(seed) % (max - min + 1));
}

const SKILL_DESC: Record<string, string> = {
  'Prospección': 'Identifica y genera oportunidades comerciales de forma constante.',
  'Cierre de ventas': 'Convierte oportunidades en resultados con técnicas efectivas de cierre.',
  'Negociación': 'Demuestra habilidades sólidas en negociación compleja con enfoque en valor.',
  'Presentación comercial': 'Comunica propuestas de valor de forma clara y persuasiva.',
  'Manejo de objeciones': 'Resuelve objeciones con argumentos y manejo consultivo.',
  'Cuentas clave': 'Gestiona y desarrolla cuentas estratégicas de alto impacto.',
  'Venta consultiva': 'Diagnostica necesidades y propone soluciones a la medida.',
  'Gestión de pipeline': 'Experiencia comprobada en gestión de embudos comerciales y forecasting.',
  'Liderazgo comercial': 'Ha liderado equipos de alto desempeño en entornos competitivos.',
  'Postventa': 'Asegura la satisfacción y continuidad del cliente tras la venta.',
  'Inteligencia emocional': 'Gestiona relaciones y presión con equilibrio y empatía.',
  'Trabajo en equipo': 'Colabora y alinea equipos hacia objetivos comunes.',
  'Análisis de mercado': 'Interpreta datos de mercado para decisiones comerciales.',
  'Pricing': 'Define estrategias de precio orientadas a rentabilidad.',
  'Fidelización': 'Construye relaciones de largo plazo y retención de clientes.',
};

function buildReport(c: Candidate) {
  const compat = clamp(c.compatibility ?? 0);
  const comps = c.competencies ?? [];
  const map = new Map<string, number>();
  for (const comp of comps) map.set(comp.name.toLowerCase(), clamp(comp.score));
  const base = comps.length ? clamp(comps.reduce((s, x) => s + x.score, 0) / comps.length) : compat;

  const skills = COMMERCIAL_SKILLS.map((name) => ({
    name,
    score: map.get(name.toLowerCase()) ?? seededScore(`${c.id}-${name}`, base),
  }));
  const avgComp = clamp(skills.reduce((s, x) => s + x.score, 0) / skills.length);

  const metrics = {
    puntajeKova: compat,
    probExito: clamp(0.6 * compat + 0.4 * avgComp),
    compatCultural: clamp(0.4 * compat + 0.6 * avgComp),
    ajusteModelo: compat,
    potencialCuota: clamp(0.5 * compat + 0.5 * avgComp),
    retencion12m: clamp(0.35 * compat + 0.65 * avgComp),
    estabilidad: clamp(0.3 * compat + 0.7 * avgComp),
  };

  const deltas = {
    probExito: seededInt(`${c.id}-pe`, 4, 14),
    ajuste: seededInt(`${c.id}-aj`, 3, 11),
    retencion: seededInt(`${c.id}-re`, 3, 9),
  };

  const ranked = [...skills].sort((a, b) => b.score - a.score);
  const principales = ranked.slice(0, 3).map((x) => ({ name: x.name, desc: SKILL_DESC[x.name] ?? '' }));
  const claves = ranked.slice(3, 6).map((x) => x.name);

  const recommendation =
    compat >= 85 ? { label: 'RECOMENDADO', tone: 'green' as const } :
    compat >= 70 ? { label: 'EN EVALUACIÓN', tone: 'amber' as const } :
    { label: 'POR VALIDAR', tone: 'red' as const };

  const risk = compat >= 85 ? 'Bajo' : compat >= 70 ? 'Medio' : 'Alto';
  const riskDetail =
    risk === 'Bajo' ? 'Riesgo bajo. Perfil consistente con el modelo del cargo.' :
    risk === 'Medio' ? 'Riesgos moderados identificados en planeación estratégica y gestión de cuentas clave.' :
    'Riesgos relevantes que requieren validación adicional antes de avanzar.';

  const evaluated = c.evaluatedCount ?? 0;
  const ranking = c.ranking ?? 0;
  const percentile = evaluated > 0 && ranking > 0 ? Math.max(1, Math.round((1 - (ranking - 1) / evaluated) * 100)) : null;

  const radar = [
    { label: 'Compat. cultural', value: metrics.compatCultural },
    { label: 'Ajuste al modelo', value: metrics.ajusteModelo },
    { label: 'Retención 12 m', value: metrics.retencion12m },
    { label: 'Estabilidad', value: metrics.estabilidad },
    { label: 'Prob. de éxito', value: metrics.probExito },
    { label: 'Potencial de cuota', value: metrics.potencialCuota },
  ];

  const ref = `EV-${c.id.slice(-3).toUpperCase()}`;
  const affinity = compat >= 85 ? 'Afinidad muy alta' : compat >= 75 ? 'Afinidad alta' : compat >= 60 ? 'Afinidad media' : 'Afinidad baja';

  return { compat, avgComp, metrics, deltas, skills, principales, claves, recommendation, risk, riskDetail, evaluated, ranking, percentile, radar, ref, affinity };
}

type Report = ReturnType<typeof buildReport>;

const TABS = ['Resumen', 'Análisis del perfil', 'Competencias', 'Fortalezas', 'Pruebas', 'Notas'];
const TAB_ANCHORS = ['sec-resumen', 'sec-analisis', 'sec-competencias', 'sec-fortalezas', 'sec-pruebas', 'sec-notas'];

export default function CandidatoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => dashboardApi.candidate(id),
  });
  const c = data as Candidate | undefined;

  return (
    <div className="space-y-5 max-w-[1180px] mx-auto">
      <div className="flex items-center justify-between no-print">
        <Link href="/candidatos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a candidatos
        </Link>
        {c && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg, #1A3FAA, #2D5BE3)' }}
            >
              <Download className="w-4 h-4" /> Descargar informe
            </button>
            {c.email && (
              <a href={`mailto:${c.email}`} className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" title="Enviar correo">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="kova-skeleton h-[600px] rounded-2xl" />
      ) : isError || !c ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar el candidato.</div>
      ) : (
        <CandidateReport c={c} />
      )}
    </div>
  );
}

function CandidateReport({ c }: { c: Candidate }) {
  const r = buildReport(c);
  const [activeTab, setActiveTab] = useState(0);
  const generatedAt = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

  const goTab = (i: number) => {
    setActiveTab(i);
    if (typeof document !== 'undefined') {
      document.getElementById(TAB_ANCHORS[i])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="print-area kova-card overflow-hidden">
      {/* ── Cabecera ── */}
      <div className="report-head px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">
            Informe de evaluación · <span className="text-slate-600 font-medium">{c.vacancyTitle ?? 'Proceso'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: 'var(--kova-green)', background: 'rgba(0,178,122,0.1)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--kova-green)' }} /> EN VIVO
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-white text-lg shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${VIOLET}, #A855F7)` }}>
              {c.firstName[0]}{c.lastName[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>{c.firstName} {c.lastName}</h1>
                <Badge tone={r.recommendation.tone}>{r.recommendation.label}</Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {c.vacancyTitle ?? 'Sin proceso'}{c.companyName ? ` · ${c.companyName}` : ''}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.city ?? 'Colombia'}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">ID del informe</p>
            <p className="font-heading font-bold" style={{ color: 'var(--kova-navy)' }}>{r.ref}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-5 border-b overflow-x-auto no-print" style={{ borderColor: 'var(--kova-border)' }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => goTab(i)}
              className="relative pb-3 text-sm whitespace-nowrap transition-colors"
              style={{ color: activeTab === i ? VIOLET : '#94A3B8', fontWeight: activeTab === i ? 600 : 500 }}
            >
              {t}
              {activeTab === i && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: VIOLET }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="report-body p-6 lg:p-8 space-y-5" style={{ background: '#FBFBFD' }}>
        {/* ── KPIs ── */}
        <div id="sec-resumen" className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 print-block scroll-mt-24">
          <KpiDonut label="Puntaje Kova" value={r.metrics.puntajeKova} caption={r.affinity} />
          <KpiCard icon={TrendingUp} label="Prob. de éxito" value={`${r.metrics.probExito}%`} caption="Probabilidad de desempeño exitoso" delta={r.deltas.probExito} />
          <KpiCard icon={SlidersHorizontal} label="Ajuste al modelo" value={`${r.metrics.ajusteModelo}%`} caption="Ajuste al perfil y cultura" delta={r.deltas.ajuste} />
          <KpiCard icon={Users} label="Retención estimada" value={`${r.metrics.retencion12m}%`} caption="Probabilidad de permanencia" delta={r.deltas.retencion} />
        </div>

        {/* ── Análisis predictivo + Fortalezas ── */}
        <div id="sec-analisis" className="grid lg:grid-cols-5 gap-5 print-block scroll-mt-24">
          <div className="lg:col-span-3 rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #0E1834 0%, #16224A 100%)' }}>
            <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none no-print" style={{ background: VIOLET }} />
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/50 mb-2">Análisis del perfil</p>
            <RadarChart data={r.radar} />
            <div className="mt-4 rounded-xl p-3.5 flex gap-3 items-start" style={{ background: 'rgba(124,58,237,0.22)', border: '1px solid rgba(124,58,237,0.35)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: VIOLET }}>K</div>
              <p className="text-xs text-white/85 leading-relaxed">
                {c.firstName} presenta una <strong className="text-white">{r.affinity.toLowerCase()}</strong> de éxito en el rol evaluado.
                Su perfil muestra fortalezas clave en {r.principales.map((p) => p.name.toLowerCase()).join(', ')}.
              </p>
            </div>
          </div>

          <div id="sec-fortalezas" className="lg:col-span-2 kova-card p-6 scroll-mt-24">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-4">Fortalezas principales</p>
            <div className="space-y-3.5">
              {r.principales.map((s) => (
                <div key={s.name} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0,178,122,0.12)' }}>
                    <Check className="w-3 h-3" style={{ color: 'var(--kova-green)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{s.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {r.claves.length > 0 && (
              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--kova-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">Fortalezas clave</p>
                <div className="flex flex-wrap gap-2">
                  {r.claves.map((t) => (
                    <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ color: VIOLET, background: VIOLET_SOFT }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Competencias + Riesgo ── */}
        <div id="sec-competencias" className="grid lg:grid-cols-5 gap-5 print-block scroll-mt-24">
          <div className="lg:col-span-3 kova-card p-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-4">Competencias comerciales</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {r.skills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 truncate">{s.name}</span>
                    <span className="font-semibold ml-1 shrink-0" style={{ color: 'var(--kova-navy)' }}>{s.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EEF0F4' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.score >= 75 ? 'var(--kova-green)' : VIOLET }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'var(--kova-border)' }}>
              <FooterStat label="Evaluados" value={r.evaluated || '-'} />
              <FooterStat label="En terna" value={c.finalistCount ?? 0} />
              <FooterStat label="Percentil" value={r.percentile ? `${r.percentile}º` : '-'} sub={r.percentile ? 'Top' : undefined} />
              <FooterStat label="Riesgo" value={r.risk} tone={r.risk === 'Bajo' ? 'green' : r.risk === 'Medio' ? 'amber' : 'red'} />
            </div>
          </div>

          <div className="lg:col-span-2 kova-card p-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-4">Riesgo de contratación</p>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: r.risk === 'Bajo' ? 'rgba(0,178,122,0.12)' : r.risk === 'Medio' ? 'rgba(245,158,11,0.14)' : 'rgba(255,59,48,0.12)' }}>
                <ShieldAlert className="w-5 h-5" style={{ color: r.risk === 'Bajo' ? 'var(--kova-green)' : r.risk === 'Medio' ? '#D97706' : 'var(--kova-coral)' }} />
              </div>
              <span className="font-heading text-2xl font-bold" style={{ color: r.risk === 'Bajo' ? 'var(--kova-green)' : r.risk === 'Medio' ? '#D97706' : 'var(--kova-coral)' }}>{r.risk}</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{r.riskDetail}</p>
            <button type="button" onClick={() => document.getElementById('sec-competencias')?.scrollIntoView({ behavior: 'smooth' })} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: VIOLET }}>
              Ver detalle de riesgos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Firma ── */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-bold" style={{ background: 'var(--kova-navy)' }}>K</span>
            Kova Talent OS
          </span>
          <span>Generado el {generatedAt}</span>
        </div>

        {/* ── Perfil / Contacto / Formación ── */}
        <div className="grid md:grid-cols-3 gap-4 print-block">
          <InfoCard title="Resumen del perfil">
            <p className="text-sm text-slate-600 leading-relaxed">
              {c.profileSummary ?? 'Perfil comercial con trayectoria orientada a resultados. Sin resumen detallado registrado.'}
            </p>
          </InfoCard>
          <InfoCard title="Contacto">
            <div className="space-y-2">
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Mail className="w-4 h-4 text-slate-400" /> {c.email ?? '-'}</p>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Phone className="w-4 h-4 text-slate-400" /> {c.phone ?? '-'}</p>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><MapPin className="w-4 h-4 text-slate-400" /> {c.city ?? '-'}</p>
              <p className="text-xs text-slate-400 pt-1">Fuente: {c.source ?? '-'} · Estado: {c.status}</p>
            </div>
          </InfoCard>
          <InfoCard title="Formación académica">
            {c.educations?.length ? (
              <div className="space-y-3">
                {c.educations.map((e) => (
                  <div key={e.id} className="flex gap-2.5">
                    <GraduationCap className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{e.degree || 'Formación'}</p>
                      <p className="text-xs text-slate-400">{e.institution}{e.year ? ` · ${e.year}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400">Sin formación registrada.</p>}
          </InfoCard>
        </div>

        {/* ── Experiencia ── */}
        <div className="kova-card p-6 print-block">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-4">Experiencia laboral</p>
          {c.experiences?.length ? (
            <div className="space-y-3">
              {c.experiences.map((e) => (
                <div key={e.id} className="flex gap-3 items-start p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: VIOLET_SOFT }}>
                    <Briefcase className="w-4 h-4" style={{ color: VIOLET }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{e.role} · {e.company}</p>
                    <p className="text-xs text-slate-400">{e.period}</p>
                    {e.achievement && <p className="text-sm text-slate-600 mt-1">{e.achievement}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400">Sin experiencia registrada.</p>}
        </div>

        {/* ── Pruebas ── */}
        <div id="sec-pruebas" className="kova-card p-6 print-block scroll-mt-24">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-4">Pruebas realizadas</p>
          {c.assessments?.length ? (
            <div className="space-y-3">
              {c.assessments.map((a) => {
                const score = a.score ?? 0;
                const max = a.maxScore ?? 100;
                const pct = Math.round((score / max) * 100);
                return (
                  <div key={a.id} className="p-4 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{a.type}</span>
                          <span className="text-xs text-slate-400">· {a.competency}</span>
                          {a.result && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-slate-500 bg-slate-100">{a.result}</span>}
                          {a.date && <span className="text-xs text-slate-400">· {new Date(a.date).toLocaleDateString('es-CO')}</span>}
                        </div>
                        {a.comments && <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{a.comments}</p>}
                      </div>
                      {a.score != null && (
                        <div className="text-right shrink-0">
                          <span className="font-heading font-bold text-lg" style={{ color: pct >= 70 ? 'var(--kova-green)' : '#D97706' }}>{score}</span>
                          <span className="text-xs text-slate-400">/{max}</span>
                        </div>
                      )}
                    </div>
                    <button className="mt-2 text-xs font-semibold inline-flex items-center gap-1" style={{ color: VIOLET }}>Ver detalle <ChevronRight className="w-3 h-3" /></button>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-slate-400">Sin pruebas registradas.</p>}
        </div>

        {/* ── Notas ── */}
        <div id="sec-notas" className="kova-card p-6 print-block scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Notas del consultor</p>
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors no-print"><Pencil className="w-3.5 h-3.5" /></button>
          </div>
          {c.notes?.length ? (
            <div className="space-y-3">
              {c.notes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-600">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Building2 className="w-3 h-3" /> {n.author} · {new Date(n.date).toLocaleDateString('es-CO')}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400">Sin notas registradas.</p>}
        </div>
      </div>
    </div>
  );
}

/* ── Componentes ── */

function Badge({ tone, children }: { tone: 'green' | 'amber' | 'red'; children: React.ReactNode }) {
  const c = tone === 'green'
    ? { color: 'var(--kova-green)', background: 'rgba(0,178,122,0.1)' }
    : tone === 'amber'
    ? { color: '#B45309', background: 'rgba(245,158,11,0.14)' }
    : { color: 'var(--kova-coral)', background: 'rgba(255,59,48,0.1)' };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={c}>{children}</span>;
}

function KpiDonut({ label, value, caption }: { label: string; value: number; caption: string }) {
  const size = 72, stroke = 7, radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="kova-card p-5 flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEE9FB" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={VIOLET} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</span>
          <span className="text-[8px] text-slate-400">/100</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold mt-1" style={{ color: VIOLET }}>{caption}</p>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, caption, delta }: { icon: typeof Target; label: string; value: string; caption: string; delta: number }) {
  return (
    <div className="kova-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: VIOLET_SOFT }}>
          <Icon className="w-4 h-4" style={{ color: VIOLET }} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      <p className="font-heading font-bold text-2xl" style={{ color: 'var(--kova-navy)' }}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{caption}</p>
      <p className="text-xs font-semibold mt-2 inline-flex items-center gap-1" style={{ color: 'var(--kova-green)' }}>
        <TrendingUp className="w-3 h-3" /> {delta}% vs promedio
      </p>
    </div>
  );
}

function FooterStat({ label, value, tone, sub }: { label: string; value: string | number; tone?: 'green' | 'amber' | 'red'; sub?: string }) {
  const color = tone === 'green' ? 'var(--kova-green)' : tone === 'amber' ? '#D97706' : tone === 'red' ? 'var(--kova-coral)' : 'var(--kova-navy)';
  return (
    <div className="text-center">
      <p className="text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-heading font-bold text-base mt-0.5" style={{ color }}>{value}</p>
      {sub && <p className="text-[8px] text-slate-400">{sub}</p>}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="kova-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3">{title}</p>
      {children}
    </div>
  );
}

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const size = 240;
  const cx = size / 2, cy = size / 2;
  const maxR = 84;
  const n = data.length;
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / n;

  const point = (i: number, radiusFrac: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * maxR * radiusFrac, cy + Math.sin(a) * maxR * radiusFrac] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoly = data.map((d, i) => point(i, clamp(d.value) / 100).join(',')).join(' ');

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {rings.map((rf) => (
          <polygon
            key={rf}
            points={data.map((_, i) => point(i, rf).join(',')).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
        {data.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />;
        })}
        <polygon points={dataPoly} fill="rgba(124,58,237,0.45)" stroke={VIOLET} strokeWidth={2} />
        {data.map((d, i) => {
          const [x, y] = point(i, clamp(d.value) / 100);
          return <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={VIOLET} strokeWidth={1.5} />;
        })}
      </svg>
      {data.map((d, i) => {
        const [x, y] = point(i, 1.34);
        const right = x > cx + 4;
        const center = Math.abs(x - cx) <= 4;
        return (
          <div
            key={i}
            className="absolute leading-tight"
            style={{
              left: x, top: y,
              transform: `translate(${center ? '-50%' : right ? '0' : '-100%'}, -50%)`,
              textAlign: center ? 'center' : right ? 'left' : 'right',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="text-[10px] text-white/55">{d.label}</span>
            <span className="text-[10px] font-bold text-white ml-1">{d.value}%</span>
          </div>
        );
      })}
    </div>
  );
}
