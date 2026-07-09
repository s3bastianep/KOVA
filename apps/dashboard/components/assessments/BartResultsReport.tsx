'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { formatMillions, type RiskJarResult } from '@/lib/risk-jar-game';

const FIT_COLORS: Record<string, string> = {
  hunter: 'var(--kova-violet)',
  farmer: 'var(--kova-blue)',
  hibrido: 'var(--kova-green)',
  requiere_seguimiento: 'var(--kova-coral)',
};

const PACE_LABELS: Record<string, string> = {
  muy_rapido: 'Muy rápido',
  rapido: 'Rápido',
  reflexivo: 'Reflexivo',
  muy_reflexivo: 'Muy reflexivo',
};

type BartResultsReportProps = {
  result: RiskJarResult;
  onRetry: () => void;
};

function scoreBarColor(score: number) {
  if (score >= 76) return 'var(--kova-green)';
  if (score >= 61) return 'var(--kova-blue)';
  if (score >= 41) return 'var(--kova-violet)';
  return 'var(--kova-coral)';
}

export function BartResultsReport({ result, onRetry }: BartResultsReportProps) {
  const { metrics, interpretation, records, competencies, events } = result;
  const fitColor = FIT_COLORS[result.fit] ?? 'var(--kova-blue)';
  const [expandedCompetency, setExpandedCompetency] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <div className="kova-card overflow-hidden">
      <div className="p-8 lg:p-10 border-b border-slate-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">Informe de la prueba</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[var(--kova-navy)]">
              {formatMillions(result.totalSecured)} cobrados
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {result.roundsCompleted} negocios · {result.spills} perdidos · {result.durationSeconds}s
            </p>
          </div>
          <div
            className="rounded-xl border px-4 py-3"
            style={{ borderColor: `${fitColor}30`, background: `${fitColor}0c` }}
          >
            <p className="text-[10px] font-bold uppercase text-slate-500">Encaje observado</p>
            <p className="text-base font-bold" style={{ color: fitColor }}>
              {result.fitLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 lg:p-10 border-b border-slate-100 bg-slate-50/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Perfil observado</h3>
        <ul className="space-y-2 mb-6">
          {interpretation.observedProfile.map((line) => (
            <li key={line} className="text-sm text-slate-700 flex gap-2 leading-relaxed">
              <span className="text-[var(--kova-blue)] shrink-0">•</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Conclusión</p>
          <p className="text-sm text-slate-700 leading-relaxed">{interpretation.conclusion}</p>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">{interpretation.disclaimer}</p>
        </div>
      </div>

      <div className="p-8 lg:p-10 border-b border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nivel 4 — Perfil</p>
        <h3 className="text-lg font-bold text-[var(--kova-navy)] mb-5">Competencias</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Competencia</th>
                <th className="px-4 py-3 w-24">Valor</th>
                <th className="px-4 py-3 w-28">Nivel</th>
                <th className="px-4 py-3 hidden sm:table-cell">Distribución</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {competencies.map((comp) => {
                const open = expandedCompetency === comp.key;
                const color = scoreBarColor(comp.score);
                return (
                  <Fragment key={comp.key}>
                    <tr
                      className="border-t border-slate-100 cursor-pointer hover:bg-slate-50/60"
                      onClick={() => setExpandedCompetency(open ? null : comp.key)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">{comp.label}</td>
                      <td className="px-4 py-3 font-bold tabular-nums text-[var(--kova-navy)]">{comp.score}</td>
                      <td className="px-4 py-3 text-slate-600">{comp.level}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden max-w-[200px]">
                          <div className="h-full rounded-full transition-all" style={{ width: `${comp.score}%`, background: color }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-t border-slate-50 bg-slate-50/50">
                        <td colSpan={5} className="px-4 py-3">
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Evidencias observadas</p>
                          <ul className="space-y-1.5">
                            {comp.evidence.map((ev) => (
                              <li key={ev.description} className="text-xs text-slate-600 flex gap-2">
                                <span className={`font-bold tabular-nums shrink-0 ${ev.points >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {ev.points >= 0 ? '+' : ''}
                                  {ev.points}
                                </span>
                                {ev.description}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 lg:p-10 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setShowMetrics((v) => !v)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
        >
          Nivel 2 — Métricas
          {showMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showMetrics && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-4">
            {[
              { label: '1. Tiempo de decisión', value: `${metrics.decisionTimeSec}s`, hint: PACE_LABELS[metrics.decisionPace] ?? metrics.decisionPace },
              { label: '2. Variabilidad tiempo', value: metrics.timeVariability, hint: metrics.timeVariability < 1 ? 'Estable' : 'Variable' },
              { label: '3. Riesgo promedio', value: metrics.avgRisk, hint: 'Movimientos por negocio' },
              { label: '4. Riesgo máximo', value: metrics.maxRisk, hint: 'Pico de exposición' },
              { label: '5. Persistencia', value: `${metrics.persistence}%`, hint: 'Engagement tras perder' },
              {
                label: '6. Recuperación',
                value: metrics.avgRecoverySec != null ? `${metrics.avgRecoverySec}s` : '—',
                hint: 'Tiempo para retomar',
              },
              {
                label: '7. Aprendizaje',
                value: metrics.learningDelta != null ? (metrics.learningDelta < 0 ? `${metrics.learningDelta}` : `+${metrics.learningDelta}`) : '—',
                hint: metrics.learningDelta != null && metrics.learningDelta < -2 ? 'Ajustó' : 'Sin ajuste claro',
              },
              { label: '8. Adaptación', value: metrics.adaptationScore, hint: 'Score compuesto' },
              { label: '9. Consistencia (σ)', value: metrics.consistency, hint: 'Menor = más consistente' },
              { label: '10. Exploración', value: metrics.exploration, hint: 'Estrategias distintas' },
              {
                label: '11. Recup. emocional',
                value: metrics.emotionalRecovery === true ? 'Sí' : metrics.emotionalRecovery === false ? 'No' : '—',
                hint: 'Más riesgo tras perder',
              },
              { label: '12. Tolerancia incert.', value: `${metrics.uncertaintyTolerance}%`, hint: 'Actúa sin esperar' },
              { label: '13. Curiosidad', value: metrics.curiosity, hint: 'Explora antes de cobrar' },
              { label: '14. Eficiencia', value: metrics.efficiency, hint: 'Cobrado / movimiento' },
              { label: '15. Rentabilidad', value: metrics.profitability, hint: 'Cobrado / segundo' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-[var(--kova-navy)]">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.hint}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 lg:p-10 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Registro por negocio</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Escenario</th>
                <th className="px-4 py-3">Mov.</th>
                <th className="px-4 py-3">Perdió</th>
                <th className="px-4 py-3">Cobró</th>
                <th className="px-4 py-3">Comisión</th>
                <th className="px-4 py-3">s/clic</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.round} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-500">{row.round}</td>
                  <td className="px-4 py-2.5 text-slate-700 max-w-[140px] truncate">{row.scenario}</td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{row.pumps}</td>
                  <td className="px-4 py-2.5">{row.exploded ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-2.5">{row.cashedOut ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-2.5 tabular-nums">{row.earned ? formatMillions(row.earned) : '—'}</td>
                  <td className="px-4 py-2.5 tabular-nums text-slate-500">{row.avgClickSec ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 lg:p-10 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setShowEvents((v) => !v)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
        >
          Nivel 1 — Eventos crudos ({events.length} registros)
          {showEvents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showEvents && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 mt-4 max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2">Hora</th>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Acción</th>
                  <th className="px-3 py-2">Δt</th>
                  <th className="px-3 py-2">Acum.</th>
                  <th className="px-3 py-2">Riesgo</th>
                  <th className="px-3 py-2">OK</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 tabular-nums text-slate-500">{ev.timestamp}</td>
                    <td className="px-3 py-1.5">{ev.round}</td>
                    <td className="px-3 py-1.5">{ev.action === 'negotiate' ? 'Negociar' : 'Cobrar'}</td>
                    <td className="px-3 py-1.5 tabular-nums">{ev.intervalSec != null ? `${ev.intervalSec}s` : '—'}</td>
                    <td className="px-3 py-1.5 tabular-nums">{formatMillions(ev.accumulated)}</td>
                    <td className="px-3 py-1.5 tabular-nums">{ev.internalRiskPct}%</td>
                    <td className="px-3 py-1.5">{ev.survived ? '✓' : '✗'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="px-8 pb-8">
        <button type="button" onClick={onRetry} className="kova-btn-secondary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Repetir prueba
        </button>
      </div>
    </div>
  );
}
