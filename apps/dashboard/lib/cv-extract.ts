import {
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  ROLE_LEVEL_OPTIONS,
  type EducationEntry,
  type LanguageEntry,
  type WorkHistoryEntry,
  newEducationEntry,
  newLanguageEntry,
  newWorkHistoryEntry,
} from './commercial-profile-builder';
import { COLOMBIAN_CITIES } from './candidate-commercial-profile';
import {
  isCurrentDateToken,
  normalizeCvText,
  parseSpanishMonthToken,
  toLineArray,
  formatWorkDescription,
} from './cv-text-pipeline';
import { suggestSkillsFromText } from './candidate-skills';

export const CV_MAX_BYTES = 5 * 1024 * 1024;

export type CvFieldConfidence = 'high' | 'medium' | 'low';

export type CvReviewField = {
  key: string;
  label: string;
  preview: string;
  confidence: CvFieldConfidence;
  /** Si el campo ya tiene valor en el perfil, no preseleccionar por defecto. */
  defaultSelected: boolean;
};

export type CvExtractionSuggestions = {
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  anios?: string;
  nivelRol?: string;
  historialLaboral?: WorkHistoryEntry[];
  formacion?: EducationEntry[];
  idiomas?: LanguageEntry[];
  /** Skills detected in CV text (catalog matches). */
  herramientas?: string[];
};

export type CvExtractionResult = {
  fileName: string;
  textLength: number;
  warnings: string[];
  suggestions: CvExtractionSuggestions;
  reviewFields: CvReviewField[];
};

// Section headers in real CVs rarely appear as the exact bare word: they show up with leading
// numbering ("1. Experiencia laboral"), trailing colons/punctuation, or extra words tacked on
// ("EXPERIENCIA LABORAL Y PROYECTOS"). A strict ^...$ match against only the known phrases missed
// most of these and silently fell back to a much less precise date-scan across the whole CV,
// which is the single biggest cause of "empresa"/section fields coming back empty. These now
// tolerate optional leading list markers and trailing decoration/extra words on the same line.
const SECTION_PREFIX = '^\\s*(?:\\d+[.)]\\s*)?';
// Bounded to a short trailing phrase (e.g. "Y PROYECTOS:") — unbounded would let a long sentence
// that merely starts with "Experiencia" (not a header at all) false-match as a section title.
// The trailing punctuation class is repeated at the very end too, since a decorated header
// commonly ends with its own colon/dash AFTER the extra words ("...Y PROYECTOS:"), not only
// right after the core phrase.
const SECTION_SUFFIX = '\\s*[:.\\-–—]*\\s*[a-záéíóúñ\\s]{0,25}[:.\\-–—]*$';

const EXPERIENCE_SECTION = new RegExp(
  SECTION_PREFIX +
    '(experiencia\\s*(laboral|profesional)?|trayectoria\\s*profesional|historial\\s*laboral|work\\s*experience|employment\\s*history|experiencia|antecedentes\\s*laborales|experiencia\\s*relevante|experiencia\\s*comercial)' +
    SECTION_SUFFIX,
  'i',
);

const EDUCATION_SECTION = new RegExp(
  SECTION_PREFIX +
    '(formaci[oó]n\\s*(acad[eé]mica)?|educaci[oó]n|estudios|education|academic\\s*background)' +
    SECTION_SUFFIX,
  'i',
);

const LANGUAGE_SECTION = new RegExp(
  SECTION_PREFIX + '(idiomas?|languages?|idiomas\\s*y\\s*habilidades)' + SECTION_SUFFIX,
  'i',
);

const CONTACT_SECTION = new RegExp(
  SECTION_PREFIX +
    '(datos\\s*personales|informaci[oó]n\\s*personal|contacto|contact|perfil\\s*profesional|resumen\\s*profesional)' +
    SECTION_SUFFIX,
  'i',
);

const SECTION_STOP =
  /^(experiencia|trayectoria|historial|formaci[oó]n|educaci[oó]n|estudios|idiomas?|habilidades|competencias|referencias|certificaciones|logros|resumen|perfil|contacto|datos\s*personales)/i;

const JOB_TITLE_HINT =
  /^(ejecutivo|ejecutiva|gerente|director|directora|coordinador|coordinadora|asesor|asesora|consultor|consultora|representante|vendedor|vendedora|analista|profesional|especialista|l[ií]der|jefe|subgerente|comercial|sales|account|business)/i;

const COMPANY_HINT =
  /\b(s\.?a\.?s?\.?|s\.?a\.?|ltda|inc|corp|group|colombia|holding|cia|compañ[ií]a|empresa|bank|banco|solutions|technologies|tech)\b/i;

function looksLikeDescription(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.length > 90) return true;
  if (
    /^(responsable|encargad|l[ií]der|gesti[oó]n|desarroll|implement|coordin|administr|asegur|logr|definir|ejecutar|liderar)/i.test(
      t,
    )
  ) {
    return true;
  }
  if ((t.match(/[.!?]/g) ?? []).length >= 1 && t.length > 45) return true;
  if (t.split(/\s+/).length > 12) return true;
  return false;
}

function looksLikeJobTitle(text: string): boolean {
  const t = text.trim();
  if (!t || looksLikeDescription(t) || t.length > 70) return false;
  if (JOB_TITLE_HINT.test(t)) return true;
  return t.split(/\s+/).length <= 6 && !/[,;]/.test(t);
}

function looksLikeCompany(text: string): boolean {
  const t = text.trim();
  if (!t || looksLikeDescription(t)) return false;
  if (COMPANY_HINT.test(t)) return true;
  return t.length <= 55 && t.split(/\s+/).length <= 7 && !looksLikeJobTitle(t);
}

