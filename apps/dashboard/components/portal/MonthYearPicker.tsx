'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Dark onboarding surfaces vs light portal forms */
  tone?: 'dark' | 'light';
  disabled?: boolean;
  invalid?: boolean;
};

function parseYearMonth(value: string): { year: number; month: number } | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const iso = trimmed.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }

  const slash = trimmed.match(/^(\d{1,2})\s*[/.-]\s*(\d{4})$/);
  if (slash) {
    const month = Number(slash[1]);
    const year = Number(slash[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }

  return null;
}

function toStoredValue(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function displayLabel(value: string): string {
  const parsed = parseYearMonth(value);
  if (!parsed) return '';
  return `${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Elegir mes',
  className,
  tone = 'light',
  disabled = false,
  invalid = false,
}: Props) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseYearMonth(value), [value]);
  const now = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(parsed?.year ?? now.getFullYear());

  useEffect(() => {
    if (parsed?.year) setViewYear(parsed.year);
  }, [parsed?.year]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const label = displayLabel(value);
  const isDark = tone === 'dark';

  return (
    <div ref={rootRef} className={cn('kova-month-picker', className)}>
      <button
        type="button"
        className={cn(
          'kova-month-picker__trigger',
          isDark && 'kova-month-picker__trigger--dark',
          open && 'is-open',
          !label && 'is-empty',
          invalid && 'is-invalid',
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{label || placeholder}</span>
        <Calendar className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Elegir mes y año"
          className={cn('kova-month-picker__panel', isDark && 'kova-month-picker__panel--dark')}
        >
          <div className="kova-month-picker__year">
            <button
              type="button"
              aria-label="Año anterior"
              className="kova-month-picker__nav"
              onClick={() => setViewYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>{viewYear}</span>
            <button
              type="button"
              aria-label="Año siguiente"
              className="kova-month-picker__nav"
              onClick={() => setViewYear((y) => Math.min(y + 1, now.getFullYear() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="kova-month-picker__months">
            {MONTHS_SHORT.map((monthLabel, index) => {
              const month = index + 1;
              const selected = parsed?.year === viewYear && parsed.month === month;
              const isFuture =
                viewYear > now.getFullYear() ||
                (viewYear === now.getFullYear() && month > now.getMonth() + 1);
              return (
                <button
                  key={monthLabel}
                  type="button"
                  className={cn(
                    'kova-month-picker__month',
                    selected && 'is-selected',
                    isFuture && 'is-muted',
                  )}
                  onClick={() => {
                    onChange(toStoredValue(viewYear, month));
                    setOpen(false);
                  }}
                >
                  {monthLabel}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
