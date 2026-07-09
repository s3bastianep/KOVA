'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { portalApi, type PortalApplication } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
import { candidatePipelineProgress, stageStyle } from '@/lib/stages';

type ViewFilter = 'activas' | 'cerradas' | 'todas';

function matchTone(score: number): { label: string; bg: string; text: string; ring: string } {
  if (score >= 85) {
    return {
      label: 'Excelente match',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      ring: 'ring-emerald-200/70',
    };
  }
  if (score >= 70) {
    return {
      label: 'Buen match',
      bg: 'bg-[var(--kova-blue-soft)]',
      text: 'text-[var(--kova-blue)]',
      ring: 'ring-[var(--kova-blue)]/15',
    };
  }
  return {
    label: 'Match moderado',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    ring: 'ring-amber-200/70',
  };
}

function PipelineProgress({ stage, rejected }: { stage: string; rejected: boolean }) {
  if (rejected) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3">
        <p className="text-xs font-semibold text-red-800">Proceso cerrado</p>
        <p className="mt-0.5 text-xs text-red-700/80">Esta postulación ya no está activa.</p>
      </div>
    );
  }

  const progress = candidatePipelineProgress(stage);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-[var(--kova-navy-muted)]">
          {progress.label} · {progress.message}
        </span>
        <span className="font-mono text-[var(--kova-muted)]">{progress.percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--kova-line)]">
        <div
          className="h-full rounded-full transition-[width] duration-200 ease-out"
          style={{
            width: `${progress.percent}%`,
            background: 'linear-gradient(90deg, var(--kova-blue), var(--kova-lime-dark))',
          }}
        />
      </div>
      <div className="hidden gap-1 sm:flex">
        {Array.from({ length: progress.totalPhases }).map((_, i) => {
          const done = progress.phaseIndex >= i;
          const current = progress.phaseIndex === i;
          return (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-150 ${
                current
                  ? 'bg-[var(--kova-lime)]'
                  : done
                    ? 'bg-[var(--kova-blue)]/40'
                    : 'bg-[var(--kova-line)]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

const ApplicationCard = memo(function ApplicationCard({ app }: { app: PortalApplication }) {
  const style = stageStyle(app.stage);
  const match = matchTone(app.compatibility);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--kova-border)] bg-white shadow-[var(--kova-shadow-xs)] transition-[border-color,box-shadow] duration-150 hover:border-[var(--kova-border-strong)] hover:shadow-[var(--kova-shadow-md)]">
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: app.rejected ? '#DC2626' : style.color }}
        aria-hidden
      />

      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: style.bg, color: style.color }}
              >
                {app.stageLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${match.bg} ${match.text} ${match.ring}`}
              >
                <Target className="h-3 w-3" />
                {app.compatibility}% match
              </span>
              {app.rejected ? (
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                  Cerrada
                </span>
              ) : null}
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold leading-snug tracking-tight">{app.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--kova-navy-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 opacity-60" />
                  {app.companyName}
                </span>
                {app.city ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 opacity-60" />
                    {app.city}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3 py-1 text-xs text-[var(--kova-navy-muted)]">
                <Calendar className="h-3 w-3 opacity-60" />
                Aplicaste el{' '}
                {new Date(app.appliedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3 py-1 text-xs text-[var(--kova-navy-muted)]">
                <Clock className="h-3 w-3 opacity-60" />
                Actualizado{' '}
                {new Date(app.updatedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
              </span>
            </div>

            <PipelineProgress stage={app.stage} rejected={app.rejected} />

            {app.rejectReason ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                Motivo: {app.rejectReason}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <div
              className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-2xl ring-1 ${match.bg} ${match.ring}`}
            >
              <span className={`font-heading text-2xl font-bold leading-none ${match.text}`}>
                {app.compatibility}
              </span>
              <span className="mt-0.5 text-[9px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                Match
              </span>
            </div>
            <Link
              href={`/portal/vacantes/${app.vacancyId}`}
              prefetch
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform duration-150 hover:scale-[1.02]"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              Ver vacante
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});

