'use client';

import { ArrowRight, Briefcase, CheckCircle2, Circle, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  PROFILE_BUILD_MILESTONES,
  type ProfileMilestoneId,
} from '@/lib/portal-onboarding-unified';

const MILESTONE_ICONS: Record<ProfileMilestoneId, typeof Briefcase> = {
  experiencia: Briefcase,
  trayectoria: TrendingUp,
  estilo: Target,
  fortalezas: Sparkles,
  listo: CheckCircle2,
};

type Props = {
  firstName: string;
  onStart: () => void;
};

export function PortalOnboardingWelcome({ firstName, onStart }: Props) {
  return (
    <div className="portal-onboarding portal-onboarding--immersive">
      <div className="portal-onboarding-welcome">
        <div className="portal-onboarding-welcome__content">
          <p className="portal-onboarding-welcome__greeting">
            Hola {firstName} <span aria-hidden>👋</span>
          </p>
          <h1 className="portal-onboarding-welcome__title">Hoy construiremos tu perfil profesional.</h1>
          <p className="portal-onboarding-welcome__subtitle">Nos tomará menos de 5 minutos.</p>

          <div className="portal-onboarding-welcome__progress">
            <div className="portal-onboarding-progress portal-onboarding-progress--welcome" aria-hidden>
              <span style={{ width: '0%' }} />
            </div>
            <span className="portal-onboarding-welcome__percent">0%</span>
          </div>

          <p className="portal-onboarding-welcome__benefit">
            Mientras mejor sea tu perfil, mejores oportunidades podremos mostrarte.
          </p>

          <button type="button" className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-welcome__cta" onClick={onStart}>
            Comenzar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <ul className="portal-onboarding-welcome__milestones" aria-label="Lo que construiremos">
          {PROFILE_BUILD_MILESTONES.map((item) => {
            const Icon = MILESTONE_ICONS[item.id];
            return (
              <li key={item.id} className="portal-onboarding-welcome__milestone">
                <span className="portal-onboarding-welcome__milestone-icon" aria-hidden>
                  <Circle className="h-4 w-4" />
                  <Icon className="h-3.5 w-3.5 portal-onboarding-welcome__milestone-glyph" />
                </span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
