import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { signToken, type AuthUser } from '../../../../lib/auth';
import { issueRefreshToken, refreshCookie } from '../../../../lib/session';
import { getCandidateForUser } from '../../../../lib/candidate-auth';
import { isMockMode, MOCK_USER, getMockPortalCandidateByEmail, verifyMockPortalPassword } from '../../../../lib/mock';
import { isRateLimited, isKeyRateLimited, clientIp } from '../../../../lib/rate-limit';
import { logSecurityEvent } from '../../../../lib/security-log';
import { withApiErrors } from '../../../../lib/api-handler';

export const dynamic = 'force-dynamic';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const DEMO_PASSWORD = 'Kova2026!';

// Hash real generado al arrancar (contraseña aleatoria descartada) para gastar el mismo
// tiempo de bcrypt cuando el correo NO existe: sin esto, la respuesta rápida delata qué
// correos están registrados (enumeración por timing).
const DUMMY_HASH = bcrypt.hashSync(`dummy-${Date.now()}-${Math.random()}`, 12);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Espera creciente tras fallos: 0.5s, 1s, 2s, 4s (tope). Encarece el diccionario. */
function failureDelayMs(attempts: number) {
  return Math.min(500 * 2 ** Math.max(0, attempts - 1), 4000);
}

/** Sesión completa: access token en el body + refresh token en cookie HttpOnly. */
async function sessionResponse(authUser: AuthUser) {
  const refresh = await issueRefreshToken(authUser);
  return Response.json(
    { user: authUser, accessToken: signToken(authUser) },
    { headers: { 'Set-Cookie': refreshCookie(refresh) } },
  );
}

// El try/catch interno maneja la caída de la DB (503, fail closed); el wrapper
// cubre lo demás (p. ej. el camino mock), que antes quedaba sin red de seguridad.
export const POST = withApiErrors('auth/login', handlePOST);

async function handlePOST(req: NextRequest) {
  // Límite por IP además del bloqueo por cuenta: frena fuerza bruta distribuida
  // sobre muchas cuentas distintas desde una misma dirección.
  if (isRateLimited(req, 'login', 15, 60_000)) {
    logSecurityEvent('login_rate_limited', { ip: clientIp(req) });
    return Response.json(
      { message: 'Demasiados intentos. Espera un minuto e intenta de nuevo.' },
      { status: 429 },
    );
  }

  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return Response.json({ message: 'Correo y contraseña son obligatorios' }, { status: 400 });
  }

  if (
    typeof email !== 'string' || email.length > 160 ||
    typeof password !== 'string' || password.length > 128
  ) {
    return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
  }

  // Límite por CUENTA además del de IP: un ataque distribuido (muchas IPs contra el
  // mismo correo) también queda frenado. In-memory: suficiente como capa extra gratuita.
  if (isKeyRateLimited(`login-email:${String(email).toLowerCase()}`, 10, 60_000)) {
    logSecurityEvent('login_rate_limited', { email: String(email), ip: clientIp(req) });
    return Response.json(
      { message: 'Demasiados intentos para esta cuenta. Espera un minuto e intenta de nuevo.' },
      { status: 429 },
    );
  }

  if (isMockMode()) {
    const normalizedEmail = String(email).toLowerCase();
    const portalCandidate = getMockPortalCandidateByEmail(normalizedEmail);
    if (portalCandidate) {
      const valid = await verifyMockPortalPassword(portalCandidate, String(password));
      if (!valid) {
        return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
      }
      const authUser = {
        id: portalCandidate.userId,
        email: portalCandidate.email ?? normalizedEmail,
        firstName: portalCandidate.firstName,
        lastName: portalCandidate.lastName,
        role: 'CANDIDATE' as const,
        tenantId: portalCandidate.tenantId,
        companyId: null,
        candidateId: portalCandidate.id,
      };
      return sessionResponse(authUser);
    }

    if (normalizedEmail !== MOCK_USER.email || password !== DEMO_PASSWORD) {
      return Response.json(
        {
          message:
            'Correo o contraseña incorrectos. En modo demo solo funciona consultor@kova.co. Si eres candidato, regístrate en /registro.',
        },
        { status: 401 },
      );
    }
    const authUser = {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
      role: 'CONSULTANT' as const,
      tenantId: MOCK_USER.tenantId,
      companyId: MOCK_USER.companyId,
    };
    return sessionResponse(authUser);
  }

  try {
    // NOTE: not tenant-scoped — `User` is only unique per (tenantId, email), so if this product
    // ever onboards a second tenant, the same email in two tenants makes this pick an arbitrary
    // row. Today only one tenant ('kova') is ever created, so this is safe in practice; fixing it
    // properly requires deciding how a login request identifies its tenant (subdomain? a tenant
    // picker?), which is a product call, not something to guess here. `orderBy` at least makes
    // today's single-tenant case deterministic instead of query-planner-dependent.
    const user = await prisma.user.findFirst({
      where: { email: String(email).toLowerCase() },
      orderBy: { createdAt: 'asc' },
    });
    if (!user) {
      // Mismo costo de bcrypt que un intento real: la duración de la respuesta no
      // revela si el correo existe.
      await bcrypt.compare(password, DUMMY_HASH).catch(() => false);
      logSecurityEvent('login_failed', { email: String(email), ip: clientIp(req) });
      await sleep(failureDelayMs(1));
      return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      logSecurityEvent('login_locked', { email: user.email, ip: clientIp(req), userId: user.id });
      return Response.json(
        { message: 'Cuenta bloqueada temporalmente. Intente más tarde.' },
        { status: 403 },
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const attempts = user.failedAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: attempts,
          lockedUntil: attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : null,
        },
      });
      logSecurityEvent('login_failed', { email: user.email, ip: clientIp(req), userId: user.id });
      // Espera progresiva: cada fallo consecutivo responde más lento (0.5s → 4s),
      // lo que vuelve inviable probar un diccionario aun rotando IPs.
      await sleep(failureDelayMs(attempts));
      return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const authUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      companyId: user.companyId,
      ...(user.role === 'CANDIDATE'
        ? {
            candidateId: (await getCandidateForUser(user))?.id ?? null,
          }
        : {}),
    };

    return sessionResponse(authUser);
  } catch (err) {
    console.error('[auth/login] DB error:', err);
    // Fail closed: a DB outage must never hand out a valid session, even a "demo" one.
    // (Previously this fell back to a hardcoded consultor@kova.co/Kova2026! token in production.)
    return Response.json(
      { message: 'Base de datos no disponible. Intenta de nuevo en unos minutos.' },
      { status: 503 },
    );
  }
}
