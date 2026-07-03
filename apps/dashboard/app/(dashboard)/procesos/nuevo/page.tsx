'use client';

import { useState, type ReactNode, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Lightbulb, Building2, User, Mail, Phone, MapPin,
  TrendingUp, HelpCircle, Briefcase, ClipboardCheck, GitBranch, FileCheck2,
  type LucideIcon,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import {
  STANDARD_QUESTIONS,
  SKILLS_QUESTION_ID,
  JOB_TITLE_OPTIONS,
  REVENUE_RANGES,
  HOW_SELLS_OPTIONS,
  QUESTION_GROUPS,
  defaultExpectedForQuestion,
  defaultSelectedQuestions,
  parseMultiValue,
  serializeMultiValue,
  type SelectedStandardQuestion,
} from '@/lib/standard-questions';
import { selectedToRequirements } from '@/lib/standard-questions';

const STEPS = [
  'Empresa',
  'Discovery',
  'Necesidad',
  'Perfil del cargo',
  'Requisitos',
  'Proceso',
  'Resumen',
];

const STEP_META: { icon: LucideIcon; title: string; subtitle: string }[] = [
  { icon: Building2, title: 'Información de la empresa', subtitle: 'Registra los datos principales de la empresa cliente.' },
  { icon: TrendingUp, title: 'Discovery comercial', subtitle: 'Entiende qué y cómo vende la empresa.' },
  { icon: HelpCircle, title: 'Necesidad de contratación', subtitle: 'Por qué y cuándo necesitan contratar.' },
  { icon: Briefcase, title: 'Perfil del cargo', subtitle: 'Describe el cargo que buscas para el proceso.' },
  { icon: ClipboardCheck, title: 'Requisitos del aspirante', subtitle: 'Elige y pondera lo que evaluará la compatibilidad.' },
  { icon: GitBranch, title: 'Proceso de selección', subtitle: 'Define el pipeline y las evaluaciones activas.' },
  { icon: FileCheck2, title: 'Resumen', subtitle: 'Revisa toda la solicitud antes de crearla.' },
];

const DEFAULT_PIPELINE = [
  'Postulados', 'Preseleccionados', 'Pruebas', 'Entrevista RH', 'Entrevista Cliente', 'Finalistas', 'Contratado',
];

const STAGE_OPTIONS = [
  {
    label: 'Filtro de hoja de vida',
    stage: 'Postulados → Preseleccionados',
    purpose: 'Revisión inicial para decidir si el candidato entra al proceso.',
  },
  {
    label: 'Entrevista RH',
    stage: 'Preseleccionados → Pruebas',
    purpose: 'Validación cultural, motivación, salario y disponibilidad.',
  },
  {
    label: 'Prueba Comercial',
    stage: 'Pruebas → Entrevista RH',
    purpose: 'Evalúa habilidades comerciales antes de entrevistar.',
  },
  {
    label: 'Psicotécnica',
    stage: 'Pruebas → Entrevista RH',
    purpose: 'Complementa el diagnóstico del perfil.',
  },
  {
    label: 'Role Play',
    stage: 'Pruebas → Entrevista Cliente',
    purpose: 'Simulación comercial para validar desempeño real.',
  },
  {
    label: 'Entrevista Cliente',
    stage: 'Entrevista RH → Finalistas',
    purpose: 'Validación final con la empresa antes de shortlist.',
  },
];

const PIPELINE_STAGE_HELP: Record<string, { goal: string; advances: string; stalled: string }> = {
  Postulados: {
    goal: 'Entrada de candidatos.',
    advances: 'Avanza cuando el perfil básico encaja con la vacante.',
    stalled: 'No avanza si falta información o no cumple mínimos.',
  },
  Preseleccionados: {
    goal: 'Filtro consultor / RH.',
    advances: 'Avanza cuando pasa el primer filtro.',
    stalled: 'Queda aquí si requiere revisión o contacto pendiente.',
  },
  Pruebas: {
    goal: 'Evaluaciones comerciales y técnicas.',
    advances: 'Avanza cuando completa pruebas con resultado suficiente.',
    stalled: 'No avanza si no presenta pruebas o el resultado no cumple.',
  },
  'Entrevista RH': {
    goal: 'Entrevista interna.',
    advances: 'Avanza si la entrevista confirma fit y disponibilidad.',
    stalled: 'Queda pendiente si falta entrevista, feedback o validación.',
  },
  'Entrevista Cliente': {
    goal: 'Revisión por el cliente.',
    advances: 'Avanza si el cliente lo aprueba como finalista.',
    stalled: 'No avanza si el cliente lo descarta o pide más información.',
  },
  Finalistas: {
    goal: 'Shortlist final.',
    advances: 'Avanza cuando hay decisión de contratación.',
    stalled: 'Queda aquí mientras el cliente decide.',
  },
  Contratado: {
    goal: 'Cierre exitoso.',
    advances: 'Es la etapa final del proceso.',
    stalled: 'No requiere avance adicional.',
  },
};

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
    howSells: [] as string[],
    market: '',
    competitors: '',
    commercialModel: '',
    whyHiring: '',
    headcount: '1',
    startDate: '',
    urgency: 'MEDIUM',
    titles: [] as string[],
    objective: '',
    functions: '',
    responsibilities: '',
    kpis: '',
    requirements: defaultSelectedQuestions(),
    selectedQuestionIds: defaultSelectedQuestions().map((q) => q.id),
    pipeline: [...DEFAULT_PIPELINE],
    stages: ['Filtro de hoja de vida', 'Entrevista RH', 'Prueba Comercial', 'Entrevista Cliente'] as string[],
    tests: ['Prueba Comercial', 'Role Play'] as string[],
    modality: 'Híbrido',
    dueDate: '',
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const updateRequirement = (index: number, field: 'expected' | 'weight', value: string | number) => {
    setForm((f) => {
      const requirements = [...f.requirements] as SelectedStandardQuestion[];
      const current = requirements[index];
      if (current.id === SKILLS_QUESTION_ID && field === 'weight') return f;
      requirements[index] = { ...current, [field]: value };
      return { ...f, requirements };
    });
  };

  const toggleSkillExpected = (index: number, skill: string) => {
    setForm((f) => {
      const requirements = [...f.requirements] as SelectedStandardQuestion[];
      const current = requirements[index];
      const selected = parseMultiValue(current.expected);
      const exists = selected.includes(skill);
      const next = exists
        ? selected.filter((s) => s !== skill)
        : selected.length >= 6
          ? selected
          : [...selected, skill];
      requirements[index] = {
        ...current,
        expected: serializeMultiValue(next),
        weight: 30,
      };
      return { ...f, requirements };
    });
  };

  const toggleQuestion = (questionId: string) => {
    setForm((f) => {
      const exists = f.requirements.some((r) => r.id === questionId);
      if (exists) {
        return {
          ...f,
          requirements: f.requirements.filter((r) => r.id !== questionId),
          selectedQuestionIds: f.selectedQuestionIds.filter((id) => id !== questionId),
        };
      }
      const def = STANDARD_QUESTIONS.find((q) => q.id === questionId)!;
      const entry: SelectedStandardQuestion = {
        id: questionId,
        weight: def.defaultWeight,
        expected: defaultExpectedForQuestion(def),
      };
      return {
        ...f,
        requirements: [...f.requirements, entry],
        selectedQuestionIds: [...f.selectedQuestionIds, questionId],
      };
    });
  };

  const toggleGroup = (questionIds: string[], select: boolean) => {
    setForm((f) => {
      if (select) {
        const toAdd = questionIds.filter((id) => !f.selectedQuestionIds.includes(id));
        const newEntries = toAdd.map((id) => {
          const def = STANDARD_QUESTIONS.find((q) => q.id === id)!;
          return { id, weight: def.defaultWeight, expected: defaultExpectedForQuestion(def) };
        });
        return {
          ...f,
          requirements: [...f.requirements, ...newEntries],
          selectedQuestionIds: [...f.selectedQuestionIds, ...toAdd],
        };
      }
      return {
        ...f,
        requirements: f.requirements.filter((r) => !questionIds.includes(r.id)),
        selectedQuestionIds: f.selectedQuestionIds.filter((id) => !questionIds.includes(id)),
      };
    });
  };

  const applyRecommendedQuestions = () => {
    const recommended = defaultSelectedQuestions();
    setForm((f) => ({
      ...f,
      requirements: recommended,
      selectedQuestionIds: recommended.map((q) => q.id),
    }));
  };

  const toggleTitle = (option: string) => {
    setForm((f) => {
      const selected = f.titles;
      const next = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option];
      return { ...f, titles: next };
    });
  };

  const toggleHowSells = (option: string) => {
    setForm((f) => {
      const selected = f.howSells;
      const next = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option];
      return { ...f, howSells: next };
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
        title: serializeMultiValue(form.titles),
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
          howSells: serializeMultiValue(form.howSells),
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
        standardQuestions: form.requirements,
        requirements: selectedToRequirements(form.requirements),
        pipeline: form.pipeline,
        tests: form.stages,
        checklistTasks: [
          'Buscar candidatos',
          'Contactar candidatos',
          'Enviar pruebas',
          'Agendar entrevistas',
          'Presentar finalistas',
        ],
        summary: `Proceso ${serializeMultiValue(form.titles) || 'comercial'} para ${form.companyName}`,
      });
      router.push(`/procesos/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el proceso');
    } finally {
      setLoading(false);
    }
  };

  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/procesos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      {/* Encabezado + caja de ayuda */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Nueva solicitud de búsqueda</h1>
            <p className="text-sm text-slate-500 mt-0.5">El sistema guía el flujo: cliente → perfil → requisitos → pipeline → automatizaciones.</p>
          </div>
        </div>
        <div className="hidden md:flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-white px-4 py-3 max-w-xs shadow-sm">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FFF7E6', color: '#B7791F' }}>
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>¿Necesitas ayuda?</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Sigue los pasos para crear una solicitud completa y efectiva.</p>
          </div>
        </div>
      </div>

      {/* Stepper con líneas conectoras */}
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
        {/* Cabecera de sección */}
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
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3">
              <p className="text-sm text-slate-700">
                Describe el cargo que buscas. Esta información queda en el perfil interno del proceso.
              </p>
            </div>
            <ChipMultiField
              label="Nombre del cargo"
              hint="Selecciona uno o más cargos a buscar"
              options={JOB_TITLE_OPTIONS}
              selected={form.titles}
              onToggle={toggleTitle}
            />
            <TextArea label="Objetivo del cargo" value={form.objective} onChange={(v) => update('objective', v)} placeholder="Ej. Incrementar ventas en el segmento enterprise..." />
            <TextArea label="Funciones principales" value={form.functions} onChange={(v) => update('functions', v)} placeholder="Prospección, cierre, gestión de cartera..." />
            <TextArea label="Responsabilidades clave" value={form.responsibilities} onChange={(v) => update('responsibilities', v)} placeholder="Meta individual, reporte semanal, capacitación..." />
            <Field label="KPI principal" value={form.kpis} onChange={(v) => update('kpis', v)} placeholder="Facturación mensual, tasa de cierre..." />
          </>
        )}

        {step === 4 && (
          <>
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3 space-y-1">
              <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Requisitos del aspirante</p>
              <p className="text-xs text-slate-600">
                Paso 1 - Elige qué preguntas responderán los candidatos. Paso 2 - Define el valor ideal y cuánto pesa en compatibilidad.
              </p>
            </div>

            <QuestionPicker
              selectedIds={form.selectedQuestionIds}
              onToggle={toggleQuestion}
              onToggleGroup={toggleGroup}
              onApplyRecommended={applyRecommendedQuestions}
            />

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>
                  Valores esperados y pesos
                </p>
                <span className="text-xs text-slate-400">
                  {form.requirements.length} pregunta{form.requirements.length !== 1 ? 's' : ''} ·{' '}
                  {form.requirements.reduce((s, r) => s + r.weight, 0)}% total
                </span>
              </div>
              {form.requirements.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center rounded-lg bg-slate-50">
                  Selecciona al menos una pregunta arriba para configurar los requisitos.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.requirements.map((req, i) => {
                const def = STANDARD_QUESTIONS.find((q) => q.id === req.id);
                if (!def) return null;
                const isSkills = req.id === SKILLS_QUESTION_ID;
                const selectedSkills = parseMultiValue(req.expected);
                return (
                  <div key={req.id} className="p-3 rounded-lg bg-slate-50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{def.label}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{def.category}</span>
                      </div>
                      {isSkills && (
                        <span className="text-xs font-medium text-[var(--kova-blue)] whitespace-nowrap">30% total</span>
                      )}
                    </div>
                    {isSkills ? (
                      <>
                        <p className="text-xs text-slate-500">
                          Elige hasta 6 habilidades requeridas. Cada una suma 5% en compatibilidad.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {def.options.map((skill) => {
                            const active = selectedSkills.includes(skill);
                            const disabled = !active && selectedSkills.length >= 6;
                            return (
                              <button
                                key={skill}
                                type="button"
                                disabled={disabled}
                                onClick={() => toggleSkillExpected(i, skill)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                  active
                                    ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)]'
                                    : disabled
                                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                {active ? '✓ ' : ''}{skill}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-slate-400">
                          {selectedSkills.length}/6 seleccionadas · {selectedSkills.length * 5}% posibles
                        </p>
                      </>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2">
                        <select
                          value={String(req.expected)}
                          onChange={(e) => updateRequirement(i, 'expected', e.target.value)}
                          className="px-2 py-2 rounded border border-slate-200 text-sm"
                        >
                          {def.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={req.weight}
                            onChange={(e) => updateRequirement(i, 'weight', Number(e.target.value))}
                            className="w-16 px-2 py-2 rounded border border-slate-200 text-sm"
                          />
                          <span className="text-xs text-slate-400">% peso</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
                  })}
                </div>
              )}
              {form.requirements.length > 0 && (
                <p className="text-xs text-slate-400">
                  Peso total: {form.requirements.reduce((s, r) => s + r.weight, 0)}% - idealmente 100%
                </p>
              )}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3 space-y-1">
              <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Proceso de selección</p>
              <p className="text-xs text-slate-600">
                Este paso define el tablero donde vivirán los candidatos. No se avanza solo por llenar esta pantalla:
                cada candidato avanza cuando apruebas o completas la etapa en su tarjeta.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
                <p className="text-xs font-semibold text-green-700">Avanza</p>
                <p className="text-xs text-green-700/80 mt-1">Cuando cumple la etapa, pasa al siguiente paso del pipeline.</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                <p className="text-xs font-semibold text-amber-700">No avanza todavía</p>
                <p className="text-xs text-amber-700/80 mt-1">Queda en la misma etapa si falta prueba, entrevista o feedback.</p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                <p className="text-xs font-semibold text-red-700">Se descarta</p>
                <p className="text-xs text-red-700/80 mt-1">Sale del flujo activo con motivo registrado.</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Automatizaciones / evaluaciones activas</p>
                <span className="text-xs text-slate-400">{form.stages.length} seleccionadas</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {STAGE_OPTIONS.map((option) => {
                  const active = form.stages.includes(option.label);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => toggleStage(option.label)}
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        active ? 'border-[var(--kova-blue)] bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                            active ? 'bg-[var(--kova-blue)] border-[var(--kova-blue)] text-white' : 'border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{option.label}</p>
                          <p className="text-[11px] text-[var(--kova-blue)] mt-0.5">{option.stage}</p>
                          <p className="text-xs text-slate-500 mt-1">{option.purpose}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Pipeline del candidato</p>
                <p className="text-xs text-slate-500">
                  Este es el orden visible en el tablero. En la vista del proceso podrás arrastrar candidatos o usar acciones
                  de avanzar, mover o descartar.
                </p>
              </div>
              {form.pipeline.map((stage, i) => (
                <div key={stage} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-500 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{stage}</p>
                        {i < form.pipeline.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{PIPELINE_STAGE_HELP[stage]?.goal}</p>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2">
                        <p className="text-[11px] text-green-700 bg-white rounded border border-green-100 px-2 py-1">
                          <strong>Avanza:</strong> {PIPELINE_STAGE_HELP[stage]?.advances}
                        </p>
                        <p className="text-[11px] text-amber-700 bg-white rounded border border-amber-100 px-2 py-1">
                          <strong>No avanza:</strong> {PIPELINE_STAGE_HELP[stage]?.stalled}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <ProcessSummary form={form} />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={finish} disabled={loading || !form.companyName || form.titles.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--kova-green), #00996a)' }}>
            {loading ? 'Creando...' : <><Check className="w-4 h-4" /> Crear proceso</>}
          </button>
        )}
      </div>
    </div>
  );
}

const URGENCY_LABELS: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

function dash(value: string | undefined | null) {
  return value?.trim() ? value : '-';
}

function ProcessSummary({ form }: {
  form: {
    companyName: string;
    contact: string;
    email: string;
    phone: string;
    city: string;
    whatSells: string;
    revenue: string;
    howSells: string[];
    market: string;
    competitors: string;
    commercialModel: string;
    whyHiring: string;
    headcount: string;
    startDate: string;
    urgency: string;
    titles: string[];
    objective: string;
    functions: string;
    responsibilities: string;
    kpis: string;
    requirements: SelectedStandardQuestion[];
    pipeline: string[];
    stages: string[];
  };
}) {
  const totalWeight = form.requirements.reduce((s, r) => s + r.weight, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3">
        <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>Resumen de la búsqueda</p>
        <p className="text-xs text-slate-600 mt-0.5">
          Revisa todo lo configurado antes de crear el proceso. Puedes volver atrás para editar cualquier paso.
        </p>
      </div>

      <SummarySection title="Empresa cliente" step={1}>
        <SummaryGrid>
          <SummaryItem label="Empresa" value={dash(form.companyName)} highlight />
          <SummaryItem label="Contacto" value={dash(form.contact)} />
          <SummaryItem label="Correo" value={dash(form.email)} />
          <SummaryItem label="Teléfono" value={dash(form.phone)} />
          <SummaryItem label="Ciudad" value={dash(form.city)} />
        </SummaryGrid>
      </SummarySection>

      <SummarySection title="Discovery comercial" step={2}>
        <SummaryGrid>
          <SummaryItem label="¿Qué vende?" value={dash(form.whatSells)} span={2} />
          <SummaryItem label="¿Cuánto vende?" value={dash(form.revenue)} highlight />
          <SummaryItem
            label="¿Cómo vende?"
            value={form.howSells.length > 0 ? form.howSells.join(', ') : '-'}
            span={2}
          />
          <SummaryItem label="Mercado" value={dash(form.market)} />
          <SummaryItem label="Competidores" value={dash(form.competitors)} />
          <SummaryItem label="Modelo comercial" value={dash(form.commercialModel)} />
        </SummaryGrid>
      </SummarySection>

      <SummarySection title="Necesidad de contratación" step={3}>
        <SummaryGrid>
          <SummaryItem label="¿Por qué contrata?" value={dash(form.whyHiring)} span={2} />
          <SummaryItem label="Personas a contratar" value={dash(form.headcount)} />
          <SummaryItem label="Fecha de ingreso" value={form.startDate ? new Date(form.startDate + 'T12:00:00').toLocaleDateString('es-CO') : '-'} />
          <SummaryItem label="Urgencia" value={URGENCY_LABELS[form.urgency] ?? form.urgency} highlight />
        </SummaryGrid>
      </SummarySection>

      <SummarySection title="Perfil del cargo" step={4}>
        <SummaryGrid>
          <SummaryItem label="Cargo(s)" value={form.titles.length > 0 ? form.titles.join(', ') : '-'} highlight span={2} />
          <SummaryItem label="Objetivo" value={dash(form.objective)} span={2} />
          <SummaryItem label="Funciones principales" value={dash(form.functions)} span={2} />
          <SummaryItem label="Responsabilidades" value={dash(form.responsibilities)} span={2} />
          <SummaryItem label="KPI principal" value={dash(form.kpis)} span={2} />
        </SummaryGrid>
      </SummarySection>

      <SummarySection title="Requisitos del aspirante" step={5} badge={`${form.requirements.length} criterios · ${totalWeight}%`}>
        {form.requirements.length === 0 ? (
          <p className="text-xs text-slate-400">Sin requisitos configurados.</p>
        ) : (
          <div className="space-y-2">
            {form.requirements.map((req) => {
              const def = STANDARD_QUESTIONS.find((q) => q.id === req.id);
              if (!def) return null;
              const isSkills = req.id === SKILLS_QUESTION_ID;
              const expected = isSkills ? parseMultiValue(req.expected).join(', ') : String(req.expected);
              return (
                <div key={req.id} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{def.label}</p>
                    <p className="text-slate-500 mt-0.5 truncate">Esperado: {expected || '-'}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-[var(--kova-blue)]">{req.weight}%</span>
                </div>
              );
            })}
          </div>
        )}
      </SummarySection>

      <SummarySection title="Proceso de selección" step={6}>
        <SummaryGrid>
          <SummaryItem
            label="Automatizaciones activas"
            value={form.stages.length > 0 ? form.stages.join(', ') : 'Ninguna seleccionada'}
            span={2}
          />
        </SummaryGrid>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {form.pipeline.map((stage, i) => (
            <span key={stage} className="inline-flex items-center gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">{stage}</span>
              {i < form.pipeline.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
            </span>
          ))}
        </div>
      </SummarySection>

      <p className="text-xs text-slate-400 pt-1">
        Al crear, el sistema generará tareas, checklist y calculará compatibilidad según los requisitos configurados.
      </p>
    </div>
  );
}

function SummarySection({ title, step, badge, children }: {
  title: string;
  step: number;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: 'var(--kova-blue)' }}>
            {step}
          </span>
          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{title}</p>
        </div>
        {badge && <span className="text-[10px] text-slate-400">{badge}</span>}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function SummaryGrid({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">{children}</div>;
}

function SummaryItem({ label, value, highlight, span }: {
  label: string;
  value: string;
  highlight?: boolean;
  span?: number;
}) {
  return (
    <div className={span === 2 ? 'sm:col-span-2' : undefined}>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm mt-0.5 ${highlight ? 'font-semibold' : ''}`} style={{ color: 'var(--kova-navy)' }}>
        {value}
      </p>
    </div>
  );
}

