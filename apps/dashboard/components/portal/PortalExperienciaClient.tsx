'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Loader2, Upload } from 'lucide-react';
import type { CommercialProfile, WorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { portalApi } from '@/lib/api';
import { formatMonthYearDisplay } from '@/app/registro/registro-utils';

function ExperienceCard({ entry }: { entry: WorkHistoryEntry }) {
  return (
    <article className="kova-card rounded-2xl border p-5 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading font-semibold">{entry.cargo || 'Cargo sin título'}</h2>
          <p className="text-sm text-[var(--kova-muted)]">{entry.empresa || 'Empresa no indicada'}</p>
        </div>
        {entry.sector ? (
          <span className="text-xs rounded-full border px-2.5 py-1 shrink-0">{entry.sector}</span>
        ) : null}
      </div>
      <p className="text-xs font-mono text-[var(--kova-muted)]">
        {formatMonthYearDisplay(entry.fechaInicio)}
        {' — '}
        {entry.trabajoActual ? 'Actualidad' : formatMonthYearDisplay(entry.fechaFin ?? '')}
      </p>
      {entry.descripcion ? <p className="text-sm leading-relaxed">{entry.descripcion}</p> : null}
    </article>
  );
}

export function PortalExperienciaClient() {
  const [entries, setEntries] = useState<WorkHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi
      .perfil()
      .then((data) => {
        const profile = data.profile as CommercialProfile;
        setEntries(profile.historialLaboral ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando experiencia...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Trayectoria
        </p>
        <h1 className="font-heading text-2xl font-bold">Experiencia</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Tu historial laboral importado desde la hoja de vida o que completes manualmente en la Fase 3.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {entries.length === 0 ? (
        <div className="kova-card rounded-2xl border p-8 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-3 text-[var(--kova-muted)]" />
          <p className="text-[var(--kova-muted)] mb-4">Aún no tienes experiencia registrada.</p>
          <Link
            href="/portal/documentos"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            <Upload className="w-4 h-4" />
            Subir hoja de vida
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <ExperienceCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
