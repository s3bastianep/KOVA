'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Loader2, Sparkles, UserPlus } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

type MatchRow = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  source?: string | null;
  compatibility: number;
  breakdown: { label: string; earned: number; max: number; detail: string }[];
};

type MatchesResponse = {
  matches: MatchRow[];
  total: number;
};

function scoreColor(pct: number) {
  if (pct >= 85) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

export function SuggestedMatchesPanel({ vacancyId }: { vacancyId: string }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['vacancy-matches', vacancyId],
    queryFn: () => dashboardApi.vacancyMatches(vacancyId) as Promise<MatchesResponse>,
    enabled: open,
  });

  const matches = data?.matches ?? [];
  const total = data?.total ?? 0;

  const addMutation = useMutation({
    mutationFn: (candidateId: string) =>
      dashboardApi.createCandidate({
        vacancyId,
        existingCandidateId: candidateId,
        firstName: '',
        lastName: '',
        source: 'Sugerido por compatibilidad',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['vacancy-matches', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast('Candidato agregado al proceso');
    },
    onError: (err: Error) => toast(err.message || 'No se pudo agregar', 'error'),
  });

  return (
    <div className="border-b px-5 py-4" style={{ borderColor: 'var(--kova-border)', background: 'rgba(51, 65, 196, 0.04)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>
              Candidatos sugeridos de la base de talento
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Solo visible para el equipo Litt Hunter · ordenados por ajuste al cargo
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {(isLoading || isFetching) && matches.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculando compatibilidad...
            </div>
          ) : matches.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              No hay perfiles en la base de talento que coincidan con este cargo, o ya están en el proceso.
              Los candidatos pueden registrarse en{' '}
              <Link href="/registro" className="underline" style={{ color: 'var(--kova-blue)' }}>
                /registro
              </Link>
              .
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-500">
                {total} perfil{total === 1 ? '' : 'es'} en base de talento · mostrando top {matches.length}
              </p>
              <div className="space-y-2">
                {matches.map((m) => {
                  const name = `${m.firstName} ${m.lastName}`;
                  const expanded = expandedId === m.id;
                  return (
                    <div
                      key={m.id}
                      className="rounded-xl border bg-white overflow-hidden"
                      style={{ borderColor: 'var(--kova-border)' }}
                    >
                      <div className="flex flex-wrap items-center gap-3 p-3">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            background: `${scoreColor(m.compatibility)}18`,
                            color: scoreColor(m.compatibility),
                          }}
                        >
                          {m.compatibility}%
                        </div>
                        <div className="flex-1 min-w-[12rem]">
                          <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>
                            {name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {[m.city, m.email, m.source].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : m.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            {expanded ? 'Ocultar' : 'Ver detalle'}
                          </button>
                          <button
                            type="button"
                            disabled={addMutation.isPending}
                            onClick={() => addMutation.mutate(m.id)}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-60"
                            style={{ background: 'var(--kova-blue)' }}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Agregar
                          </button>
                        </div>
                      </div>
                      {expanded && (
                        <div className="px-3 pb-3 pt-0 border-t border-slate-100">
                          <ul className="mt-2 space-y-1">
                            {m.breakdown.map((row) => (
                              <li key={row.label} className="flex justify-between gap-2 text-xs text-slate-600">
                                <span>{row.label}</span>
                                <span className="font-medium">
                                  {row.earned}/{row.max} · {row.detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
