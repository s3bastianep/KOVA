import type { CommercialProfile, EvidenceCard } from './candidate-commercial-profile';
import {
  EVIDENCE_COMPETENCY_TAGS,
  getCompetenciesForRole,
  isEvidenceCardComplete,
  newEvidenceCard,
  type CompetencyEntry,
} from './commercial-profile-builder';

export { EVIDENCE_COMPETENCY_TAGS };

export const ACHIEVEMENT_TITLE_SUGGESTIONS = [
  'Crecí las ventas del equipo',
  'Abrí un mercado o segmento nuevo',
  'Cerré la cuenta más grande del año',
  'Superé la meta comercial',
  'Implementé un CRM o proceso nuevo',
  'Lideré un equipo comercial',
  'Recuperé cartera en riesgo',
  'Gané licitación estratégica',
] as const;

export const ACHIEVEMENT_CIFRA_SUGGESTIONS = [
  '+10% en ventas',
  '+25% en ventas',
  '+50% en ventas',
  '$50 millones COP',
  '$200 millones COP',
  '$500 millones COP',
  'Meta al 120%',
  'Meta al 150%',
  '1er lugar en ranking',
] as const;

export const COMPETENCY_LEVEL_OPTIONS = [
  { id: 'principiante', label: 'En desarrollo', score: 45 },
  { id: 'solido', label: 'Sólido', score: 62 },
  { id: 'fuerte', label: 'Fuerte', score: 78 },
  { id: 'referente', label: 'Referente', score: 92 },
] as const;

export type EvidencePhase = 'titulo' | 'contexto' | 'cifra' | 'tags';

export const EVIDENCE_PHASES: EvidencePhase[] = ['titulo', 'contexto', 'cifra', 'tags'];

export function evidencePhaseIndex(phase: EvidencePhase): number {
  return EVIDENCE_PHASES.indexOf(phase);
}

export function draftEvidenceFromProfile(profile: CommercialProfile): EvidenceCard {
  const existing = profile.logros?.find((l) => isEvidenceCardComplete(l));
  if (existing) return { ...existing };
  return newEvidenceCard();
}

export function mergeEvidenceIntoProfile(
  profile: CommercialProfile,
  card: EvidenceCard,
  replaceIncomplete = true,
): CommercialProfile {
  const logros = [...(profile.logros ?? [])];
  const idx = logros.findIndex((l) => l.id === card.id);
  if (idx >= 0) {
    logros[idx] = card;
  } else if (replaceIncomplete && logros.length > 0 && !isEvidenceCardComplete(logros[0])) {
    logros[0] = card;
  } else {
    logros.unshift(card);
  }
  return { ...profile, logros: logros.slice(0, 5) };
}

export function applyCompetencyRatings(
  profile: CommercialProfile,
  ratings: Record<string, CompetencyEntry>,
): CommercialProfile {
  return {
    ...profile,
    competencias: {
      ...(profile.competencias ?? {}),
      ...ratings,
    },
  };
}

export function competencyDefsForProfile(profile: CommercialProfile) {
  return getCompetenciesForRole(profile.nivelRol);
}

export function isEvidenceDraftComplete(card: EvidenceCard): boolean {
  return isEvidenceCardComplete(card);
}

export function isCompetencyRatingsComplete(
  profile: CommercialProfile,
  ratings: Record<string, CompetencyEntry>,
): boolean {
  const defs = competencyDefsForProfile(profile);
  return defs.every((d) => {
    const entry = ratings[d.key];
    return entry && entry.score > 0;
  });
}

export function scoreFromLevelId(levelId: string): number {
  return COMPETENCY_LEVEL_OPTIONS.find((o) => o.id === levelId)?.score ?? 60;
}

export function levelIdFromScore(score: number): string {
  const sorted = [...COMPETENCY_LEVEL_OPTIONS].sort((a, b) => b.score - a.score);
  const match = sorted.find((o) => score >= o.score - 8);
  return match?.id ?? 'solido';
}

export function applyLanguageLevels(
  profile: CommercialProfile,
  levels: Record<string, string>,
): CommercialProfile {
  const selected = Object.keys(levels);
  if (selected.length === 0) return profile;
  const idiomas = selected.map((idioma, i) => ({
    id: profile.idiomas?.find((l) => l.idioma === idioma)?.id ?? `lang-${i}`,
    idioma,
    nivel: levels[idioma] ?? 'B2',
  }));
  return { ...profile, idiomas };
}

export function languageLevelsFromProfile(profile: CommercialProfile): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of profile.idiomas ?? []) {
    if (lang.idioma?.trim()) out[lang.idioma] = lang.nivel?.trim() || '';
  }
  return out;
}

export function languagesNeedingLevels(profile: CommercialProfile, selected: string[]): string[] {
  const levels = languageLevelsFromProfile(profile);
  return selected.filter((idioma) => !levels[idioma]?.trim());
}
