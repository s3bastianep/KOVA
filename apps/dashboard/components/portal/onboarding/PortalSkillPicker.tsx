'use client';

import { useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { normalizeSkillName, SKILL_SUGGESTIONS } from '@/lib/candidate-skills';

type Props = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

export function PortalSkillPicker({ skills, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => new Set(skills.map((skill) => skill.toLowerCase())),
    [skills],
  );

  const availableSuggestions = useMemo(
    () => SKILL_SUGGESTIONS.filter((skill) => !selected.has(skill.toLowerCase())),
    [selected],
  );

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableSuggestions.slice(0, 8);
    return availableSuggestions.filter((skill) => skill.toLowerCase().includes(q)).slice(0, 8);
  }, [availableSuggestions, query]);

  const quickPicks = useMemo(() => availableSuggestions.slice(0, 10), [availableSuggestions]);

  const addSkill = (raw: string) => {
    const normalized = normalizeSkillName(raw);
    if (!normalized || selected.has(normalized.toLowerCase())) return;
    onChange([...skills, normalized]);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((item) => item !== skill));
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const exact = filteredSuggestions.find((item) => item.toLowerCase() === trimmed.toLowerCase());
    addSkill(exact ?? trimmed);
  };

  return (
    <div className="portal-onboarding-skill-picker">
      {skills.length > 0 ? (
        <div>
          <p className="portal-onboarding-skill-picker__quick-label">
            {skills.length} agregada{skills.length === 1 ? '' : 's'}
          </p>
          <div className="portal-onboarding-skill-picker__selected" aria-label="Habilidades agregadas">
          {skills.map((skill) => (
            <span key={skill} className="portal-onboarding-skill-picker__tag">
              {skill}
              <button
                type="button"
                className="portal-onboarding-skill-picker__remove"
                aria-label={`Quitar ${skill}`}
                onClick={() => removeSkill(skill)}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </span>
          ))}
          </div>
        </div>
      ) : (
        <p className="portal-onboarding-muted">Aún no agregaste habilidades.</p>
      )}

      <div className="portal-onboarding-skill-picker__composer">
        <label className="portal-onboarding-work-field">
          <span className="portal-onboarding-work-field__label">Agregar habilidad</span>
          <div className="portal-onboarding-skill-picker__input-wrap">
            <input
              ref={inputRef}
              className="portal-onboarding-field"
              value={query}
              placeholder="Ej. negociación, Salesforce, cierre de ventas…"
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
              aria-label="Agregar habilidad"
              onClick={handleSubmit}
              disabled={!query.trim()}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </label>

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

      {quickPicks.length > 0 ? (
        <div className="portal-onboarding-skill-picker__quick">
          <p className="portal-onboarding-skill-picker__quick-label">Toca para agregar</p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {quickPicks.map((skill) => (
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
