'use client';

import { useState, type RefObject } from 'react';
import {
  CheckCircle2,
  FileSearch,
  FileText,
  ListChecks,
  Loader2,
  Lock,
  UploadCloud,
  X,
} from 'lucide-react';
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PortalOnboardingCvUpload({ inputRef, onFile, error, busy }: Props) {
  // Selecting a file only stages it — it no longer starts the analysis immediately. That gave
  // no way to back out of an accidental/wrong file before committing to the (slower) analysis
  // step. Now the candidate sees the file and explicitly confirms or swaps it first.
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const stageFile = (file: File | null | undefined) => {
    if (!file) return;
    setPendingFile(file);
  };

  const clearPending = () => {
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

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
          <p className="ob-cv-upload__note">
            <span className="ob-cv-upload__note-dot" aria-hidden />
            <span className="ob-cv-upload__note-label">Proceso 100% automático</span>
            <span className="ob-cv-upload__note-sep" aria-hidden>
              ·
            </span>
            <span className="ob-cv-upload__note-meta">Rápido, seguro y confidencial</span>
          </p>
        </header>

        <div className="ob-cv-upload__panel">
          {pendingFile ? (
            <div className="ob-cv-upload__staged">
              <span className="ob-cv-upload__icon" aria-hidden>
                <FileText className="h-7 w-7" />
              </span>
              <p className="ob-cv-upload__staged-name" title={pendingFile.name}>
                {pendingFile.name}
              </p>
              <p className="ob-cv-upload__staged-size">{formatFileSize(pendingFile.size)}</p>

              <div className="ob-cv-upload__staged-actions">
                <button
                  type="button"
                  className="ob-cv-upload__staged-change"
                  onClick={clearPending}
                  disabled={busy}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Cambiar archivo
                </button>
                <button
                  type="button"
                  className="ob-btn-solid ob-cv-upload__btn"
                  onClick={() => onFile(pendingFile)}
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Analizando…
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" aria-hidden />
                      Analizar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="ob-cv-upload__drop"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                stageFile(e.dataTransfer.files?.[0]);
              }}
            >
              <input
                ref={inputRef}
                id="portal-cv-file"
                type="file"
                accept={CV_FILE_ACCEPT}
                className="sr-only"
                onChange={(e) => stageFile(e.target.files?.[0])}
              />

              <span className="ob-cv-upload__icon" aria-hidden>
                <UploadCloud className="h-7 w-7" />
              </span>

              <p className="ob-cv-upload__prompt">
                Arrastra tu archivo aquí
                <span>o selecciónalo desde tu dispositivo</span>
              </p>

              <label htmlFor="portal-cv-file" className="ob-btn-solid ob-cv-upload__btn">
                <UploadCloud className="h-4 w-4" aria-hidden />
                Seleccionar archivo
              </label>

              <p className="ob-cv-upload__hint">PDF · Word · DOCX &nbsp;|&nbsp; Máximo 5 MB</p>
            </div>
          )}
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
