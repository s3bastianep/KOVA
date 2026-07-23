/** Auth API helpers for landing SPA login/registro (proxied to dashboard Next). */

const API_URL = '/api';

export async function authFetch(path, options = {}) {
  const { timeoutMs = 0, headers, ...fetchOptions } = options;
  const controller = timeoutMs > 0 ? new AbortController() : null;
  const timer =
    controller && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      credentials: 'same-origin',
      signal: controller?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Error en la solicitud (${res.status})`);
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
  login: (email, password, rememberMe) =>
    authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    }),
  candidateRegister: (body) =>
    authFetch('/auth/candidate/register', {
      method: 'POST',
      body: JSON.stringify(body),
      timeoutMs: 25_000,
    }),
};

export function saveSession(data) {
  // Tokens en cookies HttpOnly; solo cache de user para UI.
  localStorage.removeItem('kova_access_token');
  localStorage.removeItem('kova_refresh_token');
  localStorage.setItem('kova_user', JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem('kova_access_token');
  localStorage.removeItem('kova_refresh_token');
  localStorage.removeItem('kova_user');
}
