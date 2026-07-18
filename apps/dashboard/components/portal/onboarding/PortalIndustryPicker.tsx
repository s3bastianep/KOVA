'use client';

import { useMemo, useRef, useState } from 'react';
import {
  MAX_PORTAL_INDUSTRIES,
  normalizeIndustryName,
  PORTAL_INDUSTRY_OPTIONS,
} from '@/lib/candidate-industries';

type Props = {
  selected: string[];
  onChange: (industries: string[]) => void;
  max?: number;
  cvSuggestions?: string[];
};

export function PortalIndustryPicker({
  selected,
  onChange,
  max = MAX_PORTAL_INDUSTRIES,
  cvSuggestions = [],
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = selected.length >= max;
  const selectedSet = useMemo(
    () => new Set(selected.map((item) => item.toLowerCase())),
    [selected],
  );

  const fromCv = useMemo(() => {
    if (atLimit) return [];
    return cvSuggestions
      .map(normalizeIndustryName)
      .filter((item) => item && !selectedSet.has(item.toLowerCase()))
      .filter((item, i, arr) => arr.findIndex((s) => s.toLowerCase() === item.toLowerCase()) === i)
      .slice(0, 6);
  }, [atLimit, cvSuggestions, selectedSet]);

  const fromCvSet = useMemo(() => new Set(fromCv.map((s) => s.toLowerCase())), [fromCv]);

  const available = useMemo(
    () =>
      PORTAL_INDUSTRY_OPTIONS.filter(
        (item) => !selectedSet.has(item.toLowerCase()) && !fromCvSet.has(item.toLowerCase()),
      ),
    [selectedSet, fromCvSet],
  );

  const filtered = useMemo(() => {
    if (atLimit) return [];
    const q = query.trim().toLowerCase();
    const pool = [...fromCv, ...available];
    if (!q) return pool.slice(0, 6);
    return pool.filter((item) => item.toLowerCase().includes(q)).slice(0, 6);
  }, [available, atLimit, fromCv, query]);

  const morePicks = useMemo(
    () => (atLimit ? [] : available.filter((item) => item !== 'Otra').slice(0, 8)),
    [available, atLimit],
  );

  const add = (raw: string) => {
    if (atLimit) return;
    const normalized = normalizeIndustryName(raw);
    if (!normalized || selectedSet.has(normalized.toLowerCase())) return;
    onChange([...selected, normalized].slice(0, max));
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const remove = (item: string) => {
    onChange(selected.filter((value) => value !== item));
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || atLimit) return;
    const exact = filtered.find((item) => item.toLowerCase() === trimmed.toLowerCase());
    if (exact) {
      add(exact);
      return;
    }
    // Free text → store as "Otra: …" so it stays useful for matching.
    add(`Otra: ${trimmed}`);
  };

  return (
    <div className="portal-onboarding-skill-picker">
      <div className="portal-onboarding-skill-picker__head">
        <p className="portal-onboarding-skill-picker__count" aria-live="polite">
          <strong>
            {selected.length} de {max}
          </strong>{' '}
          industrias
        </p>
        <p className="portal-onboarding-skill-picker__hint">
          {atLimit
            ? 'Llegaste al máximo. Quita una si quieres cambiar.'
            : fromCv.length > 0
              ? 'Elige hasta 3. Abajo van sugerencias según tu hoja de vida.'
              : 'Escribe para buscar, o toca una sugerencia.'}
        </p>
      </div>

      <div className="portal-onboarding-skill-picker__selected-block">
        <p className="portal-onboarding-skill-picker__block-label">Tus industrias</p>
        {selected.length > 0 ? (
          <ul className="portal-onboarding-skill-picker__selected" aria-label="Industrias elegidas">
            {selected.map((item) => (
              <li key={item} className="portal-onboarding-skill-picker__tag">
                <span>{item}</span>
                <button
                  type="button"
                  className="portal-onboarding-skill-picker__remove"
                  onClick={() => remove(item)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="portal-onboarding-skill-picker__empty">
            Todavía no elegiste ninguna. Empieza con las sugerencias de abajo.
          </p>
        )}
      </div>

      {!atLimit ? (
        <div className="portal-onboarding-skill-picker__composer">
          <p className="portal-onboarding-skill-picker__block-label">Buscar industria</p>
          <div className="portal-onboarding-skill-picker__input-wrap">
            <input
              ref={inputRef}
              className="portal-onboarding-field"
              value={query}
              placeholder="Ej. tecnología, salud, retail…"
              aria-label="Buscar industria"
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setOpen(false), 120);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filtered[0]) add(filtered[0]);
                  else handleSubmit();
                }
              }}
            />
            <button
              type="button"
              className="portal-onboarding-skill-picker__add"
              onClick={handleSubmit}
              disabled={!query.trim()}
            >
              Agregar
            </button>
          </div>

          {open && filtered.length > 0 ? (
            <ul className="portal-onboarding-skill-picker__suggestions" role="listbox">
              {filtered.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="portal-onboarding-skill-picker__suggestion"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {fromCv.length > 0 ? (
        <div className="portal-onboarding-skill-picker__quick">
          <p className="portal-onboarding-skill-picker__block-label">Según tu hoja de vida</p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {fromCv.map((item) => (
              <button
                key={item}
                type="button"
                className="portal-onboarding-chip portal-onboarding-chip--cv"
                onClick={() => add(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {morePicks.length > 0 ? (
        <div className="portal-onboarding-skill-picker__quick">
          <p className="portal-onboarding-skill-picker__block-label">
            {fromCv.length > 0 ? 'Otras industrias' : 'Sugerencias (toca para agregar)'}
          </p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {morePicks.map((item) => (
              <button
                key={item}
                type="button"
                className="portal-onboarding-chip"
                onClick={() => add(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
