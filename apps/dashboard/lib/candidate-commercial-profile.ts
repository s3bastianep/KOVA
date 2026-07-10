import type { RequirementResult } from './compatibility';
import {
  type CompetencyEntry,
  type EvidenceCard,
  type WorkHistoryEntry,
  type EducationEntry,
  type LanguageEntry,
  type CertificationEntry,
  competencyHasBacking,
  effectiveCompetencyScore,
  getCompetenciesForRole,
  isLeadershipRoleLevel,
} from './commercial-profile-builder';

export type { EvidenceCard, CompetencyEntry, WorkHistoryEntry, EducationEntry, LanguageEntry, CertificationEntry } from './commercial-profile-builder';
export {
  ROLE_LEVEL_OPTIONS,
  ROLE_FUNCTION_OPTIONS,
  AVAILABILITY_OPTIONS,
  TRAVEL_OPTIONS,
  RELOCATION_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  SALARY_EXPECTATION_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  PROFESSIONAL_OBJECTIVE_OPTIONS,
  EVIDENCE_COMPETENCY_TAGS,
  INDIVIDUAL_COMPETENCIES,
  LEADERSHIP_COMPETENCIES,
  getCompetenciesForRole,
  isLeadershipRoleLevel,
  newEvidenceCard,
  newWorkHistoryEntry,
  newEducationEntry,
  newLanguageEntry,
  newCertificationEntry,
  isEvidenceCardComplete,
  isWorkHistoryComplete,
  isEducationComplete,
  isLanguageComplete,
  calculateProfileCompleteness,
  competencyHasBacking,
  HIGH_SCORE_THRESHOLD,
} from './commercial-profile-builder';

export type CommercialProfile = {
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  modalidadTrabajo?: string;
  disponibilidad?: string;
  disponibilidadViajar?: string;
  disponibilidadReubicacion?: string;
  consentimientoDatos?: boolean;
  nivelRol?: string;
  funcionPrincipal?: string;
  objetivoProfesional?: string;
  tamanoEquipo?: string;
  anios?: string | number;
  tipoVenta?: string;
  naturaleza?: string;
  enfoque?: string;
  ciclo?: string;
  tickets?: string[];
  ticketPrincipal?: string;
  tipoCliente?: string;
  nivelInterlocutor?: string;
  canalVenta?: string;
  cuentasCartera?: string;
  coberturaGeografica?: string;
  crmVentas?: string;
  crmVentasOtro?: string;
  estructuraComision?: string;
  industrias?: string[];
  industriaPrincipal?: string;
  historialLaboral?: WorkHistoryEntry[];
  formacion?: EducationEntry[];
  idiomas?: LanguageEntry[];
  certificaciones?: CertificationEntry[];
  expectativaSalarial?: string;
  tipoContratoDeseado?: string;
  logros?: EvidenceCard[];
  competencias?: Record<string, CompetencyEntry>;
  rol?: string;
  rolOtro?: string;
  ticket?: string;
  herramientas?: string[];
  cuota?: string | number;
  logro?: string;
  venta_consultiva?: string | number;
  prospeccion?: string | number;
  objeciones?: string | number;
  logro_orient?: string | number;
  cierre_negociacion?: string | number;
  liderazgo_equipos?: string | number;
  pensamiento_estrategico?: string | number;
  gestion_kpis?: string | number;
  negociacion_clevel?: string | number;
  cuentas_estrategicas?: string | number;
};

export type CommercialVacancyCriteria = {
  nivelRol?: string;
  tipoVenta?: string;
  naturaleza?: string;
  enfoque?: string;
  ciclo?: string;
  ticket?: string;
  industria?: string;
  tipoCliente?: string;
  canalVenta?: string;
  competencyWeights?: Record<string, 'critica' | 'importante' | 'deseable'>;
};

export const SALE_CYCLE_OPTIONS = [
  'Menos de 1 mes',
  '1 a 3 meses',
  '3 a 6 meses',
  '6 a 12 meses',
  'Más de 12 meses',
];

export const TICKET_OPTIONS = [
  'Menos de $5 millones COP',
  '$5 a $20 millones COP',
  '$20 a $100 millones COP',
  '$100 a $500 millones COP',
  'Más de $500 millones COP',
];

