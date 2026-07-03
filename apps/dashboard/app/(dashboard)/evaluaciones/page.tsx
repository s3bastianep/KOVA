'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Briefcase, ChevronDown, ChevronRight, Clock, AlertTriangle,
  CheckCircle2, Users, ClipboardList, TrendingUp, TrendingDown, Filter, Calendar,
  Download, ClipboardCheck, Award, X, Video, LineChart, Wrench, Activity,
  Settings, HelpCircle, Send,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';
import type { AssessmentRecord, CandidateEvalGroup, ProcessEvalGroup } from '@/lib/evaluations';

const PIPELINE_STEPS = ['Postulado', 'Pruebas', 'Entrevista', 'Finalista', 'Oferta'] as const;

const STAGE_MAP: Record<string, number> = {
  APPLIED: 0, SCREENING: 0, CALL: 0,
  ASSESSMENT: 1,
  INTERVIEW: 2,
  CLIENT_REVIEW: 3, FINALISTS: 3,
  OFFER: 4, HIRED: 4,
};

const CANDIDATE_STAGE: Record<string, string> = {
  c1: 'INTERVIEW',
  c2: 'ASSESSMENT',
  c3: 'SCREENING',
};

const TEST_ICONS: { match: RegExp; icon: typeof Video }[] = [
  { match: /role|play|rol/i, icon: Video },
  { match: /comercial|ventas/i, icon: LineChart },
  { match: /conduct|psico|comporta/i, icon: Users },
  { match: /técnic|tecnic|producto/i, icon: Wrench },
];

function testIcon(type: string) {
  return TEST_ICONS.find((t) => t.match.test(type))?.icon ?? ClipboardList;
}

