/**
 * Prueba comercial — adaptación BART (Balloon Analog Risk Task).
 * Observa el patrón de decisiones bajo recompensa creciente y riesgo incierto.
 * La jarra reemplaza el globo; la lógica psicométrica es la misma.
 */

import {
  analyzeBartSession,
  type BartCompetency,
  type BartIndicators,
  type BartInterpretation,
  type BartMetrics,
  type BartProfile,
  type BartRawEvent,
  type BartRoundRecord,
} from './bart-analytics';

export type {
  BartRoundRecord,
  BartIndicators,
  BartInterpretation,
  BartRawEvent,
  BartMetrics,
  BartCompetency,
  BartProfile,
};

export const JAR_ROUNDS = 20;
export const JAR_PRACTICE_ROUNDS = 2;

export const VALUE_PER_OPPORTUNITY = 2;
export const MIN_BURST = 8;
export const MAX_BURST = 42;
export const FILL_PER_PUMP = 2.15;

export type RoundOutcome = 'active' | 'secured' | 'spilled';

export type JarRoundContext = {
  label: string;
  sector: string;
  ticket: string;
};

export const ROUND_CONTEXTS: JarRoundContext[] = [
  { label: 'Cuenta corporativa', sector: 'B2B', ticket: 'Alto' },
  { label: 'Canal distribuidor', sector: 'B2B', ticket: 'Medio' },
  { label: 'Renovación anual', sector: 'SaaS', ticket: 'Medio' },
  { label: 'Upsell existente', sector: 'Cuenta clave', ticket: 'Alto' },
  { label: 'Prospección fría', sector: 'Outbound', ticket: 'Bajo' },
  { label: 'Licitación pública', sector: 'Gobierno', ticket: 'Alto' },
  { label: 'Retail regional', sector: 'B2B', ticket: 'Medio' },
  { label: 'Partner estratégico', sector: 'Alianzas', ticket: 'Alto' },
  { label: 'Cross-sell', sector: 'Cartera', ticket: 'Medio' },
  { label: 'Nuevo vertical', sector: 'Expansión', ticket: 'Alto' },
  { label: 'SMB masivo', sector: 'Volumen', ticket: 'Bajo' },
  { label: 'Cuenta en riesgo', sector: 'Retención', ticket: 'Medio' },
  { label: 'Enterprise', sector: 'B2B', ticket: 'Alto' },
  { label: 'Campaña trimestral', sector: 'Metas', ticket: 'Medio' },
  { label: 'Cierre de mes', sector: 'Presión', ticket: 'Variable' },
  { label: 'Referido caliente', sector: 'Inbound', ticket: 'Medio' },
  { label: 'Multinacional', sector: 'B2B', ticket: 'Alto' },
  { label: 'Paquete estándar', sector: 'Catálogo', ticket: 'Bajo' },
  { label: 'Renegociación', sector: 'Cartera', ticket: 'Medio' },
  { label: 'Última propuesta', sector: 'Cierre', ticket: 'Alto' },
  { label: 'Distribuidor nuevo', sector: 'Canal', ticket: 'Medio' },
  { label: 'Contrato marco', sector: 'B2B', ticket: 'Alto' },
  { label: 'Reactivación', sector: 'Cartera', ticket: 'Bajo' },
  { label: 'Demo agendada', sector: 'Inbound', ticket: 'Medio' },
  { label: 'Negociación final', sector: 'Cierre', ticket: 'Alto' },
  { label: 'Propuesta revisada', sector: 'B2B', ticket: 'Medio' },
  { label: 'Cliente nuevo', sector: 'Prospección', ticket: 'Medio' },
  { label: 'Renovación clave', sector: 'Retención', ticket: 'Alto' },
  { label: 'Meta Q4', sector: 'Presión', ticket: 'Variable' },
];

export type RiskJarRound = {
  burstAt: number;
  pumps: number;
  outcome: RoundOutcome;
  earned: number;
  context: JarRoundContext;
  pumpTimestamps: number[];
  startedAt?: number;
  endedAt?: number;
  cashOutAt?: number;
};

export type RiskJarSession = {
  rounds: RiskJarRound[];
  currentIndex: number;
  totalSecured: number;
  startedAt: number;
};

export type CommercialFit = 'hunter' | 'farmer' | 'hibrido' | 'requiere_seguimiento';

export type RiskJarResult = {
  totalSecured: number;
  theoreticalMax: number;
  roundsCompleted: number;
  spills: number;
  spillRate: number;
  missedValue: number;
  events: BartRawEvent[];
  records: BartRoundRecord[];
  metrics: BartMetrics;
  indicators: BartIndicators;
  competencies: BartCompetency[];
  profile: BartProfile;
  interpretation: BartInterpretation;
  fit: CommercialFit;
  fitLabel: string;
  durationSeconds: number;
};

export function createSession(roundCount: number = JAR_ROUNDS): RiskJarSession {
  return {
    rounds: Array.from({ length: roundCount }, (_, i) => ({
      burstAt: randomBurst(),
      pumps: 0,
      outcome: 'active' as const,
      earned: 0,
      context: ROUND_CONTEXTS[i % ROUND_CONTEXTS.length],
      pumpTimestamps: [],
    })),
    currentIndex: 0,
    totalSecured: 0,
    startedAt: Date.now(),
  };
}

