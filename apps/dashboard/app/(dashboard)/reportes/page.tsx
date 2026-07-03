'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

type Reports = {
  avgTimeToHire: number;
  avgTimePerStage: { stage: string; days: number }[];
  byConsultant: { name: string; vacancies: number; hires: number }[];
  sources: { source: string; count: number }[];
  hiresByMonth: { month: string; hires: number }[];
};

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-400">{value}{suffix ?? ''}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: 'var(--kova-blue)' }} />
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['reports'], queryFn: dashboardApi.reports });
  const r = data as Reports | undefined;

  if (isLoading) return <p className="text-sm text-slate-500">Cargando...</p>;
  if (!r) return <div className="kova-card p-8 text-center text-slate-400 text-sm">Sin datos de reportes.</div>;

  const maxStage = Math.max(...(r.avgTimePerStage.map((s) => s.days).concat(1)));
  const maxSource = Math.max(...(r.sources.map((s) => s.count).concat(1)));
  const maxHire = Math.max(...(r.hiresByMonth.map((s) => s.hires).concat(1)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        subtitle="Business intelligence del proceso de reclutamiento."
        icon={BarChart3}
        accent="#F3E8FF"
        tone="#7C3AED"
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="kova-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><Clock className="w-4 h-4" /> Tiempo prom. contratación</div>
          <p className="font-heading text-3xl font-bold mt-2" style={{ color: 'var(--kova-navy)' }}>{r.avgTimeToHire} <span className="text-base font-normal text-slate-400">días</span></p>
        </div>
        <div className="kova-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><TrendingUp className="w-4 h-4" /> Contrataciones (6m)</div>
          <p className="font-heading text-3xl font-bold mt-2" style={{ color: 'var(--kova-navy)' }}>{r.hiresByMonth.reduce((a, b) => a + b.hires, 0)}</p>
        </div>
        <div className="kova-card p-5">
          <div className="text-slate-400 text-xs uppercase tracking-wide">Consultores activos</div>
          <p className="font-heading text-3xl font-bold mt-2" style={{ color: 'var(--kova-navy)' }}>{r.byConsultant.length}</p>
        </div>
        <div className="kova-card p-5">
          <div className="text-slate-400 text-xs uppercase tracking-wide">Fuentes de candidatos</div>
          <p className="font-heading text-3xl font-bold mt-2" style={{ color: 'var(--kova-navy)' }}>{r.sources.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="kova-card p-6">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Tiempo promedio por etapa</h3>
          <div className="space-y-3">
            {r.avgTimePerStage.map((s) => <Bar key={s.stage} label={s.stage} value={s.days} max={maxStage} suffix=" d" />)}
          </div>
        </div>

        <div className="kova-card p-6">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Fuentes de candidatos</h3>
          <div className="space-y-3">
            {r.sources.map((s) => <Bar key={s.source} label={s.source} value={s.count} max={maxSource} />)}
          </div>
        </div>

        <div className="kova-card p-6">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Contrataciones por mes</h3>
          <div className="flex items-end gap-3 h-40">
            {r.hiresByMonth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg" style={{ height: `${(m.hires / maxHire) * 100}%`, background: 'var(--kova-blue)', minHeight: 4 }} />
                <span className="text-xs text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kova-card p-6">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Desempeño por consultor</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="py-2">Consultor</th>
                <th className="py-2">Vacantes</th>
                <th className="py-2">Contrataciones</th>
              </tr>
            </thead>
            <tbody>
              {r.byConsultant.map((c) => (
                <tr key={c.name} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 font-medium" style={{ color: 'var(--kova-navy)' }}>{c.name}</td>
                  <td className="py-2 text-slate-600">{c.vacancies}</td>
                  <td className="py-2 text-slate-600">{c.hires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
