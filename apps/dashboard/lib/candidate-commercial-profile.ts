import type { RequirementResult } from './compatibility';

export type CommercialProfile = {
  nombre?: string;
  email?: string;
  ciudad?: string;
  rol?: string;
  anios?: string | number;
  tipoVenta?: string;
  naturaleza?: string;
  enfoque?: string;
  ciclo?: string;
  ticket?: string;
  industrias?: string[];
  herramientas?: string[];
  cuota?: string | number;
  logro?: string;
  venta_consultiva?: string | number;
  prospeccion?: string | number;
  objeciones?: string | number;
  logro_orient?: string | number;
};

export type CommercialVacancyCriteria = {
  tipoVenta?: string;
  naturaleza?: string;
  enfoque?: string;
  ciclo?: string;
  ticket?: string;
  industria?: string;
};

export const COMMERCIAL_INDUSTRIES = [
  'Tecnología / SaaS',
  'Industrial',
  'Seguros',
  'Salud',
  'Retail',
  'Servicios B2B',
  'Financiero',
  'Otra',
];

export const COMMERCIAL_TOOLS = [
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'Zoho',
  'Excel / Sheets',
  'Otro',
];

const INDUSTRY_MAP: Record<string, string> = {
  'Tecnología / SaaS': 'Tecnología,Software',
  Industrial: 'Distribución',
  Seguros: 'Finanzas',
  Salud: 'Salud',
  Retail: 'Retail',
  'Servicios B2B': 'Servicios',
  Financiero: 'Finanzas',
  Otra: 'Servicios',
};

const CRM_MAP: Record<string, string> = {
  Salesforce: 'Salesforce',
  HubSpot: 'HubSpot',
  Pipedrive: 'Pipedrive',
  Zoho: 'Zoho',
  'Excel / Sheets': 'Ninguno',
  Otro: 'Ninguno',
};

const TICKET_MAP: Record<string, string> = {
  'Menos de $5M': 'Menos de 100 millones/mes',
  '$5M–$20M': '100 - 500 millones/mes',
  '$20M–$100M': '500 - 1.000 millones/mes',
  'Más de $100M': '1.000 - 5.000 millones/mes',
};

export function splitFullName(nombre: string) {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '-' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function profileToStandardAnswers(profile: CommercialProfile): Record<string, string> {
  const years = Number(profile.anios ?? 0);
  const industries = (profile.industrias ?? [])
    .map((item) => INDUSTRY_MAP[item] ?? item)
    .join(',');
  const crm = (profile.herramientas ?? []).map((item) => CRM_MAP[item] ?? item).join(',');
  const salesTypes = [profile.tipoVenta, profile.enfoque?.includes('hunter') ? 'Field sales' : 'Inside sales']
    .filter(Boolean)
    .join(',');

  const skills: string[] = [];
  if (profile.tipoVenta === 'Consultiva') skills.push('Venta consultiva');
  if (profile.enfoque?.includes('hunter')) skills.push('Prospección');
  if (profile.enfoque?.includes('farmer')) skills.push('Cuentas clave');
  if (Number(profile.prospeccion ?? 0) >= 70) skills.push('Prospección');
  if (Number(profile.objeciones ?? 0) >= 70) skills.push('Manejo de objeciones');
  if (Number(profile.venta_consultiva ?? 0) >= 70) skills.push('Venta consultiva');

  return {
    experience_years: String(Number.isFinite(years) ? years : 0),
    industry: industries,
    sales_type: salesTypes || profile.tipoVenta || '',
    ticket_avg: TICKET_MAP[profile.ticket ?? ''] ?? profile.ticket ?? '',
    crm,
    city: profile.ciudad ?? '',
    skills: [...new Set(skills)].slice(0, 6).join(','),
    target_role: profile.rol ?? '',
    sale_cycle: profile.ciclo ?? '',
    sale_nature: profile.naturaleza ?? '',
    quota_avg: profile.cuota != null ? String(profile.cuota) : '',
    top_achievement: profile.logro ?? '',
  };
}

export function commercialProfileFromMetadata(metadata: unknown): CommercialProfile | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const meta = metadata as Record<string, unknown>;
  const profile = meta.commercialProfile as CommercialProfile | undefined;
  if (profile && typeof profile === 'object') return profile;
  return null;
}

