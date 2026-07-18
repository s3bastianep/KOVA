import { COMMERCIAL_SKILLS } from '@/lib/standard-questions';

export const MAX_PORTAL_SKILLS = 3;

export const SKILL_TOOL_SUGGESTIONS = [
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'Zoho CRM',
  'Microsoft Dynamics',
  'Monday CRM',
  'SAP',
  'Zendesk Sell',
  'WhatsApp Business',
  'Excel',
  'Google Sheets',
  'Power BI',
  'LinkedIn Sales Navigator',
];

export const SKILL_SUGGESTIONS = [...COMMERCIAL_SKILLS, ...SKILL_TOOL_SUGGESTIONS];

export { COMMERCIAL_SKILLS as SKILL_CATALOG };

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

/** Extra CV phrases → catalog skill (scanned after exact catalog matches). */
const CV_PHRASE_HINTS: Array<{ phrase: string; skill: string }> = [
  { phrase: 'cold call', skill: 'Llamadas en frío' },
  { phrase: 'llamadas en frio', skill: 'Llamadas en frío' },
  { phrase: 'prospeccion', skill: 'Prospección' },
  { phrase: 'generacion de leads', skill: 'Generación de leads' },
  { phrase: 'lead generation', skill: 'Generación de leads' },
  { phrase: 'cierre de ventas', skill: 'Cierre de ventas' },
  { phrase: 'manejo de objeciones', skill: 'Manejo de objeciones' },
  { phrase: 'key account', skill: 'Cuentas clave' },
  { phrase: 'cuentas clave', skill: 'Cuentas clave' },
  { phrase: 'venta consultiva', skill: 'Venta consultiva' },
  { phrase: 'consultative selling', skill: 'Venta consultiva' },
  { phrase: 'social selling', skill: 'Ventas digitales / social selling' },
  { phrase: 'pipeline', skill: 'Gestión de pipeline' },
  { phrase: 'forecast', skill: 'Forecast de ventas' },
  { phrase: 'upselling', skill: 'Venta cruzada (upselling)' },
  { phrase: 'cross selling', skill: 'Venta cruzada (upselling)' },
  { phrase: 'postventa', skill: 'Postventa' },
  { phrase: 'customer success', skill: 'Postventa' },
  { phrase: 'retencion', skill: 'Retención de clientes' },
  { phrase: 'fidelizacion', skill: 'Fidelización' },
  { phrase: 'negociacion', skill: 'Negociación' },
  { phrase: 'b2b', skill: 'Ventas B2B' },
  { phrase: 'b2c', skill: 'Ventas B2C' },
  { phrase: 'salesforce', skill: 'Salesforce' },
  { phrase: 'hubspot', skill: 'HubSpot' },
  { phrase: 'pipedrive', skill: 'Pipedrive' },
  { phrase: 'zoho', skill: 'Zoho CRM' },
  { phrase: 'dynamics', skill: 'Microsoft Dynamics' },
  { phrase: 'power bi', skill: 'Power BI' },
  { phrase: 'sales navigator', skill: 'LinkedIn Sales Navigator' },
  { phrase: 'whatsapp business', skill: 'WhatsApp Business' },
];

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function textMentions(haystack: string, needle: string): boolean {
  const n = fold(needle);
  if (n.length < 2) return false;
  if (n.length <= 3) {
    return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(n)}(?:$|[^\\p{L}\\p{N}])`, 'u').test(haystack);
  }
  return haystack.includes(n);
}

export function normalizeSkillName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const canonical = COMMERCIAL_SKILLS.find((s) => s.toLowerCase() === trimmed.toLowerCase());
  if (canonical) return canonical;
  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  const tool = SKILL_TOOL_SUGGESTIONS.find((s) => s.toLowerCase() === trimmed.toLowerCase());
  if (tool) return tool;
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

/**
 * Detect catalog skills mentioned in free text (CV body, job descriptions, etc.).
 * Longer catalog names win first to avoid partial overlaps.
 */
export function suggestSkillsFromText(text: string, limit = 8): string[] {
  if (!text?.trim()) return [];
  const hay = fold(text);
  const found: string[] = [];
  const seen = new Set<string>();

  const add = (skill: string) => {
    const normalized = normalizeSkillName(skill);
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) return;
    seen.add(key);
    found.push(normalized);
  };

  const catalogByLength = [...SKILL_SUGGESTIONS].sort((a, b) => b.length - a.length);
  for (const skill of catalogByLength) {
    if (found.length >= limit) break;
    if (textMentions(hay, skill)) add(skill);
  }

  for (const { phrase, skill } of CV_PHRASE_HINTS) {
    if (found.length >= limit) break;
    if (textMentions(hay, phrase)) add(skill);
  }

  return found.slice(0, limit);
}

export function skillCorpusFromProfile(profile: {
  nivelRol?: string;
  rol?: string;
  funcionPrincipal?: string;
  enfoque?: string;
  historialLaboral?: Array<{ cargo?: string; empresa?: string; descripcion?: string }>;
}): string {
  const parts: string[] = [];
  if (profile.nivelRol) parts.push(profile.nivelRol);
  if (profile.rol) parts.push(profile.rol);
  if (profile.funcionPrincipal) parts.push(profile.funcionPrincipal);
  if (profile.enfoque) parts.push(profile.enfoque);
  for (const job of profile.historialLaboral ?? []) {
    if (job.cargo) parts.push(job.cargo);
    if (job.empresa) parts.push(job.empresa);
    if (job.descripcion) parts.push(job.descripcion);
  }
  return parts.join('\n');
}

export function suggestSkillsFromProfile(
  profile: Parameters<typeof skillCorpusFromProfile>[0],
  limit = 8,
): string[] {
  return suggestSkillsFromText(skillCorpusFromProfile(profile), limit);
}
