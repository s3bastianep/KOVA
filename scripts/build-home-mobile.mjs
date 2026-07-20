import { execSync } from 'node:child_process';
import fs from 'node:fs';

function gitShow(revPath) {
  return execSync(`git show ${revPath}`, { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 });
}

/**
 * Scope every selector under `prefix` without breaking @import URLs
 * (Google Fonts uses wght@300) or @media/@keyframes at-rules.
 */
function prefixCss(css, prefix) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const imports = [];
  css = css.replace(/@import\s+[^;]+;/g, (m) => {
    imports.push(m);
    return `___IMPORT${imports.length - 1}___`;
  });

  const keyframes = [];
  css = css.replace(/@keyframes\s+[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g, (m) => {
    keyframes.push(m);
    return `___KF${keyframes.length - 1}___ {}`;
  });

  css = css.replace(
    /@(media|supports|container|layer|font-face|charset|namespace)\b/g,
    '___AT_$1___',
  );

  css = css.replace(/([^{}@]+)\{/g, (full, selectorGroup) => {
    const trimmed = selectorGroup.trim();
    if (!trimmed) return full;
    if (/^___KF\d+___$/.test(trimmed)) return full;
    if (/^___AT_/.test(trimmed)) return full;
    if (/^___IMPORT\d+___/.test(trimmed)) return full;
    if (/^(\d+%|from|to)([\s,]|$)/.test(trimmed)) return full;

    const selectors = trimmed.split(',').map((sel) => {
      sel = sel.trim().replace(/\s+/g, ' ');
      if (!sel) return sel;
      if (
        sel === prefix ||
        sel.startsWith(`${prefix} `) ||
        sel.startsWith(`${prefix}.`) ||
        sel.startsWith(`${prefix}:`) ||
        sel.startsWith(`${prefix}[`)
      ) {
        return sel;
      }
      if (sel === ':root' || sel === 'html' || sel === 'body') return sel;
      return `${prefix} ${sel}`;
    });
    return `\n${selectors.join(',\n')} {`;
  });

  css = css.replace(/___AT_([a-z-]+)___/g, '@$1');

  keyframes.forEach((kf, i) => {
    css = css.replace(`___KF${i}___ {}`, kf);
  });

  imports.forEach((imp, i) => {
    css = css.replace(`___IMPORT${i}___`, imp);
  });

  return `${css.replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

fs.mkdirSync('.tmp-restore', { recursive: true });
fs.writeFileSync('.tmp-restore/HomeDark.jsx', gitShow('8f02286:src/pages/HomeDark.jsx'));
fs.writeFileSync('.tmp-restore/landing-kova-dark.css', gitShow('8f02286:src/styles/landing-kova-dark.css'));

let css = fs.readFileSync('.tmp-restore/landing-kova-dark.css', 'utf8');
css = css.replaceAll('.kova-dark', '.kova-dark-m');
css = prefixCss(css, '.kova-dark-m');
fs.writeFileSync('src/styles/landing-kova-dark-m.css', css);

let jsx = fs.readFileSync('.tmp-restore/HomeDark.jsx', 'utf8');
jsx = jsx.replace(
  "import '@/styles/landing-kova-dark.css';",
  "import '@/styles/landing-kova-dark-m.css';",
);
jsx = jsx.replace('export default function HomeDark()', 'export default function HomeDarkMobile()');
jsx = jsx.replace('<main className="kova-dark">', '<main className="kova-dark-m">');
jsx = jsx.replaceAll('.kova-dark ', '.kova-dark-m ');
jsx = jsx.replaceAll(".kova-dark[", ".kova-dark-m[");
jsx = jsx.replace(
  "document.querySelector('.kd-score-num')",
  "document.querySelector('.kova-dark-m .kd-score-num')",
);
jsx = jsx.replace(
  "document.querySelector('.kd-dashboard')",
  "document.querySelector('.kova-dark-m .kd-dashboard')",
);
jsx = jsx.replace(
  "document.querySelector('.kd-visual')",
  "document.querySelector('.kova-dark-m .kd-visual')",
);
jsx = jsx.replace(
  "document.querySelector('.kd-visual__img')",
  "document.querySelector('.kova-dark-m .kd-visual__img')",
);
jsx = jsx.replace(/import \{ usePageMeta \} from '@\/hooks\/usePageMeta';\n/, '');
jsx = jsx.replace(/\n  usePageMeta\(\{[\s\S]*?\}\);\n/, '\n');

fs.writeFileSync('src/pages/HomeDarkMobile.jsx', jsx);

const importOk = css.startsWith("@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300");
const rootOk = css.includes('.kova-dark-m {\n  --kd-dark:');
console.log({
  jsxOk: jsx.includes('kd-timeline') && jsx.includes('kova-dark-m'),
  importOk,
  rootOk,
  brokenImport: css.includes('wght@\n') || css.includes('.kova-dark-m 300'),
  hasMedia: css.includes('@media (max-width: 1050px)'),
});
