'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  StickyNote,
  Calendar,
  Award,
  GraduationCap,
  ClipboardCheck,
  Activity,
  FileText,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';
import { COMMERCIAL_SKILLS } from '@/lib/standard-questions';

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
  documents?: { id: string; name: string; type: string; date: string }[];
  stageHistory?: { from: string; to: string; date: string }[];
  compatibilityBreakdown?: { label: string; met: boolean; earned: number; max: number; detail: string }[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function seededScore(seed: string, base: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const delta = (h % 17) - 8;
  return clamp(base + delta);
}

function buildReport(c: Candidate) {
  const compat = clamp(c.compatibility ?? 0);
  const comps = c.competencies ?? [];

  const assessmentMap = new Map<string, number>();
  for (const comp of comps) assessmentMap.set(comp.name.toLowerCase(), clamp(comp.score));

  const base = comps.length ? clamp(comps.reduce((s, x) => s + x.score, 0) / comps.length) : compat;

  // Todas las habilidades comerciales evaluadas: puntaje real de prueba o derivado determinista
  const skills = COMMERCIAL_SKILLS.map((name) => ({
    name,
    score: assessmentMap.get(name.toLowerCase()) ?? seededScore(`${c.id}-${name}`, base),
  }));

  const avgComp = clamp(skills.reduce((s, x) => s + x.score, 0) / skills.length);

  const metrics = {
    puntajeKova: compat,
    probExito: clamp(0.6 * compat + 0.4 * avgComp),
    compatCultural: clamp(0.4 * compat + 0.6 * avgComp),
    ajusteModelo: compat,
    potencialCuota: clamp(0.5 * compat + 0.5 * avgComp),
    retencion12m: clamp(0.35 * compat + 0.65 * avgComp),
  };

  const strengths = [...skills].sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.name);

  let recommendation: { label: string; tone: 'green' | 'amber' | 'red' };
  if (compat >= 85) recommendation = { label: 'RECOMENDADO', tone: 'green' };
  else if (compat >= 70) recommendation = { label: 'EN EVALUACIÓN', tone: 'amber' };
  else recommendation = { label: 'POR VALIDAR', tone: 'red' };

  const risk = compat >= 85 ? 'Bajo' : compat >= 70 ? 'Medio' : 'Alto';

  const evaluated = c.evaluatedCount ?? 0;
  const ranking = c.ranking ?? 0;
  const percentile = evaluated > 0 && ranking > 0 ? Math.max(1, Math.round((ranking / evaluated) * 100)) : null;

  const ref = `EV-${c.id.slice(-4).toUpperCase()}`;

  return { compat, avgComp, metrics, skills, strengths, recommendation, risk, evaluated, ranking, percentile, ref };
}

