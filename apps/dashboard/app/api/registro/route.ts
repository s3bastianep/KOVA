import { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { type CommercialProfile } from '../../../lib/candidate-commercial-profile';
import { getPublicTenantId } from '../../../lib/public-tenant';
import { prisma } from '../../../lib/prisma';
import { isMockMode } from '../../../lib/mock';
import {
  buildCandidatePayload,
  isAccountProfileComplete,
  mergeRegistroMetadata,
  newResumeToken,
  readRegistroMetadata,
  splitProfileName,
} from '../../../lib/registro-session';
import { isRateLimited } from '../../../lib/rate-limit';

export const dynamic = 'force-dynamic';

type RegistroAction = 'account' | 'progress' | 'publish';

const ACTIONS: RegistroAction[] = ['account', 'progress', 'publish'];
// El perfil comercial es un objeto libre que se guarda en metadata; sin tope, un bot
// puede inflar la fila del candidato con megabytes de JSON.
const MAX_PROFILE_JSON = 20_000;

async function findCandidateBySession(tenantId: string, candidateId: string, resumeToken: string) {
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { id: true, metadata: true },
  });
  if (!candidate) return null;
  const meta = readRegistroMetadata(candidate.metadata);
  if (!meta.resumeToken || meta.resumeToken !== resumeToken) return null;
  return candidate;
}

export async function GET() {
  return Response.json({
    title: 'Constructor de Perfil Comercial',
    subtitle:
      'Crea tu cuenta, completa tu perfil comercial por partes y guarda para continuar después. Te contactaremos si hay vacantes compatibles.',
  });
}

