import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || '3001';

function applyDatabaseUrl() {
  const privateUrl = process.env.DATABASE_PRIVATE_URL?.trim();
  const publicUrl = process.env.DATABASE_URL?.trim();
  const url = privateUrl || publicUrl;
  if (!url) return;

  if (url.includes('sslmode=')) {
    process.env.DATABASE_URL = url;
    return;
  }

  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
  const isLocal = /localhost|127\.0\.0\.1/i.test(url);
  const isPrivateHost = /\.railway\.internal\b/i.test(url);

  if (isLocal || isPrivateHost) {
    process.env.DATABASE_URL = url;
    return;
  }

  if (process.env.NODE_ENV === 'production' || onRailway) {
    process.env.DATABASE_URL = `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
    return;
  }

  process.env.DATABASE_URL = url;
}

applyDatabaseUrl();

function runDbDeploy() {
  if (!process.env.DATABASE_URL) {
    console.error('[kova] DATABASE_URL no está definida. Configúrala en Railway → Variables → Postgres.');
    if (process.env.NODE_ENV !== 'production') {
      process.env.USE_MOCK = 'true';
      console.warn('[kova] Modo demo activado - login: consultor@kova.co / Kova2026!');
    }
    return;
  }

  console.log('[kova] Preparando base de datos en segundo plano...');
  const dbChild = spawn('npm', ['run', 'db:deploy'], {
    cwd: dashboardDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  dbChild.on('error', (error) => {
    console.error('[kova] No se pudo iniciar db:deploy:', error?.message ?? error);
  });

  dbChild.on('exit', (code) => {
    if (code === 0) {
      console.log('[kova] Base de datos lista.');
      return;
    }
    console.error(`[kova] db:deploy terminó con código ${code ?? 'desconocido'}.`);
    if (process.env.NODE_ENV !== 'production') {
      process.env.USE_MOCK = 'true';
      console.warn('[kova] Modo demo activado tras fallo de db:deploy.');
    }
  });
}

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

runDbDeploy();
