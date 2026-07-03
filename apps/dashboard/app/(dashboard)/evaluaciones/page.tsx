'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Briefcase,
  ChevronDown,
  Clock,
  User,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Award,
  Users,
  ClipboardList,
  TrendingUp,
  Medal,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
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

function ScoreRing({ value, size = 56, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = scoreColor(value);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF1F6" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-heading font-bold"
        style={{ color, fontSize: size * 0.28 }}
      >
        {value}%
      </span>
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

  const stats = useMemo(() => {
    const totalCandidates = processes.reduce((s, p) => s + p.candidateCount, 0);
    const totalTests = processes.reduce((s, p) => s + p.testCount, 0);
    const avg = processes.length
      ? Math.round(processes.reduce((s, p) => s + p.avgScore, 0) / processes.length)
      : 0;
    return { totalProcesses: processes.length, totalCandidates, totalTests, avg };
  }, [processes]);

  const toggleProcess = (id: string) => {
    setOpenProcess((prev) => (prev === id ? null : id));
    setOpenCandidate(null);
  };

  const toggleCandidate = (key: string) => {
    setOpenCandidate((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Evaluaciones</h1>
        <p className="text-sm text-slate-500">
          Resultados por proceso de selección — candidatos evaluados, puntajes y errores por prueba.
        </p>
      </div>

      {!isLoading && processes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Briefcase} label="Procesos" value={stats.totalProcesses} tint="#EEF2FA" color="var(--kova-blue)" />
          <StatCard icon={Users} label="Candidatos" value={stats.totalCandidates} tint="#F3E8FF" color="#7C3AED" />
          <StatCard icon={ClipboardList} label="Pruebas" value={stats.totalTests} tint="#ECFEFF" color="#0E7490" />
          <StatCard icon={TrendingUp} label="Promedio general" value={`${stats.avg}%`} tint={scoreTrack(stats.avg)} color={scoreColor(stats.avg)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="kova-card p-5 animate-pulse flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-100 rounded" />
                <div className="h-2 w-1/4 bg-slate-100 rounded" />
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : processes.length === 0 ? (
        <div className="kova-card p-10 text-center">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">No hay evaluaciones registradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {processes.map((process) => (
            <ProcessCard
              key={process.vacancyId}
              process={process}
              isOpen={openProcess === process.vacancyId}
              openCandidate={openCandidate}
              onToggle={() => toggleProcess(process.vacancyId)}
              onToggleCandidate={toggleCandidate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint, color }: {
  icon: typeof Briefcase;
  label: string;
  value: number | string;
  tint: string;
  color: string;
}) {
  return (
    <div className="kova-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="font-heading font-bold text-xl leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function ProcessCard({
  process,
  isOpen,
  openCandidate,
  onToggle,
  onToggleCandidate,
}: {
  process: ProcessEvalGroup;
  isOpen: boolean;
  openCandidate: string | null;
  onToggle: () => void;
  onToggleCandidate: (key: string) => void;
}) {
  const accent = scoreColor(process.avgScore);
  return (
    <div className="kova-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors relative"
      >
        <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
          <Briefcase className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/procesos/${process.vacancyId}`}
            onClick={(e) => e.stopPropagation()}
            className="font-heading font-semibold hover:underline"
            style={{ color: 'var(--kova-navy)' }}
          >
            {process.vacancyTitle}
          </Link>
          {process.companyName && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3" />
              {process.companyName}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-flex items-center gap-1">
              <Users className="w-3 h-3" /> {process.candidateCount} candidato{process.candidateCount !== 1 ? 's' : ''}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> {process.testCount} prueba{process.testCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center shrink-0">
          <ScoreRing value={process.avgScore} />
          <p className="text-[10px] text-slate-400 mt-1">promedio</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 divide-y divide-slate-100">
          {process.candidates.map((candidate, idx) => {
            const key = `${process.vacancyId}-${candidate.candidateId ?? candidate.candidateName}`;
            return (
              <CandidateRow
                key={key}
                candidate={candidate}
                rank={idx + 1}
                isOpen={openCandidate === key}
                onToggle={() => onToggleCandidate(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, { bg: string; color: string }> = {
    1: { bg: '#FEF3C7', color: '#B45309' },
    2: { bg: '#F1F5F9', color: '#64748B' },
    3: { bg: '#FFEDD5', color: '#C2410C' },
  };
  const s = styles[rank];
  if (s) {
    return (
      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2" style={{ background: s.bg }}>
        <Medal className="w-4 h-4" style={{ color: s.color }} />
      </span>
    );
  }
  return (
    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2 text-xs font-semibold text-slate-500" style={{ background: '#EEF2FA' }}>
      {rank}
    </span>
  );
}

function CandidateRow({
  candidate,
  rank,
  isOpen,
  onToggle,
}: {
  candidate: CandidateEvalGroup;
  rank: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const color = scoreColor(candidate.avgScore);
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white transition-colors"
      >
        <RankBadge rank={rank} />
        <div className="flex-1 min-w-0">
          {candidate.candidateId ? (
            <Link
              href={`/candidatos/${candidate.candidateId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--kova-navy)' }}
            >
              {candidate.candidateName}
            </Link>
          ) : (
            <span className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{candidate.candidateName}</span>
          )}
          <p className="text-xs text-slate-500 mt-0.5">
            {candidate.testCount} prueba{candidate.testCount !== 1 ? 's' : ''} · {formatDuration(candidate.totalDuration)}
          </p>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden max-w-[220px]" style={{ background: scoreTrack(candidate.avgScore) }}>
            <div className="h-full rounded-full" style={{ width: `${candidate.avgScore}%`, background: color }} />
          </div>
        </div>
        <span className="font-heading font-bold text-lg shrink-0" style={{ color }}>
          {candidate.avgScore}%
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 pb-4 sm:pl-16 space-y-3">
          {candidate.tests.map((a) => (
            <TestDetail key={a.id} test={a as Assessment} />
          ))}
        </div>
      )}
    </div>
  );
}

function TestDetail({ test }: { test: Assessment }) {
  const mistakes = test.mistakes ?? [];
  const hasMistakes = mistakes.length > 0;
  const pct = Math.round((test.score / test.maxScore) * 100);
  const color = scoreColor(test.score, test.maxScore);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{test.type}</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={resultStyle(test.result)}>{test.result}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{test.competency}</p>
          {test.completedAt && (
            <p className="text-xs text-slate-400 mt-1">
              {new Date(test.completedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-center">
            <span className="font-heading font-bold text-lg" style={{ color }}>
              {test.score}<span className="text-slate-400 text-sm font-normal">/{test.maxScore}</span>
            </span>
            <p className="text-xs text-slate-400">puntaje</p>
          </div>
          <div className="text-center">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(test.durationMinutes, test.durationLabel)}
            </span>
            <p className="text-xs text-slate-400">duración</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: scoreTrack(test.score, test.maxScore) }}>
          <div className="h-full rounded-full flex items-center justify-end pr-1" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      {test.comments && (
        <p className="text-sm text-slate-600 mx-4 mt-3 p-3 rounded-lg bg-slate-50">{test.comments}</p>
      )}

      <div className="p-4 pt-3">
        {hasMistakes ? (
          <div className="rounded-lg border border-red-100" style={{ background: '#FFF7F6' }}>
            <p className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 px-3 pt-3 pb-2" style={{ color: 'var(--kova-coral)' }}>
              <AlertTriangle className="w-3.5 h-3.5" />
              En qué se equivocó ({mistakes.length})
            </p>
            <ul className="divide-y divide-red-50">
              {mistakes.map((mistake, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2 px-3 py-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs flex items-center justify-center shrink-0 mt-0.5">✗</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-lg border border-green-100 flex items-center gap-2 px-3 py-2.5" style={{ background: '#F0FDF7' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--kova-green)' }} />
            <p className="text-sm text-slate-600">Sin errores registrados en esta prueba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
