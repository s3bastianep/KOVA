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
import { type CvFileFormat, cvFormatLabel, detectCvFileFormat } from './cv-file-formats';
import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
};

export type CvExtractionResult = {
  fileName: string;
  textLength: number;
  warnings: string[];
  suggestions: CvExtractionSuggestions;
  reviewFields: CvReviewField[];
};

const COLOMBIAN_CITIES = [
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
];

const EXPERIENCE_SECTION =
  /^(experiencia\s*(laboral|profesional)?|trayectoria\s*profesional|historial\s*laboral|work\s*experience|employment\s*history|experiencia)$/i;

const EDUCATION_SECTION =
  /^(formaci[oó]n\s*(acad[eé]mica)?|educaci[oó]n|estudios|education|academic\s*background)$/i;

const LANGUAGE_SECTION = /^(idiomas?|languages?)$/i;

const DATE_RANGE =
  /(?:(0?[1-9]|1[0-2])[\/\-.](\d{4})|(\d{4})[\/\-.](0?[1-9]|1[0-2]))\s*(?:[-–—a]\s*|to\s+)(?:(0?[1-9]|1[0-2])[\/\-.](\d{4})|(\d{4})[\/\-.](0?[1-9]|1[0-2])|actual(?:idad)?|presente?|hoy|current)/i;

const YEAR_ONLY_RANGE = /(\d{4})\s*[-–—]\s*(\d{4}|actual(?:idad)?|presente?|hoy|current)/i;

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+57')) return digits;
  if (digits.length === 10 && digits.startsWith('3')) return digits;
  if (digits.length === 12 && digits.startsWith('57')) return `+${digits}`;
  return raw.trim();
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match?.[0]?.toLowerCase();
}

function extractPhone(text: string): string | undefined {
  const patterns = [
    /(?:\+57\s*)?(?:\(\d{1,3}\)\s*)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/,
    /\+57\s*\d{10}/,
    /3\d{9}/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return cleanPhone(match[0]);
  }
  return undefined;
}