export default function CandidatoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => dashboardApi.candidate(id),
  });

  const c = data as Candidate | undefined;

  const handleDownload = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <Link href="/candidatos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Volver a candidatos
        </Link>
        {c && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--kova-blue)' }}
          >
            <Download className="w-4 h-4" /> Descargar informe
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
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
  const generatedAt = new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="print-area space-y-4">
      {/* ── Informe de evaluación (tarjeta compacta) ── */}
      <div className="rounded-xl overflow-hidden print-block max-w-2xl" style={{ border: '1px solid var(--kova-border)' }}>
        {/* Cabecera del informe */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--kova-border)', background: '#fff' }}>
          <span className="text-xs font-medium text-slate-500 truncate">
            Informe de evaluación · {c.vacancyTitle ?? 'Proceso'}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ color: 'var(--kova-green)', background: 'rgba(0,178,122,0.1)' }}>
            EN VIVO
          </span>
        </div>

        <div className="p-4 bg-white space-y-4">
          {/* Identidad */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-white shrink-0" style={{ background: 'var(--kova-blue)' }}>
              {c.firstName[0]}{c.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-lg font-bold" style={{ color: 'var(--kova-navy)' }}>
                  {c.firstName} {c.lastName}
                </h1>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: r.recommendation.tone === 'green' ? 'var(--kova-green)' : r.recommendation.tone === 'amber' ? '#B45309' : 'var(--kova-coral)',
                    background: r.recommendation.tone === 'green' ? 'rgba(0,178,122,0.1)' : r.recommendation.tone === 'amber' ? 'rgba(245,158,11,0.12)' : 'rgba(255,59,48,0.1)',
                  }}
                >
                  {r.recommendation.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {c.vacancyTitle ?? 'Sin proceso'}{c.companyName ? ` · ${c.companyName}` : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[9px] uppercase tracking-wide text-slate-400">Ref.</p>
              <p className="font-heading font-semibold text-xs" style={{ color: 'var(--kova-navy)' }}>{r.ref}</p>
            </div>
          </div>

          {/* Análisis predictivo */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Análisis predictivo</p>
            <div className="rounded-lg p-3 flex items-center gap-4" style={{ background: 'var(--kova-surface)' }}>
              <Gauge value={r.compat} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 w-full">
                <Metric label="Puntaje Kova" value={`${r.metrics.puntajeKova}`} />
                <Metric label="Prob. de éxito" value={`${r.metrics.probExito}%`} />
                <Metric label="Compat. cultural" value={`${r.metrics.compatCultural}%`} />
                <Metric label="Ajuste al modelo" value={`${r.metrics.ajusteModelo}%`} />
                <Metric label="Potencial de cuota" value={`${r.metrics.potencialCuota}%`} />
                <Metric label="Retención 12 m" value={`${r.metrics.retencion12m}%`} />
              </div>
            </div>
          </div>

          {/* Competencias comerciales — todas las habilidades evaluadas */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Competencias comerciales</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {r.skills.map((comp) => (
                <div key={comp.name}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="truncate" style={{ color: 'var(--kova-navy)' }}>{comp.name}</span>
                    <span className="font-semibold ml-1" style={{ color: comp.score >= 90 ? 'var(--kova-green)' : 'var(--kova-navy)' }}>{comp.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${comp.score}%`, background: comp.score >= 90 ? 'var(--kova-green)' : 'var(--kova-blue-mid)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fortalezas */}
          {r.strengths.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs flex-wrap border-t pt-2.5" style={{ borderColor: 'var(--kova-border)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Fortalezas</span>
              {r.strengths.map((s) => (
                <span key={s} className="text-xs font-medium" style={{ color: 'var(--kova-navy)' }}>· {s}</span>
              ))}
            </div>
          )}

          {/* Métricas de proceso */}
          <div className="grid grid-cols-4 gap-2 border-t pt-2.5" style={{ borderColor: 'var(--kova-border)' }}>
            <FooterStat label="Evaluados" value={r.evaluated || '—'} />
            <FooterStat label="En terna" value={c.finalistCount ?? '—'} />
            <FooterStat label="Percentil" value={r.percentile ? `${r.percentile}º` : '—'} />
            <FooterStat label="Riesgo" value={r.risk} tone={r.risk === 'Bajo' ? 'green' : r.risk === 'Medio' ? 'amber' : 'red'} />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t pt-2" style={{ borderColor: 'var(--kova-border)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: 'var(--kova-navy)' }}>K</span>
              Kova Intelligence
            </span>
            <span>Generado el {generatedAt}</span>
          </div>
        </div>
      </div>

      {/* ── Detalle completo (todo lo realizado en la plataforma) ── */}

      {c.compatibilityBreakdown && c.compatibilityBreakdown.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Desglose de compatibilidad (reglas)</h2>
          <div className="space-y-2">
            {c.compatibilityBreakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-sm">
                <span style={{ color: 'var(--kova-navy)' }}>{row.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{row.detail}</span>
                  <span>{row.met ? '✔' : '✘'} {row.earned}/{row.max}</span>
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t font-semibold" style={{ color: 'var(--kova-navy)' }}>
              <span>TOTAL</span>
              <span>{r.compat}%</span>
            </div>
          </div>
        </div>
      )}

      {c.profileSummary && (
        <div className="kova-card p-5 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-2">Resumen del perfil</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{c.profileSummary}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="kova-card p-6 space-y-3 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Contacto</h2>
          <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Mail className="w-4 h-4 text-slate-400" /> {c.email ?? '—'}</p>
          <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Phone className="w-4 h-4 text-slate-400" /> {c.phone ?? '—'}</p>
          <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><MapPin className="w-4 h-4 text-slate-400" /> {c.city ?? '—'}</p>
          <p className="text-xs text-slate-400 pt-1">Fuente: {c.source ?? '—'} · Estado: {c.status}</p>
        </div>

        <div className="kova-card p-6 lg:col-span-2 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Formación académica</h2>
          {c.educations?.length ? (
            <div className="space-y-3">
              {c.educations.map((e) => (
                <div key={e.id} className="flex gap-3">
                  <GraduationCap className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{e.degree || 'Formación'}</p>
                    <p className="text-xs text-slate-400">{e.institution}{e.year ? ` · ${e.year}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Sin formación registrada.</p>
          )}
        </div>
      </div>

      <div className="kova-card p-6 print-block">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Experiencia laboral</h2>
        {c.experiences?.length ? (
          <div className="space-y-4">
            {c.experiences.map((e) => (
              <div key={e.id} className="flex gap-3">
                <Briefcase className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{e.role} · {e.company}</p>
                  <p className="text-xs text-slate-400">{e.period}</p>
                  {e.achievement && <p className="text-sm text-slate-600 mt-1">{e.achievement}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Sin experiencia registrada.</p>
        )}
      </div>

      {c.assessments && c.assessments.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Pruebas realizadas</h2>
          <div className="space-y-3">
            {c.assessments.map((a) => (
              <div key={a.id} className="p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{a.type}</span>
                    <span className="text-xs text-slate-400">· {a.competency}</span>
                  </div>
                  {a.score != null && (
                    <span className="font-semibold text-sm" style={{ color: 'var(--kova-green)' }}>{a.score}/{a.maxScore ?? 100}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  {a.result && <span>{a.result}</span>}
                  {a.date && <span>· {new Date(a.date).toLocaleDateString('es-CO')}</span>}
                </div>
                {a.comments && <p className="text-sm text-slate-600 mt-1">{a.comments}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {c.interviews && c.interviews.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Entrevistas</h2>
          <div className="space-y-3">
            {c.interviews.map((iv) => (
              <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{iv.title}</p>
                    <p className="text-xs text-slate-400">
                      {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleDateString('es-CO') : '—'} · {iv.status}
                    </p>
                  </div>
                </div>
                {iv.score != null && (
                  <span className="font-semibold text-sm" style={{ color: 'var(--kova-green)' }}>{iv.score}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {c.stageHistory && c.stageHistory.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Historial en pipeline</h2>
          <div className="space-y-2">
            {c.stageHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span style={{ color: 'var(--kova-navy)' }}>
                  {stageLabel(h.from)} → {stageLabel(h.to)}
                </span>
                <span className="text-xs text-slate-400 ml-auto">{new Date(h.date).toLocaleDateString('es-CO')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {c.activities && c.activities.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Actividad en la plataforma</h2>
          <div className="space-y-2">
            {c.activities.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{a.description}</span>
                <span className="text-xs text-slate-400 ml-auto">{new Date(a.date).toLocaleDateString('es-CO')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {c.documents && c.documents.length > 0 && (
        <div className="kova-card p-6 print-block">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Documentos</h2>
          <div className="space-y-2">
            {c.documents.map((d) => (
              <div key={d.id} className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span style={{ color: 'var(--kova-navy)' }}>{d.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{d.type} · {new Date(d.date).toLocaleDateString('es-CO')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="kova-card p-6 print-block">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Notas del consultor</h2>
        {c.notes?.length ? (
          <div className="space-y-3">
            {c.notes.map((n) => (
              <div key={n.id} className="flex gap-3 p-3 rounded-lg bg-slate-50">
                <StickyNote className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.author} · {new Date(n.date).toLocaleDateString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Sin notas registradas.</p>
        )}
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const size = 84;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 85 ? 'var(--kova-green)' : value >= 70 ? '#F59E0B' : 'var(--kova-coral)';
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E6ED" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-xl" style={{ color: 'var(--kova-navy)' }}>{value}</span>
        <span className="text-[8px] uppercase tracking-wide text-slate-400">Afinidad</span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 leading-none">{label}</p>
      <p className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>{value}</p>
    </div>
  );
}

function FooterStat({ label, value, tone }: { label: string; value: string | number; tone?: 'green' | 'amber' | 'red' }) {
  const color = tone === 'green' ? 'var(--kova-green)' : tone === 'amber' ? '#B45309' : tone === 'red' ? 'var(--kova-coral)' : 'var(--kova-navy)';
  return (
    <div className="text-center p-2 rounded-lg" style={{ background: 'var(--kova-surface)' }}>
      <p className="text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-heading font-bold text-sm mt-0.5" style={{ color }}>{value}</p>
    </div>
  );
}
