'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Save, Sparkles } from 'lucide-react';

type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'number' };

const STEPS: { title: string; objective: string; fields?: Field[] }[] = [
  {
    title: 'Información de la vacante',
    objective: 'Datos base del cargo a cubrir.',
    fields: [
      { key: 'empresa', label: 'Empresa' },
      { key: 'cargo', label: 'Cargo' },
      { key: 'cantidad', label: 'Cantidad de posiciones', type: 'number' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'modalidad', label: 'Modalidad (presencial / híbrido / remoto)' },
      { key: 'salario', label: 'Salario base' },
      { key: 'variable', label: 'Variable / comisiones' },
    ],
  },
  {
    title: 'Entender el negocio',
    objective: 'Comprender qué vende la empresa y cómo genera valor.',
    fields: [
      { key: 'queHace', label: '¿Qué hace la empresa?', type: 'textarea' },
      { key: 'queVende', label: '¿Qué vende?', type: 'textarea' },
      { key: 'propuestaValor', label: 'Propuesta de valor', type: 'textarea' },
      { key: 'quienCompra', label: '¿Quién compra / quién decide?', type: 'textarea' },
      { key: 'ticket', label: 'Ticket promedio' },
      { key: 'duracionVenta', label: 'Duración del ciclo de venta' },
    ],
  },
  {
    title: 'Proceso comercial',
    objective: 'Cómo consigue, califica y cierra clientes.',
    fields: [
      { key: 'prospeccion', label: '¿Cómo prospectan?', type: 'textarea' },
      { key: 'calificacion', label: '¿Cómo califican oportunidades?', type: 'textarea' },
      { key: 'negociacion', label: '¿Cómo negocian y cierran?', type: 'textarea' },
      { key: 'crm', label: '¿Qué CRM / herramientas usan?' },
      { key: 'indicadores', label: 'Indicadores que manejan', type: 'textarea' },
    ],
  },
  {
    title: 'Perfil del cargo',
    objective: 'Funciones, metas y estructura del rol.',
    fields: [
      { key: 'objetivo', label: 'Objetivo del cargo', type: 'textarea' },
      { key: 'funciones', label: 'Funciones principales', type: 'textarea' },
      { key: 'metas', label: 'Metas y KPIs', type: 'textarea' },
      { key: 'reportaA', label: 'Reporta a' },
      { key: 'equipo', label: 'Equipo a cargo' },
    ],
  },
  {
    title: 'Perfil de éxito',
    objective: 'Qué hace exitoso a un vendedor en esta empresa.',
    fields: [
      { key: 'exito', label: '¿Qué hace exitoso a un vendedor aquí?', type: 'textarea' },
      { key: 'fracaso', label: '¿Por qué fracasan normalmente?', type: 'textarea' },
      { key: 'conocimientos', label: 'Conocimientos necesarios', type: 'textarea' },
      { key: 'empresasIdeales', label: 'Empresas ideales de origen', type: 'textarea' },
      { key: 'empresasNo', label: 'Empresas NO recomendadas', type: 'textarea' },
    ],
  },
];

const COMPETENCIES = [
  'Prospección', 'Negociación', 'Comunicación', 'Disciplina', 'Resiliencia',
  'Empatía', 'Organización', 'Orientación al logro', 'Cierre', 'Planeación',
];

const STORAGE_KEY = 'kova_discovery_draft';

export default function DiscoveryPage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(COMPETENCIES.map((c) => [c, 3])),
  );
  const [saved, setSaved] = useState(false);
  const [generated, setGenerated] = useState(false);

  const totalSteps = STEPS.length + 2; // + competencias + resumen
  const competencyStep = STEPS.length;
  const summaryStep = STEPS.length + 1;

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setValues(parsed.values ?? {});
        setWeights(parsed.weights ?? weights);
      } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, weights }));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(t);
    }, 600);
    return () => clearTimeout(id);
  }, [values, weights]);

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const topCompetencies = useMemo(
    () => Object.entries(weights).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k),
    [weights],
  );

  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Discovery Comercial</h1>
        <p className="text-sm text-slate-500">Asistente paso a paso. Se guarda automáticamente.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--kova-blue)' }} />
        </div>
        <span className="text-xs text-slate-500 w-28 text-right">Paso {step + 1} de {totalSteps}</span>
        {saved && <span className="inline-flex items-center gap-1 text-xs text-green-600"><Save className="w-3 h-3" /> Guardado</span>}
      </div>

      <div className="kova-card p-6 min-h-[360px]">
        {step < STEPS.length && (
          <div className="space-y-5">
            <div>
              <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--kova-navy)' }}>{STEPS[step].title}</h2>
              <p className="text-sm text-slate-500">{STEPS[step].objective}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {STEPS[step].fields?.map((f) => (
                <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={values[f.key] ?? ''}
                      onChange={(e) => set(f.key, e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={values[f.key] ?? ''}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === competencyStep && (
          <div className="space-y-5">
            <div>
              <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--kova-navy)' }}>Competencias del cargo</h2>
              <p className="text-sm text-slate-500">Ajusta la importancia de cada competencia (1 a 5).</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {COMPETENCIES.map((c) => (
                <div key={c}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--kova-navy)' }}>{c}</span>
                    <span className="text-slate-400">{weights[c]}</span>
                  </div>
                  <input
                    type="range" min={1} max={5} value={weights[c]}
                    onChange={(e) => setWeights((p) => ({ ...p, [c]: Number(e.target.value) }))}
                    className="w-full accent-blue-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === summaryStep && (
          <div className="space-y-5">
            <div>
              <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--kova-navy)' }}>Resumen y entregables</h2>
              <p className="text-sm text-slate-500">Revisa la información y genera los entregables por reglas de automatización.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400">Cargo</p>
                <p style={{ color: 'var(--kova-navy)' }}>{values.cargo || '—'} · {values.empresa || '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400">Competencias clave</p>
                <p style={{ color: 'var(--kova-navy)' }}>{topCompetencies.join(', ')}</p>
              </div>
            </div>

            {!generated ? (
              <button
                onClick={() => setGenerated(true)}
                className="inline-flex items-center gap-2 kova-btn-primary px-4 py-2.5 rounded-lg text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4" /> Generar entregables
              </button>
            ) : (
              <div className="space-y-3">
                {[
                  { t: 'Perfil del cargo', d: `Perfil para ${values.cargo || 'el cargo'} en ${values.empresa || 'la empresa'} con foco en ${topCompetencies.slice(0, 3).join(', ')}.` },
                  { t: 'Guion de entrevista por competencias', d: `${topCompetencies.length} bloques de preguntas basados en las competencias priorizadas.` },
                  { t: 'Prueba comercial / role play', d: `Escenario de ${values.queVende || 'venta'} orientado al ticket ${values.ticket || 'objetivo'}.` },
                  { t: 'Scorecard de evaluación', d: 'Rúbrica ponderada según los pesos de competencias definidos.' },
                ].map((o) => (
                  <div key={o.t} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E6FAF3' }}>
                      <Check className="w-4 h-4" style={{ color: 'var(--kova-green)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{o.t}</p>
                      <p className="text-xs text-slate-500">{o.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm border border-slate-200 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        {step < summaryStep && (
          <button
            onClick={() => setStep((s) => Math.min(summaryStep, s + 1))}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--kova-blue)' }}
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
