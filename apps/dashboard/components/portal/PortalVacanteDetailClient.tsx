'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Send } from 'lucide-react';
import { ApplyMatchWizard } from './ApplyMatchWizard';
import { portalApi, type PortalVacancyDetail } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
import { stageLabel } from '@/lib/stages';

export function PortalVacanteDetailClient({ vacancyId }: { vacancyId: string }) {
  const router = useRouter();
  const cached = portalCacheGet<PortalVacancyDetail>(PORTAL_CACHE_KEYS.vacante(vacancyId));
  const [vacancy, setVacancy] = useState<PortalVacancyDetail | null>(cached ?? null);
  const [loading, setLoading] = useState(() => !cached);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    portalApi
      .vacante(vacancyId)
      .then(setVacancy)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar vacante'))
      .finally(() => setLoading(false));
  }, [vacancyId]);

  const openApplyFlow = () => {
    setError('');
    if (!vacancy?.questions.length) {
      void submitApplication({});
      return;
    }
    setWizardOpen(true);
  };

  const submitApplication = async (answers: Record<string, string | string[]>) => {
    if (!vacancy) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await portalApi.aplicar(vacancy.id, answers);
      setSuccess(res.message);
      setWizardOpen(false);
      setVacancy((prev) =>
        prev
          ? {
              ...prev,
              alreadyApplied: true,
              compatibility: res.compatibility,
              application: {
                id: res.applicationId,
                stage: res.stage,
                score: res.compatibility,
              },
            }
          : prev,
      );
      setTimeout(() => router.push('/portal/aplicaciones'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos registrar tu postulación');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !vacancy) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando vacante...
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center text-[var(--kova-muted)]">
        {error || 'Vacante no encontrada'}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        <Link
          href="/portal/vacantes"
          className="inline-flex items-center gap-2 text-sm text-[var(--kova-muted)] hover:text-[var(--kova-indigo)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a vacantes
        </Link>

        <div className="kova-card rounded-2xl border p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold rounded-full px-2.5 py-1 bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)]">
              {vacancy.compatibility}% compatibilidad
            </span>
            {vacancy.alreadyApplied && vacancy.application ? (
              <span className="text-xs rounded-full border px-2.5 py-1">
                Estado: {stageLabel(vacancy.application.stage)}
              </span>
            ) : null}
          </div>
          <h1 className="font-heading text-2xl font-bold">{vacancy.title}</h1>
          <p className="text-[var(--kova-muted)] mt-1">{vacancy.companyName}</p>
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-[var(--kova-muted)]">
            {vacancy.city ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {vacancy.city}
              </span>
            ) : null}
            {vacancy.modality ? <span>{vacancy.modality}</span> : null}
          </div>
          {vacancy.description ? (
            <p className="mt-4 text-sm leading-relaxed text-[var(--kova-muted)]">{vacancy.description}</p>
          ) : null}
        </div>

        {!vacancy.alreadyApplied && vacancy.questions.length > 0 ? (
          <div className="rounded-2xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/60 px-5 py-4 text-sm text-[var(--kova-navy-muted)]">
            Al aplicar te haremos hasta <strong className="text-[var(--kova-navy)]">7 preguntas</strong>{' '}
            sobre lo que busca este cargo para calcular tu compatibilidad.
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        ) : null}

        {error && !wizardOpen ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        {!vacancy.alreadyApplied ? (
          <button
            type="button"
            onClick={openApplyFlow}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando postulación...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Aplicar a esta vacante
              </>
            )}
          </button>
        ) : (
          <Link
            href="/portal/aplicaciones"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border"
          >
            Ver mis aplicaciones
          </Link>
        )}
      </div>

      <ApplyMatchWizard
        open={wizardOpen}
        vacancyTitle={vacancy.title}
        questions={vacancy.questions}
        submitting={submitting}
        error={wizardOpen ? error : undefined}
        onClose={() => {
          if (!submitting) {
            setWizardOpen(false);
            setError('');
          }
        }}
        onSubmit={submitApplication}
      />
    </>
  );
}
