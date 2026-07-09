'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Filter,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { portalApi, type PortalVacancyListItem } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';

type SortOption = 'match_desc' | 'match_asc' | 'title';

type MatchTone = {
  label: string;
  badgeClass: string;
  scoreClass: string;
  accent: string;
};

function matchTone(score: number): MatchTone {
  if (score >= 80) {
    return {
      label: 'Alta',
      badgeClass:
        'border-[var(--kova-border)] bg-[var(--kova-green-soft)] text-[var(--kova-green)] ring-[var(--kova-border)]',
      scoreClass: 'border-[var(--kova-border)] bg-[var(--kova-green-soft)] text-[var(--kova-green)]',
      accent: 'var(--kova-lime-dark)',
    };
  }
  if (score >= 60) {
    return {
      label: 'Media',
      badgeClass:
        'border-[var(--kova-border)] bg-[var(--kova-blue-soft)] text-[var(--kova-blue)] ring-[var(--kova-border)]',
      scoreClass: 'border-[var(--kova-border)] bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]',
      accent: 'var(--kova-blue)',
    };
  }
  return {
    label: 'Explorar',
    badgeClass:
      'border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)] ring-[var(--kova-border)]',
    scoreClass: 'border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]',
    accent: 'var(--kova-navy-muted)',
  };
}

const selectClass =
  'w-full rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-[var(--kova-ring)]';

const VacancyCard = memo(function VacancyCard({ vacancy }: { vacancy: PortalVacancyListItem }) {
  const tone = matchTone(vacancy.compatibility);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--kova-border)] bg-white shadow-[var(--kova-shadow-xs)] transition-[border-color,box-shadow] duration-150 hover:border-[var(--kova-border-strong)] hover:shadow-[var(--kova-shadow-md)]">
      <div className="absolute inset-y-0 left-0 w-1" style={{ background: tone.accent }} aria-hidden />

      <div className="flex flex-col gap-5 p-5 pl-6 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pl-7">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone.badgeClass}`}
            >
              <Target className="h-3 w-3" />
              {vacancy.compatibility}% · {tone.label}
            </span>
            {vacancy.alreadyApplied ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--kova-border)] bg-[var(--kova-green-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--kova-green)]">
                <CheckCircle2 className="h-3 w-3" />
                Ya aplicaste
              </span>
            ) : null}
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold leading-snug tracking-tight">{vacancy.title}</h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--kova-navy-muted)]">
              <Building2 className="h-3.5 w-3.5 shrink-0 opacity-60" />
              {vacancy.companyName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {vacancy.city ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3 py-1 text-xs text-[var(--kova-navy-muted)]">
                <MapPin className="h-3 w-3 opacity-60" />
                {vacancy.city}
              </span>
            ) : null}
            {vacancy.modality ? (
              <span className="inline-flex rounded-full border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3 py-1 text-xs text-[var(--kova-navy-muted)]">
                {vacancy.modality}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-4">
          <div
            className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border ${tone.scoreClass}`}
          >
            <span className="font-heading text-2xl font-bold leading-none">{vacancy.compatibility}</span>
            <span className="mt-0.5 text-[9px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
              Match
            </span>
          </div>
          <Link
            href={`/portal/vacantes/${vacancy.id}`}
            prefetch
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform duration-150 hover:scale-[1.02]"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            {vacancy.alreadyApplied ? 'Ver estado' : 'Ver y aplicar'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
});

function CardListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-40 animate-pulse rounded-2xl border bg-white" />
      ))}
    </div>
  );
}

