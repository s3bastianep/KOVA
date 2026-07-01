import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, '[]', 'utf8');
  }
}

export async function readBookings() {
  await ensureStore();
  const raw = await fs.readFile(BOOKINGS_FILE, 'utf8');
  return JSON.parse(raw);
}

export async function writeBookings(bookings) {
  await ensureStore();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

export async function addBooking(booking) {
  const bookings = await readBookings();
  bookings.push(booking);
  await writeBookings(bookings);
  return booking;
}

export async function findBookingConflict(date, time) {
  const bookings = await readBookings();
  return bookings.find((b) => b.date === date && b.time === time && b.status !== 'cancelled');
}
