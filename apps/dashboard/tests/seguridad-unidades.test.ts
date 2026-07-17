import { describe, expect, it } from 'vitest';
import { isKeyRateLimited } from '../lib/rate-limit';
import { isInternalRole } from '../lib/auth';
import { navItemsForRole } from '../lib/navigation';
import { refreshCookie, clearRefreshCookie } from '../lib/session';

describe('rate limiter', () => {
  it('permite hasta el límite y bloquea el siguiente', () => {
    const key = `test-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      expect(isKeyRateLimited(key, 3, 60_000)).toBe(false);
    }
    expect(isKeyRateLimited(key, 3, 60_000)).toBe(true);
  });

  it('claves distintas no se afectan entre sí', () => {
    const a = `test-a-${Date.now()}`;
    const b = `test-b-${Date.now()}`;
    expect(isKeyRateLimited(a, 1, 60_000)).toBe(false);
    expect(isKeyRateLimited(b, 1, 60_000)).toBe(false);
  });
});

describe('roles y permisos', () => {
  it('CLIENT no es rol interno', () => {
    expect(isInternalRole('CLIENT' as never)).toBe(false);
  });

  it('roles de staff sí son internos', () => {
    expect(isInternalRole('CONSULTANT' as never)).toBe(true);
    expect(isInternalRole('SUPER_ADMIN' as never)).toBe(true);
  });

  it('la navegación de CLIENT es un subconjunto restringido', () => {
    const clientNav = navItemsForRole('CLIENT');
    const fullNav = navItemsForRole('CONSULTANT');
    expect(clientNav.length).toBeLessThan(fullNav.length);
    // El CRM interno nunca debe aparecer para clientes (sí ven /candidatos,
    // pero el API se los filtra a los de sus propios procesos).
    const hrefs = clientNav.map((i) => i.href);
    expect(hrefs).not.toContain('/crm');
  });
});

describe('cookies de sesión', () => {
  it('el refresh token va en cookie HttpOnly limitada a /api/auth', () => {
    const cookie = refreshCookie('token-de-prueba');
    expect(cookie).toContain('kova_refresh=token-de-prueba');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Path=/api/auth');
    expect(cookie).toContain('SameSite=Lax');
  });

  it('el logout expira la cookie', () => {
    expect(clearRefreshCookie()).toContain('Max-Age=0');
  });
});
