import { formatDateKey, isBookableDateKey } from '@/lib/schedule';

const API_UNAVAILABLE_MSG =
  'El servicio de citas no está disponible en este momento. Escríbenos a contacto@kova.com.co o intenta más tarde.';

/** Solo devuelve horarios confirmados por el backend. Sin fallback local. */
export async function fetchAvailability(date) {
  if (!isBookableDateKey(date)) {
    return { date, slots: [], unavailable: false };
  }

  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
    if (!res.ok) {
      return { date, slots: [], unavailable: true };
    }
    const data = await res.json();
    if (!Array.isArray(data.slots)) {
      return { date, slots: [], unavailable: true };
    }
    return { date, slots: data.slots, unavailable: false };
  } catch {
    return { date, slots: [], unavailable: true };
  }
}

export async function checkBookingApi() {
  try {
    const [healthRes, availRes] = await Promise.all([
      fetch('/api/health'),
      fetch(`/api/availability?date=${encodeURIComponent(formatDateKey(new Date()))}`),
    ]);
    if (!healthRes.ok || !availRes.ok) return false;
    const health = await healthRes.json().catch(() => ({}));
    return health?.ok === true && health?.booking !== false;
  } catch {
    return false;
  }
}

export async function createBooking(payload) {
  let res;
  try {
    res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(API_UNAVAILABLE_MSG);
  }

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    if (res.status === 404 || !contentType.includes('application/json')) {
      throw new Error(API_UNAVAILABLE_MSG);
    }
    throw new Error(data.error || data.message || 'No pudimos confirmar la cita.');
  }

  return data;
}

export { formatDateKey, isBookableDateKey };
