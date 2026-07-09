import type { Prisma } from '@prisma/client';
import {
  type CommercialProfile,
  commercialProfileFromMetadata,
} from './candidate-commercial-profile';
import {
  isEducationComplete,
  isLanguageComplete,
  isWorkHistoryComplete,
} from './commercial-profile-builder';
import {
  buildCandidatePayload,
  mergeRegistroMetadata,
  readRegistroMetadata,
  splitProfileName,
  type OnboardingStep,
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

export async function persistPortalOnboarding(
  tenantId: string,
  candidateId: string,
  patch: {
    profile?: Partial<CommercialProfile>;
    onboardingStep?: OnboardingStep;
    onboardingSubStep?: number;
    onboardingReviewed?: string[];
    profileStatus?: 'account_only' | 'in_progress' | 'complete';
  },
) {
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: {
      metadata: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      linkedinUrl: true,
    },
  });
  if (!candidate) throw new Error('Candidato no encontrado');

  const prevMeta = readRegistroMetadata(candidate.metadata);
  const currentProfile = profileFromCandidate(candidate);
  const mergedProfile = patch.profile ? mergeCommercialProfile(currentProfile, patch.profile) : currentProfile;

  const metadata = mergeRegistroMetadata(prevMeta, {
    commercialProfile: mergedProfile,
    onboardingStep: patch.onboardingStep ?? prevMeta.onboardingStep,
    onboardingSubStep: patch.onboardingSubStep ?? prevMeta.onboardingSubStep,
    onboardingReviewed: patch.onboardingReviewed ?? prevMeta.onboardingReviewed,
    profileStatus: patch.profileStatus ?? prevMeta.profileStatus,
  });

  if (patch.profile) {
    const { firstName, lastName } = splitProfileName(mergedProfile, {});
    const payload = buildCandidatePayload(mergedProfile, firstName, lastName);
    metadata.commercialProfile = payload.commercialProfile;
    metadata.standardAnswers = payload.standardAnswers;

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
    return mergedProfile;
  }

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { metadata: metadata as Prisma.InputJsonValue },
  });
  return mergedProfile;
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

export type ProfileGapItem = {
  id: string;
  label: string;
  href: string;
};

export function getProfileGaps(profile: CommercialProfile, hasCv: boolean): ProfileGapItem[] {
  const gaps: ProfileGapItem[] = [];

  if (!profile.telefono?.trim()) {
    gaps.push({ id: 'telefono', label: 'Teléfono de contacto', href: '/portal/perfil' });
  }
  if (!profile.ciudad?.trim()) {
    gaps.push({ id: 'ciudad', label: 'Ciudad de residencia', href: '/portal/perfil' });
  }
  if (!profile.disponibilidad?.trim()) {
    gaps.push({ id: 'disponibilidad', label: 'Cuándo puedes empezar', href: '/portal/perfil' });
  }
  if (!profile.disponibilidadViajar?.trim()) {
    gaps.push({ id: 'viajar', label: 'Disponibilidad para viajar', href: '/portal/perfil' });
  }
  if (!profile.disponibilidadReubicacion?.trim()) {
    gaps.push({ id: 'reubicacion', label: 'Disponibilidad para reubicación', href: '/portal/perfil' });
  }

  const historial = profile.historialLaboral ?? [];
  if (!hasCv && historial.length === 0) {
    gaps.push({ id: 'cv', label: 'Hoja de vida o experiencia laboral', href: '/portal/documentos' });
  } else if (historial.length > 0 && !historial.some(isWorkHistoryComplete)) {
    gaps.push({ id: 'experiencia', label: 'Revisa y completa tu experiencia laboral', href: '/portal/experiencia' });
  }

  if (!profile.nivelRol?.trim()) {
    gaps.push({ id: 'nivelRol', label: 'Cargos e industrias de interés', href: '/portal/preferencias' });
  }
  if (!profile.objetivoProfesional?.trim()) {
    gaps.push({ id: 'objetivo', label: 'Tipo de trabajo que buscas', href: '/portal/preferencias' });
  }
  if (!profile.tipoVenta?.trim()) {
    gaps.push({ id: 'tipoVenta', label: 'Cómo vendes', href: '/portal/preferencias' });
  }
  if (!(profile.industrias?.length ?? 0)) {
    gaps.push({ id: 'industrias', label: 'Industrias de experiencia', href: '/portal/preferencias' });
  }
  if (!profile.expectativaSalarial?.trim()) {
    gaps.push({ id: 'salario', label: 'Aspiración salarial', href: '/portal/preferencias' });
  }

  if (!(profile.formacion ?? []).some(isEducationComplete)) {
    gaps.push({ id: 'formacion', label: 'Formación académica', href: '/portal/formacion' });
  }
  if (!(profile.idiomas ?? []).some(isLanguageComplete)) {
    gaps.push({ id: 'idiomas', label: 'Nivel de idiomas', href: '/portal/formacion' });
  }

  return gaps;
}
