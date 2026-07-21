import {
  SCHEDULE,
  addDaysToDateKey as addDaysToDateKeyBogota,
  bogotaNowParts,
  filterBookedSlots,
  findNextBookableDateKey,
  formatDateKey,
  formatDateKeyFromParts,
  generateDisplayTimeSlots,
  generateTimeSlots,
  isBookableDateKey,
  isOpenBookingSlot,
} from '../../shared/schedule.js';

export {
  SCHEDULE,
  bogotaNowParts,
  filterBookedSlots,
  findNextBookableDateKey,
  formatDateKey,
  formatDateKeyFromParts,
  generateDisplayTimeSlots,
  generateTimeSlots,
  isBookableDateKey,
  isOpenBookingSlot,
};

/** Prefer Bogotá calendar math (same as the API) over the browser local TZ. */
export function addDaysToDateKey(dateKey, days) {
  return addDaysToDateKeyBogota(dateKey, days);
}

export function dateKeyToLocalDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function localDateToKey(date) {
  return formatDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function bogotaTodayDate() {
  const { dateKey } = bogotaNowParts();
  return dateKeyToLocalDate(dateKey);
}
