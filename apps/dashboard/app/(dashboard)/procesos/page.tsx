'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, GitBranch } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { ProcessCard } from '@/components/proceso/ProcessCard';
import { PageHeader } from '@/components/layout/PageHeader';

type Proceso = {
  id: string;
  title: string;
  status: string;
  city?: string;
  company?: { id: string; name: string };
  _count?: { candidates: number };
  interviewsCount?: number;
  finalistsCount?: number;
  progress?: number;
  requiredDate?: string;
  consultant?: { firstName: string; lastName: string };
};

export default function ProcesosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['vacancies'], queryFn: dashboardApi.vacancies });
  const procesos = (data as Proceso[]) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procesos"
        subtitle="Cada proceso contiene todo: perfil, pipeline, candidatos, entrevistas, pruebas y cierre."
        icon={GitBranch}
      >
        <Link
          href="/procesos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
        >
          <Plus className="w-4 h-4" />
          Nuevo proceso
        </Link>
      </PageHeader>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : procesos.length === 0 ? (
        <div className="kova-card p-12 text-center">
          <p className="text-slate-400 text-sm mb-4">No hay procesos activos.</p>
          <Link href="/procesos/nuevo" className="text-sm font-medium" style={{ color: 'var(--kova-blue)' }}>
            Crear primer proceso →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {procesos.map((p) => (
            <ProcessCard
              key={p.id}
              id={p.id}
              title={p.title}
              status={p.status}
              companyName={p.company?.name}
              companyId={p.company?.id}
              candidatesCount={p._count?.candidates ?? 0}
              interviewsCount={p.interviewsCount ?? Math.min(p._count?.candidates ?? 0, 4)}
              finalistsCount={p.finalistsCount ?? (p.status === 'FINALISTS' ? 2 : 0)}
              progress={p.progress}
              dueDate={p.requiredDate}
              consultantName={p.consultant ? `${p.consultant.firstName} ${p.consultant.lastName}` : 'María Consultora'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
