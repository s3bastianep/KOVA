'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  History,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import './registro.css';
import {
  AVAILABILITY_OPTIONS,
  calculateProfileCompleteness,
  CLIENT_TYPE_OPTIONS,
  COMMERCIAL_INDUSTRIES,
  COMMISSION_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  CRM_SALES_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EVIDENCE_COMPETENCY_TAGS,
  GEO_COVERAGE_OPTIONS,
  HIGH_SCORE_THRESHOLD,
  INTERLOCUTOR_OPTIONS,
  isEducationComplete,
  isLanguageComplete,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  newCertificationEntry,
  newEducationEntry,
  newLanguageEntry,
  PORTFOLIO_SIZE_OPTIONS,
  PROFESSIONAL_OBJECTIVE_OPTIONS,
  RELOCATION_OPTIONS,
  ROLE_FUNCTION_OPTIONS,
  ROLE_LEVEL_OPTIONS,
  SALARY_EXPECTATION_OPTIONS,
  SALE_CYCLE_OPTIONS,
  SALES_CHANNEL_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TICKET_OPTIONS,
  TRAVEL_OPTIONS,
  type CommercialProfile,
  type EvidenceCard,
  competencyHasBacking,
  getCompetenciesForRole,
  isEvidenceCardComplete,
  isLeadershipRoleLevel,
  isWorkHistoryComplete,
  newEvidenceCard,
  newWorkHistoryEntry,
  splitFullName,
  type WorkHistoryEntry,
  type EducationEntry,
  type LanguageEntry,
  type CertificationEntry,
} from '@/lib/candidate-commercial-profile';
import {
  clearRegistroDraft,
  formatMonthYearDisplay,
  loadRegistroDraft,
  parseMonthYearInput,
  postRegistro,
  resumeRegistroSession,
  saveRegistroDraft,
  slugifyField,
  uploadRegistroCv,
} from './registro-utils';
import { CvImportPanel } from './CvImportPanel';

type CvImportPhase = 'offer' | 'uploading' | 'review' | 'done' | 'skipped';

const CRM_OTHER = 'Otro';

const STEPS = [
  {
    tag: 'Paso 1 de 8',
    short: 'Cuenta',
    title: 'Crea tu cuenta',
    sub: 'Sube tu HV en PDF para prellenar datos o completa el formulario manualmente.',
    kind: 'contact' as const,
    icon: User,
  },
  {
    tag: 'Paso 2 de 8',
    short: 'Rol',
    title: 'Tu rol y objetivo',
    sub: 'Define tu nivel y función. Los pasos comerciales siguen siendo manuales.',
    kind: 'role' as const,
    icon: Briefcase,
  },
  {
    tag: 'Paso 3 de 8',
    short: 'Historial',
    title: 'Historial laboral',
    sub: 'Tus trabajos anteriores en orden cronológico. Base para tus logros y años de experiencia.',
    kind: 'work' as const,
    icon: History,
  },
  {
    tag: 'Paso 4 de 8',
    short: 'Formación',
    title: 'Formación y expectativas',
    sub: 'Educación, idiomas y rango salarial esperado. Clave para un match real con las vacantes.',
    kind: 'education' as const,
    icon: GraduationCap,
  },
  {
    tag: 'Paso 5 de 8',
    short: 'Cómo vendes',
    title: 'Cómo vendes',
    sub: 'Misma estructura que usamos al crear vacantes, para comparar campo a campo.',
    kind: 'sales' as const,
    icon: Target,
  },
  {
    tag: 'Paso 6 de 8',
    short: 'Industria',
    title: 'Tu industria',
    sub: 'Selecciona las industrias donde tienes experiencia y marca la principal.',
    kind: 'industry' as const,
    icon: Building2,
  },
  {
    tag: 'Paso 7 de 8',
    short: 'Logros',
    title: 'Tarjetas de evidencia',
    sub: 'Hitos destacados con cifras. Puedes vincularlos a una experiencia del paso 3.',
    kind: 'achievements' as const,
    icon: TrendingUp,
  },
  {
    tag: 'Paso 8 de 8',
    short: 'Competencias',
    title: 'Competencias con evidencia',
    sub: 'Autoevalúate y vincula cada competencia con un logro del paso 7 o un ejemplo corto.',
    kind: 'sliders' as const,
    icon: Sparkles,
  },
];

const STEP_INSIGHTS = [
  'Los perfiles completos tienen prioridad cuando abre una vacante compatible contigo.',
  'Tu nivel define las competencias del paso 8. Cuanto más preciso, mejor el match.',
  'Este historial alimenta tus tarjetas de evidencia y años de experiencia reales.',
  'Educación e idiomas ayudan a filtrar vacantes que sí encajan contigo.',
  'Usamos la misma estructura que las vacantes B2B, con comparación campo a campo.',
  'Las industrias donde has vendido pesan fuerte en el scoring de compatibilidad.',
  'Los logros con cifras son la evidencia que diferencia tu perfil del resto.',
  'Competencias con respaldo valen más que un puntaje sin ejemplo concreto.',
];

const EMPTY_PROFILE: CommercialProfile = {
  industrias: [],
  tickets: [],
  historialLaboral: [],
  formacion: [],
  idiomas: [],
  certificaciones: [],
  logros: [],
  competencias: {},
  tamanoEquipo: '0',
};

function RequiredMark({ className = '' }: { className?: string }) {
  return (
    <abbr
      className={['kv-field-required', className].filter(Boolean).join(' ')}
      title="Campo obligatorio"
      aria-label="obligatorio"
    >
      *
    </abbr>
  );
}

function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        'kv-field-label',
        required ? 'kv-field-label--required' : '',
        optional ? 'kv-field-label--optional' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {required ? (
        <>
          {' '}
          <RequiredMark />
        </>
      ) : null}
      {optional ? <span className="kv-field-optional"> (opcional)</span> : null}
    </label>
  );
}

function SalesSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="kv-registro-section">
      <h3 className="kv-registro-section-title">{title}</h3>
      <div className="kv-registro-section-body">{children}</div>
    </section>
  );
}

