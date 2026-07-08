'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, MapPin, Sparkles } from 'lucide-react';
import { portalApi, type PortalVacancyListItem } from '@/lib/api';

function matchTone(score: number) {
  if (score >= 80) return { label: 'Alta', className: 'bg-emerald-100 text-emerald-800' };
  if (score >= 60) return { label: 'Media', className: 'bg-amber-100 text-amber-900' };
  return { label: 'Explorar', className: 'bg-slate-100 text-slate-700' };
}

export function PortalVacantesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [vacantes, setVacantes] = useState<PortalVacancyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplied, setShowApplied] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [sortBy, setSortBy] = useState<'match_desc' | 'match_asc' | 'title'>('match_desc');
  const [queryReady, setQueryReady] = useState(false);

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

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
            Oportunidades
          </p>
          <h1 className="font-heading text-2xl font-bold">Vacantes compatibles</h1>
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div key={item} className="kova-card rounded-2xl border p-5 animate-pulse">
              <div className="h-4 w-24 rounded bg-slate-200 mb-3" />
              <div className="h-5 w-2/3 rounded bg-slate-200 mb-2" />
              <div className="h-4 w-1/2 rounded bg-slate-200 mb-4" />
              <div className="h-9 w-28 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Oportunidades
        </p>
        <h1 className="font-heading text-2xl font-bold">Vacantes compatibles</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Ordenadas por nivel de match con tu perfil comercial.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {vacantes.length > 0 ? (
        <div className="kova-card rounded-2xl border p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'match_desc' | 'match_asc' | 'title')}
            className="rounded-xl border px-3 py-2.5 text-sm bg-white"
          >
            <option value="match_desc">Orden: mayor match</option>
            <option value="match_asc">Orden: menor match</option>
            <option value="title">Orden: título</option>
          </select>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm bg-white"
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm bg-white"
          >
            <option value="">Todas las modalidades</option>
            {modalities.map((modality) => (
              <option key={modality} value={modality}>
                {modality}
              </option>
            ))}
          </select>
          <label className="rounded-xl border px-3 py-2.5 text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={showApplied}
              onChange={(e) => setShowApplied(e.target.checked)}
            />
            Mostrar ya aplicadas
          </label>
        </div>
      ) : null}

      {filteredVacantes.length === 0 ? (
        <div className="kova-card rounded-2xl border p-8 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-3 text-[var(--kova-muted)]" />
          <p className="text-[var(--kova-muted)] mb-4">
            {vacantes.length === 0
              ? 'Aún no hay vacantes compatibles. Completa tu perfil comercial para mejorar el matching.'
              : 'Ninguna vacante coincide con los filtros seleccionados.'}
          </p>
          {vacantes.length === 0 ? (
            <Link
              href="/portal/comercial"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              <Sparkles className="w-4 h-4" />
              Completar perfil comercial
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedCity('');
                setSelectedModality('');
                setShowApplied(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVacantes.map((vacancy) => {
            const tone = matchTone(vacancy.compatibility);
            return (
              <article key={vacancy.id} className="kova-card rounded-2xl border p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${tone.className}`}>
                        {vacancy.compatibility}% · {tone.label}
                      </span>
                      {vacancy.alreadyApplied ? (
                        <span className="text-xs rounded-full border px-2.5 py-1 text-[var(--kova-muted)]">
                          Ya aplicaste
                        </span>
                      ) : null}
                    </div>
                    <h2 className="font-heading text-lg font-semibold">{vacancy.title}</h2>
                    <p className="text-sm text-[var(--kova-muted)] mt-1">{vacancy.companyName}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--kova-muted)]">
                      {vacancy.city ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {vacancy.city}
                        </span>
                      ) : null}
                      {vacancy.modality ? <span>{vacancy.modality}</span> : null}
                    </div>
                  </div>
                  <Link
                    href={`/portal/vacantes/${vacancy.id}`}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0"
                    style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
                  >
                    {vacancy.alreadyApplied ? 'Ver estado' : 'Ver y aplicar'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
