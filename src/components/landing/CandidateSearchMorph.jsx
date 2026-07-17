import { useEffect, useRef } from 'react';

/**
 * Particle scene: yellow world + traveling arcs + multicolor people
 * → explode outward and fade to empty → hand off to evaluation mockup.
 */

const WORLD = { r: 201, g: 217, b: 79 };
const PEOPLE = [
  { r: 96, g: 165, b: 250 },
  { r: 251, g: 146, b: 60 },
  { r: 244, g: 114, b: 182 },
  { r: 52, g: 211, b: 153 },
  { r: 167, g: 139, b: 250 },
  { r: 251, g: 191, b: 36 },
  { r: 248, g: 113, b: 113 },
];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fibonacciSphere(n, radius) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i += 1) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    });
  }
  return pts;
}

function makeArc(radius, seed) {
  const a = seed * 12.9898;
  const b = seed * 78.233;
  const lat1 = Math.sin(a) * 0.9;
  const lon1 = Math.cos(b) * Math.PI;
  const lat2 = Math.sin(a * 1.7) * 0.9;
  const lon2 = Math.cos(b * 1.3) * Math.PI;
  const p1 = {
    x: Math.cos(lat1) * Math.cos(lon1) * radius,
    y: Math.sin(lat1) * radius,
    z: Math.cos(lat1) * Math.sin(lon1) * radius,
  };
  const p2 = {
    x: Math.cos(lat2) * Math.cos(lon2) * radius,
    y: Math.sin(lat2) * radius,
    z: Math.cos(lat2) * Math.sin(lon2) * radius,
  };
  return {
    p1,
    p2,
    speed: 0.18 + (seed % 1) * 0.35,
    offset: seed % 1,
    color: PEOPLE[Math.floor(seed * 17) % PEOPLE.length],
  };
}

function slerpOnSphere(p1, p2, t, radius) {
  const dot = Math.max(
    -1,
    Math.min(1, (p1.x * p2.x + p1.y * p2.y + p1.z * p2.z) / (radius * radius)),
  );
  const omega = Math.acos(dot);
  if (omega < 0.001) return { ...p1 };
  const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
  const s2 = Math.sin(t * omega) / Math.sin(omega);
  return {
    x: p1.x * s1 + p2.x * s2,
    y: p1.y * s1 + p2.y * s2,
    z: p1.z * s1 + p2.z * s2,
  };
}

