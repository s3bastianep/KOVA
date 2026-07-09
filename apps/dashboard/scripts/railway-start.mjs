import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || '3001';

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: dashboardDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} terminó con código ${code ?? 'desconocido'}`));
    });
  });
}

async function prepareDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('[kova] DATABASE_URL no está definida. Configúrala en Railway → Variables → Postgres.');
    if (process.env.NODE_ENV !== 'production') {
      process.env.USE_MOCK = 'true';
      console.warn('[kova] Modo demo activado - login: consultor@kova.co / Kova2026!');
    }
    return;
  }

  console.log('[kova] Preparando base de datos...');
  try {
    await runCommand('npm', ['run', 'db:deploy']);
    console.log('[kova] Base de datos lista.');
  } catch (error) {
    console.error('[kova] db:deploy falló:', error?.message ?? error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    process.env.USE_MOCK = 'true';
    console.warn('[kova] Modo demo activado tras fallo de db:deploy.');
  }
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
  await prepareDatabase();
  startNext();
} catch (error) {
  console.error('[kova] No se pudo preparar el entorno:', error?.message ?? error);
  process.exit(1);
}
