'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, FileText, Loader2 } from 'lucide-react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { portalApi, type PortalCvSummary } from '@/lib/api';
import { CvImportPanel } from '@/app/registro/CvImportPanel';
import '@/app/registro/registro.css';

type CvImportPhase = 'offer' | 'uploading' | 'review' | 'done' | 'skipped';

export function PortalDocumentosClient() {
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [cv, setCv] = useState<PortalCvSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cvPhase, setCvPhase] = useState<CvImportPhase>('offer');
  const [applyMessage, setApplyMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    portalApi
      .perfil()
      .then((data) => {
        setProfile(data.profile as CommercialProfile);
        setCandidateId(data.candidateId);
        setCv(data.cv);
        if (data.cv) setCvPhase('done');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadCv = async (file: File): Promise<CvExtractionResult> => {
    const result = await portalApi.uploadCv(file);
    if (result.cv) setCv(result.cv as PortalCvSummary);
    return result as CvExtractionResult;
  };

  const handleApply = async (nextProfile: CommercialProfile) => {
    setSaving(true);
    setApplyMessage('');
    try {
      await portalApi.updatePerfil(nextProfile as Record<string, unknown>);
      setProfile(nextProfile);
      setCvPhase('done');
      setApplyMessage('Datos aplicados a tu perfil. Revisa Experiencia y Formación si importaste historial.');
    } catch (err) {
      setApplyMessage(err instanceof Error ? err.message : 'No pudimos guardar los datos importados');
      setCvPhase('review');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await portalApi.downloadCv();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setApplyMessage(err instanceof Error ? err.message : 'No pudimos abrir tu archivo');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando documentos...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center text-[var(--kova-muted)]">
        {error || 'No pudimos cargar tu perfil'}
      </div>
    );
  }

  return (
    <div className="kv-registro space-y-8 max-w-3xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Documentos
        </p>
        <h1 className="font-heading text-2xl font-bold">Hoja de vida</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Sube PDF o Word. Revisamos el contenido y tú eliges qué datos aplicar a tu perfil.
        </p>
      </div>

      {cv && cvPhase === 'done' ? (
        <div className="kova-card rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)] shrink-0">
              <FileText className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="font-medium truncate">{cv.fileName}</p>
              <p className="text-sm text-[var(--kova-muted)]">
                {cv.importedAt
                  ? `Subida el ${new Date(cv.importedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}`
                  : 'Archivo guardado'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Ver archivo
            </button>
            <button
              type="button"
              onClick={() => setCvPhase('offer')}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              Subir otra versión
            </button>
          </div>
        </div>
      ) : null}

      {applyMessage ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
            applyMessage.includes('aplicados')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {applyMessage}{' '}
            {applyMessage.includes('aplicados') ? (
              <Link href="/portal/experiencia" className="font-semibold underline">
                Ver experiencia
              </Link>
            ) : null}
          </span>
        </div>
      ) : null}

      {saving ? (
        <div className="flex items-center gap-2 text-sm text-[var(--kova-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Guardando datos importados...
        </div>
      ) : null}

      {cvPhase !== 'done' ? (
        <CvImportPanel
          profile={profile}
          candidateId={candidateId}
          phase={cvPhase}
          onPhaseChange={setCvPhase}
          onSkip={() => setCvPhase('skipped')}
          onApply={handleApply}
          uploadCv={uploadCv}
          leading
        />
      ) : null}

      {cvPhase === 'skipped' ? (
        <div className="kova-card rounded-2xl border p-6">
          <p className="text-[var(--kova-muted)] mb-4">
            Puedes completar tu perfil manualmente en los módulos de Experiencia y Formación.
          </p>
          <button
            type="button"
            onClick={() => setCvPhase(cv ? 'done' : 'offer')}
            className="text-sm font-semibold text-[var(--kova-indigo)] hover:underline"
          >
            {cv ? 'Volver al archivo guardado' : 'Subir hoja de vida'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