export function createPracticeSession() {
  return createSession(JAR_PRACTICE_ROUNDS);
}

function randomBurst() {
  return MIN_BURST + Math.floor(Math.random() * (MAX_BURST - MIN_BURST + 1));
}

export function markCurrentRoundStart(session: RiskJarSession): RiskJarSession {
  if (session.currentIndex >= session.rounds.length) return session;
  const round = session.rounds[session.currentIndex];
  if (!round || round.startedAt) return session;
  const rounds = [...session.rounds];
  rounds[session.currentIndex] = { ...round, startedAt: Date.now() };
  return { ...session, rounds };
}

export function visualFillPercent(pumps: number) {
  return Math.min(92, pumps * FILL_PER_PUMP);
}

export function addOpportunity(session: RiskJarSession): RiskJarSession {
  const withStart = markCurrentRoundStart(session);
  const round = withStart.rounds[withStart.currentIndex];
  if (!round || round.outcome !== 'active') return withStart;

  const now = Date.now();
  const nextPumps = round.pumps + 1;

  if (nextPumps >= round.burstAt) {
    const rounds = [...withStart.rounds];
    rounds[withStart.currentIndex] = {
      ...round,
      pumps: nextPumps,
      outcome: 'spilled',
      earned: 0,
      pumpTimestamps: [...round.pumpTimestamps, now],
      endedAt: now,
    };
    return advanceIfNeeded({ ...withStart, rounds });
  }

  const rounds = [...withStart.rounds];
  rounds[withStart.currentIndex] = {
    ...round,
    pumps: nextPumps,
    earned: nextPumps * VALUE_PER_OPPORTUNITY,
    pumpTimestamps: [...round.pumpTimestamps, now],
  };
  return { ...withStart, rounds };
}

export function secureRound(session: RiskJarSession): RiskJarSession {
  const withStart = markCurrentRoundStart(session);
  const round = withStart.rounds[withStart.currentIndex];
  if (!round || round.outcome !== 'active' || round.pumps === 0) return withStart;

  const rounds = [...withStart.rounds];
  const now = Date.now();
  rounds[withStart.currentIndex] = {
    ...round,
    outcome: 'secured',
    endedAt: now,
    cashOutAt: now,
  };

  return advanceIfNeeded({
    ...withStart,
    rounds,
    totalSecured: withStart.totalSecured + round.earned,
  });
}

function advanceIfNeeded(session: RiskJarSession): RiskJarSession {
  const round = session.rounds[session.currentIndex];
  if (!round || round.outcome === 'active') return session;

  const nextIndex = session.currentIndex + 1;
  return { ...session, currentIndex: nextIndex };
}

export function isSessionComplete(session: RiskJarSession) {
  return session.currentIndex >= session.rounds.length;
}

export function computeResult(session: RiskJarSession): RiskJarResult {
  const finished = session.rounds.filter((r) => r.outcome !== 'active');
  const spilled = finished.filter((r) => r.outcome === 'spilled');
  const spillRate = spilled.length / Math.max(1, finished.length);

  const theoreticalMax = finished.reduce((s, r) => s + (r.burstAt - 1) * VALUE_PER_OPPORTUNITY, 0);
  const missedValue = spilled.reduce((s, r) => s + (r.burstAt - 1) * VALUE_PER_OPPORTUNITY, 0);

  const analysis = analyzeBartSession(session);
  const indicators = analysis.indicators;
  const interpretation = analysis.interpretation;

  const fit = classifyFit(indicators);

  return {
    totalSecured: session.totalSecured,
    theoreticalMax,
    roundsCompleted: finished.length,
    spills: spilled.length,
    spillRate: Math.round(spillRate * 100) / 100,
    missedValue,
    events: analysis.events,
    records: analysis.records,
    metrics: analysis.metrics,
    indicators,
    competencies: analysis.competencies,
    profile: analysis.profile,
    interpretation,
    fit: fit.key,
    fitLabel: fit.label,
    durationSeconds: Math.round((Date.now() - session.startedAt) / 1000),
  };
}

function classifyFit(indicators: BartIndicators): { key: CommercialFit; label: string } {
  if (
    indicators.explosionRate >= 0.4 ||
    (indicators.learnsAfterLoss === false && indicators.explosionCount >= 3)
  ) {
    return { key: 'requiere_seguimiento', label: 'Requiere seguimiento' };
  }
  if (indicators.riskTolerance === 'alto' && indicators.explosionRate <= 0.3 && indicators.consistencyLevel !== 'baja') {
    return { key: 'hunter', label: 'Perfil hunter' };
  }
  if (indicators.riskTolerance === 'bajo' && indicators.explosionRate <= 0.15) {
    return { key: 'farmer', label: 'Perfil farmer' };
  }
  return { key: 'hibrido', label: 'Perfil híbrido' };
}

export function formatMillions(value: number) {
  return `$${value.toLocaleString('es-CO')}M`;
}

/** Puntos mostrados al candidato en la UI del juego. */
export function formatPoints(value: number) {
  return value.toLocaleString('es-CO');
}

/** @deprecated use JAR_ROUNDS */
export const RISK_JAR_ROUNDS = JAR_ROUNDS;
