import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
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
  return JSON.parse(raw) as Array<{ date: string; time: string; status?: string }>;
}

export async function addBooking(booking: { date: string; time: string; status?: string; [key: string]: unknown }) {
  const bookings = await readBookings();
  bookings.push(booking);
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
  return booking;
}

export async function findBookingConflict(date: string, time: string) {
  const bookings = await readBookings();
  return bookings.find((b) => b.date === date && b.time === time && b.status !== 'cancelled');
}
