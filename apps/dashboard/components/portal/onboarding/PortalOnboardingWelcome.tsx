'use client';

import { ArrowRight, Briefcase, CheckCircle2, Circle, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  PROFILE_BUILD_MILESTONES,
  type ProfileMilestoneId,
} from '@/lib/portal-onboarding-unified';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

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
    <PortalOnboardingChrome journeyIndex={0} minutesLeft={minutesLeft} onSaveExit={onSaveExit}>
      <div className="ob-welcome">
        <div className="ob-welcome__hero">
          <p className="ob-welcome__greeting">
            Hola {firstName} <span aria-hidden>👋</span>
          </p>
          <div className="ob-welcome__headline">
            <div>
              <h1>Hoy construiremos tu perfil profesional.</h1>
              <p>Nos tomará menos de 5 minutos.</p>
            </div>
            <PortalOnboardingProgressRing percent={0} />
          </div>
          <p className="ob-welcome__benefit">
            Mientras mejor sea tu perfil, mejores oportunidades podremos mostrarte.
          </p>
          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary ob-welcome__cta"
            onClick={onStart}
          >
            Comenzar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <ul className="ob-welcome__milestones" aria-label="Lo que construiremos">
          {PROFILE_BUILD_MILESTONES.map((item) => {
            const Icon = MILESTONE_ICONS[item.id];
            return (
              <li key={item.id} className="ob-welcome__milestone">
                <span className="ob-welcome__milestone-icon" aria-hidden>
                  <Circle className="h-4 w-4" />
                  <Icon className="h-3.5 w-3.5 ob-welcome__milestone-glyph" />
                </span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </PortalOnboardingChrome>
  );
}
