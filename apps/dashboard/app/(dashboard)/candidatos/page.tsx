'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, MapPin, Briefcase, Star } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';

type CandidateRow = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  status: string;
  source?: string;
  compatibility?: number;
  ranking?: number;
  currentStage?: string;
  vacancyTitle?: string;
};

export default function CandidatosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['candidates'], queryFn: () => dashboardApi.candidates() });
  const list = (data as CandidateRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Candidatos</h1>
        <p className="text-sm text-slate-500">Haz clic en un candidato para ver su perfil completo.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : list.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay candidatos registrados.</div>
      ) : (
        <div className="grid gap-4">
          {list.map((c) => (
            <Link
              key={c.id}
              href={`/candidatos/${c.id}`}
              className="kova-card p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white shrink-0"
                style={{ background: 'var(--kova-blue)' }}
              >
                {c.firstName[0]}{c.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>
                    {c.firstName} {c.lastName}
                  </h3>
                  {c.ranking != null && (
                    <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      <Star className="w-3 h-3" /> #{c.ranking}
                    </span>
                  )}
                  {c.currentStage && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {stageLabel(c.currentStage)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">{c.email ?? '—'}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                  {c.city && (
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.city}</span>
                  )}
                  {c.vacancyTitle && (
                    <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.vacancyTitle}</span>
                  )}
                  {c.source && <span>Fuente: {c.source}</span>}
                </div>
              </div>

              {c.compatibility != null && (
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="font-heading font-bold text-xl" style={{ color: 'var(--kova-green)' }}>{Math.round(c.compatibility)}%</span>
                  <p className="text-xs text-slate-400">compatibilidad</p>
                </div>
              )}

              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