export function PortalVacantesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const cachedVacantes = portalCacheGet<{ vacantes: PortalVacancyListItem[] }>(PORTAL_CACHE_KEYS.vacantes(0));
  const [vacantes, setVacantes] = useState<PortalVacancyListItem[]>(() => cachedVacantes?.vacantes ?? []);
  const [loading, setLoading] = useState(() => !cachedVacantes);
  const [error, setError] = useState('');
  const [showApplied, setShowApplied] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('match_desc');
  const [queryReady, setQueryReady] = useState(false);
  const skipUrlSync = useRef(true);

  useEffect(() => {
    portalApi
      .vacantes()
      .then((data) => setVacantes(data.vacantes))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar vacantes'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySort = params.get('sort');
    if (querySort === 'match_desc' || querySort === 'match_asc' || querySort === 'title') {
      setSortBy(querySort);
    }
    setSelectedCity(params.get('city') ?? '');
    setSelectedModality(params.get('modality') ?? '');
    setShowApplied(params.get('applied') === '1');
    setQueryReady(true);
  }, []);

  useEffect(() => {
    if (!queryReady) return;
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    const next = new URLSearchParams();
    if (sortBy !== 'match_desc') next.set('sort', sortBy);
    if (selectedCity) next.set('city', selectedCity);
    if (selectedModality) next.set('modality', selectedModality);
    if (showApplied) next.set('applied', '1');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sortBy, selectedCity, selectedModality, showApplied, router, pathname, queryReady]);

  const cities = useMemo(
    () => [...new Set(vacantes.map((v) => v.city).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b)),
    [vacantes],
  );
  const modalities = useMemo(
    () =>
      [...new Set(vacantes.map((v) => v.modality).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b),
      ),
    [vacantes],
  );

  const filteredVacantes = useMemo(() => {
    const rows = vacantes.filter((v) => {
      if (!showApplied && v.alreadyApplied) return false;
      if (selectedCity && v.city !== selectedCity) return false;
      if (selectedModality && v.modality !== selectedModality) return false;
      return true;
    });

    if (sortBy === 'match_desc') return [...rows].sort((a, b) => b.compatibility - a.compatibility);
    if (sortBy === 'match_asc') return [...rows].sort((a, b) => a.compatibility - b.compatibility);
    return [...rows].sort((a, b) => a.title.localeCompare(b.title));
  }, [vacantes, showApplied, selectedCity, selectedModality, sortBy]);

  const stats = useMemo(() => {
    const highMatch = vacantes.filter((v) => v.compatibility >= 80).length;
    const avg =
      vacantes.length > 0
        ? Math.round(vacantes.reduce((acc, v) => acc + v.compatibility, 0) / vacantes.length)
        : 0;
    return { total: vacantes.length, highMatch, avg };
  }, [vacantes]);

  const hasActiveFilters = Boolean(selectedCity || selectedModality || showApplied || sortBy !== 'match_desc');
  const listLoading = loading && vacantes.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="kova-card relative overflow-hidden rounded-3xl border p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle at top right, var(--kova-lime), transparent 55%), radial-gradient(circle at bottom left, var(--kova-blue), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
              Oportunidades
            </p>
            <h1 className="font-heading text-2xl font-bold lg:text-3xl">Vacantes compatibles</h1>
            <p className="mt-2 max-w-xl text-[var(--kova-muted)]">
              Vacantes ordenadas por compatibilidad con tu perfil comercial. Aplica en un clic y sigue tu
              proceso desde aplicaciones.
            </p>
          </div>

          {vacantes.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                  Disponibles
                </p>
                <p className="font-heading text-xl font-bold">{stats.total}</p>
              </div>
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                  Alta compat.
                </p>
                <p className="font-heading text-xl font-bold text-[var(--kova-green)]">{stats.highMatch}</p>
              </div>
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                  Match prom.
                </p>
                <p className="font-heading text-xl font-bold">{stats.avg}%</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-4 py-3 text-sm text-[var(--kova-navy)]"
        >
          {error}
        </div>
      ) : null}

      {listLoading ? (
        <CardListSkeleton />
      ) : vacantes.length > 0 ? (
        <>
          <div className="rounded-2xl border border-[var(--kova-border)] bg-white p-4 shadow-[var(--kova-shadow-xs)]">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--kova-navy)]">
              <SlidersHorizontal className="h-4 w-4 text-[var(--kova-blue)]" />
              Filtros
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-[var(--kova-muted)]">Ordenar</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className={selectClass}>
                  <option value="match_desc">Mayor match</option>
                  <option value="match_asc">Menor match</option>
                  <option value="title">Por título</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-[var(--kova-muted)]">Ciudad</span>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={selectClass}>
                  <option value="">Todas las ciudades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-[var(--kova-muted)]">Modalidad</span>
                <select
                  value={selectedModality}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todas las modalidades</option>
                  {modalities.map((modality) => (
                    <option key={modality} value={modality}>
                      {modality}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex h-full min-h-[70px] cursor-pointer items-center gap-3 rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-3.5 py-2.5">
                <input
                  type="checkbox"
                  checked={showApplied}
                  onChange={(e) => setShowApplied(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--kova-border-strong)]"
                />
                <span className="text-sm font-medium leading-snug">Mostrar ya aplicadas</span>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--kova-border)] pt-4">
              <p className="text-sm text-[var(--kova-muted)]">
                Mostrando <strong className="font-semibold text-[var(--kova-navy)]">{filteredVacantes.length}</strong>{' '}
                de {vacantes.length} vacantes
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('');
                    setSelectedModality('');
                    setShowApplied(false);
                    setSortBy('match_desc');
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--kova-blue)] hover:underline"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          </div>

          {filteredVacantes.length === 0 ? (
            <div className="kova-card rounded-3xl border p-10 text-center">
              <h2 className="font-heading text-lg font-semibold">Ningún resultado</h2>
              <p className="mx-auto mt-2 max-w-sm text-[var(--kova-muted)]">
                Ajusta los filtros o incluye vacantes ya aplicadas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('');
                  setSelectedModality('');
                  setShowApplied(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVacantes.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} />
              ))}

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kova-blue)]" />
                  <p className="text-sm text-[var(--kova-muted)]">
                    ¿Quieres más matches? Refina tu experiencia, formación y preferencias comerciales.
                  </p>
                </div>
                <Link
                  href="/portal/preferencias"
                  prefetch
                  className="shrink-0 text-sm font-semibold text-[var(--kova-blue)] hover:underline"
                >
                  Mejorar perfil
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="kova-card rounded-3xl border p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]">
            <Briefcase className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-lg font-semibold">Sin vacantes por ahora</h2>
          <p className="mx-auto mt-2 max-w-sm text-[var(--kova-muted)]">
            Completa tus preferencias laborales para desbloquear recomendaciones personalizadas.
          </p>
          <Link
            href="/portal/preferencias"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:scale-[1.02]"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            <Sparkles className="h-4 w-4" />
            Completar preferencias
          </Link>
        </div>
      )}
    </div>
  );
}
