import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || '3001';

if (!process.env.DATABASE_URL) {
  console.error('[kova] DATABASE_URL no está definida. Configúrala en Railway → Variables → Postgres.');
} else {
  try {
    console.log('[kova] Preparando base de datos...');
    execSync('npm run db:deploy', { cwd: dashboardDir, stdio: 'inherit' });
    console.log('[kova] Base de datos lista.');
  } catch (error) {
    console.error('[kova] db:deploy falló; la app arrancará igual:', error?.message ?? error);
  }
}

console.log(`[kova] Iniciando Next.js en 0.0.0.0:${port}`);
const child = spawn('npx', ['next', 'start', '-H', '0.0.0.0', '-p', port], {
  cwd: dashboardDir,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 1));
