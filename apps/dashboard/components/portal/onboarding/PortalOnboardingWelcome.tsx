'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Briefcase, CheckCircle2, Loader2, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  PROFILE_BUILD_MILESTONES,
  formatFirstName,
  type ProfileMilestoneId,
} from '@/lib/portal-onboarding-unified';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';

const MILESTONE_ICONS: Record<ProfileMilestoneId, typeof Briefcase> = {
  experiencia: Briefcase,
  trayectoria: TrendingUp,
  estilo: Target,
  fortalezas: Sparkles,
  listo: CheckCircle2,
};

const BOOT_MESSAGES = [
  'Preparando tu espacio de perfil…',
  'Configurando tu experiencia…',
  'Casi listo…',
] as const;

type Props = {
  firstName: string;
  minutesLeft: number;
  onStart: () => void;
  onSaveExit?: () => void;
};

export function PortalOnboardingWelcome({ firstName, minutesLeft, onStart, onSaveExit }: Props) {
  const [bootIndex, setBootIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (bootIndex >= BOOT_MESSAGES.length - 1) {
      const done = setTimeout(() => setReady(true), 450);
      return () => clearTimeout(done);
    }
    const timer = setTimeout(() => setBootIndex((i) => i + 1), 550);
    return () => clearTimeout(timer);
  }, [bootIndex]);

  const handleStart = () => {
    setStarting(true);
    window.setTimeout(() => onStart(), 700);
  };

  return (
    <PortalOnboardingChrome
      journeyIndex={0}
      minutesLeft={minutesLeft}
      percent={0}
      onSaveExit={onSaveExit}
      narrow
      hideHeaderProgress
    >
      <div className={`ob-welcome${ready ? ' ob-welcome--ready' : ''}${starting ? ' ob-welcome--starting' : ''}`}>
        {!ready || starting ? (
          <div className="ob-welcome__boot" aria-live="polite">
            <span className="ob-welcome__boot-ring" aria-hidden>
              <Loader2 className="h-6 w-6 animate-spin" />
            </span>
            <p className="ob-welcome__boot-text">
              {starting ? 'Iniciando construcción de tu perfil…' : BOOT_MESSAGES[bootIndex]}
            </p>
          </div>
        ) : (
          <>
            <header className="ob-welcome__intro">
              <p className="ob-welcome__eyebrow">Perfil ejecutivo</p>
              <h1>Bienvenido, {formatFirstName(firstName)}</h1>
              <p className="ob-welcome__lead">
                Construye un perfil de alto impacto para oportunidades comerciales selectivas.
              </p>
            </header>

            <div className="ob-welcome__card">
              <p className="ob-welcome__card-label">Qué vamos a construir</p>
              <ol className="ob-welcome__milestones" aria-label="Estructura del perfil">
                {PROFILE_BUILD_MILESTONES.map((item, index) => {
                  const Icon = MILESTONE_ICONS[item.id];
                  return (
                    <li
                      key={item.id}
                      className="ob-welcome__milestone"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <span className="ob-welcome__milestone-index">{index + 1}</span>
                      <Icon className="h-3.5 w-3.5 ob-welcome__milestone-icon" aria-hidden />
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="ob-welcome__benefit">
                Los perfiles completos reciben prioridad en procesos con empresas líderes.
              </p>
            </div>

            <div className="ob-welcome__cta-wrap">
              <button
                type="button"
                className="portal-onboarding-btn portal-onboarding-btn--primary ob-welcome__cta"
                onClick={handleStart}
              >
                Iniciar perfil
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </>
        )}
      </div>
    </PortalOnboardingChrome>
  );
}
