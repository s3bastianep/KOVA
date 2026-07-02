'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';

export default function VacantesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['vacancies'], queryFn: dashboardApi.vacancies });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Vacantes</h1>
      {isLoading ? <p className="text-sm text-slate-500">Cargando...</p> : (
        <div className="grid gap-4">
          {(data as { id: string; title: string; status: string; company?: { name: string }; _count?: { candidates: number } }[])?.map((v) => (
            <Link key={v.id} href={`/vacantes/${v.id}`} className="kova-card p-5 block hover:shadow-md transition-shadow">
              <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{v.title}</h3>
              <p className="text-sm text-slate-500">{v.company?.name} · {v.status} · {v._count?.candidates ?? 0} candidatos</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
