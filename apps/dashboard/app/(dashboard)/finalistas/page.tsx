'use client';

import { useQuery } from '@tanstack/react-query';
import { Trophy, Download } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Finalists = {
  vacancy: string;
  company: string;
  candidates: {
    name: string;
    compatibility: number;
    interview: number;
    assessment: number;
    strengths: string[];
    risks: string[];
    recommendation: string;
  }[];
};

export default function FinalistasPage() {
  const { data, isLoading } = useQuery({ queryKey: ['finalists'], queryFn: dashboardApi.finalists });
  const report = data as Finalists | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Presentación de Finalistas</h1>
          <p className="text-sm text-slate-500">Informe comparativo con recomendación del consultor.</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-slate-200 hover:bg-slate-50">
          <Download className="w-4 h-4" /> Exportar PDF
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : !report || !report.candidates?.length ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">Aún no hay finalistas para presentar.</div>
      ) : (
        <>
          <div className="kova-card p-5">
            <p className="text-sm text-slate-500">Vacante</p>
            <p className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{report.vacancy} · {report.company}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {report.candidates.map((c, i) => (
              <div key={c.name} className="kova-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {i === 0 && <Trophy className="w-5 h-5" style={{ color: '#D4AF37' }} />}
                  <h3 className="font-heading text-lg font-bold" style={{ color: 'var(--kova-navy)' }}>{c.name}</h3>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: '#E6FAF3', color: 'var(--kova-green)' }}>{c.recommendation}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[['Compatibilidad', c.compatibility], ['Entrevista', c.interview], ['Pruebas', c.assessment]].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-lg bg-slate-50">
                      <p className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>{val}{label === 'Compatibilidad' ? '%' : ''}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Fortalezas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.strengths.map((s) => <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: '#E6FAF3', color: 'var(--kova-green)' }}>{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Riesgos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.risks.map((s) => <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: '#FFF7E6', color: '#B7791F' }}>{s}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