export function normalizeWorkHistoryEntry(entry: WorkHistoryEntry): WorkHistoryEntry {
  let cargo = entry.cargo?.trim() ?? '';
  let empresa = entry.empresa?.trim() ?? '';
  let descripcion = entry.descripcion?.trim() ?? '';

  if (looksLikeDescription(cargo)) {
    if (!descripcion) descripcion = cargo;
    cargo = '';
  }

  if (!empresa && cargo) {
    const atMatch = cargo.match(/^(.+?)\s+(?:en|at|@)\s+(.+)$/i);
    if (atMatch) {
      const maybeCargo = atMatch[1].trim();
      const maybeEmpresa = atMatch[2].trim();
      if (looksLikeJobTitle(maybeCargo) || maybeCargo.split(/\s+/).length <= 6) {
        cargo = maybeCargo;
        empresa = maybeEmpresa;
      }
    }
  }

  if (!cargo && empresa && looksLikeJobTitle(empresa) && !looksLikeCompany(empresa)) {
    cargo = empresa;
    empresa = '';
  }

  if (empresa && looksLikeDescription(empresa)) {
    if (!descripcion) descripcion = empresa;
    empresa = '';
  }

  descripcion = formatWorkDescription(descripcion);

  return { ...entry, cargo, empresa, descripcion };
}

export function normalizeWorkHistory(entries: WorkHistoryEntry[]): WorkHistoryEntry[] {
  return dedupeWorkEntries(entries.map(normalizeWorkHistoryEntry));
}

function normalizeWorkText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function workEntriesMatch(a: WorkHistoryEntry, b: WorkHistoryEntry): boolean {
  const cargoA = normalizeWorkText(a.cargo ?? '');
  const cargoB = normalizeWorkText(b.cargo ?? '');
  const empA = normalizeWorkText(a.empresa ?? '');
  const empB = normalizeWorkText(b.empresa ?? '');

  if (cargoA && cargoB && empA && empB && cargoA === cargoB && empA === empB) {
    return true;
  }

  if (empA && empB && empA === empB && a.fechaInicio && b.fechaInicio && a.fechaInicio === b.fechaInicio) {
    return true;
  }

  const descA = normalizeWorkText(a.descripcion ?? '').slice(0, 120);
  const descB = normalizeWorkText(b.descripcion ?? '').slice(0, 120);
  if (descA.length >= 40 && descA === descB) {
    return true;
  }

  return false;
}

function mergeWorkEntries(base: WorkHistoryEntry, incoming: WorkHistoryEntry): WorkHistoryEntry {
  const descripcion =
    (base.descripcion?.length ?? 0) >= (incoming.descripcion?.length ?? 0)
      ? base.descripcion
      : incoming.descripcion;

  return normalizeWorkHistoryEntry({
    ...base,
    cargo: base.cargo?.trim() || incoming.cargo?.trim() || '',
    empresa: base.empresa?.trim() || incoming.empresa?.trim() || '',
    fechaInicio: base.fechaInicio || incoming.fechaInicio || '',
    fechaFin: base.fechaFin || incoming.fechaFin,
    trabajoActual: Boolean(base.trabajoActual || incoming.trabajoActual),
    descripcion: descripcion ?? '',
  });
}

function isNoiseWorkLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^[•\-*●○▪·]\s*$/.test(trimmed)) return true;
  if (/^(responsabilidades|funciones|logros|principales\s+logros|actividades)\s*:?\s*$/i.test(trimmed)) {
    return true;
  }
  return false;
}

const DATE_RANGE =
  /(?:(0?[1-9]|1[0-2])[\/\-.](\d{4})|(\d{4})[\/\-.](0?[1-9]|1[0-2]))\s*(?:[-–—a]\s*|to\s+|hasta\s+)(?:(0?[1-9]|1[0-2])[\/\-.](\d{4})|(\d{4})[\/\-.](0?[1-9]|1[0-2])|actual(?:idad)?|presente?|hoy|current|al\s+presente)/i;

const YEAR_ONLY_RANGE =
  /(\d{4})\s*[-–—]\s*(\d{4}|actual(?:idad)?|presente?|hoy|current|al\s+presente)/i;

const SPANISH_MONTH_RANGE =
  /\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)\.?\s+(\d{4})\s*(?:[-–—a]|to|hasta)\s*(?:(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)\.?\s+(\d{4})|(actual(?:idad)?|presente?|hoy|current|al\s+presente))/i;

function cleanPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+57')) return digits;
  if (digits.length === 10 && digits.startsWith('3')) return digits;
  if (digits.length === 12 && digits.startsWith('57')) return `+${digits}`;
  return raw.trim();
}

function extractEmail(text: string): string | undefined {
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (!matches?.length) return undefined;

  const filtered = matches
    .map((m) => m.toLowerCase())
    .filter((m) => !/(noreply|no-reply|example\.com|correo\.com|test@test)/.test(m));

  return (filtered[0] ?? matches[0])?.toLowerCase();
}

function extractPhone(text: string): string | undefined {
  const labeled = text.match(
    /(?:tel[eé]fono|tel\.?|m[oó]vil|cel(?:ular)?|phone|whatsapp|wa)\s*[:\-]?\s*([+\d\s().-]{8,20})/i,
  );
  if (labeled?.[1]) {
    const cleaned = cleanPhone(labeled[1]);
    if (cleaned.replace(/\D/g, '').length >= 10) return cleaned;
  }

  const patterns = [
    /(?:\+57\s*)?(?:\(\d{1,3}\)\s*)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/,
    /\+57\s*\d{10}/,
    /\b3\d{9}\b/,
    // International / non-Colombian formats: +<country code> followed by 7-12 digits, allowing
    // spaces, dots or dashes as separators (e.g. "+1 555-234-1289", "+34 611 22 33 44").
    /\+\d{1,3}[\s.-]?(?:\d[\s.-]?){7,12}\d/,
    // Local number with a parenthesized area code, e.g. "(601) 234 5678".
    /\(\d{2,4}\)\s*\d{3,4}[\s.-]?\d{3,4}/,
    // Generic three-group local numbers without a country code, e.g. "601-234-5678".
    /\b\d{3}[\s.-]\d{3,4}[\s.-]\d{3,4}\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const cleaned = cleanPhone(match[0]);
      if (cleaned.replace(/\D/g, '').length >= 7) return cleaned;
    }
  }
  return undefined;
}

