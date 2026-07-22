import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || '3001';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fail-fast: un proceso “vivo” sin DB/JWT engaña al healthcheck y rompe auth/citas. */
function assertProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = [];
  if (!process.env.DATABASE_URL?.trim()) missing.push('DATABASE_URL');
  if (!process.env.JWT_SECRET?.trim()) missing.push('JWT_SECRET');
  if (missing.length) {
    console.error(`[kova] Faltan variables obligatorias en producción: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.SEED_DEMO_DATA === 'true') {
    console.error('[kova] SEED_DEMO_DATA=true está prohibido en producción. Quita la variable en Railway.');
    process.exit(1);
  }

  const jwtExpires = process.env.JWT_EXPIRES_IN?.trim();
  if (jwtExpires && /d$/i.test(jwtExpires)) {
    console.warn(
      `[kova] JWT_EXPIRES_IN=${jwtExpires} es muy largo para access tokens en localStorage. Usa 1h o menos.`,
    );
  }
}

function runCommand(command, args, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: dashboardDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${command} superó ${timeoutMs}ms`));
    }, timeoutMs);

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} terminó con código ${code ?? 'desconocido'}`));
    });
  });
}

async function prepareSchema() {
  if (!process.env.DATABASE_URL) {
    console.error('[kova] DATABASE_URL no está definida. Configúrala en Railway → Variables → Postgres.');
    if (process.env.NODE_ENV !== 'production') {
      process.env.USE_MOCK = 'true';
      console.warn('[kova] Modo demo activado - login: consultor@kova.co / Kova2026!');
    }
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      console.log(`[kova] Sincronizando esquema (intento ${attempt}/3)...`);
      // NOTE: --accept-data-loss is deliberately NOT passed. This project has no
      // prisma/migrations history yet (only `db push` has ever been used), so we can't
      // switch to `prisma migrate deploy` without first creating a baseline migration
      // against the real production database — an operation with its own data-loss risk
      // that needs to be done deliberately, not from this boot script. Without the flag,
      // `db push` refuses (loudly, in the log) instead of silently dropping columns/tables
      // when a schema change would be destructive. If this step starts failing after a
      // schema edit, that failure is the signal to review the change and migrate manually.
      await runCommand('npx', ['prisma', 'db', 'push', '--skip-generate'], 90_000);
      await runCommand('node', ['scripts/verify-schema.mjs'], 20_000);
      process.env.KOVA_SCHEMA_READY = 'true';
      console.log('[kova] Esquema listo.');
      return;
    } catch (error) {
      console.error(`[kova] Preparación de esquema falló (${attempt}/3):`, error?.message ?? error);
      if (attempt < 3) await sleep(5000);
    }
  }

  throw new Error('No se pudo preparar el esquema de la base de datos.');
}

function runSeedInBackground() {
  if (!process.env.DATABASE_URL) return;

  console.log('[kova] Cargando datos iniciales en segundo plano...');
  const seedChild = spawn('npm', ['run', 'db:seed'], {
    cwd: dashboardDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  seedChild.on('error', (error) => {
    console.error('[kova] No se pudo iniciar db:seed:', error?.message ?? error);
  });

  seedChild.on('exit', (code) => {
    if (code === 0) console.log('[kova] Datos iniciales listos.');
    else console.error(`[kova] db:seed terminó con código ${code ?? 'desconocido'}.`);
  });
}

function startNext() {
  console.log(`[kova] Iniciando Next.js en 0.0.0.0:${port}`);
  const child = spawn('npx', ['next', 'start', '-H', '0.0.0.0', '-p', port], {
    cwd: dashboardDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('error', (error) => {
    console.error('[kova] No se pudo iniciar Next.js:', error?.message ?? error);
    process.exit(1);
  });

  child.on('exit', (code) => process.exit(code ?? 1));
}

try {
  assertProductionEnv();
  await prepareSchema();
  startNext();
  runSeedInBackground();
} catch (error) {
  console.error('[kova] No se pudo preparar el entorno:', error?.message ?? error);
  process.exit(1);
}
