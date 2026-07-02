'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

const STEPS = [
  'Empresa',
  'Discovery',
  'Necesidad',
  'Perfil del cargo',
  'Requisitos',
  'Proceso',
  'Resumen',
];

const DEFAULT_PIPELINE = [
  'Postulados', 'Preseleccionados', 'Pruebas', 'Entrevista RH', 'Entrevista Cliente', 'Finalistas', 'Contratado',
];

const DEFAULT_REQUIREMENTS = [
  { key: 'experience', label: 'Experiencia', weight: 30, type: 'years_min' as const, expected: 3 },
  { key: 'industry', label: 'Industria', weight: 20, type: 'contains' as const, expected: 'Tecnología' },
  { key: 'crm', label: 'CRM', weight: 10, type: 'contains' as const, expected: 'Salesforce' },
  { key: 'education', label: 'Estudios', weight: 10, type: 'contains' as const, expected: 'Profesional' },
  { key: 'english', label: 'Inglés', weight: 10, type: 'equals' as const, expected: 'B2' },
  { key: 'competencies', label: 'Competencias', weight: 20, type: 'score_min' as const, expected: 70 },
];

const STAGE_OPTIONS = [
  'Filtro de hoja de vida', 'Entrevista RH', 'Prueba Comercial', 'Psicotécnica', 'Role Play', 'Entrevista Cliente',
];

