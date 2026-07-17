'use client';

import { useEffect, useRef, useState } from 'react';
import { PortalOnboardingShell } from '@/components/portal/onboarding/PortalOnboardingShell';
import { PortalOnboardingChrome } from '@/components/portal/onboarding/PortalOnboardingChrome';
import { PortalOnboardingCvUpload } from '@/components/portal/onboarding/PortalOnboardingCvUpload';
import { PortalOnboardingCvAnalyzing } from '@/components/portal/onboarding/PortalOnboardingCvAnalyzing';
import { PortalOnboardingReviewHub } from '@/components/portal/onboarding/PortalOnboardingReviewHub';
import { PortalOnboardingCvSummary } from '@/components/portal/onboarding/PortalOnboardingCvSummary';
import { PortalOnboardingComplete } from '@/components/portal/onboarding/PortalOnboardingComplete';
import { PortalOnboardingWelcome } from '@/components/portal/onboarding/PortalOnboardingWelcome';
import { PortalOnboardingPreferencias } from '@/components/portal/onboarding/PortalOnboardingPreferencias';
import { guideMessageForStep } from '@/components/portal/onboarding/PortalOnboardingGuide';
import { getActiveSteps } from '@/lib/portal-preferencias-wizard';
import { applyFullCvExtraction, countsFromExtraction } from '@/lib/portal-onboarding';
import { enrichCvExtraction } from '@/app/registro/registro-utils';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingCounts } from '@/lib/portal-onboarding';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import type { ReviewSectionId } from '@/lib/portal-onboarding-unified';
import '@/components/portal/onboarding/portal-onboarding.css';

const MOCK_PROFILE: CommercialProfile = {
  nombre: 'Sebastián Restrepo',
  email: 'sebastian@example.com',
  telefono: '+57 300 123 4567',
  ciudad: 'Medellín',
  rol: 'Ejecutivo Comercial Senior',
  historialLaboral: [
    {
      id: '1',
      empresa: 'Rappi',
      cargo: 'Key Account Manager',
      fechaInicio: '2021-01-01',
      fechaFin: '',
      trabajoActual: true,
    },
    {
      id: '2',
      empresa: 'Bancolombia',
      cargo: 'Ejecutivo Comercial',
      fechaInicio: '2018-03-01',
      fechaFin: '2020-12-01',
      trabajoActual: false,
    },
  ],
  formacion: [{ id: '1', institucion: 'EAFIT', titulo: 'Administración de Empresas' }],
  idiomas: [
    { id: '1', idioma: 'Español', nivel: 'Nativo' },
    { id: '2', idioma: 'Inglés', nivel: 'B2' },
  ],
  certificaciones: [],
  herramientas: ['Salesforce', 'HubSpot', 'Excel avanzado'],
} as unknown as CommercialProfile;

const MOCK_COUNTS: OnboardingCounts = {
  experiencias: 2,
  estudios: 1,
  certificaciones: 0,
  idiomas: 2,
  cursos: 0,
};

const MOCK_STATS: PortalVacancyMatchStats = {
  totalOpen: 24,
  recommendedCount: 6,
  averageCompatibility: 72,
  bestCompatibility: 91,
};

const STEPS = [
  'welcome',
  'cv_upload',
  'cv_analyzing',
  'review_hub',
  'preferencias',
  'cv_summary',
  'complete',
] as const;
type PreviewStep = (typeof STEPS)[number];

