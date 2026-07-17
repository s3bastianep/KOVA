import { describe, expect, it, vi } from 'vitest';
import { getRecentRejectionCount, isKeyRateLimited } from '../lib/rate-limit';
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

  it('emite aviso [CAPACITY] tras muchos rechazos sostenidos', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    // 40 rechazos: una clave con límite 1, cada IP distinta se bloquea al 2º intento.
    for (let i = 0; i < 40; i++) {
      const key = `capacity-probe:${i}`;
      isKeyRateLimited(key, 1, 60_000); // permitido
      isKeyRateLimited(key, 1, 60_000); // rechazo
    }
    expect(getRecentRejectionCount()).toBeGreaterThanOrEqual(40);
    expect(warn.mock.calls.some((c) => String(c[0]).includes('[CAPACITY]'))).toBe(true);
    warn.mockRestore();
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
