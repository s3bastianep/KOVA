import type { RiskJarRound, RiskJarSession } from './risk-jar-game';
import { VALUE_PER_OPPORTUNITY } from './risk-jar-game';

export type BartRoundRecord = {
  round: number;
  scenario: string;
  pumps: number;
  exploded: boolean;
  cashedOut: boolean;
  earned: number;
  avgClickSec: number | null;
};

export type BartIndicators = {
  /** Indicador 1 — promedio en rondas donde cobró a tiempo. */
  adjustedPumpAverage: number;
  /** Indicador 2 */
  explosionCount: number;
  explosionRate: number;
  /** Indicador 3 */
  totalEarned: number;
  /** Indicador 4 */
  avgClickSec: number;
  /** Indicador 5 — promedio antes vs después de la primera pérdida. */
  pumpsBeforeFirstLoss: number | null;
  pumpsAfterFirstLoss: number | null;
  learnsAfterLoss: boolean | null;
  /** Indicador 6 */
  consistencyStdDev: number;
  consistencyLevel: 'alta' | 'media' | 'baja';
  /** Indicador 7 — progresión por tercios de sesión. */
  adaptationTerciles: [number, number, number];
  adaptationTrend: 'gradual' | 'estable' | 'erratico' | 'sin_datos';
  /** Indicador 8 — síntesis cualitativa. */
  riskTolerance: 'bajo' | 'moderado' | 'alto';
  rawPumpAverage: number;
};

export type BartInterpretation = {
  observedProfile: string[];
  conclusion: string;
  disclaimer: string;
};

function avg(values: number[]) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function stdDev(values: number[]) {
  if (values.length < 2) return 0;
  const mean = avg(values);
  return Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);
}

function firstPumpDelaySec(round: RiskJarRound) {
  if (!round.startedAt || !round.pumpTimestamps.length) return null;
  return (round.pumpTimestamps[0] - round.startedAt) / 1000;
}

function interPumpIntervalsSec(round: RiskJarRound) {
  const ts = round.pumpTimestamps;
  if (ts.length < 2) return [];
  return ts.slice(1).map((t, i) => (t - ts[i]) / 1000);
}

function roundAvgClickSec(round: RiskJarRound): number | null {
  const intervals = interPumpIntervalsSec(round);
  const first = firstPumpDelaySec(round);
  const all = first != null ? [first, ...intervals] : intervals;
  if (!all.length) return null;
  return Math.round(avg(all) * 10) / 10;
}

export function buildRoundRecords(session: RiskJarSession): BartRoundRecord[] {
  return session.rounds
    .map((round, i) => ({
      round: i + 1,
      scenario: round.context.label,
      pumps: round.pumps,
      exploded: round.outcome === 'spilled',
      cashedOut: round.outcome === 'secured',
      earned: round.outcome === 'secured' ? round.earned : 0,
      avgClickSec: round.outcome !== 'active' ? roundAvgClickSec(round) : null,
    }))
    .filter((r) => r.exploded || r.cashedOut);
}