function FilterTab({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
        active
          ? 'bg-white text-[var(--kova-navy)] shadow-[var(--kova-shadow-xs)] ring-1 ring-[var(--kova-border)]'
          : 'text-[var(--kova-muted)] hover:text-[var(--kova-navy)]'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
          active ? 'bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]' : 'bg-[var(--kova-surface-2)]'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export function PortalAplicacionesClient() {
  const cached = portalCacheGet<{ aplicaciones: PortalApplication[] }>(PORTAL_CACHE_KEYS.aplicaciones);
  const [aplicaciones, setAplicaciones] = useState<PortalApplication[]>(() => cached?.aplicaciones ?? []);
  const [loading, setLoading] = useState(() => !cached);
  const [error, setError] = useState('');
  const [view, setView] = useState<ViewFilter>('activas');

  useEffect(() => {
    portalApi
      .aplicaciones()
      .then((data) => setAplicaciones(data.aplicaciones))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar aplicaciones'))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      activas: aplicaciones.filter((a) => !a.rejected).length,
      cerradas: aplicaciones.filter((a) => a.rejected).length,
      todas: aplicaciones.length,
    }),
    [aplicaciones],
  );

  const avgMatch = useMemo(() => {
    if (aplicaciones.length === 0) return 0;
    const sum = aplicaciones.reduce((acc, a) => acc + a.compatibility, 0);
    return Math.round(sum / aplicaciones.length);
  }, [aplicaciones]);

  const visibleApplications = aplicaciones.filter((app) => {
    if (view === 'todas') return true;
    if (view === 'cerradas') return app.rejected;
    return !app.rejected;
  });

  if (loading && aplicaciones.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando aplicaciones...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="kova-card relative overflow-hidden rounded-3xl border p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle at top right, var(--kova-lime), transparent 55%), radial-gradient(circle at bottom left, var(--kova-indigo), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kova-portal-eyebrow">Seguimiento</p>
            <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Postulaciones</h1>
            <p className="kova-portal-body mt-2 max-w-xl">
              Sigue el avance de tus postulaciones, etapa por etapa, y revisa tu compatibilidad con cada
              vacante.
            </p>
          </div>

          {aplicaciones.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">Activas</p>
                <p className="font-heading text-xl font-bold text-[var(--kova-blue)]">{counts.activas}</p>
              </div>
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                  Match prom.
                </p>
                <p className="font-heading text-xl font-bold">{avgMatch}%</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {aplicaciones.length > 0 ? (
        <div className="inline-flex rounded-2xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/80 p-1.5">
          <FilterTab
            active={view === 'activas'}
            count={counts.activas}
            label="Activas"
            onClick={() => setView('activas')}
          />
          <FilterTab
            active={view === 'cerradas'}
            count={counts.cerradas}
            label="Cerradas"
            onClick={() => setView('cerradas')}
          />
          <FilterTab
            active={view === 'todas'}
            count={counts.todas}
            label="Todas"
            onClick={() => setView('todas')}
          />
        </div>
      ) : null}

      {visibleApplications.length === 0 ? (
        <div className="kova-card rounded-3xl border p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]">
            <Briefcase className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-lg font-semibold">
            {aplicaciones.length === 0 ? 'Sin aplicaciones aún' : 'Nada en este filtro'}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[var(--kova-muted)]">
            {aplicaciones.length === 0
              ? 'Explora vacantes compatibles con tu perfil comercial y postula en minutos.'
              : 'Prueba otro filtro para ver tus postulaciones.'}
          </p>
          {aplicaciones.length === 0 ? (
            <Link
              href="/portal/vacantes"
              prefetch
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform duration-150 hover:scale-[1.02]"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              <Sparkles className="h-4 w-4" />
              Explorar vacantes
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-5 py-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kova-indigo)]" />
              <p className="text-sm text-[var(--kova-muted)]">
                Mejora tu match completando experiencia, formación y preferencias laborales.
              </p>
            </div>
            <Link
              href="/portal/vacantes"
              prefetch
              className="shrink-0 text-sm font-semibold text-[var(--kova-indigo)] hover:underline"
            >
              Ver vacantes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
