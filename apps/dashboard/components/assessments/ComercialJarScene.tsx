'use client';

import { useEffect, useState } from 'react';
import { visualFillPercent } from '@/lib/risk-jar-game';
import './comercial-jar.css';

type ComercialJarSceneProps = {
  pumps: number;
  spilled: boolean;
  roundPoints: number;
  roundNumber?: number;
  totalRounds?: number;
  totalPoints?: number;
  valuePop?: string | null;
  fillPulse?: number;
  showHud?: boolean;
  practiceMode?: boolean;
};

export function ComercialJarScene({
  pumps,
  spilled,
  roundPoints,
  roundNumber,
  totalRounds,
  totalPoints,
  valuePop,
  fillPulse = 0,
  showHud = true,
  practiceMode = false,
}: ComercialJarSceneProps) {
  const fillPercent = visualFillPercent(pumps);
  const [wobble, setWobble] = useState(false);

  useEffect(() => {
    if (!fillPulse) return;
    setWobble(true);
    const t = setTimeout(() => setWobble(false), 220);
    return () => clearTimeout(t);
  }, [fillPulse]);

  return (
    <div className="jar-scene">
      {showHud && roundNumber != null && (
        <div className="jar-scene-hud">
          <div className="jar-scene-level-chip">
            {practiceMode ? (
              <span className="jar-scene-practice-badge">Práctica {roundNumber}/{totalRounds ?? 2}</span>
            ) : (
              <>
                <span className="jar-scene-level-label">Nivel</span>
                <span className="jar-scene-level-num">{roundNumber}</span>
                <span className="jar-scene-level-of">/ {totalRounds ?? 20}</span>
              </>
            )}
          </div>
          {!practiceMode && totalPoints != null && (
            <div className="jar-scene-wallet">
              <span className="jar-scene-star">★</span>
              {totalPoints}
            </div>
          )}
        </div>
      )}

      <div className="jar-scene-stage">
        {valuePop && <div className="jar-scene-pop">+{valuePop}</div>}

        <div
          className={`jar2d ${!showHud && !spilled ? 'is-idle' : ''} ${wobble ? 'is-wobble' : ''} ${spilled ? 'is-spilled' : ''}`}
        >
          <div className="jar2d-lid" />
          <div className="jar2d-neck" />
          <div className="jar2d-glass">
            <div className="jar2d-liquid" style={{ height: `${fillPercent}%` }}>
              <div className="jar2d-liquid-top" />
              {pumps > 0 &&
                Array.from({ length: Math.min(4, 1 + Math.floor(pumps / 5)) }).map((_, i) => (
                  <span key={i} className="jar2d-bubble" style={{ ['--b-i' as string]: i }} />
                ))}
            </div>
            <div className="jar2d-glass-shine" />
          </div>
          <div className="jar2d-outline" aria-hidden />
        </div>

        {spilled && (
          <div className="jar2d-splash">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="jar2d-splash-dot" style={{ ['--s-i' as string]: i }} />
            ))}
          </div>
        )}

        <div className={`jar2d-puddle ${spilled ? 'is-visible' : ''}`} />
      </div>

      {showHud && (
        <div className={`jar-scene-points-pill ${practiceMode ? 'is-practice' : ''}`}>
          {practiceMode ? (
            <span className="jar-scene-points-unit">No suma puntos · solo práctica</span>
          ) : (
            <>
              <span className="jar-scene-points-value">{roundPoints}</span>
              <span className="jar-scene-points-unit">pts en juego</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