function project(p, rotY, rotX, cx, cy, scale) {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  let { x, y, z } = p;
  const xz = x * cosY - z * sinY;
  z = x * sinY + z * cosY;
  x = xz;
  const yz = y * cosX - z * sinX;
  z = y * sinX + z * cosX;
  y = yz;
  const perspective = 1.25 / (1.25 + z * 0.0038);
  return {
    x: cx + x * scale * perspective,
    y: cy + y * scale * perspective,
    z,
    a: z > -40 ? 0.28 + perspective * 0.62 : 0.12,
  };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function blastPoint(base, seed, strength) {
  const n = (seed % 1 + 1) % 1;
  const blast = 1 + strength * (1.1 + n * 1.8 + Math.sin(seed * 9.1) * 0.25);
  return {
    x: base.x * blast,
    y: base.y * blast,
    z: base.z * blast,
  };
}

export default function CandidateSearchMorph({ active = true, onComplete }) {
  const canvasRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    if (prefersReducedMotion()) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return undefined;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let raf = 0;
    let start = performance.now();
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 720 ? 560 : 1100;
    const R = window.innerWidth < 720 ? 152 : 178;
    const globe = fibonacciSphere(count, R);

    const worldDots = globe.map((g, i) => ({
      ...g,
      size: 1.05 + (i % 5) * 0.28,
      seed: i * 0.17,
      home: { x: g.x, y: g.y, z: g.z },
    }));

    const peopleCount = window.innerWidth < 720 ? 32 : 56;
    const people = Array.from({ length: peopleCount }, (_, i) => {
      const g = globe[Math.floor((i / peopleCount) * count) % count];
      const home = { x: g.x * 1.025, y: g.y * 1.025, z: g.z * 1.025 };
      return {
        ...home,
        home,
        color: PEOPLE[i % PEOPLE.length],
        size: 2.8 + (i % 3) * 0.55,
        appearAt: 0.32 + (i / peopleCount) * 0.58,
        pulse: Math.random() * Math.PI * 2,
        seed: i * 0.31,
      };
    });

    const arcs = Array.from({ length: 16 }, (_, i) => makeArc(R * 1.01, (i + 1) * 0.137));

    // World → explode to nothing → mockup
    const T_FORM = 900;
    const T_WORLD = 3400;
    const T_EXPLODE = 1400;
    const TOTAL = T_FORM + T_WORLD + T_EXPLODE;

    const statusEl = canvas.parentElement?.querySelector('.kh-morph__status');
    const setStatus = (text) => {
      if (statusEl) {
        statusEl.textContent = text;
        statusEl.style.opacity = text ? '1' : '0';
      }
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete?.();
    };

    const tick = (now) => {
      if (!running) return;
      const elapsed = now - start;
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      const cx = width * 0.5;
      const cy = height * 0.46;

      ctx.clearRect(0, 0, width, height);

      let rotY = elapsed * 0.00042;
      let rotX = 0.26 + Math.sin(elapsed * 0.00032) * 0.035;
      let scale = 1;
      let explode = 0;
      let fadeWorld = 1;
      let worldProgress = 0;
      let phase = 'form';

      const tExplodeStart = T_FORM + T_WORLD;

      if (elapsed < T_FORM) {
        phase = 'form';
        worldProgress = easeInOutCubic(elapsed / T_FORM) * 0.25;
        setStatus('Explorando el mercado…');
        scale = lerp(0.35, 1, easeOutCubic(elapsed / T_FORM));
      } else if (elapsed < tExplodeStart) {
        phase = 'world';
        worldProgress = 0.25 + ((elapsed - T_FORM) / T_WORLD) * 0.75;
        setStatus('Buscando talento comercial…');
        scale = 1 + Math.sin((elapsed - T_FORM) * 0.0009) * 0.012;
      } else {
        phase = 'explode';
        const t = Math.min(1, (elapsed - tExplodeStart) / T_EXPLODE);
        explode = easeOutCubic(t);
        // Blast out, then everything fades to empty before the mockup
        fadeWorld = 1 - easeInOutCubic(Math.max(0, (t - 0.25) / 0.75));
        scale = 1 + explode * 1.85;
        worldProgress = 1;
        rotY *= 1 + explode * 1.2;
        if (t < 0.35) setStatus('Conectando perfiles…');
        else setStatus('');
        if (t > 0.88) finish();
      }

      if (fadeWorld > 0.02) {
        const glowR = Math.max(280, R * 1.9) * scale;
        const glow = ctx.createRadialGradient(cx, cy, R * 0.12 * scale, cx, cy, glowR);
        glow.addColorStop(0, `rgba(216, 242, 76, ${0.18 * fadeWorld})`);
        glow.addColorStop(0.4, `rgba(216, 242, 76, ${0.06 * fadeWorld})`);
        glow.addColorStop(0.75, `rgba(216, 242, 76, ${0.015 * fadeWorld})`);
        glow.addColorStop(1, 'rgba(216, 242, 76, 0)');
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      const drawn = [];

      const resolvePos = (home, seed) => {
        const form = Math.min(1, worldProgress * 3);
        const formed = { x: home.x * form, y: home.y * form, z: home.z * form };
        if (phase === 'form' || phase === 'world') return formed;
        return blastPoint(formed, seed, explode);
      };

      for (let i = 0; i < worldDots.length; i += 1) {
        const d = worldDots[i];
        if (fadeWorld < 0.02) continue;
        const pos = resolvePos(d.home, d.seed);
        const pr = project(pos, rotY, rotX, cx, cy, scale);
        drawn.push({
          ...pr,
          size: d.size * (1 + explode * 0.35),
          color: WORLD,
          alphaMul: 0.58 * fadeWorld,
        });
      }

      for (let i = 0; i < people.length; i += 1) {
        const p = people[i];
        if (fadeWorld < 0.02) continue;
        if (worldProgress < p.appearAt && phase !== 'explode') continue;
        const local =
          phase === 'explode' ? 1 : Math.min(1, (worldProgress - p.appearAt) / 0.14);
        const pos = resolvePos(p.home, p.seed);
        const pr = project(pos, rotY, rotX, cx, cy, scale);
        const pulse = 1 + Math.sin(now * 0.005 + p.pulse) * 0.16 * (1 - explode);
        drawn.push({
          ...pr,
          size: p.size * pulse * lerp(0.2, 1, local) * (1 + explode * 0.5),
          color: p.color,
          alphaMul: fadeWorld * local,
          glow: true,
        });
      }

      if (phase === 'form' || phase === 'world' || (phase === 'explode' && explode < 0.45)) {
        const arcFade =
          phase === 'explode' ? 1 - easeInOut(explode / 0.45) : 1;
        for (let i = 0; i < arcs.length; i += 1) {
          const arc = arcs[i];
          const t = (now * 0.00028 * arc.speed + arc.offset) % 1;
          const pos = slerpOnSphere(arc.p1, arc.p2, t, R * 1.01);
          let { x, y, z } = pos;
          if (explode > 0) {
            const blasted = blastPoint({ x, y, z }, i * 0.2, explode * 0.85);
            x = blasted.x;
            y = blasted.y;
            z = blasted.z;
          }
          const pr = project({ x, y, z }, rotY, rotX, cx, cy, scale);
          drawn.push({
            ...pr,
            size: 2.3,
            color: arc.color,
            alphaMul: 0.85 * fadeWorld * arcFade,
            glow: true,
          });
        }
      }

      drawn.sort((a, b) => a.z - b.z);

      for (let i = 0; i < drawn.length; i += 1) {
        const d = drawn[i];
        const alpha = Math.max(0, Math.min(1, d.a * d.alphaMul));
        if (alpha < 0.02) continue;
        if (d.glow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${alpha * 0.24})`;
          ctx.arc(d.x, d.y, d.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${alpha})`;
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (phase === 'explode' && explode > 0.04 && explode < 0.7 && fadeWorld > 0.1) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(216, 242, 76, ${(1 - explode) * 0.22 * fadeWorld})`;
        ctx.lineWidth = 1.25;
        ctx.arc(cx, cy, R * 0.55 + explode * Math.max(width, height) * 0.38, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Soft circular vignette
      const edge = Math.min(width, height);
      const vignette = ctx.createRadialGradient(cx, cy, edge * 0.3, cx, cy, edge * 0.56);
      vignette.addColorStop(0, 'rgba(255,255,255,1)');
      vignette.addColorStop(0.5, 'rgba(255,255,255,1)');
      vignette.addColorStop(0.78, 'rgba(255,255,255,0.5)');
      vignette.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      if (elapsed >= TOTAL) {
        finish();
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, onComplete]);

  return (
    <div className="kh-morph" aria-hidden>
      <canvas ref={canvasRef} className="kh-morph__canvas" />
      <p className="kh-morph__status">Buscando talento comercial…</p>
    </div>
  );
}
