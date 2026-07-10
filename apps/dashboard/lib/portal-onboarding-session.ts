export const PORTAL_ONBOARDING_SESSION_KEY = 'kova_portal_onboarding_complete';

export function readOnboardingSession(): boolean | null {
  if (typeof window === 'undefined') return null;
  const cached = sessionStorage.getItem(PORTAL_ONBOARDING_SESSION_KEY);
  if (cached === null) return null;
  return cached === 'true';
}

export function syncOnboardingSession(complete: boolean) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PORTAL_ONBOARDING_SESSION_KEY, String(complete));
}

export function clearOnboardingSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PORTAL_ONBOARDING_SESSION_KEY);
}