function scoreColor(score: number, max = 100) {
  const pct = (score / max) * 100;
  if (pct >= 80) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

function scoreTrack(score: number, max = 100) {
  const pct = (score / max) * 100;
  if (pct >= 80) return '#E6FAF3';
  if (pct >= 70) return '#FFF7E6';
  return '#FFF0EE';
}

function formatDuration(mins?: number, label?: string) {
  if (label) return label;
  if (mins == null) return '—';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function inferStageIndex(candidateId?: string, testCount = 0): number {
  if (candidateId && CANDIDATE_STAGE[candidateId]) {
    return STAGE_MAP[CANDIDATE_STAGE[candidateId]] ?? 1;
  }
  if (testCount >= 2) return 2;
  if (testCount >= 1) return 1;
  return 0;
}

function isPending(t: AssessmentRecord) {
  return t.result === 'En revisión' || t.result === 'Pendiente' || !t.completedAt;
}

function qualitative(pct: number, pending: boolean) {
  if (pending) return { label: 'Pendiente', color: '#94A3B8' };
  if (pct >= 85) return { label: 'Muy bueno', color: 'var(--kova-green)' };
  if (pct >= 70) return { label: 'Bueno', color: 'var(--kova-green)' };
  if (pct >= 50) return { label: 'Regular', color: '#B7791F' };
  return { label: 'Bajo', color: 'var(--kova-coral)' };
}

function processState(avg: number): { label: string; bg: string; color: string } {
  if (avg >= 50) return { label: 'En progreso', bg: '#E6FAF3', color: '#047857' };
  return { label: 'En revisión', bg: '#EEF2FA', color: 'var(--kova-blue)' };
}

function relativeTime(iso?: string) {
  if (!iso) return '—';
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 3600000);
  const timeStr = new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  if (diff < 24 && new Date(iso).getDate() === new Date().getDate()) return `Hoy, ${timeStr}`;
  if (diff < 48) return `Ayer, ${timeStr}`;
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function extractStrengths(comments?: string, mistakes?: string[]): string[] {
  if (!comments) return [];
  const positives: string[] = [];
  const lower = comments.toLowerCase();
  if (lower.includes('excelente')) positives.push(comments.split('.')[0] + '.');
  else if (lower.includes('buen') || lower.includes('buena')) positives.push(comments.split('.')[0] + '.');
  else if (lower.includes('clara') || lower.includes('claro')) positives.push(comments);
  else if (mistakes && mistakes.length === 0) positives.push(comments);
  return positives.slice(0, 3);
}

function percentile(pct: number, all: number[]) {
  if (!all.length) return 0;
  const below = all.filter((s) => s <= pct).length;
  return Math.round((below / all.length) * 100);
}

export default function EvaluacionesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => dashboardApi.assessments(),
  });

  const processes = (data?.processes ?? []) as ProcessEvalGroup[];
  const [openProcess, setOpenProcess] = useState<string | null>(null);
  const [openCandidate, setOpenCandidate] = useState<string | null>(null);
  const [openTest, setOpenTest] = useState<string | null>(null);

  const firstProcessId = processes[0]?.vacancyId ?? null;
  const activeProcess = openProcess ?? firstProcessId;

  const allTestPcts = useMemo(
    () => processes.flatMap((p) => p.candidates.flatMap((c) => c.tests.map((t) => Math.round((t.score / t.maxScore) * 100)))),
    [processes],
  );

  const stats = useMemo(() => {
    const totalCandidates = processes.reduce((s, p) => s + p.candidateCount, 0);
    const totalTests = processes.reduce((s, p) => s + p.testCount, 0);
    const avg = allTestPcts.length ? Math.round(allTestPcts.reduce((a, b) => a + b, 0) / allTestPcts.length) : 0;
    return { totalProcesses: processes.length, totalCandidates, totalTests, avg };
  }, [processes, allTestPcts]);

  const testSummary = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const p of processes)
      for (const c of p.candidates)
        for (const t of c.tests) {
          const arr = map.get(t.type) ?? [];
          arr.push(Math.round((t.score / t.maxScore) * 100));
          map.set(t.type, arr);
        }
    return Array.from(map.entries())
      .map(([type, scores]) => ({
        type,
        count: scores.length,
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [processes]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { label: '90–100', min: 90, max: 100, count: 0, color: 'var(--kova-green)' },
      { label: '70–89', min: 70, max: 89, count: 0, color: '#2D5BE3' },
      { label: '50–69', min: 50, max: 69, count: 0, color: '#F59E0B' },
      { label: '<50', min: 0, max: 49, count: 0, color: 'var(--kova-coral)' },
    ];
    for (const p of processes)
      for (const c of p.candidates) {
        const bucket = buckets.find((b) => c.avgScore >= b.min && c.avgScore <= b.max);
        if (bucket) bucket.count += 1;
      }
    const total = buckets.reduce((s, b) => s + b.count, 0) || 1;
    return buckets.map((b) => ({ ...b, pct: Math.round((b.count / total) * 100) }));
  }, [processes]);

  const general = useMemo(() => {
    const all: { pct: number; type: string; duration: number }[] = [];
    let totalDuration = 0;
    let candidateCount = 0;
    for (const p of processes)
      for (const c of p.candidates) {
        candidateCount += 1;
        totalDuration += c.totalDuration;
        for (const t of c.tests) all.push({ pct: Math.round((t.score / t.maxScore) * 100), type: t.type, duration: t.durationMinutes ?? 0 });
      }
    if (!all.length) return null;
    const best = all.reduce((a, b) => (b.pct > a.pct ? b : a));
    const worst = all.reduce((a, b) => (b.pct < a.pct ? b : a));
    const mean = all.reduce((s, x) => s + x.pct, 0) / all.length;
    const variance = all.reduce((s, x) => s + (x.pct - mean) ** 2, 0) / all.length;
    const stdDev = Math.sqrt(variance);
    const avgTime = candidateCount ? Math.round(totalDuration / candidateCount) : 0;
    return { best, worst, stdDev: stdDev.toFixed(1), avgTime };
  }, [processes]);

  const toggleProcess = (id: string) => {
    setOpenProcess((prev) => (prev === id ? '__none__' : id));
    setOpenCandidate(null);
    setOpenTest(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Evaluaciones"
          subtitle="Resultados por proceso de selección — candidatos evaluados, puntajes y errores por prueba."
          icon={ClipboardCheck}
          accent="#F3E8FF"
          tone="#7C3AED"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/documentos"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Ver documentos
          </Link>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
          >
            <Download className="w-3.5 h-3.5" /> Exportar reporte
          </button>
        </div>
      </div>

      {!isLoading && processes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Briefcase} label="Procesos en total" hint="Activos" value={stats.totalProcesses} tint="#EEF2FA" color="var(--kova-blue)" />
          <StatCard icon={Users} label="Candidatos evaluados" hint="En todos los procesos" value={stats.totalCandidates} tint="#F3E8FF" color="#7C3AED" />
          <StatCard icon={ClipboardList} label="Pruebas realizadas" hint="En total" value={stats.totalTests} tint="#ECFEFF" color="#0E7490" />
          <StatCard icon={TrendingUp} label="Promedio general" hint="↑ 8% vs. periodo anterior" value={`${stats.avg}%`} tint={scoreTrack(stats.avg)} color={scoreColor(stats.avg)} trend />
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Columna principal */}
        <div className="space-y-4 min-w-0">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => <div key={i} className="kova-card kova-skeleton h-28 rounded-2xl" />)}
            </div>
          ) : processes.length === 0 ? (
            <div className="kova-card p-10 text-center">
              <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-400">No hay evaluaciones registradas.</p>
            </div>
          ) : (
            processes.map((process) => (
              <ProcessCard
                key={process.vacancyId}
                process={process}
                allTestPcts={allTestPcts}
                isOpen={activeProcess === process.vacancyId}
                openCandidate={openCandidate}
                openTest={openTest}
                onToggle={() => toggleProcess(process.vacancyId)}
                onToggleCandidate={(key) => { setOpenCandidate((p) => (p === key ? null : key)); setOpenTest(null); }}
                onToggleTest={(id) => setOpenTest((p) => (p === id ? null : id))}
              />
            ))
          )}

          {!isLoading && processes.length > 0 && (
            <div className="rounded-2xl px-5 py-3.5 flex items-center justify-center gap-2 text-sm" style={{ background: '#F3E8FF' }}>
              <HelpCircle className="w-4 h-4" style={{ color: '#7C3AED' }} />
              <span className="text-slate-600">¿Necesitas ayuda para entender estos resultados?</span>
              <Link href="/documentos" className="font-semibold hover:underline inline-flex items-center gap-1" style={{ color: '#7C3AED' }}>
                Consulta nuestra guía de evaluaciones <ArrowRightMini />
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!isLoading && processes.length > 0 && (
          <div className="space-y-4 xl:sticky xl:top-20">
            {/* Resumen por prueba */}
            <div className="kova-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen por prueba</h3>
                <Link href="/reportes" className="text-[11px] font-medium hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver detalle</Link>
              </div>
              <div className="space-y-3.5">
                {testSummary.map((t) => {
                  const Icon = testIcon(t.type);
                  const color = scoreColor(t.avg);
                  return (
                    <div key={t.type} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: scoreTrack(t.avg) }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{t.type}</p>
                          <span className="text-xs font-bold shrink-0" style={{ color }}>{t.avg}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: '#EEF1F6' }}>
                          <div className="h-full rounded-full" style={{ width: `${t.avg}%`, background: color }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.count} realizada{t.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Distribución */}
            <div className="kova-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Distribución de puntajes</h3>
              <div className="flex items-center gap-4">
                <DonutChart buckets={scoreDistribution} />
                <div className="flex-1 space-y-1.5">
                  {scoreDistribution.map((b) => (
                    <div key={b.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                        {b.label}
                      </span>
                      <span className="font-semibold text-slate-500">{b.count} <span className="text-slate-400 font-normal">({b.pct}%)</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detalle general */}
            {general && (
              <div className="kova-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Detalle general</h3>
                <div className="space-y-3">
                  <GeneralRow icon={Award} tone="var(--kova-green)" tint="#E6FAF3" value={`${general.best.pct}%`} label="Mejor puntaje" hint={general.best.type} />
                  <GeneralRow icon={TrendingDown} tone="var(--kova-coral)" tint="#FFF0EE" value={`${general.worst.pct}%`} label="Puntaje más bajo" hint={general.worst.type} />
                  <GeneralRow icon={Activity} tone="var(--kova-blue)" tint="#EEF2FA" value={`${general.stdDev}%`} label="Desviación estándar" hint="En todas las pruebas" />
                  <GeneralRow icon={Clock} tone="#0E7490" tint="#ECFEFF" value={`${general.avgTime} min`} label="Tiempo promedio" hint="Por candidato" />
                </div>
              </div>
            )}

            {/* Acciones rápidas */}
            <div className="kova-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Acciones rápidas</h3>
              <div className="space-y-2">
                <QuickAction icon={Download} label="Exportar reporte" href="/documentos" />
                <QuickAction icon={Users} label="Ver candidatos" href="/candidatos" />
                <QuickAction icon={Settings} label="Configurar pruebas" href="/configuracion" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRightMini() {
  return <ChevronRight className="w-3.5 h-3.5" />;
}

function StatCard({ icon: Icon, label, value, hint, tint, color, trend }: {
  icon: typeof Briefcase; label: string; value: number | string; hint?: string; tint: string; color: string; trend?: boolean;
}) {
  return (
    <div className="kova-card kova-card-hover p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading font-bold text-xl leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[11px] font-medium text-slate-600 mt-1 truncate">{label}</p>
        {hint && <p className={`text-[10px] truncate ${trend ? 'text-green-600 font-medium' : 'text-slate-400'}`}>{hint}</p>}
      </div>
    </div>
  );
}

function GeneralRow({ icon: Icon, tone, tint, value, label, hint }: {
  icon: typeof Award; tone: string; tint: string; value: string; label: string; hint: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-4 h-4" style={{ color: tone }} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className="text-[10px] text-slate-400 truncate">{hint}</p>
      </div>
      <span className="text-sm font-bold shrink-0" style={{ color: 'var(--kova-navy)' }}>{value}</span>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href }: { icon: typeof Download; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[var(--kova-blue)] transition-colors group">
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-[var(--kova-blue)] shrink-0" />
      {label}
      <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-[var(--kova-blue)]" />
    </Link>
  );
}

function ScoreRing({ value, size = 64, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = scoreColor(value);
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF1F6" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-heading font-bold" style={{ color, fontSize: size * 0.28 }}>
          {value}%
        </span>
      </div>
      {label && <p className="text-[10px] text-slate-400 mt-1 text-center">{label}</p>}
    </div>
  );
}

function DonutChart({ buckets }: { buckets: { label: string; count: number; pct: number; color: string }[] }) {
  const total = buckets.reduce((s, b) => s + b.count, 0);
  let cumulative = 0;
  const segments = buckets.filter((b) => b.count > 0).map((b) => {
    const start = cumulative;
    cumulative += b.pct;
    return { ...b, start, end: cumulative };
  });

  if (total === 0) {
    return (
      <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center">
        <span className="text-xs text-slate-400">Sin datos</span>
      </div>
    );
  }

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEF1F6" strokeWidth="3.5" />
        {segments.map((seg) => {
          const dash = seg.end - seg.start;
          return (
            <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
              stroke={seg.color} strokeWidth="3.5"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={-seg.start}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-lg" style={{ color: 'var(--kova-navy)' }}>{total}</span>
        <span className="text-[9px] text-slate-400">candidatos</span>
      </div>
    </div>
  );
}

function StageTimeline({ currentIndex }: { currentIndex: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
      {PIPELINE_STEPS[currentIndex]}
      <span className="text-slate-400 font-normal">· Paso {currentIndex + 1} de {PIPELINE_STEPS.length}</span>
    </span>
  );
}

function ProcessCard({ process, allTestPcts, isOpen, openCandidate, openTest, onToggle, onToggleCandidate, onToggleTest }: {
  process: ProcessEvalGroup;
  allTestPcts: number[];
  isOpen: boolean;
  openCandidate: string | null;
  openTest: string | null;
  onToggle: () => void;
  onToggleCandidate: (key: string) => void;
  onToggleTest: (id: string) => void;
}) {
  const accent = scoreColor(process.avgScore);
  const initials = process.companyName?.split(' ').slice(0, 2).map((w) => w[0]).join('') ?? '?';
  const state = processState(process.avgScore);
  const lastActivity = process.candidates
    .flatMap((c) => c.tests)
    .map((t) => t.completedAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0];

  return (
    <div className="kova-card overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50/60 transition-colors relative">
        <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-sm"
          style={{ background: `${accent}1A`, color: accent }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{process.companyName}</p>
          <Link href={`/procesos/${process.vacancyId}`} onClick={(e) => e.stopPropagation()}
            className="font-heading font-bold hover:underline" style={{ color: 'var(--kova-navy)' }}>
            {process.vacancyTitle}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-flex items-center gap-1">
              <Users className="w-3 h-3" /> {process.candidateCount} candidato{process.candidateCount !== 1 ? 's' : ''}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> {process.testCount} prueba{process.testCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <ScoreRing value={process.avgScore} label="Promedio del proceso" />
        <div className="hidden md:flex flex-col items-center gap-1.5 shrink-0 w-28">
          <span className="text-[10px] text-slate-400">Estado</span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: state.bg, color: state.color }}>{state.label}</span>
          <span className="text-[10px] text-slate-400 text-center leading-tight">Actualizado: {relativeTime(lastActivity)}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 p-4 sm:p-5 space-y-4 bg-slate-50/30">
          {/* Tabla de candidatos */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.6fr_1.1fr_0.8fr_0.9fr_1.1fr_auto] gap-2 px-4 py-2.5 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                <span>Candidato</span>
                <span>Etapa actual</span>
                <span>Promedio</span>
                <span>Pruebas</span>
                <span>Última actividad</span>
                <span />
              </div>
              {process.candidates.map((candidate) => {
                const key = `${process.vacancyId}-${candidate.candidateId ?? candidate.candidateName}`;
                const stageIdx = inferStageIndex(candidate.candidateId, candidate.testCount);
                return (
                  <CandidateRow
                    key={key}
                    candidate={candidate}
                    stageIndex={stageIdx}
                    allTestPcts={allTestPcts}
                    isOpen={openCandidate === key}
                    openTest={openTest}
                    onToggle={() => onToggleCandidate(key)}
                    onToggleTest={onToggleTest}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateRow({ candidate, stageIndex, allTestPcts, isOpen, openTest, onToggle, onToggleTest }: {
  candidate: CandidateEvalGroup;
  stageIndex: number;
  allTestPcts: number[];
  isOpen: boolean;
  openTest: string | null;
  onToggle: () => void;
  onToggleTest: (id: string) => void;
}) {
  const color = scoreColor(candidate.avgScore);
  const q = qualitative(candidate.avgScore, false);
  const initials = candidate.candidateName.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const completed = candidate.tests.filter((t) => !isPending(t)).length;
  const lastTest = [...candidate.tests].sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime())[0];

  return (
    <div className={`border-b border-slate-50 last:border-0 ${isOpen ? 'bg-slate-50/50' : ''}`}>
      <button type="button" onClick={onToggle}
        className="w-full grid grid-cols-[1.6fr_1.1fr_0.8fr_0.9fr_1.1fr_auto] gap-2 items-center px-4 py-3 text-left hover:bg-slate-50/60 transition-colors">
        {/* Candidato */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{candidate.candidateName}</p>
            <p className="text-[10px] text-slate-400 truncate">{candidate.candidateId ? `${candidate.candidateId}@email.com` : 'candidato'}</p>
          </div>
        </div>
        {/* Etapa */}
        <div className="min-w-0"><StageTimeline currentIndex={stageIndex} /></div>
        {/* Promedio */}
        <div>
          <p className="text-sm font-bold leading-none" style={{ color }}>{candidate.avgScore}%</p>
          <p className="text-[10px] font-medium" style={{ color: q.color }}>{q.label}</p>
        </div>
        {/* Pruebas */}
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{completed}/{candidate.testCount}</p>
          <p className="text-[10px] text-slate-400">Completadas</p>
        </div>
        {/* Última actividad */}
        <div className="min-w-0">
          <p className="text-[11px] font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{relativeTime(lastTest?.completedAt)}</p>
          <p className="text-[10px] text-slate-400 truncate">{lastTest?.type ?? '—'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform justify-self-end ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2 mt-1">Detalle de evaluaciones</p>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="grid grid-cols-[1.3fr_1fr_0.9fr_0.9fr_0.6fr_0.9fr_0.7fr_auto] gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Prueba</span>
              <span className="hidden sm:block">Categoría</span>
              <span>Puntaje</span>
              <span>Resultado</span>
              <span className="hidden md:block">Percentil</span>
              <span className="hidden md:block">Realizada</span>
              <span className="hidden lg:block">Duración</span>
              <span />
            </div>
            {candidate.tests.map((test) => (
              <TestRow
                key={test.id}
                test={test}
                allTestPcts={allTestPcts}
                isExpanded={openTest === test.id}
                onToggle={() => onToggleTest(test.id)}
              />
            ))}
          </div>
          {candidate.candidateId && (
            <Link href={`/candidatos/${candidate.candidateId}`} className="inline-flex items-center gap-1 text-xs font-medium mt-3 hover:underline" style={{ color: 'var(--kova-blue)' }}>
              Ver historial completo del candidato <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function TestRow({ test, allTestPcts, isExpanded, onToggle }: { test: AssessmentRecord; allTestPcts: number[]; isExpanded: boolean; onToggle: () => void }) {
  const pct = Math.round((test.score / test.maxScore) * 100);
  const color = scoreColor(test.score, test.maxScore);
  const pending = isPending(test);
  const q = qualitative(pct, pending);
  const perc = percentile(pct, allTestPcts);
  const mistakes = test.mistakes ?? [];
  const strengths = extractStrengths(test.comments, mistakes);
  const Icon = testIcon(test.type);

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button type="button" onClick={onToggle}
        className="w-full grid grid-cols-[1.3fr_1fr_0.9fr_0.9fr_0.6fr_0.9fr_0.7fr_auto] gap-2 items-center px-4 py-3 text-left hover:bg-slate-50/60 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: scoreTrack(test.score, test.maxScore) }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </span>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{test.type}</p>
        </div>
        <p className="hidden sm:block text-xs text-slate-500 truncate">{test.competency}</p>
        {pending ? (
          <span className="text-xs text-slate-300">—</span>
        ) : (
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ color }}>{pct}%</p>
            <div className="h-1 rounded-full overflow-hidden mt-0.5" style={{ background: '#EEF1F6' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] font-medium min-w-0" style={{ color: q.color }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: q.color }} /> {q.label}
        </span>
        <span className="hidden md:block text-xs text-slate-500">{pending ? '—' : perc}</span>
        <span className="hidden md:block text-xs text-slate-500 truncate">{pending ? '—' : relativeTime(test.completedAt)}</span>
        <span className="hidden lg:block text-xs text-slate-500 whitespace-nowrap">{pending ? '—' : formatDuration(test.durationMinutes, test.durationLabel)}</span>
        {pending ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg justify-self-end" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <Send className="w-3 h-3" /> Enviar
          </span>
        ) : (
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform justify-self-end ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isExpanded && !pending && (
        <div className="px-4 pb-4 space-y-3">
          {strengths.length > 0 && (
            <div className="rounded-xl border border-green-100 overflow-hidden" style={{ background: '#F0FDF7' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5 px-3 pt-3 pb-2 text-green-700">
                <Award className="w-3.5 h-3.5" /> Fortalezas detectadas
              </p>
              <ul className="divide-y divide-green-50">
                {strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2 px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mistakes.length > 0 ? (
            <div className="rounded-xl border border-red-100 overflow-hidden" style={{ background: '#FFF7F6' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5 px-3 pt-3 pb-2" style={{ color: 'var(--kova-coral)' }}>
                <AlertTriangle className="w-3.5 h-3.5" /> En qué se equivocó ({mistakes.length})
              </p>
              <ul className="divide-y divide-red-50">
                {mistakes.map((m, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2 px-3 py-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-500" />
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-green-100 flex items-center gap-2 px-3 py-2.5" style={{ background: '#F0FDF7' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <p className="text-sm text-slate-600">Sin errores registrados en esta prueba.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
