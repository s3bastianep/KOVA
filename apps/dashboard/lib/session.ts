import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { isMockMode } from './mock';
import type { AuthUser } from './auth';

/**
 * Sesiones con refresh tokens reales:
 * - El refresh token es un valor opaco que viaja SOLO en una cookie HttpOnly
 *   (el JS del navegador no puede leerlo, así que un XSS no puede robarlo).
 * - En la base de datos se guarda únicamente su hash SHA-256; un dump de la
 *   tabla no sirve para falsificar sesiones.
 * - Cada uso rota el token (el anterior queda revocado) y logout / cambio de
 *   contraseña revocan de inmediato.
 * - En modo mock (sin DB) el refresh es un JWT firmado de 30 días, sin revocación.
 */

export const REFRESH_COOKIE = 'kova_refresh';
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días
const JWT_SECRET = process.env.JWT_SECRET as string; // auth.ts ya valida que exista

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export async function issueRefreshToken(user: AuthUser): Promise<string> {
  if (isMockMode()) {
    return jwt.sign(
      {
        type: 'refresh',
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        companyId: user.companyId ?? null,
        candidateId: user.candidateId ?? null,
      },
      JWT_SECRET,
      { expiresIn: '30d' },
    );
  }

  const raw = randomBytes(48).toString('base64url');
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: hashToken(raw),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });

  // Limpieza oportunista para que la tabla no crezca sin límite.
  prisma.refreshToken
    .deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } })
    .catch(() => undefined);

  return raw;
}

/**
 * Valida y rota un refresh token. Devuelve el usuario (releído de la DB, así
 * cuentas suspendidas dejan de renovarse) y el nuevo token, o null si el token
 * es inválido, expiró o fue revocado.
 */
export async function rotateRefreshToken(
  raw: string,
): Promise<{ user: AuthUser; refreshToken: string } | null> {
  if (isMockMode()) {
    try {
      const payload = jwt.verify(raw, JWT_SECRET) as {
        type?: string;
        sub: string;
        email: string;
        role: AuthUser['role'];
        tenantId: string;
        firstName?: string;
        lastName?: string;
        companyId?: string | null;
        candidateId?: string | null;
      };
      if (payload.type !== 'refresh') return null;
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        role: payload.role,
        tenantId: payload.tenantId,
        companyId: payload.companyId ?? null,
        candidateId: payload.candidateId ?? null,
      };
      return { user, refreshToken: raw };
    } catch {
      return null;
    }
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: hashToken(raw) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          tenantId: true,
          companyId: true,
          status: true,
          candidate: { select: { id: true } },
        },
      },
    },
  });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) return null;
  if (!stored.user || stored.user.status !== 'ACTIVE') return null;

  const user: AuthUser = {
    id: stored.user.id,
    email: stored.user.email,
    firstName: stored.user.firstName,
    lastName: stored.user.lastName,
    role: stored.user.role,
    tenantId: stored.user.tenantId,
    companyId: stored.user.companyId,
    candidateId: stored.user.candidate?.id ?? null,
  };

  // Rotación: el token usado queda revocado y se emite uno nuevo.
  const newRaw = randomBytes(48).toString('base64url');
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashToken(newRaw),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    }),
  ]);

  return { user, refreshToken: newRaw };
}

export async function revokeRefreshToken(raw: string): Promise<void> {
  if (isMockMode()) return;
  await prisma.refreshToken
    .updateMany({ where: { token: hashToken(raw) }, data: { revoked: true } })
    .catch(() => undefined);
}

/** Revoca TODAS las sesiones de un usuario (cambio de contraseña, suspensión). */
export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  if (isMockMode()) return;
  await prisma.refreshToken
    .updateMany({ where: { userId, revoked: false }, data: { revoked: true } })
    .catch(() => undefined);
}

export function readRefreshCookie(req: NextRequest): string | null {
  return req.cookies.get(REFRESH_COOKIE)?.value ?? null;
}

/** Set-Cookie para el refresh token: HttpOnly, solo rutas de auth, Secure en prod. */
export function refreshCookie(raw: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const maxAge = Math.floor(REFRESH_TTL_MS / 1000);
  return `${REFRESH_COOKIE}=${raw}; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearRefreshCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${REFRESH_COOKIE}=; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
