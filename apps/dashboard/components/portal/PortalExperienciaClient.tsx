'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { CommercialProfile, WorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { newWorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { portalApi } from '@/lib/api';
import { formatMonthYearDisplay } from '@/app/registro/registro-utils';

function parseMonthYear(value: string): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }
  const slash = value.match(/^(\d{1,2})\s*[/.-]\s*(\d{4})$/);
  if (slash) return new Date(Number(slash[2]), Number(slash[1]) - 1, 1);
  return null;
}

function formatTenure(start: string, end: string | undefined, isCurrent: boolean): string {
  const from = parseMonthYear(start);
  if (!from) return '';
  const to = isCurrent ? new Date() : parseMonthYear(end ?? '');
  if (!to) return '';

  const months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
  if (months < 1) return 'Menos de 1 mes';
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (rest === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
  return `${years} ${years === 1 ? 'año' : 'años'} · ${rest} ${rest === 1 ? 'mes' : 'meses'}`;
}

function totalCareerYears(entries: WorkHistoryEntry[]): number {
  let months = 0;
  for (const entry of entries) {
    const from = parseMonthYear(entry.fechaInicio);
    if (!from) continue;
    const to = entry.trabajoActual ? new Date() : parseMonthYear(entry.fechaFin ?? '');
    if (!to) continue;
    months += (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
  }
  return months > 0 ? Math.max(1, Math.round(months / 12)) : 0;
}

function displayTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return 'Sin cargo';
  const letters = trimmed.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑüÜ]/g, '');
  const upperRatio = letters ? letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length / letters.length : 0;
  if (upperRatio > 0.75) {
    return trimmed
      .toLowerCase()
      .replace(/(^|[\s(/\-])([\p{L}])/gu, (_, sep, char) => sep + char.toUpperCase());
  }
  return trimmed;
}

function descriptionBullets(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const byMarkers = trimmed
    .split(/\n+|(?:\s*[•·▪▸-]\s+)|(?:\.\s+(?=[A-ZÁÉÍÓÚÑ]))/u)
    .map((part) => part.trim().replace(/^[-–—]\s*/, ''))
    .filter((part) => part.length > 8);

  if (byMarkers.length > 1) return byMarkers.slice(0, 8);

  if (trimmed.length > 140) {
    return trimmed
      .split(/\.\s+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 12)
      .map((part) => (part.endsWith('.') ? part : `${part}.`))
      .slice(0, 6);
  }

  return [trimmed];
}

function entryCompleteness(entry: WorkHistoryEntry): boolean {
  return Boolean(
    entry.cargo?.trim() &&
      entry.empresa?.trim() &&
      entry.fechaInicio?.trim() &&
      (entry.trabajoActual || entry.fechaFin?.trim()),
  );
}

function timelineYear(entry: WorkHistoryEntry): string {
  const from = parseMonthYear(entry.fechaInicio);
  return from ? String(from.getFullYear()) : '—';
}

