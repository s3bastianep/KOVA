import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const dist = path.join(repoRoot, 'dist');
const target = path.join(__dirname, '../public/www');

console.log('Installing landing dependencies...');
execSync('npm install --no-audit --no-fund', { cwd: repoRoot, stdio: 'inherit' });

console.log('Building public landing (Vite)...');
execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' });

if (!fs.existsSync(dist)) {
  throw new Error('Landing build failed: dist/ not found');
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(dist, target, { recursive: true });
console.log('Landing copied to apps/dashboard/public/www');
