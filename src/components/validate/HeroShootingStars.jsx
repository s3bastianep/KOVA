const TONES = ['white', 'white', 'lime', 'white', 'indigo'];
const TIMINGS = ['ease-in-out', 'ease-in', 'ease-out'];
const STAR_COUNT = 18;

function hash(n) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pick(seed, min, max) {
  return min + hash(seed) * (max - min);
}

function starGlow(i) {
  if (hash(i + 50) < 1 / 24) return 'brilliant';
  if (hash(i + 77) < 0.14) return 'bright';
  return 'normal';
}

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const glow = starGlow(i);
  const duration = pick(i + 2, 2.2, 5.5);

  return {
    id: i,
    top: `${pick(i + 100, 6, 94).toFixed(2)}%`,
    left: `${pick(i + 141, 2, 98).toFixed(2)}%`,
    delay: `${(-pick(i + 1, 0, duration + 8)).toFixed(2)}s`,
    duration: `${duration.toFixed(2)}s`,
    timing: TIMINGS[Math.floor(hash(i + 99) * TIMINGS.length)],
    peak: glow === 'brilliant' ? 1 : glow === 'bright' ? 0.9 : pick(i + 9, 0.55, 0.85).toFixed(2),
    scalePeak: glow === 'brilliant' ? pick(i + 10, 1.08, 1.2) : glow === 'bright' ? pick(i + 11, 1.02, 1.1) : 1,
    tone: TONES[Math.floor(hash(i + 31) * TONES.length)],
    glow,
    size: glow === 'brilliant' ? pick(i + 12, 4.5, 6) : glow === 'bright' ? pick(i + 13, 3, 4) : pick(i + 14, 1.8, 2.8),
  };
});

export default function HeroShootingStars() {
  return (
    <div className="kv-hero-stars" aria-hidden>
      {STARS.map((star) => (
        <span
          key={star.id}
          className={[
            'kv-hero-star',
            `kv-hero-star--${star.tone}`,
            star.glow !== 'normal' && `kv-hero-star--${star.glow}`,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            top: star.top,
            left: star.left,
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