export async function POST(req: NextRequest) {
  // Endpoint público sin login: límite por IP contra bots.
  if (isRateLimited(req, 'registro', 20, 60_000)) {
    return Response.json(
      { message: 'Demasiadas solicitudes seguidas. Espera un minuto e intenta de nuevo.' },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const rawAction = String(body.action ?? 'publish');
  if (!ACTIONS.includes(rawAction as RegistroAction)) {
    return Response.json({ message: 'Acción no válida.' }, { status: 400 });
  }
  const action = rawAction as RegistroAction;

  if (body.profile != null && typeof body.profile !== 'object') {
    return Response.json({ message: 'Perfil no válido.' }, { status: 400 });
  }
  const profile = (body.profile ?? {}) as CommercialProfile;
  if (JSON.stringify(profile).length > MAX_PROFILE_JSON) {
    return Response.json({ message: 'El perfil enviado es demasiado grande.' }, { status: 400 });
  }

  const step = typeof body.step === 'number' ? Math.max(0, Math.min(7, body.step)) : 0;
  const { firstName, lastName } = splitProfileName(profile, body);
  const email = String(profile.email ?? body.email ?? '').trim().toLowerCase();

  if (!firstName || !lastName || !email) {
    return Response.json({ message: 'Nombre y correo son obligatorios' }, { status: 400 });
  }

  if (firstName.length > 80 || lastName.length > 80 || email.length > 160) {
    return Response.json({ message: 'Nombre o correo demasiado largos.' }, { status: 400 });
  }

  if (!/.+@.+\..+/.test(email)) {
    return Response.json({ message: 'Correo electrónico no válido' }, { status: 400 });
  }

  if (action === 'account') {
    if (!isAccountProfileComplete(profile)) {
      return Response.json({ message: 'Completa tus datos básicos para crear la cuenta.' }, { status: 400 });
    }

    if (isMockMode()) {
      return Response.json({
        ok: true,
        candidateId: 'mock-candidate',
        resumeToken: 'mock-token',
        message: 'Cuenta creada. Continúa tu perfil cuando quieras.',
      });
    }

    const tenantId = await getPublicTenantId();
    const payload = buildCandidatePayload(profile, firstName, lastName);
    const existing = await prisma.candidate.findFirst({
      where: { tenantId, email: { equals: email, mode: 'insensitive' } },
      select: { id: true, metadata: true },
    });

    // Solo se puede retomar/sobrescribir un registro del propio funnel que siga
    // incompleto. Sin este corte, cualquiera que conozca el correo de un candidato
    // existente (creado por el equipo, del portal o ya publicado) recibiría su
    // resumeToken y podría reescribir su perfil.
    if (existing) {
      const existingMeta = readRegistroMetadata(existing.metadata);
      const isResumableFunnel =
        existingMeta.registrationType === 'talent_pool' && existingMeta.profileStatus !== 'complete';
      if (!isResumableFunnel) {
        return Response.json(
          {
            message:
              'Este correo ya está registrado. Si es tuyo, inicia sesión o escríbenos a contacto@kova.com.co.',
          },
          { status: 409 },
        );
      }
    }

    const prevMeta = readRegistroMetadata(existing?.metadata);
    const resumeToken = prevMeta.resumeToken ?? newResumeToken();
    const metadata = mergeRegistroMetadata(prevMeta, {
      registrationType: 'talent_pool',
      accountCreatedAt: prevMeta.accountCreatedAt ?? new Date().toISOString(),
      registeredAt: prevMeta.registeredAt ?? new Date().toISOString(),
      profileStatus: prevMeta.profileStatus === 'complete' ? 'complete' : 'in_progress',
      registroStep: Math.max(prevMeta.registroStep ?? 0, 1),
      resumeToken,
      commercialProfile: payload.commercialProfile,
      standardAnswers: payload.standardAnswers,
    });

    const data = {
      firstName,
      lastName,
      email,
      phone: payload.phone,
      city: payload.city,
      source: payload.source,
      status: payload.status,
      metadata: metadata as Prisma.InputJsonValue,
    };

    if (existing) {
      await prisma.candidate.update({ where: { id: existing.id }, data });
      return Response.json({
        ok: true,
        candidateId: existing.id,
        resumeToken,
        updated: true,
        message: 'Cuenta actualizada. Continúa tu perfil cuando quieras.',
      });
    }

    const candidate = await prisma.candidate.create({
      data: { tenantId, ...data },
    });

    return Response.json({
      ok: true,
      candidateId: candidate.id,
      resumeToken,
      updated: false,
      message: 'Cuenta creada. Continúa tu perfil cuando quieras.',
    });
  }

  const candidateId = String(body.candidateId ?? '').trim();
  const resumeToken = String(body.resumeToken ?? '').trim();

  if (!candidateId || !resumeToken) {
    return Response.json({ message: 'Sesión de registro inválida.' }, { status: 400 });
  }

  if (isMockMode()) {
    if (action === 'progress') {
      return Response.json({
        ok: true,
        message: 'Progreso guardado. Puedes continuar después.',
      });
    }
    return Response.json({
      ok: true,
      message: 'Perfil registrado correctamente. Te contactaremos si hay vacantes compatibles.',
    });
  }

  const tenantId = await getPublicTenantId();
  const candidate = await findCandidateBySession(tenantId, candidateId, resumeToken);
  if (!candidate) {
    return Response.json({ message: 'No pudimos validar tu sesión.' }, { status: 403 });
  }

  const prevMeta = readRegistroMetadata(candidate.metadata);
  const payload = buildCandidatePayload(profile, firstName, lastName);
  const profileStatus =
    action === 'publish' ? 'complete' : prevMeta.profileStatus === 'complete' ? 'complete' : 'in_progress';

  const metadata = mergeRegistroMetadata(prevMeta, {
    registrationType: 'talent_pool',
    registeredAt: prevMeta.registeredAt ?? new Date().toISOString(),
    accountCreatedAt: prevMeta.accountCreatedAt ?? new Date().toISOString(),
    profileStatus,
    registroStep: action === 'publish' ? step : Math.max(prevMeta.registroStep ?? 0, step),
    resumeToken,
    commercialProfile: payload.commercialProfile,
    standardAnswers: payload.standardAnswers,
  });

  await prisma.candidate.update({
    where: { id: candidate.id },
    data: {
      firstName,
      lastName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });

  if (action === 'progress') {
    return Response.json({
      ok: true,
      message: 'Progreso guardado. Puedes continuar después.',
    });
  }

  return Response.json({
    ok: true,
    candidateId: candidate.id,
    message: 'Perfil registrado correctamente. Te contactaremos si hay vacantes compatibles.',
  });
}
