#!/usr/bin/env node
/**
 * Smoke de producción contra la URL pública (Railway / dominio custom).
 *
 * Uso:
 *   node scripts/smoke-production.mjs
 *   SMOKE_BASE_URL=https://kova-production-958a.up.railway.app node scripts/smoke-production.mjs
 *
 * Cubre: HTTPS, /api/health (Postgres real, sin mock), páginas públicas,
 * registro candidato, login (fallo + éxito) y agendamiento.
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://kova-production-958a.up.railway.app').replace(
  /\/$/,
  '',
);
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 90_000);

const pages = [
  ['/', 'Litt Hunter'],
  ['/para-empresas', 'empresas'],
  ['/empleo', 'empleo'],
  ['/contacto', 'contacto'],
  ['/registro', 'registro'],
  ['/login', 'login'],
  ['/guias', 'guías'],
  ['/privacidad', 'privacidad'],
];

const results = [];
let failed = 0;

function ok(name, detail = '') {
  results.push({ name, pass: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  failed += 1;
  results.push({ name, pass: false, detail });
  console.error(`  ✗ ${name} — ${detail}`);
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        Accept: 'application/json, text/html;q=0.9,*/*;q=0.8',
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* HTML u otro */
    }
    return { res, text, json };
  } finally {
    clearTimeout(timer);
  }
}

function nextBookableDateKey() {
  const tz = 'America/Bogota';
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const today = fmt.format(new Date());
  for (let add = 1; add <= 45; add += 1) {
    const d = new Date(`${today}T12:00:00-05:00`);
    d.setUTCDate(d.getUTCDate() + add);
    const key = fmt.format(d);
    const weekday = new Date(`${key}T12:00:00-05:00`).getUTCDay();
    const iso = weekday === 0 ? 7 : weekday;
    if (iso >= 1 && iso <= 5) return key;
  }
  throw new Error('No hay día laborable en los próximos 45 días');
}

async function main() {
  console.log(`\nSmoke producción → ${BASE}\n`);

  if (!BASE.startsWith('https://')) {
    fail('HTTPS', `BASE debe ser https:// (recibido ${BASE})`);
  } else {
    ok('HTTPS', BASE);
  }

  // --- Health / Postgres ---
  {
    const { res, json, text } = await request('/api/health');
    if (!res.ok || !json?.ok) {
      fail('GET /api/health', `status ${res.status}: ${text.slice(0, 200)}`);
    } else if (!json.database) {
      fail('Postgres DATABASE_URL', 'health.database=false — falta DATABASE_URL');
    } else if (!json.dbReady) {
      fail('Postgres schema', 'health.dbReady=false — schema no listo');
    } else if (json.mockMode) {
      fail('Sin mock en prod', 'health.mockMode=true — no debe usarse mock en producción');
    } else {
      ok('GET /api/health', `service=${json.service} dbReady mockMode=false`);
    }
  }

  // --- Páginas públicas ---
  for (const [path, hint] of pages) {
    const { res, text } = await request(path);
    if (!res.ok) {
      fail(`GET ${path}`, `status ${res.status}`);
      continue;
    }
    if (text.includes('Error establishing a database connection') || text.includes('wp-content')) {
      fail(`GET ${path}`, 'parece WordPress / hosting viejo, no el deploy de Railway');
      continue;
    }
    const lower = text.toLowerCase();
    if (
      !lower.includes('litt hunter') &&
      !lower.includes('litthunter') &&
      !lower.includes(hint.toLowerCase())
    ) {
      fail(`GET ${path}`, `HTML sin marcador esperado (${hint})`);
      continue;
    }
    ok(`GET ${path}`, `${res.status} ${text.length}b`);
  }

  // --- Assets críticos (CTA final: PNG real; .jpg mal nombrados fallan con nosniff) ---
  for (const asset of [
    '/landing/people/lh-final-empresas.png',
    '/landing/people/lh-final-talento.png',
    '/landing/lh-home-hero.jpg',
    '/brand/litt-hunter-logo.png',
  ]) {
    const { res } = await request(asset, { method: 'HEAD' });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      fail(`HEAD ${asset}`, `status ${res.status}`);
    } else if (asset.endsWith('.png') && !ct.includes('image/png')) {
      fail(`HEAD ${asset}`, `content-type inesperado: ${ct}`);
    } else if (asset.endsWith('.jpg') && !ct.includes('image/jpeg') && !ct.includes('image/jpg')) {
      fail(`HEAD ${asset}`, `content-type inesperado: ${ct}`);
    } else {
      ok(`HEAD ${asset}`, ct);
    }
  }

  const stamp = Date.now();
  const email = `smoke.prod.${stamp}@kova-smoke.test`;
  const password = `Smk!${stamp}Aa`;
  const nombre = 'Smoke Producción';

  // --- Registro candidato ---
  {
    const { res, json, text } = await request('/api/auth/candidate/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        telefono: '3001234567',
        ciudad: 'Bogotá',
        password,
        consentimientoDatos: true,
      }),
    });
    if (res.status !== 200 && res.status !== 201) {
      fail('POST registro candidato', `status ${res.status}: ${text.slice(0, 300)}`);
    } else if (!json?.accessToken || !json?.user) {
      fail('POST registro candidato', `sin accessToken/user: ${text.slice(0, 300)}`);
    } else if (json.user.role !== 'CANDIDATE') {
      fail('POST registro candidato', `role inesperado: ${json.user.role}`);
    } else {
      ok('POST registro candidato', email);
    }
  }

  // --- Login fallo (anti-enumeración) ---
  {
    const { res, json, text } = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'clave-incorrecta-xyz' }),
    });
    if (res.status !== 401) {
      fail('POST login malo', `esperaba 401, got ${res.status}: ${text.slice(0, 200)}`);
    } else if (json?.message !== 'Correo o contraseña incorrectos') {
      fail('POST login malo', `mensaje inesperado: ${json?.message ?? text.slice(0, 200)}`);
    } else {
      ok('POST login malo', '401 genérico');
    }
  }

  // --- Login ok ---
  {
    const { res, json, text } = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok || !json?.accessToken) {
      fail('POST login ok', `status ${res.status}: ${text.slice(0, 300)}`);
    } else {
      ok('POST login ok', json.user?.email ?? email);
    }
  }

  // --- Disponibilidad + booking ---
  const date = nextBookableDateKey();
  let slot = null;
  {
    const { res, json, text } = await request(`/api/availability?date=${date}`);
    if (!res.ok || !Array.isArray(json?.slots)) {
      fail('GET /api/availability', `status ${res.status}: ${text.slice(0, 300)}`);
    } else if (json.slots.length === 0) {
      fail('GET /api/availability', `sin slots libres el ${date}`);
    } else {
      slot = json.slots[0];
      ok('GET /api/availability', `${date} → ${json.slots.length} slots`);
    }
  }

  if (slot) {
    const { res, json, text } = await request('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        time: slot,
        nombre: 'Smoke Booking Prod',
        correo: `booking.${stamp}@kova-smoke.test`,
        telefono: '3009876543',
        empresa: 'Smoke Co',
        rolVacante: 'AE',
      }),
    });
    if (res.status !== 201 || !json?.ok) {
      fail('POST /api/bookings', `status ${res.status}: ${text.slice(0, 300)}`);
    } else {
      ok('POST /api/bookings', `${date} ${slot} id=${json.booking?.id ?? '?'}`);
    }
  } else {
    fail('POST /api/bookings', 'omitido: no hay slot');
  }

  console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'}: ${results.length - failed}/${results.length} checks ok\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\nSmoke abortado:', err?.message ?? err);
  process.exit(1);
});
