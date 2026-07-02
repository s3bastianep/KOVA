'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Clock, ChevronDown, ChevronUp, User } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Assessment = {
  id: string;
  candidateId?: string;
  candidateName: string;
  vacancyTitle?: string;
  type: string;
  competency: string;
  score: number;
  maxScore: number;
  result: string;
  durationMinutes?: number;
  durationLabel?: string;
  completedAt?: string;
  comments?: string;
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
  const { data, isLoading } = useQuery({ queryKey: ['assessments'], queryFn: dashboardApi.assessments });
  const items = (data as Assessment[]) ?? [];
  const [open, setOpen] = useState<string | null>(null);

  const byCandidate = useMemo(() => {
    const map = new Map<string, { name: string; candidateId?: string; tests: Assessment[] }>();
    for (const a of items) {
      const key = a.candidateName;
      if (!map.has(key)) map.set(key, { name: key, candidateId: a.candidateId, tests: [] });
      map.get(key)!.tests.push(a);
    }
    return Array.from(map.values()).map((g) => {
      const totalDuration = g.tests.reduce((s, t) => s + (t.durationMinutes ?? 0), 0);
      const avgScore = Math.round(g.tests.reduce((s, t) => s + (t.score / t.maxScore) * 100, 0) / g.tests.length);
      return { ...g, totalDuration, avgScore };
    });
  }, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Evaluaciones</h1>
        <p className="text-sm text-slate-500">Resultados, puntajes y tiempo de cada prueba por candidato.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay evaluaciones registradas.</div>
      ) : (
        <div className="space-y-4">
          {byCandidate.map((group) => (
            <div key={group.name} className="kova-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === group.name ? null : group.name)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                  <User className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  {group.candidateId ? (
                    <Link
                      href={`/candidatos/${group.candidateId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold hover:underline"
                      style={{ color: 'var(--kova-navy)' }}
                    >
                      {group.name}
                    </Link>
                  ) : (
                    <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{group.name}</h3>
                  )}
                  <p className="text-xs text-slate-500">
                    {group.tests.length} prueba{group.tests.length !== 1 ? 's' : ''} · Promedio {group.avgScore}% · Tiempo total {formatDuration(group.totalDuration)}
                  </p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="font-heading font-bold text-xl" style={{ color: scoreColor(group.avgScore, 100) }}>{group.avgScore}%</span>
                  <p className="text-xs text-slate-400">promedio</p>
                </div>
                {open === group.name ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {open === group.name && (
                <div className="border-t border-slate-100">
                  {group.tests.map((a) => (
                    <div key={a.id} className="px-5 py-4 border-b border-slate-50 last:border-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{a.type}</p>
                          <p className="text-xs text-slate-500">{a.competency}{a.vacancyTitle ? ` · ${a.vacancyTitle}` : ''}</p>
                          {a.completedAt && (
                            <p className="text-xs text-slate-400 mt-1">
                              Completada: {new Date(a.completedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-center">
                            <span className="font-heading font-bold text-lg" style={{ color: scoreColor(a.score, a.maxScore) }}>
                              {a.score}/{a.maxScore}
                            </span>
                            <p className="text-xs text-slate-400">puntaje</p>
                          </div>
                          <div className="text-center">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(a.durationMinutes, a.durationLabel)}
                            </span>
                            <p className="text-xs text-slate-400">duración</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full" style={resultStyle(a.result)}>{a.result}</span>
                        </div>
                      </div>
                      {a.comments && (
                        <p className="text-sm text-slate-600 mt-3 p-3 rounded-lg bg-slate-50">{a.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
