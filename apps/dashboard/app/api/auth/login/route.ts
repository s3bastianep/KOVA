import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { signToken } from '../../../../lib/auth';
import { getCandidateForUser } from '../../../../lib/candidate-auth';
import { isMockMode, MOCK_USER, getMockPortalCandidateByEmail, verifyMockPortalPassword } from '../../../../lib/mock';

export const dynamic = 'force-dynamic';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const DEMO_PASSWORD = 'Kova2026!';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return Response.json({ message: 'Correo y contraseña son obligatorios' }, { status: 400 });
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
      return Response.json({
        user: authUser,
        accessToken: signToken(authUser),
        refreshToken: randomBytes(32).toString('hex'),
      });
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
    return Response.json({
      user: authUser,
      accessToken: signToken(authUser),
      refreshToken: randomBytes(32).toString('hex'),
    });
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
      return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
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

    return Response.json({
      user: authUser,
      accessToken: signToken(authUser),
      refreshToken: randomBytes(32).toString('hex'),
    });
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
