import { describe, expect, it } from 'vitest';
import { POST as login } from '../app/api/auth/login/route';
import { jsonRequest, freshIp, uniqueEmail } from './helpers';

describe('POST /api/auth/login', () => {
  it('rechaza cuando faltan campos', async () => {
    const res = await login(jsonRequest('/api/auth/login', { email: 'a@b.co' }));
    expect(res.status).toBe(400);
  });

  it('rechaza credenciales incorrectas sin revelar si el correo existe', async () => {
    const res = await login(
      jsonRequest('/api/auth/login', { email: uniqueEmail('nadie'), password: 'incorrecta123' }),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toContain('Correo o contraseña incorrectos');
  });

  it('rechaza payloads con campos demasiado largos', async () => {
    const res = await login(
      jsonRequest('/api/auth/login', { email: 'a'.repeat(200), password: 'x'.repeat(200) }),
    );
    expect(res.status).toBe(401);
  });

  it('acepta credenciales válidas y emite access token + cookie de refresh HttpOnly', async () => {
    const res = await login(
      jsonRequest('/api/auth/login', { email: 'consultor@kova.co', password: 'Kova2026!' }),
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user.role).toBe('CONSULTANT');
    // El refresh token NUNCA debe venir en el body (iría a localStorage).
    expect(body.refreshToken).toBeUndefined();

    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toContain('kova_refresh=');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Path=/api/auth');
  });

  it('bloquea por cuenta tras 10 intentos aunque cambien de IP (fuerza bruta distribuida)', async () => {
    const email = uniqueEmail('victima');
    let lastStatus = 0;
    for (let i = 0; i < 11; i++) {
      const res = await login(
        jsonRequest('/api/auth/login', { email, password: 'adivinanza' }, { ip: freshIp() }),
      );
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });

  it('bloquea por IP tras 15 intentos aunque cambien de correo', async () => {
    const ip = freshIp();
    let lastStatus = 0;
    for (let i = 0; i < 16; i++) {
      const res = await login(
        jsonRequest('/api/auth/login', { email: uniqueEmail('rotando'), password: 'adivinanza' }, { ip }),
      );
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
