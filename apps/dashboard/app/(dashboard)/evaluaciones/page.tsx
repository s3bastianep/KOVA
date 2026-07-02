'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

type Assessment = {
  id: string;
  candidateName: string;
  type: string;
  competency: string;
  score: number;
  result: string;
};

function resultColor(result: string) {
  if (result === 'Aprobado') return { background: '#E6FAF3', color: 'var(--kova-green)' };
  if (result === 'En revisión') return { background: '#FFF7E6', color: '#B7791F' };
  return { background: '#FFF0EE', color: 'var(--kova-coral)' };
}

export default function EvaluacionesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['assessments'], queryFn: dashboardApi.assessments });
  const items = (data as Assessment[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Evaluaciones</h1>
        <p className="text-sm text-slate-500">Pruebas comerciales, técnicas, conductuales y role play.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay evaluaciones registradas.</div>
      ) : (
        <div className="kova-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3">Candidato</th>
                <th className="px-5 py-3">Prueba</th>
                <th className="px-5 py-3">Competencia</th>
                <th className="px-5 py-3">Puntaje</th>
                <th className="px-5 py-3">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium" style={{ color: 'var(--kova-navy)' }}>{a.candidateName}</td>
                  <td className="px-5 py-3 text-slate-600">{a.type}</td>
                  <td className="px-5 py-3 text-slate-600">{a.competency}</td>
                  <td className="px-5 py-3 font-semibold" style={{ color: 'var(--kova-navy)' }}>{a.score}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={resultColor(a.result)}>{a.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
