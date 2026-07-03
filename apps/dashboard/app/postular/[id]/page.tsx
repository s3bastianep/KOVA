'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  User, Mail, Phone, Linkedin, Briefcase, Building2, DollarSign,
  MessageSquare, CheckCircle2, ChevronLeft, ChevronRight, Send, Loader2,
  Lightbulb, Shield, Clock, Lock, Check,
} from 'lucide-react';

type FormQuestion = {
  id: string;
  label: string;
  category: string;
  inputType: 'select' | 'multiselect';
  options: string[];
  helpText?: string;
  maxSelections?: number;
};

const SALARY_RANGES = [
  'Menos de $2.000.000',
  '$2.000.000 - $3.000.000',
  '$3.000.000 - $4.500.000',
  '$4.500.000 - $6.000.000',
  '$6.000.000 - $8.000.000',
  'Más de $8.000.000',
  'A convenir',
];

const STEPS = [
  { label: 'Tus datos', subtitle: 'Información de contacto', next: 'Tu perfil' },
  { label: 'Tu perfil', subtitle: 'Experiencia y habilidades', next: 'Cuéntanos más' },
  { label: 'Cuéntanos más', subtitle: 'Información adicional', next: null },
] as const;

function computeProgressScore(
  step: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  linkedin: string,
  questions: FormQuestion[],
  answers: Record<string, string | string[]>,
  currentRole: string,
  currentCompany: string,
  salary: string,
  motivation: string,
) {
  let score = 0;

  if (firstName.trim()) score += 6;
  if (lastName.trim()) score += 6;
  if (/.+@.+\..+/.test(email)) score += 10;
  if (phone.trim()) score += 6;
  if (linkedin.trim()) score += 4;

  if (questions.length > 0) {
    const answered = questions.filter((q) => {
      if (q.inputType === 'multiselect') {
        const sel = answers[q.id];
        return Array.isArray(sel) && sel.length > 0;
      }
      return typeof answers[q.id] === 'string' && (answers[q.id] as string).length > 0;
    }).length;
    score += Math.round((answered / questions.length) * 55);
  } else if (step >= 1) {
    score += 30;
  }

  if (currentRole.trim()) score += 4;
  if (currentCompany.trim()) score += 3;
  if (salary) score += 3;
  if (motivation.trim()) score += 3;

  return Math.min(100, score);
}

