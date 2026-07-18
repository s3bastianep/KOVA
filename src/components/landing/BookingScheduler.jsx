import '@/styles/landing-wave-booking.css';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, Check, Loader2, Video } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { createBooking, fetchAvailability, checkBookingApi } from '@/api/booking';
import {
  SCHEDULE,
  addDaysToDateKey,
  bogotaNowParts,
  bogotaTodayDate,
  dateKeyToLocalDate,
  findNextBookableDateKey,
  isBookableDateKey,
  localDateToKey,
} from '@/lib/schedule';

function isSelectableDay(date) {
  if (!date) return false;
  return isBookableDateKey(localDateToKey(date));
}

function bookingDayLabel(date, activeModifiers = {}) {
  const human = format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  if (activeModifiers.disabled || !isBookableDateKey(localDateToKey(date))) {
    return `${human}, no disponible`;
  }
  return `Seleccionar ${human}`;
}

function initialBookableDate() {
  const key = findNextBookableDateKey();
  return key ? dateKeyToLocalDate(key) : null;
}

export default function BookingScheduler({ alternateContact = null }) {
  const todayKey = useMemo(() => bogotaNowParts().dateKey, []);
  const today = useMemo(() => bogotaTodayDate(), [todayKey]);
  const maxDate = useMemo(
    () => {
      const maxKey = addDaysToDateKey(todayKey, SCHEDULE.daysAhead);
      const [y, m, d] = maxKey.split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    [todayKey],
  );

  const [selectedDate, setSelectedDate] = useState(initialBookableDate);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState('schedule');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    empresa: '',
    rolVacante: '',
  });
  const [apiReady, setApiReady] = useState(null);

  const selectedDateKey = selectedDate ? localDateToKey(selectedDate) : null;
  const selectedDateLabel = selectedDate
    ? format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    : '';

  useEffect(() => {
    checkBookingApi().then(setApiReady);
  }, []);

  useEffect(() => {
    if (!selectedDateKey) {
      setSlots([]);
      return;
    }

    setSlots([]);
    setSelectedTime(null);
    setLoadingSlots(true);

    let cancelled = false;
    fetchAvailability(selectedDateKey)
      .then(({ slots: nextSlots, unavailable }) => {
        if (cancelled) return;
        if (unavailable) {
          setApiReady(false);
          setSlots([]);
          return;
        }
        // Si el día elegido ya no tiene cupos (p. ej. hoy tarde), saltar al próximo con horarios.
        if (nextSlots.length === 0) {
          const nextKey = findNextBookableDateKey(addDaysToDateKey(selectedDateKey, 1));
          if (nextKey && nextKey !== selectedDateKey) {
            setSelectedDate(dateKeyToLocalDate(nextKey));
            return;
          }
        }
        setSlots(nextSlots);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDateKey]);

  const goToNextOpenDay = () => {
    const from = selectedDateKey
      ? addDaysToDateKey(selectedDateKey, 1)
      : bogotaNowParts().dateKey;
    const nextKey = findNextBookableDateKey(from);
    if (!nextKey) {
      setError('No hay más días disponibles en el calendario. Escríbenos por WhatsApp.');
      return;
    }
    setSelectedDate(dateKeyToLocalDate(nextKey));
    setSelectedTime(null);
    setError('');
  };

  const handleSelectDate = (day) => {
    if (!day || !isSelectableDay(day)) return;
    setSelectedDate(day);
    setStep('schedule');
    setSelectedTime(null);
    setError('');
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (apiReady === false) {
      setError('El agendamiento en línea no está disponible. Escríbenos a contacto@kova.com.co.');
      return;
    }
    if (!selectedDateKey || !selectedTime) {
      setError('Selecciona fecha y hora.');
      return;
    }
    if (!form.nombre.trim() || !form.correo.trim() || !form.telefono.trim() || !form.empresa.trim()) {
      setError('Completa nombre, correo, teléfono y empresa.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createBooking({
        date: selectedDateKey,
        time: selectedTime,
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        empresa: form.empresa,
        rolVacante: form.rolVacante.trim() || undefined,
      });
      setConfirmed(result.booking);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'done' && confirmed) {
    return (
      <div className="kv-booking-card kv-booking-card--dark kv-booking-success">
        <div className="kv-booking-success-icon">
          <Check strokeWidth={2.5} aria-hidden />
        </div>
        <h2 className="font-display">Cita apartada</h2>
        <p className="kv-booking-success-date capitalize">
          {format(new Date(`${confirmed.date}T12:00:00`), "EEEE d 'de' MMMM", { locale: es })}
          {' · '}
          {confirmed.time}
        </p>
        <p className="kv-booking-success-note">
          Tu horario quedó reservado. Nos contactaremos contigo pronto por correo o WhatsApp
          para confirmar los detalles de la asesoría.
        </p>
      </div>
    );
  }

  return (
    <div className="kv-booking-card kv-booking-card--dark">
      <div className="kv-booking-header">
        <div className="kv-booking-header-top">
          <div>
            <h2 className="font-display">Agendar una consultoría</h2>
            <p className="kv-booking-meta font-mono">
              <Video className="kv-booking-meta-icon" aria-hidden />
              30 min · Videollamada · Lun a vie · Hora Colombia
            </p>
          </div>
          <div className="kv-booking-step-pills font-mono" aria-hidden>
            <span className={step === 'schedule' ? 'is-active' : ''}>1. Fecha y hora</span>
            <span className={step === 'details' ? 'is-active' : ''}>2. Datos</span>
          </div>
        </div>
      </div>

      {apiReady === false && (
        <div className="kv-booking-alert">
          El agendamiento en línea no está disponible ahora. Escríbenos a{' '}
          <a href="mailto:contacto@kova.com.co">contacto@kova.com.co</a> y te ayudamos a reservar.
        </div>
      )}

      {step === 'schedule' ? (
        <div className="kv-booking-body">
          <div className="kv-booking-schedule-grid">
            <div className="kv-booking-calendar-wrap">
              <p className="kv-booking-panel-label font-mono" id="booking-calendar-label">
                <CalendarDays className="kv-booking-panel-icon" aria-hidden />
                Seleccione un día
              </p>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                locale={es}
                labels={{ labelDay: bookingDayLabel }}
                fromDate={today}
                toDate={maxDate}
                disabled={(date) => !isSelectableDay(date)}
                defaultMonth={today}
                aria-labelledby="booking-calendar-label"
                className="kova-booking-calendar kv-booking-calendar p-0 w-full"
              />
            </div>

            <div className="kv-booking-slots-panel" aria-live="polite">
              {selectedDate ? (
                <>
                  <p className="kv-booking-panel-label font-mono capitalize">
                    Seleccione una hora · {format(selectedDate, 'EEEE d MMM', { locale: es })}
                  </p>
                  {loadingSlots ? (
                    <div className="kv-booking-loading">
                      <Loader2 className="animate-spin" aria-hidden />
                      <span className="sr-only">Cargando horarios disponibles</span>
                    </div>
                  ) : apiReady === false ? (
                    <p className="kv-booking-empty">
                      No podemos mostrar horarios en este momento. Usa el correo de contacto o intenta más tarde.
                    </p>
                  ) : slots.length ? (
                    <>
                      <div className="kv-booking-slots" role="group" aria-label={`Horarios para ${selectedDateLabel}`}>
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot;
                          const slotId = `booking-slot-${slot.replace(':', '')}`;
                          return (
                            <button
                              key={slot}
                              id={slotId}
                              type="button"
                              name="booking-slot"
                              aria-label={`Horario ${slot} del ${selectedDateLabel}`}
                              aria-pressed={isSelected}
                              onClick={() => {
                                setSelectedTime(slot);
                                setError('');
                              }}
                              className={`kv-booking-slot font-mono${isSelected ? ' is-selected' : ''}`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      {selectedTime && apiReady !== false && (
                        <button
                          type="button"
                          id="booking-continue"
                          aria-label={`Continuar con horario ${selectedTime} del ${selectedDateLabel}`}
                          onClick={() => {
                            setStep('details');
                            setError('');
                          }}
                          className="kv-btn-solid kv-booking-continue"
                        >
                          Continuar con {selectedTime}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="kv-booking-empty-block">
                      <p className="kv-booking-empty">
                        {selectedDateKey === todayKey
                          ? 'Hoy ya no hay horarios disponibles (9:00–17:00, hora Colombia).'
                          : 'Este día ya no tiene horarios libres.'}
                      </p>
                      <button
                        type="button"
                        className="kv-btn-solid kv-booking-continue"
                        onClick={goToNextOpenDay}
                      >
                        Ver próximo día disponible
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="kv-booking-empty kv-booking-empty--center">
                  Selecciona un día para ver horarios disponibles.
                </p>
              )}
            </div>
          </div>

          {error && <p className="kv-booking-error">{error}</p>}
        </div>
      ) : (
        <form onSubmit={handleConfirm} className="kv-booking-body kv-booking-form">
          <div className="kv-booking-form-head">
            <button
              type="button"
              onClick={() => setStep('schedule')}
              className="kv-booking-back"
              aria-label="Volver a cambiar fecha y horario"
            >
              <ArrowLeft aria-hidden />
              Cambiar horario
            </button>

            <div className="kv-booking-selected-slot font-mono capitalize">
              {selectedDate && format(selectedDate, 'EEE d MMM', { locale: es })}
              <span>·</span>
              {selectedTime}
            </div>
          </div>

          <div className="kv-booking-fields">
            <div>
              <label htmlFor="booking-nombre" className="kv-booking-label">
                Nombre completo
              </label>
              <input
                id="booking-nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="kv-booking-input"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-correo" className="kv-booking-label">
                Correo corporativo
              </label>
              <input
                id="booking-correo"
                name="email"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="kv-booking-input"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-telefono" className="kv-booking-label">
                Teléfono o WhatsApp
              </label>
              <input
                id="booking-telefono"
                name="tel"
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="kv-booking-input"
                autoComplete="tel"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-empresa" className="kv-booking-label">
                Empresa
              </label>
              <input
                id="booking-empresa"
                name="organization"
                type="text"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                className="kv-booking-input"
                autoComplete="organization"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-rol" className="kv-booking-label">
                ¿Qué rol comercial quiere contratar? <span className="kv-booking-optional">(opcional)</span>
              </label>
              <input
                id="booking-rol"
                name="rolVacante"
                type="text"
                value={form.rolVacante}
                onChange={(e) => setForm({ ...form, rolVacante: e.target.value })}
                className="kv-booking-input"
                placeholder="Ej. Ejecutivo B2B SaaS, jefe comercial regional…"
                autoComplete="off"
              />
            </div>
          </div>

          {error && <p className="kv-booking-error kv-booking-error--box">{error}</p>}

          <button
            type="submit"
            id="booking-submit"
            disabled={submitting}
            className="kv-btn-solid kv-booking-submit"
            aria-label="Apartar esta cita"
          >
            {submitting ? 'Apartando cita...' : 'Apartar esta cita'}
          </button>
        </form>
      )}

      {alternateContact && step === 'schedule' && (
        <div className="kv-booking-footer font-mono">
          ¿Prefieres escribirnos?{' '}
          <a href={alternateContact.emailMailto || `mailto:${alternateContact.emailDisplay}`}>
            {alternateContact.emailDisplay}
          </a>
        </div>
      )}
    </div>
  );
}
