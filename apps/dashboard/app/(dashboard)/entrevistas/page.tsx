'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Interview = {
  id: string;
  candidateName: string;
  vacancy: string;
  status: string;
  scheduledAt: string;
  score: number | null;
  questions: { q: string; competency: string; score: number | null }[];
};

export default function EntrevistasPage() {
  const { data, isLoading } = useQuery({ queryKey: ['interviews'], queryFn: dashboardApi.interviews });
  const interviews = (data as Interview[]) ?? [];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Entrevistas</h1>
        <p className="text-sm text-slate-500">Entrevistas estructuradas por competencias con puntaje.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : interviews.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay entrevistas registradas.</div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <div key={iv.id} className="kova-card overflow-hidden">
              <button onClick={() => setOpen(open === iv.id ? null : iv.id)} className="w-full p-5 flex items-center justify-between text-left">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{iv.candidateName}</h3>
                  <p className="text-sm text-slate-500">{iv.vacancy}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    {iv.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4" />}
                    {iv.status === 'COMPLETED' ? 'Completada' : 'Programada'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-4 h-4" /> {new Date(iv.scheduledAt).toLocaleDateString()}
                  </span>
                  {iv.score != null && <span className="font-heading font-bold" style={{ color: 'var(--kova-green)' }}>{iv.score}</span>}
                </div>
              </button>
              {open === iv.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                  {iv.questions.map((q, i) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{q.q}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{q.competency}</span>
                      </div>
                      <span className="text-sm font-semibold shrink-0" style={{ color: q.score != null ? 'var(--kova-green)' : '#cbd5e1' }}>
                        {q.score != null ? `${q.score}/10` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