export const CLIENT_TYPE_OPTIONS = ['B2B', 'B2C', 'B2B2C', 'Gobierno (licitaciones)'];
export const INTERLOCUTOR_OPTIONS = ['C-level', 'Gerencia media', 'Compras', 'Usuario final'];
export const SALES_CHANNEL_OPTIONS = ['Directo', 'Distribuidores', 'Retail', 'E-commerce', 'Licitación'];
export const PORTFOLIO_SIZE_OPTIONS = ['1-10', '10-50', '50+'];
export const GEO_COVERAGE_OPTIONS = ['Local', 'Regional', 'Nacional', 'Internacional'];
export const CRM_SALES_OPTIONS = [
  'Salesforce',
  'HubSpot',
  'Dynamics',
  'Zoho',
  'Pipedrive',
  'Otro',
  'Ninguno',
];
export const TEAM_SIZE_OPTIONS = ['0', '1-5', '6-15', '16-30', '30+'];
export const COMMISSION_OPTIONS = ['Fija sin variable', 'Variable con techo', 'Variable sin techo'];

export const COLOMBIAN_CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Manizales',
  'Ibagué',
  'Cúcuta',
  'Villavicencio',
  'Pasto',
  'Montería',
  'Neiva',
  'Armenia',
  'Sincelejo',
  'Popayán',
  'Valledupar',
  'Tunja',
  'Otra',
];

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

const TICKET_MAP: Record<string, string> = {
  'Menos de $5 millones COP': 'Menos de 100 millones/mes',
  '$5 a $20 millones COP': '100 - 500 millones/mes',
  '$20 a $100 millones COP': '500 - 1.000 millones/mes',
  '$100 a $500 millones COP': '1.000 - 5.000 millones/mes',
  'Más de $500 millones COP': 'Más de 5.000 millones/mes',
};

const CRM_SALES_MAP: Record<string, string> = {
  Salesforce: 'Salesforce',
  HubSpot: 'HubSpot',
  Dynamics: 'Dynamics',
  Zoho: 'Zoho',
  Pipedrive: 'Pipedrive',
  Otro: 'Otro',
  Ninguno: 'Ninguno',
};

const WEIGHT_BY_PRIORITY: Record<string, number> = {
  critica: 24,
  importante: 16,
  deseable: 8,
};

