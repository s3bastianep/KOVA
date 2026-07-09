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
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { CommercialProfile, WorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { newWorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { portalApi, type PortalPerfilResponse } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
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

function companyInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

function companyAccent(name: string): { bg: string; fg: string } {
  let hash = 0;
  const source = name.trim() || 'empresa';
  for (let i = 0; i < source.length; i++) hash = source.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue} 42% 93%)`,
    fg: `hsl(${hue} 32% 32%)`,
  };
}

function timelineYear(entry: WorkHistoryEntry): string {
  const from = parseMonthYear(entry.fechaInicio);
  return from ? String(from.getFullYear()) : '—';
}

function periodShort(entry: WorkHistoryEntry): string {
  const start = formatMonthYearDisplay(entry.fechaInicio) || '?';
  const end = entry.trabajoActual ? 'Actual' : formatMonthYearDisplay(entry.fechaFin ?? '') || '?';
  return `${start} – ${end}`;
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
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--kova-navy-muted)]">{hint}</span> : null}
    </label>
  );
}

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kova-lime)] px-4 py-2.5 text-sm font-semibold text-[var(--kv-ink)] transition hover:brightness-[0.97] active:brightness-95 disabled:opacity-60';

const btnSecondary =
  'inline-flex items-center gap-2 rounded-lg border border-[var(--kova-border-strong)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--kova-navy)] transition hover:bg-[var(--kova-surface-2)]';

const inputClass =
  'w-full rounded-lg border border-[var(--kova-border-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--kova-navy)] outline-none transition placeholder:text-[var(--kova-navy-muted)]/60 focus:border-[var(--kova-navy)]/20 focus:ring-1 focus:ring-[var(--kova-navy)]/8';

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--kova-navy-muted)]';

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
  const bullets = descriptionBullets(entry.descripcion);
  const complete = entryCompleteness(entry);
  const hiddenCount = Math.max(0, bullets.length - 2);
  const previewText = bullets.join(' ');
  const isLongPreview = previewText.length > 160 || bullets.length > 2;
  const showExpand = !isEditing && bullets.length > 0 && (isLongPreview || hiddenCount > 0);
  const visibleBullets = expanded ? bullets : bullets.slice(0, 2);
  const company = entry.empresa?.trim() || 'Empresa sin nombre';
  const accent = companyAccent(company);
  const isLatest = index === 0;

  return (
    <article
      className={`relative min-w-0 flex-1 rounded-xl border bg-white transition-shadow ${
        isEditing
          ? 'border-[var(--kova-navy)]/25 shadow-[0_0_0_1px_rgba(15,23,42,0.06)]'
          : isLatest
            ? 'border-[var(--kova-border-strong)] shadow-[var(--kova-shadow-xs)]'
            : 'border-[var(--kova-border)]'
      }`}
    >
      {isLatest && !isEditing ? (
        <div
          className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[var(--kova-lime)]"
          aria-hidden
        />
      ) : null}

      <div className={`p-4 sm:p-5 ${isLatest && !isEditing ? 'pl-5 sm:pl-6' : ''}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-3.5 sm:gap-4">
            {!isEditing ? (
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight"
                style={{ background: accent.bg, color: accent.fg }}
                aria-hidden
              >
                {companyInitial(company)}
              </div>
            ) : null}

            <div className="min-w-0 flex-1 space-y-2">
              {!isEditing ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    {isLatest ? (
                      <span className="rounded-md bg-[var(--kova-lime)]/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--kv-ink)]">
                        Más reciente
                      </span>
                    ) : null}
                    {entry.trabajoActual ? (
                      <span className="rounded-md border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--kova-navy)]">
                        Actual
                      </span>
                    ) : null}
                    {!complete ? (
                      <span className="rounded-md border border-dashed border-[var(--kova-border-strong)] px-2 py-0.5 text-[10px] font-semibold text-[var(--kova-navy-muted)]">
                        Revisar
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h2 className="font-heading text-lg font-bold leading-tight text-[var(--kova-navy)] sm:text-xl">
                      {company}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[var(--kova-navy-muted)]">
                      {displayTitle(entry.cargo)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--kova-navy-muted)]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[var(--kova-navy)]">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {periodShort(entry)}
                    </span>
                    {tenure ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {tenure}
                      </span>
                    ) : null}
                    {entry.sector ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        {entry.sector}
                      </span>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-sm font-medium text-[var(--kova-navy-muted)]">
                  Editando experiencia {index + 1} de {total}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:ml-2">
              {isEditing ? (
                <button type="button" onClick={onCancel} className={btnSecondary}>
                  <X className="h-3.5 w-3.5" />
                  Cerrar
                </button>
              ) : (
                <>
                  <button type="button" onClick={onEdit} className={btnSecondary}>
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--kova-border)] bg-white p-2 text-[var(--kova-navy-muted)] transition hover:text-[var(--kova-coral)]"
                    aria-label="Eliminar experiencia"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

        <div
          className={`${
            !isEditing && bullets.length > 0
              ? 'mt-4 border-t border-[var(--kova-border)] pt-4'
              : isEditing
                ? 'mt-4'
                : ''
          }`}
        >
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

              <div className="space-y-3 rounded-xl border border-[var(--kova-border)] bg-white p-4">
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
                      <div className="flex h-[42px] items-center rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3.5 text-sm font-medium text-[var(--kova-navy)]">
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
              {!expanded && isLongPreview ? (
                <p className="line-clamp-3 text-sm leading-relaxed text-[var(--kova-navy-muted)]">
                  {previewText}
                </p>
              ) : (
                <>
                  <p className="kova-portal-eyebrow mb-2.5">Responsabilidades y logros</p>
                  <ul className="space-y-2">
                    {visibleBullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--kova-navy)]">
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--kova-navy-muted)]"
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {showExpand ? (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--kova-navy-muted)] hover:text-[var(--kova-navy)]"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {hiddenCount > 0 ? `Ver ${hiddenCount} puntos más` : 'Ver detalle completo'}
                    </>
                  )}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--kova-border)] px-4 py-4 text-center">
              <p className="text-sm text-[var(--kova-navy-muted)]">Sin descripción todavía</p>
              <button type="button" onClick={onEdit} className={`mt-3 ${btnSecondary}`}>
                <Pencil className="h-3.5 w-3.5" />
                Completar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function PortalExperienciaClient() {
  const cached = portalCacheGet<PortalPerfilResponse>(PORTAL_CACHE_KEYS.perfil);
  const initialProfile = (cached?.profile as CommercialProfile) ?? null;
  const [profile, setProfile] = useState<CommercialProfile | null>(initialProfile);
  const [entries, setEntries] = useState<WorkHistoryEntry[]>(() => initialProfile?.historialLaboral ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(() => !cached);
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

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando experiencia...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="kova-portal-eyebrow">Trayectoria</p>
            <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Experiencia laboral</h1>
            <p className="kova-portal-body mt-3">
              Revisa cargo, empresa y fechas de cada rol. Un historial claro mejora tu compatibilidad con
              vacantes.
            </p>
          </div>

          <button type="button" onClick={addEntry} className={`shrink-0 self-start ${btnPrimary}`}>
            <Plus className="h-4 w-4" />
            Agregar experiencia
          </button>
        </div>

        {entries.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--kova-border)] pt-5">
            <div className="rounded-xl border border-[var(--kova-border)] bg-white px-4 py-3 min-w-[88px]">
              <p className="kova-portal-eyebrow">Roles</p>
              <p className="kova-portal-stat mt-1 text-2xl">{stats.total}</p>
            </div>
            {stats.years > 0 ? (
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-4 py-3 min-w-[88px]">
                <p className="kova-portal-eyebrow">Años aprox.</p>
                <p className="kova-portal-stat mt-1 text-2xl">{stats.years}+</p>
              </div>
            ) : null}
            {stats.current > 0 ? (
              <div className="rounded-xl border border-[var(--kova-border)] bg-white px-4 py-3 min-w-[88px]">
                <p className="kova-portal-eyebrow">Actuales</p>
                <p className="kova-portal-stat mt-1 text-2xl">{stats.current}</p>
              </div>
            ) : null}
            {stats.needsReview > 0 ? (
              <div className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-4 py-3 min-w-[88px]">
                <p className="kova-portal-eyebrow">Por revisar</p>
                <p className="kova-portal-stat mt-1 text-2xl">{stats.needsReview}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-4 py-3 text-sm text-[var(--kova-navy)]"
        >
          {error}
        </div>
      ) : null}

      {saved && !dirty ? (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-4 py-3 text-sm text-[var(--kova-navy)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Experiencia guardada correctamente.
        </div>
      ) : null}

      {entries.length === 0 ? (
        <div className="rounded-xl border border-[var(--kova-border)] bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]">
            <Briefcase className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-base font-bold text-[var(--kova-navy)]">Sin experiencia registrada</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--kova-navy-muted)]">
            Sube tu HV y extraemos tu historial, o agrégalo manualmente rol por rol.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={addEntry} className={btnSecondary}>
              <Plus className="h-4 w-4" />
              Agregar manualmente
            </button>
            <Link href="/portal/documentos" className={btnPrimary}>
              <Upload className="h-4 w-4" />
              Subir hoja de vida
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[var(--kova-navy-muted)]">
            Línea de tiempo — del <span className="font-medium text-[var(--kova-navy)]">más reciente</span> al
            más antiguo.
          </p>

          <ol className="relative space-y-0">
            <div
              className="absolute bottom-4 left-[15px] top-2 w-px bg-[var(--kova-border-strong)]"
              aria-hidden
            />
            {entries.map((entry, index) => (
              <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="relative z-[1] flex w-8 shrink-0 flex-col items-center pt-1.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-[11px] font-bold tabular-nums ${
                      index === 0
                        ? 'border-[var(--kova-lime)] text-[var(--kova-navy)]'
                        : 'border-[var(--kova-border-strong)] text-[var(--kova-navy-muted)]'
                    }`}
                  >
                    {timelineYear(entry).slice(-2)}
                  </div>
                  <span className="mt-1 text-[10px] font-medium tabular-nums text-[var(--kova-navy-muted)]">
                    {timelineYear(entry)}
                  </span>
                </div>

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

          <div className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 px-5 py-4">
            <p className="text-sm text-[var(--kova-navy-muted)]">
              ¿Datos repetidos o incorrectos?{' '}
              <Link href="/portal/documentos" className="font-medium text-[var(--kova-navy)] hover:underline">
                Sube una HV actualizada
              </Link>{' '}
              o edita cada rol.
            </p>
          </div>
        </div>
      )}

      {dirty ? (
        <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--kova-border-strong)] bg-white px-4 py-3 shadow-[var(--kova-shadow-lg)]">
          <p className="hidden text-sm text-[var(--kova-muted)] sm:block">Cambios sin guardar</p>
          <button
            type="button"
            onClick={() => {
              setEntries(profile?.historialLaboral ?? []);
              setDirty(false);
              setEditingId(null);
              setSaved(false);
            }}
            className="rounded-lg border border-[var(--kova-border)] px-3 py-2 text-sm font-medium text-[var(--kova-navy-muted)] transition hover:bg-[var(--kova-surface-2)]"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className={`${btnPrimary} px-4 py-2`}
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
        </div>
      ) : null}
    </div>
  );
}