function QuestionPicker({
  selectedIds,
  onToggle,
  onToggleGroup,
  onApplyRecommended,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleGroup: (questionIds: string[], select: boolean) => void;
  onApplyRecommended: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Preguntas para el formulario del aspirante
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {selectedIds.length} seleccionada{selectedIds.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={onApplyRecommended}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Pack recomendado
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {QUESTION_GROUPS.map((group) => {
          const questions = group.questionIds
            .map((id) => STANDARD_QUESTIONS.find((q) => q.id === id))
            .filter(Boolean) as typeof STANDARD_QUESTIONS;
          const selectedInGroup = questions.filter((q) => selectedIds.includes(q.id)).length;
          const allSelected = selectedInGroup === questions.length;
          const someSelected = selectedInGroup > 0 && !allSelected;

          return (
            <div
              key={group.id}
              className={`rounded-lg border p-3 transition-colors ${
                someSelected || allSelected ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{group.title}</p>
                  <p className="text-xs text-slate-500">{group.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.questionIds, !allSelected)}
                  className="text-[11px] shrink-0 px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-white"
                >
                  {allSelected ? 'Quitar todas' : 'Marcar todas'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q) => {
                  const active = selectedIds.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onToggle(q.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        active
                          ? 'border-[var(--kova-blue)] bg-white text-[var(--kova-blue)] font-medium'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {active ? '✓ ' : ''}{q.label}
                    </button>
                  );
                })}
              </div>
              {selectedInGroup > 0 && (
                <p className="text-[10px] text-slate-400 mt-1.5">{selectedInGroup}/{questions.length} en este grupo</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--kova-navy)' }}>
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', icon: Icon, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  icon?: ComponentType<{ className?: string }>; required?: boolean;
}) {
  const filled = value.trim().length > 0;
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className={`flex items-center gap-2 px-3.5 rounded-xl border bg-white transition-all focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] ${filled ? 'border-slate-200' : 'border-slate-200'}`}>
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full py-2.5 text-sm bg-transparent outline-none" />
        {required && filled && <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--kova-green)' }} />}
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--kova-ring)] focus:border-[var(--kova-blue)] resize-none transition-all" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder, icon: Icon, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
  icon?: ComponentType<{ className?: string }>; required?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex items-center gap-2 px-3.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)]">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full py-2.5 text-sm bg-transparent outline-none">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function ChipMultiField({ label, hint, options, selected, onToggle }: {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium block" style={{ color: 'var(--kova-navy)' }}>{label}</label>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {active ? '✓ ' : ''}{option}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-slate-400 mt-1.5">{selected.length} seleccionada{selected.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}
