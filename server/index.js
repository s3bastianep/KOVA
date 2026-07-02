import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import {
  SCHEDULE,
  filterBookedSlots,
  generateTimeSlots,
  isBookableDateKey,
} from './schedule.js';
import { addBooking, findBookingConflict, readBookings } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes('--dev');
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kova-booking' });
});

app.get('/api/schedule-config', (_req, res) => {
  res.json({
    slotMinutes: SCHEDULE.slotMinutes,
    daysAhead: SCHEDULE.daysAhead,
    timezone: SCHEDULE.timezone,
    eventTitle: 'Consultoría comercial Kova',
    eventDuration: `${SCHEDULE.slotMinutes} min`,
  });
});

app.get('/api/availability', async (req, res) => {
  const date = String(req.query.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Fecha inválida.' });
  }
  if (!isBookableDateKey(date)) {
    return res.json({ date, slots: [] });
  }

  const bookings = await readBookings();
  const allSlots = generateTimeSlots(date);
  const slots = filterBookedSlots(date, allSlots, bookings);
  res.json({ date, slots });
});

function validateBookingBody(body) {
  const { date, time, nombre, correo, telefono, empresa } = body ?? {};
  if (!date || !time || !nombre?.trim() || !correo?.trim() || !telefono?.trim() || !empresa?.trim()) {
    return 'Completa fecha, hora, nombre, correo, teléfono y empresa.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Fecha inválida.';
  if (!/^\d{2}:\d{2}$/.test(time)) return 'Hora inválida.';
  if (!correo.includes('@')) return 'Correo inválido.';
  if (!isBookableDateKey(date)) return 'La fecha seleccionada no está disponible.';
  const slots = generateTimeSlots(date);
  if (!slots.includes(time)) return 'El horario seleccionado no está disponible.';
  return null;
}

app.post('/api/bookings', async (req, res) => {
  const error = validateBookingBody(req.body);
  if (error) return res.status(400).json({ error });

  const { date, time, nombre, correo, telefono, empresa } = req.body;
  const conflict = await findBookingConflict(date, time);
  if (conflict) {
    return res.status(409).json({ error: 'Ese horario acaba de ser reservado. Elige otro.' });
  }

  const booking = {
    id: randomUUID(),
    date,
    time,
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    telefono: telefono.trim(),
    empresa: empresa.trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  await addBooking(booking);
  res.status(201).json({
    ok: true,
    booking: {
      id: booking.id,
      date: booking.date,
      time: booking.time,
      nombre: booking.nombre,
    },
  });
});

function dashboardLoginUrl() {
  const raw =
    process.env.DASHBOARD_URL ??
    process.env.VITE_DASHBOARD_URL ??
    (isDev ? 'http://localhost:3001' : null);
  if (!raw) return null;
  const base = raw.replace(/\/$/, '');
  return base.endsWith('/login') ? base : `${base}/login`;
}

app.get('/login', (_req, res) => {
  const target = dashboardLoginUrl();
  if (!target) {
    return res.status(503).type('html').send(
      '<h1>Plataforma no configurada</h1><p>Define DASHBOARD_URL en Railway apuntando al servicio del dashboard.</p>',
    );
  }
  res.redirect(302, target);
});

async function start() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(__dirname, '../dist');
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kova ${isDev ? 'dev' : 'prod'} → http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
