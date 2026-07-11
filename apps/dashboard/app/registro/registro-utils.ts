import type { CvExtractionResult } from '@/lib/cv-extract';
import { alignCvReviewWithProfile } from '@/lib/cv-extract';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';

export const REGISTRO_DRAFT_KEY = 'kova-registro-draft-v1';

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

