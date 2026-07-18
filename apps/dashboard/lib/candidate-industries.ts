/** Industries offered in candidate preferences / onboarding. */
export const PORTAL_INDUSTRY_OPTIONS = [
  'Tecnología',
  'Software / SaaS',
  'Fintech',
  'Construcción',
  'Industrial',
  'Manufactura',
  'Salud',
  'Farmacéutica',
  'Consumo masivo',
  'Alimentos y bebidas',
  'Educación',
  'Servicios B2B',
  'Retail',
  'Logística',
  'Automotriz',
  'Financiero / Seguros',
  'Agro',
  'Energía',
  'Telecomunicaciones',
  'Gobierno',
  'Otra',
] as const;

export type PortalIndustry = (typeof PORTAL_INDUSTRY_OPTIONS)[number];

export const MAX_PORTAL_INDUSTRIES = 3;

const CV_INDUSTRY_HINTS: Array<{ phrase: string; industry: PortalIndustry }> = [
  { phrase: 'saas', industry: 'Software / SaaS' },
  { phrase: 'software', industry: 'Software / SaaS' },
  { phrase: 'tecnologia', industry: 'Tecnología' },
  { phrase: 'technology', industry: 'Tecnología' },
  { phrase: 'fintech', industry: 'Fintech' },
  { phrase: 'startup', industry: 'Tecnología' },
  { phrase: 'construccion', industry: 'Construcción' },
  { phrase: 'obra civil', industry: 'Construcción' },
  { phrase: 'industrial', industry: 'Industrial' },
  { phrase: 'manufactura', industry: 'Manufactura' },
  { phrase: 'manufacturing', industry: 'Manufactura' },
  { phrase: 'farmaceut', industry: 'Farmacéutica' },
  { phrase: 'pharma', industry: 'Farmacéutica' },
  { phrase: 'salud', industry: 'Salud' },
  { phrase: 'hospital', industry: 'Salud' },
  { phrase: 'clinica', industry: 'Salud' },
  { phrase: 'consumo masivo', industry: 'Consumo masivo' },
  { phrase: 'fmcg', industry: 'Consumo masivo' },
  { phrase: 'alimentos', industry: 'Alimentos y bebidas' },
  { phrase: 'bebidas', industry: 'Alimentos y bebidas' },
  { phrase: 'educacion', industry: 'Educación' },
  { phrase: 'universidad', industry: 'Educación' },
  { phrase: 'b2b', industry: 'Servicios B2B' },
  { phrase: 'retail', industry: 'Retail' },
  { phrase: 'comercio', industry: 'Retail' },
  { phrase: 'logistica', industry: 'Logística' },
  { phrase: 'transporte', industry: 'Logística' },
  { phrase: 'automotriz', industry: 'Automotriz' },
  { phrase: 'automotive', industry: 'Automotriz' },
  { phrase: 'seguro', industry: 'Financiero / Seguros' },
  { phrase: 'banco', industry: 'Financiero / Seguros' },
  { phrase: 'financiero', industry: 'Financiero / Seguros' },
  { phrase: 'agro', industry: 'Agro' },
  { phrase: 'agricola', industry: 'Agro' },
  { phrase: 'energia', industry: 'Energía' },
  { phrase: 'oil', industry: 'Energía' },
  { phrase: 'petroleo', industry: 'Energía' },
  { phrase: 'telecomunic', industry: 'Telecomunicaciones' },
  { phrase: 'telecom', industry: 'Telecomunicaciones' },
  { phrase: 'gobierno', industry: 'Gobierno' },
  { phrase: 'publico', industry: 'Gobierno' },
];

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function textMentions(haystack: string, needle: string): boolean {
  const n = fold(needle);
  if (n.length < 3) return false;
  return haystack.includes(n);
}

export function normalizeIndustryName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const canonical = PORTAL_INDUSTRY_OPTIONS.find((item) => item.toLowerCase() === trimmed.toLowerCase());
  return canonical ?? trimmed;
}

export function suggestIndustriesFromText(text: string, limit = 6): string[] {
  if (!text?.trim()) return [];
  const hay = fold(text);
  const found: string[] = [];
  const seen = new Set<string>();

  const add = (industry: string) => {
    const normalized = normalizeIndustryName(industry);
    const key = normalized.toLowerCase();
    if (!normalized || normalized === 'Otra' || seen.has(key)) return;
    seen.add(key);
    found.push(normalized);
  };

  const byLength = [...PORTAL_INDUSTRY_OPTIONS]
    .filter((item) => item !== 'Otra')
    .sort((a, b) => b.length - a.length);
  for (const industry of byLength) {
    if (found.length >= limit) break;
    if (textMentions(hay, industry)) add(industry);
  }

  for (const { phrase, industry } of CV_INDUSTRY_HINTS) {
    if (found.length >= limit) break;
    if (textMentions(hay, phrase)) add(industry);
  }

  return found.slice(0, limit);
}

export function industryCorpusFromProfile(profile: {
  historialLaboral?: Array<{ cargo?: string; empresa?: string; descripcion?: string }>;
  industrias?: string[];
  industriaPrincipal?: string;
}): string {
  const parts: string[] = [];
  if (profile.industriaPrincipal) parts.push(profile.industriaPrincipal);
  for (const item of profile.industrias ?? []) parts.push(item);
  for (const job of profile.historialLaboral ?? []) {
    if (job.cargo) parts.push(job.cargo);
    if (job.empresa) parts.push(job.empresa);
    if (job.descripcion) parts.push(job.descripcion);
  }
  return parts.join('\n');
}

export function suggestIndustriesFromProfile(
  profile: Parameters<typeof industryCorpusFromProfile>[0],
  limit = 6,
): string[] {
  return suggestIndustriesFromText(industryCorpusFromProfile(profile), limit);
}
