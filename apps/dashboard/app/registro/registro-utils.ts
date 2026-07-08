import type { CvExtractionResult } from '@/lib/cv-extract';
import { alignCvReviewWithProfile } from '@/lib/cv-extract';
import {
  isEducationComplete,
  isEvidenceCardComplete,
  isLanguageComplete,
  isWorkHistoryComplete,
  type CommercialProfile,
  type WorkHistoryEntry,
} from '@/lib/candidate-commercial-profile';

export const REGISTRO_DRAFT_KEY = 'kova-registro-draft-v1';

const CRM_OTHER = 'Otro';

export type RegistroDraft = {
  profile: CommercialProfile;
  step: number;
  savedAt: string;
  candidateId?: string;
  resumeToken?: string;
  accountCreated?: boolean;
  cvImportPhase?: 'offer' | 'uploading' | 'review' | 'done' | 'skipped';
  cvSkippedOnce?: boolean;
};

export function slugifyField(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Normaliza entrada flexible (03/2020, 3-2020, 2020-03) a YYYY-MM. */
export function parseMonthYearInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return '';

  if (/^\d{4}-\d{2}$/.test(t)) {
    const [, month] = t.split('-');
    const m = Number(month);
    return m >= 1 && m <= 12 ? t : null;
  }

  const slash = t.match(/^(\d{1,2})\s*[/.-]\s*(\d{4})$/);
  if (slash) {
    const m = Number(slash[1]);
    const y = Number(slash[2]);
    if (m >= 1 && m <= 12 && y >= 1970 && y <= 2100) {
      return `${y}-${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  const reverse = t.match(/^(\d{4})\s*[/.-]\s*(\d{1,2})$/);
  if (reverse) {
    const y = Number(reverse[1]);
    const m = Number(reverse[2]);
    if (m >= 1 && m <= 12 && y >= 1970 && y <= 2100) {
      return `${y}-${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  return null;
}

export function formatMonthYearDisplay(value: string): string {
  if (!value) return '';
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-');
    return `${month}/${year}`;
  }
  return value;
}

export function saveRegistroDraft(draft: RegistroDraft) {
  try {
    localStorage.setItem(REGISTRO_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota / private mode */
  }
}

export function loadRegistroDraft(): RegistroDraft | null {
  try {
    const raw = localStorage.getItem(REGISTRO_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegistroDraft;
    if (!parsed?.profile || typeof parsed.step !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRegistroDraft() {
  try {
    localStorage.removeItem(REGISTRO_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export async function resumeRegistroSession(candidateId: string, resumeToken: string) {
  const params = new URLSearchParams({ candidateId, token: resumeToken });
  const res = await fetch(`/api/registro/resume?${params}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? 'No pudimos recuperar tu sesión.');
  return json as {
    profile: CommercialProfile;
    step: number;
    accountCreated: boolean;
    candidateId: string;
  };
}

export async function postRegistro(payload: Record<string, unknown>) {
  const res = await fetch('/api/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? 'Error al guardar');
  return json;
}

export async function uploadRegistroCv(
  file: File,
  candidateId?: string | null,
  resumeToken?: string | null,
): Promise<CvExtractionResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (candidateId) formData.append('candidateId', candidateId);
  if (resumeToken) formData.append('resumeToken', resumeToken);

  const res = await fetch('/api/registro/cv', {
    method: 'POST',
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? 'No pudimos leer tu PDF.');
  return json as CvExtractionResult;
}

export function enrichCvExtraction(result: CvExtractionResult, profile: CommercialProfile): CvExtractionResult {
  return alignCvReviewWithProfile(result, profile);
}

function workEntryBlockers(entry: WorkHistoryEntry, index: number): string[] {
  const prefix = `Experiencia ${index + 1}`;
  const blockers: string[] = [];
  if (!entry.cargo.trim()) blockers.push(`${prefix}: agrega el cargo`);
  if (!entry.empresa.trim()) blockers.push(`${prefix}: agrega la empresa`);
  if (!entry.sector.trim()) blockers.push(`${prefix}: selecciona el sector`);
  if (!entry.fechaInicio.trim()) blockers.push(`${prefix}: indica fecha de inicio (MM/AAAA)`);
  else if (!/^\d{4}-\d{2}$/.test(entry.fechaInicio)) {
    blockers.push(`${prefix}: fecha de inicio inválida (usa MM/AAAA)`);
  }
  if (!entry.trabajoActual) {
    if (!entry.fechaFin?.trim()) blockers.push(`${prefix}: indica fecha de fin o marca “Trabajo actual”`);
    else if (!/^\d{4}-\d{2}$/.test(entry.fechaFin)) {
      blockers.push(`${prefix}: fecha de fin inválida (usa MM/AAAA)`);
    }
  }
  if (!entry.descripcion.trim()) blockers.push(`${prefix}: describe brevemente tus funciones`);
  return blockers;
}

export function getStepBlockers(
  step: number,
  profile: CommercialProfile,
  completeHistorialCount: number,
  completeLogrosCount: number,
): string[] {
  if (step === 0) {
    const blockers: string[] = [];
    if (!profile.nombre?.trim()) blockers.push('Agrega tu nombre completo');
    if (!profile.ciudad?.trim()) blockers.push('Agrega tu ciudad');
    if (!profile.email?.trim()) blockers.push('Agrega tu correo');
    else if (!/.+@.+\..+/.test(profile.email)) blockers.push('Revisa el formato del correo');
    if (!profile.telefono?.trim()) blockers.push('Agrega tu teléfono');
    if (!profile.disponibilidad) blockers.push('Selecciona cuándo puedes empezar');
    if (!profile.disponibilidadViajar) blockers.push('Indica si puedes viajar');
    if (!profile.disponibilidadReubicacion) blockers.push('Indica si puedes cambiar de ciudad');
    if (!profile.consentimientoDatos) blockers.push('Acepta el uso de tus datos para continuar');
    return blockers;
  }

  if (step === 1) {
    const blockers: string[] = [];
    if (!profile.nivelRol) blockers.push('Selecciona tu nivel de rol');
    if (!profile.funcionPrincipal) blockers.push('Selecciona tu función principal');
    if (!profile.objetivoProfesional) blockers.push('Indica qué buscas en tu próximo reto');
    if (profile.tamanoEquipo == null || profile.tamanoEquipo === '') {
      blockers.push('Selecciona el tamaño de equipo que has liderado');
    }
    return blockers;
  }

  if (step === 2) {
    const entries = profile.historialLaboral ?? [];
    if (entries.length === 0) return ['Agrega al menos una experiencia laboral'];
    const blockers = entries.flatMap((entry, i) => workEntryBlockers(entry, i));
    if (completeHistorialCount < 1 && blockers.length === 0) {
      return ['Completa los campos obligatorios de al menos una experiencia'];
    }
    return blockers;
  }

  if (step === 3) {
    const blockers: string[] = [];
    const eduOk = (profile.formacion ?? []).some(isEducationComplete);
    const langOk = (profile.idiomas ?? []).some(isLanguageComplete);
    if (!eduOk) blockers.push('Agrega al menos una formación completa (nivel, título e institución)');
    if (!langOk) blockers.push('Agrega al menos un idioma con su nivel');
    if (!profile.expectativaSalarial) blockers.push('Selecciona tu rango salarial esperado');
    return blockers;
  }

  if (step === 4) {
    const blockers: string[] = [];
    const tickets = profile.tickets ?? [];
    if (!profile.tipoVenta) blockers.push('Selecciona el tipo de venta');
    if (!profile.naturaleza) blockers.push('Selecciona la naturaleza de la venta');
    if (!profile.enfoque) blockers.push('Selecciona tu enfoque (prospección o cuentas)');
    if (!profile.ciclo) blockers.push('Selecciona el ciclo de venta típico');
    if (tickets.length === 0) blockers.push('Selecciona al menos un ticket promedio');
    else if (tickets.length > 1 && !profile.ticketPrincipal) {
      blockers.push('Indica con qué ticket tienes mayor experiencia');
    }
    if (!profile.tipoCliente) blockers.push('Selecciona el tipo de cliente');
    if (!profile.nivelInterlocutor) blockers.push('Selecciona el nivel de interlocutor habitual');
    if (!profile.canalVenta) blockers.push('Selecciona el canal de venta');
    if (!profile.coberturaGeografica) blockers.push('Selecciona tu cobertura geográfica');
    if (!profile.cuentasCartera) blockers.push('Selecciona el número de cuentas en cartera');
    if (!profile.crmVentas) blockers.push('Selecciona el CRM que manejas');
    else if (profile.crmVentas === CRM_OTHER && !profile.crmVentasOtro?.trim()) {
      blockers.push('Especifica el nombre del CRM');
    }
    if (!profile.estructuraComision) blockers.push('Selecciona la estructura de comisión');
    return blockers;
  }

  if (step === 5) {
    const industries = profile.industrias ?? [];
    if (industries.length === 0) return ['Selecciona al menos una industria'];
    if (industries.length > 1 && !profile.industriaPrincipal) {
      return ['Indica cuál es tu industria principal'];
    }
    return [];
  }

  if (step === 6) {
    const cards = profile.logros ?? [];
    if (completeLogrosCount >= 1) return [];
    if (cards.length === 0) return ['Agrega al menos una tarjeta de evidencia'];
    const blockers: string[] = [];
    cards.forEach((card, i) => {
      if (isEvidenceCardComplete(card)) return;
      const n = i + 1;
      if (!card.titulo.trim()) blockers.push(`Logro ${n}: agrega un título`);
      if (!card.contexto.trim()) blockers.push(`Logro ${n}: agrega empresa o contexto`);
      if (!card.cifra.trim()) blockers.push(`Logro ${n}: agrega una cifra o resultado`);
      if (card.competencias.length === 0) blockers.push(`Logro ${n}: selecciona al menos una competencia`);
    });
    return blockers.length ? blockers : ['Completa al menos una tarjeta de evidencia'];
  }

  return [];
}
