import { COMMERCIAL_SKILLS } from '@/lib/standard-questions';

const ALIASES: Record<string, string> = {
  cierre: 'Cierre de ventas',
  'cierre de ventas': 'Cierre de ventas',
  comunicación: 'Presentación comercial',
  'presentacion comercial': 'Presentación comercial',
  planeación: 'Análisis de mercado',
  planeacion: 'Análisis de mercado',
  liderazgo: 'Liderazgo comercial',
  'orientación al logro': 'Liderazgo comercial',
  'orientacion al logro': 'Liderazgo comercial',
  disciplina: 'Gestión de pipeline',
};

export function normalizeSkillName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const canonical = COMMERCIAL_SKILLS.find((s) => s.toLowerCase() === trimmed.toLowerCase());
  if (canonical) return canonical;
  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  return trimmed;
}

export function normalizeSkillList(items: string[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const n = normalizeSkillName(item);
    if (n) set.add(n);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
}

export function candidateMatchesSkills(candidateSkills: string[] | undefined, required: string[]): boolean {
  if (required.length === 0) return true;
  const pool = new Set((candidateSkills ?? []).map((s) => s.toLowerCase()));
  return required.every((s) => pool.has(normalizeSkillName(s).toLowerCase()));
}

export { COMMERCIAL_SKILLS as SKILL_CATALOG };

export const SKILL_TOOL_SUGGESTIONS = [
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'Zoho CRM',
  'Microsoft Dynamics',
  'Excel',
  'Google Sheets',
  'Power BI',
  'LinkedIn Sales Navigator',
];

export const SKILL_SUGGESTIONS = [...COMMERCIAL_SKILLS, ...SKILL_TOOL_SUGGESTIONS];
