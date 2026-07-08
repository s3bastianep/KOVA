import {
  SCHEDULE,
  bogotaNowParts,
  filterBookedSlots,
  formatDateKey,
  formatDateKeyFromParts,
  generateTimeSlots,
  isBookableDateKey,
} from '../../shared/schedule.js';

export {
  SCHEDULE,
  bogotaNowParts,
  filterBookedSlots,
  formatDateKey,
  formatDateKeyFromParts,
  generateTimeSlots,
  isBookableDateKey,
};

export function dateKeyToLocalDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function localDateToKey(date) {
  return formatDateKeyFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function addDaysToDateKey(dateKey, days) {
  const next = dateKeyToLocalDate(dateKey);
  next.setDate(next.getDate() + days);
  return formatDateKeyFromParts(next.getFullYear(), next.getMonth() + 1, next.getDate());
}

export function bogotaTodayDate() {
  const { dateKey } = bogotaNowParts();
  return dateKeyToLocalDate(dateKey);
}