function YesNoToggle({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)] p-1">
      {(['Sí', 'No'] as const).map((label, i) => {
        const active = i === 0 ? value : !value;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i === 0)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? 'bg-white text-[var(--kova-navy)] shadow-sm' : 'text-[var(--kova-muted)]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--kova-muted)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--kova-muted)]">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-[var(--kova-ring)]';

type ExperienceCardProps = {
  entry: WorkHistoryEntry;
  index: number;
  total: number;
  isEditing: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onChange: (patch: Partial<WorkHistoryEntry>) => void;
};

function ExperienceCard({
  entry,
  index,
  total,
  isEditing,
  expanded,
  onToggleExpand,
  onEdit,
  onCancel,
  onDelete,
  onChange,
}: ExperienceCardProps) {
  const tenure = formatTenure(entry.fechaInicio, entry.fechaFin, entry.trabajoActual);
  const dateRange = `${formatMonthYearDisplay(entry.fechaInicio) || '?'} → ${
    entry.trabajoActual ? 'Hoy' : formatMonthYearDisplay(entry.fechaFin ?? '') || '?'
  }`;
  const bullets = descriptionBullets(entry.descripcion);
  const complete = entryCompleteness(entry);
  const showExpand = bullets.length > 3 || (bullets[0]?.length ?? 0) > 180;
  const visibleBullets = expanded ? bullets : bullets.slice(0, 3);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white transition-all duration-200 ${
        isEditing
          ? 'border-[var(--kova-blue)] shadow-[var(--kova-shadow-md)] ring-2 ring-[var(--kova-ring)]'
          : 'border-[var(--kova-border)] shadow-[var(--kova-shadow-sm)] hover:shadow-[var(--kova-shadow-md)]'
      }`}
    >
      <div
        className={`border-b px-5 py-4 sm:px-6 ${
          entry.trabajoActual
            ? 'border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-white'
            : 'border-[var(--kova-border)] bg-gradient-to-r from-[var(--kova-blue-soft)]/50 to-white'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[var(--kova-muted)] ring-1 ring-[var(--kova-border)]">
                {index === 0 ? 'Más reciente' : `${String(index + 1).padStart(2, '0')} · ${timelineYear(entry)}`}
              </span>
              {entry.trabajoActual ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--kova-lime)]" />
                  Trabajo actual
                </span>
              ) : null}
              {!complete && !isEditing ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                  Revisar datos
                </span>
              ) : null}
            </div>

            {!isEditing ? (
              <>
                <h2 className="font-heading text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                  {displayTitle(entry.cargo)}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-base font-medium text-[var(--kova-navy-muted)]">
                  <Building2 className="h-4 w-4 shrink-0 text-[var(--kova-blue)]" />
                  {entry.empresa || 'Empresa sin nombre'}
                </p>
              </>
            ) : (
              <p className="font-heading text-sm font-semibold text-[var(--kova-blue)]">
                Editando experiencia {index + 1} de {total}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isEditing ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--kova-muted)] hover:bg-white/80"
              >
                <X className="h-3.5 w-3.5" />
                Cerrar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--kova-border)] bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-[var(--kova-surface-2)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  aria-label="Eliminar experiencia"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium ring-1 ring-[var(--kova-border)]">
              <Calendar className="h-3.5 w-3.5 text-[var(--kova-blue)]" />
              {dateRange}
            </span>
            {tenure ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--kova-violet-soft)] px-3 py-1 text-xs font-semibold text-[var(--kova-violet)]">
                <Clock className="h-3.5 w-3.5" />
                {tenure}
              </span>
            ) : null}
            {entry.sector ? (
              <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs text-[var(--kova-navy-muted)] ring-1 ring-[var(--kova-border)]">
                {entry.sector}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="p-5 sm:p-6">
        {isEditing ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cargo" hint="Ej. Director Comercial, Ejecutivo de ventas">
                <input
                  className={inputClass}
                  value={entry.cargo}
                  placeholder="Tu puesto en la empresa"
                  onChange={(e) => onChange({ cargo: e.target.value })}
                />
              </Field>
              <Field label="Empresa">
                <input
                  className={inputClass}
                  value={entry.empresa}
                  placeholder="Nombre de la empresa"
                  onChange={(e) => onChange({ empresa: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Sector (opcional)">
              <input
                className={inputClass}
                value={entry.sector}
                placeholder="Manufactura, tecnología, retail..."
                onChange={(e) => onChange({ sector: e.target.value })}
              />
            </Field>

            <div className="rounded-2xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/60 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">¿Sigues en este cargo?</p>
                  <p className="text-xs text-[var(--kova-muted)]">Marca Sí si aún trabajas aquí</p>
                </div>
                <YesNoToggle
                  value={entry.trabajoActual}
                  onChange={(trabajoActual) =>
                    onChange(trabajoActual ? { trabajoActual: true, fechaFin: undefined } : { trabajoActual: false })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Desde" hint="Formato MM/AAAA">
                  <input
                    className={inputClass}
                    value={entry.fechaInicio}
                    placeholder="03/2020"
                    onChange={(e) => onChange({ fechaInicio: e.target.value })}
                  />
                </Field>
                {entry.trabajoActual ? (
                  <Field label="Hasta">
                    <div className="flex h-[42px] items-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-3.5 text-sm font-semibold text-emerald-800">
                      Actualidad
                    </div>
                  </Field>
                ) : (
                  <Field label="Hasta" hint="Formato MM/AAAA">
                    <input
                      className={inputClass}
                      value={entry.fechaFin ?? ''}
                      placeholder="06/2025"
                      onChange={(e) => onChange({ fechaFin: e.target.value, trabajoActual: false })}
                    />
                  </Field>
                )}
              </div>
            </div>

            <Field label="Qué hiciste en este cargo" hint="Logros, responsabilidades, resultados con cifras si puedes">
              <textarea
                className={`${inputClass} min-h-[140px] resize-y leading-relaxed`}
                value={entry.descripcion}
                placeholder="Ej: Lideré equipo de 8 vendedores. Crecí ventas 25% en 2024..."
                rows={5}
                onChange={(e) => onChange({ descripcion: e.target.value })}
              />
            </Field>
          </div>
        ) : bullets.length > 0 ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--kova-muted)]">
              Responsabilidades y logros
            </p>
            <ul className="space-y-2.5">
              {visibleBullets.map((bullet, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--kova-navy-muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kova-lime-dark)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {showExpand ? (
              <button
                type="button"
                onClick={onToggleExpand}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--kova-blue)] hover:underline"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Ver {bullets.length - 3} más
                  </>
                )}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/40 px-4 py-5 text-center">
            <p className="text-sm font-medium text-[var(--kova-navy-muted)]">Sin descripción todavía</p>
            <p className="mt-1 text-xs text-[var(--kova-muted)]">
              Edita este rol y agrega qué hiciste — ayuda mucho al matching.
            </p>
            <button
              type="button"
              onClick={onEdit}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Completar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function PortalExperienciaClient() {
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [entries, setEntries] = useState<WorkHistoryEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi
      .perfil()
      .then((data) => {
        const loaded = data.profile as CommercialProfile;
        setProfile(loaded);
        setEntries(loaded.historialLaboral ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const current = entries.filter((e) => e.trabajoActual).length;
    const needsReview = entries.filter((e) => !entryCompleteness(e)).length;
    return { total: entries.length, years: totalCareerYears(entries), current, needsReview };
  }, [entries]);

  const updateEntry = (id: string, patch: Partial<WorkHistoryEntry>) => {
    setSaved(false);
    setDirty(true);
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  };

  const removeEntry = (id: string) => {
    if (!window.confirm('¿Eliminar esta experiencia?')) return;
    setSaved(false);
    setDirty(true);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const addEntry = () => {
    const entry = newWorkHistoryEntry();
    setSaved(false);
    setDirty(true);
    setEntries((prev) => [entry, ...prev]);
    setEditingId(entry.id);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...profile, historialLaboral: entries };
      const res = await portalApi.updatePerfil(payload as Record<string, unknown>);
      const updated = res.profile as CommercialProfile;
      setProfile(updated);
      setEntries(updated.historialLaboral ?? entries);
      setDirty(false);
      setSaved(true);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando experiencia...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-24">
      <section className="kova-card relative overflow-hidden rounded-3xl border p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle at top right, var(--kova-lime), transparent 55%), radial-gradient(circle at bottom left, var(--kova-indigo), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
                Trayectoria
              </p>
              <h1 className="font-heading text-2xl font-bold lg:text-3xl">Experiencia laboral</h1>
              <p className="mt-2 text-[var(--kova-muted)]">
                Cada tarjeta es un rol distinto. Revisa que cargo, empresa y fechas sean correctos — sobre
                todo si importaste desde la hoja de vida.
              </p>
            </div>

            <button
              type="button"
              onClick={addEntry}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--kova-shadow-xs)] transition hover:scale-[1.02]"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              <Plus className="h-4 w-4" />
              Agregar experiencia
            </button>
          </div>

          {entries.length > 0 ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--kova-border)] bg-white/80 px-3.5 py-2.5 backdrop-blur-sm">
                  <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">Roles</p>
                  <p className="font-heading text-xl font-bold">{stats.total}</p>
                </div>
                {stats.years > 0 ? (
                  <div className="rounded-xl border border-[var(--kova-border)] bg-white/80 px-3.5 py-2.5 backdrop-blur-sm">
                    <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">
                      Años aprox.
                    </p>
                    <p className="font-heading text-xl font-bold">{stats.years}+</p>
                  </div>
                ) : null}
                {stats.needsReview > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-wide text-amber-800">Por revisar</p>
                    <p className="font-heading text-xl font-bold text-amber-900">{stats.needsReview}</p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { n: '1', t: 'Revisa cada rol', d: 'Cargo, empresa y fechas' },
                  { n: '2', t: 'Corrige duplicados', d: 'Mismo título ≠ misma empresa' },
                  { n: '3', t: 'Guarda cambios', d: 'Mejora tu match con vacantes' },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex items-start gap-2 rounded-xl border border-[var(--kova-border)] bg-white/70 px-3 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--kova-blue-soft)] text-xs font-bold text-[var(--kova-blue)]">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{step.t}</p>
                      <p className="text-[11px] text-[var(--kova-muted)]">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {saved && !dirty ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Experiencia guardada correctamente.
        </div>
      ) : null}

      {entries.length === 0 ? (
        <div className="kova-card rounded-3xl border p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]">
            <Briefcase className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-lg font-semibold">Sin experiencia registrada</h2>
          <p className="mx-auto mt-2 max-w-sm text-[var(--kova-muted)]">
            Sube tu HV y extraemos tu historial, o agrégalo manualmente rol por rol.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={addEntry}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Agregar manualmente
            </button>
            <Link
              href="/portal/documentos"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              <Upload className="h-4 w-4" />
              Subir hoja de vida
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-[var(--kova-muted)]">
            Ordenado del <strong className="font-semibold text-[var(--kova-navy)]">más reciente</strong> al
            más antiguo. La primera tarjeta es tu rol actual o último cargo.
          </p>

          <ol className="space-y-6">
            {entries.map((entry, index) => (
              <li key={entry.id}>
                <ExperienceCard
                  entry={entry}
                  index={index}
                  total={entries.length}
                  isEditing={editingId === entry.id}
                  expanded={expandedIds.has(entry.id)}
                  onToggleExpand={() => toggleExpand(entry.id)}
                  onEdit={() => setEditingId(entry.id)}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => removeEntry(entry.id)}
                  onChange={(patch) => updateEntry(entry.id, patch)}
                />
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kova-indigo)]" />
              <p className="text-sm text-[var(--kova-muted)]">
                ¿Datos repetidos o incorrectos? Sube una HV actualizada o edita cada tarjeta.
              </p>
            </div>
            <Link
              href="/portal/documentos"
              className="shrink-0 text-sm font-semibold text-[var(--kova-indigo)] hover:underline"
            >
              Ir a documentos
            </Link>
          </div>
        </div>
      )}

      {dirty ? (
        <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--kova-border-strong)] bg-white/95 px-4 py-3 shadow-[var(--kova-shadow-lg)] backdrop-blur-md">
          <p className="hidden text-sm text-[var(--kova-muted)] sm:block">Cambios sin guardar</p>
          <button
            type="button"
            onClick={() => {
              setEntries(profile?.historialLaboral ?? []);
              setDirty(false);
              setEditingId(null);
              setSaved(false);
            }}
            className="rounded-xl border px-3 py-2 text-sm font-medium"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
