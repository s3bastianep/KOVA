'use client';

import type { RefObject } from 'react';
import { FileUp, Loader2, Lock, ShieldCheck, Upload } from 'lucide-react';
import { CV_FILE_ACCEPT } from '@/lib/cv-file-formats';

type Props = {
  journeyIndex: number;
  inputRef: RefObject<HTMLInputElement>;
  onFile: (file: File | null | undefined) => void;
  error?: string;
  busy?: boolean;
};

export function PortalOnboardingCvUpload({ journeyIndex, inputRef, onFile, error, busy }: Props) {
  const stepNumber = journeyIndex + 1;

  return (
    <div className="ob-cv-upload">
      <header className="ob-cv-upload__hero">
        <p className="ob-cv-upload__eyebrow">
          Paso {stepNumber} de 5 · Documentación
        </p>
        <h1>
          Sube tu <span className="ob-cv-upload__accent">hoja de vida</span>
        </h1>
        <p className="ob-cv-upload__lead">
          Extraeremos y estructuraremos tu experiencia profesional automáticamente.
        </p>
      </header>

      <div
        className={`ob-cv-upload__card${busy ? ' is-busy' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={inputRef}
          id="portal-cv-file"
          type="file"
          accept={CV_FILE_ACCEPT}
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <div className="ob-cv-upload__drop">
          <span className="ob-cv-upload__icon" aria-hidden>
            <FileUp className="h-6 w-6" />
          </span>

          <p className="ob-cv-upload__prompt">
            Arrastra tu <strong>hoja de vida</strong> aquí
            <br />
            o selecciona un archivo desde tu dispositivo
          </p>

          <label htmlFor="portal-cv-file" className="ob-btn-solid ob-cv-upload__btn">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Preparando análisis…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden />
                Selecciona un archivo
              </>
            )}
          </label>

          <p className="ob-cv-upload__hint">PDF · Word · DOCX · máximo 5 MB</p>
        </div>
      </div>

      {error ? (
        <p className="portal-onboarding-error ob-cv-upload__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="ob-cv-upload__secure">
        <Lock className="h-4 w-4 ob-cv-upload__secure-icon" aria-hidden />
        <div>
          <strong>Tu información está segura</strong>
          <span>Solo la usamos para construir tu perfil y mostrarte mejores oportunidades</span>
        </div>
        <ShieldCheck className="h-5 w-5 ob-cv-upload__secure-badge" aria-hidden />
      </div>
    </div>
  );
}
