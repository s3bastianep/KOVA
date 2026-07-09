'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Droplets, Play, Shield, Sparkles, Target } from 'lucide-react';
import { ComercialJarScene } from './ComercialJarScene';
import { BartResultsReport } from './BartResultsReport';
import { portalApi } from '@/lib/api';
import {
  JAR_PRACTICE_ROUNDS,
  JAR_ROUNDS,
  VALUE_PER_OPPORTUNITY,
  addOpportunity,
  computeResult,
  createPracticeSession,
  createSession,
  formatPoints,
  isSessionComplete,
  secureRound,
  type RiskJarResult,
  type RiskJarSession,
} from '@/lib/risk-jar-game';
import './comercial-jar.css';

type Phase =
  | 'loading'
  | 'alreadyDone'
  | 'intro'
  | 'playing'
  | 'practiceDone'
  | 'finished'
  | 'saving';

type RoundOverlay = {
  kind: 'secured' | 'spilled';
  pumps: number;
  earned: number;
  message: string;
};

const OVERLAY_MS = 480;
const OVERLAY_PRACTICE_MS = 680;
const VALUE_POP_MS = 480;

type RiskJarGameProps = {
  showRecruiterReport?: boolean;
};

export function RiskJarGame({ showRecruiterReport = false }: RiskJarGameProps) {
  const [phase, setPhase] = useState<Phase>(showRecruiterReport ? 'intro' : 'loading');
  const [session, setSession] = useState<RiskJarSession | null>(null);
  const [isPractice, setIsPractice] = useState(!showRecruiterReport);
  const [roundOverlay, setRoundOverlay] = useState<RoundOverlay | null>(null);
  const [valuePop, setValuePop] = useState<string | null>(null);
  const [fillPulse, setFillPulse] = useState(0);
  const [savedPoints, setSavedPoints] = useState<number | null>(null);
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalRounds = session?.rounds.length ?? (isPractice ? JAR_PRACTICE_ROUNDS : JAR_ROUNDS);
  const currentRound = session?.rounds[session.currentIndex];
  const roundPoints = currentRound?.earned ?? 0;
  const isLocked = Boolean(roundOverlay);

  const result = useMemo(
    () => (session && isSessionComplete(session) && !isPractice ? computeResult(session) : null),
    [session, isPractice],
  );

  const clearOverlayTimer = useCallback(() => {
    if (overlayTimer.current) {
      clearTimeout(overlayTimer.current);
      overlayTimer.current = null;
    }
  }, []);

  useEffect(() => () => clearOverlayTimer(), [clearOverlayTimer]);

  useEffect(() => {
    if (showRecruiterReport) return;
    portalApi
      .pruebaStatus()
      .then((status) => {
        if (status.completed) {
          setSavedPoints(status.totalPoints ?? null);
          setPhase('alreadyDone');
        } else {
          setPhase('intro');
        }
      })
      .catch(() => setPhase('intro'));
  }, [showRecruiterReport]);

  useEffect(() => {
    if (!valuePop) return;
    const t = setTimeout(() => setValuePop(null), VALUE_POP_MS);
    return () => clearTimeout(t);
  }, [valuePop]);

  const persistResult = useCallback(async (gameResult: RiskJarResult) => {
    if (showRecruiterReport) return;
    setPhase('saving');
    try {
      const res = await portalApi.submitPrueba(gameResult);
      setSavedPoints(res.totalPoints);
      setPhase('finished');
    } catch {
      setPhase('finished');
    }
  }, [showRecruiterReport]);

  const finishSession = useCallback(
    (next: RiskJarSession) => {
      if (isPractice) {
        setPhase('practiceDone');
        return;
      }
      if (showRecruiterReport) {
        setPhase('finished');
        return;
      }
      void persistResult(computeResult(next));
    },
    [isPractice, showRecruiterReport, persistResult],
  );

  const showRoundOverlay = useCallback(
    (next: RiskJarSession, finishedIndex: number, kind: 'secured' | 'spilled') => {
      const finished = next.rounds[finishedIndex];
      const earned = finished?.earned ?? 0;
      const message =
        kind === 'spilled'
          ? isPractice
            ? 'Se derramó. Así pierdes el nivel'
            : 'Se derramó · 0 pts'
          : isPractice
            ? `Guardado · ${formatPoints(earned)} pts`
            : `+${formatPoints(earned)} pts`;

      setSession(next);
      setRoundOverlay({
        kind,
        pumps: finished?.pumps ?? 0,
        earned,
        message,
      });
      setFillPulse(0);
      setValuePop(null);

      clearOverlayTimer();
      overlayTimer.current = setTimeout(() => {
        setRoundOverlay(null);
        if (isSessionComplete(next)) {
          finishSession(next);
        }
      }, isPractice ? OVERLAY_PRACTICE_MS : OVERLAY_MS);
    },
    [clearOverlayTimer, finishSession, isPractice],
  );

  const startPractice = useCallback(() => {
    clearOverlayTimer();
    setSession(createPracticeSession());
    setIsPractice(true);
    setRoundOverlay(null);
    setValuePop(null);
    setFillPulse(0);
    setPhase('playing');
  }, [clearOverlayTimer]);

  const startScoredGame = useCallback(() => {
    clearOverlayTimer();
    setSession(createSession(JAR_ROUNDS));
    setIsPractice(false);
    setRoundOverlay(null);
    setValuePop(null);
    setFillPulse(0);
    setPhase('playing');
  }, [clearOverlayTimer]);

  const startGame = useCallback(() => {
    if (showRecruiterReport) {
      startScoredGame();
      return;
    }
    startPractice();
  }, [showRecruiterReport, startPractice, startScoredGame]);

  const handleFill = useCallback(() => {
    if (!session || !currentRound || currentRound.outcome !== 'active' || isLocked) return;

    const finishedIndex = session.currentIndex;
    const next = addOpportunity(session);
    const finished = next.rounds[finishedIndex];

    if (finished?.outcome === 'spilled') {
      showRoundOverlay(next, finishedIndex, 'spilled');
      return;
    }

    setSession(next);
    setFillPulse((n) => n + 1);
    setValuePop(String(VALUE_PER_OPPORTUNITY));
  }, [session, currentRound, isLocked, showRoundOverlay]);

  const handleSave = useCallback(() => {
    if (!session || !currentRound || currentRound.pumps === 0 || isLocked) return;

    const finishedIndex = session.currentIndex;
    const next = secureRound(session);
    showRoundOverlay(next, finishedIndex, 'secured');
  }, [session, currentRound, isLocked, showRoundOverlay]);

  if (phase === 'loading' || phase === 'saving') {
    return (
      <div className="jar-arena jar-arena--flat">
        <p className="jar-arena-loading">{phase === 'saving' ? 'Guardando…' : 'Cargando…'}</p>
      </div>
    );
  }

  if (phase === 'alreadyDone') {
    return (
      <div className="jar-arena jar-arena--flat">
        <div className="jar-arena-inner jar-arena-already">
          <span className="jar-flat-chip">Completada</span>
          <div className="jar-done-icon jar-done-icon--flat">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <h2 className="jar-feedback-title">Ya completaste la actividad</h2>
          {savedPoints != null && <p className="jar-done-score">{formatPoints(savedPoints)}</p>}
          <p className="jar-feedback-copy">puntos · solo se hace una vez</p>
          <p className="jar-arena-rules">Listo. Puedes continuar con el resto de tu postulación.</p>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="jar-arena jar-arena--intro">
        <div className="jar-arena-inner jar-arena-intro">
          <div className="jar-intro-badge">
            <Sparkles className="w-4 h-4" />
            Minijuego
          </div>
          <h1 className="jar-intro-title">La jarra</h1>
          <p className="jar-intro-goal">
            <Target className="w-5 h-5 shrink-0" />
            Suma el <strong>mayor número de puntos</strong> posible
          </p>

          <div className="jar-intro-jar-wrap">
            <ComercialJarScene pumps={4} spilled={false} roundPoints={8} showHud={false} />
          </div>

          <ul className="jar-intro-rules">
            <li>
              <span className="jar-intro-rule-icon jar-intro-rule-icon--fill">
                <Droplets className="w-4 h-4" />
              </span>
              <span>
                <strong>Llenar</strong> suma puntos en cada toque
              </span>
            </li>
            <li>
              <span className="jar-intro-rule-icon jar-intro-rule-icon--save">
                <Shield className="w-4 h-4" />
              </span>
              <span>
                <strong>Guardar</strong> te deja con lo acumulado en ese nivel
              </span>
            </li>
            <li>
              <span className="jar-intro-rule-icon jar-intro-rule-icon--warn">
                <Droplets className="w-4 h-4" />
              </span>
              <span>
                A veces la jarra <strong>se derrama</strong> y <strong>no sumas</strong> en ese nivel
              </span>
            </li>
          </ul>

          <p className="jar-intro-practice-note">
            Primero juegas <strong>{JAR_PRACTICE_ROUNDS} rondas de práctica</strong> que no cuentan.
          </p>

          <button type="button" onClick={startGame} className="jar-btn-play jar-btn-play--intro">
            <Play className="w-5 h-5" />
            {showRecruiterReport ? 'Jugar' : 'Empezar práctica'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'practiceDone') {
    return (
      <div className="jar-arena jar-arena--flat">
        <div className="jar-arena-inner jar-arena-practice-done">
          <span className="jar-flat-chip">Práctica</span>
          <div className="jar-done-icon jar-done-icon--flat">✓</div>
          <h2 className="jar-feedback-title">¡Práctica lista!</h2>
          <p className="jar-feedback-copy">
            Ahora vienen <strong>{JAR_ROUNDS} niveles</strong> que sí cuentan.
          </p>
          <p className="jar-arena-rules">
            Tu meta sigue siendo sumar el máximo de puntos.
            <br />
            Si la jarra se derrama, pierdes todo lo de ese nivel.
          </p>
          <button type="button" onClick={startScoredGame} className="jar-btn-play jar-btn-play--flat">
            Comenzar
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'finished' && session && result) {
    if (showRecruiterReport) {
      return <BartResultsReport result={result} onRetry={startGame} />;
    }

    return (
      <div className="jar-arena jar-arena--flat">
        <div className="jar-arena-inner jar-arena-done">
          <span className="jar-flat-chip">Finalizada</span>
          <div className="jar-done-icon jar-done-icon--flat">★</div>
          <h2 className="jar-feedback-title">¡Listo!</h2>
          <p className="jar-done-score">{formatPoints(savedPoints ?? result.totalSecured)}</p>
          <p className="jar-feedback-copy">puntos en total</p>
          <p className="jar-arena-rules">Gracias. Ya no podrás repetir esta actividad.</p>
        </div>
      </div>
    );
  }

  if (!session || !currentRound) return null;

  const roundNumber = Math.min(session.currentIndex + 1, totalRounds);
  const displayRoundNumber = roundOverlay
    ? Math.max(1, session.currentIndex)
    : roundNumber;
  const doneCount = session.rounds.filter((r) => r.outcome !== 'active').length;
  const scenePumps = roundOverlay ? roundOverlay.pumps : currentRound.pumps;
  const sceneSpilled = roundOverlay?.kind === 'spilled';
  const scenePoints = roundOverlay ? roundOverlay.earned : roundPoints;
  const sceneKey = roundOverlay ? `end-${doneCount}` : `play-${roundNumber}`;

  return (
    <div className="jar-arena">
      <div className="jar-arena-inner jar-arena-playing">
        <div className="jar-playing-scene-wrap">
          <ComercialJarScene
            key={sceneKey}
            pumps={scenePumps}
            spilled={sceneSpilled}
            roundPoints={scenePoints}
            roundNumber={displayRoundNumber}
            totalRounds={totalRounds}
            totalPoints={isPractice ? undefined : session.totalSecured}
            valuePop={roundOverlay ? null : valuePop}
            fillPulse={roundOverlay ? 0 : fillPulse}
            practiceMode={isPractice}
          />

          {roundOverlay ? (
            <div
              className={`jar-round-toast jar-round-toast--${roundOverlay.kind}`}
              key={roundOverlay.message}
            >
              {roundOverlay.message}
            </div>
          ) : null}
        </div>

        <div className={`jar-controls ${isLocked ? 'is-locked' : ''}`}>
          <button
            type="button"
            onClick={handleFill}
            disabled={currentRound.outcome !== 'active' || isLocked}
            className="jar-btn-fill"
          >
            Llenar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={currentRound.pumps === 0 || currentRound.outcome !== 'active' || isLocked}
            className="jar-btn-save"
          >
            Guardar
          </button>
        </div>

        {!isPractice && (
          <div className="jar-progress-bar">
            <div className="jar-progress-fill" style={{ width: `${(doneCount / JAR_ROUNDS) * 100}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