export default function OnboardingPreviewPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<PreviewStep>('welcome');
  const [reviewed, setReviewed] = useState<Set<ReviewSectionId>>(new Set(['personal']));
  const [prefAnswers, setPrefAnswers] = useState<Record<string, string[]>>({});
  const [salaryIdx, setSalaryIdx] = useState(2);
  const [prefStepIndex, setPrefStepIndex] = useState(0);
  // Real CV extraction: when a file is uploaded we run the actual parser and drive the review /
  // summary screens with the REAL data instead of the mock, to prove the engine works.
  const [realProfile, setRealProfile] = useState<CommercialProfile | null>(null);
  const [realCounts, setRealCounts] = useState<OnboardingCounts | null>(null);
  const [uploadError, setUploadError] = useState('');

  const profile = realProfile ?? MOCK_PROFILE;
  const counts = realCounts ?? MOCK_COUNTS;

  const handleRealUpload = async (file: File | null | undefined) => {
    if (!file) return;
    setUploadError('');
    setStep('cv_analyzing');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/dev/cv-extract', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data?.message ?? 'No pudimos leer el archivo.');
        setStep('cv_upload');
        return;
      }
      const aligned = enrichCvExtraction(data, {} as CommercialProfile);
      const nextProfile = applyFullCvExtraction({} as CommercialProfile, aligned);
      setRealProfile(nextProfile);
      setRealCounts(countsFromExtraction(aligned));
      // Small beat on the analysis screen, then reveal the real extracted data.
      window.setTimeout(() => setStep('review_hub'), 1600);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error de red.');
      setStep('cv_upload');
    }
  };

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
      {/* Dev-only step switcher */}
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '6px 8px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {STEPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: step === s ? '#c5de4e' : 'rgba(255,255,255,0.08)',
              color: step === s ? '#12140f' : 'rgba(255,255,255,0.7)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {step === 'welcome' ? (
        <PortalOnboardingWelcome firstName="Sebastián" minutesLeft={5} onStart={() => setStep('cv_upload')} />
      ) : null}

      {step === 'cv_upload' ? (
        <PortalOnboardingShell percent={18} minutesLeft={4} journeyIndex={0} guideMessage={guideMessageForStep('cv_upload')} onSaveExit={() => {}} hidePreview>
          <PortalOnboardingCvUpload
            journeyIndex={0}
            inputRef={inputRef}
            onFile={(file) => void handleRealUpload(file)}
            error={uploadError}
          />
        </PortalOnboardingShell>
      ) : null}

      {step === 'cv_analyzing' ? (
        <PortalOnboardingShell percent={28} minutesLeft={4} journeyIndex={0} guideMessage={guideMessageForStep('cv_analyzing')} onSaveExit={() => {}} hidePreview>
          <PortalOnboardingCvAnalyzing
            analysisDone={6}
            analysisProgress={100}
            complete
            onContinue={() => {}}
          />
        </PortalOnboardingShell>
      ) : null}

      {step === 'review_hub' ? (
        <PortalOnboardingShell percent={40} minutesLeft={3} journeyIndex={1} guideMessage={guideMessageForStep('review_hub')} onSaveExit={() => {}} narrow hidePreview>
          <PortalOnboardingReviewHub
            firstName="Sebastián"
            percent={40}
            profile={profile}
            reviewed={reviewed}
            onEdit={() => {}}
            onMarkReviewed={(id) => setReviewed((prev) => new Set([...prev, id]))}
          />
        </PortalOnboardingShell>
      ) : null}

      {step === 'preferencias' ? (
        <PortalOnboardingShell
          percent={62}
          minutesLeft={2}
          journeyIndex={2}
          guideMessage={guideMessageForStep('preferencias', getActiveSteps(profile)[prefStepIndex]?.block)}
          onSaveExit={() => {}}
          narrow
          hidePreview
        >
          <PortalOnboardingPreferencias
            firstName="Sebastián"
            percent={62}
            profile={profile}
            answers={prefAnswers}
            stepIndex={prefStepIndex}
            salaryIdx={salaryIdx}
            languageLevels={{}}
            onToggle={(stepId, option, multi) =>
              setPrefAnswers((prev) => {
                const cur = prev[stepId] ?? [];
                if (multi) {
                  return {
                    ...prev,
                    [stepId]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option],
                  };
                }
                return { ...prev, [stepId]: [option] };
              })
            }
            onSalaryChange={setSalaryIdx}
            onLanguageLevel={() => {}}
            onCustomOptionText={(stepId, placeholder, text) =>
              setPrefAnswers((prev) => {
                const cur = prev[stepId] ?? [];
                const idx = cur.findIndex((v) => v === placeholder || v.startsWith(`${placeholder}: `));
                if (idx === -1) return prev;
                const next = [...cur];
                next[idx] = text.trim() ? `${placeholder}: ${text.trim()}` : placeholder;
                return { ...prev, [stepId]: next };
              })
            }
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
            <button type="button" onClick={() => setPrefStepIndex((i) => Math.max(0, i - 1))} style={{ color: '#888' }}>
              ← paso pref
            </button>
            <button type="button" onClick={() => setPrefStepIndex((i) => i + 1)} style={{ color: '#c5de4e' }}>
              paso pref →
            </button>
          </div>
        </PortalOnboardingShell>
      ) : null}

      {step === 'cv_summary' ? (
        <PortalOnboardingShell percent={99} minutesLeft={0} journeyIndex={4} guideMessage={guideMessageForStep('cv_summary')} onSaveExit={() => {}} hidePreview>
          <PortalOnboardingCvSummary
            firstName="Sebastián"
            profile={profile}
            counts={counts}
            percent={99}
            journeyIndex={4}
            vacancyStats={MOCK_STATS}
            onAddSkills={() => setRealProfile((prev) => ({ ...(prev ?? profile), herramientas: ['Salesforce'] }))}
            onEditSection={(section) => window.alert(`Iría a editar: ${section}`)}
          />
        </PortalOnboardingShell>
      ) : null}

      {step === 'complete' ? (
        <PortalOnboardingComplete percent={98} vacancyStats={MOCK_STATS} onEnter={() => {}} />
      ) : null}
    </div>
  );
}
