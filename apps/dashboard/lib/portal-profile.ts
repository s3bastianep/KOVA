import type { Prisma } from '@prisma/client';
import {
  type CommercialProfile,
  commercialProfileFromMetadata,
} from './candidate-commercial-profile';
import {
  buildCandidatePayload,
  mergeRegistroMetadata,
  readRegistroMetadata,
  splitProfileName,
} from './registro-session';
import { prisma } from './prisma';

type CandidateRow = {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  linkedinUrl: string | null;
  metadata: unknown;
};

export function profileFromCandidate(candidate: CandidateRow): CommercialProfile {
  const fromMeta = commercialProfileFromMetadata(candidate.metadata);
  return {
    ...(fromMeta ?? {}),
    nombre: fromMeta?.nombre ?? `${candidate.firstName} ${candidate.lastName}`.trim(),
    email: fromMeta?.email ?? candidate.email ?? '',
    telefono: fromMeta?.telefono ?? candidate.phone ?? '',
    ciudad: fromMeta?.ciudad ?? candidate.city ?? '',
    consentimientoDatos: fromMeta?.consentimientoDatos ?? true,
  };
}

export function mergeCommercialProfile(
  current: CommercialProfile,
  patch: Partial<CommercialProfile>,
): CommercialProfile {
  return {
    ...current,
    ...patch,
    historialLaboral: patch.historialLaboral ?? current.historialLaboral,
    formacion: patch.formacion ?? current.formacion,
    idiomas: patch.idiomas ?? current.idiomas,
    certificaciones: patch.certificaciones ?? current.certificaciones,
    logros: patch.logros ?? current.logros,
    competencias: patch.competencias ?? current.competencias,
    industrias: patch.industrias ?? current.industrias,
    tickets: patch.tickets ?? current.tickets,
    herramientas: patch.herramientas ?? current.herramientas,
  };
}

export async function persistPortalProfile(
  tenantId: string,
  candidateId: string,
  profile: CommercialProfile,
) {
  const { firstName, lastName } = splitProfileName(profile, {});
  const payload = buildCandidatePayload(profile, firstName, lastName);

  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { metadata: true },
  });
  if (!candidate) {
    throw new Error('Candidato no encontrado');
  }

  const prevMeta = readRegistroMetadata(candidate.metadata);
  const metadata = mergeRegistroMetadata(prevMeta, {
    commercialProfile: payload.commercialProfile,
    standardAnswers: payload.standardAnswers,
    profileStatus:
      prevMeta.profileStatus === 'complete'
        ? 'complete'
        : prevMeta.profileStatus === 'account_only'
          ? 'in_progress'
          : (prevMeta.profileStatus ?? 'in_progress'),
  });

  await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      firstName,
      lastName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });

  return payload.commercialProfile;
}

export function cvSummaryFromMetadata(metadata: unknown) {
  const meta = readRegistroMetadata(metadata);
  if (!meta.cvFileName && !meta.cvImportedAt) return null;
  return {
    fileName: meta.cvFileName ?? 'Hoja de vida',
    importedAt: meta.cvImportedAt ?? null,
    textLength: meta.cvTextLength ?? null,
  };
}
