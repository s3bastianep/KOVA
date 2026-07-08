const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  companyId?: string | null;
  candidateId?: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kova_access_token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const isAuthRequest = path.startsWith('/auth/login');

  if (res.status === 401 && typeof window !== 'undefined' && !isAuthRequest) {
    localStorage.removeItem('kova_access_token');
    localStorage.removeItem('kova_refresh_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Error en la solicitud (${res.status})`);
  }

  return res.json();
}

export const authApi = {
  login: (email: string, password: string, rememberMe?: boolean) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    }),
  candidateRegister: (body: {
    nombre: string;
    email: string;
    telefono: string;
    ciudad: string;
    password: string;
    consentimientoDatos: boolean;
  }) =>
    apiFetch<LoginResponse>('/auth/candidate/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: () => apiFetch<AuthUser>('/auth/me'),
  logout: (refreshToken?: string) =>
    apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

export type PortalDashboard = {
  greeting: string;
  profileCompleteness: number;
  stats: {
    vacantesRecomendadas: number;
    aplicacionesActivas: number;
    entrevistasProximas: number;
    hasCv: boolean;
  };
  nextSteps: Array<{ id: string; label: string; href: string; done: boolean }>;
};

export type PortalCvSummary = {
  fileName: string;
  importedAt: string | null;
  textLength: number | null;
};

export type PortalPerfilResponse = {
  candidateId: string;
  profile: Record<string, unknown>;
  cv: PortalCvSummary | null;
};

async function uploadPortalCv(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/portal/cv`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('kova_access_token');
    localStorage.removeItem('kova_refresh_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Error al subir (${res.status})`);
  }

  return res.json();
}

export type PortalVacancyListItem = {
  id: string;
  title: string;
  companyName: string;
  city: string | null;
  modality: string | null;
  compatibility: number;
  alreadyApplied: boolean;
};

export type PortalVacancyDetail = {
  id: string;
  title: string;
  companyName: string;
  city: string | null;
  modality: string | null;
  description: string | null;
  compatibility: number;
  alreadyApplied: boolean;
  application: { id: string; stage: string; score: number | null } | null;
  questions: Array<{
    id: string;
    label: string;
    category: string;
    inputType: 'select' | 'multiselect';
    options: string[];
    helpText?: string;
    maxSelections?: number;
    suggestedValue?: string;
  }>;
};

export type PortalApplication = {
  id: string;
  vacancyId: string;
  title: string;
  companyName: string;
  city: string | null;
  stage: string;
  stageLabel: string;
  compatibility: number;
  appliedAt: string;
  updatedAt: string;
  rejected: boolean;
  rejectReason: string | null;
};

export const portalApi = {
  dashboard: () => apiFetch<PortalDashboard>('/portal/dashboard'),
  perfil: () => apiFetch<PortalPerfilResponse>('/portal/perfil'),
  updatePerfil: (profile: Record<string, unknown>) =>
    apiFetch<{ ok: boolean; profile: Record<string, unknown>; message: string }>('/portal/perfil', {
      method: 'PATCH',
      body: JSON.stringify({ profile }),
    }),
  vacantes: (minMatch = 0) =>
    apiFetch<{ vacantes: PortalVacancyListItem[]; total: number }>(
      `/portal/vacantes${minMatch > 0 ? `?minMatch=${minMatch}` : ''}`,
    ),
  vacante: (id: string) => apiFetch<PortalVacancyDetail>(`/portal/vacantes/${id}`),
  aplicar: (id: string, answers?: Record<string, string | string[]>) =>
    apiFetch<{
      ok: boolean;
      compatibility: number;
      message: string;
      applicationId: string;
      stage: string;
      alreadyApplied?: boolean;
    }>(`/portal/vacantes/${id}/aplicar`, {
      method: 'POST',
      body: JSON.stringify({ answers: answers ?? {} }),
    }),
  aplicaciones: () =>
    apiFetch<{ aplicaciones: PortalApplication[]; total: number }>('/portal/aplicaciones'),
  uploadCv: uploadPortalCv,
  downloadCv: async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/portal/cv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? 'No pudimos descargar tu HV');
    }
    return res.blob();
  },
};

