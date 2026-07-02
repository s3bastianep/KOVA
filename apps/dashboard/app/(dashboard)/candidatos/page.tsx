'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export default function CandidatosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['candidates'], queryFn: () => dashboardApi.candidates() });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Candidatos</h1>
      {isLoading ? <p className="text-sm text-slate-500">Cargando...</p> : (
        <div className="grid gap-4">
          {(data as { id: string; firstName: string; lastName: string; email?: string; status: string; overallScore?: number }[])?.map((c) => (
            <div key={c.id} className="kova-card p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{c.firstName} {c.lastName}</h3>
                <p className="text-sm text-slate-500">{c.email ?? '—'} · {c.status}</p>
              </div>
              {c.overallScore != null && <span className="font-heading font-bold text-lg" style={{ color: 'var(--kova-green)' }}>{c.overallScore}</span>}
            </div>
          )) ?? <p className="text-sm text-slate-500">No hay candidatos registrados.</p>}
        </div>
      )}
    </div>
  );
}