function extractCity(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const city of COLOMBIAN_CITIES) {
    const normalized = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (lower.includes(normalized) || lower.includes(city.toLowerCase())) return city;
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
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && l.length < 60);

  const skip = /^(curriculum|hoja\s+de\s+vida|cv|resume|perfil|contacto|datos\s+personales|email|correo|tel[eé]fono)/i;

  for (const line of lines.slice(0, 8)) {
    if (skip.test(line)) continue;
    if (/@/.test(line)) continue;
    if (/\d{3,}/.test(line)) continue;
  if (DATE_RANGE.test(line) || YEAR_ONLY_RANGE.test(line)) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 5 && /^[A-Za-zÁÉÍÓÚáéíóúñÑ'.-]+$/.test(line)) {
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  if (email) {
    const local = email.split('@')[0];
    const guess = local
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

function parseDateRange(line: string): { start: string; end?: string; current: boolean } | null {
  const full = line.match(DATE_RANGE);
  if (full) {
    const current = /actual|presente?|hoy|current/i.test(full[0]);
    const start = parseMonthYear(full[1], full[2], full[3], full[4]);
    let end: string | undefined;
    if (!current) {
      end = parseMonthYear(full[5], full[6], full[7], full[8]);
    }
    if (start) return { start, end, current };
  }

  const years = line.match(YEAR_ONLY_RANGE);
  if (years) {
    const current = /actual|presente?|hoy|current/i.test(years[2]);
    const start = `${years[1]}-01`;
    const end = current ? undefined : `${years[2]}-12`;
    return { start, end, current };
  }

  return null;
}

function inferRoleLevel(text: string): string | undefined {
  const lower = text.toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/gerente\s+general|vp\s+comercial|vicepresidente\s+comercial/, 'Gerente General comercial'],
    [/\bdirector\b.*comercial|commercial\s+director/, 'Director'],
    [/\b(jefe|gerente)\b.*comercial|sales\s+manager/, 'Jefe o Gerente'],
    [/\bcoordinador\b.*comercial|coordinator/, 'Coordinador'],
    [/\b(ejecutivo|representante|asesor)\b.*comercial|account\s+executive|sales\s+rep/, 'Ejecutivo comercial'],
  ];

  for (const [pattern, level] of rules) {
    if (pattern.test(lower) && (ROLE_LEVEL_OPTIONS as readonly string[]).includes(level)) {
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
    aleman: 'Alemán',
    alemán: 'Alemán',
    italiano: 'Italiano',
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

function extractWorkHistory(lines: string[]): WorkHistoryEntry[] {
  const expStart = findSectionIndex(lines, EXPERIENCE_SECTION);
  const eduStart = findSectionIndex(lines, EDUCATION_SECTION);
  const langStart = findSectionIndex(lines, LANGUAGE_SECTION);

  const sectionEnds = [eduStart, langStart].filter((i) => i >= 0);
  const sectionEnd = sectionEnds.length ? Math.min(...sectionEnds) : -1;
  const sectionLines =
    expStart >= 0
      ? sliceSection(lines, expStart, sectionEnd)
      : lines.filter((l) => DATE_RANGE.test(l) || YEAR_ONLY_RANGE.test(l));

  const entries: WorkHistoryEntry[] = [];
  let current: Partial<WorkHistoryEntry> | null = null;
  const descLines: string[] = [];

  const flush = () => {
    if (!current) return;
    const entry = newWorkHistoryEntry();
    entry.cargo = String(current.cargo ?? '').trim();
    entry.empresa = String(current.empresa ?? '').trim();
    entry.sector = String(current.sector ?? '').trim();
    entry.fechaInicio = current.fechaInicio ?? '';
    entry.fechaFin = current.fechaFin;
    entry.trabajoActual = Boolean(current.trabajoActual);
    entry.descripcion = descLines.join(' ').trim().slice(0, 500);
    if (entry.cargo || entry.empresa) entries.push(entry);
    current = null;
    descLines.length = 0;
  };

  for (const line of sectionLines) {
    const dates = parseDateRange(line);
    if (dates) {
      flush();
      current = {
        fechaInicio: dates.start,
        fechaFin: dates.end,
        trabajoActual: dates.current,
      };

      const withoutDates = line.replace(DATE_RANGE, '').replace(YEAR_ONLY_RANGE, '').trim();
      const parts = withoutDates.split(/\s*[|•\-–—@]\s*/).filter(Boolean);
      if (parts.length >= 2) {
        current.cargo = parts[0];
        current.empresa = parts[1];
      } else if (parts.length === 1 && parts[0].length > 2) {
        current.cargo = parts[0];
      }
      continue;
    }

    if (!current) continue;

    if (!current.empresa && line.length < 80 && !/[.!?]{2,}/.test(line)) {
      if (!current.cargo) current.cargo = line;
      else if (!current.empresa) current.empresa = line;
      else descLines.push(line);
    } else {
      descLines.push(line);
    }
  }

  flush();
  return entries.slice(0, 6);
}

function extractEducation(lines: string[]): EducationEntry[] {
  const eduStart = findSectionIndex(lines, EDUCATION_SECTION);
  const langStart = findSectionIndex(lines, LANGUAGE_SECTION);
  const expStart = findSectionIndex(lines, EXPERIENCE_SECTION);

  const endCandidates = [langStart, expStart].filter((i) => i >= 0 && i > eduStart);
  const sectionEnd = endCandidates.length ? Math.min(...endCandidates) : -1;
  const sectionLines = eduStart >= 0 ? sliceSection(lines, eduStart, sectionEnd) : [];

  const entries: EducationEntry[] = [];

  for (const line of sectionLines) {
    if (line.length < 6) continue;
    const entry = newEducationEntry();
    entry.nivel = inferEducationLevel(line);
    entry.titulo = line.slice(0, 120);
    const instMatch = line.match(
      /(?:universidad|universidad|instituto|politécnico|politecnico|escuela|facultad)\s+[^,|•\n]{3,60}/i,
    );
    entry.institucion = instMatch?.[0]?.trim() ?? '';
    if (!entry.institucion && /universidad|ingenier[ií]a|administraci[oó]n|marketing|negocios/i.test(line)) {
      entry.institucion = line.slice(0, 80);
    }
    if (entry.titulo.trim()) entries.push(entry);
  }

  return entries.slice(0, 4);
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
    for (const lang of ['Inglés', 'Español', 'Portugués'] as const) {
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

  const scalar: Array<{ key: keyof CvExtractionSuggestions; label: string }> = [
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
  const normalized = normalizeText(text);
  const warnings: string[] = [];

  if (normalized.length < 80) {
    warnings.push('Poco texto legible en el PDF. Revisa que no sea solo una imagen escaneada.');
  }

  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);
  const email = extractEmail(normalized);
  const telefono = extractPhone(normalized);
  const ciudad = extractCity(normalized);
  const nombre = extractName(normalized, email);
  const historialLaboral = extractWorkHistory(lines);
  const formacion = extractEducation(lines);
  const idiomas = extractLanguages(lines);
  const nivelRol = inferRoleLevel(normalized);
  const anios = estimateYears(historialLaboral);

  const suggestions: CvExtractionSuggestions = {
    nombre,
    email,
    telefono,
    ciudad,
    anios,
    nivelRol,
    historialLaboral: historialLaboral.length ? historialLaboral : undefined,
    formacion: formacion.length ? formacion : undefined,
    idiomas: idiomas.length ? idiomas : undefined,
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

export class CvFileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CvFileReadError';
  }
}

/** @deprecated Usar CvFileReadError */
export const CvPdfReadError = CvFileReadError;

function assertReadableText(text: string, format: CvFileFormat): string {
  const trimmed = text.trim();
  if (trimmed.length < 40) {
    throw new CvFileReadError(
      `El ${cvFormatLabel(format)} tiene muy poco texto legible. Exporta tu hoja de vida con texto seleccionable (formato ATS).`,
    );
  }
  return trimmed;
}

export async function extractCvFromFileBuffer(
  buffer: Buffer,
  fileName: string,
  mime = '',
): Promise<{ result: CvExtractionResult; text: string; format: CvFileFormat }> {
  const format = detectCvFileFormat(fileName, mime);
  if (!format) {
    throw new CvFileReadError('Formato no soportado. Usa PDF, DOC o DOCX.');
  }

  if (format === 'pdf') {
    const parsed = await extractCvFromPdfBuffer(buffer, fileName);
    return { ...parsed, format };
  }
  if (format === 'docx') {
    const parsed = await extractCvFromDocxBuffer(buffer, fileName);
    return { ...parsed, format };
  }
  const parsed = await extractCvFromDocBuffer(buffer, fileName);
  return { ...parsed, format };
}

export async function extractCvFromDocxBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    throw new CvFileReadError('El archivo DOCX no parece válido. Guarda de nuevo desde Word como .docx.');
  }

  try {
    const mammoth = await import('mammoth');
    const { value } = await mammoth.extractRawText({ buffer });
    const text = assertReadableText(value ?? '', 'docx');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError('No pudimos leer el Word (.docx). Verifica que no esté dañado o protegido.');
  }
}

export async function extractCvFromDocBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  const tempPath = join(tmpdir(), `kova-cv-${randomUUID()}.doc`);
  try {
    await writeFile(tempPath, buffer);
    const WordExtractor = (await import('word-extractor')).default;
    const extractor = new WordExtractor();
    const doc = await extractor.extract(tempPath);
    const text = assertReadableText(doc.getBody() ?? '', 'doc');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError('No pudimos leer el Word (.doc). Prueba guardar el archivo como .docx o PDF.');
  } finally {
    await unlink(tempPath).catch(() => undefined);
  }
}

export async function extractCvFromPdfBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  if (buffer.length < 5 || buffer.subarray(0, 4).toString('utf8') !== '%PDF') {
    throw new CvFileReadError('El archivo no parece un PDF válido. Exporta tu HV como PDF desde Word o Google Docs.');
  }

  try {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const textResult = await parser.getText();
      const text = assertReadableText(textResult.text ?? '', 'pdf');
      return { result: extractCvFromText(text, fileName), text };
    } finally {
      await parser.destroy();
    }
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError(
      'No pudimos leer el PDF. Verifica que no esté protegido, dañado o guardado solo como imagen.',
    );
  }
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
    const existing = (next.historialLaboral ?? []).filter((e) => e.cargo?.trim() || e.empresa?.trim());
    next.historialLaboral =
      existing.length > 0 ? [...existing, ...suggestions.historialLaboral] : suggestions.historialLaboral;
  }

  if (selected.has('formacion') && suggestions.formacion?.length) {
    const existing = (next.formacion ?? []).filter((e) => e.titulo?.trim() || e.institucion?.trim());
    next.formacion = existing.length > 0 ? [...existing, ...suggestions.formacion] : suggestions.formacion;
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
