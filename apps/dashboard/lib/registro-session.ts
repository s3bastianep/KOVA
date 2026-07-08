import { randomUUID } from 'node:crypto';
import type { CommercialProfile } from './candidate-commercial-profile';
import { profileToStandardAnswers, splitFullName } from './candidate-commercial-profile';

export type RegistroProfileStatus = 'account_only' | 'in_progress' | 'complete';

export type RegistroMetadata = {
  registrationType?: string;
  registeredAt?: string;
  accountCreatedAt?: string;
  profileStatus?: RegistroProfileStatus;
  registroStep?: number;
  resumeToken?: string;
  commercialProfile?: CommercialProfile;
  standardAnswers?: Record<string, unknown>;
};

export function readRegistroMetadata(metadata: unknown): RegistroMetadata {
  if (!metadata || typeof metadata !== 'object') return {};
  return metadata as RegistroMetadata;
}

export function isAccountProfileComplete(profile: CommercialProfile): boolean {
  return Boolean(
    profile.nombre?.trim() &&
      profile.email?.trim() &&
      /.+@.+\..+/.test(profile.email ?? '') &&
      profile.telefono?.trim() &&
      profile.ciudad?.trim() &&
      profile.disponibilidad &&
      profile.disponibilidadViajar &&
      profile.disponibilidadReubicacion &&
      profile.consentimientoDatos,
  );
}

export function buildCandidatePayload(profile: CommercialProfile, firstName: string, lastName: string) {
  const email = String(profile.email ?? '').trim().toLowerCase();
  const standardAnswers = profileToStandardAnswers({
    ...profile,
    email,
    nombre: `${firstName} ${lastName}`.trim(),
  });

  return {
    firstName,
    lastName,
    email,
    phone: profile.telefono?.trim() || null,
    city: profile.ciudad?.trim() || standardAnswers.city || null,
    linkedinUrl: null as string | null,
    source: 'Registro web',
    status: 'ACTIVE' as const,
    standardAnswers,
    commercialProfile: { ...profile, email, nombre: `${firstName} ${lastName}`.trim() },
  };
}

export function splitProfileName(profile: CommercialProfile, body: Record<string, unknown>) {
  const split = splitFullName(
    String(
      body.firstName && body.lastName
        ? `${body.firstName} ${body.lastName}`
        : profile.nombre ?? '',
    ),
  );
  return {
    firstName: String(body.firstName ?? split.firstName).trim(),
    lastName: String(body.lastName ?? split.lastName).trim(),
  };
}

export function newResumeToken() {
  return randomUUID();
}

export function mergeRegistroMetadata(
  prev: RegistroMetadata,
  patch: RegistroMetadata,
): RegistroMetadata {
  return {
    ...prev,
    ...patch,
    commercialProfile: {
      ...(prev.commercialProfile ?? {}),
      ...(patch.commercialProfile ?? {}),
    },
  };
}
