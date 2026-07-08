'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
  Upload,
} from 'lucide-react';
import { portalApi, type PortalDashboard } from '@/lib/api';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingStep } from '@/lib/portal-onboarding';
import { PortalOnboardingFlow } from '@/components/portal/onboarding/PortalOnboardingFlow';

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const inner = (
    <div className="kova-card rounded-2xl border p-5 h-full transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm text-[var(--kova-muted)]">{label}</p>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--kova-indigo-soft)] text-[var(--kova-indigo)]">
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="font-heading text-3xl font-bold">{value}</p>
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

function PortalFullDashboard({ data }: { data: PortalDashboard }) {
  return (
    <div className="space-y-8">
      <section className="kova-card rounded-3xl border p-6 lg:p-8 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, var(--kova-lime), transparent 55%), radial-gradient(circle at bottom left, var(--kova-indigo), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
            Bienvenido de vuelta
          </p>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
            Hola, {data.greeting}
          </h1>
          <p className="text-[var(--kova-muted)] max-w-xl">
            Tu perfil está listo. Explora vacantes compatibles con tu experiencia comercial.
          </p>

          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Perfil completado</span>
              <span className="font-mono text-[var(--kova-indigo)]">{data.profileCompleteness}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-[var(--kova-line)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.profileCompleteness}%`,
                  background: 'linear-gradient(90deg, var(--kova-indigo), var(--kova-lime-dark))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Vacantes compatibles"
          value={data.stats.vacantesRecomendadas}
          icon={FileText}
          href="/portal/vacantes"
        />
        <StatCard
          label="Aplicaciones activas"
          value={data.stats.aplicacionesActivas}
          icon={Briefcase}
          href="/portal/aplicaciones"
        />
        <StatCard
          label="Entrevistas próximas"
          value={data.stats.entrevistasProximas}
          icon={Calendar}
        />
        <StatCard
          label="Hoja de vida"
          value={data.stats.hasCv ? 'Lista' : 'Pendiente'}
          icon={Upload}
          href="/portal/documentos"
        />
      </section>

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="kova-card rounded-2xl border p-6">
          <h2 className="font-heading text-lg font-bold mb-4">Próximos pasos</h2>
          <ul className="space-y-3">
            {data.nextSteps.map((step) => (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[var(--kova-paper-2)] transition-colors"
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--kova-lime-dark)] shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[var(--kova-muted)] shrink-0" />
                  )}
                  <span className="flex-1 text-sm font-medium">{step.label}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--kova-muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="kova-card rounded-2xl border p-6 flex flex-col">
          <h2 className="font-heading text-lg font-bold mb-2">Actualiza tu hoja de vida</h2>
          <p className="text-sm text-[var(--kova-muted)] mb-6 flex-1">
            Mantén tu perfil al día para recibir mejores recomendaciones.
          </p>
          <Link
            href="/portal/documentos"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
            <Upload className="w-4 h-4" />
            Gestionar documentos
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function PortalDashboardPage() {
  const [data, setData] = useState<PortalDashboard | null>(null);
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([portalApi.perfil(), portalApi.dashboard().catch(() => null)])
      .then(([perfil, dashboard]) => {
        setProfile(perfil.profile as CommercialProfile);
        setOnboardingComplete(Boolean(perfil.onboardingComplete));
        setOnboardingStep((perfil.onboardingStep as OnboardingStep) ?? 'welcome');
        if (dashboard) setData(dashboard);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-muted)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Cargando tu espacio...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center">
        <p className="text-[var(--kova-muted)]">{error}</p>
      </div>
    );
  }

  if (!onboardingComplete && profile) {
    return (
      <PortalOnboardingFlow
        initialProfile={profile}
        initialStep={onboardingStep === 'done' ? 'welcome' : onboardingStep}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (!data) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center">
        <p className="text-[var(--kova-muted)]">{error || 'No pudimos cargar el dashboard'}</p>
      </div>
    );
  }

  return <PortalFullDashboard data={data} />;
}