export function computeBartIndicators(session: RiskJarSession, records: BartRoundRecord[]): BartIndicators {
  const finished = session.rounds.filter((r) => r.outcome !== 'active');
  const secured = finished.filter((r) => r.outcome === 'secured');
  const spilled = finished.filter((r) => r.outcome === 'spilled');

  const securedPumps = secured.map((r) => r.pumps);
  const allPumps = finished.map((r) => r.pumps);
  const adjustedPumpAverage = securedPumps.length ? avg(securedPumps) : 0;
  const rawPumpAverage = allPumps.length ? avg(allPumps) : 0;

  const clickTimes = records.map((r) => r.avgClickSec).filter((v): v is number => v != null);

  const firstLossIdx = session.rounds.findIndex((r) => r.outcome === 'spilled');
  let pumpsBeforeFirstLoss: number | null = null;
  let pumpsAfterFirstLoss: number | null = null;
  let learnsAfterLoss: boolean | null = null;

  if (firstLossIdx >= 0) {
    const before = session.rounds.slice(0, firstLossIdx).filter((r) => r.outcome !== 'active').map((r) => r.pumps);
    const after = session.rounds.slice(firstLossIdx + 1).filter((r) => r.outcome !== 'active').map((r) => r.pumps);
    if (before.length) pumpsBeforeFirstLoss = Math.round(avg(before) * 10) / 10;
    if (after.length) pumpsAfterFirstLoss = Math.round(avg(after) * 10) / 10;
    if (pumpsBeforeFirstLoss != null && pumpsAfterFirstLoss != null) {
      learnsAfterLoss = pumpsAfterFirstLoss < pumpsBeforeFirstLoss - 2;
    }
  }

  const pumpStdDev = stdDev(allPumps);
  const consistencyLevel = pumpStdDev <= 5 ? 'alta' : pumpStdDev <= 11 ? 'media' : 'baja';

  let adaptationTerciles: [number, number, number] = [0, 0, 0];
  let adaptationTrend: BartIndicators['adaptationTrend'] = 'sin_datos';
  if (finished.length >= 6) {
    const third = Math.max(1, Math.floor(finished.length / 3));
    adaptationTerciles = [
      Math.round(avg(finished.slice(0, third).map((r) => r.pumps)) * 10) / 10,
      Math.round(avg(finished.slice(third, third * 2).map((r) => r.pumps)) * 10) / 10,
      Math.round(avg(finished.slice(third * 2).map((r) => r.pumps)) * 10) / 10,
    ];
    const d1 = adaptationTerciles[1] - adaptationTerciles[0];
    const d2 = adaptationTerciles[2] - adaptationTerciles[1];
    if (Math.abs(d1) <= 2 && Math.abs(d2) <= 2) adaptationTrend = 'estable';
    else if (d1 > 0 && d2 > 0 && d2 <= d1 + 4) adaptationTrend = 'gradual';
    else adaptationTrend = 'erratico';
  }

  const riskTolerance =
    adjustedPumpAverage < 12 ? 'bajo' : adjustedPumpAverage > 24 ? 'alto' : 'moderado';

  return {
    adjustedPumpAverage: Math.round(adjustedPumpAverage * 10) / 10,
    explosionCount: spilled.length,
    explosionRate: Math.round((spilled.length / Math.max(1, finished.length)) * 100) / 100,
    totalEarned: session.totalSecured,
    avgClickSec: Math.round(avg(clickTimes) * 10) / 10,
    pumpsBeforeFirstLoss,
    pumpsAfterFirstLoss,
    learnsAfterLoss,
    consistencyStdDev: Math.round(pumpStdDev * 10) / 10,
    consistencyLevel,
    adaptationTerciles,
    adaptationTrend,
    riskTolerance,
    rawPumpAverage: Math.round(rawPumpAverage * 10) / 10,
  };
}

