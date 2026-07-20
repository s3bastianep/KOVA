import fs from 'node:fs';

let desk = fs.readFileSync('src/pages/HomeDark.jsx', 'utf8');
desk = desk.replace('export default function HomeDark()', 'export default function HomeDarkDesktop()');
desk = desk.replace(
  "document.querySelector('.kd-score-num')",
  "document.querySelector('.kova-dark .kd-score-num')",
);
desk = desk.replace(
  "document.querySelector('.kd-dashboard')",
  "document.querySelector('.kova-dark .kd-dashboard')",
);
desk = desk.replace(
  "document.querySelector('.kd-visual')",
  "document.querySelector('.kova-dark .kd-visual')",
);
desk = desk.replace(
  "document.querySelector('.kd-visual__img')",
  "document.querySelector('.kova-dark .kd-visual__img')",
);
desk = desk.replace(/\n\s*\{\/\* Mobile-only hero image[\s\S]*?<\/div>\n\n/, '\n');
fs.writeFileSync('src/pages/HomeDarkDesktop.jsx', desk);

let mob = fs.readFileSync('src/pages/HomeDarkMobile.jsx', 'utf8');
mob = mob.replace(
  "document.querySelector('.kd-score-num')",
  "document.querySelector('.kova-dark-m .kd-score-num')",
);
mob = mob.replace(
  "document.querySelector('.kd-dashboard')",
  "document.querySelector('.kova-dark-m .kd-dashboard')",
);
mob = mob.replace(
  "document.querySelector('.kd-visual')",
  "document.querySelector('.kova-dark-m .kd-visual')",
);
mob = mob.replace(
  "document.querySelector('.kd-visual__img')",
  "document.querySelector('.kova-dark-m .kd-visual__img')",
);
mob = mob.replace(/import \{ usePageMeta \} from '@\/hooks\/usePageMeta';\n/, '');
mob = mob.replace(/\n  usePageMeta\(\{[\s\S]*?\}\);\n/, '\n');
fs.writeFileSync('src/pages/HomeDarkMobile.jsx', mob);

console.log({
  deskOk: desk.includes('HomeDarkDesktop') && !desk.includes('kd-visual-m'),
  mobScoped: mob.includes(".kova-dark-m .kd-score-num"),
  mobNoMeta: !mob.includes('usePageMeta'),
});
