import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build Vite landing + copy to apps/dashboard/public/www (middleware SPA target).
execSync('node scripts/sync-landing-www.mjs --build', {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
});
