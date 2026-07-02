'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, ListChecks, BarChart3, GraduationCap, Building2, AlertTriangle, CalendarClock } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Profile = {
  id: string;
  title: string;
  company: string;
  objective: string;
  functions: string[];
  kpis: string[];
  competencies: { name: string; weight: number }[];
  knowledge: string[];
  experience: string;
  targetCompanies: string[];
  avoidCompanies: string[];
  successFactors: string[];
  failureReasons: string[];
  expectations: { d30: string; d60: string; d90: string };
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="kova-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
        <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PerfilCargoPage() {
  const { data, isLoading } = useQuery({ queryKey: ['jobProfiles'], queryFn: dashboardApi.jobProfiles });
  const profiles = (data as Profile[]) ?? [];
  const [selected, setSelected] = useState(0);
  const p = profiles[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Perfil del Cargo</h1>
        <p className="text-sm text-slate-500">Ficha inteligente con KPIs, competencias y expectativas a 30/60/90 días.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : !p ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">Aún no hay perfiles. Completa un Discovery para generarlos.</div>
      ) : (
        <>
          {profiles.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {profiles.map((pr, i) => (
                <button
                  key={pr.id}
                  onClick={() => setSelected(i)}
                  className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
                  style={{
                    background: i === selected ? 'var(--kova-navy)' : 'white',
                    color: i === selected ? 'white' : 'var(--kova-navy)',
                    borderColor: 'var(--kova-border)',
                  }}
                >
                  {pr.title}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>{p.title}</h2>
              <p className="text-sm text-slate-500">{p.company}</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: '#E6FAF3', color: 'var(--kova-green)' }}>Generado automáticamente</span>
          </div>

          <Section icon={Target} title="Objetivo del cargo">
            <p className="text-sm text-slate-600">{p.objective}</p>
          </Section>

          <div className="grid lg:grid-cols-2 gap-6">
            <Section icon={ListChecks} title="Funciones">
              <ul className="space-y-1.5">
                {p.functions.map((f) => (
                  <li key={f} className="text-sm text-slate-600 flex gap-2"><span style={{ color: 'var(--kova-blue)' }}>•</span> {f}</li>
                ))}
              </ul>
            </Section>
            <Section icon={BarChart3} title="KPIs">
              <ul className="space-y-1.5">
                {p.kpis.map((k) => (
                  <li key={k} className="text-sm text-slate-600 flex gap-2"><span style={{ color: 'var(--kova-blue)' }}>•</span> {k}</li>
                ))}
              </ul>
            </Section>
          </div>

          <Section icon={BarChart3} title="Competencias clave">
            <div className="space-y-3">
              {p.competencies.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--kova-navy)' }}>{c.name}</span>
                    <span className="text-slate-400">{c.weight}/5</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(c.weight / 5) * 100}%`, background: 'var(--kova-blue)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid lg:grid-cols-2 gap-6">
            <Section icon={GraduationCap} title="Conocimientos y experiencia">
              <ul className="space-y-1.5 mb-3">
                {p.knowledge.map((k) => (
                  <li key={k} className="text-sm text-slate-600 flex gap-2"><span style={{ color: 'var(--kova-blue)' }}>•</span> {k}</li>
                ))}
              </ul>
              <p className="text-sm text-slate-500"><strong>Experiencia:</strong> {p.experience}</p>
            </Section>
            <Section icon={Building2} title="Empresas objetivo / a evitar">
              <p className="text-xs text-slate-400 mb-1">Ideales</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.targetCompanies.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-full bg-slate-100">{t}</span>)}
              </div>
              {p.avoidCompanies.length > 0 && (
                <>
                  <p className="text-xs text-slate-400 mb-1">No recomendadas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.avoidCompanies.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: '#FFF0EE', color: 'var(--kova-coral)' }}>{t}</span>)}
                  </div>
                </>
              )}
            </Section>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Section icon={Target} title="Factores de éxito">
              <ul className="space-y-1.5">
                {p.successFactors.map((s) => (
                  <li key={s} className="text-sm text-slate-600 flex gap-2"><span style={{ color: 'var(--kova-green)' }}>✓</span> {s}</li>
                ))}
              </ul>
            </Section>
            <Section icon={AlertTriangle} title="Razones de fracaso">
              <ul className="space-y-1.5">
                {p.failureReasons.map((s) => (
                  <li key={s} className="text-sm text-slate-600 flex gap-2"><span style={{ color: 'var(--kova-coral)' }}>✕</span> {s}</li>
                ))}
              </ul>
            </Section>
          </div>

          <Section icon={CalendarClock} title="Expectativas a 30 / 60 / 90 días">
            <div className="grid sm:grid-cols-3 gap-4">
              {[['30 días', p.expectations.d30], ['60 días', p.expectations.d60], ['90 días', p.expectations.d90]].map(([label, val]) => (
                <div key={label} className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--kova-blue)' }}>{label}</p>
                  <p className="text-sm text-slate-600">{val}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