export function splitFullName(nombre: string) {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '-' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function resolveCompetencyScores(profile: CommercialProfile) {
  const defs = getCompetenciesForRole(profile.nivelRol);
  const logros = profile.logros ?? [];
  return defs.map((def) => {
    const entry = profile.competencias?.[def.key];
    const legacy = Number(profile[def.key as keyof CommercialProfile] ?? entry?.score ?? 60);
    const score = Number(entry?.score ?? legacy);
    const hasBacking = competencyHasBacking(entry, logros);
    return { ...def, score, hasBacking, effective: effectiveCompetencyScore(score, hasBacking) };
  });
}

export function profileToStandardAnswers(profile: CommercialProfile): Record<string, string> {
  const years = Number(profile.anios ?? 0);
  const industries = (profile.industrias ?? [])
    .map((item) => INDUSTRY_MAP[item] ?? item)
    .join(',');
  const crmVentas =
    profile.crmVentas === 'Otro'
      ? profile.crmVentasOtro?.trim() || 'Otro'
      : profile.crmVentas
        ? (CRM_SALES_MAP[profile.crmVentas] ?? profile.crmVentas)
        : '';
  const primaryTicket =
    profile.ticketPrincipal ??
    (profile.tickets?.length === 1 ? profile.tickets[0] : profile.tickets?.[0]) ??
    '';
  const salesTypes = [profile.tipoVenta, profile.funcionPrincipal, profile.enfoque]
    .filter(Boolean)
    .join(',');

  const competencyScores = resolveCompetencyScores(profile);
  const skills = competencyScores
    .filter((c) => c.effective >= 70)
    .map((c) => c.label.split(' / ')[0])
    .slice(0, 8);

  return {
    experience_years: String(Number.isFinite(years) ? years : 0),
    industry: industries,
    industry_primary: profile.industriaPrincipal ?? profile.industrias?.[0] ?? '',
    sales_type: salesTypes || profile.tipoVenta || '',
    ticket_avg: TICKET_MAP[primaryTicket] ?? primaryTicket,
    crm: crmVentas,
    city: profile.ciudad ?? '',
    phone: profile.telefono ?? '',
    availability: profile.disponibilidad ?? '',
    travel_willingness: profile.disponibilidadViajar ?? '',
    relocation_willingness: profile.disponibilidadReubicacion ?? '',
    skills: [...new Set(skills)].join(','),
    target_role: profile.nivelRol ?? profile.rol ?? '',
    role_function: profile.funcionPrincipal ?? '',
    role_level: profile.nivelRol ?? '',
    sale_cycle: profile.ciclo ?? '',
    sale_nature: profile.naturaleza ?? '',
    client_type: profile.tipoCliente ?? '',
    interlocutor_level: profile.nivelInterlocutor ?? '',
    sales_channel: profile.canalVenta ?? '',
    portfolio_size: profile.cuentasCartera ?? '',
    geo_coverage: profile.coberturaGeografica ?? '',
    team_size: profile.tamanoEquipo ?? '',
    commission_structure: profile.estructuraComision ?? '',
    ticket_ranges: (profile.tickets ?? []).join('|'),
    evidence_cards: JSON.stringify(profile.logros ?? []),
    work_history: JSON.stringify(profile.historialLaboral ?? []),
    education: JSON.stringify(profile.formacion ?? []),
    languages: JSON.stringify(profile.idiomas ?? []),
    certifications: JSON.stringify(profile.certificaciones ?? []),
    salary_expectation: profile.expectativaSalarial ?? '',
    contract_preference: profile.tipoContratoDeseado ?? '',
    career_objective: profile.objetivoProfesional ?? '',
    data_consent: profile.consentimientoDatos ? 'true' : 'false',
    competency_scores: JSON.stringify(
      Object.fromEntries(
        resolveCompetencyScores(profile).map((c) => [
          c.key,
          {
            score: c.score,
            effective: c.effective,
            hasBacking: c.hasBacking,
            evidenceId: profile.competencias?.[c.key]?.evidenceId,
            ejemplo: profile.competencias?.[c.key]?.ejemplo,
          },
        ]),
      ),
    ),
    leadership_profile: isLeadershipRoleLevel(profile.nivelRol) ? 'true' : 'false',
    top_achievement: (profile.logros ?? [])
      .map((l) => `${l.titulo}: ${l.cifra}`)
      .join(' | ')
      .slice(0, 500),
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
  if (!industry && !byKey.sales_type && !byKey.role_level) return null;

  return {
    industria: industry?.split(',')[0],
    nivelRol: byKey.role_level || byKey.target_role,
    tipoVenta: byKey.sales_type?.includes('Consultiva') ? 'Consultiva' : undefined,
    ticket: byKey.ticket_avg,
    tipoCliente: byKey.client_type,
    canalVenta: byKey.sales_channel,
  };
}

function roleLevelMatch(profile: CommercialProfile, criteria: CommercialVacancyCriteria): boolean {
  if (!criteria.nivelRol) return true;
  if (profile.nivelRol === criteria.nivelRol) return true;
  const leadershipProfile = isLeadershipRoleLevel(profile.nivelRol);
  const leadershipVacancy = isLeadershipRoleLevel(criteria.nivelRol);
  if (leadershipVacancy && leadershipProfile) return true;
  return false;
}

export function calculateCommercialProfileMatch(
  profile: CommercialProfile,
  criteria: CommercialVacancyCriteria,
): { total: number; breakdown: RequirementResult[] } {
  const checks: { key: string; label: string; weight: number; met: boolean; detail: string }[] = [
    {
      key: 'nivelRol',
      label: 'Nivel de rol',
      weight: 20,
      met: roleLevelMatch(profile, criteria),
      detail: `${profile.nivelRol ?? '-'} · esperado ${criteria.nivelRol ?? '-'}`,
    },
    {
      key: 'tipoVenta',
      label: 'Tipo de venta',
      weight: 14,
      met: !criteria.tipoVenta || profile.tipoVenta === criteria.tipoVenta,
      detail: `${profile.tipoVenta ?? '-'} · esperado ${criteria.tipoVenta ?? '-'}`,
    },
    {
      key: 'ciclo',
      label: 'Ciclo de venta',
      weight: 12,
      met: !criteria.ciclo || profile.ciclo === criteria.ciclo,
      detail: `${profile.ciclo ?? '-'} · esperado ${criteria.ciclo ?? '-'}`,
    },
    {
      key: 'ticket',
      label: 'Ticket',
      weight: 12,
      met:
        !criteria.ticket ||
        profile.ticketPrincipal === criteria.ticket ||
        (profile.tickets ?? []).includes(criteria.ticket) ||
        TICKET_MAP[profile.ticketPrincipal ?? ''] === criteria.ticket,
      detail: `${profile.ticketPrincipal ?? profile.tickets?.join(', ') ?? '-'} · esperado ${criteria.ticket ?? '-'}`,
    },
    {
      key: 'tipoCliente',
      label: 'Tipo de cliente',
      weight: 10,
      met: !criteria.tipoCliente || profile.tipoCliente === criteria.tipoCliente,
      detail: `${profile.tipoCliente ?? '-'} · esperado ${criteria.tipoCliente ?? '-'}`,
    },
    {
      key: 'canalVenta',
      label: 'Canal de venta',
      weight: 10,
      met: !criteria.canalVenta || profile.canalVenta === criteria.canalVenta,
      detail: `${profile.canalVenta ?? '-'} · esperado ${criteria.canalVenta ?? '-'}`,
    },
    {
      key: 'industria',
      label: 'Industria',
      weight: 12,
      met:
        !criteria.industria ||
        profile.industriaPrincipal === criteria.industria ||
        (Array.isArray(profile.industrias) && profile.industrias.includes(criteria.industria)),
      detail: `${profile.industriaPrincipal ?? profile.industrias?.join(', ') ?? '-'} · esperado ${criteria.industria ?? '-'}`,
    },
  ].filter((row) => {
    const expected = criteria[row.key as keyof CommercialVacancyCriteria];
    return expected != null && String(expected).length > 0;
  });

  const categorical =
    checks.length > 0
      ? checks.reduce((sum, row) => sum + (row.met ? row.weight : 0), 0) /
        checks.reduce((sum, row) => sum + row.weight, 0)
      : 0.5;

  const competencyScores = resolveCompetencyScores(profile);
  const weights = criteria.competencyWeights ?? {};
  let compEarned = 0;
  let compMax = 0;

  for (const comp of competencyScores) {
    const priority = weights[comp.key] ?? 'importante';
    const w = WEIGHT_BY_PRIORITY[priority] ?? 16;
    compMax += w;
    compEarned += (comp.effective / 100) * w;
  }

  if (compMax === 0) {
    compMax = competencyScores.length * 16;
    compEarned = competencyScores.reduce((sum, c) => sum + (c.effective / 100) * 16, 0);
  }

  const compRatio = compMax > 0 ? compEarned / compMax : 0.6;
  const total = Math.round(categorical * 55 + compRatio * 45);

  const breakdown: RequirementResult[] = checks.map((row) => ({
    key: row.key,
    label: row.label,
    weight: row.weight,
    met: row.met,
    earned: row.met ? row.weight : 0,
    max: row.weight,
    detail: row.detail,
  }));

  if (competencyScores.length > 0) {
    const avgEffective = Math.round(
      competencyScores.reduce((a, c) => a + c.effective, 0) / competencyScores.length,
    );
    const withEvidence = competencyScores.filter((c) => c.hasBacking).length;
    breakdown.push({
      key: 'competencies',
      label: 'Competencias con evidencia',
      weight: 45,
      met: avgEffective >= 65,
      earned: Math.round(compRatio * 45),
      max: 45,
      detail: `Promedio efectivo ${avgEffective}% · ${withEvidence}/${competencyScores.length} con respaldo`,
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
  const total = Math.round(standardTotal * 0.35 + commercial.total * 0.65);
  return {
    total,
    breakdown: [...commercial.breakdown, ...standardBreakdown],
  };
}
