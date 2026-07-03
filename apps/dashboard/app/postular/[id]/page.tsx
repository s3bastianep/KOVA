'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  User, Mail, Phone, Linkedin, MapPin, Briefcase, Building2, DollarSign,
  MessageSquare, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Send, Loader2,
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
  '$2.000.000 – $3.000.000',
  '$3.000.000 – $4.500.000',
  '$4.500.000 – $6.000.000',
  '$6.000.000 – $8.000.000',
  'Más de $8.000.000',
  'A convenir',
];

const STEPS = ['Tus datos', 'Tu perfil', 'Cuéntanos más'] as const;

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

  const step1Valid = firstName.trim() && lastName.trim() && /.+@.+\..+/.test(email);
  const step2Valid = questions
    .filter((q) => q.inputType === 'select')
    .every((q) => typeof answers[q.id] === 'string' && (answers[q.id] as string).length > 0);

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-500" style={{ background: 'var(--kova-navy)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-white/80" />
        <p className="text-white/80 text-sm">Cargando formulario...</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--kova-navy)' }}>
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
    <div className="min-h-screen bg-slate-50">
      {/* Header banner */}
      <div className="px-4 pt-10 pb-24 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--kova-navy), var(--kova-blue))' }}>
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-4">
            <Building2 className="w-3.5 h-3.5" />
            {data?.companyName ?? 'Empresa'}
          </div>
          <h1 className="font-heading text-3xl font-bold">{data?.title ?? 'Vacante'}</h1>
          <p className="text-sm text-white/70 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Completa el formulario y descubre tu compatibilidad al instante
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-16 pb-16">
        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center gap-2">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step ? 'text-white' : i === step ? 'text-white ring-4 ring-blue-100' : 'text-slate-400 bg-slate-100'
                  }`}
                  style={i <= step ? { background: 'var(--kova-blue)' } : undefined}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 text-center ${i === step ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-blue-500' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          {/* STEP 1 — Datos */}
          {step === 0 && (
            <div className="space-y-4">
              <SectionTitle icon={<User className="w-4 h-4" />} title="Tus datos de contacto" subtitle="Así te identificamos y contactamos" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={<User className="w-4 h-4" />} label="Nombre" value={firstName} onChange={setFirstName} required />
                <Field icon={<User className="w-4 h-4" />} label="Apellido" value={lastName} onChange={setLastName} required />
              </div>
              <Field icon={<Mail className="w-4 h-4" />} label="Correo" value={email} onChange={setEmail} type="email" required />
              <Field icon={<Phone className="w-4 h-4" />} label="Teléfono / WhatsApp" value={phone} onChange={setPhone} type="tel" />
              <Field icon={<Linkedin className="w-4 h-4" />} label="LinkedIn (opcional)" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            </div>
          )}

          {/* STEP 2 — Perfil */}
          {step === 1 && (
            <div className="space-y-6">
              <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Tu perfil profesional" subtitle="Estas respuestas calculan tu compatibilidad" />
              {groupedQuestions.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Este proceso no requiere preguntas adicionales.</p>
              )}
              {groupedQuestions.map((group) => (
                <div key={group.category} className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-1">{group.category}</p>
                  {group.items.map((q) => (
                    <QuestionField key={q.id} q={q} answers={answers} setAnswers={setAnswers} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — Más info */}
          {step === 2 && (
            <div className="space-y-4">
              <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="Cuéntanos un poco más" subtitle="Esto nos ayuda a conocerte mejor (opcional)" />
              <Field icon={<Briefcase className="w-4 h-4" />} label="Cargo actual" value={currentRole} onChange={setCurrentRole} placeholder="Ej: Ejecutivo comercial" />
              <Field icon={<Building2 className="w-4 h-4" />} label="Empresa actual" value={currentCompany} onChange={setCurrentCompany} placeholder="Ej: SoftCorp" />
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
                  <DollarSign className="w-4 h-4 text-slate-400" /> Expectativa salarial
                </label>
                <select
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1 text-right">{motivation.length}/500</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all"
                style={{ background: 'var(--kova-blue)' }}
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-all"
                style={{ background: 'var(--kova-green)' }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar postulación</>}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Tus datos se usan únicamente para este proceso de selección.
        </p>
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
        {!isMulti && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {isMulti ? (
        <>
          <p className="text-xs text-slate-500 mb-2">Selecciona hasta {max} opciones ({selected.length}/{max})</p>
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
                        : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  style={active ? { background: 'var(--kova-blue)' } : undefined}
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
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        >
          <option value="">Seleccionar...</option>
          {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {q.helpText && <p className="text-xs text-slate-400 mt-1">{q.helpText}</p>}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(45,91,227,0.1)', color: 'var(--kova-blue)' }}>
        {icon}
      </div>
      <div>
        <h2 className="font-heading font-bold text-lg leading-tight" style={{ color: 'var(--kova-navy)' }}>{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--kova-navy)' }}>
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const color = pct >= 75 ? 'var(--kova-green)' : pct >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#F1F5F9" strokeWidth="9" />
        <circle
          cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-3xl font-bold" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}
