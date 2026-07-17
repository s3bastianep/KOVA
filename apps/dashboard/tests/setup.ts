/**
 * Se ejecuta antes de importar cualquier módulo de la app en cada archivo de test.
 * Fuerza modo mock (sin Postgres) y define el JWT_SECRET que lib/auth exige al cargar.
 */
process.env.USE_MOCK = 'true';
process.env.JWT_SECRET = 'test-secret-only-for-vitest';
delete process.env.DATABASE_URL;
