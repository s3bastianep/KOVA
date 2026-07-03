import { generateTimeSlots, isBookableDateKey } from '@/lib/schedule';

/** Horarios siempre se calculan en el cliente; la API solo confirma reservas existentes. */
export async function fetchAvailability(date) {
  const slots = isBookableDateKey(date) ? generateTimeSlots(date) : [];

  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.slots) && data.slots.length > 0) {
        return { date, slots: data.slots };
      }
    }
  } catch {
    /* sin API — horarios locales */
  }

  return { date, slots };
}

const API_UNAVAILABLE_MSG =
  'El servicio de citas no está activo. En local: npm run dev y abre http://localhost:3000 (no uses solo Vite en :5173).';

export async function checkBookingApi() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const data = await res.json();
    return data?.ok === true;
  } catch {
    return false;
  }
}

export async function createBooking(payload) {
  const dashboardBase = import.meta.env.VITE_DASHBOARD_URL?.replace(/\/login\/?$/, '') ?? '';

  if (dashboardBase) {
    let res;
    try {
      res = await fetch(`${dashboardBase}/api/solicitudes`, {
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
      throw new Error(data.message || data.error || 'No pudimos enviar la solicitud.');
    }

    return {
      ok: true,
      booking: {
        id: data.request?.id,
        date: payload.date,
        time: payload.time,
        nombre: payload.nombre,
      },
      message: data.message,
    };
  }

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
    throw new Error(data.error || 'No pudimos confirmar la cita.');
  }

  return data;
}

export { generateTimeSlots, isBookableDateKey };
