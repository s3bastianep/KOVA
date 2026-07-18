/** Lógica de disponibilidad compartida — frontend y backend */
export const SCHEDULE = {
  slotMinutes: 30,
  daysAhead: 45,
  /** 1 = lunes … 5 = viernes (ISO) */
  workingDays: [1, 2, 3, 4, 5],
  workStartHour: 9,
  workEndHour: 17,
  timezone: 'America/Bogota',
  utcOffset: '-05:00',
};

export function formatDateKeyFromParts(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateKey(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function bogotaNowParts() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const hour = Number(get('hour')) % 24;
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    hour: Number.isNaN(hour) ? 0 : hour,
    minute: Number(get('minute')) || 0,
  };
}

function weekdayFromDateKey(dateKey) {
  const d = new Date(`${dateKey}T12:00:00${SCHEDULE.utcOffset}`);
  const js = d.getUTCDay();
  return js === 0 ? 7 : js;
}

export function addDaysToDateKey(dateKey, days) {
  const base = new Date(`${dateKey}T12:00:00${SCHEDULE.utcOffset}`);
  base.setUTCDate(base.getUTCDate() + days);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Primer día laborable (desde fromDateKey) que aún tiene al menos un slot libre teórico. */
export function findNextBookableDateKey(fromDateKey) {
  const start = fromDateKey || bogotaNowParts().dateKey;
  for (let i = 0; i <= SCHEDULE.daysAhead; i += 1) {
    const key = addDaysToDateKey(start, i);
    if (generateTimeSlots(key).length > 0) return key;
  }
  return null;
}

export function isBookableDateKey(dateKey) {
  const now = bogotaNowParts();
  if (dateKey < now.dateKey) return false;
  if (dateKey > addDaysToDateKey(now.dateKey, SCHEDULE.daysAhead)) return false;
  return SCHEDULE.workingDays.includes(weekdayFromDateKey(dateKey));
}

export function generateTimeSlots(dateKey) {
  if (!isBookableDateKey(dateKey)) return [];

  const slots = [];
  const { slotMinutes, workStartHour, workEndHour } = SCHEDULE;

  for (let h = workStartHour; h < workEndHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      const startMinutes = h * 60 + m;
      if (startMinutes + slotMinutes > workEndHour * 60) continue;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  const now = bogotaNowParts();
  if (dateKey === now.dateKey) {
    const nowMinutes = now.hour * 60 + now.minute;
    return slots.filter((slot) => {
      const [hh, mm] = slot.split(':').map(Number);
      return hh * 60 + mm > nowMinutes + 30;
    });
  }

  return slots;
}

export function filterBookedSlots(dateKey, slots, bookings) {
  const taken = bookings.filter((b) => b.date === dateKey && b.status !== 'cancelled').map((b) => b.time);
  return slots.filter((s) => !taken.includes(s));
}