export function interpretBart(
  session: RiskJarSession,
  records: BartRoundRecord[],
  indicators: BartIndicators,
): BartInterpretation {
  const finished = session.rounds.filter((r) => r.outcome !== 'active');
  const observed: string[] = [];

  const earlyThird = finished.slice(0, Math.max(1, Math.floor(finished.length / 3)));
  const earlyAvg = avg(earlyThird.map((r) => r.pumps));

  if (earlyAvg <= 11) {
    observed.push('Comenzó de forma prudente en los primeros escenarios.');
  } else if (earlyAvg >= 20) {
    observed.push('Asumió exposición elevada desde el inicio de la sesión.');
  } else {
    observed.push('Inició con un nivel de exposición intermedio.');
  }

  const [t1, t2, t3] = indicators.adaptationTerciles;
  if (indicators.adaptationTrend === 'gradual' && t3 > t1 + 3) {
    observed.push('Aumentó progresivamente la exposición conforme avanzó la sesión.');
  } else if (indicators.adaptationTrend === 'estable') {
    observed.push('Mantuvo un nivel de exposición relativamente estable entre escenarios.');
  } else if (indicators.adaptationTrend === 'erratico') {
    observed.push('Mostró variabilidad alta entre escenarios (patrón poco predecible).');
  }

  if (indicators.learnsAfterLoss === true) {
    observed.push(
      `Tras la primera pérdida redujo la exposición (prom. ${indicators.pumpsBeforeFirstLoss} → ${indicators.pumpsAfterFirstLoss} movimientos).`,
    );
  } else if (indicators.learnsAfterLoss === false) {
    observed.push(
      `No redujo la exposición tras perder; incluso la aumentó (prom. ${indicators.pumpsBeforeFirstLoss} → ${indicators.pumpsAfterFirstLoss}).`,
    );
  } else if (indicators.explosionCount === 0) {
    observed.push('No perdió ningún negocio durante la sesión.');
  }

  if (indicators.avgClickSec < 1.5) {
    observed.push(`Respondió con rapidez (prom. ${indicators.avgClickSec}s por decisión).`);
  } else if (indicators.avgClickSec > 3) {
    observed.push(`Tomó más tiempo entre decisiones (prom. ${indicators.avgClickSec}s).`);
  }

  if (indicators.consistencyLevel === 'alta') {
    observed.push(`Estrategia consistente entre negocios (σ = ${indicators.consistencyStdDev}).`);
  } else if (indicators.consistencyLevel === 'baja') {
    observed.push(`Alta variabilidad entre rondas (σ = ${indicators.consistencyStdDev}).`);
  }

  const winStreakRecovery = detectWinStreakEscalation(session);
  if (winStreakRecovery) observed.push(winStreakRecovery);

  let conclusion: string;

  const balanced =
    indicators.explosionRate <= 0.3 &&
    indicators.consistencyLevel !== 'baja' &&
    indicators.learnsAfterLoss !== false &&
    indicators.adaptationTrend !== 'erratico';

  const riskyUnstable =
    indicators.explosionRate >= 0.35 ||
    (indicators.learnsAfterLoss === false && indicators.explosionCount >= 2) ||
    (indicators.consistencyLevel === 'baja' && indicators.riskTolerance === 'alto');

  const veryConservative =
    indicators.explosionCount === 0 &&
    indicators.adjustedPumpAverage < 10 &&
    indicators.totalEarned < records.length * VALUE_PER_OPPORTUNITY * 8;

  if (balanced) {
    conclusion =
      'Presenta capacidad para equilibrar riesgo y recompensa. Tiende a ajustar sus decisiones con base en la experiencia y muestra un patrón relativamente estable durante la tarea.';
  } else if (riskyUnstable) {
    conclusion =
      'Muestra mayor disposición a asumir riesgos y/o una estrategia poco estable durante la tarea. En situaciones de incertidumbre comercial, conviene complementar con entrevista, role play y referencias antes de concluir sobre desempeño.';
  } else if (veryConservative) {
    conclusion =
      'Prioriza proteger la comisión con baja exposición. Puede ser sólido en retención y cuentas sensibles; validar si el rol exige mayor ambición comercial.';
  } else {
    conclusion =
      'El patrón observado es mixto: combina momentos de prudencia y de empuje. Recomendamos contrastar estos resultados con otras evidencias del proceso de selección.';
  }

  const disclaimer =
    'Este resultado describe conducta observada en la prueba. No define por sí solo si la persona es adecuada para el cargo: debe combinarse con entrevista, experiencia y otras evaluaciones.';

  return { observedProfile: observed, conclusion, disclaimer };
}

function detectWinStreakEscalation(session: RiskJarSession): string | null {
  let streak = 0;
  let escalated = false;
  const pumpsOnSecure: number[] = [];

  for (const round of session.rounds) {
    if (round.outcome === 'secured') {
      streak++;
      pumpsOnSecure.push(round.pumps);
      if (streak >= 3 && pumpsOnSecure.length >= 4) {
        const recent = pumpsOnSecure.slice(-3);
        const prior = pumpsOnSecure.slice(0, -3);
        if (prior.length && avg(recent) > avg(prior) + 3) {
          escalated = true;
        }
      }
    } else if (round.outcome === 'spilled') {
      streak = 0;
      pumpsOnSecure.length = 0;
    }
  }

  return escalated
    ? 'Tras varias comisiones consecutivas, aumentó progresivamente la exposición.'
    : null;
}

// ─── NIVEL 1 — Eventos crudos ───────────────────────────────────────────────

export type BartEventAction = 'negotiate' | 'cash_out';

export type BartRawEvent = {
  id: string;
  timestamp: string;
  timestampMs: number;
  round: number;
  scenario: string;
  action: BartEventAction;
  intervalSec: number | null;
  accumulated: number;
  internalRiskPct: number;
  survived: boolean;
};

// ─── NIVEL 2 — Métricas ─────────────────────────────────────────────────────

