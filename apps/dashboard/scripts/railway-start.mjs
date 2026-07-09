import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || '3001';

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

  console.log('[kova] Sincronizando esquema de base de datos...');
  try {
    await runCommand('npx', ['prisma', 'db', 'push', '--skip-generate'], 90_000);
    console.log('[kova] Esquema listo.');
  } catch (error) {
    console.error('[kova] db push falló:', error?.message ?? error);
  }
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
  await prepareSchema();
  startNext();
  runSeedInBackground();
} catch (error) {
  console.error('[kova] No se pudo preparar el entorno:', error?.message ?? error);
  process.exit(1);
}
