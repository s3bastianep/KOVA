'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  Clock,
  LineChart,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import {
  assessmentQualitative,
  assessmentResultBadge,
  type CandidateAssessment,
} from '@/lib/evaluations';

const TEST_ICONS: { match: RegExp; icon: typeof ClipboardList }[] = [
  { match: /role|play|rol/i, icon: Video },
  { match: /comercial|ventas/i, icon: LineChart },
  { match: /conduct|psico|comporta/i, icon: Users },
  { match: /técnic|tecnic|producto|gestión/i, icon: Wrench },
];

function testIcon(type: string) {
  return TEST_ICONS.find((t) => t.match.test(type))?.icon ?? ClipboardList;
}

function isPending(result?: string, date?: string) {
  const lower = result?.toLowerCase() ?? '';
  return lower.includes('pend') || lower.includes('revis') && !date;
}

type AssessmentCardProps = {
  assessment: CandidateAssessment;
};

export function AssessmentCard({ assessment: a }: AssessmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = testIcon(a.type);
  const pending = isPending(a.result, a.date);
  const max = a.maxScore ?? 100;
  const pct = a.score != null ? Math.round((a.score / max) * 100) : null;
  const qualitative = assessmentQualitative(a.score, max, pending);
  const resultBadge = assessmentResultBadge(a.result);
  const mistakes = a.mistakes ?? [];
  const visibleMistakes = expanded ? mistakes : mistakes.slice(0, 2);
  const dateLabel = a.date
    ? new Date(a.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <article className="rounded-2xl border border-slate-100 bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: qualitative.track, color: qualitative.color }}
            >
              <Icon className="w-5 h-5" strokeWidth={2.1} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-heading font-bold text-[15px]" style={{ color: 'var(--kova-navy)' }}>
                  {a.type}
                </h3>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: resultBadge.bg, color: resultBadge.color }}
                >
                  {resultBadge.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span className="font-medium">{a.competency}</span>
                {a.durationLabel && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {a.durationLabel}
                    </span>
                  </>
                )}
                {dateLabel && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{dateLabel}</span>
                  </>
                )}
              </div>

              {a.feedback && (
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  {a.feedback}
                </p>
              )}
            </div>
          </div>

          {!pending && pct != null && (
            <div
              className="lg:w-36 shrink-0 rounded-xl border px-4 py-3"
              style={{ background: qualitative.track, borderColor: `${qualitative.color}22` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Nivel
              </p>
              <p className="text-sm font-bold" style={{ color: qualitative.color }}>
                {qualitative.label}
              </p>
              <div className="h-1.5 rounded-full overflow-hidden mt-2 bg-white/80">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: qualitative.color }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Desempeño observado en la prueba
              </p>
            </div>
          )}
        </div>

        {mistakes.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/70 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Áreas a reforzar ({mistakes.length})
            </p>
            <ul className="space-y-1.5">
              {visibleMistakes.map((item, index) => (
                <li key={index} className="text-sm text-slate-700 flex gap-2 leading-snug">
                  <span className="text-amber-500 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {mistakes.length > 2 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2.5 text-xs font-semibold inline-flex items-center gap-1 text-amber-800 hover:underline"
              >
                {expanded ? 'Ver menos' : `Ver ${mistakes.length - 2} más`}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
