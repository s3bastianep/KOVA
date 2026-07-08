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
  Sparkles,
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

type StatTone = 'indigo' | 'lime' | 'violet' | 'amber' | 'emerald';

const STAT_TONES: Record<
  StatTone,
  { icon: string; bg: string; ring: string; value: string }
> = {
  indigo: {
    icon: 'text-[var(--kova-blue)]',
    bg: 'bg-[var(--kova-blue-soft)]',
    ring: 'ring-[var(--kova-blue)]/10',
    value: 'text-[var(--kova-blue)]',
  },
  lime: {
    icon: 'text-[var(--kova-green)]',
    bg: 'bg-[var(--kova-green-soft)]',
    ring: 'ring-[var(--kova-lime)]/20',
    value: 'text-[var(--kova-green)]',
  },
  violet: {
    icon: 'text-[var(--kova-violet)]',
    bg: 'bg-[var(--kova-violet-soft)]',
    ring: 'ring-[var(--kova-violet)]/10',
    value: 'text-[var(--kova-violet)]',
  },
  amber: {
    icon: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200/60',
    value: 'text-amber-800',
  },
  emerald: {
    icon: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200/60',
    value: 'text-emerald-800',
  },
};

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
  tone: StatTone;
  href?: string;
}) {
  const colors = STAT_TONES[tone];
  const inner = (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl border border-[var(--kova-border)] bg-white p-5 shadow-[var(--kova-shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--kova-border-strong)] hover:shadow-[var(--kova-shadow-md)] ring-1 ${colors.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--kova-muted)]">{label}</p>
          <p className={`mt-2 font-heading text-3xl font-bold tracking-tight ${colors.value}`}>{value}</p>
          {sublabel ? <p className="mt-1 text-xs text-[var(--kova-muted)]">{sublabel}</p> : null}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.icon} transition-transform group-hover:scale-105`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--kova-blue)] opacity-0 transition-opacity group-hover:opacity-100">
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
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--kova-line)" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#portalProgressGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="portalProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--kova-blue)" />
            <stop offset="100%" stopColor="var(--kova-lime-dark)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="font-heading text-2xl font-bold leading-none">{clamped}%</p>
        <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">Perfil</p>
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
  const visibleGaps = gaps.slice(0, 4);
  const hiddenCount = gaps.length - visibleGaps.length;
  const firstGap = gaps[0];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[var(--kova-border)] bg-white/80 p-5 backdrop-blur-sm lg:min-w-[320px] lg:max-w-[380px]">
      <div className="flex items-start gap-5">
        <ProgressRing value={completeness} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Completitud del perfil</p>
          {gaps.length === 0 ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Perfil completo — buen match con vacantes.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-[var(--kova-muted)]">
              Te faltan <strong className="font-semibold text-[var(--kova-navy)]">{gaps.length}</strong>{' '}
              {gaps.length === 1 ? 'dato' : 'datos'} para optimizar tu compatibilidad.
            </p>
          )}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--kova-line)]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completeness}%`,
                background: 'linear-gradient(90deg, var(--kova-blue), var(--kova-lime-dark))',
              }}
            />
          </div>
        </div>
      </div>

      {gaps.length > 0 ? (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">Te falta</p>
          <ul className="space-y-1.5">
            {visibleGaps.map((gap) => (
              <li key={gap.id}>
                <Link
                  href={gap.href}
                  className="group flex items-center gap-2 text-sm text-amber-950 hover:text-[var(--kova-blue)]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span className="flex-1 leading-snug">{gap.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          {hiddenCount > 0 ? (
            <p className="mt-2 text-xs text-amber-800/80">+ {hiddenCount} más abajo en próximos pasos</p>
          ) : null}
          {firstGap ? (
            <Link
              href={firstGap.href}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:scale-[1.01]"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              Completar: {firstGap.label}
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <section className="kova-card relative overflow-hidden rounded-3xl border p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 100% 0%, var(--kova-lime), transparent 50%), radial-gradient(ellipse 60% 50% at 0% 100%, var(--kova-indigo), transparent 45%)',
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
              Bienvenido de vuelta
            </p>
            <h1 className="font-heading text-3xl font-bold capitalize lg:text-4xl">
              Hola, {data.greeting}
            </h1>
            <p className="mt-3 text-[var(--kova-muted)] leading-relaxed">
              Tu espacio comercial en KOVA. Explora vacantes, actualiza tu perfil y sigue tus
              aplicaciones en un solo lugar.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/portal/vacantes"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--kova-shadow-xs)] transition hover:shadow-[var(--kova-shadow-sm)]"
                style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
              >
                <Sparkles className="h-4 w-4" />
                Ver vacantes
              </Link>
              <Link
                href="/portal/experiencia"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--kova-border-strong)] bg-white/80 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white"
              >
                <Briefcase className="h-4 w-4" />
                Mi experiencia
              </Link>
            </div>
          </div>

          <ProfileProgressPanel completeness={data.profileCompleteness} gaps={profileGaps} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vacantes compatibles"
          value={data.stats.vacantesRecomendadas}
          sublabel="Según tu perfil comercial"
          icon={FileText}
          tone="indigo"
          href="/portal/vacantes"
        />
        <StatCard
          label="Aplicaciones activas"
          value={data.stats.aplicacionesActivas}
          sublabel="En proceso de selección"
          icon={Briefcase}
          tone="violet"
          href="/portal/aplicaciones"
        />
        <StatCard
          label="Entrevistas próximas"
          value={data.stats.entrevistasProximas}
          sublabel="Agendadas"
          icon={Calendar}
          tone="lime"
        />
        <StatCard
          label="Hoja de vida"
          value={data.stats.hasCv ? 'Lista' : 'Pendiente'}
          sublabel={data.stats.hasCv ? 'Documento cargado' : 'Sube tu CV para mejorar match'}
          icon={Upload}
          tone={data.stats.hasCv ? 'emerald' : 'amber'}
          href="/portal/documentos"
        />
      </section>

      {/* Steps + CTA */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="kova-card rounded-3xl border p-6 lg:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
                Tu progreso
              </p>
              <h2 className="font-heading text-xl font-bold">Próximos pasos</h2>
            </div>
            <span className="rounded-full border border-[var(--kova-border)] bg-[var(--kova-surface-2)] px-3 py-1 text-xs font-medium text-[var(--kova-muted)]">
              {completedSteps} de {totalSteps} completados
            </span>
          </div>

          <ul className="space-y-3">
            {data.nextSteps.map((step, index) => {
              const StepIcon = STEP_ICONS[step.id] ?? Circle;
              const isNext = !step.done && step.id === nextPending?.id;

              return (
                <li key={step.id}>
                  <Link
                    href={step.href}
                    className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                      step.done
                        ? 'border-emerald-200/80 bg-emerald-50/50'
                        : isNext
                          ? 'border-[var(--kova-blue)]/25 bg-[var(--kova-blue-soft)]/40 shadow-[var(--kova-shadow-xs)] hover:shadow-[var(--kova-shadow-sm)]'
                          : 'border-[var(--kova-border)] bg-white hover:border-[var(--kova-border-strong)] hover:bg-[var(--kova-surface-2)]/50'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        step.done
                          ? 'bg-emerald-100 text-emerald-700'
                          : isNext
                            ? 'bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]'
                            : 'bg-[var(--kova-surface-2)] text-[var(--kova-muted)]'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          step.done ? 'text-emerald-800 line-through decoration-emerald-400/60' : ''
                        }`}
                      >
                        {step.label}
                      </p>
                      {isNext ? (
                        <p className="mt-0.5 text-xs text-[var(--kova-blue)]">Siguiente paso recomendado</p>
                      ) : step.done ? (
                        <p className="mt-0.5 text-xs text-emerald-700">Completado</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-[var(--kova-muted)]">Paso {index + 1}</p>
                      )}
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        step.done ? 'text-emerald-600' : 'text-[var(--kova-muted)]'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--kova-border)] pt-5">
            <Link
              href="/portal/formacion"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--kova-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Formación
            </Link>
            <Link
              href="/portal/comercial"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--kova-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <Target className="h-3.5 w-3.5" />
              Perfil comercial
            </Link>
            <Link
              href="/portal/perfil"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--kova-muted)] hover:bg-[var(--kova-surface-2)] hover:text-[var(--kova-navy)]"
            >
              <User className="h-3.5 w-3.5" />
              Datos personales
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[var(--kova-border)] bg-[var(--kv-ink)] p-6 text-white lg:p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 100% 0%, var(--kova-lime), transparent 45%), radial-gradient(circle at 0% 100%, var(--kova-blue), transparent 50%)',
            }}
            aria-hidden
          />
          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Upload className="h-7 w-7 text-[var(--kova-lime)]" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-xl font-bold">Actualiza tu hoja de vida</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
              Un CV al día mejora tus recomendaciones y acelera postulaciones. Importamos experiencia,
              formación e idiomas por ti.
            </p>
            <Link
              href="/portal/documentos"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
              <Upload className="h-4 w-4" />
              Gestionar documentos
            </Link>
          </div>
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
