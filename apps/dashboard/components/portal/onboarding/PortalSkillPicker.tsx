'use client';

import { useMemo, useRef, useState } from 'react';
import { MAX_PORTAL_SKILLS, normalizeSkillName, SKILL_SUGGESTIONS } from '@/lib/candidate-skills';

export { MAX_PORTAL_SKILLS };

type Props = {
  skills: string[];
  onChange: (skills: string[]) => void;
  max?: number;
  /** Skills inferred from the CV / experience — shown first. */
  cvSuggestions?: string[];
};

export function PortalSkillPicker({
  skills,
  onChange,
  max = MAX_PORTAL_SKILLS,
  cvSuggestions = [],
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = skills.length >= max;
  const selected = useMemo(
    () => new Set(skills.map((skill) => skill.toLowerCase())),
    [skills],
  );

  const fromCv = useMemo(() => {
    if (atLimit) return [];
    return cvSuggestions
      .map(normalizeSkillName)
      .filter((skill) => skill && !selected.has(skill.toLowerCase()))
      .filter((skill, i, arr) => arr.findIndex((s) => s.toLowerCase() === skill.toLowerCase()) === i)
      .slice(0, 6);
  }, [atLimit, cvSuggestions, selected]);

  const fromCvSet = useMemo(() => new Set(fromCv.map((s) => s.toLowerCase())), [fromCv]);

  const availableSuggestions = useMemo(
    () =>
      SKILL_SUGGESTIONS.filter(
        (skill) => !selected.has(skill.toLowerCase()) && !fromCvSet.has(skill.toLowerCase()),
      ),
    [selected, fromCvSet],
  );

  const filteredSuggestions = useMemo(() => {
    if (atLimit) return [];
    const q = query.trim().toLowerCase();
    const pool = [...fromCv, ...availableSuggestions];
    if (!q) return pool.slice(0, 6);
    return pool.filter((skill) => skill.toLowerCase().includes(q)).slice(0, 6);
  }, [availableSuggestions, atLimit, fromCv, query]);

  const morePicks = useMemo(
    () => (atLimit ? [] : availableSuggestions.slice(0, 8)),
    [availableSuggestions, atLimit],
  );

  const addSkill = (raw: string) => {
    if (atLimit) return;
    const normalized = normalizeSkillName(raw);
    if (!normalized || selected.has(normalized.toLowerCase())) return;
    onChange([...skills, normalized].slice(0, max));
    setQuery('');
    setOpen(false);
    inputRef.current?.focus({ preventScroll: true });
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((item) => item !== skill));
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || atLimit) return;
    const exact = filteredSuggestions.find((item) => item.toLowerCase() === trimmed.toLowerCase());
    addSkill(exact ?? trimmed);
  };

  return (
    <div className="portal-onboarding-skill-picker">
      <div className="portal-onboarding-skill-picker__head">
        <p className="portal-onboarding-skill-picker__count" aria-live="polite">
          <strong>
            {skills.length} de {max}
          </strong>{' '}
          habilidades
        </p>
        <p className="portal-onboarding-skill-picker__hint">
          {atLimit
            ? 'Llegaste al máximo. Quita una si quieres cambiar.'
            : fromCv.length > 0
              ? `Máximo ${max}. Abajo: sugerencia según tu hoja de vida.`
              : `Máximo ${max}. Escribe una o toca una sugerencia.`}
        </p>
      </div>

      <div className="portal-onboarding-skill-picker__selected-block">
        <p className="portal-onboarding-skill-picker__block-label">Tus habilidades</p>
        {skills.length > 0 ? (
          <ul className="portal-onboarding-skill-picker__selected" aria-label="Habilidades agregadas">
            {skills.map((skill) => (
              <li key={skill} className="portal-onboarding-skill-picker__tag">
                <span>{skill}</span>
                <button
                  type="button"
                  className="portal-onboarding-skill-picker__remove"
                  onClick={() => removeSkill(skill)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="portal-onboarding-skill-picker__empty">
            Todavía no agregaste ninguna. Empieza con las sugerencias de abajo.
          </p>
        )}
      </div>

      {!atLimit ? (
        <div className="portal-onboarding-skill-picker__composer">
          <p className="portal-onboarding-skill-picker__block-label">Agregar otra</p>
          <div className="portal-onboarding-skill-picker__input-wrap">
            <input
              ref={inputRef}
              className="portal-onboarding-field"
              value={query}
              placeholder="Ej. negociación, Salesforce…"
              aria-label="Escribe una habilidad"
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
                  if (filteredSuggestions[0]) addSkill(filteredSuggestions[0]);
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

          {open && filteredSuggestions.length > 0 ? (
            <ul className="portal-onboarding-skill-picker__suggestions" role="listbox">
              {filteredSuggestions.map((skill) => (
                <li key={skill}>
                  <button
                    type="button"
                    className="portal-onboarding-skill-picker__suggestion"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {fromCv.length > 0 ? (
        <div className="portal-onboarding-skill-picker__quick">
          <p className="portal-onboarding-skill-picker__block-label">
            Sugerencia según tu hoja de vida
          </p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {fromCv.map((skill) => (
              <button
                key={skill}
                type="button"
                className="portal-onboarding-chip portal-onboarding-chip--cv"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {morePicks.length > 0 ? (
        <div className="portal-onboarding-skill-picker__quick">
          <p className="portal-onboarding-skill-picker__block-label">
            {fromCv.length > 0 ? 'Otras sugerencias' : 'Sugerencias (toca para agregar)'}
          </p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {morePicks.map((skill) => (
              <button
                key={skill}
                type="button"
                className="portal-onboarding-chip"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
