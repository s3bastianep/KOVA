/** Shared public contact channels for the marketing site. */
export const CONTACT_EMAIL = 'contacto@kova.com.co';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_BOOKING_PATH = '/contacto#agendar';

export function buildContactMailto({ subject = 'Hola Kova', body = '' } = {}) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return query ? `${CONTACT_MAILTO}?${query}` : CONTACT_MAILTO;
}
