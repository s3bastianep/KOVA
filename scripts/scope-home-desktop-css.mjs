import { execSync } from 'node:child_process';
import fs from 'node:fs';

function gitShow(revPath) {
  return execSync(`git show ${revPath}`, { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 });
}

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

let css = gitShow('HEAD:src/styles/landing-kova-dark.css').toString('utf8');
css = css.replace(/\n\.kd-visual-m\s*\{[\s\S]*?\n\}/g, '');
css = css.replace(/\n\s*\.kd-visual-m\s*\{[\s\S]*?\n\s*\}/g, '');
css = css.replace(/\n\s*\.kd-visual-m\s+img\s*\{[\s\S]*?\n\s*\}/g, '');
css = prefixCss(css, '.kova-dark');
fs.writeFileSync('src/styles/landing-kova-dark.css', css);

console.log({
  importOk: css.startsWith("@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300"),
  rootOk: css.includes('.kova-dark {\n  --kd-dark:'),
  brokenImport: css.includes('wght@\n') || css.includes('.kova-dark 300'),
  hasMedia: css.includes('@media (max-width: 1050px)'),
  hasBrokenKf: css.includes('.kova-dark @keyframes'),
});
