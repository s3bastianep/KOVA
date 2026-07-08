'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, FileText, Loader2, Upload, X } from 'lucide-react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import { applyCvSuggestions } from '@/lib/cv-extract';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { enrichCvExtraction, uploadRegistroCv } from './registro-utils';
import { CV_FILE_ACCEPT } from '@/lib/cv-file-formats';

type CvImportPhase = 'offer' | 'uploading' | 'review' | 'done' | 'skipped';

type Props = {
  profile: CommercialProfile;
  candidateId?: string | null;
  resumeToken?: string | null;
  phase: CvImportPhase;
  onPhaseChange: (phase: CvImportPhase) => void;
  onSkip: () => void;
  onApply: (profile: CommercialProfile) => void;
  onFileCaptured?: (file: File) => void;
  leading?: boolean;
  compact?: boolean;
};

export function CvImportPanel({
  profile,
  candidateId,
  resumeToken,
  phase,
  onPhaseChange,
  onSkip,
  onApply,
  onFileCaptured,
  leading = false,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [extraction, setExtraction] = useState<CvExtractionResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const defaultSelected = useMemo(() => {
    if (!extraction) return new Set<string>();
    return new Set(extraction.reviewFields.filter((f) => f.defaultSelected).map((f) => f.key));
  }, [extraction]);

  const activeSelected = selected.size > 0 ? selected : defaultSelected;

  useEffect(() => {
    if (phase === 'review' && !extraction) {
      onPhaseChange('offer');
    }
  }, [phase, extraction, onPhaseChange]);

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setError('');
    onFileCaptured?.(file);
    onPhaseChange('uploading');
    try {
      const result = await uploadRegistroCv(file, candidateId, resumeToken);
      const aligned = enrichCvExtraction(result, profile);
      setExtraction(aligned);
      setSelected(new Set(aligned.reviewFields.filter((f) => f.defaultSelected).map((f) => f.key)));
      onPhaseChange('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos leer tu archivo.');
      onPhaseChange('offer');
    }
  };

  const toggleField = (key: string) => {
    setSelected((prev) => {
      const base = prev.size > 0 ? prev : new Set(defaultSelected);
      const next = new Set(base);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleApply = () => {
    if (!extraction) return;
    const keys = [...activeSelected];
    const nextProfile = applyCvSuggestions(profile, extraction.suggestions, keys) as CommercialProfile;
    onApply(nextProfile);
    onPhaseChange('done');
  };

  const handleRetry = () => {
    setExtraction(null);
    setSelected(new Set());
    setError('');
    onPhaseChange('offer');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (phase === 'done') return null;

  if (phase === 'skipped') return null;

  if (phase === 'review' && extraction) {
    return (
      <section className="kv-registro-cv" aria-labelledby="kv-cv-review-title">
        <div className="kv-registro-cv-head">
          <span className="kv-registro-cv-icon" aria-hidden>
            <FileText strokeWidth={2} />
          </span>
          <div>
            <h2 id="kv-cv-review-title" className="kv-registro-cv-title font-heading">
              Revisa lo que encontramos
            </h2>
            <p className="kv-registro-cv-sub">
              Marca solo lo que quieres aplicar. Siempre puedes editar cada campo después.
            </p>
          </div>
        </div>

        {extraction.warnings.length > 0 && (
          <ul className="kv-registro-cv-warnings">
            {extraction.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}

        {extraction.reviewFields.length === 0 ? (
          <div className="kv-registro-cv-empty-block">
            <p className="kv-registro-cv-empty">
              No detectamos datos claros en el archivo. Puedes probar otro archivo o completar el formulario manualmente.
            </p>
            <div className="kv-registro-cv-actions">
              <button type="button" className="kv-registro-btn-solid" onClick={handleRetry}>
                Probar con otro archivo
              </button>
              <button type="button" className="kv-registro-btn-ghost" onClick={onSkip}>
                Completar manualmente
              </button>
            </div>
          </div>
        ) : (
          <ul className="kv-registro-cv-fields">
            {extraction.reviewFields.map((field) => {
              const checked = activeSelected.has(field.key);
              return (
                <li key={field.key}>
                  <label className={`kv-registro-cv-field${checked ? ' kv-registro-cv-field--on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleField(field.key)}
                    />
                    <span className="kv-registro-cv-field-body">
                      <span className="kv-registro-cv-field-label">{field.label}</span>
                      <span className="kv-registro-cv-field-preview">{field.preview}</span>
                    </span>
                    <span className={`kv-registro-cv-confidence kv-registro-cv-confidence--${field.confidence}`}>
                      {field.confidence === 'high' ? 'Alta' : field.confidence === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {extraction.reviewFields.length > 0 && (
        <div className="kv-registro-cv-actions">
          <button
            type="button"
            className="kv-registro-btn-solid"
            disabled={activeSelected.size === 0}
            onClick={handleApply}
          >
            <Check strokeWidth={2} aria-hidden />
            Aplicar selección
          </button>
          <button
            type="button"
            className="kv-registro-btn-ghost"
            onClick={onSkip}
          >
            Omitir
          </button>
          <button type="button" className="kv-registro-btn-ghost" onClick={handleRetry}>
            Subir otro archivo
          </button>
        </div>
        )}
      </section>
    );
  }

  return (
    <section
      className={`kv-registro-cv${compact ? ' kv-registro-cv--compact' : ''}`}
      aria-labelledby="kv-cv-offer-title"
    >
      <div className="kv-registro-cv-head">
        <span className="kv-registro-cv-icon" aria-hidden>
          <Upload strokeWidth={2} />
        </span>
        <div>
          <h2 id="kv-cv-offer-title" className="kv-registro-cv-title font-heading">
            {compact ? 'Importar desde PDF' : leading ? 'Empieza con tu hoja de vida' : 'Ahorra tiempo con tu hoja de vida'}
          </h2>
          <p className="kv-registro-cv-sub">
            Sube tu hoja de vida en PDF o Word (.doc, .docx). Prellenamos contacto, experiencia y formación. Tú
            revisas y validas antes de guardar.
          </p>
        </div>
      </div>

      <div
        className={`kv-registro-cv-drop${phase === 'uploading' ? ' kv-registro-cv-drop--busy' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          void handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={CV_FILE_ACCEPT}
          className="kv-registro-cv-input"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {phase === 'uploading' ? (
          <div className="kv-registro-cv-drop-inner">
            <Loader2 className="kv-registro-cv-spin" strokeWidth={2} aria-hidden />
            <p>Leyendo tu archivo…</p>
          </div>
        ) : (
          <div className="kv-registro-cv-drop-inner">
            <FileText strokeWidth={2} aria-hidden />
            <p>
              <button type="button" className="kv-registro-cv-link" onClick={() => inputRef.current?.click()}>
                Selecciona un archivo
              </button>
              {' '}o arrástralo aquí
            </p>
            <p className="kv-registro-cv-hint">PDF, DOC o DOCX · máximo 5 MB · formato ATS recomendado</p>
          </div>
        )}
      </div>

      {error && (
        <p className="kv-registro-cv-error" role="alert">
          {error}
        </p>
      )}

      <div className="kv-registro-cv-actions">
        <button
          type="button"
          className="kv-registro-btn-ghost"
          onClick={onSkip}
        >
          <X strokeWidth={2} aria-hidden />
          Completar manualmente
        </button>
      </div>
    </section>
  );
}
