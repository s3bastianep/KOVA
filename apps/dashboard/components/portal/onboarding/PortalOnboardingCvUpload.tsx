'use client';

import type { RefObject } from 'react';
import { CheckCircle2, FileSearch, ListChecks, Loader2, Lock, Sparkles, UploadCloud } from 'lucide-react';
import { CV_FILE_ACCEPT } from '@/lib/cv-file-formats';

type Props = {
  journeyIndex: number;
  inputRef: RefObject<HTMLInputElement>;
  onFile: (file: File | null | undefined) => void;
  error?: string;
  busy?: boolean;
};

const STEPS = [
  {
    icon: FileSearch,
    title: 'Extraemos la información',
    detail: 'De tu experiencia, formación, habilidades y logros.',
  },
  {
    icon: ListChecks,
    title: 'La organizamos',
    detail: 'Estructuramos todo para que sea fácil de revisar y editar.',
  },
  {
    icon: CheckCircle2,
    title: 'Tú confirmas',
    detail: 'Revisa los datos y confírmalo antes de continuar.',
  },
] as const;

export function PortalOnboardingCvUpload({ inputRef, onFile, error, busy }: Props) {
  return (
    <div className="ob-cv-upload">
      <div className="ob-cv-upload__top">
        <header className="ob-cv-upload__hero">
          <h1>
            Sube tu
            <br />
            <span className="ob-cv-upload__accent">hoja de vida</span>
          </h1>
          <p className="ob-cv-upload__lead">
            La leemos y estructuramos tu experiencia automáticamente. Tú solo revisas y confirmas.
          </p>
          <div className="ob-cv-upload__note">
            <span className="ob-cv-upload__note-icon" aria-hidden>
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <strong>Proceso 100% automático</strong>
              <span>Rápido, seguro y confidencial</span>
            </div>
          </div>
        </header>

        <div className="ob-cv-upload__panel">
          <div
            className={`ob-cv-upload__drop${busy ? ' is-busy' : ''}`}
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

            <span className="ob-cv-upload__icon" aria-hidden>
              <UploadCloud className="h-7 w-7" />
            </span>

            <p className="ob-cv-upload__prompt">
              Arrastra tu archivo aquí
              <span>o selecciónalo desde tu dispositivo</span>
            </p>

            <label htmlFor="portal-cv-file" className="ob-btn-solid ob-cv-upload__btn">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Preparando análisis…
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" aria-hidden />
                  Seleccionar archivo
                </>
              )}
            </label>

            <p className="ob-cv-upload__hint">PDF · Word · DOCX &nbsp;|&nbsp; Máximo 5 MB</p>
          </div>
        </div>
      </div>

      {error ? (
        <p className="portal-onboarding-error ob-cv-upload__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="ob-cv-upload__steps">
        {STEPS.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="ob-cv-upload__step">
            <span className="ob-cv-upload__step-icon" aria-hidden>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ob-cv-upload__secure">
        <Lock className="h-3.5 w-3.5 ob-cv-upload__secure-icon" aria-hidden />
        <span>
          <strong>Tu información es privada y segura.</strong> Solo la usamos para construir tu
          perfil.
        </span>
      </div>
    </div>
  );
}
