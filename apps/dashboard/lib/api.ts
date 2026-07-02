const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  companyId?: string | null;
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

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('kova_access_token');
    localStorage.removeItem('kova_refresh_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error en la solicitud');
  }

  return res.json();
}

export const authApi = {
  login: (email: string, password: string, rememberMe?: boolean) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    }),
  me: () => apiFetch<AuthUser>('/auth/me'),
  logout: (refreshToken?: string) =>
    apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

export const dashboardApi = {
  metrics: () => apiFetch<Record<string, unknown>>('/dashboard'),
  companies: () => apiFetch<unknown[]>('/empresas'),
  vacancies: () => apiFetch<unknown[]>('/vacantes'),
  candidates: (vacancyId?: string) =>
    apiFetch<unknown[]>(`/candidatos${vacancyId ? `?vacancyId=${vacancyId}` : ''}`),
  discoveries: () => apiFetch<unknown[]>('/discovery'),
  tasks: () => apiFetch<unknown[]>('/tareas'),
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
