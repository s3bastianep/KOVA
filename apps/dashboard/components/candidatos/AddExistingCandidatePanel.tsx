'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, UserPlus, Briefcase, Loader2 } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

type TalentCandidate = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  city?: string;
  compatibility?: number;
  processCount?: number;
  vacancyTitle?: string;
  companyName?: string;
};

type AddExistingCandidatePanelProps = {
  vacancyId: string;
  onAdded?: () => void;
};

export function AddExistingCandidatePanel({ vacancyId, onAdded }: AddExistingCandidatePanelProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['talent-pool', vacancyId, search],
    queryFn: () =>
      dashboardApi.searchCandidates({
        excludeVacancyId: vacancyId,
        q: search.trim() || undefined,
      }),
    enabled: open,
  });

  const candidates = (data as TalentCandidate[]) ?? [];
  const visible = useMemo(() => candidates.slice(0, 8), [candidates]);

  const addMutation = useMutation({
    mutationFn: (existingCandidateId: string) =>
      dashboardApi.createCandidate({
        vacancyId,
        existingCandidateId,
        firstName: '',
        lastName: '',
        source: 'Base de talento',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['talent-pool', vacancyId] });
      toast('Candidato agregado desde la base de talento');
      onAdded?.();
    },
    onError: (err: Error) => toast(err.message || 'No se pudo agregar el candidato', 'error'),
  });

  return (
    <div className="border-b px-5 py-4 bg-slate-50/60" style={{ borderColor: 'var(--kova-border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--kova-blue)] hover:underline"
      >
        <UserPlus className="w-4 h-4" />
        {open ? 'Ocultar base de talento' : 'Agregar candidato existente'}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-500">
            Reutiliza perfiles que ya participaron en otros procesos. Su historial, pruebas y notas se conservan.
          </p>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {isFetching ? (
            <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando perfiles...
            </div>
          ) : visible.length === 0 ? (
            <p className="text-sm text-slate-400 py-3">No hay candidatos disponibles para este proceso.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {visible.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/candidatos/${c.id}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--kova-navy)' }}>
                        {c.firstName} {c.lastName}
                      </Link>
                      {c.compatibility != null && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                          {Math.round(c.compatibility)}% match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {c.email ?? 'Sin correo'}
                      {c.city ? ` · ${c.city}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {c.processCount ?? 1} proceso{(c.processCount ?? 1) === 1 ? '' : 's'}
                      {c.vacancyTitle ? ` · último: ${c.vacancyTitle}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={addMutation.isPending}
                    onClick={() => addMutation.mutate(c.id)}
                    className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50"
                    style={{ background: 'var(--kova-blue)' }}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