export type DecisionPace = 'muy_rapido' | 'rapido' | 'reflexivo' | 'muy_reflexivo';

export type BartMetrics = {
  decisionTimeSec: number;
  decisionPace: DecisionPace;
  timeVariability: number;
  avgRisk: number;
  maxRisk: number;
  persistence: number;
  avgRecoverySec: number | null;
  learningDelta: number | null;
  adaptationScore: number;
  consistency: number;
  exploration: number;
  emotionalRecovery: boolean | null;
  uncertaintyTolerance: number;
  curiosity: number;
  efficiency: number;
  profitability: number;
};

// ─── NIVEL 3 — Competencias (evidencia) ─────────────────────────────────────

export type BartEvidence = {
  points: number;
  description: string;
};

export type BartCompetencyKey =
  | 'riesgo'
  | 'impulsividad'
  | 'adaptacion'
  | 'persistencia'
  | 'planeacion'
  | 'resiliencia'
  | 'consistencia'
  | 'velocidad';

export type BartCompetency = {
  key: BartCompetencyKey;
  label: string;
  score: number;
  level: string;
  evidence: BartEvidence[];
};

// ─── NIVEL 4 — Perfil ───────────────────────────────────────────────────────

export type BartProfile = {
  competencies: BartCompetency[];
};

export type BartAnalysis = {
  events: BartRawEvent[];
  records: BartRoundRecord[];
  metrics: BartMetrics;
  indicators: BartIndicators;
  competencies: BartCompetency[];
  profile: BartProfile;
  interpretation: BartInterpretation;
};

