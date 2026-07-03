'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Briefcase, ChevronDown, ChevronUp, Clock, User, AlertTriangle, Building2 } from 'lucide-react';
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

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 80) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

function formatDuration(mins?: number, label?: string) {
  if (label) return label;
  if (mins == null) return '—';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export default function EvaluacionesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => dashboardApi.assessments(),
  });

  const processes = (data?.processes ?? []) as ProcessEvalGroup[];
  const [openProcess, setOpenProcess] = useState<string | null>(null);
  const [openCandidate, setOpenCandidate] = useState<string | null>(null);

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

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : processes.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay evaluaciones registradas.</div>
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
  return (
    <div className="kova-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
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
          <p className="text-xs text-slate-500 mt-1">
            {process.candidateCount} candidato{process.candidateCount !== 1 ? 's' : ''} evaluado{process.candidateCount !== 1 ? 's' : ''}
            {' · '}{process.testCount} prueba{process.testCount !== 1 ? 's' : ''}
            {' · '}Promedio {process.avgScore}%
          </p>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <span className="font-heading font-bold text-xl" style={{ color: scoreColor(process.avgScore, 100) }}>
            {process.avgScore}%
          </span>
          <p className="text-xs text-slate-400">promedio proceso</p>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          {process.candidates.map((candidate) => {
            const key = `${process.vacancyId}-${candidate.candidateId ?? candidate.candidateName}`;
            return (
              <CandidateRow
                key={key}
                candidate={candidate}
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

function CandidateRow({
  candidate,
  isOpen,
  onToggle,
}: {
  candidate: CandidateEvalGroup;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white transition-colors"
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2" style={{ background: '#EEF2FA' }}>
          <User className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
        </div>
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
          <p className="text-xs text-slate-500">
            {candidate.testCount} prueba{candidate.testCount !== 1 ? 's' : ''} · Promedio {candidate.avgScore}% · {formatDuration(candidate.totalDuration)}
          </p>
        </div>
        <span className="font-heading font-bold text-lg shrink-0" style={{ color: scoreColor(candidate.avgScore, 100) }}>
          {candidate.avgScore}%
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pl-16 space-y-3">
          {candidate.tests.map((a) => (
            <TestDetail key={a.id} test={a as Assessment} />
          ))}
        </div>
      )}
    </div>
  );
}

function TestDetail({ test }: { test: Assessment }) {
  const hasMistakes = (test.mistakes?.length ?? 0) > 0;

  return (
    <div className="kova-card p-4 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{test.type}</p>
          <p className="text-xs text-slate-500">{test.competency}</p>
          {test.completedAt && (
            <p className="text-xs text-slate-400 mt-1">
              {new Date(test.completedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <span className="font-heading font-bold text-lg" style={{ color: scoreColor(test.score, test.maxScore) }}>
              {test.score}/{test.maxScore}
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
          <span className="text-xs px-2 py-1 rounded-full" style={resultStyle(test.result)}>{test.result}</span>
        </div>
      </div>

      {test.comments && (
        <p className="text-sm text-slate-600 mt-3 p-3 rounded-lg bg-slate-50">{test.comments}</p>
      )}

      {hasMistakes && (
        <div className="mt-3 p-3 rounded-lg border border-red-100" style={{ background: '#FFF5F5' }}>
          <p className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-2" style={{ color: 'var(--kova-coral)' }}>
            <AlertTriangle className="w-3.5 h-3.5" />
            En qué se equivocó
          </p>
          <ul className="space-y-1.5">
            {test.mistakes!.map((mistake, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-red-400 shrink-0">✗</span>
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