export const dashboardApi = {
  metrics: () => apiFetch<Record<string, unknown>>('/dashboard'),
  companies: () => apiFetch<unknown[]>('/empresas'),
  clients: () => apiFetch<unknown[]>('/clientes'),
  company: (id: string) => apiFetch<Record<string, unknown>>(`/empresas/${id}`),
  createCompany: (body: Record<string, unknown>) =>
    apiFetch<{ id: string; name: string }>('/empresas', { method: 'POST', body: JSON.stringify(body) }),
  updateCompany: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ id: string; name: string }>(`/empresas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  vacancies: () => apiFetch<unknown[]>('/vacantes'),
  createProcess: (body: Record<string, unknown>) =>
    apiFetch<{ ok: boolean; id: string }>('/procesos', { method: 'POST', body: JSON.stringify(body) }),
  vacancy: (id: string) => apiFetch<Record<string, unknown>>(`/vacantes/${id}`),
  vacancyMatches: (id: string, limit = 20) =>
    apiFetch<{ matches: unknown[]; total: number }>(`/vacantes/${id}/matches?limit=${limit}`),
  updateProcessCandidate: (
    vacancyId: string,
    candidateVacancyId: string,
    body: { action: 'advance' | 'move' | 'reject'; stage?: string; reason?: string },
  ) =>
    apiFetch<Record<string, unknown>>(`/vacantes/${vacancyId}/candidatos/${candidateVacancyId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  candidates: (vacancyId?: string) =>
    apiFetch<unknown[]>(`/candidatos${vacancyId ? `?vacancyId=${vacancyId}` : ''}`),
  searchCandidates: (params?: { q?: string; excludeVacancyId?: string; vacancyId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set('q', params.q);
    if (params?.excludeVacancyId) qs.set('excludeVacancyId', params.excludeVacancyId);
    if (params?.vacancyId) qs.set('vacancyId', params.vacancyId);
    const query = qs.toString();
    return apiFetch<unknown[]>(`/candidatos${query ? `?${query}` : ''}`);
  },
  createCandidate: (body: {
    vacancyId: string;
    firstName: string;
    lastName: string;
    existingCandidateId?: string;
    email?: string;
    phone?: string;
    city?: string;
    source?: string;
  }) => apiFetch<{ ok: boolean; id?: string; linked?: boolean; compatibility?: number }>('/candidatos', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  candidate: (id: string) => apiFetch<Record<string, unknown>>(`/candidatos/${id}`),
  discoveries: () => apiFetch<unknown[]>('/discovery'),
  tasks: () => apiFetch<unknown[]>('/tareas'),
  jobProfiles: () => apiFetch<unknown[]>('/perfiles'),
  interviews: () => apiFetch<unknown[]>('/entrevistas'),
  assessments: () => apiFetch<{ processes: unknown[]; totalTests: number }>('/evaluaciones'),
  finalists: () => apiFetch<Record<string, unknown>>('/finalistas'),
  onboarding: () => apiFetch<Record<string, unknown>>('/onboarding'),
  academia: () => apiFetch<unknown[]>('/academia'),
  crm: () => apiFetch<unknown[]>('/crm'),
  clientJourney: () => apiFetch<{ clients: unknown[] }>('/clientes-journey'),
  updateClientJourney: (companyId: string, body: { action: 'advance' | 'hold'; reason?: string }) =>
    apiFetch<{ ok: boolean; client: unknown }>('/clientes-journey', {
      method: 'PATCH',
      body: JSON.stringify({ companyId, ...body }),
    }),
  calendar: () => apiFetch<unknown[]>('/calendario'),
  agenda: (month: string) => apiFetch<{ month: string; items: unknown[] }>(`/agenda?month=${month}`),
  solicitudes: (status?: string) =>
    apiFetch<{ requests: unknown[] }>(`/solicitudes${status ? `?status=${status}` : ''}`),
  updateSolicitud: (
    id: string,
    body:
      | { action: 'accept'; reason?: string }
      | { action: 'reject'; reason: string }
      | { action: 'reschedule'; newDate: string; reason: string },
  ) =>
    apiFetch<{ ok: boolean; request?: unknown; item?: unknown }>(`/solicitudes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  createAgendaItem: (body: {
    title: string;
    type: string;
    scheduledAt: string;
    endAt?: string;
    companyName?: string;
    contactName?: string;
    location?: string;
    purpose?: string;
    notes?: string;
  }) =>
    apiFetch<{ ok: boolean; item: unknown }>('/agenda', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateAgendaItem: (
    itemKey: string,
    body: { action: 'status'; status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'; reason?: string } | { action: 'reschedule'; newDate: string; reason: string },
  ) =>
    apiFetch<{ ok: boolean; item: unknown }>(`/agenda/${encodeURIComponent(itemKey)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  documents: () => apiFetch<unknown[]>('/documentos'),
  reports: () => apiFetch<Record<string, unknown>>('/reportes'),
};

export function saveSession(data: LoginResponse) {
  localStorage.setItem('kova_access_token', data.accessToken);
  localStorage.setItem('kova_refresh_token', data.refreshToken);
  localStorage.setItem('kova_user', JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem('kova_access_token');
  localStorage.removeItem('kova_refresh_token');
  localStorage.removeItem('kova_user');
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('kova_user');
  return raw ? JSON.parse(raw) : null;
}
