'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Briefcase, ChevronDown, ChevronRight, Clock, AlertTriangle, Building2,
  CheckCircle2, Users, ClipboardList, TrendingUp, Medal, Filter, Calendar,
  FileBarChart, Bell, Download, ClipboardCheck, Award, X,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';
import type { CandidateEvalGroup, ProcessEvalGroup } from '@/lib/evaluations';

type Assessment = {
  id: string;
  type: string;
  competency: string;
  score: number;
  maxScore: number;
  result: string;
  durationMinutes?: number;
  durationLabel?: string;
  completedAt?: string;
  comments?: string;
  mistakes?: string[];
};

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

function resultStyle(result: string) {
  if (result === 'Aprobado') return { background: '#E6FAF3', color: 'var(--kova-green)' };
  if (result === 'En revisión') return { background: '#FFF7E6', color: '#B7791F' };
  return { background: '#FFF0EE', color: 'var(--kova-coral)' };
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

function ScoreRing({ value, size = 56, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: string }) {
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
        <span className="absolute inset-0 flex items-center justify-center font-heading font-bold" style={{ color, fontSize: size * 0.26 }}>
          {value}%
        </span>
      </div>
      {label && <p className="text-[10px] text-slate-400 mt-1 text-center">{label}</p>}
    </div>
  );
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

  const stats = useMemo(() => {
    const totalCandidates = processes.reduce((s, p) => s + p.candidateCount, 0);
    const totalTests = processes.reduce((s, p) => s + p.testCount, 0);
    const avg = processes.length
      ? Math.round(processes.reduce((s, p) => s + p.avgScore, 0) / processes.length)
      : 0;
    return { totalProcesses: processes.length, totalCandidates, totalTests, avg };
  }, [processes]);

  const testSummary = useMemo(() => {
    const map = new Map<string, { count: number; total: number; scores: number[] }>();
    for (const p of processes) {
      for (const c of p.candidates) {
        for (const t of c.tests) {
          const key = t.type;
          const entry = map.get(key) ?? { count: 0, total: 0, scores: [] };
          entry.count += 1;
          entry.total += 1;
          entry.scores.push(Math.round((t.score / t.maxScore) * 100));
          map.set(key, entry);
        }
      }
    }
    return Array.from(map.entries()).map(([type, v]) => ({
      type,
      count: v.count,
      avg: v.scores.length ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : 0,
    }));
  }, [processes]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { label: '90–100', min: 90, max: 100, count: 0, color: 'var(--kova-green)' },
      { label: '70–89', min: 70, max: 89, count: 0, color: '#2D5BE3' },
      { label: '50–69', min: 50, max: 69, count: 0, color: '#F59E0B' },
      { label: '<50', min: 0, max: 49, count: 0, color: 'var(--kova-coral)' },
    ];
    for (const p of processes) {
      for (const c of p.candidates) {
        const pct = c.avgScore;
        const bucket = buckets.find((b) => pct >= b.min && pct <= b.max);
        if (bucket) bucket.count += 1;
      }
    }
    const total = buckets.reduce((s, b) => s + b.count, 0) || 1;
    return buckets.map((b) => ({ ...b, pct: Math.round((b.count / total) * 100) }));
  }, [processes]);

  const toggleProcess = (id: string) => {
    setOpenProcess((prev) => (prev === id ? null : id));
    setOpenCandidate(null);
    setOpenTest(null);
  };

  const now = new Date();
  const monthLabel = now.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });

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
          <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            1 {monthLabel.split(' ')[0]} – {now.getDate()} {monthLabel}
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
        </div>
      </div>

      {!isLoading && processes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Briefcase} label="Procesos en total" value={stats.totalProcesses} tint="#EEF2FA" color="var(--kova-blue)" />
          <StatCard icon={Users} label="Candidatos evaluados" value={stats.totalCandidates} tint="#F3E8FF" color="#7C3AED" />
          <StatCard icon={ClipboardList} label="Pruebas realizadas" value={stats.totalTests} tint="#ECFEFF" color="#0E7490" />
          <StatCard icon={TrendingUp} label="Promedio general" value={`${stats.avg}%`} tint={scoreTrack(stats.avg)} color={scoreColor(stats.avg)} />
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Columna principal */}
        <div className="space-y-4 min-w-0">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="kova-card p-5 kova-skeleton h-24 rounded-2xl" />
              ))}
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
                isOpen={openProcess === process.vacancyId}
                openCandidate={openCandidate}
                openTest={openTest}
                onToggle={() => toggleProcess(process.vacancyId)}
                onToggleCandidate={(key) => { setOpenCandidate((p) => p === key ? null : key); setOpenTest(null); }}
                onToggleTest={(id) => setOpenTest((p) => p === id ? null : id)}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        {!isLoading && processes.length > 0 && (
          <div className="space-y-4 xl:sticky xl:top-20">
            <div className="kova-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Resumen por prueba</h3>
              <div className="space-y-3">
                {testSummary.map((t) => (
                  <div key={t.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">{t.type}</span>
                      <span className="text-[10px] text-slate-400">{t.count} realizada{t.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: scoreTrack(t.avg) }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${t.avg}%`, background: scoreColor(t.avg) }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-right">{t.avg}% promedio</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="kova-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Distribución de puntajes</h3>
              <DonutChart buckets={scoreDistribution} />
              <div className="mt-3 space-y-1.5">
                {scoreDistribution.map((b) => (
                  <div key={b.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                      {b.label}
                    </span>
                    <span className="font-semibold text-slate-700">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kova-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Acciones rápidas</h3>
              <div className="space-y-1">
                <QuickAction icon={FileBarChart} label="Ver reporte completo" href="/reportes" />
                <QuickAction icon={Bell} label="Enviar recordatorios" href="/tareas" />
                <QuickAction icon={Download} label="Exportar resultados" href="/documentos" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint, color }: {
  icon: typeof Briefcase; label: string; value: number | string; tint: string; color: string;
}) {
  return (
    <div className="kova-card kova-card-hover p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="font-heading font-bold text-xl leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[11px] text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href }: { icon: typeof FileBarChart; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--kova-blue)] transition-colors group">
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-[var(--kova-blue)] shrink-0" />
      {label}
      <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-[var(--kova-blue)]" />
    </Link>
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
      <div className="w-28 h-28 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
        <span className="text-xs text-slate-400">Sin datos</span>
      </div>
    );
  }

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEF1F6" strokeWidth="3" />
        {segments.map((seg) => {
          const dash = seg.end - seg.start;
          return (
            <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
              stroke={seg.color} strokeWidth="3"
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
    <div className="flex items-center gap-0 mt-2 overflow-x-auto pb-0.5">
      {PIPELINE_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 ${
                done ? 'bg-[var(--kova-green)] border-[var(--kova-green)] text-white' :
                active ? 'bg-white border-[var(--kova-blue)] text-[var(--kova-blue)]' :
                'bg-white border-slate-200 text-slate-300'
              }`}>
                {done ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-[9px] mt-0.5 whitespace-nowrap ${active ? 'font-semibold text-[var(--kova-blue)]' : done ? 'text-[var(--kova-green)]' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className={`h-0.5 w-4 mx-0.5 mb-3 rounded ${done ? 'bg-[var(--kova-green)]' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProcessCard({ process, isOpen, openCandidate, openTest, onToggle, onToggleCandidate, onToggleTest }: {
  process: ProcessEvalGroup;
  isOpen: boolean;
  openCandidate: string | null;
  openTest: string | null;
  onToggle: () => void;
  onToggleCandidate: (key: string) => void;
  onToggleTest: (id: string) => void;
}) {
  const accent = scoreColor(process.avgScore);
  const initials = process.companyName?.split(' ').slice(0, 2).map((w) => w[0]).join('') ?? '?';

  return (
    <div className="kova-card overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50/60 transition-colors relative">
        <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-sm"
          style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
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
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 divide-y divide-slate-100">
          {process.candidates.map((candidate, idx) => {
            const key = `${process.vacancyId}-${candidate.candidateId ?? candidate.candidateName}`;
            const stageIdx = inferStageIndex(candidate.candidateId, candidate.testCount);
            return (
              <CandidateSection
                key={key}
                candidate={candidate}
                rank={idx + 1}
                stageIndex={stageIdx}
                isOpen={openCandidate === key}
                openTest={openTest}
                onToggle={() => onToggleCandidate(key)}
                onToggleTest={onToggleTest}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const colors = [{ bg: '#FEF3C7', color: '#B45309' }, { bg: '#F1F5F9', color: '#64748B' }, { bg: '#FFEDD5', color: '#C2410C' }];
    const s = colors[rank - 1];
    return (
      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: s.bg }}>
        <Medal className="w-4 h-4" style={{ color: s.color }} />
      </span>
    );
  }
  return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-slate-500" style={{ background: '#EEF2FA' }}>
      {rank}
    </span>
  );
}

function CandidateSection({ candidate, rank, stageIndex, isOpen, openTest, onToggle, onToggleTest }: {
  candidate: CandidateEvalGroup;
  rank: number;
  stageIndex: number;
  isOpen: boolean;
  openTest: string | null;
  onToggle: () => void;
  onToggleTest: (id: string) => void;
}) {
  const color = scoreColor(candidate.avgScore);
  return (
    <div className="bg-slate-50/40">
      <button type="button" onClick={onToggle}
        className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-white transition-colors">
        <RankBadge rank={rank} />
        <div className="flex-1 min-w-0">
          {candidate.candidateId ? (
            <Link href={`/candidatos/${candidate.candidateId}`} onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold hover:underline" style={{ color: 'var(--kova-navy)' }}>
              {candidate.candidateName}
            </Link>
          ) : (
            <span className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{candidate.candidateName}</span>
          )}
          <StageTimeline currentIndex={stageIndex} />
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-400">Desempeño general</p>
          <p className="font-heading font-bold text-xl" style={{ color }}>{candidate.avgScore}%</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 mt-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 pb-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Prueba</span>
              <span className="hidden sm:block">Estado</span>
              <span>Puntaje</span>
              <span className="hidden md:block">Duración</span>
              <span />
            </div>
            {candidate.tests.map((test) => (
              <TestRow
                key={test.id}
                test={test as Assessment}
                isExpanded={openTest === test.id}
                onToggle={() => onToggleTest(test.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TestRow({ test, isExpanded, onToggle }: { test: Assessment; isExpanded: boolean; onToggle: () => void }) {
  const pct = Math.round((test.score / test.maxScore) * 100);
  const color = scoreColor(test.score, test.maxScore);
  const mistakes = test.mistakes ?? [];
  const strengths = extractStrengths(test.comments, mistakes);

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button type="button" onClick={onToggle}
        className="w-full grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-3 text-left hover:bg-slate-50/60 transition-colors">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{test.type}</p>
          <p className="text-[10px] text-slate-400 truncate">{test.competency}</p>
        </div>
        <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={resultStyle(test.result)}>
          {test.result}
        </span>
        <div className="w-20 sm:w-24">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: scoreTrack(test.score, test.maxScore) }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </div>
          <p className="text-[10px] font-bold mt-0.5 text-right" style={{ color }}>{test.score}/{test.maxScore}</p>
        </div>
        <span className="hidden md:inline text-xs text-slate-500 whitespace-nowrap">
          <Clock className="w-3 h-3 inline mr-0.5" />
          {formatDuration(test.durationMinutes, test.durationLabel)}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
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
