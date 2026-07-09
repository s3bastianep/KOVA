import { spawn } from 'node:child_process';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
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

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.log('[kova] Sin DATABASE_URL en build: se omite db:deploy.');
  process.exit(0);
}

try {
  console.log('[kova] Preparando base de datos durante el build...');
  await run('npx', ['prisma', 'db', 'push', '--skip-generate']);
  await run('npx', ['tsx', 'prisma/seed.ts']);
  console.log('[kova] Base de datos lista para el deploy.');
} catch (error) {
  console.error('[kova] db:deploy en build falló:', error?.message ?? error);
  process.exit(1);
}
