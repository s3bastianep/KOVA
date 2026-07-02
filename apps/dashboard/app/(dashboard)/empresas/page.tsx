'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';

export default function EmpresasPage() {
  const { data, isLoading } = useQuery({ queryKey: ['companies'], queryFn: dashboardApi.companies });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Empresas</h1>
          <p className="text-sm text-slate-500">Expediente CRM completo por cliente</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <div className="grid gap-4">
          {(data as { id: string; name: string; city?: string; status: string; sector?: string; _count?: { vacancies: number } }[])?.map((c) => (
            <Link key={c.id} href={`/empresas/${c.id}`} className="kova-card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.sector ?? '—'} · {c.city ?? '—'}</p>
                </div>
                <div className="text-right text-sm">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100">{c.status}</span>
                  <p className="text-slate-400 mt-1">{c._count?.vacancies ?? 0} vacantes</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
