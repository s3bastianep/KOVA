#!/usr/bin/env node
/**
 * Copia la landing Vite (dist/) a apps/dashboard/public/www
 * para que el middleware de Next pueda servir /guias y /guia-*.
 *
 * Uso:
 *   node apps/dashboard/scripts/sync-landing-www.mjs
 *   node apps/dashboard/scripts/sync-landing-www.mjs --build
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const dist = path.join(repoRoot, 'dist');
const target = path.join(__dirname, '../public/www');
const forceBuild = process.argv.includes('--build');

if (forceBuild || !fs.existsSync(path.join(dist, 'index.html'))) {
  console.log('[litt-hunter] Building landing (Vite)...');
  execSync('npm run build:landing', { cwd: repoRoot, stdio: 'inherit' });
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('[litt-hunter] No hay dist/index.html — no se puede sincronizar /www.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(dist, target, { recursive: true });
// Keep gitignore exception alive
fs.writeFileSync(path.join(target, '.gitkeep'), '');
console.log('[litt-hunter] Landing sincronizada → apps/dashboard/public/www');