function formatEventTime(ms: number) {
  return new Date(ms).toLocaleTimeString('es-CO', { hour12: false });
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function scoreLevel(score: number): string {
  if (score >= 86) return 'Excelente';
  if (score >= 76) return 'Muy alto';
  if (score >= 61) return 'Alto';
  if (score >= 41) return 'Bueno';
  if (score >= 26) return 'Medio';
  return 'Bajo';
}

function decisionPaceFromSec(sec: number): DecisionPace {
  if (sec < 0.5) return 'muy_rapido';
  if (sec < 1.5) return 'rapido';
  if (sec < 3) return 'reflexivo';
  return 'muy_reflexivo';
}

export function buildRawEvents(session: RiskJarSession): BartRawEvent[] {
  const events: BartRawEvent[] = [];
  let prevMs: number | null = null;
  let eventIdx = 0;

  session.rounds.forEach((round, roundIdx) => {
    if (round.outcome === 'active' && !round.pumpTimestamps.length) return;

    const roundNum = roundIdx + 1;

    round.pumpTimestamps.forEach((ts, pumpIdx) => {
      const pumps = pumpIdx + 1;
      const spilled = round.outcome === 'spilled' && pumps >= round.burstAt;
      const intervalSec = prevMs != null ? round1((ts - prevMs) / 1000) : null;

      events.push({
        id: `e-${eventIdx++}`,
        timestamp: formatEventTime(ts),
        timestampMs: ts,
        round: roundNum,
        scenario: round.context.label,
        action: 'negotiate',
        intervalSec,
        accumulated: pumps * VALUE_PER_OPPORTUNITY,
        internalRiskPct: Math.min(100, Math.round((pumps / round.burstAt) * 100)),
        survived: !spilled,
      });
      prevMs = ts;
    });

    if (round.outcome === 'secured' && round.cashOutAt) {
      const ts = round.cashOutAt;
      const intervalSec = prevMs != null ? round1((ts - prevMs) / 1000) : null;
      events.push({
        id: `e-${eventIdx++}`,
        timestamp: formatEventTime(ts),
        timestampMs: ts,
        round: roundNum,
        scenario: round.context.label,
        action: 'cash_out',
        intervalSec,
        accumulated: round.earned,
        internalRiskPct: Math.min(100, Math.round((round.pumps / round.burstAt) * 100)),
        survived: true,
      });
      prevMs = ts;
    }
  });

  return events;
}

function recoveryTimesAfterLoss(session: RiskJarSession): number[] {
  const times: number[] = [];
  for (let i = 0; i < session.rounds.length - 1; i++) {
    const round = session.rounds[i];
    const next = session.rounds[i + 1];
    if (round.outcome === 'spilled' && round.endedAt && next.startedAt) {
      times.push((next.startedAt - round.endedAt) / 1000);
    }
  }
  return times;
}

function explorationBucket(pumps: number) {
  if (pumps <= 10) return 'bajo';
  if (pumps <= 20) return 'medio';
  return 'alto';
}

export function computeBartMetrics(session: RiskJarSession, events: BartRawEvent[]): BartMetrics {
  const finished = session.rounds.filter((r) => r.outcome !== 'active');
  const secured = finished.filter((r) => r.outcome === 'secured');
  const spilled = finished.filter((r) => r.outcome === 'spilled');
  const allPumps = finished.map((r) => r.pumps);

  const intervals = events.map((e) => e.intervalSec).filter((v): v is number => v != null);
  const decisionTimeSec = intervals.length ? round1(avg(intervals)) : 0;
  const timeVariability = round1(stdDev(intervals));

  const avgRisk = allPumps.length ? round1(avg(allPumps)) : 0;
  const maxRisk = allPumps.length ? Math.max(...allPumps) : 0;

  const firstLossIdx = session.rounds.findIndex((r) => r.outcome === 'spilled');
  let learningDelta: number | null = null;
  if (firstLossIdx >= 0) {
    const before = session.rounds.slice(0, firstLossIdx).filter((r) => r.outcome !== 'active').map((r) => r.pumps);
    const after = session.rounds.slice(firstLossIdx + 1).filter((r) => r.outcome !== 'active').map((r) => r.pumps);
    if (before.length && after.length) {
      learningDelta = round1(avg(after) - avg(before));
    }
  }

  const recoveries = recoveryTimesAfterLoss(session);
  const avgRecoverySec = recoveries.length ? round1(avg(recoveries)) : null;

  let persistence = 100;
  if (spilled.length > 0) {
    const afterLossRounds = session.rounds.slice(firstLossIdx + 1).filter((r) => r.outcome !== 'active');
    const engaged = afterLossRounds.filter((r) => r.pumps >= 3).length;
    persistence = Math.round((engaged / Math.max(1, afterLossRounds.length)) * 100);
  }

  let adaptationScore = 50;
  if (finished.length >= 6) {
    const third = Math.max(1, Math.floor(finished.length / 3));
    const t1 = avg(finished.slice(0, third).map((r) => r.pumps));
    const t2 = avg(finished.slice(third, third * 2).map((r) => r.pumps));
    const t3 = avg(finished.slice(third * 2).map((r) => r.pumps));
    if (learningDelta != null && learningDelta < -2 && t3 <= t2 + 2) adaptationScore += 25;
    else if (t2 > t1 && t3 >= t2 - 1) adaptationScore += 20;
    else if (Math.abs(t3 - t1) <= 2) adaptationScore += 10;
    else adaptationScore -= 10;
  }

  const consistency = round1(stdDev(allPumps));
  const buckets = new Set(secured.map((r) => explorationBucket(r.pumps)));
  const exploration = buckets.size;

  let emotionalRecovery: boolean | null = null;
  if (firstLossIdx >= 0 && firstLossIdx < finished.length - 1) {
    const lossPumps = session.rounds[firstLossIdx].pumps;
    const nextRound = session.rounds[firstLossIdx + 1];
    if (nextRound.outcome !== 'active') {
      emotionalRecovery = nextRound.pumps > lossPumps + 2;
    }
  }

  const firstDelays = session.rounds
    .filter((r) => r.startedAt && r.pumpTimestamps.length)
    .map((r) => (r.pumpTimestamps[0] - (r.startedAt as number)) / 1000);
  const actsQuickly = firstDelays.filter((d) => d < 2).length;
  const uncertaintyTolerance =
    firstDelays.length > 0 ? Math.round((actsQuickly / firstDelays.length) * 100) : 0;

  const curiosity = secured.length ? round1(avg(secured.map((r) => r.pumps))) : 0;

  const totalPumps = allPumps.reduce((s, p) => s + p, 0);
  const efficiency = totalPumps > 0 ? round1(session.totalSecured / totalPumps) : 0;

  const durationSec = Math.max(1, (Date.now() - session.startedAt) / 1000);
  const profitability = round1(session.totalSecured / durationSec);

  return {
    decisionTimeSec,
    decisionPace: decisionPaceFromSec(decisionTimeSec),
    timeVariability,
    avgRisk,
    maxRisk,
    persistence,
    avgRecoverySec,
    learningDelta,
    adaptationScore: clamp(adaptationScore),
    consistency,
    exploration,
    emotionalRecovery,
    uncertaintyTolerance,
    curiosity,
    efficiency,
    profitability,
  };
}

function addEvidence(
  items: BartEvidence[],
  points: number,
  description: string,
  score: { value: number },
) {
  items.push({ points, description });
  score.value = clamp(score.value + points);
}

export function computeCompetencies(
  session: RiskJarSession,
  metrics: BartMetrics,
  indicators: BartIndicators,
): BartCompetency[] {
  const finished = session.rounds.filter((r) => r.outcome !== 'active');
  const spilled = finished.filter((r) => r.outcome === 'spilled');

  const build = (key: BartCompetencyKey, label: string, base: number, fn: (e: BartEvidence[], s: { value: number }) => void) => {
    const evidence: BartEvidence[] = [];
    const score = { value: base };
    fn(evidence, score);
    return { key, label, score: Math.round(score.value), level: scoreLevel(score.value), evidence };
  };

  const competencies: BartCompetency[] = [
    build('riesgo', 'Riesgo', 40, (e, s) => {
      if (metrics.avgRisk >= 20) addEvidence(e, 18, 'Exposición promedio elevada entre negocios', s);
      else if (metrics.avgRisk >= 14) addEvidence(e, 12, 'Exposición promedio por encima del rango medio', s);
      else if (metrics.avgRisk <= 9) addEvidence(e, -12, 'Exposición promedio muy conservadora', s);
      if (metrics.maxRisk >= 28) addEvidence(e, 14, `Alcanzó picos altos de exposición (máx. ${metrics.maxRisk})`, s);
      if (spilled.length >= 2) addEvidence(e, 8, `${spilled.length} negocios perdidos por sobreexposición`, s);
      if (spilled.length === 0 && metrics.avgRisk < 12) addEvidence(e, -8, 'Evitó pérdidas con estrategia muy cautelosa', s);
      if (indicators.adaptationTrend === 'gradual' && metrics.avgRisk > 12) {
        addEvidence(e, 6, 'Incrementó exposición de forma gradual', s);
      }
    }),

    build('impulsividad', 'Impulsividad', 35, (e, s) => {
      if (metrics.decisionPace === 'muy_rapido') addEvidence(e, 22, `Decisiones muy rápidas (${metrics.decisionTimeSec}s promedio)`, s);
      else if (metrics.decisionPace === 'rapido') addEvidence(e, 12, `Ritmo de decisión ágil (${metrics.decisionTimeSec}s)`, s);
      else if (metrics.decisionPace === 'muy_reflexivo') addEvidence(e, -15, `Toma tiempo antes de actuar (${metrics.decisionTimeSec}s)`, s);
      if (metrics.timeVariability > 2) addEvidence(e, 10, 'Variabilidad alta en tiempos de respuesta', s);
      else if (metrics.timeVariability < 0.6) addEvidence(e, -6, 'Ritmo temporal estable entre clics', s);
      if (metrics.emotionalRecovery === true) addEvidence(e, 15, 'Aumentó exposición inmediatamente tras perder', s);
      if (metrics.uncertaintyTolerance >= 75) addEvidence(e, 8, 'Actúa rápido ante escenarios nuevos', s);
    }),

    build('adaptacion', 'Adaptación', 45, (e, s) => {
      if (indicators.learnsAfterLoss === true) {
        addEvidence(e, 18, 'Redujo exposición tras la primera pérdida', s);
      } else if (indicators.learnsAfterLoss === false) {
        addEvidence(e, -14, 'No ajustó estrategia tras perder', s);
      }
      if (indicators.adaptationTrend === 'gradual') {
        addEvidence(e, 12, 'Optimizó exposición de forma gradual entre tercios', s);
      } else if (indicators.adaptationTrend === 'erratico') {
        addEvidence(e, -12, 'Cambios de estrategia erráticos entre escenarios', s);
      }
      if (metrics.learningDelta != null && metrics.learningDelta < -3) {
        addEvidence(e, 10, 'Mantuvo menor exposición después de aprender', s);
      }
      if (spilled.length >= 3 && indicators.learnsAfterLoss === false) {
        addEvidence(e, -10, 'Repitió sobreexposición en varias rondas', s);
      }
    }),

    build('persistencia', 'Persistencia', 50, (e, s) => {
      if (finished.length >= session.rounds.length) {
        addEvidence(e, 10, 'Completó todos los escenarios de la sesión', s);
      }
      if (metrics.persistence >= 80) addEvidence(e, 15, 'Siguió participando con engagement tras perder', s);
      else if (metrics.persistence < 50) addEvidence(e, -12, 'Redujo participación notablemente tras pérdidas', s);
      if (metrics.avgRecoverySec != null && metrics.avgRecoverySec < 5) {
        addEvidence(e, 12, `Retomó rápido tras perder (${metrics.avgRecoverySec}s)`, s);
      } else if (metrics.avgRecoverySec != null && metrics.avgRecoverySec > 15) {
        addEvidence(e, -8, `Pausa prolongada antes de continuar (${metrics.avgRecoverySec}s)`, s);
      }
    }),

    build('planeacion', 'Planeación', 45, (e, s) => {
      if (indicators.consistencyLevel === 'alta') {
        addEvidence(e, 18, `Estrategia regular entre negocios (σ=${indicators.consistencyStdDev})`, s);
      } else if (indicators.consistencyLevel === 'baja') {
        addEvidence(e, -14, 'Alta variabilidad sin patrón claro', s);
      }
      if (metrics.timeVariability < 1) addEvidence(e, 10, 'Ritmo de decisión predecible', s);
      if (metrics.decisionPace === 'reflexivo') addEvidence(e, 8, 'Tiempo de reflexión consistente antes de actuar', s);
      if (metrics.exploration <= 1) addEvidence(e, -6, 'Pocas estrategias distintas exploradas', s);
    }),

    build('resiliencia', 'Resiliencia', 45, (e, s) => {
      if (indicators.learnsAfterLoss === true) addEvidence(e, 16, 'Ajustó conducta tras una pérdida', s);
      if (metrics.emotionalRecovery === false) addEvidence(e, 12, 'No reaccionó impulsivamente tras perder', s);
      if (metrics.emotionalRecovery === true) addEvidence(e, -15, 'Posible reacción emocional tras perder', s);
      if (metrics.persistence >= 70) addEvidence(e, 10, 'Mantuvo engagement después de contratiempos', s);
      if (indicators.adaptationTrend === 'gradual') addEvidence(e, 8, 'Recuperó confianza de forma gradual', s);
    }),

    build('consistencia', 'Consistencia', 50, (e, s) => {
      if (indicators.consistencyLevel === 'alta') addEvidence(e, 20, `Baja variación entre rondas (σ=${metrics.consistency})`, s);
      else if (indicators.consistencyLevel === 'media') addEvidence(e, 6, 'Variación moderada entre escenarios', s);
      else addEvidence(e, -15, `Alta variabilidad entre escenarios (σ=${metrics.consistency})`, s);
      if (metrics.timeVariability < 0.8) addEvidence(e, 8, 'Tiempos de respuesta estables', s);
    }),

    build('velocidad', 'Velocidad de decisión', 50, (e, s) => {
      const paceScore =
        metrics.decisionTimeSec <= 0.5 ? 28 :
        metrics.decisionTimeSec <= 1 ? 18 :
        metrics.decisionTimeSec <= 1.5 ? 10 :
        metrics.decisionTimeSec <= 3 ? -5 : -15;
      addEvidence(
        e,
        paceScore,
        `Promedio ${metrics.decisionTimeSec}s por decisión (${metrics.decisionPace.replace('_', ' ')})`,
        s,
      );
      if (metrics.timeVariability < 1) addEvidence(e, 6, 'Velocidad sostenida entre decisiones', s);
    }),
  ];

  return competencies;
}

export function analyzeBartSession(session: RiskJarSession): BartAnalysis {
  const events = buildRawEvents(session);
  const records = buildRoundRecords(session);
  const indicators = computeBartIndicators(session, records);
  const metrics = computeBartMetrics(session, events);
  const competencies = computeCompetencies(session, metrics, indicators);
  const interpretation = interpretBart(session, records, indicators);

  return {
    events,
    records,
    metrics,
    indicators,
    competencies,
    profile: { competencies },
    interpretation,
  };
}