function extractCity(text: string): string | undefined {
  // Normalize the haystack once (accent-insensitive) and match each city with word boundaries \u2014
  // plain substring containment let short names like "Cali" match inside unrelated words
  // ("calidad", "calificado"), returning a wrong city for CVs that never mention one.
  const lowerNormalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  for (const city of COLOMBIAN_CITIES) {
    if (city === 'Otra') continue;
    const normalized = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const boundary = new RegExp(`\\b${normalized}\\b`, 'i');
    if (boundary.test(lowerNormalized)) return city;
  }

  const labeled = text.match(
    /(?:ciudad|ubicaci[oó]n|location|residencia)\s*[:\-]\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,40})/i,
  );
  if (labeled?.[1]) {
    const value = labeled[1].split(/[,|•\n]/)[0]?.trim();
    if (value && value.length >= 3) return value;
  }
  return undefined;
}

function extractName(text: string, email?: string): string | undefined {
  // Prefer the very top of the CV — real names almost always sit in the first few lines.
  // Scanning too deep into experience/description text produces false positives like
  // "Gestion De Cartera." from bullet lines.
  const headerLines = toLineArray(text.slice(0, 1200)).slice(0, 8);
  const skip =
    /^(curriculum|hoja\s+de\s+vida|cv|resume|perfil|contacto|datos\s+personales|email|correo|tel[eé]fono|linkedin|portafolio|resumen|experiencia|formaci[oó]n|educaci[oó]n|idiomas?)/i;
  const notAName =
    /^(responsable|encargad|l[ií]der|gesti[oó]n|desarroll|implement|coordin|administr|asegur|logr|definir|ejecutar|liderar|apoyo|apoyar|manejo|ventas|pipeline)/i;

  for (const line of headerLines) {
    if (skip.test(line)) continue;
    if (notAName.test(line)) continue;
    if (/@|https?:\/\//i.test(line)) continue;
    if (/\d{3,}/.test(line)) continue;
    if (/[|•·]/.test(line)) continue;
    if (/\.$/.test(line.trim())) continue; // sentences / descriptions, not names
    if (DATE_RANGE.test(line) || YEAR_ONLY_RANGE.test(line) || SPANISH_MONTH_RANGE.test(line)) continue;
    if (JOB_TITLE_HINT.test(line) && line.split(/\s+/).length <= 6) continue;
    if (SECTION_STOP.test(line) && line.length < 40) continue;
    if (looksLikeDescription(line)) continue;

    // Strip separators that often stick to the name line ("Juan Pérez -", "Ana,")
    const cleaned = line.replace(/[,;:]+$/g, '').replace(/\s+[-–—|].*$/, '').trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    const NAME_WORD = /^[A-Za-zÁÉÍÓÚáéíóúñÑ']+([.-][A-Za-zÁÉÍÓÚáéíóúñÑ']+)*\.?$/;
    if (words.length >= 2 && words.length <= 5 && words.every((w) => NAME_WORD.test(w))) {
      // Reject if every word is a common verb/noun start of a bullet (already partially covered).
      return words
        .map((w) => w.replace(/\.$/, ''))
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  if (email) {
    const local = email.split('@')[0];
    const guess = local
      .replace(/\d+/g, '')
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter((p) => p.length > 1)
      .slice(0, 3)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    if (guess.split(' ').length >= 2) return guess;
  }

  return undefined;
}

function extractContactFields(text: string) {
  const header = text.slice(0, 2800);
  const email = extractEmail(header) ?? extractEmail(text);
  const telefono = extractPhone(header) ?? extractPhone(text);
  const ciudad = extractCity(header) ?? extractCity(text);
  const nombre = extractName(header, email) ?? extractName(text, email);
  return { nombre, email, telefono, ciudad };
}

function parseMonthYear(month?: string, year?: string, altYear?: string, altMonth?: string): string {
  const y = year ?? altYear;
  const m = month ?? altMonth;
  if (!y) return '';
  const yearNum = Number(y);
  if (yearNum < 1970 || yearNum > 2100) return '';
  if (!m) return `${yearNum}-01`;
  const monthNum = Number(m);
  if (monthNum < 1 || monthNum > 12) return `${yearNum}-01`;
  return `${yearNum}-${String(monthNum).padStart(2, '0')}`;
}

// Matches the "current job" tail of DATE_RANGE (which has no capture group of its own for it),
// so we can detect it from the end of the whole match instead of passing the whole range string
// to isCurrentDateToken (which expects just the token, e.g. "presente", and never matches a
// full range like "03/2021 - Presente").
const CURRENT_DATE_TAIL = /(?:actual(?:idad)?|presente?|hoy|current|al\s+presente)\s*$/i;

function parseDateRange(line: string): { start: string; end?: string; current: boolean } | null {
  const full = line.match(DATE_RANGE);
  if (full) {
    const current = CURRENT_DATE_TAIL.test(full[0]);
    const start = parseMonthYear(full[1], full[2], full[3], full[4]);
    let end: string | undefined;
    if (!current) {
      end = parseMonthYear(full[5], full[6], full[7], full[8]);
    }
    if (start) return { start, end, current };
  }

  const spanish = line.match(SPANISH_MONTH_RANGE);
  if (spanish) {
    const startMonth = parseSpanishMonthToken(spanish[1]);
    const startYear = spanish[2];
    const endMonthToken = spanish[3];
    const endYear = spanish[4];
    const currentToken = spanish[5];
    const current = Boolean(currentToken && isCurrentDateToken(currentToken));
    if (!startMonth) return null;
    const start = `${startYear}-${startMonth}`;
    let end: string | undefined;
    if (!current && endMonthToken) {
      const endMonth = parseSpanishMonthToken(endMonthToken);
      if (endMonth) end = `${endYear ?? startYear}-${endMonth}`;
    }
    return { start, end, current };
  }

  const years = line.match(YEAR_ONLY_RANGE);
  if (years) {
    const current = isCurrentDateToken(years[2]);
    const start = `${years[1]}-01`;
    const end = current ? undefined : `${years[2]}-12`;
    return { start, end, current };
  }

  const since = line.match(/\b(?:desde|from)\s+(\d{4})\b/i);
  if (since) {
    const current = /actual|presente?|current/i.test(line);
    return { start: `${since[1]}-01`, end: current ? undefined : undefined, current };
  }

  return null;
}

function stripDateTokens(line: string): string {
  return line
    .replace(DATE_RANGE, '')
    .replace(SPANISH_MONTH_RANGE, '')
    .replace(YEAR_ONLY_RANGE, '')
    .replace(/\b(?:desde|from)\s+\d{4}\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRoleCompanyLine(line: string): { cargo?: string; empresa?: string } {
  const cleaned = stripDateTokens(line);
  if (!cleaned || cleaned.length < 3) return {};

  const atMatch = cleaned.match(/^(.+?)\s+(?:en|at|@)\s+(.+)$/i);
  if (atMatch) {
    return { cargo: atMatch[1].trim(), empresa: atMatch[2].trim() };
  }

  const pipeParts = cleaned.split(/\s*[|•/]\s*/).filter(Boolean);
  if (pipeParts.length >= 2) {
    return { cargo: pipeParts[0].trim(), empresa: pipeParts[1].trim() };
  }

  const dashParts = cleaned.split(/\s+[-–—]\s+/).filter(Boolean);
  if (dashParts.length === 2 && dashParts[0].length < 60 && dashParts[1].length < 60) {
    const aLooksTitle = looksLikeJobTitle(dashParts[0]);
    const bLooksCompany = looksLikeCompany(dashParts[1]);
    if (aLooksTitle && bLooksCompany) {
      return { cargo: dashParts[0].trim(), empresa: dashParts[1].trim() };
    }
    if (looksLikeCompany(dashParts[0]) && looksLikeJobTitle(dashParts[1])) {
      return { empresa: dashParts[0].trim(), cargo: dashParts[1].trim() };
    }
    if (aLooksTitle) {
      return { cargo: dashParts[0].trim(), empresa: dashParts[1].trim() };
    }
    return { empresa: dashParts[0].trim(), cargo: dashParts[1].trim() };
  }

  if (looksLikeDescription(cleaned)) return {};
  if (looksLikeJobTitle(cleaned)) return { cargo: cleaned };
  if (looksLikeCompany(cleaned)) return { empresa: cleaned };
  if (cleaned.length <= 50) return { cargo: cleaned };

  return {};
}

function inferRoleLevel(text: string): string | undefined {
  const lower = text.toLowerCase();
  const recent = lower.slice(0, 3500);
  const rules: Array<[RegExp, string]> = [
    [/gerente\s+general|vp\s+comercial|vicepresidente\s+comercial/, 'Gerente General comercial'],
    [/\bdirector(a)?\b.*comercial|commercial\s+director|sales\s+director/, 'Director'],
    [/\b(jefe|gerente)\b.*comercial|sales\s+manager|regional\s+manager/, 'Jefe o Gerente'],
    [/\bcoordinador(a)?\b.*comercial|sales\s+coordinator/, 'Coordinador'],
    [
      /\b(ejecutivo|ejecutiva|representante|asesor|asesora|account\s+executive|sales\s+rep|business\s+development)\b/,
      'Ejecutivo comercial',
    ],
  ];

  for (const [pattern, level] of rules) {
    if (pattern.test(recent) && (ROLE_LEVEL_OPTIONS as readonly string[]).includes(level)) {
      return level;
    }
  }
  return undefined;
}

function inferEducationLevel(line: string): string {
  const lower = line.toLowerCase();
  if (/doctorado|ph\.?\s*d/i.test(lower)) return 'Doctorado';
  if (/maestr[ií]a|mba|master/i.test(lower)) return 'Maestría';
  if (/especializaci[oó]n|postgrado/i.test(lower)) return 'Especialización';
  if (/tecn[oó]logo/i.test(lower)) return 'Tecnólogo';
  if (/t[eé]cnico/i.test(lower)) return 'Técnico';
  if (/bachiller|secundaria/i.test(lower)) return 'Bachillerato';
  return 'Profesional';
}

function mapLanguageName(raw: string): string | undefined {
  const lower = raw.toLowerCase();
  const map: Record<string, string> = {
    español: 'Español',
    spanish: 'Español',
    ingles: 'Inglés',
    inglés: 'Inglés',
    english: 'Inglés',
    portugues: 'Portugués',
    portugués: 'Portugués',
    frances: 'Francés',
    francés: 'Francés',
    french: 'Francés',
    aleman: 'Alemán',
    alemán: 'Alemán',
    german: 'Alemán',
    italiano: 'Italiano',
    italian: 'Italiano',
    mandarin: 'Mandarín',
    mandarín: 'Mandarín',
    chino: 'Mandarín',
    chinese: 'Mandarín',
    hindi: 'Hindi',
    bengali: 'Bengalí',
    bengalí: 'Bengalí',
    ruso: 'Ruso',
    russian: 'Ruso',
    japones: 'Japonés',
    japonés: 'Japonés',
    japanese: 'Japonés',
    coreano: 'Coreano',
    korean: 'Coreano',
    vietnamita: 'Vietnamita',
    vietnamese: 'Vietnamita',
    turco: 'Turco',
    turkish: 'Turco',
    arabe: 'Árabe',
    árabe: 'Árabe',
    arabic: 'Árabe',
    persa: 'Persa',
    farsi: 'Persa',
    urdu: 'Urdu',
    indonesio: 'Indonesio',
    indonesian: 'Indonesio',
    tailandes: 'Tailandés',
    tailandés: 'Tailandés',
    thai: 'Tailandés',
    neerlandes: 'Neerlandés',
    neerlandés: 'Neerlandés',
    holandes: 'Neerlandés',
    holandés: 'Neerlandés',
    dutch: 'Neerlandés',
  };
  for (const [key, value] of Object.entries(map)) {
    if (lower.includes(key)) return value;
  }
  return undefined;
}

function mapLanguageLevel(raw: string): string {
  const upper = raw.toUpperCase();
  for (const level of LANGUAGE_LEVEL_OPTIONS) {
    if (upper.includes(level.toUpperCase())) return level;
  }
  const lower = raw.toLowerCase();
  if (/nativo|native|materna/i.test(lower)) return 'Nativo';
  if (/avanzado|advanced|fluido|fluent/i.test(lower)) return 'C1';
  if (/intermedio|intermediate/i.test(lower)) return 'B1';
  if (/b[aá]sico|basic/i.test(lower)) return 'A2';
  return 'B1';
}

function findSectionIndex(lines: string[], matcher: RegExp): number {
  return lines.findIndex((line) => matcher.test(line.trim()));
}

function sliceSection(lines: string[], start: number, end: number): string[] {
  if (start < 0) return [];
  return lines.slice(start + 1, end >= 0 ? end : undefined).map((l) => l.trim()).filter(Boolean);
}

function assignPreDateLines(entry: Partial<WorkHistoryEntry>, buffer: string[]) {
  const lines = buffer.map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return;

  if (lines.length >= 2) {
    const first = lines[lines.length - 2];
    const second = lines[lines.length - 1];

    // Either line can itself be a combined "Cargo - Empresa" / "Cargo en Empresa" string (common
    // when a CV puts role and company on one line, then the date range on the next). Split it
    // before falling back to whole-line heuristics below — otherwise the entire line lands in
    // "cargo" and "empresa" is silently left empty.
    const secondSplit = parseRoleCompanyLine(second);
    if (secondSplit.cargo && secondSplit.empresa) {
      if (!entry.cargo) entry.cargo = secondSplit.cargo;
      if (!entry.empresa) entry.empresa = secondSplit.empresa;
      return;
    }

    if (!entry.cargo && looksLikeJobTitle(first)) entry.cargo = first;
    if (!entry.empresa) entry.empresa = second;
    if (!entry.cargo && looksLikeJobTitle(second) && looksLikeCompany(first)) {
      entry.cargo = second;
      entry.empresa = first;
    }
    return;
  }

  const only = lines[0];
  const split = parseRoleCompanyLine(only);
  if (split.cargo && split.empresa) {
    entry.cargo = split.cargo;
    entry.empresa = split.empresa;
  } else if (looksLikeJobTitle(only)) entry.cargo = only;
  else if (looksLikeCompany(only)) entry.empresa = only;
  else entry.cargo = only;
}

function extractWorkHistory(lines: string[]): WorkHistoryEntry[] {
  const expStart = findSectionIndex(lines, EXPERIENCE_SECTION);
  const eduStart = findSectionIndex(lines, EDUCATION_SECTION);
  const langStart = findSectionIndex(lines, LANGUAGE_SECTION);
  const contactStart = findSectionIndex(lines, CONTACT_SECTION);

  const sectionEnds = [eduStart, langStart, contactStart].filter((i) => i >= 0);
  const sectionEnd = sectionEnds.length ? Math.min(...sectionEnds) : -1;
  let sectionLines =
    expStart >= 0
      ? sliceSection(lines, expStart, sectionEnd)
      : lines.filter((l) => DATE_RANGE.test(l) || YEAR_ONLY_RANGE.test(l) || SPANISH_MONTH_RANGE.test(l));

  if (sectionLines.length === 0) {
    sectionLines = lines.filter(
      (l, idx) =>
        idx > 3 &&
        (DATE_RANGE.test(l) || YEAR_ONLY_RANGE.test(l) || SPANISH_MONTH_RANGE.test(l) || JOB_TITLE_HINT.test(l)),
    );
  }

  const entries: WorkHistoryEntry[] = [];
  let current: Partial<WorkHistoryEntry> | null = null;
  const descLines: string[] = [];
  const preDateBuffer: string[] = [];
  let linesSinceDate = 0;

  const flush = () => {
    if (!current) return;
    const entry = newWorkHistoryEntry();
    entry.cargo = String(current.cargo ?? '').trim();
    entry.empresa = String(current.empresa ?? '').trim();
    entry.sector = String(current.sector ?? '').trim();
    entry.fechaInicio = current.fechaInicio ?? '';
    entry.fechaFin = current.fechaFin;
    entry.trabajoActual = Boolean(current.trabajoActual);
    entry.descripcion = formatWorkDescription(descLines.join('\n'), 1200);
    const normalized = normalizeWorkHistoryEntry(entry);
    if (
      normalized.cargo ||
      normalized.empresa ||
      normalized.fechaInicio ||
      normalized.descripcion
    ) {
      entries.push(normalized);
    }
    current = null;
    descLines.length = 0;
    linesSinceDate = 0;
  };

  for (const line of sectionLines) {
    if (isNoiseWorkLine(line)) continue;
    if (SECTION_STOP.test(line) && line.length < 50) continue;

    const dates = parseDateRange(line);
    if (dates) {
      flush();

      const last = entries[entries.length - 1];
      const pending = {
        ...newWorkHistoryEntry(),
        fechaInicio: dates.start,
        fechaFin: dates.end,
        trabajoActual: dates.current,
      };
      assignPreDateLines(pending, preDateBuffer);
      const roleCompany = parseRoleCompanyLine(line);
      if (roleCompany.cargo && !pending.cargo) pending.cargo = roleCompany.cargo;
      if (roleCompany.empresa && !pending.empresa) pending.empresa = roleCompany.empresa;

      if (last && workEntriesMatch(last, pending)) {
        entries[entries.length - 1] = mergeWorkEntries(last, pending);
        preDateBuffer.length = 0;
        current = null;
        continue;
      }

      current = {
        fechaInicio: dates.start,
        fechaFin: dates.end,
        trabajoActual: dates.current,
        cargo: pending.cargo,
        empresa: pending.empresa,
      };
      preDateBuffer.length = 0;
      linesSinceDate = 0;
      continue;
    }

    if (!current) {
      preDateBuffer.push(line);
      if (preDateBuffer.length > 3) preDateBuffer.shift();
      continue;
    }

    if (descLines.length > 0 && looksLikeJobTitle(line)) {
      flush();
      preDateBuffer.push(line);
      continue;
    }

    linesSinceDate += 1;

    const roleCompany = parseRoleCompanyLine(line);
    if (!current.cargo && roleCompany.cargo && looksLikeJobTitle(roleCompany.cargo)) {
      current.cargo = roleCompany.cargo;
      if (roleCompany.empresa) current.empresa = roleCompany.empresa;
      continue;
    }
    if (!current.empresa && roleCompany.empresa && linesSinceDate <= 2) {
      current.empresa = roleCompany.empresa;
      continue;
    }

    if (linesSinceDate === 1 && !current.empresa && line.length < 80 && looksLikeCompany(line)) {
      current.empresa = line;
      continue;
    }

    if (linesSinceDate <= 2 && !current.cargo && looksLikeJobTitle(line)) {
      current.cargo = line;
      continue;
    }

    if (linesSinceDate <= 2 && !current.empresa && looksLikeCompany(line)) {
      current.empresa = line;
      continue;
    }

    if (looksLikeDescription(line) || line.length > 40) {
      descLines.push(line);
      continue;
    }

    if (linesSinceDate <= 1 && !current.cargo && line.length < 80) {
      current.cargo = line;
      continue;
    }

    descLines.push(line);
  }

  flush();
  return normalizeWorkHistory(entries).slice(0, 8);
}

function dedupeWorkEntries(entries: WorkHistoryEntry[]): WorkHistoryEntry[] {
  const result: WorkHistoryEntry[] = [];

  for (const entry of entries) {
    const duplicateIdx = result.findIndex((existing) => workEntriesMatch(existing, entry));
    if (duplicateIdx >= 0) {
      result[duplicateIdx] = mergeWorkEntries(result[duplicateIdx], entry);
    } else {
      result.push(entry);
    }
  }

  return result;
}

function looksLikeInstitution(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  return /^(pontificia\s+)?(universidad|instituto|polit[eé]cnico|escuela|facultad|colegio|sena|university|college)\b/i.test(
    t,
  );
}

function isRecognizedEducationalInstitution(text: string): boolean {
  const t = text.trim();
  if (!t || isCertificationLine(t)) return false;
  if (/coursera|udemy|platzi|edx|linkedin|hubspot|google\s/i.test(t)) return false;
  return looksLikeInstitution(t) || /\b(sena|colegio)\b/i.test(t);
}

function isOnlyEducationLevel(text: string): boolean {
  const lower = text.trim().toLowerCase();
  return (EDUCATION_LEVEL_OPTIONS as readonly string[]).some((level) => level.toLowerCase() === lower);
}

function isCertificationLine(text: string): boolean {
  return /coursera|udemy|platzi|edx|linkedin\s+learning|google\s+(data|ads|analytics)|hubspot|certificaci[oó]n|diplomado\s+en|curso\s+de|nanodegree/i.test(
    text,
  );
}

function parseEducationLine(line: string): {
  titulo?: string;
  institucion?: string;
  anioGraduacion?: string;
} {
  const cleaned = line.trim();
  if (!cleaned || cleaned.length < 4) return {};

  // Prefer the end year of a range ("2012 - 2016" → graduation 2016).
  const yearRange = cleaned.match(/\b((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2})\b/);
  const yearMatch = yearRange ?? cleaned.match(/\b((?:19|20)\d{2})\b/);
  const anioGraduacion = yearRange ? yearRange[2] : yearMatch?.[1];
  let text = cleaned
    .replace(/\b(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|actual(?:idad)?|presente?|hoy|current)\b/gi, '')
    .replace(/\b(?:19|20)\d{2}\b/g, '')
    .replace(/[,\-|•]\s*$/g, '')
    .trim();

  if (isCertificationLine(text) || isOnlyEducationLevel(text)) {
    return anioGraduacion ? { anioGraduacion } : {};
  }

  if (looksLikeInstitution(text) && !/\s+en\s+/i.test(text)) {
    return { institucion: text, anioGraduacion };
  }

  const pipeParts = text.split(/\s*[|•/]\s*/).filter(Boolean);
  if (pipeParts.length >= 2) {
    const a = pipeParts[0].trim();
    const b = pipeParts[1].trim();
    if (looksLikeInstitution(b)) return { titulo: a, institucion: b, anioGraduacion };
    if (looksLikeInstitution(a)) return { titulo: b, institucion: a, anioGraduacion };
    return { titulo: a, institucion: b, anioGraduacion };
  }

  const instEnd = text.match(
    /^(.+?)\s+((?:pontificia\s+)?universidad|instituto|polit[eé]cnico|escuela|facultad|university|college|sena)\s+(.+)$/i,
  );
  if (instEnd) {
    return {
      titulo: instEnd[1].replace(/[,\-|•]\s*$/g, '').trim(),
      institucion: `${instEnd[2]} ${instEnd[3]}`.trim(),
      anioGraduacion,
    };
  }

  if (looksLikeInstitution(text)) return { institucion: text, anioGraduacion };

  const degreeMatch = text.match(
    /^(profesional|tecn[oó]logo|t[eé]cnico|especialista|magister|maestr[ií]a|pregrado|bachiller)\b/i,
  );
  if (degreeMatch) return { titulo: text, anioGraduacion };

  return { titulo: text, anioGraduacion };
}

export function normalizeEducationEntry(entry: EducationEntry): EducationEntry {
  let titulo = entry.titulo?.trim() ?? '';
  let institucion = entry.institucion?.trim() ?? '';
  let nivel = entry.nivel?.trim() ?? '';
  let anioGraduacion = entry.anioGraduacion?.trim();

  if (titulo && looksLikeInstitution(titulo) && !institucion) {
    institucion = titulo;
    titulo = '';
  }

  if (titulo && !institucion) {
    const split = parseEducationLine(titulo);
    if (split.titulo) titulo = split.titulo;
    if (split.institucion) institucion = split.institucion;
    if (split.anioGraduacion && !anioGraduacion) anioGraduacion = split.anioGraduacion;
  }

  if (titulo && institucion) {
    const instLower = institucion.toLowerCase();
    if (titulo.toLowerCase() === instLower) titulo = '';
    else if (titulo.toLowerCase().includes(instLower)) {
      titulo = titulo.replace(new RegExp(institucion, 'i'), '').replace(/^[\s,\-|•]+|[\s,\-|•]+$/g, '').trim();
    }
  }

  if (!nivel && titulo) nivel = inferEducationLevel(titulo);

  return { ...entry, titulo, institucion, nivel, anioGraduacion };
}

function isValidEducationEntry(entry: EducationEntry): boolean {
  const titulo = entry.titulo?.trim() ?? '';
  const institucion = entry.institucion?.trim() ?? '';
  if (!institucion || !isRecognizedEducationalInstitution(institucion)) return false;
  if (isCertificationLine(`${titulo} ${institucion}`)) return false;
  if (titulo && isOnlyEducationLevel(titulo)) return false;
  return true;
}

function educationEntriesMatch(a: EducationEntry, b: EducationEntry): boolean {
  const tituloA = a.titulo.trim().toLowerCase();
  const tituloB = b.titulo.trim().toLowerCase();
  const instA = a.institucion.trim().toLowerCase();
  const instB = b.institucion.trim().toLowerCase();

  if (tituloA && tituloB && tituloA === tituloB) {
    return !instA || !instB || instA === instB || instA.includes(instB) || instB.includes(instA);
  }

  if (tituloA && tituloB && (tituloA.includes(tituloB) || tituloB.includes(tituloA))) {
    return instA === instB || !instA || !instB;
  }

  if (instA && instB && instA === instB && !tituloA && !tituloB) return true;

  return false;
}

function mergeEducationEntries(base: EducationEntry, incoming: EducationEntry): EducationEntry {
  return normalizeEducationEntry({
    ...base,
    titulo: base.titulo.trim() || incoming.titulo.trim(),
    institucion: base.institucion.trim() || incoming.institucion.trim(),
    nivel: base.nivel.trim() || incoming.nivel.trim(),
    anioGraduacion: base.anioGraduacion?.trim() || incoming.anioGraduacion?.trim(),
  });
}

export function normalizeEducation(entries: EducationEntry[]): EducationEntry[] {
  return dedupeEducation(entries.map(normalizeEducationEntry).filter(isValidEducationEntry));
}

function extractEducation(lines: string[]): EducationEntry[] {
  const eduStart = findSectionIndex(lines, EDUCATION_SECTION);
  const langStart = findSectionIndex(lines, LANGUAGE_SECTION);
  const expStart = findSectionIndex(lines, EXPERIENCE_SECTION);

  const endCandidates = [langStart, expStart].filter((i) => i >= 0 && i > eduStart);
  const sectionEnd = endCandidates.length ? Math.min(...endCandidates) : -1;
  const sectionLines = eduStart >= 0 ? sliceSection(lines, eduStart, sectionEnd) : [];

  const entries: EducationEntry[] = [];
  let current: Partial<EducationEntry> | null = null;

  const flush = () => {
    if (!current) return;
    const entry = normalizeEducationEntry({
      ...newEducationEntry(),
      ...current,
    });
    if (isValidEducationEntry(entry)) entries.push(entry);
    current = null;
  };

  for (const line of sectionLines) {
    if (line.length < 4 || (SECTION_STOP.test(line) && line.length < 50)) continue;
    if (isCertificationLine(line)) {
      flush();
      continue;
    }

    const yearOnly = line.match(/^\s*((?:19|20)\d{2})\s*$/);
    if (yearOnly) {
      if (current) current.anioGraduacion = yearOnly[1];
      continue;
    }

    const parsed = parseEducationLine(line);

    if (parsed.titulo && parsed.institucion) {
      flush();
      current = {
        titulo: parsed.titulo,
        institucion: parsed.institucion,
        nivel: inferEducationLevel(parsed.titulo),
        anioGraduacion: parsed.anioGraduacion,
      };
      flush();
      continue;
    }

    if (parsed.institucion && !parsed.titulo) {
      if (current?.institucion) flush();
      if (!current) current = {};
      current.institucion = parsed.institucion;
      if (parsed.anioGraduacion) current.anioGraduacion = parsed.anioGraduacion;
      continue;
    }

    if (parsed.titulo) {
      if (current?.titulo && current?.institucion) flush();
      if (current?.titulo && !current.institucion) {
        current = null;
      }
      if (!current) current = {};
      current.titulo = parsed.titulo;
      current.nivel = inferEducationLevel(parsed.titulo);
      if (parsed.anioGraduacion) current.anioGraduacion = parsed.anioGraduacion;
      continue;
    }

    if (parsed.anioGraduacion && current) {
      current.anioGraduacion = parsed.anioGraduacion;
    }
  }

  flush();
  return normalizeEducation(entries).slice(0, 5);
}

function dedupeEducation(entries: EducationEntry[]): EducationEntry[] {
  const result: EducationEntry[] = [];

  for (const entry of entries) {
    const duplicateIdx = result.findIndex((existing) => educationEntriesMatch(existing, entry));
    if (duplicateIdx >= 0) {
      result[duplicateIdx] = mergeEducationEntries(result[duplicateIdx], entry);
    } else {
      result.push(entry);
    }
  }

  return result;
}

function extractLanguages(lines: string[]): LanguageEntry[] {
  const langStart = findSectionIndex(lines, LANGUAGE_SECTION);
  const sectionLines = langStart >= 0 ? sliceSection(lines, langStart, -1) : [];

  const entries: LanguageEntry[] = [];
  const seen = new Set<string>();

  for (const line of sectionLines) {
    const name = mapLanguageName(line);
    if (!name || seen.has(name)) continue;
    if (!(LANGUAGE_OPTIONS as readonly string[]).includes(name)) continue;
    const entry = newLanguageEntry();
    entry.idioma = name;
    entry.nivel = mapLanguageLevel(line);
    entries.push(entry);
    seen.add(name);
  }

  if (entries.length === 0) {
    const fullText = lines.join('\n');
    for (const lang of LANGUAGE_OPTIONS) {
      if (lang === 'Otro') continue;
      if (new RegExp(lang, 'i').test(fullText) && !seen.has(lang)) {
        const entry = newLanguageEntry();
        entry.idioma = lang;
        entry.nivel = mapLanguageLevel(fullText);
        entries.push(entry);
        seen.add(lang);
      }
    }
  }

  return entries.slice(0, 4);
}

function estimateYears(work: WorkHistoryEntry[]): string | undefined {
  if (work.length === 0) return undefined;
  const starts = work
    .map((w) => w.fechaInicio)
    .filter((d) => /^\d{4}-\d{2}$/.test(d))
    .map((d) => Number(d.slice(0, 4)));
  if (!starts.length) return undefined;
  const earliest = Math.min(...starts);
  const years = new Date().getFullYear() - earliest;
  if (years < 0 || years > 45) return undefined;
  return String(Math.max(1, years));
}

type ProfileFieldOverlap = {
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  anios?: string | number;
  nivelRol?: string;
  historialLaboral?: WorkHistoryEntry[];
  formacion?: EducationEntry[];
  idiomas?: LanguageEntry[];
};

function buildReviewFields(
  suggestions: CvExtractionSuggestions,
  existing?: ProfileFieldOverlap,
): CvReviewField[] {
  const fields: CvReviewField[] = [];

  type ScalarKey = 'nombre' | 'email' | 'telefono' | 'ciudad' | 'anios' | 'nivelRol';
  const scalar: Array<{ key: ScalarKey; label: string }> = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'anios', label: 'Años de experiencia' },
    { key: 'nivelRol', label: 'Nivel de rol sugerido' },
  ];

  for (const { key, label } of scalar) {
    const value = suggestions[key];
    if (typeof value !== 'string' || !value.trim()) continue;
    const hasExisting = Boolean(existing?.[key]);
    fields.push({
      key,
      label,
      preview: value,
      confidence: key === 'email' || key === 'telefono' ? 'high' : 'medium',
      defaultSelected: !hasExisting,
    });
  }

  if (suggestions.historialLaboral?.length) {
    const preview = suggestions.historialLaboral
      .slice(0, 2)
      .map((w) => [w.cargo, w.empresa].filter(Boolean).join(' · '))
      .join(' | ');
    const hasExisting = (existing?.historialLaboral ?? []).some((e) => e.cargo || e.empresa);
    fields.push({
      key: 'historialLaboral',
      label: `Experiencia laboral (${suggestions.historialLaboral.length})`,
      preview,
      confidence: 'medium',
      defaultSelected: !hasExisting,
    });
  }

  if (suggestions.formacion?.length) {
    const preview = suggestions.formacion
      .slice(0, 2)
      .map((e) => e.titulo)
      .join(' | ');
    const hasExisting = (existing?.formacion ?? []).some((e) => e.titulo || e.institucion);
    fields.push({
      key: 'formacion',
      label: `Formación (${suggestions.formacion.length})`,
      preview,
      confidence: 'low',
      defaultSelected: !hasExisting,
    });
  }

  if (suggestions.idiomas?.length) {
    const preview = suggestions.idiomas.map((l) => `${l.idioma} (${l.nivel})`).join(', ');
    const hasExisting = (existing?.idiomas ?? []).some((e) => e.idioma);
    fields.push({
      key: 'idiomas',
      label: `Idiomas (${suggestions.idiomas.length})`,
      preview,
      confidence: 'medium',
      defaultSelected: !hasExisting,
    });
  }

  return fields;
}

export function alignCvReviewWithProfile(
  result: CvExtractionResult,
  profile: ProfileFieldOverlap,
): CvExtractionResult {
  return {
    ...result,
    reviewFields: buildReviewFields(result.suggestions, profile),
  };
}

export function extractCvFromText(text: string, fileName = 'cv.pdf'): CvExtractionResult {
  const normalized = normalizeCvText(text);
  const warnings: string[] = [];

  if (normalized.length < 80) {
    warnings.push('Poco texto legible en el archivo. Revisa que no sea solo una imagen escaneada.');
  }

  const lines = toLineArray(normalized);
  const contact = extractContactFields(normalized);
  const historialLaboral = extractWorkHistory(lines);
  const formacion = extractEducation(lines);
  const idiomas = extractLanguages(lines);
  const nivelRol = inferRoleLevel(normalized) ?? inferRoleLevel(historialLaboral[0]?.cargo ?? '');
  const anios = estimateYears(historialLaboral);
  const workCorpus = historialLaboral
    .map((e) => [e.cargo, e.empresa, e.descripcion].filter(Boolean).join(' '))
    .join('\n');
  const herramientas = suggestSkillsFromText(`${normalized}\n${workCorpus}`, 8);

  const suggestions: CvExtractionSuggestions = {
    nombre: contact.nombre,
    email: contact.email,
    telefono: contact.telefono,
    ciudad: contact.ciudad,
    anios,
    nivelRol,
    historialLaboral: historialLaboral.length ? historialLaboral : undefined,
    formacion: formacion.length ? formacion : undefined,
    idiomas: idiomas.length ? idiomas : undefined,
    herramientas: herramientas.length ? herramientas : undefined,
  };

  const reviewFields = buildReviewFields(suggestions);

  if (reviewFields.length === 0) {
    warnings.push('No encontramos campos claros para prellenar. Completa el formulario manualmente.');
  }

  return {
    fileName,
    textLength: normalized.length,
    warnings,
    suggestions,
    reviewFields,
  };
}

export function applyCvSuggestions(
  profile: {
    nombre?: string;
    email?: string;
    telefono?: string;
    ciudad?: string;
    anios?: string | number;
    nivelRol?: string;
    historialLaboral?: WorkHistoryEntry[];
    formacion?: EducationEntry[];
    idiomas?: LanguageEntry[];
  },
  suggestions: CvExtractionSuggestions,
  selectedKeys: string[],
): typeof profile {
  const next = { ...profile };
  const selected = new Set(selectedKeys);

  if (selected.has('nombre') && suggestions.nombre) next.nombre = suggestions.nombre;
  if (selected.has('email') && suggestions.email) next.email = suggestions.email;
  if (selected.has('telefono') && suggestions.telefono) next.telefono = suggestions.telefono;
  if (selected.has('ciudad') && suggestions.ciudad) next.ciudad = suggestions.ciudad;
  if (selected.has('anios') && suggestions.anios) next.anios = suggestions.anios;
  if (selected.has('nivelRol') && suggestions.nivelRol) next.nivelRol = suggestions.nivelRol;

  if (selected.has('historialLaboral') && suggestions.historialLaboral?.length) {
    next.historialLaboral = normalizeWorkHistory(suggestions.historialLaboral);
  }

  if (selected.has('formacion') && suggestions.formacion?.length) {
    next.formacion = normalizeEducation(suggestions.formacion);
  }

  if (selected.has('idiomas') && suggestions.idiomas?.length) {
    const existing = (next.idiomas ?? []).filter((e) => e.idioma?.trim());
    const existingNames = new Set(existing.map((e) => e.idioma));
    const merged = [
      ...existing,
      ...suggestions.idiomas.filter((l) => l.idioma && !existingNames.has(l.idioma)),
    ];
    next.idiomas = merged.length ? merged : suggestions.idiomas;
  }

  return next;
}
