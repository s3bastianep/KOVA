'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Target,
  Upload,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PortalDashboard } from '@/lib/api';

const STEP_ICONS: Record<string, LucideIcon> = {
  perfil: User,
  documentos: Upload,
  comercial: Target,
};

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kova-lime)] px-4 py-2.5 text-sm font-semibold text-[var(--kv-ink)] transition hover:brightness-[0.97] active:brightness-95';

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
  href?: string;
}) {
  const inner = (
    <div className="group relative h-full rounded-xl border border-[var(--kova-border)] bg-white p-5 transition-colors hover:border-[var(--kova-border-strong)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="kova-portal-eyebrow">{label}</p>
          <p className="kova-portal-stat mt-2">{value}</p>
          {sublabel ? <p className="mt-1 text-xs leading-relaxed text-[var(--kova-navy-muted)]">{sublabel}</p> : null}
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--kova-navy-muted)] opacity-0 transition-opacity group-hover:opacity-100">
          Ver detalle
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}

function ProgressRing({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--kova-border)" strokeWidth="4" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--kova-navy)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="text-center">
        <p className="font-heading text-xl font-bold leading-none tracking-[-0.04em] text-[var(--kova-navy)]">{clamped}%</p>
        <p className="mt-1 text-[10px] font-medium text-[var(--kova-navy-muted)]">Perfil</p>
      </div>
    </div>
  );
}

