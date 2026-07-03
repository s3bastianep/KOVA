import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { createBooking, fetchAvailability, checkBookingApi } from '@/api/booking';
import { formatDateKey, generateTimeSlots, isBookableDateKey } from '@/lib/schedule';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const DAYS_AHEAD = 45;

const labelClass = 'block text-[13px] font-medium mb-1.5';
const inputClass =
  'w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3FAA]/12 focus:border-[#1A3FAA] transition-all';
const inputStyle = { background: KOVA.white, border: `1px solid ${KOVA.borderSoft}`, color: BRAND.navy };

function isSelectableDay(date, minDate, maxDate) {
  const day = startOfDay(date);
  if (isBefore(day, minDate) && !isSameDay(day, minDate)) return false;
  if (day > maxDate) return false;
  return isBookableDateKey(formatDateKey(day));
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

  // Nombres accesibles para los botones de día del calendario, p. ej.
  // "Seleccionar 15 de julio de 2026", de modo que puedan ubicarse por rol.
  const calendarLabels = useMemo(
    () => ({
      labelDay: (day, modifiers = {}) => {
        const human = format(day, "d 'de' MMMM 'de' yyyy", { locale: es });
        return modifiers.disabled ? `${human} (no disponible)` : `Seleccionar ${human}`;
      },
    }),
    [],
  );

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
      <div className="kova-card rounded-2xl p-8 sm:p-10 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: KOVA.paleGreen }}
        >
          <Check className="w-6 h-6" style={{ color: BRAND.greenDark }} strokeWidth={2.5} />
        </div>
        <h2 className="font-heading font-semibold text-lg mb-2" style={{ color: BRAND.navy }}>
          Solicitud enviada
        </h2>
        <p className="text-sm capitalize mb-1" style={{ color: KOVA.body }}>
          {format(new Date(`${confirmed.date}T12:00:00`), "EEEE d 'de' MMMM", { locale: es })}
          {' · '}
          {confirmed.time}
        </p>
        <p className="text-[13px]" style={{ color: KOVA.muted }}>
          Revisaremos tu solicitud y te confirmaremos por correo. Un consultor de Kova te acompañará en la sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="kova-card rounded-2xl overflow-hidden">
      {/* Encabezado compacto */}
      <div className="px-5 sm:px-6 py-4 border-b" style={{ borderColor: KOVA.borderSoft }}>
        <h2 className="font-heading font-semibold text-base" style={{ color: BRAND.navy }}>
          Agenda tu consultoría
        </h2>
        <p className="text-[13px] mt-0.5" style={{ color: KOVA.muted }}>
          30 min · Videollamada · Lun a vie
        </p>
      </div>

      {apiReady === false && (
        <div
          className="mx-5 sm:mx-6 mt-4 text-[13px] rounded-lg px-3 py-2"
          style={{ color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A' }}
        >
          El servidor de citas no responde. En local ejecuta <strong>npm run dev</strong> y abre{' '}
          <strong>http://localhost:3000</strong>.
        </div>
      )}

      {step === 'schedule' ? (
        <div className="p-5 sm:p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start">
            {/* Calendario */}
            <div className="min-w-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                locale={es}
                labels={calendarLabels}
                fromDate={today}
                toDate={maxDate}
                disabled={(date) => !isSelectableDay(date, today, maxDate)}
                defaultMonth={today}
                className="kova-booking-calendar p-0 w-full"
              />
            </div>

            {/* Horarios */}
            <div
              className="md:w-[9.5rem] lg:w-[10.5rem] flex-shrink-0 md:border-l md:pl-6"
              style={{ borderColor: KOVA.borderSoft }}
            >
              {selectedDate ? (
                <>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide mb-3 capitalize"
                    style={{ color: KOVA.muted, letterSpacing: '0.06em' }}
                  >
                    {format(selectedDate, 'EEE d MMM', { locale: es })}
                  </p>
                  {loadingSlots ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: BRAND.blue }} />
                    </div>
                  ) : slots.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 max-h-[17rem] overflow-y-auto pr-0.5">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          aria-label={`Seleccionar horario ${slot}`}
                          aria-pressed={selectedTime === slot}
                          onClick={() => {
                            setSelectedTime(slot);
                            setStep('details');
                            setError('');
                          }}
                          className="text-[13px] font-medium py-2 px-3 rounded-lg transition-colors text-center border hover:border-[#1A3FAA] hover:bg-[#EEF2FA]"
                          style={{
                            color: BRAND.navy,
                            background: KOVA.surface,
                            borderColor: KOVA.borderSoft,
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] leading-relaxed py-4" style={{ color: KOVA.muted }}>
                      Sin horarios. Prueba otro día laboral.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-[13px] leading-relaxed py-2 md:py-8 md:text-center" style={{ color: KOVA.muted }}>
                  Selecciona un día para ver horarios.
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-[13px] mt-4" style={{ color: '#B91C1C' }}>
              {error}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleConfirm} className="p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setStep('schedule')}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-5 transition-opacity hover:opacity-70"
            style={{ color: BRAND.blue }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cambiar horario
          </button>

          <div
            className="inline-flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full mb-5"
            style={{ background: KOVA.paleBlue, color: BRAND.navy }}
          >
            <span className="capitalize">
              {selectedDate && format(selectedDate, 'EEE d MMM', { locale: es })}
            </span>
            <span style={{ color: KOVA.muted }}>·</span>
            <span>{selectedTime}</span>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="booking-nombre" className={labelClass} style={{ color: BRAND.navy }}>
                Nombre completo
              </label>
              <input
                id="booking-nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className={inputClass}
                style={inputStyle}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-correo" className={labelClass} style={{ color: BRAND.navy }}>
                Correo corporativo
              </label>
              <input
                id="booking-correo"
                name="email"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className={inputClass}
                style={inputStyle}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-telefono" className={labelClass} style={{ color: BRAND.navy }}>
                Teléfono o WhatsApp
              </label>
              <input
                id="booking-telefono"
                name="tel"
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className={inputClass}
                style={inputStyle}
                autoComplete="tel"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-empresa" className={labelClass} style={{ color: BRAND.navy }}>
                Empresa
              </label>
              <input
                id="booking-empresa"
                name="organization"
                type="text"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                className={inputClass}
                style={inputStyle}
                autoComplete="organization"
                required
              />
            </div>
          </div>

          {error && (
            <p
              className="text-[13px] rounded-lg px-3 py-2 mt-4 max-w-md"
              style={{ color: '#B91C1C', background: '#FEF2F2' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="kova-btn-primary mt-6 max-w-md w-full font-semibold py-3 rounded-lg text-sm text-white disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      )}

      {alternateContact && step === 'schedule' && (
        <div
          className="px-5 sm:px-6 py-3 border-t text-center text-[12px]"
          style={{ borderColor: KOVA.borderSoft, color: KOVA.muted, background: '#FAFBFC' }}
        >
          ¿Prefieres escribirnos?{' '}
          <a href={`tel:${alternateContact.phoneTel}`} className="font-medium hover:underline" style={{ color: BRAND.blue }}>
            {alternateContact.phoneDisplay}
          </a>
          {' · '}
          <a
            href={alternateContact.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            style={{ color: BRAND.greenDark }}
          >
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
