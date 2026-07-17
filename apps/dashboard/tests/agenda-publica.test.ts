import { describe, expect, it } from 'vitest';
import { POST as createBooking } from '../app/api/bookings/route';
import { POST as createSolicitud } from '../app/api/solicitudes/route';
import { GET as getAvailability } from '../app/api/availability/route';
import { NextRequest } from 'next/server';
import { jsonRequest, nextBookableDate, nextSunday, freshIp } from './helpers';

const requester = {
  nombre: 'Carlos Gómez',
  correo: 'carlos@example.com',
  telefono: '3009876543',
  empresa: 'Acme SAS',
};

describe('POST /api/bookings', () => {
  it('crea la cita en un horario válido', async () => {
    const { date, slots } = nextBookableDate();
    const res = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date, time: slots[0] }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.booking.date).toBe(date);
  });

  it('rechaza el mismo horario dos veces (doble reserva)', async () => {
    const { date, slots } = nextBookableDate();
    const slot = slots[1];
    const first = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date, time: slot }),
    );
    expect(first.status).toBe(201);

    const second = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date, time: slot }),
    );
    expect(second.status).toBe(409);
  });

  it('rechaza fechas no agendables (domingo)', async () => {
    const res = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date: nextSunday(), time: '10:00' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza horarios fuera de la jornada', async () => {
    const { date } = nextBookableDate();
    const res = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date, time: '23:30' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza formato de fecha inválido', async () => {
    const res = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date: '17-07-2026', time: '10:00' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza campos faltantes', async () => {
    const { date, slots } = nextBookableDate();
    const res = await createBooking(
      jsonRequest('/api/bookings', { date, time: slots[2], nombre: 'Solo Nombre' }),
    );
    expect(res.status).toBe(400);
  });

  it('aplica rate limit por IP tras 5 solicitudes', async () => {
    const ip = freshIp();
    const { date, slots } = nextBookableDate();
    let lastStatus = 0;
    for (let i = 0; i < 6; i++) {
      const res = await createBooking(
        jsonRequest('/api/bookings', { ...requester, date, time: slots[3 + i] }, { ip }),
      );
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});

describe('POST /api/solicitudes', () => {
  it('aplica las mismas reglas de agenda que bookings (domingo rechazado)', async () => {
    const res = await createSolicitud(
      jsonRequest('/api/solicitudes', { ...requester, date: nextSunday(), time: '10:00' }),
    );
    expect(res.status).toBe(400);
  });

  it('rechaza horario ya reservado por bookings', async () => {
    const { date, slots } = nextBookableDate();
    const slot = slots[slots.length - 1];
    const booked = await createBooking(
      jsonRequest('/api/bookings', { ...requester, date, time: slot }),
    );
    expect(booked.status).toBe(201);

    const res = await createSolicitud(
      jsonRequest('/api/solicitudes', { ...requester, date, time: slot }),
    );
    expect(res.status).toBe(409);
  });
});

describe('GET /api/availability', () => {
  it('devuelve slots para un día hábil', async () => {
    const { date } = nextBookableDate();
    const res = await getAvailability(
      new NextRequest(`http://localhost/api/availability?date=${date}`),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.slots)).toBe(true);
    expect(body.slots.length).toBeGreaterThan(0);
  });

  it('devuelve vacío para un domingo', async () => {
    const res = await getAvailability(
      new NextRequest(`http://localhost/api/availability?date=${nextSunday()}`),
    );
    const body = await res.json();
    expect(body.slots).toEqual([]);
  });

  it('rechaza formato de fecha inválido', async () => {
    const res = await getAvailability(
      new NextRequest('http://localhost/api/availability?date=hola'),
    );
    expect(res.status).toBe(400);
  });
});