export function commercialCriteriaFromVacancyMetadata(metadata: unknown): CommercialVacancyCriteria | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const meta = metadata as Record<string, unknown>;
  if (meta.commercialCriteria && typeof meta.commercialCriteria === 'object') {
    return meta.commercialCriteria as CommercialVacancyCriteria;
  }

  const reqs = (meta.requirements ?? []) as { key: string; expected: string }[];
  const byKey = Object.fromEntries(reqs.map((r) => [r.key, r.expected]));
  const industry = byKey.industry;
  if (!industry && !byKey.sales_type) return null;

  return {
    industria: industry?.split(',')[0],
    tipoVenta: byKey.sales_type?.includes('Consultiva') ? 'Consultiva' : undefined,
    ticket: byKey.ticket_avg,
  };
}

export function calculateCommercialProfileMatch(
  profile: CommercialProfile,
  criteria: CommercialVacancyCriteria,
): { total: number; breakdown: RequirementResult[] } {
  const checks: { key: string; label: string; weight: number; met: boolean; detail: string }[] = [
    {
      key: 'tipoVenta',
      label: 'Tipo de venta',
      weight: 18,
      met: !!criteria.tipoVenta && profile.tipoVenta === criteria.tipoVenta,
      detail: `${profile.tipoVenta ?? '-'} · esperado ${criteria.tipoVenta ?? '-'}`,
    },
    {
      key: 'naturaleza',
      label: 'Naturaleza',
      weight: 16,
      met: !!criteria.naturaleza && profile.naturaleza === criteria.naturaleza,
      detail: `${profile.naturaleza ?? '-'} · esperado ${criteria.naturaleza ?? '-'}`,
    },
    {
      key: 'enfoque',
      label: 'Enfoque',
      weight: 16,
      met: !!criteria.enfoque && profile.enfoque === criteria.enfoque,
      detail: `${profile.enfoque ?? '-'} · esperado ${criteria.enfoque ?? '-'}`,
    },
    {
      key: 'ciclo',
      label: 'Ciclo de venta',
      weight: 14,
      met: !!criteria.ciclo && profile.ciclo === criteria.ciclo,
      detail: `${profile.ciclo ?? '-'} · esperado ${criteria.ciclo ?? '-'}`,
    },
    {
      key: 'ticket',
      label: 'Ticket',
      weight: 14,
      met: !!criteria.ticket && profile.ticket === criteria.ticket,
      detail: `${profile.ticket ?? '-'} · esperado ${criteria.ticket ?? '-'}`,
    },
    {
      key: 'industria',
      label: 'Industria',
      weight: 12,
      met:
        !!criteria.industria &&
        Array.isArray(profile.industrias) &&
        profile.industrias.includes(criteria.industria),
      detail: `${(profile.industrias ?? []).join(', ') || '-'} · esperado ${criteria.industria ?? '-'}`,
    },
  ].filter((row) => {
    const expected = criteria[row.key as keyof CommercialVacancyCriteria];
    return expected != null && String(expected).length > 0;
  });

  const categorical =
    checks.length > 0
      ? checks.reduce((sum, row) => sum + (row.met ? row.weight : 0), 0) /
        checks.reduce((sum, row) => sum + row.weight, 0)
      : 0;

  const sliders = [
    profile.venta_consultiva,
    profile.prospeccion,
    profile.objeciones,
    profile.logro_orient,
  ]
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  const avgComp = sliders.length ? sliders.reduce((a, b) => a + b, 0) / sliders.length : 60;
  const total = Math.round(categorical * 70 + (avgComp / 100) * 30);

  const breakdown: RequirementResult[] = checks.map((row) => ({
    key: row.key,
    label: row.label,
    weight: row.weight,
    met: row.met,
    earned: row.met ? row.weight : 0,
    max: row.weight,
    detail: row.detail,
  }));

  if (sliders.length > 0) {
    breakdown.push({
      key: 'self_assessment',
      label: 'Autoevaluación comercial',
      weight: 30,
      met: avgComp >= 65,
      earned: Math.round((avgComp / 100) * 30),
      max: 30,
      detail: `Promedio ${Math.round(avgComp)}%`,
    });
  }

  return { total, breakdown };
}

export function mergeCompatibilityScores(
  standardTotal: number,
  standardBreakdown: RequirementResult[],
  commercial: { total: number; breakdown: RequirementResult[] } | null,
) {
  if (!commercial) {
    return { total: standardTotal, breakdown: standardBreakdown };
  }
  const total = Math.round(standardTotal * 0.4 + commercial.total * 0.6);
  return {
    total,
    breakdown: [...commercial.breakdown, ...standardBreakdown],
  };
}