export default function PostularPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [motivation, setMotivation] = useState('');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [done, setDone] = useState<{ compatibility: number; message: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['postulacion', id],
    queryFn: () => fetch(`/api/procesos/${id}/postulacion`).then((r) => r.json()),
  });

  const questions = (data?.questions ?? []) as FormQuestion[];

  const groupedQuestions = useMemo(() => {
    const groups: { category: string; items: FormQuestion[] }[] = [];
    for (const q of questions) {
      let g = groups.find((x) => x.category === q.category);
      if (!g) { g = { category: q.category, items: [] }; groups.push(g); }
      g.items.push(q);
    }
    return groups;
  }, [questions]);

  const progressScore = useMemo(
    () => computeProgressScore(step, firstName, lastName, email, phone, linkedin, questions, answers, currentRole, currentCompany, salary, motivation),
    [step, firstName, lastName, email, phone, linkedin, questions, answers, currentRole, currentCompany, salary, motivation],
  );

  const step1Valid = firstName.trim() && lastName.trim() && /.+@.+\..+/.test(email);
  const step2Valid = questions.every((q) => {
    if (q.inputType === 'multiselect') {
      const selected = answers[q.id];
      return Array.isArray(selected) && selected.length > 0;
    }
    return typeof answers[q.id] === 'string' && (answers[q.id] as string).length > 0;
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const normalizedAnswers: Record<string, string> = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : value,
        ]),
      );
      if (currentRole) normalizedAnswers.current_role = currentRole;
      if (currentCompany) normalizedAnswers.current_company = currentCompany;
      if (salary) normalizedAnswers.salary_expectation = salary;
      if (linkedin) normalizedAnswers.linkedin = linkedin;
      if (motivation) normalizedAnswers.motivation = motivation;

      const res = await fetch(`/api/procesos/${id}/postulacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, answers: normalizedAnswers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Error al postular');
      setDone({ compatibility: json.compatibility, message: json.message });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al postular');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(168deg, #0F1F3D, #1A2D4A)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-white/80" />
        <p className="text-white/80 text-sm">Cargando formulario...</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(168deg, #0F1F3D, #1A2D4A)' }}>
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(0,178,122,0.12)' }}>
            <CheckCircle2 className="w-11 h-11" style={{ color: 'var(--kova-green)' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">¡Postulación enviada!</p>
            <ScoreRing value={done.compatibility} />
            <p className="text-sm text-slate-500 mt-1">de compatibilidad con el cargo</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{done.message}</p>
          <p className="text-xs text-slate-400">
            El equipo de {data?.companyName} revisará tu perfil y te contactará si avanzas en el proceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-10 pb-28 text-center text-white" style={{ background: 'linear-gradient(168deg, #0F1F3D 0%, #152238 50%, #1A2D4A 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--kova-blue-mid)' }} />
          <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'var(--kova-green)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-4">
            <Building2 className="w-3.5 h-3.5" />
            {data?.companyName ?? 'Empresa'}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">{data?.title ?? 'Vacante'}</h1>
          <p className="text-sm text-white/70 mt-3 max-w-lg mx-auto">
            Completa el formulario y descubre tu compatibilidad con el cargo al instante.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 pb-16">
        {/* Stepper */}
        <FormStepper step={step} />

        {/* Dos columnas */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5 items-start">
          {/* Formulario principal */}
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-5">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>¡Empecemos con tus datos!</h2>
                  <p className="text-sm text-slate-500 mt-1">Así podremos identificarte y mantenerte informado.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={<User className="w-4 h-4" />} label="Nombre(s)" value={firstName} onChange={setFirstName} placeholder="Escribe tu nombre" required />
                  <Field icon={<User className="w-4 h-4" />} label="Apellido(s)" value={lastName} onChange={setLastName} placeholder="Escribe tu apellido" required />
                </div>
                <Field icon={<Mail className="w-4 h-4" />} label="Correo electrónico" value={email} onChange={setEmail} type="email" placeholder="ejemplo@correo.com" required />

                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
                    Teléfono / WhatsApp
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-1 items-center gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[var(--kova-green)] focus-within:ring-2 focus-within:ring-green-50 transition-all">
                      <span className="flex items-center gap-1.5 px-3 py-2.5 border-r border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 shrink-0">
                        CO +57
                      </span>
                      <Phone className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="300 123 4567"
                        className="flex-1 px-2 py-2.5 text-sm outline-none bg-transparent"
                      />
                    </div>
                    <div className="sm:w-52 flex items-start gap-2 px-3 py-2.5 rounded-xl border shrink-0" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                      <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--kova-green)' }} />
                      <p className="text-[11px] leading-snug" style={{ color: '#047857' }}>
                        Te escribiremos por WhatsApp. Este número nos ayuda a contactarte más rápido.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Field icon={<Linkedin className="w-4 h-4" />} label="LinkedIn (opcional)" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/tu-perfil" />
                  <p className="text-[11px] text-slate-400 mt-1 ml-1">Comparte tu perfil para conocer más sobre tu experiencia profesional.</p>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#EEF2FA' }}>
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--kova-blue)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>Consejo</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Completa tus datos con información real y actualizada. Esto nos ayuda a evaluarte de forma justa y contactarte sin demoras.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>Cuéntanos sobre tu perfil</h2>
                  <p className="text-sm text-slate-500 mt-1">Estas respuestas nos ayudan a calcular tu compatibilidad con el cargo.</p>
                </div>
                {groupedQuestions.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">Este proceso no requiere preguntas adicionales.</p>
                )}
                {groupedQuestions.map((group) => (
                  <div key={group.category} className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-2">{group.category}</p>
                    {group.items.map((q) => (
                      <QuestionField key={q.id} q={q} answers={answers} setAnswers={setAnswers} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>Un poco más sobre ti</h2>
                  <p className="text-sm text-slate-500 mt-1">Información adicional que nos ayuda a conocerte mejor (opcional).</p>
                </div>
                <Field icon={<Briefcase className="w-4 h-4" />} label="Cargo actual" value={currentRole} onChange={setCurrentRole} placeholder="Ej: Ejecutivo comercial" />
                <Field icon={<Building2 className="w-4 h-4" />} label="Empresa actual" value={currentCompany} onChange={setCurrentCompany} placeholder="Ej: SoftCorp" />
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
                    <DollarSign className="w-4 h-4 text-slate-400" /> Expectativa salarial
                  </label>
                  <select
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-green)] focus:ring-2 focus:ring-green-50 outline-none transition-all"
                  >
                    <option value="">Prefiero no decir</option>
                    {SALARY_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
                    <MessageSquare className="w-4 h-4 text-slate-400" /> ¿Por qué te interesa este cargo?
                  </label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Cuéntanos brevemente tu motivación..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-green)] focus:ring-2 focus:ring-green-50 outline-none transition-all resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 text-right">{motivation.length}/500</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
            )}

            {/* Navegación */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                  className="ml-auto flex flex-col items-center gap-0.5 min-w-[160px] py-3 px-6 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all hover:-translate-y-0.5 shadow-sm"
                  style={{ background: 'var(--kova-green)' }}
                >
                  <span className="inline-flex items-center gap-1.5">Continuar <ChevronRight className="w-4 h-4" /></span>
                  {STEPS[step].next && <span className="text-[10px] font-normal text-white/80">Siguiente: {STEPS[step].next}</span>}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex items-center justify-center gap-2 min-w-[180px] py-3 px-6 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm"
                  style={{ background: 'var(--kova-green)' }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar postulación</>}
                </button>
              )}
            </div>
          </form>

          {/* Barra lateral */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center">
              <ScoreRing value={progressScore} size="sm" />
              <p className="text-sm font-semibold mt-3" style={{ color: 'var(--kova-navy)' }}>
                {progressScore === 0 ? 'Compatibilidad inicial' : `${progressScore}% de avance`}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Tu puntaje se actualiza a medida que completas el formulario.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--kova-navy)' }}>¿Por qué pedimos esta información?</h3>
              <div className="space-y-3">
                <WhyItem icon={<Shield className="w-4 h-4" />} title="Contacto seguro" text="Solo usamos tus datos para este proceso de selección." />
                <WhyItem icon={<Clock className="w-4 h-4" />} title="Comunicación rápida" text="Te avisamos por correo o WhatsApp sobre tu avance." />
                <WhyItem icon={<Lock className="w-4 h-4" />} title="Privacidad garantizada" text="Tu información no se comparte con terceros." />
              </div>
            </div>

            <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
              <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--kova-green)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#047857' }}>Protección de datos</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Cumplimos con la Ley 1581 de 2012. Tus datos están protegidos y solo se usan para este proceso.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Tus datos se usan únicamente para este proceso de selección.
        </p>
      </div>
    </div>
  );
}

function FormStepper({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm font-bold" style={{ color: 'var(--kova-navy)' }}>
          Paso {step + 1} de {STEPS.length}
          <span className="font-normal text-slate-500"> · {STEPS[step].label}</span>
        </p>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#E6FAF3', color: '#047857' }}>
          {pct}% completado
        </span>
      </div>

      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'var(--kova-green)' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div
              key={s.label}
              className={`relative rounded-xl border-2 px-4 py-3.5 transition-all ${
                active
                  ? 'border-[var(--kova-green)] bg-[#F0FDF4] shadow-sm'
                  : done
                    ? 'border-green-200 bg-green-50/60'
                    : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={
                    active
                      ? { background: 'var(--kova-green)', color: '#fff' }
                      : done
                        ? { background: 'var(--kova-green)', color: '#fff' }
                        : { background: '#E2E8F0', color: '#64748B' }
                  }
                >
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ color: active ? 'var(--kova-navy)' : done ? '#047857' : '#64748B' }}
                  >
                    {s.label}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug ${active ? 'text-slate-600' : 'text-slate-400'}`}>
                    {s.subtitle}
                  </p>
                </div>
              </div>
              {active && (
                <span className="absolute left-4 right-4 -bottom-[2px] h-1 rounded-full" style={{ background: 'var(--kova-green)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WhyItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function QuestionField({ q, answers, setAnswers }: {
  q: FormQuestion;
  answers: Record<string, string | string[]>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
}) {
  const isMulti = q.inputType === 'multiselect';
  const max = q.maxSelections ?? 6;
  const selected = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];

  return (
    <div>
      <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--kova-navy)' }}>
        {q.label}
        <span className="text-red-400 ml-0.5">*</span>
      </label>
      {isMulti ? (
        <>
          <p className="text-xs text-slate-500 mb-2">
            Selecciona una o más opciones{max < 99 ? ` (máx. ${max})` : ''} · {selected.length} elegida{selected.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-wrap gap-2">
            {(q.options ?? []).map((option) => {
              const active = selected.includes(option);
              const disabled = !active && selected.length >= max;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setAnswers((prev) => {
                      const current = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
                      const isActive = current.includes(option);
                      const next = isActive
                        ? current.filter((item) => item !== option)
                        : current.length >= max ? current : [...current, option];
                      return { ...prev, [q.id]: next };
                    });
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    active
                      ? 'border-transparent text-white shadow-sm'
                      : disabled
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  style={active ? { background: 'var(--kova-green)' } : undefined}
                >
                  {active ? '✓ ' : ''}{option}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <select
          value={typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''}
          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-green)] focus:ring-2 focus:ring-green-50 outline-none transition-all"
        >
          <option value="">Seleccionar...</option>
          {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {q.helpText && <p className="text-xs text-slate-400 mt-1">{q.helpText}</p>}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--kova-navy)' }}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2 px-3.5 rounded-xl border border-slate-200 bg-white focus-within:border-[var(--kova-green)] focus-within:ring-2 focus-within:ring-green-50 transition-all">
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="flex-1 py-2.5 text-sm outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

function ScoreRing({ value, size = 'lg' }: { value: number; size?: 'sm' | 'lg' }) {
  const r = size === 'sm' ? 38 : 46;
  const dim = size === 'sm' ? 'w-24 h-24' : 'w-32 h-32';
  const textSize = size === 'sm' ? 'text-2xl' : 'text-3xl';
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const color = pct >= 75 ? 'var(--kova-green)' : pct >= 50 ? '#F59E0B' : pct > 0 ? '#2D5BE3' : '#CBD5E1';
  const cx = size === 'sm' ? 48 : 55;
  const viewBox = size === 'sm' ? '0 0 96 96' : '0 0 110 110';
  const sw = size === 'sm' ? 7 : 9;

  return (
    <div className={`relative ${dim} mx-auto`}>
      <svg className={`${dim} -rotate-90`} viewBox={viewBox}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F1F5F9" strokeWidth={sw} />
        <circle
          cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-heading ${textSize} font-bold`} style={{ color: pct > 0 ? color : '#94A3B8' }}>{pct}%</span>
      </div>
    </div>
  );
}
