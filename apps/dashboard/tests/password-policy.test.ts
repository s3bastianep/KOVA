import { describe, expect, it } from 'vitest';
import { passwordPolicyError } from '../lib/password';
import { POST as register } from '../app/api/auth/candidate/register/route';
import { jsonRequest, uniqueEmail } from './helpers';

describe('política de contraseñas (unidad)', () => {
  it('acepta una contraseña razonable', () => {
    expect(passwordPolicyError('correcto-caballo-bateria')).toBeNull();
  });

  it('rechaza contraseñas cortas', () => {
    expect(passwordPolicyError('abc123')).toContain('8 caracteres');
  });

  it('rechaza contraseñas comunes', () => {
    expect(passwordPolicyError('12345678')).toContain('común');
    expect(passwordPolicyError('password123')).toContain('común');
    expect(passwordPolicyError('Kova2026')).toContain('común');
  });

  it('rechaza un solo carácter repetido', () => {
    expect(passwordPolicyError('aaaaaaaa')).toContain('repetido');
  });

  it('rechaza la contraseña igual al correo', () => {
    expect(passwordPolicyError('ana.perez@mail.com', { email: 'ana.perez@mail.com' })).toContain('correo');
  });

  it('rechaza contraseñas de más de 128 caracteres', () => {
    expect(passwordPolicyError('x'.repeat(129))).toContain('demasiado larga');
  });
});

describe('política de contraseñas (registro)', () => {
  const base = () => ({
    nombre: 'Laura Ruiz',
    email: uniqueEmail('policy'),
    telefono: '3000000000',
    ciudad: '',
    consentimientoDatos: true,
  });

  it('el registro rechaza contraseñas comunes', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...base(), password: 'password123' }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('común');
  });

  it('el registro acepta una contraseña fuerte', async () => {
    const res = await register(
      jsonRequest('/api/auth/candidate/register', { ...base(), password: 'MiClaveLarga2026' }),
    );
    expect(res.status).toBe(200);
  });
});
