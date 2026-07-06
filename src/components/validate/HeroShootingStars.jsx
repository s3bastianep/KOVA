import { useCallback, useMemo, useState } from 'react';

const TONES = ['white', 'white', 'lime', 'white', 'indigo'];
const TIMINGS = ['ease-in-out', 'ease-in', 'ease-out'];
const STAR_COUNT = 58;

function hash(n) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pick(seed, min, max) {
  return min + hash(seed) * (max - min);
}

function starGlow(i) {
  if (hash(i + 50) < 1 / 30) return 'brilliant';
  if (hash(i + 77) < 0.11) return 'bright';
  return 'normal';
}

function randomPosition(seed) {
  return {
    top: `${pick(seed, 6, 94).toFixed(2)}%`,
    left: `${pick(seed + 41, 2, 98).toFixed(2)}%`,
  };
}

function createStarMeta(i) {
  const glow = starGlow(i);
  const duration = pick(i + 2, 1.8, 5.5);

  return {
    id: i,
    delay: `${(-pick(i + 1, 0, duration + 12)).toFixed(2)}s`,
    duration: `${duration.toFixed(2)}s`,
    timing: TIMINGS[Math.floor(hash(i + 99) * TIMINGS.length)],
    peak: glow === 'brilliant' ? 1 : glow === 'bright' ? 0.96 : pick(i + 9, 0.55, 0.85).toFixed(2),
    scalePeak: glow === 'brilliant' ? pick(i + 10, 1.15, 1.35) : glow === 'bright' ? pick(i + 11, 1.05, 1.15) : 1,
    tone: TONES[Math.floor(hash(i + 31) * TONES.length)],
    glow,
    size: glow === 'brilliant' ? pick(i + 12, 5.5, 7) : glow === 'bright' ? pick(i + 13, 3.5, 4.5) : pick(i + 14, 1.8, 3),
  };
}

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => createStarMeta(i));

export default function HeroShootingStars() {
  const [positions, setPositions] = useState(() =>
    STARS.map((_, i) => randomPosition(i + 1000)),
  );
  const reposition = useCallback((id) => {
    setPositions((prev) => {
      const next = [...prev];
      next[id] = randomPosition(performance.now() + id * 997 + Math.random() * 10000);
      return next;
    });
  }, []);

  const stars = useMemo(() => STARS, []);

  return (
    <div className="kv-hero-stars" aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          className={[
            'kv-hero-star',
            `kv-hero-star--${star.tone}`,
            star.glow !== 'normal' && `kv-hero-star--${star.glow}`,
          ]
            .filter(Boolean)
            .join(' ')}
          onAnimationIteration={() => reposition(star.id)}
          style={{
            top: positions[star.id].top,
            left: positions[star.id].left,
            animationDelay: star.delay,
            animationDuration: star.duration,
            animationTimingFunction: star.timing,
            '--kv-star-peak': star.peak,
            '--kv-star-scale-peak': star.scalePeak,
            '--kv-star-size': `${star.size}px`,
          }}
        />
      ))}
    </div>
  );
}
