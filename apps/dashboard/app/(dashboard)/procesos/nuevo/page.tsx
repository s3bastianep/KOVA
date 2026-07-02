'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, GripVertical } from 'lucide-react';

const STEPS = [
  'Información cliente',
  'Perfil del cargo',
  'Requisitos',
  'Proceso',
  'Pruebas',
  'Checklist',
];

const DEFAULT_PIPELINE = [
  'Aplicó', 'Filtro CV', 'Llamada', 'Entrevista consultor',
  'Prueba DISC', 'Prueba Comercial', 'Entrevista Cliente', 'Oferta', 'Contratación',
];

const TEST_OPTIONS = ['DISC', 'Prueba Comercial', 'Psicotécnica', 'Excel', 'Ventas', 'Role Play', 'Caso práctico'];

const DEFAULT_CHECKLIST = [
  'Buscar candidatos', 'Contactar candidatos', 'Enviar pruebas',
  'Agendar entrevistas', 'Presentar finalistas', 'Enviar oferta', 'Cerrar proceso',
];

export default function NuevoProcesoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    company: '',
    contact: '',
    salary: '',
    city: '',
    modality: 'Híbrido',
    dueDate: '',
    title: '',
    objective: '',
    functions: '',
    kpis: '',
    experience: '',
    industry: '',
    minExperience: '',
    targetCompanies: '',
    expectedSalary: '',
    availability: '',
    pipeline: [...DEFAULT_PIPELINE],
    tests: ['DISC', 'Prueba Comercial'] as string[],
    checklist: DEFAULT_CHECKLIST.map((label) => ({ label, done: false })),
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const toggleTest = (t: string) => {
    setForm((f) => ({
      ...f,
      tests: f.tests.includes(t) ? f.tests.filter((x) => x !== t) : [...f.tests, t],
    }));
  };

  const finish = () => {
    router.push('/procesos');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/procesos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Nuevo proceso</h1>
        <p className="text-sm text-slate-500 mt-1">Asistente paso a paso — el sistema generará pipeline, tareas y checklist automáticamente.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'text-white' : i === step ? 'text-white' : 'text-slate-400 bg-slate-100'
              }`}
              style={i <= step ? { background: 'var(--kova-blue)' } : undefined}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i === step ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="kova-card p-6 space-y-4">
        {step === 0 && (
          <>
            <Field label="Empresa" value={form.company} onChange={(v) => update('company', v)} placeholder="TechSales Colombia SAS" />
            <Field label="Contacto principal" value={form.contact} onChange={(v) => update('contact', v)} placeholder="Carlos Restrepo" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Salario" value={form.salary} onChange={(v) => update('salary', v)} placeholder="$3.500.000 - $5.000.000" />
              <Field label="Ciudad" value={form.city} onChange={(v) => update('city', v)} placeholder="Bogotá" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Modalidad" value={form.modality} onChange={(v) => update('modality', v)} options={['Presencial', 'Remoto', 'Híbrido']} />
              <Field label="Fecha compromiso" type="date" value={form.dueDate} onChange={(v) => update('dueDate', v)} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Nombre del cargo" value={form.title} onChange={(v) => update('title', v)} placeholder="Ejecutivo Comercial B2B" />
            <TextArea label="Objetivo del cargo" value={form.objective} onChange={(v) => update('objective', v)} />
            <TextArea label="Funciones principales" value={form.functions} onChange={(v) => update('functions', v)} />
            <TextArea label="KPIs" value={form.kpis} onChange={(v) => update('kpis', v)} placeholder="Meta mensual, tasa de cierre, cartera activa..." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Experiencia requerida" value={form.experience} onChange={(v) => update('experience', v)} placeholder="3+ años B2B" />
              <Field label="Industria" value={form.industry} onChange={(v) => update('industry', v)} placeholder="Tecnología / Software" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Experiencia mínima" value={form.minExperience} onChange={(v) => update('minExperience', v)} placeholder="2 años en ventas" />
            <Field label="Empresas objetivo" value={form.targetCompanies} onChange={(v) => update('targetCompanies', v)} placeholder="SAP, Salesforce, Oracle..." />
            <Field label="Salario esperado candidato" value={form.expectedSalary} onChange={(v) => update('expectedSalary', v)} />
            <Field label="Disponibilidad" value={form.availability} onChange={(v) => update('availability', v)} placeholder="Inmediata" />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-slate-500 mb-2">Define el flujo del proceso. Puedes agregar, quitar y reorganizar etapas.</p>
            <div className="space-y-2">
              {form.pipeline.map((stage, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <span className="text-sm flex-1" style={{ color: 'var(--kova-navy)' }}>{stage}</span>
                  {i < form.pipeline.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-slate-500 mb-3">Selecciona las pruebas para este proceso.</p>
            <div className="flex flex-wrap gap-2">
              {TEST_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTest(t)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    form.tests.includes(t)
                      ? 'border-[var(--kova-blue)] text-[var(--kova-blue)] bg-blue-50'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <p className="text-sm text-slate-500 mb-3">Checklist generado automáticamente. Se crearán tareas para cada ítem.</p>
            <div className="space-y-2">
              {form.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 text-sm">
                  <Check className="w-4 h-4 text-slate-300" />
                  {item.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
        >
          Anterior
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2"
            style={{ background: 'var(--kova-blue)' }}
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="px-4 py-2 text-sm rounded-lg text-white"
            style={{ background: 'var(--kova-green)' }}
          >
            Crear proceso
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