export default function NuevoProcesoPage() {
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
    howSells: '',
    market: '',
    competitors: '',
    commercialModel: '',
    whyHiring: '',
    headcount: '1',
    startDate: '',
    urgency: 'MEDIUM',
    title: '',
    objective: '',
    functions: '',
    responsibilities: '',
    kpis: '',
    requirements: DEFAULT_REQUIREMENTS.map((r) => ({ ...r })),
    pipeline: [...DEFAULT_PIPELINE],
    stages: ['Filtro de hoja de vida', 'Entrevista RH', 'Prueba Comercial', 'Entrevista Cliente'] as string[],
    tests: ['Prueba Comercial', 'Role Play'] as string[],
    modality: 'Híbrido',
    dueDate: '',
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const updateRequirement = (index: number, field: 'expected' | 'weight', value: string | number) => {
    setForm((f) => {
      const requirements = [...f.requirements];
      requirements[index] = { ...requirements[index], [field]: value };
      return { ...f, requirements };
    });
  };

  const toggleStage = (s: string) => {
    setForm((f) => ({
      ...f,
      stages: f.stages.includes(s) ? f.stages.filter((x) => x !== s) : [...f.stages, s],
    }));
  };

  const finish = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await dashboardApi.createProcess({
        companyName: form.companyName,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        city: form.city,
        title: form.title,
        objective: form.objective,
        functions: form.functions,
        responsibilities: form.responsibilities,
        kpis: form.kpis,
        modality: form.modality,
        dueDate: form.dueDate || undefined,
        urgency: form.urgency,
        quantity: Number(form.headcount) || 1,
        discovery: {
          whatSells: form.whatSells,
          revenue: form.revenue,
          howSells: form.howSells,
          market: form.market,
          competitors: form.competitors,
          commercialModel: form.commercialModel,
        },
        need: {
          whyHiring: form.whyHiring,
          headcount: form.headcount,
          startDate: form.startDate,
          urgency: form.urgency,
        },
        requirements: form.requirements,
        pipeline: form.pipeline,
        tests: form.tests,
        checklistTasks: [
          'Buscar candidatos',
          'Contactar candidatos',
          'Enviar pruebas',
          'Agendar entrevistas',
          'Presentar finalistas',
        ],
        summary: `Proceso ${form.title} para ${form.companyName}`,
      });
      router.push(`/procesos/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el proceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/procesos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Nueva solicitud de búsqueda</h1>
        <p className="text-sm text-slate-500 mt-1">El sistema guía el flujo: cliente → perfil → requisitos → pipeline → automatizaciones.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'text-white' : 'text-slate-400 bg-slate-100'}`}
              style={i <= step ? { background: 'var(--kova-blue)' } : undefined}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] hidden sm:inline ${i === step ? 'font-semibold' : 'text-slate-400'}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="kova-card p-6 space-y-4">
        {step === 0 && (
          <>
            <Field label="Empresa" value={form.companyName} onChange={(v) => update('companyName', v)} placeholder="TechSales Colombia SAS" />
            <Field label="Contacto principal" value={form.contact} onChange={(v) => update('contact', v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Correo" value={form.email} onChange={(v) => update('email', v)} />
              <Field label="Teléfono" value={form.phone} onChange={(v) => update('phone', v)} />
            </div>
            <Field label="Ciudad" value={form.city} onChange={(v) => update('city', v)} />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="¿Qué vende?" value={form.whatSells} onChange={(v) => update('whatSells', v)} />
            <Field label="¿Cuánto vende?" value={form.revenue} onChange={(v) => update('revenue', v)} placeholder="Facturación anual / ticket promedio" />
            <Field label="¿Cómo vende?" value={form.howSells} onChange={(v) => update('howSells', v)} placeholder="B2B consultivo, inside sales..." />
            <Field label="Mercado" value={form.market} onChange={(v) => update('market', v)} />
            <Field label="Competidores" value={form.competitors} onChange={(v) => update('competitors', v)} />
            <Field label="Modelo comercial" value={form.commercialModel} onChange={(v) => update('commercialModel', v)} />
          </>
        )}

        {step === 2 && (
          <>
            <TextArea label="¿Por qué contrata?" value={form.whyHiring} onChange={(v) => update('whyHiring', v)} />
            <Field label="¿Cuántas personas?" value={form.headcount} onChange={(v) => update('headcount', v)} />
            <Field label="¿Cuándo ingresan?" type="date" value={form.startDate} onChange={(v) => update('startDate', v)} />
            <SelectField label="Urgencia" value={form.urgency} onChange={(v) => update('urgency', v)} options={['LOW', 'MEDIUM', 'HIGH', 'URGENT']} />
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Nombre del cargo" value={form.title} onChange={(v) => update('title', v)} placeholder="Ejecutivo Comercial B2B" />
            <TextArea label="Objetivo del cargo" value={form.objective} onChange={(v) => update('objective', v)} />
            <TextArea label="Funciones" value={form.functions} onChange={(v) => update('functions', v)} />
            <TextArea label="Responsabilidades" value={form.responsibilities} onChange={(v) => update('responsibilities', v)} />
            <TextArea label="KPIs" value={form.kpis} onChange={(v) => update('kpis', v)} />
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-slate-500">Define requisitos y pesos. El sistema calculará compatibilidad automáticamente (sin IA).</p>
            <div className="space-y-3">
              {form.requirements.map((req, i) => (
                <div key={req.key} className="grid sm:grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50">
                  <span className="text-sm font-medium sm:col-span-1" style={{ color: 'var(--kova-navy)' }}>{req.label}</span>
                  <input
                    value={String(req.expected)}
                    onChange={(e) => updateRequirement(i, 'expected', e.target.value)}
                    className="px-2 py-1.5 rounded border border-slate-200 text-sm"
                    placeholder="Valor esperado"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={req.weight}
                      onChange={(e) => updateRequirement(i, 'weight', Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded border border-slate-200 text-sm"
                    />
                    <span className="text-xs text-slate-400">% peso</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <p className="text-sm text-slate-500 mb-2">¿Qué etapas tendrá el proceso?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {STAGE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStage(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${form.stages.includes(s) ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)]' : 'border-slate-200'}`}
                >
                  {form.stages.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {form.pipeline.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2 text-sm p-2 rounded bg-slate-50">
                  <span className="text-slate-400 w-5">{i + 1}</span>
                  <span style={{ color: 'var(--kova-navy)' }}>{stage}</span>
                  {i < form.pipeline.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 ml-auto" />}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <div className="space-y-3 text-sm">
            <p><strong>Empresa:</strong> {form.companyName || '—'}</p>
            <p><strong>Cargo:</strong> {form.title || '—'}</p>
            <p><strong>Ciudad:</strong> {form.city}</p>
            <p><strong>Requisitos:</strong> {form.requirements.length} criterios con pesos configurables</p>
            <p><strong>Pipeline:</strong> {form.pipeline.join(' → ')}</p>
            <p className="text-slate-500">Al crear, el sistema generará tareas, checklist y calculará compatibilidad por reglas.</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || loading}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40">
          Anterior
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} disabled={loading}
            className="px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2" style={{ background: 'var(--kova-blue)' }}>
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={finish} disabled={loading || !form.companyName || !form.title}
            className="px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50" style={{ background: 'var(--kova-green)' }}>
            {loading ? 'Creando...' : 'Crear proceso'}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
