'use client';

import { ArrowRight, Briefcase, CheckCircle2, Sparkles, Target, TrendingUp } from 'lucide-react';
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

type Props = {
  firstName: string;
  minutesLeft: number;
  onStart: () => void;
  onSaveExit?: () => void;
};

export function PortalOnboardingWelcome({ firstName, minutesLeft, onStart, onSaveExit }: Props) {
  return (
    <PortalOnboardingChrome journeyIndex={0} minutesLeft={minutesLeft} percent={0} onSaveExit={onSaveExit}>
      <div className="ob-welcome">
        <header className="ob-step-hero">
          <p className="ob-step-hero__eyebrow">Perfil ejecutivo</p>
          <h1>Bienvenido, {formatFirstName(firstName)}</h1>
          <p>Construye un perfil de alto impacto para oportunidades comerciales selectivas.</p>
        </header>

        <p className="ob-welcome__benefit">
          Los perfiles completos reciben prioridad en procesos con empresas líderes.
        </p>

        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary ob-welcome__cta"
          onClick={onStart}
        >
          Iniciar perfil
          <ArrowRight className="w-4 h-4" />
        </button>

        <ol className="ob-welcome__milestones" aria-label="Estructura del perfil">
          {PROFILE_BUILD_MILESTONES.map((item, index) => {
            const Icon = MILESTONE_ICONS[item.id];
            return (
              <li key={item.id} className="ob-welcome__milestone">
                <span className="ob-welcome__milestone-index">{index + 1}</span>
                <Icon className="h-3.5 w-3.5 ob-welcome__milestone-icon" aria-hidden />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </PortalOnboardingChrome>
  );
}
