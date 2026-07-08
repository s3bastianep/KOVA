'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, Loader2 } from 'lucide-react';
import { portalApi, type PortalApplication } from '@/lib/api';
import { stageStyle } from '@/lib/stages';

export function PortalAplicacionesClient() {
  const [aplicaciones, setAplicaciones] = useState<PortalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'activas' | 'cerradas' | 'todas'>('activas');

  useEffect(() => {
    portalApi
      .aplicaciones()
      .then((data) => setAplicaciones(data.aplicaciones))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar aplicaciones'))
      .finally(() => setLoading(false));
  }, []);

  const visibleApplications = aplicaciones.filter((app) => {
    if (view === 'todas') return true;
    if (view === 'cerradas') return app.rejected;
    return !app.rejected;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando aplicaciones...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Seguimiento
        </p>
        <h1 className="font-heading text-2xl font-bold">Mis aplicaciones</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Estado de tus postulaciones y avance en cada proceso.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {aplicaciones.length > 0 ? (
        <div className="kova-card rounded-2xl border p-3 inline-flex gap-2">
          <button
            type="button"
            onClick={() => setView('activas')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === 'activas' ? 'bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)]' : 'text-[var(--kova-muted)]'
            }`}
          >
            Activas
          </button>
          <button
            type="button"
            onClick={() => setView('cerradas')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === 'cerradas' ? 'bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)]' : 'text-[var(--kova-muted)]'
            }`}
          >
            Cerradas
          </button>
          <button
            type="button"
            onClick={() => setView('todas')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === 'todas' ? 'bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)]' : 'text-[var(--kova-muted)]'
            }`}
          >
            Todas
          </button>
        </div>
      ) : null}

      {visibleApplications.length === 0 ? (
        <div className="kova-card rounded-2xl border p-8 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-3 text-[var(--kova-muted)]" />
          <p className="text-[var(--kova-muted)] mb-4">
            {aplicaciones.length === 0
              ? 'Aún no has aplicado a ninguna vacante.'
              : 'No hay aplicaciones para este filtro.'}
          </p>
          <Link
            href="/portal/vacantes"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            Explorar vacantes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((app) => {
            const style = stageStyle(app.stage);
            return (
              <article key={app.id} className="kova-card rounded-2xl border p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="text-xs font-semibold rounded-full px-2.5 py-1"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {app.stageLabel}
                      </span>
                      <span className="text-xs rounded-full border px-2.5 py-1 text-[var(--kova-muted)]">
                        {app.compatibility}% match
                      </span>
                      {app.rejected ? (
                        <span className="text-xs rounded-full bg-red-100 text-red-800 px-2.5 py-1">
                          Cerrada
                        </span>
                      ) : null}
                    </div>
                    <h2 className="font-heading text-lg font-semibold">{app.title}</h2>
                    <p className="text-sm text-[var(--kova-muted)] mt-1">{app.companyName}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-[var(--kova-muted)] mt-3">
                      <Calendar className="w-3.5 h-3.5" />
                      Aplicaste el{' '}
                      {new Date(app.appliedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
                    </p>
                    <p className="text-xs text-[var(--kova-muted)] mt-1">
                      Última actualización:{' '}
                      {new Date(app.updatedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
                    </p>
                    {app.rejectReason ? (
                      <p className="text-xs text-red-700 mt-2">Motivo: {app.rejectReason}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/portal/vacantes/${app.vacancyId}`}
                    className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium shrink-0"
                  >
                    Ver vacante
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
