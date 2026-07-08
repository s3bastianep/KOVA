'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Send } from 'lucide-react';
import { portalApi, type PortalVacancyDetail } from '@/lib/api';
import { stageLabel } from '@/lib/stages';

export function PortalVacanteDetailClient({ vacancyId }: { vacancyId: string }) {
  const router = useRouter();
  const [vacancy, setVacancy] = useState<PortalVacancyDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  useEffect(() => {
    portalApi
      .vacante(vacancyId)
      .then((data) => {
        setVacancy(data);
        const initial: Record<string, string | string[]> = {};
        for (const q of data.questions) {
          if (q.suggestedValue) initial[q.id] = q.suggestedValue;
        }
        setAnswers(initial);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar vacante'))
      .finally(() => setLoading(false));
  }, [vacancyId]);

  const updateAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const submit = async () => {
    if (!vacancy) return;
    setTouchedSubmit(true);
    if (!allQuestionsAnswered) {
      setError('Responde todas las preguntas requeridas antes de aplicar.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await portalApi.aplicar(vacancy.id, answers);
      setSuccess(res.message);
      setVacancy((prev) =>
        prev
          ? {
              ...prev,
              alreadyApplied: true,
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

  const allQuestionsAnswered =
    !vacancy?.questions.length ||
    vacancy.questions.every((question) => {
      const value = answers[question.id];
      if (question.inputType === 'multiselect') return Array.isArray(value) && value.length > 0;
      return typeof value === 'string' && value.trim().length > 0;
    });

  if (loading) {
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

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {!vacancy.alreadyApplied && vacancy.questions.length > 0 ? (
        <section className="kova-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Preguntas de compatibilidad</h2>
          <p className="text-sm text-[var(--kova-muted)]">
            Prellenamos lo que ya tenemos de tu perfil. Ajusta si hace falta antes de aplicar.
          </p>
          {vacancy.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="text-sm font-medium">{question.label}</label>
              {question.inputType === 'multiselect' ? (
                <div className="grid sm:grid-cols-2 gap-2">
                  {question.options.map((opt) => {
                    const selected = Array.isArray(answers[question.id])
                      ? (answers[question.id] as string[]).includes(opt)
                      : false;
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm rounded-lg border px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = Array.isArray(answers[question.id])
                              ? [...(answers[question.id] as string[])]
                              : [];
                            const next = e.target.checked
                              ? [...current, opt]
                              : current.filter((item) => item !== opt);
                            updateAnswer(question.id, next);
                          }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <select
                  value={typeof answers[question.id] === 'string' ? (answers[question.id] as string) : ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
                >
                  <option value="">Selecciona...</option>
                  {question.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          {touchedSubmit && !allQuestionsAnswered ? (
            <p className="text-xs text-red-700">Debes completar todas las preguntas para continuar.</p>
          ) : null}
        </section>
      ) : null}

      {!vacancy.alreadyApplied ? (
        <button
          type="button"
          onClick={submit}
          disabled={submitting || !allQuestionsAnswered}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
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
  );
}