function ProfileProgressPanel({
  completeness,
  gaps,
}: {
  completeness: number;
  gaps: Array<{ id: string; label: string; href: string }>;
}) {
  const visibleGaps = gaps.slice(0, 3);
  const hiddenCount = gaps.length - visibleGaps.length;
  const firstGap = gaps[0];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 p-5 lg:min-w-[300px] lg:max-w-[360px]">
      <div className="flex items-start gap-4">
        <ProgressRing value={completeness} />
        <div className="min-w-0 flex-1 pt-1">
          <p className="kova-portal-title kova-portal-title-md text-base">Completitud del perfil</p>
          {gaps.length === 0 ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--kova-navy-muted)]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--kova-navy)]" />
              Perfil completo para matching.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-[var(--kova-navy-muted)]">
              {gaps.length} {gaps.length === 1 ? 'dato pendiente' : 'datos pendientes'} para optimizar compatibilidad.
            </p>
          )}
        </div>
      </div>

      {gaps.length > 0 ? (
        <div className="border-t border-[var(--kova-border)] pt-4">
          <ul className="space-y-2">
            {visibleGaps.map((gap) => (
              <li key={gap.id}>
                <Link
                  href={gap.href}
                  className="group flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-sm text-[var(--kova-navy-muted)] transition-colors hover:text-[var(--kova-navy)]"
                >
                  <span className="leading-snug">{gap.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          {hiddenCount > 0 ? (
            <p className="mt-2 text-xs text-[var(--kova-navy-muted)]">+ {hiddenCount} en próximos pasos</p>
          ) : null}
          {firstGap ? (
            <Link href={firstGap.href} className={`mt-4 w-full ${btnPrimary} text-xs`}>
              Completar perfil
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PortalDashboardHome({ data }: { data: PortalDashboard }) {
  const completedSteps = data.nextSteps.filter((s) => s.done).length;
  const totalSteps = data.nextSteps.length;
  const nextPending = data.nextSteps.find((s) => !s.done);
  const profileGaps = data.profileGaps ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="kova-portal-eyebrow">Qué bueno verte de nuevo</p>
            <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading capitalize">
              Hola, {data.greeting}
            </h1>
            <p className="kova-portal-body mt-3 max-w-md">
              Gestiona tu perfil, revisa vacantes compatibles y sigue el estado de tus postulaciones.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/portal/vacantes" className={btnPrimary}>
                Ver vacantes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portal/experiencia"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--kova-border-strong)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--kova-navy)] transition hover:bg-[var(--kova-surface-2)]"
              >
                <Briefcase className="h-4 w-4 text-[var(--kova-navy-muted)]" />
                Mi experiencia
              </Link>
            </div>
          </div>

          <ProfileProgressPanel completeness={data.profileCompleteness} gaps={profileGaps} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vacantes compatibles"
          value={data.stats.vacantesRecomendadas}
          sublabel="Según tu perfil y preferencias"
          icon={FileText}
          href="/portal/vacantes"
        />
        <StatCard
          label="Postulaciones activas"
          value={data.stats.aplicacionesActivas}
          sublabel="En proceso de selección"
          icon={Briefcase}
          href="/portal/aplicaciones"
        />
        <StatCard
          label="Entrevistas próximas"
          value={data.stats.entrevistasProximas}
          sublabel="Agendadas"
          icon={Calendar}
        />
        <StatCard
          label="Hoja de vida"
          value={data.stats.hasCv ? 'Lista' : 'Pendiente'}
          sublabel={data.stats.hasCv ? 'Documento cargado' : 'Sube tu CV para mejorar match'}
          icon={Upload}
          href="/portal/documentos"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--kova-border)] pb-5">
            <div>
              <p className="kova-portal-eyebrow">Tu progreso</p>
              <h2 className="kova-portal-title kova-portal-title-md mt-1 font-heading">Próximos pasos</h2>
            </div>
            <span className="text-xs font-medium text-[var(--kova-navy-muted)]">
              {completedSteps} de {totalSteps} completados
            </span>
          </div>

          <ul className="space-y-2">
            {data.nextSteps.map((step, index) => {
              const StepIcon = STEP_ICONS[step.id] ?? Circle;
              const isNext = !step.done && step.id === nextPending?.id;

              return (
                <li key={step.id}>
                  <Link
                    href={step.href}
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                      step.done
                        ? 'border-[var(--kova-border)] bg-[var(--kova-surface-2)]/30'
                        : isNext
                          ? 'border-[var(--kova-navy)]/15 bg-white'
                          : 'border-[var(--kova-border)] bg-white hover:bg-[var(--kova-surface-2)]/40'
                    } ${isNext ? 'border-l-2 border-l-[var(--kova-navy)]' : ''}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                        step.done
                          ? 'border-[var(--kova-border)] bg-white text-[var(--kova-navy)]'
                          : 'border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium text-[var(--kova-navy)] ${
                          step.done ? 'text-[var(--kova-navy-muted)] line-through' : ''
                        }`}
                      >
                        {step.label}
                      </p>
                      {isNext ? (
                        <p className="mt-0.5 text-xs text-[var(--kova-navy-muted)]">Siguiente recomendado</p>
                      ) : step.done ? (
                        <p className="mt-0.5 text-xs text-[var(--kova-navy-muted)]">Completado</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-[var(--kova-navy-muted)]">Paso {index + 1}</p>
                      )}
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--kova-navy-muted)] opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap gap-1 border-t border-[var(--kova-border)] pt-4">
            <Link
              href="/portal/formacion"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--kova-navy-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Formación
            </Link>
            <Link
              href="/portal/preferencias"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--kova-navy-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <Target className="h-3.5 w-3.5" />
              Preferencias laborales
            </Link>
            <Link
              href="/portal/perfil"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--kova-navy-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <User className="h-3.5 w-3.5" />
              Datos personales
            </Link>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-[var(--kova-navy)] bg-[var(--kova-navy)] p-6 text-white lg:p-7">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <Upload className="h-4 w-4 text-white/80" strokeWidth={1.75} />
          </div>
          <h2 className="kova-portal-title kova-portal-title-md font-heading text-white">Actualiza tu hoja de vida</h2>
          <p className="mt-2 flex-1 text-[0.9375rem] leading-[1.7] text-white/60">
            Un CV actualizado mejora tus recomendaciones y acelera las postulaciones.
          </p>
          <Link href="/portal/documentos" className={`mt-6 ${btnPrimary}`}>
            <Upload className="h-4 w-4" />
            Gestionar documentos
          </Link>
        </div>
      </section>
    </div>
  );
}

function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
