/** Shared public contact channels for the marketing site. */
export const CONTACT_EMAIL = 'contacto@kova.com.co';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_BOOKING_PATH = '/contacto#agendar';

/** Digits only, country code included. Override with VITE_WHATSAPP_NUMBER. */
export const WHATSAPP_NUMBER = String(
  import.meta.env.VITE_WHATSAPP_NUMBER || '573000000000',
).replace(/\D/g, '');

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function buildWhatsAppUrl(text = '') {
  if (!text) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export function buildContactMailto({ subject = 'Hola Kova', body = '' } = {}) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return query ? `${CONTACT_MAILTO}?${query}` : CONTACT_MAILTO;
}
