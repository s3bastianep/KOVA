'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export default function TareasPage() {
  const { data, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: dashboardApi.tasks });
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Tareas</h1>
      {isLoading ? <p className="text-sm text-slate-500">Cargando...</p> : (
        <div className="grid gap-3">
          {(data as { id: string; title: string; status: string; priority: string; company?: { name: string } }[])?.map((t) => (
            <div key={t.id} className="kova-card p-4 flex justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{t.title}</p>
                <p className="text-xs text-slate-500">{t.company?.name ?? '-'}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{t.status}</span>
            </div>
          )) ?? <p className="text-sm text-slate-500">Sin tareas pendientes.</p>}
        </div>
      )}
    </div>
  );
}
