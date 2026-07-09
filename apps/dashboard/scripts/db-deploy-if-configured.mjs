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

const databaseUrl = (
  process.env.DATABASE_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  ''
).trim();

if (!databaseUrl) {
  console.log('[kova] Sin DATABASE_URL en build: se omite db:deploy.');
  process.exit(0);
}

if (/\.railway\.internal\b/i.test(databaseUrl)) {
  console.log(
    '[kova] DATABASE_URL usa red privada de Railway; db:deploy se ejecuta al arrancar el servicio.',
  );
  process.exit(0);
}

try {
  console.log('[kova] Preparando base de datos durante el build...');
  process.env.DATABASE_URL = databaseUrl;
  await run('npx', ['prisma', 'db', 'push', '--skip-generate']);
  await run('npx', ['tsx', 'prisma/seed.ts']);
  console.log('[kova] Base de datos lista para el deploy.');
} catch (error) {
  console.warn('[kova] db:deploy en build no disponible:', error?.message ?? error);
  console.warn('[kova] Se intentará de nuevo al arrancar el servicio.');
  process.exit(0);
}
