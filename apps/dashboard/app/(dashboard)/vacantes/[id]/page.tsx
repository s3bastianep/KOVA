'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Vacancy = {
  id: string;
  title: string;
  status: string;
  city?: string;
  modality?: string;
  priority?: string;
  urgency?: string;
  quantity?: number;
  salaryMin?: number;
  salaryMax?: number;
  variablePay?: string;
  description?: string;
  openedAt?: string;
  company?: { id: string; name: string };
  candidates?: { id: string; stage: string; ranking?: number; candidate: { id: string; firstName: string; lastName: string; email?: string } }[];
  pipelineStages?: { stage: string; label: string; order: number }[];
  tasks?: { id: string; title: string; status: string; dueDate?: string }[];
};

function money(n?: number) {
  if (!n) return null;
  return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

export default function VacanteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => dashboardApi.vacancy(id),
  });

  const v = data as Vacancy | undefined;

  const salary = v ? [money(v.salaryMin), money(v.salaryMax)].filter(Boolean).join(' - ') : '';

  return (
    <div className="space-y-6">
      <Link href="/vacantes" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a vacantes
      </Link>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : isError || !v ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar la vacante.</div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FA' }}>
              <Briefcase className="w-7 h-7" style={{ color: 'var(--kova-blue)' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{v.title}</h1>
              <p className="text-sm text-slate-500">{v.company?.name ?? '—'}</p>
            </div>
            <span className="ml-auto inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100">{v.status}</span>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="kova-card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><MapPin className="w-4 h-4" /> Ubicación</div>
              <p className="text-sm mt-1" style={{ color: 'var(--kova-navy)' }}>{v.city ?? '—'} · {v.modality ?? '—'}</p>
            </div>
            <div className="kova-card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><DollarSign className="w-4 h-4" /> Salario</div>
              <p className="text-sm mt-1" style={{ color: 'var(--kova-navy)' }}>{salary || '—'}</p>
            </div>
            <div className="kova-card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><Clock className="w-4 h-4" /> Prioridad</div>
              <p className="text-sm mt-1" style={{ color: 'var(--kova-navy)' }}>{v.priority ?? '—'}{v.urgency ? ` · ${v.urgency}` : ''}</p>
            </div>
            <div className="kova-card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide"><Users className="w-4 h-4" /> Candidatos</div>
              <p className="text-sm mt-1" style={{ color: 'var(--kova-navy)' }}>{v.candidates?.length ?? 0}</p>
            </div>
          </div>

          {v.description && (
            <div className="kova-card p-6">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-2">Descripción</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              {v.variablePay && <p className="text-sm text-slate-600 mt-2"><strong>Variable:</strong> {v.variablePay}</p>}
            </div>
          )}

          <div className="kova-card p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Candidatos en proceso</h2>
            {v.candidates?.length ? (
              <div className="space-y-3">
                {v.candidates.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{c.candidate.firstName} {c.candidate.lastName}</p>
                      <p className="text-xs text-slate-400">{c.candidate.email ?? '—'}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{c.stage}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Aún no hay candidatos en esta vacante.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