function MonthYearInput({
  id,
  value,
  onChange,
  disabled,
  required,
}: {
  id: string;
  value: string;
  onChange: (normalized: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  const [display, setDisplay] = useState(() => formatMonthYearDisplay(value));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setDisplay(formatMonthYearDisplay(value));
    setInvalid(false);
  }, [value]);

  return (
    <div className="kv-registro-month-field">
      <input
        id={id}
        className={`kv-registro-input${invalid ? ' kv-registro-input--invalid' : ''}`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/AAAA"
        disabled={disabled}
        required={required}
        value={display}
        aria-describedby={`${id}-hint`}
        onChange={(e) => {
          const raw = e.target.value;
          setDisplay(raw);
          if (!raw.trim()) {
            setInvalid(false);
            onChange('');
            return;
          }
          const parsed = parseMonthYearInput(raw);
          if (parsed === null) {
            setInvalid(true);
            return;
          }
          setInvalid(false);
          onChange(parsed);
        }}
        onBlur={() => {
          if (!display.trim()) return;
          const parsed = parseMonthYearInput(display);
          if (parsed && parsed !== '') {
            setDisplay(formatMonthYearDisplay(parsed));
            onChange(parsed);
            setInvalid(false);
          } else if (parsed === '') {
            setInvalid(false);
          }
        }}
      />
      <p className="kv-registro-field-format-hint font-mono" id={`${id}-hint`}>
        Formato MM/AAAA · Ej. 03/2020
      </p>
    </div>
  );
}

function ChoiceField({
  label,
  value,
  options,
  onSelect,
  compact = false,
  required = false,
  namePrefix,
}: {
  label: string;
  value?: string;
  options: readonly string[] | string[];
  onSelect: (option: string) => void;
  compact?: boolean;
  required?: boolean;
  namePrefix?: string;
}) {
  const fieldSlug = namePrefix ?? slugifyField(label);
  const compactCols = compact
    ? options.length <= 2
      ? ' kv-registro-choice-grid--cols-2'
      : options.length === 3
        ? ' kv-registro-choice-grid--cols-3'
        : ' kv-registro-choice-grid--cols-auto'
    : '';

  const gridClass = compact
    ? ` kv-registro-choice-grid--compact${compactCols}`
    : options.length > 2
      ? ' kv-registro-choice-grid--wide'
      : '';

  return (
    <div
      className={[
        'kv-registro-field',
        'kv-registro-field--choice',
        compact ? 'kv-registro-field--compact' : '',
        required && !value ? 'kv-registro-field--incomplete' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className={`kv-registro-choice-grid${gridClass}`}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={`${fieldSlug}-${option}`}
              type="button"
              name={fieldSlug}
              className={`kv-registro-choice${selected ? ' selected' : ''}${compact ? ' kv-registro-choice--compact' : ''}`}
              onClick={() => onSelect(option)}
              aria-pressed={selected}
              aria-label={`${label}: ${option}`}
            >
              <span className="kv-registro-choice-text">{option}</span>
              {!compact && (
                <span className="kv-registro-choice-mark" aria-hidden>
                  {selected ? <Check strokeWidth={2.5} size={15} /> : null}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressRing({ value, size = 92 }: { value: number; size?: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

  return (
    <div className="kv-registro-ring-wrap">
      <svg width={size} height={size} className="kv-registro-ring" aria-hidden>
        <circle
          className="kv-registro-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="kv-registro-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="kv-registro-ring-label">
        <strong>{value}%</strong>
      </div>
    </div>
  );
}

function asideHeroTitle(completeness: number) {
  if (completeness < 35) return 'Vamos paso a paso';
  if (completeness < 70) return 'Vas avanzando bien';
  return 'Ya casi terminas';
}

function RegistroShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="kv-registro">
      <div className="kv-registro-bg" aria-hidden />
      <header className="kv-registro-nav">
        <a href="/" className="kv-registro-logo font-heading">
          <span className="kv-registro-logo-mark" aria-hidden />
          Kova
        </a>
        <div className="kv-registro-nav-end">
          <span className="kv-registro-nav-pill font-mono">Constructor de perfil comercial</span>
          <a href="/login" className="kv-registro-nav-link">
            Iniciar sesión
          </a>
          <a href="/" className="kv-registro-nav-link">
            Volver al inicio
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function RegistroPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CommercialProfile>(EMPTY_PROFILE);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftNote, setDraftNote] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [resumeToken, setResumeToken] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState('');
  const [cvImportPhase, setCvImportPhase] = useState<CvImportPhase>('offer');
  const [cvSkippedOnce, setCvSkippedOnce] = useState(false);
  const pendingCvFileRef = useRef<File | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const draft = loadRegistroDraft();
      if (!draft) return;

      setProfile(draft.profile);
      setStep(Math.min(Math.max(0, draft.step), STEPS.length - 1));
      setDraftNote(true);
      if (draft.cvImportPhase) setCvImportPhase(draft.cvImportPhase);
      if (draft.cvSkippedOnce) setCvSkippedOnce(true);

      if (draft.candidateId && draft.resumeToken) {
        setCandidateId(draft.candidateId);
        setResumeToken(draft.resumeToken);
        setAccountCreated(Boolean(draft.accountCreated));

        try {
          const remote = await resumeRegistroSession(draft.candidateId, draft.resumeToken);
          if (cancelled) return;
          if (remote.profile && typeof remote.profile === 'object') {
            setProfile((prev) => ({ ...prev, ...remote.profile }));
          }
          if (typeof remote.step === 'number') {
            setStep(Math.min(Math.max(0, remote.step), STEPS.length - 1));
          }
          setAccountCreated(Boolean(remote.accountCreated));
        } catch {
          /* local draft sigue disponible */
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (done) return;
    saveRegistroDraft({
      profile,
      step,
      savedAt: new Date().toISOString(),
      candidateId: candidateId ?? undefined,
      resumeToken: resumeToken ?? undefined,
      accountCreated,
      cvImportPhase,
      cvSkippedOnce,
    });
  }, [profile, step, done, candidateId, resumeToken, accountCreated, cvImportPhase, cvSkippedOnce]);

  useEffect(() => {
    if (step === 2 && cvSkippedOnce && cvImportPhase === 'skipped') {
      setCvImportPhase('offer');
    }
  }, [step, cvSkippedOnce, cvImportPhase]);

  const goToStep = (target: number) => {
    if (target < 0 || target >= STEPS.length || target === step) return;
    if (target > 0 && !accountCreated) return;
    setStep(target);
    setError('');
    setSavedBanner('');
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const StepIcon = current.icon;
  const competencyDefs = useMemo(() => getCompetenciesForRole(profile.nivelRol), [profile.nivelRol]);
  const completeLogros = useMemo(
    () => (profile.logros ?? []).filter(isEvidenceCardComplete),
    [profile.logros],
  );
  const completeHistorial = useMemo(
    () => (profile.historialLaboral ?? []).filter(isWorkHistoryComplete),
    [profile.historialLaboral],
  );
  const profileCompleteness = useMemo(() => calculateProfileCompleteness(profile), [profile]);

  const canNext = useMemo(() => {
    if (step === 0) {
      return Boolean(
        profile.nombre?.trim() &&
          profile.email?.trim() &&
          /.+@.+\..+/.test(profile.email ?? '') &&
          profile.telefono?.trim() &&
          profile.ciudad?.trim() &&
          profile.disponibilidad &&
          profile.disponibilidadViajar &&
          profile.disponibilidadReubicacion &&
          profile.consentimientoDatos,
      );
    }
    if (step === 1) {
      return Boolean(
        profile.nivelRol &&
          profile.funcionPrincipal &&
          profile.objetivoProfesional &&
          profile.tamanoEquipo != null &&
          profile.tamanoEquipo !== '',
      );
    }
    if (step === 2) {
      return completeHistorial.length >= 1;
    }
    if (step === 3) {
      const eduOk = (profile.formacion ?? []).some(isEducationComplete);
      const langOk = (profile.idiomas ?? []).some(isLanguageComplete);
      return Boolean(eduOk && langOk && profile.expectativaSalarial);
    }
    if (step === 4) {
      const tickets = profile.tickets ?? [];
      const ticketOk = tickets.length > 0 && (tickets.length === 1 || Boolean(profile.ticketPrincipal));
      const crmOk =
        profile.crmVentas === CRM_OTHER
          ? Boolean(profile.crmVentasOtro?.trim())
          : Boolean(profile.crmVentas);
      return Boolean(
        profile.tipoVenta &&
          profile.naturaleza &&
          profile.enfoque &&
          profile.tipoCliente &&
          profile.nivelInterlocutor &&
          profile.canalVenta &&
          profile.coberturaGeografica &&
          profile.cuentasCartera &&
          crmOk &&
          profile.estructuraComision &&
          profile.ciclo &&
          ticketOk,
      );
    }
    if (step === 5) {
      const industries = profile.industrias ?? [];
      const primaryOk = industries.length <= 1 || Boolean(profile.industriaPrincipal);
      return industries.length > 0 && primaryOk;
    }
    if (step === 6) {
      return completeLogros.length >= 1;
    }
    return true;
  }, [step, profile, completeLogros.length, completeHistorial.length]);

  useEffect(() => {
    if (step === 2) {
      setProfile((prev) => {
        if ((prev.historialLaboral ?? []).length > 0) return prev;
        return { ...prev, historialLaboral: [newWorkHistoryEntry()] };
      });
    }
    if (step === 3) {
      setProfile((prev) => {
        let changed = false;
        const next = { ...prev };
        if ((prev.formacion ?? []).length === 0) {
          next.formacion = [newEducationEntry()];
          changed = true;
        }
        if ((prev.idiomas ?? []).length === 0) {
          next.idiomas = [newLanguageEntry()];
          changed = true;
        }
        return changed ? next : prev;
      });
    }
    if (step === 6) {
      setProfile((prev) => {
        if ((prev.logros ?? []).length > 0) return prev;
        return { ...prev, logros: [newEvidenceCard()] };
      });
    }
  }, [step]);

  const update = (patch: Partial<CommercialProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const updateCompetency = (key: string, patch: { score?: number; evidenceId?: string; ejemplo?: string }) => {
    setProfile((prev) => ({
      ...prev,
      competencias: {
        ...prev.competencias,
        [key]: {
          score: prev.competencias?.[key]?.score ?? 60,
          evidenceId: prev.competencias?.[key]?.evidenceId,
          ejemplo: prev.competencias?.[key]?.ejemplo,
          ...patch,
        },
      },
      [key]: patch.score ?? prev.competencias?.[key]?.score ?? 60,
    }));
  };

  const toggleTag = (key: 'industrias' | 'tickets', value: string) => {
    setProfile((prev) => {
      const list = [...(prev[key] ?? [])];
      const idx = list.indexOf(value);
      if (idx > -1) list.splice(idx, 1);
      else list.push(value);

      const next: CommercialProfile = { ...prev, [key]: list };
      if (key === 'tickets') {
        if (list.length === 1) next.ticketPrincipal = list[0];
        else if (prev.ticketPrincipal && !list.includes(prev.ticketPrincipal)) {
          next.ticketPrincipal = undefined;
        }
      }
      if (key === 'industrias') {
        if (list.length === 1) next.industriaPrincipal = list[0];
        else if (prev.industriaPrincipal && !list.includes(prev.industriaPrincipal)) {
          next.industriaPrincipal = undefined;
        }
      }
      return next;
    });
  };

  const updateLogro = (id: string, patch: Partial<EvidenceCard>) => {
    setProfile((prev) => ({
      ...prev,
      logros: (prev.logros ?? []).map((card) => (card.id === id ? { ...card, ...patch } : card)),
    }));
  };

  const toggleLogroCompetencia = (id: string, tag: string) => {
    setProfile((prev) => ({
      ...prev,
      logros: (prev.logros ?? []).map((card) => {
        if (card.id !== id) return card;
        const list = [...card.competencias];
        const idx = list.indexOf(tag);
        if (idx > -1) list.splice(idx, 1);
        else list.push(tag);
        return { ...card, competencias: list };
      }),
    }));
  };

  const addLogro = () => {
    setProfile((prev) => ({ ...prev, logros: [...(prev.logros ?? []), newEvidenceCard()] }));
  };

  const removeLogro = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      logros: (prev.logros ?? []).filter((c) => c.id !== id),
      competencias: Object.fromEntries(
        Object.entries(prev.competencias ?? {}).map(([k, v]) => [
          k,
          v.evidenceId === id ? { ...v, evidenceId: undefined } : v,
        ]),
      ),
    }));
  };

  const updateHistorial = (id: string, patch: Partial<WorkHistoryEntry>) => {
    setProfile((prev) => ({
      ...prev,
      historialLaboral: (prev.historialLaboral ?? []).map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const removeHistorial = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      historialLaboral: (prev.historialLaboral ?? []).filter((e) => e.id !== id),
      logros: (prev.logros ?? []).map((l) =>
        l.historialId === id ? { ...l, historialId: undefined } : l,
      ),
    }));
  };

  const addHistorial = () => {
    setProfile((prev) => {
      const entry = newWorkHistoryEntry();
      const isFirst = (prev.historialLaboral ?? []).length === 0;
      if (isFirst && prev.tamanoEquipo) {
        entry.tamanoEquipo = prev.tamanoEquipo;
      }
      return {
        ...prev,
        historialLaboral: [...(prev.historialLaboral ?? []), entry],
      };
    });
  };

  const updateFormacion = (id: string, patch: Partial<EducationEntry>) => {
    setProfile((prev) => ({
      ...prev,
      formacion: (prev.formacion ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const addFormacion = () => {
    setProfile((prev) => ({ ...prev, formacion: [...(prev.formacion ?? []), newEducationEntry()] }));
  };

  const removeFormacion = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      formacion: (prev.formacion ?? []).filter((e) => e.id !== id),
    }));
  };

  const updateIdioma = (id: string, patch: Partial<LanguageEntry>) => {
    setProfile((prev) => ({
      ...prev,
      idiomas: (prev.idiomas ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const addIdioma = () => {
    setProfile((prev) => ({ ...prev, idiomas: [...(prev.idiomas ?? []), newLanguageEntry()] }));
  };

  const removeIdioma = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      idiomas: (prev.idiomas ?? []).filter((e) => e.id !== id),
    }));
  };

  const updateCertificacion = (id: string, patch: Partial<CertificationEntry>) => {
    setProfile((prev) => ({
      ...prev,
      certificaciones: (prev.certificaciones ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const addCertificacion = () => {
    setProfile((prev) => ({
      ...prev,
      certificaciones: [...(prev.certificaciones ?? []), newCertificationEntry()],
    }));
  };

  const removeCertificacion = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      certificaciones: (prev.certificaciones ?? []).filter((e) => e.id !== id),
    }));
  };

  const linkLogroToHistorial = (logroId: string, historialId: string) => {
    const entry = (profile.historialLaboral ?? []).find((h) => h.id === historialId);
    if (!entry) return;
    updateLogro(logroId, {
      historialId,
      contexto: `${entry.empresa}${entry.sector ? ` · ${entry.sector}` : ''}`,
    });
  };

  const registroPayload = () => {
    const { firstName, lastName } = splitFullName(profile.nombre ?? '');
    return { profile, firstName, lastName, step };
  };

  const createAccount = async () => {
    setLoading(true);
    setError('');
    setSavedBanner('');
    try {
      const json = await postRegistro({
        action: 'account',
        ...registroPayload(),
      });
      setCandidateId(json.candidateId);
      setResumeToken(json.resumeToken);
      setAccountCreated(true);
      setCvImportPhase('offer');
      setSavedBanner(json.message ?? 'Cuenta creada. Continúa tu perfil cuando quieras.');
      if (pendingCvFileRef.current) {
        try {
          await uploadRegistroCv(pendingCvFileRef.current, json.candidateId, json.resumeToken);
          pendingCvFileRef.current = null;
        } catch {
          /* la cuenta ya quedó creada; el CV se puede volver a subir después */
        }
      }
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const persistProgress = async (options?: { announce?: boolean }) => {
    if (!accountCreated || !candidateId || !resumeToken) return;
    setSaving(true);
    setError('');
    try {
      const json = await postRegistro({
        action: 'progress',
        ...registroPayload(),
        candidateId,
        resumeToken,
      });
      if (options?.announce !== false) {
        setSavedBanner(json.message ?? 'Progreso guardado. Puedes continuar después.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el progreso');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveProgress = async () => {
    await persistProgress({ announce: true });
  };

  const continueStep = async () => {
    if (!canNext) return;
    try {
      if (accountCreated) await persistProgress({ announce: false });
      goToStep(step + 1);
    } catch {
      /* error shown */
    }
  };

  const handleCvApply = async (nextProfile: CommercialProfile) => {
    setProfile(nextProfile);
    setSavedBanner('Datos del CV aplicados. Revisa y ajusta lo que necesites.');
    if (accountCreated && candidateId && resumeToken) {
      try {
        const { firstName, lastName } = splitFullName(nextProfile.nombre ?? '');
        await postRegistro({
          action: 'progress',
          profile: nextProfile,
          firstName,
          lastName,
          step,
          candidateId,
          resumeToken,
        });
        if (pendingCvFileRef.current) {
          await uploadRegistroCv(pendingCvFileRef.current, candidateId, resumeToken);
          pendingCvFileRef.current = null;
        }
      } catch {
        /* el borrador local ya quedó actualizado */
      }
    }
  };

  const showCvImport =
    cvImportPhase !== 'done' &&
    ((!accountCreated && step === 0) ||
      (accountCreated && (step === 1 || (step === 2 && cvSkippedOnce))));

  const handleCvFileCaptured = (file: File) => {
    pendingCvFileRef.current = file;
  };

  const handleCvSkip = () => {
    setCvSkippedOnce(true);
    setCvImportPhase('skipped');
  };

  const publishProfile = async () => {
    if (!accountCreated || !candidateId || !resumeToken) {
      setError('Primero crea tu cuenta con tus datos básicos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const json = await postRegistro({
        action: 'publish',
        ...registroPayload(),
        candidateId,
        resumeToken,
      });
      clearRegistroDraft();
      setDone(json.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <RegistroShell>
        <div className="kv-registro-stage kv-registro-stage--success">
          <div className="kv-registro-success-card">
            <div className="kv-registro-success-icon" aria-hidden>
              <CheckCircle2 strokeWidth={2} />
            </div>
            <p className="kv-registro-step-tag font-mono">Perfil guardado</p>
            <h1 className="kv-registro-step-title font-heading">
              ¡Listo, {profile.nombre?.split(' ')[0] || 'candidato'}!
            </h1>
            <p className="kv-registro-step-sub">{done}</p>
            <div className="kv-registro-privacy">
              <Shield strokeWidth={2} aria-hidden />
              <p>
                Tu perfil quedó en la base de talento Kova. Si hay una vacante compatible, el equipo te
                contactará directamente. No verás puntajes ni ofertas aquí.
              </p>
            </div>
          </div>
        </div>
      </RegistroShell>
    );
  }

  return (
    <RegistroShell>
      <div className="kv-registro-layout">
        <aside className="kv-registro-aside">
          <div className="kv-registro-aside-panel">
            <p className="kv-registro-aside-eyebrow font-mono">Talent intelligence · Kova</p>
            <h2 className="kv-registro-aside-title font-heading">
              Tu perfil comercial, listo para el match
            </h2>
            <p className="kv-registro-aside-lead">
              Cuéntanos tu experiencia comercial y te avisamos cuando haya una vacante que encaje contigo.
            </p>

            <div className="kv-registro-aside-hero">
              <ProgressRing value={profileCompleteness} size={80} />
              <div className="kv-registro-aside-hero-copy">
                <p className="kv-registro-aside-hero-title font-heading">
                  {asideHeroTitle(profileCompleteness)}
                </p>
                <p className="kv-registro-aside-hero-meta font-mono">
                  <span>Paso {step + 1}/{STEPS.length}</span>
                  <span aria-hidden>·</span>
                  <span>~{Math.max(2, 12 - step)} min</span>
                </p>
              </div>
            </div>

            <ol className="kv-registro-stepper">
              {STEPS.map((s, i) => {
                const state = i < step ? 'done' : i === step ? 'active' : 'pending';
                const StepIconSmall = s.icon;
                return (
                  <li key={s.short}>
                    <button
                      type="button"
                      className={`kv-registro-stepper-item kv-registro-stepper-item--${state}`}
                      onClick={() => i <= step && goToStep(i)}
                      disabled={i > step || (i > 0 && !accountCreated)}
                      aria-current={i === step ? 'step' : undefined}
                    >
                      <span className="kv-registro-stepper-dot">
                        {state === 'done' ? (
                          <Check strokeWidth={2.5} size={13} />
                        ) : state === 'active' ? (
                          <StepIconSmall strokeWidth={2} size={13} />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <div>
                        <p className="kv-registro-stepper-label">{s.short}</p>
                        {state === 'active' && <p className="kv-registro-stepper-hint">En curso</p>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="kv-registro-aside-privacy">
              <Lock strokeWidth={2} aria-hidden />
              <span>Datos confidenciales · solo equipo Kova</span>
            </div>
            <p className="kv-registro-draft-note font-mono">
              {accountCreated
                ? 'Tu cuenta y tu progreso se guardan automáticamente. Puedes cerrar y volver después.'
                : draftNote
                  ? 'Retomamos tu borrador en este dispositivo. Crea tu cuenta para guardar en Kova.'
                  : 'Primero crea tu cuenta. Luego completa tu perfil por partes, a tu ritmo.'}
            </p>
          </div>
        </aside>

        <div className="kv-registro-main">
          <div className="kv-registro-mobile-bar">
            <div className="kv-registro-mobile-bar-meta">
              <span className="font-mono">{current.tag}</span>
              <span className="font-mono">{profileCompleteness}%</span>
            </div>
            <div className="kv-registro-segments kv-registro-segments--mobile" role="tablist" aria-label="Progreso del perfil">
              {STEPS.map((s, i) => (
                <button
                  key={s.short}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  aria-label={`${s.short}${i < step ? ', completado' : i === step ? ', actual' : ''}`}
                  className={`kv-registro-segment${i < step ? ' kv-registro-segment--done' : ''}${i === step ? ' kv-registro-segment--active' : ''}`}
                  onClick={() => i <= step && goToStep(i)}
                  disabled={i > step || (i > 0 && !accountCreated)}
                />
              ))}
            </div>
          </div>

          <div className="kv-registro-card">
            <div className="kv-registro-card-topbar">
              <div className="kv-registro-segments kv-registro-segments--desktop" role="tablist" aria-label="Progreso del perfil">
                {STEPS.map((s, i) => (
                  <button
                    key={s.short}
                    type="button"
                    role="tab"
                    aria-selected={i === step}
                    aria-label={`${s.short}${i < step ? ', completado' : i === step ? ', actual' : ''}`}
                    className={`kv-registro-segment${i < step ? ' kv-registro-segment--done' : ''}${i === step ? ' kv-registro-segment--active' : ''}`}
                    onClick={() => i <= step && goToStep(i)}
                    disabled={i > step || (i > 0 && !accountCreated)}
                  />
                ))}
              </div>
              <div className="kv-registro-card-topbar-meta font-mono">
                <span>{current.tag}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="kv-registro-card-top">
              <div className="kv-registro-insight" key={`insight-${step}`}>
                <Zap strokeWidth={2} size={16} aria-hidden />
                <span>{STEP_INSIGHTS[step]}</span>
              </div>

              <div className="kv-registro-card-head">
                <span className="kv-registro-card-icon" aria-hidden key={`icon-${step}`}>
                  <StepIcon strokeWidth={2} />
                </span>
                <div key={`head-${step}`}>
                  <h1 className="kv-registro-step-title font-heading">{current.title}</h1>
                  {current.sub && <p className="kv-registro-step-sub">{current.sub}</p>}
                </div>
              </div>
            </div>

            <div key={step} className="kv-registro-card-body kv-registro-step-panel">
              {showCvImport && (
                <CvImportPanel
                  profile={profile}
                  candidateId={candidateId}
                  resumeToken={resumeToken}
                  phase={cvImportPhase}
                  onPhaseChange={setCvImportPhase}
                  onSkip={handleCvSkip}
                  onApply={handleCvApply}
                  onFileCaptured={handleCvFileCaptured}
                  leading={step === 0}
                  compact={step === 2}
                />
              )}

              {current.kind === 'contact' && (
                <div className="kv-registro-form-stack">
                  <div className="kv-registro-field-row">
                    <div className={`kv-registro-field${!profile.nombre?.trim() ? ' kv-registro-field--incomplete' : ''}`}>
                      <FieldLabel htmlFor="nombre" required>
                        Nombre completo
                      </FieldLabel>
                      <div className="kv-registro-input-wrap">
                        <User strokeWidth={2} aria-hidden />
                        <input
                          id="nombre"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Ej. María López"
                          value={profile.nombre ?? ''}
                          onChange={(e) => update({ nombre: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={`kv-registro-field${!profile.ciudad?.trim() ? ' kv-registro-field--incomplete' : ''}`}>
                      <FieldLabel htmlFor="ciudad" required>
                        Ciudad
                      </FieldLabel>
                      <div className="kv-registro-input-wrap">
                        <MapPin strokeWidth={2} aria-hidden />
                        <input
                          id="ciudad"
                          type="text"
                          required
                          autoComplete="address-level2"
                          placeholder="Ej. Bogotá"
                          value={profile.ciudad ?? ''}
                          onChange={(e) => update({ ciudad: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="kv-registro-field-row">
                    <div
                      className={`kv-registro-field${
                        !profile.email?.trim() || (profile.email && !/.+@.+\..+/.test(profile.email))
                          ? ' kv-registro-field--incomplete'
                          : ''
                      }`}
                    >
                      <FieldLabel htmlFor="email" required>
                        Correo
                      </FieldLabel>
                      <div className="kv-registro-input-wrap">
                        <Mail strokeWidth={2} aria-hidden />
                        <input
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="tu@correo.com"
                          value={profile.email ?? ''}
                          onChange={(e) => update({ email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={`kv-registro-field${!profile.telefono?.trim() ? ' kv-registro-field--incomplete' : ''}`}>
                      <FieldLabel htmlFor="telefono" required>
                        Teléfono
                      </FieldLabel>
                      <div className="kv-registro-input-wrap">
                        <Phone strokeWidth={2} aria-hidden />
                        <input
                          id="telefono"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="300 123 4567"
                          value={profile.telefono ?? ''}
                          onChange={(e) => update({ telefono: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="kv-registro-field-group">
                    <h3 className="kv-registro-field-group-title kv-registro-field-group-title--required">
                      Disponibilidad <RequiredMark />
                    </h3>
                    <ChoiceField
                      compact
                      required
                      namePrefix="disponibilidad-inicio"
                      label="Inicio"
                      value={profile.disponibilidad}
                      options={AVAILABILITY_OPTIONS}
                      onSelect={(v) => update({ disponibilidad: v })}
                    />
                    <ChoiceField
                      compact
                      required
                      namePrefix="disponibilidad-viajar"
                      label="Viajar"
                      value={profile.disponibilidadViajar}
                      options={TRAVEL_OPTIONS}
                      onSelect={(v) => update({ disponibilidadViajar: v })}
                    />
                    <ChoiceField
                      compact
                      required
                      namePrefix="disponibilidad-reubicacion"
                      label="Cambio de ciudad"
                      value={profile.disponibilidadReubicacion}
                      options={RELOCATION_OPTIONS}
                      onSelect={(v) => update({ disponibilidadReubicacion: v })}
                    />
                  </div>

                  <label
                    className={`kv-registro-consent${
                      !profile.consentimientoDatos ? ' kv-registro-consent--incomplete' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      required
                      checked={Boolean(profile.consentimientoDatos)}
                      onChange={(e) => update({ consentimientoDatos: e.target.checked })}
                    />
                    <span>
                      <strong>
                        Acepto el uso de mis datos para matching comercial (Ley 1581).
                        {' '}
                        <RequiredMark />
                      </strong>
                    </span>
                  </label>
                </div>
              )}

              {current.kind === 'role' && (
                <>
                  <ChoiceField
                    required
                    namePrefix="rol-nivel"
                    label="Nivel del rol"
                    value={profile.nivelRol}
                    options={ROLE_LEVEL_OPTIONS}
                    onSelect={(v) => update({ nivelRol: v })}
                  />
                  <ChoiceField
                    required
                    namePrefix="rol-funcion"
                    label="Función principal"
                    value={profile.funcionPrincipal}
                    options={ROLE_FUNCTION_OPTIONS}
                    onSelect={(v) => update({ funcionPrincipal: v })}
                  />
                  <ChoiceField
                    required
                    namePrefix="rol-objetivo"
                    label="¿Qué estás buscando en tu próximo reto?"
                    value={profile.objetivoProfesional}
                    options={PROFESSIONAL_OBJECTIVE_OPTIONS}
                    onSelect={(v) => update({ objetivoProfesional: v })}
                  />
                  <ChoiceField
                    required
                    namePrefix="rol-tamano-equipo"
                    label="Tamaño de equipo que has liderado"
                    value={profile.tamanoEquipo}
                    options={TEAM_SIZE_OPTIONS}
                    onSelect={(v) => update({ tamanoEquipo: v })}
                  />
                  <div className="kv-registro-field">
                    <FieldLabel htmlFor="anios" optional>
                      Años de experiencia comercial
                    </FieldLabel>
                    <input
                      id="anios"
                      className="kv-registro-input"
                      type="number"
                      min={0}
                      max={40}
                      placeholder="Ej. 5"
                      value={profile.anios ?? ''}
                      onChange={(e) => update({ anios: e.target.value })}
                    />
                  </div>
                  {profile.nivelRol && (
                    <p className="kv-registro-field-hint kv-registro-field-hint--info">
                      En el paso 8 evaluaremos competencias de{' '}
                      <strong>{isLeadershipRoleLevel(profile.nivelRol) ? 'liderazgo' : 'ejecución comercial'}</strong>{' '}
                      según tu nivel de rol.
                    </p>
                  )}
                </>
              )}

              {current.kind === 'work' && (
                <div className="kv-registro-evidence-list kv-registro-work-list">
                  <p className="kv-registro-field-hint">
                    Agrega tu experiencia más reciente primero. Mínimo 1 cargo completo para continuar.
                  </p>
                  {(profile.historialLaboral ?? []).map((entry, index) => (
                    <article key={entry.id} className="kv-registro-evidence-card kv-registro-work-card">
                      <div className="kv-registro-evidence-card-head">
                        <span className="kv-registro-evidence-card-num font-mono">
                          Experiencia {index + 1}
                          {index === 0 ? ' · más reciente' : ''}
                        </span>
                        <button
                          type="button"
                          className="kv-registro-evidence-remove"
                          onClick={() => removeHistorial(entry.id)}
                          aria-label="Eliminar experiencia"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <SalesSection title="Datos básicos">
                        <div className="kv-registro-field">
                          <FieldLabel required>Cargo</FieldLabel>
                          <input
                            className="kv-registro-input"
                            placeholder="Ej. Gerente comercial regional"
                            value={entry.cargo}
                            onChange={(e) => updateHistorial(entry.id, { cargo: e.target.value })}
                          />
                        </div>
                        <div className="kv-registro-field-row">
                          <div className="kv-registro-field">
                            <FieldLabel required>Empresa</FieldLabel>
                            <input
                              className="kv-registro-input"
                              placeholder="Nombre de la empresa"
                              value={entry.empresa}
                              onChange={(e) => updateHistorial(entry.id, { empresa: e.target.value })}
                            />
                          </div>
                          <div className="kv-registro-field">
                            <FieldLabel required>Sector / industria de la empresa</FieldLabel>
                            <select
                              className="kv-registro-select"
                              value={entry.sector}
                              onChange={(e) => updateHistorial(entry.id, { sector: e.target.value })}
                            >
                              <option value="">Selecciona...</option>
                              {COMMERCIAL_INDUSTRIES.map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="kv-registro-field-row">
                          <div className="kv-registro-field">
                            <FieldLabel htmlFor={`inicio-${entry.id}`} required>
                              Fecha de inicio
                            </FieldLabel>
                            <MonthYearInput
                              id={`inicio-${entry.id}`}
                              value={entry.fechaInicio}
                              onChange={(fechaInicio) => updateHistorial(entry.id, { fechaInicio })}
                            />
                          </div>
                          <div className="kv-registro-field">
                            <FieldLabel htmlFor={`fin-${entry.id}`} required={!entry.trabajoActual}>
                              Fecha de fin
                            </FieldLabel>
                            <MonthYearInput
                              id={`fin-${entry.id}`}
                              value={entry.fechaFin ?? ''}
                              disabled={entry.trabajoActual}
                              required={!entry.trabajoActual}
                              onChange={(fechaFin) =>
                                updateHistorial(entry.id, { fechaFin, trabajoActual: false })
                              }
                            />
                          </div>
                        </div>
                        <label className="kv-registro-checkbox">
                          <input
                            type="checkbox"
                            checked={entry.trabajoActual}
                            onChange={(e) =>
                              updateHistorial(entry.id, {
                                trabajoActual: e.target.checked,
                                fechaFin: e.target.checked ? undefined : entry.fechaFin,
                              })
                            }
                          />
                          <span>Trabajo actual aquí</span>
                        </label>
                      </SalesSection>

                      <SalesSection title="Contexto del rol">
                        <div className="kv-registro-field">
                          <FieldLabel required>Descripción breve de funciones</FieldLabel>
                          <textarea
                            className="kv-registro-textarea kv-registro-textarea--compact"
                            placeholder="2-3 líneas sobre tu rol, responsabilidades y alcance..."
                            value={entry.descripcion}
                            onChange={(e) => updateHistorial(entry.id, { descripcion: e.target.value })}
                          />
                        </div>
                        <ChoiceField
                          namePrefix={`historial-equipo-${entry.id}`}
                          label="Tamaño de equipo liderado en ese cargo (si aplica)"
                          value={entry.tamanoEquipo ?? ''}
                          options={TEAM_SIZE_OPTIONS}
                          onSelect={(v) => updateHistorial(entry.id, { tamanoEquipo: v })}
                        />
                        <div className="kv-registro-field">
                          <label>Presupuesto o volumen de operación manejado</label>
                          <select
                            className="kv-registro-select"
                            value={entry.volumenOperacion ?? ''}
                            onChange={(e) =>
                              updateHistorial(entry.id, { volumenOperacion: e.target.value })
                            }
                          >
                            <option value="">Selecciona un rango (opcional)...</option>
                            {TICKET_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      </SalesSection>
                    </article>
                  ))}

                  <button type="button" className="kv-registro-add-evidence" onClick={addHistorial}>
                    <Plus size={18} />
                    {profile.historialLaboral?.length
                      ? 'Agregar experiencia anterior'
                      : 'Agregar experiencia laboral'}
                  </button>
                </div>
              )}

              {current.kind === 'education' && (
                <div className="kv-registro-evidence-list">
                  <SalesSection title="Formación académica">
                    <p className="kv-registro-field-hint">Agrega al menos una formación. Puedes incluir varias.</p>
                    {(profile.formacion ?? []).map((edu, index) => (
                      <article key={edu.id} className="kv-registro-evidence-card kv-registro-edu-card">
                        <div className="kv-registro-evidence-card-head">
                          <span className="kv-registro-evidence-card-num font-mono">Formación {index + 1}</span>
                          <button
                            type="button"
                            className="kv-registro-evidence-remove"
                            onClick={() => removeFormacion(edu.id)}
                            aria-label="Eliminar formación"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="kv-registro-field-row">
                          <div className="kv-registro-field">
                            <FieldLabel required>Nivel educativo</FieldLabel>
                            <select
                              className="kv-registro-select"
                              value={edu.nivel}
                              onChange={(e) => updateFormacion(edu.id, { nivel: e.target.value })}
                            >
                              <option value="">Selecciona...</option>
                              {EDUCATION_LEVEL_OPTIONS.map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                          <div className="kv-registro-field">
                            <FieldLabel optional>Año de graduación</FieldLabel>
                            <input
                              className="kv-registro-input"
                              type="number"
                              min={1970}
                              max={2030}
                              placeholder="Ej. 2018"
                              value={edu.anioGraduacion ?? ''}
                              onChange={(e) => updateFormacion(edu.id, { anioGraduacion: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="kv-registro-field">
                          <FieldLabel required>Título obtenido</FieldLabel>
                          <input
                            className="kv-registro-input"
                            placeholder="Ej. Administración de Empresas"
                            value={edu.titulo}
                            onChange={(e) => updateFormacion(edu.id, { titulo: e.target.value })}
                          />
                        </div>
                        <div className="kv-registro-field">
                          <FieldLabel required>Institución</FieldLabel>
                          <input
                            className="kv-registro-input"
                            placeholder="Ej. Universidad de los Andes"
                            value={edu.institucion}
                            onChange={(e) => updateFormacion(edu.id, { institucion: e.target.value })}
                          />
                        </div>
                      </article>
                    ))}
                    <button type="button" className="kv-registro-add-evidence" onClick={addFormacion}>
                      <Plus size={18} />
                      Agregar formación
                    </button>
                  </SalesSection>

                  <SalesSection title="Idiomas">
                    <p className="kv-registro-field-hint">Indica al menos un idioma y tu nivel.</p>
                    {(profile.idiomas ?? []).map((lang, index) => (
                      <div key={lang.id} className="kv-registro-field-row kv-registro-lang-row">
                        <div className="kv-registro-field">
                          <FieldLabel required>Idioma {index + 1}</FieldLabel>
                          <select
                            className="kv-registro-select"
                            value={lang.idioma}
                            onChange={(e) => updateIdioma(lang.id, { idioma: e.target.value })}
                          >
                            <option value="">Selecciona...</option>
                            {LANGUAGE_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                        <div className="kv-registro-field">
                          <FieldLabel required>Nivel</FieldLabel>
                          <select
                            className="kv-registro-select"
                            value={lang.nivel}
                            onChange={(e) => updateIdioma(lang.id, { nivel: e.target.value })}
                          >
                            <option value="">Nivel...</option>
                            {LANGUAGE_LEVEL_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          className="kv-registro-evidence-remove kv-registro-lang-remove"
                          onClick={() => removeIdioma(lang.id)}
                          aria-label="Eliminar idioma"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="kv-registro-add-evidence" onClick={addIdioma}>
                      <Plus size={18} />
                      Agregar idioma
                    </button>
                  </SalesSection>

                  <SalesSection title="Certificaciones (opcional)">
                    {(profile.certificaciones ?? []).map((cert) => (
                      <div key={cert.id} className="kv-registro-evidence-card kv-registro-edu-card">
                        <div className="kv-registro-field-row">
                          <div className="kv-registro-field">
                            <label>Certificación</label>
                            <input
                              className="kv-registro-input"
                              placeholder="Ej. SPIN Selling"
                              value={cert.nombre}
                              onChange={(e) => updateCertificacion(cert.id, { nombre: e.target.value })}
                            />
                          </div>
                          <div className="kv-registro-field">
                            <label>Entidad</label>
                            <input
                              className="kv-registro-input"
                              placeholder="Organización emisora"
                              value={cert.entidad}
                              onChange={(e) => updateCertificacion(cert.id, { entidad: e.target.value })}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="kv-registro-btn-ghost kv-registro-btn-ghost--sm"
                          onClick={() => removeCertificacion(cert.id)}
                        >
                          Quitar certificación
                        </button>
                      </div>
                    ))}
                    <button type="button" className="kv-registro-add-evidence" onClick={addCertificacion}>
                      <Plus size={18} />
                      Agregar certificación
                    </button>
                  </SalesSection>

                  <SalesSection title="Expectativas">
                    <ChoiceField
                      required
                      label="Rango salarial mensual esperado (fijo + variable estimado)"
                      value={profile.expectativaSalarial}
                      options={SALARY_EXPECTATION_OPTIONS}
                      onSelect={(v) => update({ expectativaSalarial: v })}
                    />
                    <ChoiceField
                      label="Tipo de contrato deseado (opcional)"
                      value={profile.tipoContratoDeseado}
                      options={CONTRACT_TYPE_OPTIONS}
                      onSelect={(v) => update({ tipoContratoDeseado: v })}
                    />
                  </SalesSection>
                </div>
              )}

              {current.kind === 'sales' && (
                <div className="kv-registro-sales kv-registro-sales--compact">
                  <div className="kv-registro-sales-grid">
                  <SalesSection title="Estilo de venta">
                    <ChoiceField
                      required
                      namePrefix="venta-tipo"
                      label="Tipo de venta"
                      value={profile.tipoVenta}
                      options={['Consultiva', 'Transaccional']}
                      onSelect={(v) => update({ tipoVenta: v })}
                    />
                    <ChoiceField
                      required
                      namePrefix="venta-naturaleza"
                      label="Naturaleza de la venta"
                      value={profile.naturaleza}
                      options={['Técnica', 'Relacional']}
                      onSelect={(v) => update({ naturaleza: v })}
                    />
                    <ChoiceField
                      required
                      namePrefix="venta-enfoque"
                      label="Enfoque principal"
                      value={profile.enfoque}
                      options={['Prospección (hunter)', 'Manejo de cuentas (farmer)']}
                      onSelect={(v) => update({ enfoque: v })}
                    />
                    <div className={`kv-registro-field${!profile.ciclo ? ' kv-registro-field--incomplete' : ''}`}>
                      <FieldLabel htmlFor="ciclo" required>
                        Ciclo de venta típico
                      </FieldLabel>
                      <select
                        id="ciclo"
                        className="kv-registro-select"
                        value={profile.ciclo ?? ''}
                        onChange={(e) => update({ ciclo: e.target.value })}
                      >
                        <option value="">Selecciona...</option>
                        {SALE_CYCLE_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div
                      className={`kv-registro-field${
                        (profile.tickets?.length ?? 0) === 0 ? ' kv-registro-field--incomplete' : ''
                      }`}
                    >
                      <FieldLabel required>Ticket promedio manejado</FieldLabel>
                      <p className="kv-registro-field-hint">
                        Puedes seleccionar más de uno. Si eliges varios, indica con cuál tienes mayor
                        experiencia.
                      </p>
                      <div className="kv-registro-tag-grid">
                        {TICKET_OPTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className={`kv-registro-tag-choice${profile.tickets?.includes(item) ? ' selected' : ''}`}
                            onClick={() => toggleTag('tickets', item)}
                            aria-pressed={profile.tickets?.includes(item)}
                            aria-label={`Ticket promedio manejado: ${item}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(profile.tickets?.length ?? 0) > 1 && (
                      <ChoiceField
                        required
                        label="¿Con cuál tienes mayor experiencia?"
                        value={profile.ticketPrincipal}
                        options={profile.tickets ?? []}
                        onSelect={(v) => update({ ticketPrincipal: v })}
                      />
                    )}
                  </SalesSection>

                  <SalesSection title="Sobre el cliente">
                    <ChoiceField
                      required
                      namePrefix="venta-tipo-cliente"
                      label="Tipo de cliente"
                      value={profile.tipoCliente}
                      options={CLIENT_TYPE_OPTIONS}
                      onSelect={(v) => update({ tipoCliente: v })}
                    />
                    <ChoiceField
                      required
                      namePrefix="venta-interlocutor"
                      label="Nivel de interlocutor habitual"
                      value={profile.nivelInterlocutor}
                      options={INTERLOCUTOR_OPTIONS}
                      onSelect={(v) => update({ nivelInterlocutor: v })}
                    />
                    <ChoiceField
                      required
                      namePrefix="venta-canal"
                      label="Canal de venta"
                      value={profile.canalVenta}
                      options={SALES_CHANNEL_OPTIONS}
                      onSelect={(v) => update({ canalVenta: v })}
                    />
                  </SalesSection>

                  <SalesSection title="Alcance y herramientas">
                    <ChoiceField
                      required
                      namePrefix="venta-cobertura"
                      label="Cobertura geográfica"
                      value={profile.coberturaGeografica}
                      options={GEO_COVERAGE_OPTIONS}
                      onSelect={(v) => update({ coberturaGeografica: v })}
                    />
                    <ChoiceField
                      required
                      namePrefix="venta-cartera"
                      label="Número de cuentas en cartera"
                      value={profile.cuentasCartera}
                      options={PORTFOLIO_SIZE_OPTIONS}
                      onSelect={(v) => update({ cuentasCartera: v })}
                    />
                    <div className={`kv-registro-field${!profile.crmVentas ? ' kv-registro-field--incomplete' : ''}`}>
                      <FieldLabel htmlFor="crmVentas" required>
                        CRM que manejas
                      </FieldLabel>
                      <select
                        id="crmVentas"
                        className="kv-registro-select"
                        value={profile.crmVentas ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === CRM_OTHER) update({ crmVentas: CRM_OTHER });
                          else update({ crmVentas: value, crmVentasOtro: '' });
                        }}
                      >
                        <option value="">Selecciona...</option>
                        {CRM_SALES_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    {profile.crmVentas === CRM_OTHER && (
                      <div className="kv-registro-field">
                        <label htmlFor="crmVentasOtro">Especifica el CRM</label>
                        <input
                          id="crmVentasOtro"
                          className="kv-registro-input"
                          placeholder="Ej. Monday CRM"
                          value={profile.crmVentasOtro ?? ''}
                          onChange={(e) => update({ crmVentas: CRM_OTHER, crmVentasOtro: e.target.value })}
                        />
                      </div>
                    )}
                    <ChoiceField
                      required
                      namePrefix="venta-comision"
                      label="Estructura de comisión familiarizada"
                      value={profile.estructuraComision}
                      options={COMMISSION_OPTIONS}
                      onSelect={(v) => update({ estructuraComision: v })}
                    />
                  </SalesSection>
                  </div>
                </div>
              )}

              {current.kind === 'industry' && (
                <>
                  <div
                    className={`kv-registro-field${
                      (profile.industrias?.length ?? 0) === 0 ? ' kv-registro-field--incomplete' : ''
                    }`}
                  >
                    <FieldLabel required>Industrias en las que tienes experiencia</FieldLabel>
                    <p className="kv-registro-field-hint">Selecciona todas las que apliquen.</p>
                    <div className="kv-registro-tag-grid">
                      {COMMERCIAL_INDUSTRIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`kv-registro-tag-choice${profile.industrias?.includes(item) ? ' selected' : ''}`}
                          onClick={() => toggleTag('industrias', item)}
                          aria-pressed={profile.industrias?.includes(item)}
                          aria-label={`Industria: ${item}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(profile.industrias?.length ?? 0) > 1 && (
                    <ChoiceField
                      required
                      label="Industria principal (mayor experiencia)"
                      value={profile.industriaPrincipal}
                      options={profile.industrias ?? []}
                      onSelect={(v) => update({ industriaPrincipal: v })}
                    />
                  )}
                </>
              )}

              {current.kind === 'achievements' && (
                <div className="kv-registro-evidence-list">
                  <p className="kv-registro-field-hint">
                    Agrega al menos 1 tarjeta de evidencia. Te sugerimos mínimo 2 para fortalecer tu perfil
                    en el paso 8.
                  </p>
                  {(profile.logros ?? []).map((card, index) => (
                    <article key={card.id} className="kv-registro-evidence-card">
                      <div className="kv-registro-evidence-card-head">
                        <span className="kv-registro-evidence-card-num font-mono">Logro {index + 1}</span>
                        <button
                          type="button"
                          className="kv-registro-evidence-remove"
                          onClick={() => removeLogro(card.id)}
                          aria-label="Eliminar logro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {completeHistorial.length > 0 && (
                        <div className="kv-registro-field">
                          <label htmlFor={`hist-${card.id}`}>Vincular a experiencia del historial (opcional)</label>
                          <select
                            id={`hist-${card.id}`}
                            className="kv-registro-select"
                            value={card.historialId ?? ''}
                            onChange={(e) => {
                              const id = e.target.value;
                              if (id) linkLogroToHistorial(card.id, id);
                              else updateLogro(card.id, { historialId: undefined });
                            }}
                          >
                            <option value="">Seleccionar experiencia...</option>
                            {completeHistorial.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.cargo} · {h.empresa}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="kv-registro-field">
                        <FieldLabel required>Título breve</FieldLabel>
                        <input
                          className="kv-registro-input"
                          placeholder="Ej. Crecimiento de operación comercial 33%"
                          value={card.titulo}
                          onChange={(e) => updateLogro(card.id, { titulo: e.target.value })}
                        />
                      </div>
                      <div className="kv-registro-field">
                        <FieldLabel required>Empresa / contexto</FieldLabel>
                        <input
                          className="kv-registro-input"
                          placeholder="Empresa y periodo"
                          value={card.contexto}
                          onChange={(e) => updateLogro(card.id, { contexto: e.target.value })}
                        />
                      </div>
                      <div className="kv-registro-field">
                        <FieldLabel required>Cifra o resultado concreto</FieldLabel>
                        <input
                          className="kv-registro-input"
                          placeholder="Ej. De COP $9.000M a $12.000M mensuales"
                          value={card.cifra}
                          onChange={(e) => updateLogro(card.id, { cifra: e.target.value })}
                        />
                      </div>
                      <div className="kv-registro-field">
                        <FieldLabel required>Competencia(s) que demuestra</FieldLabel>
                        <div className="kv-registro-tag-grid">
                          {EVIDENCE_COMPETENCY_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className={`kv-registro-tag-choice${card.competencias.includes(tag) ? ' selected' : ''}`}
                              onClick={() => toggleLogroCompetencia(card.id, tag)}
                              aria-pressed={card.competencias.includes(tag)}
                              aria-label={`Competencia del logro: ${tag}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                  <button type="button" className="kv-registro-add-evidence" onClick={addLogro}>
                    <Plus size={18} />
                    Agregar tarjeta de evidencia
                  </button>
                  {(profile.logros ?? []).length === 0 && (
                    <button
                      type="button"
                      className="kv-registro-btn-solid kv-registro-btn-solid--block"
                      onClick={addLogro}
                    >
                      Crear primera tarjeta
                    </button>
                  )}
                </div>
              )}

              {current.kind === 'sliders' && (
                <div className="kv-registro-sliders">
                  {!profile.nivelRol && (
                    <p className="kv-registro-field-hint kv-registro-field-hint--warn">
                      Completa el paso 2 (Rol) para ver las competencias correctas.
                    </p>
                  )}
                  {competencyDefs.map((def) => {
                    const entry = profile.competencias?.[def.key];
                    const value = Number(entry?.score ?? 60);
                    const hasBacking = competencyHasBacking(entry, profile.logros);
                    const needsEvidence = value >= HIGH_SCORE_THRESHOLD && !hasBacking;
                    return (
                      <div className="kv-registro-slider-field" key={def.key}>
                        <div className="kv-registro-slider-head">
                          <span>{def.label}</span>
                          <b>{value}%</b>
                        </div>
                        <div className="kv-registro-slider-track">
                          <div className="kv-registro-slider-fill" style={{ width: `${value}%` }} />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={value}
                          onChange={(e) => updateCompetency(def.key, { score: Number(e.target.value) })}
                          aria-label={def.label}
                        />
                        <div className="kv-registro-evidence-link">
                          <label htmlFor={`ev-${def.key}`}>¿Qué logro respalda este puntaje?</label>
                          {completeLogros.length > 0 && (
                            <select
                              id={`ev-${def.key}`}
                              className="kv-registro-select"
                              value={entry?.evidenceId ?? ''}
                              onChange={(e) =>
                                updateCompetency(def.key, {
                                  evidenceId: e.target.value || undefined,
                                  ejemplo: e.target.value ? undefined : entry?.ejemplo,
                                })
                              }
                            >
                              <option value="">Vincular tarjeta del paso 7...</option>
                              {completeLogros.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.titulo}
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            className="kv-registro-input"
                            placeholder="O escribe un ejemplo corto nuevo"
                            value={entry?.ejemplo ?? ''}
                            onChange={(e) =>
                              updateCompetency(def.key, {
                                ejemplo: e.target.value,
                                evidenceId: e.target.value ? undefined : entry?.evidenceId,
                              })
                            }
                          />
                          {hasBacking && (
                            <span className="kv-registro-backing-ok font-mono">Con respaldo</span>
                          )}
                          {needsEvidence && (
                            <p className="kv-registro-field-hint kv-registro-field-hint--warn">
                              Este puntaje es más fuerte si lo respaldas con un ejemplo o tarjeta de logro.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {error && <p className="kv-registro-error">{error}</p>}
              {savedBanner && !error ? (
                <p className="kv-registro-saved-banner" role="status">
                  {savedBanner}
                </p>
              ) : null}
            </div>

            <div className="kv-registro-card-footer">
              <p className="kv-registro-save-note kv-registro-save-note--mobile font-mono">
                {accountCreated
                  ? 'Puedes guardar y volver después en cualquier paso del perfil.'
                  : 'Crea tu cuenta para guardar tu progreso en Kova.'}
              </p>
              <div className={`kv-registro-btn-row${step > 0 ? '' : ' kv-registro-btn-row--end'}`}>
                {step > 0 ? (
                  <button type="button" className="kv-registro-btn-ghost" onClick={() => goToStep(step - 1)}>
                    Atrás
                  </button>
                ) : null}
                {accountCreated && step > 0 ? (
                  <button
                    type="button"
                    className="kv-registro-btn-ghost kv-registro-btn-save"
                    disabled={saving || loading}
                    onClick={saveProgress}
                  >
                    {saving ? 'Guardando...' : 'Guardar y continuar después'}
                  </button>
                ) : null}
                {step === 0 ? (
                  <button
                    type="button"
                    className="kv-registro-btn-solid"
                    disabled={!canNext || loading}
                    onClick={createAccount}
                  >
                    {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                    <ChevronRight strokeWidth={2} aria-hidden />
                  </button>
                ) : step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="kv-registro-btn-solid"
                    disabled={!canNext || loading || saving}
                    onClick={continueStep}
                  >
                    Continuar
                    <ChevronRight strokeWidth={2} aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="kv-registro-btn-solid kv-registro-btn-solid--lime"
                    disabled={loading || saving}
                    onClick={publishProfile}
                  >
                    {loading ? 'Guardando...' : 'Publicar mi perfil'}
                    {!loading && <ChevronRight strokeWidth={2} aria-hidden />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RegistroShell>
  );
}
