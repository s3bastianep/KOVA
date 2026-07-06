import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, Check, Loader2, Video } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { createBooking, fetchAvailability, checkBookingApi } from '@/api/booking';
import { formatDateKey, generateTimeSlots, isBookableDateKey } from '@/lib/schedule';

const DAYS_AHEAD = 45;

function isSelectableDay(date, minDate, maxDate) {
  const day = startOfDay(date);
  if (isBefore(day, minDate) && !isSameDay(day, minDate)) return false;
  if (day > maxDate) return false;
  return isBookableDateKey(formatDateKey(day));
}

function BookingDayContent({ date, activeModifiers = {} }) {
  const human = format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  const label = activeModifiers.disabled ? `${human} (no disponible)` : `Seleccionar ${human}`;
  return (
    <>
      <span aria-hidden="true">{date.getDate()}</span>
      <span className="sr-only">{label}</span>
    </>
  );
}

export default function BookingScheduler({ alternateContact = null }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(today, DAYS_AHEAD), [today]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState('schedule');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', empresa: '' });
  const [apiReady, setApiReady] = useState(null);

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  useEffect(() => {
    checkBookingApi().then(setApiReady);
  }, []);

  useEffect(() => {
    if (!selectedDateKey) {
      setSlots([]);
      return;
    }

    const localSlots = isBookableDateKey(selectedDateKey) ? generateTimeSlots(selectedDateKey) : [];
    setSlots(localSlots);
    setSelectedTime(null);
    setLoadingSlots(localSlots.length === 0);

    let cancelled = false;
    fetchAvailability(selectedDateKey)
      .then(({ slots: s }) => {
        if (!cancelled && s.length) setSlots(s);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDateKey]);

  const handleSelectDate = (day) => {
    if (!day || !isSelectableDay(day, today, maxDate)) return;
    setSelectedDate(day);
    setStep('schedule');
    setSelectedTime(null);
    setError('');
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
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
        ...form,
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
        <h2 className="font-display">Solicitud enviada</h2>
        <p className="kv-booking-success-date capitalize">
          {format(new Date(`${confirmed.date}T12:00:00`), "EEEE d 'de' MMMM", { locale: es })}
          {' · '}
          {confirmed.time}
        </p>
        <p className="kv-booking-success-note">
          Revisaremos tu solicitud y te confirmaremos por correo. Un consultor de Kova te acompañará en la sesión.
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
              30 min · Videollamada · Lun a vie
            </p>
          </div>
          <div className="kv-booking-step-pills font-mono" aria-hidden>
            <span className={step === 'schedule' ? 'is-active' : ''}>1. Fecha</span>
            <span className={step === 'details' ? 'is-active' : ''}>2. Datos</span>
          </div>
        </div>
      </div>

      {apiReady === false && (
        <div className="kv-booking-alert">
          El servidor de citas no responde. En local ejecuta <strong>npm run dev</strong> y abre{' '}
          <strong>http://localhost:3000</strong>.
        </div>
      )}

      {step === 'schedule' ? (
        <div className="kv-booking-body">
          <div className="kv-booking-schedule-grid">
            <div className="kv-booking-calendar-wrap">
              <p className="kv-booking-panel-label font-mono">
                <CalendarDays className="kv-booking-panel-icon" aria-hidden />
                Seleccione un día
              </p>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                locale={es}
                components={{ DayContent: BookingDayContent }}
                fromDate={today}
                toDate={maxDate}
                disabled={(date) => !isSelectableDay(date, today, maxDate)}
                defaultMonth={today}
                className="kova-booking-calendar kv-booking-calendar p-0 w-full"
              />
            </div>

            <div className="kv-booking-slots-panel">
              {selectedDate ? (
                <>
                  <p className="kv-booking-panel-label font-mono capitalize">
                    {format(selectedDate, 'EEEE d MMM', { locale: es })}
                  </p>
                  {loadingSlots ? (
                    <div className="kv-booking-loading">
                      <Loader2 className="animate-spin" aria-hidden />
                    </div>
                  ) : slots.length ? (
                    <>
                      <div className="kv-booking-slots">
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              aria-label={`Seleccionar horario ${slot}`}
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
                      {selectedTime && (
                        <button
                          type="button"
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
                    <p className="kv-booking-empty">Sin horarios. Prueba otro día laboral.</p>
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
          <button type="button" onClick={() => setStep('schedule')} className="kv-booking-back">
            <ArrowLeft aria-hidden />
            Cambiar horario
          </button>

          <div className="kv-booking-selected-slot font-mono capitalize">
            {selectedDate && format(selectedDate, 'EEE d MMM', { locale: es })}
            <span>·</span>
            {selectedTime}
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
          </div>

          {error && <p className="kv-booking-error kv-booking-error--box">{error}</p>}

          <button type="submit" disabled={submitting} className="kv-btn-solid kv-booking-submit">
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      )}

      {alternateContact && step === 'schedule' && (
        <div className="kv-booking-footer font-mono">
          ¿Prefieres escribirnos?{' '}
          <a href={`tel:${alternateContact.phoneTel}`}>{alternateContact.phoneDisplay}</a>
          {' · '}
          <a href={alternateContact.whatsAppUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
