import { describe, expect, it } from 'vitest';
import { POST as register } from '../app/api/auth/candidate/register/route';
import { jsonRequest, uniqueEmail } from './helpers';

const validBody = () => ({
  nombre: 'Ana María Pérez',
  email: uniqueEmail('candidata'),
  telefono: '3001234567',
  ciudad: 'Bogotá',
  password: 'Segura1234',
  consentimientoDatos: true,
});

describe('POST /api/auth/candidate/register', () => {
  it('crea la cuenta y devuelve sesión completa', async () => {
    const res = await register(jsonRequest('/api/auth/candidate/register', validBody()));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user.role).toBe('CANDIDATE');
    expect(res.headers.get('set-cookie')).toContain('kova_refresh=');
  });

  it('rechaza correo inválido', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...validBody(), email: 'no-es-correo' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza contraseña corta', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...validBody(), password: 'corta' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza sin consentimiento de datos', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...validBody(), consentimientoDatos: false }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza campos demasiado largos', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...validBody(), nombre: 'x'.repeat(500) }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza correo duplicado con 409', async () => {
    const body = validBody();
    const first = await register(jsonRequest('/api/auth/candidate/register', body));
    expect(first.status).toBe(200);

    const second = await register(jsonRequest('/api/auth/candidate/register', body));
    expect(second.status).toBe(409);
  });

  it('aplica rate limit por IP tras 5 registros seguidos', async () => {
    const ip = '10.99.99.99';
    let lastStatus = 0;
    for (let i = 0; i < 6; i++) {
      const res = await register(
        jsonRequest('/api/auth/candidate/register', validBody(), { ip }),
      );
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
