import { NextRequest } from 'next/server';
import { formatDateKey, generateTimeSlots, isBookableDateKey } from '../../../shared/schedule.js';

let ipCounter = 0;

/** IP única por llamada para no chocar con los rate limits por IP entre tests. */
export function freshIp(): string {
  ipCounter += 1;
  return `10.0.${Math.floor(ipCounter / 250)}.${(ipCounter % 250) + 1}`;
}

export function jsonRequest(
  url: string,
  body: unknown,
  opts: { ip?: string; method?: string } = {},
): NextRequest {
  return new NextRequest(`http://localhost${url}`, {
    method: opts.method ?? 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': opts.ip ?? freshIp(),
    },
    body: JSON.stringify(body),
  });
}

/** Próximo día hábil agendable (lunes a viernes, dentro de la ventana de 45 días). */
export function nextBookableDate(): { date: string; slots: string[] } {
  for (let i = 1; i <= 14; i++) {
    const key = formatDateKey(new Date(Date.now() + i * 86_400_000));
    if (isBookableDateKey(key)) {
      const slots = generateTimeSlots(key);
      if (slots.length > 0) return { date: key, slots };
    }
  }
  throw new Error('No se encontró fecha agendable en los próximos 14 días');
}

/** Próximo domingo (nunca agendable) dentro de la ventana de 45 días. */
export function nextSunday(): string {
  for (let i = 1; i <= 8; i++) {
    const key = formatDateKey(new Date(Date.now() + i * 86_400_000));
    const weekday = new Date(`${key}T12:00:00-05:00`).getUTCDay();
    if (weekday === 0) return key;
  }
  throw new Error('unreachable');
}

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}
