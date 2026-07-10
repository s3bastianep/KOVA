'use client';

import { useEffect, useRef } from 'react';
import { PortalOnboardingShell } from '@/components/portal/onboarding/PortalOnboardingShell';
import { PortalOnboardingCvUpload } from '@/components/portal/onboarding/PortalOnboardingCvUpload';
import '@/components/portal/onboarding/portal-onboarding.css';

export default function OnboardingPreviewPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('portal-onboarding-immersive', 'portal-onboarding-active');
    document.body.style.background = '#12140f';
    return () => {
      document.documentElement.classList.remove('portal-onboarding-immersive', 'portal-onboarding-active');
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#12140f' }}>
      <PortalOnboardingShell
        percent={18}
        minutesLeft={4}
        journeyIndex={0}
        onSaveExit={() => {}}
        narrow
        hidePreview
        hideHeaderProgress
      >
        <PortalOnboardingCvUpload
          journeyIndex={0}
          inputRef={inputRef}
          onFile={() => {}}
        />
      </PortalOnboardingShell>
    </div>
  );
}
