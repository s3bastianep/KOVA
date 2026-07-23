import {
  PORTAL_CACHE_KEYS,
  portalCacheDelete,
  portalCacheInvalidate,
  portalCacheSet,
  portalFetchCached,
} from './portal-cache';
import { clearOnboardingSession } from './portal-onboarding-session';

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
}

function clearAccessTokenStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kova_access_token');
  localStorage.removeItem('kova_refresh_token');
}

// Access token: cookie HttpOnly `lh_access`. Refresh: cookie HttpOnly `kova_refresh`.
// Cuando el access expira (401), pedimos uno nuevo a /auth/refresh (cookie) y reintentamos.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshAccessToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'same-origin',
        });
        if (!res.ok) return false;
        const data = (await res.json()) as { user?: AuthUser };
        if (data.user) localStorage.setItem('kova_user', JSON.stringify(data.user));
        clearAccessTokenStorage();
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 0, ...fetchOptions } = options;
  const controller = timeoutMs > 0 ? new AbortController() : null;
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      credentials: 'same-origin',
      signal: controller?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

  try {
    let res = await doFetch();

    const isAuthRequest = path.startsWith('/auth/login') || path.startsWith('/auth/candidate/register');

    if (res.status === 401 && typeof window !== 'undefined' && !isAuthRequest) {
      const refreshed = await tryRefreshAccessToken();
      if (refreshed) {
        res = await doFetch();
      }
      if (res.status === 401) {
        clearAccessTokenStorage();
        localStorage.removeItem('kova_user');
        window.location.href = loginPathForStoredUser();
        throw new Error('Unauthorized');
      }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Error en la solicitud (${res.status})`);
    }

    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
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
    ciudad?: string;
    password: string;
    consentimientoDatos: boolean;
  }) =>
    apiFetch<LoginResponse>('/auth/candidate/register', {
      method: 'POST',
      body: JSON.stringify(body),
      timeoutMs: 25_000,
    }),
  me: () => apiFetch<AuthUser>('/auth/me'),
  // El refresh token viaja en la cookie HttpOnly; el servidor lo revoca y limpia la cookie.
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
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
  profileGaps: Array<{ id: string; label: string; href: string }>;
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
  onboardingStep?: string;
  onboardingSubStep?: number;
  onboardingReviewed?: string[];
  onboardingComplete?: boolean;
  profileStatus?: string;
};

async function uploadPortalCv(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/portal/cv`, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    clearAccessTokenStorage();
    localStorage.removeItem('kova_user');
    window.location.href = loginPathForStoredUser();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Error al subir (${res.status})`);
  }

  const data = await res.json();
  portalCacheInvalidate('portal:');
  return data;
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
  questions: import('@/lib/portal-apply-questions').ApplyMatchQuestion[];
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
  dashboard: () =>
    portalFetchCached(PORTAL_CACHE_KEYS.dashboard, () => apiFetch<PortalDashboard>('/portal/dashboard')),
  perfil: () =>
    portalFetchCached(PORTAL_CACHE_KEYS.perfil, () => apiFetch<PortalPerfilResponse>('/portal/perfil')),
  perfilFresh: async () => {
    portalCacheDelete(PORTAL_CACHE_KEYS.perfil);
    const data = await apiFetch<PortalPerfilResponse>('/portal/perfil');
    portalCacheSet(PORTAL_CACHE_KEYS.perfil, data);
    return data;
  },
  updatePerfil: async (profile: Record<string, unknown>) => {
    const res = await apiFetch<{ ok: boolean; profile: Record<string, unknown>; message: string }>(
      '/portal/perfil',
      {
        method: 'PATCH',
        body: JSON.stringify({ profile }),
      },
    );
    portalCacheInvalidate('portal:');
    return res;
  },
  updateOnboarding: async (body: {
    profile?: Record<string, unknown>;
    onboardingStep?: string;
    onboardingSubStep?: number;
    onboardingReviewed?: string[];
    completeOnboarding?: boolean;
  }) => {
    const res = await apiFetch<{
      ok: boolean;
      profile: Record<string, unknown>;
      message: string;
      onboardingComplete?: boolean;
      onboardingStep?: string;
    }>('/portal/perfil', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    portalCacheInvalidate('portal:');
    return res;
  },
  vacantes: (minMatch = 0) =>
    portalFetchCached(PORTAL_CACHE_KEYS.vacantes(minMatch), () =>
      apiFetch<{ vacantes: PortalVacancyListItem[]; total: number }>(
        `/portal/vacantes${minMatch > 0 ? `?minMatch=${minMatch}` : ''}`,
      ),
    ),
  vacante: (id: string) =>
    portalFetchCached(PORTAL_CACHE_KEYS.vacante(id), () =>
      apiFetch<PortalVacancyDetail>(`/portal/vacantes/${id}`),
    ),
  aplicar: async (id: string, answers?: Record<string, string | string[]>) => {
    const res = await apiFetch<{
      ok: boolean;
      compatibility: number;
      message: string;
      applicationId: string;
      stage: string;
      alreadyApplied?: boolean;
    }>(`/portal/vacantes/${id}/aplicar`, {
      method: 'POST',
      body: JSON.stringify({ answers: answers ?? {} }),
    });
    portalCacheInvalidate('portal:');
    return res;
  },
  aplicaciones: () =>
    portalFetchCached(PORTAL_CACHE_KEYS.aplicaciones, () =>
      apiFetch<{ aplicaciones: PortalApplication[]; total: number }>('/portal/aplicaciones'),
    ),
  uploadCv: uploadPortalCv,
  pruebaStatus: () =>
    portalFetchCached(PORTAL_CACHE_KEYS.prueba, () =>
      apiFetch<{
        completed: boolean;
        completedAt?: string;
        totalPoints?: number;
      }>('/portal/prueba'),
    ),
  submitPrueba: async (result: unknown) => {
    const res = await apiFetch<{ ok: boolean; completed: boolean; completedAt: string; totalPoints: number }>(
      '/portal/prueba',
      {
        method: 'POST',
        body: JSON.stringify({ result }),
      },
    );
    portalCacheInvalidate(PORTAL_CACHE_KEYS.prueba);
    return res;
  },
  downloadCv: async () => {
    const res = await fetch(`${API_URL}/portal/cv`, {
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? 'No pudimos descargar tu HV');
    }
    return res.blob();
  },
  cuenta: () =>
    apiFetch<{
      email: string;
      firstName: string;
      lastName: string;
      nombre: string;
      profileHref: string;
    }>('/portal/cuenta'),
  updateCuenta: async (body: {
    action: 'email' | 'password';
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  }) => {
    const res = await apiFetch<{
      ok: boolean;
      action: 'email' | 'password';
      email?: string;
      message: string;
    }>('/portal/cuenta', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    portalCacheInvalidate('portal:');
    return res;
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
  exportExcel: async () => {
    const doFetch = () =>
      fetch(`${API_URL}/export/excel`, {
        credentials: 'same-origin',
      });
    let res = await doFetch();
    if (res.status === 401 && typeof window !== 'undefined') {
      const refreshed = await tryRefreshAccessToken();
      if (refreshed) res = await doFetch();
    }
    if (res.status === 401 && typeof window !== 'undefined') {
      clearAccessTokenStorage();
      localStorage.removeItem('kova_user');
      window.location.href = loginPathForStoredUser();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? 'No se pudo exportar a Excel');
    }
    return res.blob();
  },
};

export function saveSession(data: LoginResponse) {
  // Access/refresh viven en cookies HttpOnly; solo cacheamos el user para UI.
  clearAccessTokenStorage();
  localStorage.setItem('kova_user', JSON.stringify(data.user));
}

export function clearSession() {
  clearAccessTokenStorage();
  localStorage.removeItem('kova_user');
  if (typeof window !== 'undefined') {
    clearOnboardingSession();
    portalCacheInvalidate();
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('kova_user');
  return raw ? JSON.parse(raw) : null;
}

function loginPathForStoredUser() {
  const role = getStoredUser()?.role;
  return role === 'CANDIDATE' ? '/login' : '/acceso';
}
