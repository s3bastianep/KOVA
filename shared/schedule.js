/** Lógica de disponibilidad compartida — frontend y backend */
export const SCHEDULE = {
  slotMinutes: 30,
  daysAhead: 45,
  /** 1 = lunes … 5 = viernes (ISO) */
  workingDays: [1, 2, 3, 4, 5],
  workStartHour: 9,
  workEndHour: 17,
  /**
   * Ventanas del día siguiente (hora Colombia).
   * Hoy: sin cupos. Mañana: solo limitedWindows.
   * Desde pasado mañana: jornada 9–17; los primeros `busyHorizonWorkingDays`
   * hábiles muestran ~40–50% de horas ocupadas (demanda simulada).
   * Después de ese horizonte: 100% libre (salvo reservas reales).
   */
  limitedWindows: [
    { startHour: 9, endHour: 10 },
    { startHour: 15, endHour: 16 },
  ],
  /** @deprecated usar limitedWindows */
  openWindows: [
    { startHour: 9, endHour: 10 },
    { startHour: 15, endHour: 16 },
  ],
  /** Días hábiles con ocupación simulada, desde pasado mañana. */
  busyHorizonWorkingDays: 10,
  timezone: 'America/Bogota',
  utcOffset: '-05:00',
};

function slotToMinutes(time) {
  const [hh, mm] = String(time).split(':').map(Number);
  return hh * 60 + mm;
}

function isInLimitedWindow(time) {
  const start = slotToMinutes(time);
  return SCHEDULE.limitedWindows.some(({ startHour, endHour }) => {
    const winStart = startHour * 60;
    const winEnd = endHour * 60;
    return start >= winStart && start + SCHEDULE.slotMinutes <= winEnd;
  });
}

/** Días de calendario desde hoy (Bogotá): 0 = hoy, 1 = mañana, … */
export function calendarDaysFromToday(dateKey) {
  const today = bogotaNowParts().dateKey;
  const a = new Date(`${today}T12:00:00${SCHEDULE.utcOffset}`).getTime();
  const b = new Date(`${dateKey}T12:00:00${SCHEDULE.utcOffset}`).getTime();
  return Math.round((b - a) / 86400000);
}

/**
 * none = hoy / no laborable (sáb/dom)
 * limited = mañana (solo 9–10 y 15–16)
 * full = desde pasado mañana (jornada completa)
 */
export function getDayBookingMode(dateKey) {
  if (!dateKey) return 'none';
  const now = bogotaNowParts();
  if (dateKey <= now.dateKey) return 'none';
  if (dateKey > addDaysToDateKey(now.dateKey, SCHEDULE.daysAhead)) return 'none';
  if (!SCHEDULE.workingDays.includes(weekdayFromDateKey(dateKey))) return 'none';

  const offset = calendarDaysFromToday(dateKey);
  if (offset === 1) return 'limited';
  if (offset >= 2) return 'full';
  return 'none';
}

/** Hash estable para ocupación simulada (mismo día/hora → mismo resultado). */
function hashSeed(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Índice 1…N del día hábil dentro del horizonte de demanda simulada
 * (solo días full desde pasado mañana). 0 = fuera del horizonte.
 */
export function busyWorkingDayIndex(dateKey) {
  if (getDayBookingMode(dateKey) !== 'full') return 0;
  const today = bogotaNowParts().dateKey;
  const offset = calendarDaysFromToday(dateKey);
  let idx = 0;
  for (let i = 2; i <= offset; i += 1) {
    const key = addDaysToDateKey(today, i);
    if (!SCHEDULE.workingDays.includes(weekdayFromDateKey(key))) continue;
    idx += 1;
    if (key === dateKey) return idx;
  }
  return 0;
}

/** true si el día cae en los primeros N hábiles con cupos “ocupados” de muestra. */
export function isInBusyHorizon(dateKey) {
  const idx = busyWorkingDayIndex(dateKey);
  return idx >= 1 && idx <= SCHEDULE.busyHorizonWorkingDays;
}

/** ~40% o ~50% de slots ocupados por día (determinista). */
function simulatedBusyRate(dateKey) {
  return hashSeed(`rate:${dateKey}`) % 2 === 0 ? 0.4 : 0.5;
}

/**
 * Horario marcado como ocupado para simular agenda con clientes.
 * Solo aplica en los próximos `busyHorizonWorkingDays` hábiles tras mañana.
 */
export function isSimulatedBusySlot(time, dateKey) {
  if (!dateKey || !time) return false;
  if (!isInBusyHorizon(dateKey)) return false;
  const rate = simulatedBusyRate(dateKey);
  const unit = hashSeed(`${dateKey}|${time}`) % 1000;
  return unit / 1000 < rate;
}

/**
 * true si el horario se puede reservar ese día.
 * Sin dateKey, asume ventana limitada (compat).
 */
export function isOpenBookingSlot(time, dateKey) {
  if (!dateKey) return isInLimitedWindow(time);
  const mode = getDayBookingMode(dateKey);
  if (mode === 'none') return false;
  if (isSimulatedBusySlot(time, dateKey)) return false;
  if (mode === 'full') return true;
  return isInLimitedWindow(time);
}

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
  return getDayBookingMode(dateKey) !== 'none';
}

function buildDaySlots(dateKey, { openOnly }) {
  if (getDayBookingMode(dateKey) === 'none') return [];

  const slots = [];
  const { slotMinutes, workStartHour, workEndHour } = SCHEDULE;

  for (let h = workStartHour; h < workEndHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      const startMinutes = h * 60 + m;
      if (startMinutes + slotMinutes > workEndHour * 60) continue;
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (openOnly && !isOpenBookingSlot(time, dateKey)) continue;
      slots.push(time);
    }
  }

  return slots;
}

/**
 * Slots reservables según el día:
 * mañana → 9–10 y 15–16;
 * desde pasado mañana → 9–17 (con ~40–50% ocupados en los primeros 10 hábiles).
 */
export function generateTimeSlots(dateKey) {
  const mode = getDayBookingMode(dateKey);
  if (mode === 'none') return [];
  return buildDaySlots(dateKey, { openOnly: true });
}

/** Grilla completa 9–17 para UI (incluye ocupados fuera de ventana en día limitado). */
export function generateDisplayTimeSlots(dateKey) {
  return buildDaySlots(dateKey, { openOnly: false });
}

export function filterBookedSlots(dateKey, slots, bookings) {
  const taken = bookings.filter((b) => b.date === dateKey && b.status !== 'cancelled').map((b) => b.time);
  return slots.filter((s) => !taken.includes(s));
}
