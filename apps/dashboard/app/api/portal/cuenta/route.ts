import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { handlePortalRoute } from '@/lib/portal-api';
import { revokeAllRefreshTokens } from '@/lib/session';
import { invalidateCandidateAuthCache } from '@/lib/candidate-auth';
import { invalidatePortalCandidateCaches } from '@/lib/portal-server-cache';
import {
  getMockPortalCandidate,
  getMockPortalCandidateByEmail,
  isMockMode,
  updateMockPortalEmail,
  updateMockPortalPassword,
  verifyMockPortalPassword,
} from '@/lib/mock';
import { profileFromCandidate } from '@/lib/portal-profile';
import { passwordPolicyError } from '@/lib/password';

export const dynamic = 'force-dynamic';

type CuentaBody = {
  action?: 'email' | 'password';
  currentPassword?: string;
  newEmail?: string;
  newPassword?: string;
};

function invalidate(userId: string, candidateId: string) {
  invalidatePortalCandidateCaches(candidateId);
  invalidateCandidateAuthCache(userId);
}

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const profile = profileFromCandidate(candidate);
      return Response.json({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        nombre: profile.nombre || `${user.firstName} ${user.lastName}`.trim(),
        profileHref: '/portal/perfil',
      });
    },
    'portal/cuenta',
  );
}

export async function PATCH(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const body = (await req.json().catch(() => ({}))) as CuentaBody;
      const action = body.action;
      const currentPassword = String(body.currentPassword ?? '');

      if (action !== 'email' && action !== 'password') {
        return Response.json({ message: 'Acción no válida' }, { status: 400 });
      }

      if (!currentPassword) {
        return Response.json({ message: 'Ingresa tu contraseña actual' }, { status: 400 });
      }

      if (isMockMode()) {
        const mock = getMockPortalCandidate(user.id);
        if (!mock) {
          return Response.json({ message: 'No encontramos tu cuenta' }, { status: 404 });
        }

        const ok = await verifyMockPortalPassword(mock, currentPassword);
        if (!ok) {
          return Response.json({ message: 'La contraseña actual no es correcta' }, { status: 401 });
        }

        if (action === 'email') {
          const newEmail = String(body.newEmail ?? '').trim().toLowerCase();
          if (!/.+@.+\..+/.test(newEmail)) {
            return Response.json({ message: 'Correo electrónico inválido' }, { status: 400 });
          }
          if (newEmail === mock.email?.trim().toLowerCase()) {
            return Response.json({ message: 'Ese ya es tu correo actual' }, { status: 400 });
          }
          const taken = getMockPortalCandidateByEmail(newEmail);
          if (taken && taken.userId !== user.id) {
            return Response.json({ message: 'Ese correo ya está en uso' }, { status: 409 });
          }
          updateMockPortalEmail(user.id, newEmail);
          invalidate(user.id, candidate.id);
          return Response.json({
            ok: true,
            action: 'email',
            email: newEmail,
            message: 'Correo actualizado',
          });
        }

        const newPassword = String(body.newPassword ?? '');
        const mockPolicyError = passwordPolicyError(newPassword, { email: mock.email ?? undefined });
        if (mockPolicyError) {
          return Response.json({ message: mockPolicyError }, { status: 400 });
        }
        await updateMockPortalPassword(user.id, newPassword);
        invalidate(user.id, candidate.id);
        return Response.json({
          ok: true,
          action: 'password',
          message: 'Contraseña actualizada',
        });
      }

      const dbUser = await prisma.user.findFirst({
        where: { id: user.id, tenantId: user.tenantId },
      });
      if (!dbUser) {
        return Response.json({ message: 'No encontramos tu cuenta' }, { status: 404 });
      }

      const passwordOk = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!passwordOk) {
        return Response.json({ message: 'La contraseña actual no es correcta' }, { status: 401 });
      }

      if (action === 'email') {
        const newEmail = String(body.newEmail ?? '').trim().toLowerCase();
        if (!/.+@.+\..+/.test(newEmail)) {
          return Response.json({ message: 'Correo electrónico inválido' }, { status: 400 });
        }
        if (newEmail === dbUser.email.trim().toLowerCase()) {
          return Response.json({ message: 'Ese ya es tu correo actual' }, { status: 400 });
        }

        const taken = await prisma.user.findFirst({
          where: { tenantId: user.tenantId, email: newEmail, NOT: { id: user.id } },
        });
        if (taken) {
          return Response.json({ message: 'Ese correo ya está en uso' }, { status: 409 });
        }

        const meta = (candidate.metadata ?? {}) as Record<string, unknown>;
        const commercial =
          meta.commercialProfile && typeof meta.commercialProfile === 'object'
            ? { ...(meta.commercialProfile as Record<string, unknown>), email: newEmail }
            : meta.commercialProfile;

        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail },
          }),
          prisma.candidate.update({
            where: { id: candidate.id },
            data: {
              email: newEmail,
              ...(commercial
                ? {
                    metadata: {
                      ...meta,
                      commercialProfile: commercial,
                    },
                  }
                : {}),
            },
          }),
        ]);

        invalidate(user.id, candidate.id);
        return Response.json({
          ok: true,
          action: 'email',
          email: newEmail,
          message: 'Correo actualizado',
        });
      }

      const newPassword = String(body.newPassword ?? '');
      const policyError = passwordPolicyError(newPassword, { email: dbUser.email });
      if (policyError) {
        return Response.json({ message: policyError }, { status: 400 });
      }
      if (await bcrypt.compare(newPassword, dbUser.passwordHash)) {
        return Response.json(
          { message: 'La nueva contraseña no puede ser igual a la actual.' },
          { status: 400 },
        );
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // Cerrar todas las sesiones abiertas: un token robado deja de servir al cambiar la clave.
      await revokeAllRefreshTokens(user.id);

      invalidate(user.id, candidate.id);
      return Response.json({
        ok: true,
        action: 'password',
        message: 'Contraseña actualizada',
      });
    },
    'portal/cuenta',
  );
}
