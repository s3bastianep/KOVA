import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { signToken } from '../../../../lib/auth';
import { getCandidateForUser } from '../../../../lib/candidate-auth';
import { isMockMode, MOCK_USER } from '../../../../lib/mock';

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
    if (String(email).toLowerCase() !== MOCK_USER.email || password !== DEMO_PASSWORD) {
      return Response.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
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
    const user = await prisma.user.findFirst({ where: { email: String(email).toLowerCase() } });
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
    if (String(email).toLowerCase() === MOCK_USER.email && password === DEMO_PASSWORD) {
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
        demoFallback: true,
      });
    }
    return Response.json(
      { message: 'Base de datos no disponible. Verifica DATABASE_URL en Railway o usa consultor@kova.co / Kova2026!' },
      { status: 503 },
    );
  }
}
