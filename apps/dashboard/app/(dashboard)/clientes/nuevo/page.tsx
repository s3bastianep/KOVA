'use client';

import { useState, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Building2, Check, Lightbulb, Mail, MapPin, Phone, TrendingUp, User,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { HOW_SELLS_OPTIONS, REVENUE_RANGES } from '@/lib/standard-questions';

const STEPS = ['Empresa', 'Discovery'];

const STEP_META = [
  { icon: Building2, title: 'Información de la empresa', subtitle: 'Registra los datos principales del cliente.' },
  { icon: TrendingUp, title: 'Discovery comercial', subtitle: 'Entiende qué y cómo vende la empresa.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(v: string) {
  return EMAIL_RE.test(v.trim());
}
function isValidPhone(v: string) {
  return v.replace(/\D/g, '').length >= 7;
}

export default function NuevoClientePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    contact: '',
    email: '',
    phone: '',
    city: 'Bogotá',
    whatSells: '',
    revenue: '',
    howSells: [] as string[],
    market: '',
    competitors: '',
    commercialModel: '',
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const validateStep = (s: number): string => {
    if (s === 0) {
      if (!form.companyName.trim()) return 'Ingresa el nombre de la empresa.';
      if (!form.contact.trim()) return 'Ingresa el contacto principal.';
      if (!isValidEmail(form.email)) return 'Ingresa un correo válido (ej. nombre@empresa.com).';
      if (!isValidPhone(form.phone)) return 'Ingresa un teléfono válido (mínimo 7 dígitos).';
    }
    return '';
  };

  const goNext = () => {
    const msg = validateStep(step);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const toggleHowSells = (option: string) => {
    setForm((f) => ({
      ...f,
      howSells: f.howSells.includes(option)
        ? f.howSells.filter((s) => s !== option)
        : [...f.howSells, option],
    }));
  };

  const finish = async () => {
    const step0Error = validateStep(0);
    if (step0Error) {
      setError(step0Error);
      setStep(0);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const company = await dashboardApi.createCompany({
        name: form.companyName,
        primaryContact: form.contact,
        email: form.email,
        phone: form.phone,
        city: form.city,
        status: 'ACTIVE',
        discovery: {
          whatSells: form.whatSells,
          revenue: form.revenue,
          howSells: form.howSells.join(', '),
          market: form.market,
          competitors: form.competitors,
          commercialModel: form.commercialModel,
        },
      });
      router.push(`/empresas/${company.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a clientes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Nuevo cliente</h1>
            <p className="text-sm text-slate-500 mt-0.5">Registra la empresa y su discovery comercial antes de abrir procesos de selección.</p>
          </div>
        </div>
        <div className="hidden md:flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-white px-4 py-3 max-w-xs shadow-sm">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FFF7E6', color: '#B7791F' }}>
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>¿Para qué sirve?</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">El discovery queda en el expediente del cliente y se reutiliza en cada proceso.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => i <= step && setStep(i)}
              className="flex items-center gap-2 group"
              disabled={i > step}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'text-white' : i === step ? 'text-white ring-4 ring-blue-100' : 'text-slate-400 bg-slate-100'
                }`}
                style={i <= step ? { background: 'var(--kova-blue)' } : undefined}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline whitespace-nowrap ${i === step ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-6 sm:w-10 mx-1.5 rounded ${i < step ? 'bg-[var(--kova-blue)]' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="kova-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <StepIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg leading-tight" style={{ color: 'var(--kova-navy)' }}>{meta.title}</h2>
            <p className="text-xs text-slate-500">{meta.subtitle}</p>
          </div>
        </div>

        {step === 0 && (
          <>
            <Field label="Empresa" value={form.companyName} onChange={(v) => update('companyName', v)} placeholder="TechSales Colombia SAS" icon={Building2} required />
            <Field label="Contacto principal" value={form.contact} onChange={(v) => update('contact', v)} icon={User} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Correo" value={form.email} onChange={(v) => update('email', v)} icon={Mail} type="email" required placeholder="ejemplo@empresa.com" />
              <Field label="Teléfono" value={form.phone} onChange={(v) => update('phone', v)} icon={Phone} type="tel" required placeholder="+57 300 123 4567" />
            </div>
            <SelectField label="Ciudad" value={form.city} onChange={(v) => update('city', v)} options={['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Otra']} icon={MapPin} required />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="¿Qué vende?" value={form.whatSells} onChange={(v) => update('whatSells', v)} />
            <SelectField
              label="¿Cuánto vende?"
              value={form.revenue}
              onChange={(v) => update('revenue', v)}
              options={REVENUE_RANGES}
              placeholder="Seleccionar rango de facturación mensual"
            />
            <ChipMultiField
              label="¿Cómo vende?"
              hint="Selecciona una o más formas de venta"
              options={HOW_SELLS_OPTIONS}
              selected={form.howSells}
              onToggle={toggleHowSells}
            />
            <Field label="Mercado" value={form.market} onChange={(v) => update('market', v)} />
            <Field label="Competidores" value={form.competitors} onChange={(v) => update('competitors', v)} />
            <Field label="Modelo comercial" value={form.commercialModel} onChange={(v) => update('commercialModel', v)} />
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={goNext} disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={finish} disabled={loading || !form.companyName}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--kova-green), #00996a)' }}>
            {loading ? 'Creando...' : <><Check className="w-4 h-4" /> Crear cliente</>}
          </button>
        )}
      </div>
    </div>
  );
}

function fieldId(label: string) {
  return 'nc-' + label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Field({ label, value, onChange, placeholder, type = 'text', icon: Icon, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  icon?: ComponentType<{ className?: string }>; required?: boolean;
}) {
  const filled = value.trim().length > 0;
  const id = fieldId(label);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium block mb-1.5" style={{ color: 'var(--kova-navy)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2 px-3.5 rounded-xl border bg-white transition-all focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] border-slate-200">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full py-2.5 text-sm bg-transparent outline-none" />
        {required && filled && <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--kova-green)' }} />}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder, icon: Icon, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
  icon?: ComponentType<{ className?: string }>; required?: boolean;
}) {
  const id = fieldId(label);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium block mb-1.5" style={{ color: 'var(--kova-navy)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2 px-3.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)]">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full py-2.5 text-sm bg-transparent outline-none">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function ChipMultiField({ label, hint, options, selected, onToggle }: {
  label: string; hint?: string; options: string[]; selected: string[]; onToggle: (option: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium block" style={{ color: 'var(--kova-navy)' }}>{label}</label>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button key={option} type="button" onClick={() => onToggle(option)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)]' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              {active ? '✓ ' : ''}{option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
