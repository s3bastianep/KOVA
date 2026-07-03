'use client';

import { use, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Building2, MapPin, Briefcase, Users, CheckCircle2,
  XCircle, ArrowRight, ChevronRight, ClipboardCheck,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';
import { RejectModal } from '@/components/ui/RejectModal';
import { useToast } from '@/components/ui/Toast';

type JobProfile = {
  objective?: string;
  skills?: string[];
  conditions?: string[];
  competencies?: { name: string }[];
  experience?: unknown;
};

type ProcessCandidate = {
  id: string;
  stage: string;
  ranking?: number;
  compatibility?: number;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    city?: string;
  };
};

type Proceso = {
  id: string;
  title: string;
  status: string;
  city?: string;
  modality?: string;
  description?: string;
  company?: { id: string; name: string };
  jobProfile?: JobProfile;
  candidates?: ProcessCandidate[];
  assessments?: { candidateName: string }[];
};

const ADVANCED_STAGES = new Set(['INTERVIEW', 'ASSESSMENT', 'CLIENT_REVIEW', 'OFFER', 'HIRED']);

function scoreColor(pct: number) {
  if (pct >= 85) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

function scoreTrack(pct: number) {
  if (pct >= 85) return '#E6FAF3';
  if (pct >= 70) return '#FFF7E6';
  return '#FFF0EE';
}

function matchLabel(pct: number) {
  if (pct >= 90) return 'Excelente ajuste';
  if (pct >= 80) return 'Buen ajuste';
  if (pct >= 70) return 'Ajuste alto';
  return 'Ajuste parcial';
}

function normalizeProfile(p: Proceso) {
  const raw = p.jobProfile;
  if (!raw) return { objective: p.description, skills: [] as string[], conditions: [] as string[] };
  const skills = raw.skills ?? raw.competencies?.map((c) => c.name) ?? [];
  const conditions = raw.conditions ?? (
    Array.isArray(raw.experience)
      ? (raw.experience as string[])
      : typeof raw.experience === 'string'
        ? [raw.experience]
        : []
  );
  return { objective: raw.objective ?? p.description, skills, conditions };
}

export default function ProcesoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => dashboardApi.vacancy(id),
  });

  const candidateAction = useMutation({
    mutationFn: ({
      candidateVacancyId,
      body,
    }: {
      candidateVacancyId: string;
      body: { action: 'advance' | 'reject'; reason?: string };
    }) => dashboardApi.updateProcessCandidate(id, candidateVacancyId, body),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['vacancy', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      if (vars.body.action === 'reject') {
        toast('Candidato rechazado');
        setRejectTarget(null);
      } else {
        toast('Candidato avanzado a la siguiente etapa');
      }
    },
    onError: () => toast('No se pudo actualizar el candidato', 'error'),
  });

  const p = data as Proceso | undefined;
  const all = p?.candidates ?? [];
  const active = [...all.filter((c) => c.stage !== 'REJECTED')].sort(
    (a, b) => (b.compatibility ?? 0) - (a.compatibility ?? 0),
  );
  const rejected = all.filter((c) => c.stage === 'REJECTED');

  const testedNames = new Set((p?.assessments ?? []).map((a) => a.candidateName));
  const withTests = active.filter(
    (c) => c.stage === 'ASSESSMENT' || testedNames.has(`${c.candidate.firstName} ${c.candidate.lastName}`),
  ).length;
  const advanced = active.filter((c) => ADVANCED_STAGES.has(c.stage)).length;

  const profile = p ? normalizeProfile(p) : { objective: '', skills: [], conditions: [] };
  const skills = profile.skills;
  const conditions = profile.conditions;

  function advanceCandidate(candidateVacancyId: string) {
    candidateAction.mutate({ candidateVacancyId, body: { action: 'advance' } });
  }

  function rejectCandidate(candidateVacancyId: string, name: string) {
    setRejectTarget({ id: candidateVacancyId, name });
  }

  function confirmReject(reason: string) {
    if (!rejectTarget) return;
    candidateAction.mutate({ candidateVacancyId: rejectTarget.id, body: { action: 'reject', reason } });
  }

  return (
    <div className="space-y-5 max-w-[960px]">
      <RejectModal
        open={!!rejectTarget}
        candidateName={rejectTarget?.name}
        loading={candidateAction.isPending}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
      />
      <Link href="/procesos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a procesos
      </Link>

      {isLoading ? (
        <div className="kova-skeleton h-48 rounded-xl" />
      ) : isError || !p ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar el proceso.</div>
      ) : (
        <>
          {/* Solicitud del cargo */}
          <div className="kova-card p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                {p.company && (
                  <Link
                    href={`/empresas/${p.company.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline mb-2"
                    style={{ color: 'var(--kova-blue)' }}
                  >
                    <Building2 className="w-4 h-4" /> {p.company.name}
                  </Link>
                )}
                <h1 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>
                  {p.title}
                </h1>
                <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {p.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.city}</span>}
                  {p.modality && <span>{p.modality}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Solicitud de contratación</span>
              </div>
            </div>

            {(p.description || profile.objective) && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {profile.objective ?? p.description}
              </p>
            )}

            {skills.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">
                  Habilidades requeridas
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{ color: 'var(--kova-blue)', background: '#EEF2FA' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {conditions.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">
                  Condiciones para ser contratado
                </p>
                <ul className="space-y-1.5">
                  {conditions.map((c) => (
                    <li key={c} className="text-sm text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--kova-green)' }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Resumen del proceso */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryStat label="Candidatos" value={active.length} icon={Users} />
            <SummaryStat label="Con pruebas" value={withTests} icon={ClipboardCheck} />
            <SummaryStat label="Avanzados" value={advanced} icon={ArrowRight} />
            <SummaryStat label="Rechazados" value={rejected.length} icon={XCircle} tone="coral" />
          </div>

          {/* Perfiles compatibles */}
          <div className="kova-card overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--kova-border)' }}>
              <div>
                <h2 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>
                  Perfiles compatibles
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordenados por puntaje de ajuste al cargo · clic en el perfil para ver el informe
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                {active.length} activo{active.length === 1 ? '' : 's'}
              </span>
            </div>

            {active.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                Aún no hay candidatos en este proceso.
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {active.map((c, idx) => (
                  <CandidateRow
                    key={c.id}
                    c={c}
                    rank={idx + 1}
                    busy={candidateAction.isPending}
                    onAdvance={() => advanceCandidate(c.id)}
                    onReject={() => rejectCandidate(c.id, `${c.candidate.firstName} ${c.candidate.lastName}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {rejected.length > 0 && (
            <div className="kova-card overflow-hidden opacity-80">
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--kova-border)' }}>
                <h2 className="font-heading font-bold text-sm text-slate-500">
                  Rechazados ({rejected.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-50">
                {rejected.map((c) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <Link
                      href={`/candidatos/${c.candidate.id}`}
                      className="text-sm text-slate-500 hover:underline"
                    >
                      {c.candidate.firstName} {c.candidate.lastName}
                    </Link>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                      Rechazado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryStat({
  label, value, icon: Icon, tone,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone?: 'coral';
}) {
  const color = tone === 'coral' ? 'var(--kova-coral)' : 'var(--kova-navy)';
  return (
    <div className="kova-card px-4 py-3.5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-slate-400 mb-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="font-heading text-xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

function CandidateRow({
  c, rank, busy, onAdvance, onReject,
}: {
  c: ProcessCandidate;
  rank: number;
  busy: boolean;
  onAdvance: () => void;
  onReject: () => void;
}) {
  const pct = Math.round(c.compatibility ?? 0);
  const color = scoreColor(pct);
  const canAdvance = c.stage !== 'HIRED';
  const initials = `${c.candidate.firstName[0]}${c.candidate.lastName[0]}`;

  return (
    <div className="px-5 py-4 flex flex-wrap items-center gap-4 hover:bg-slate-50/60 transition-colors">
      <span className="w-6 text-center text-xs font-bold text-slate-300 shrink-0">#{rank}</span>

      <Link href={`/candidatos/${c.candidate.id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold group-hover:underline truncate" style={{ color: 'var(--kova-navy)' }}>
            {c.candidate.firstName} {c.candidate.lastName}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {c.candidate.city ?? '—'} · {stageLabel(c.stage)}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 shrink-0 ml-auto hidden sm:block" />
      </Link>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-center w-16">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full font-heading font-bold text-sm"
            style={{ color, background: scoreTrack(pct) }}
          >
            {pct}%
          </div>
          <p className="text-[9px] font-medium mt-1 leading-tight" style={{ color }}>{matchLabel(pct)}</p>
        </div>

        <div className="flex flex-col gap-1.5 w-[108px]">
          <button
            type="button"
            disabled={busy || !canAdvance}
            onClick={onAdvance}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
          >
            <ArrowRight className="w-3.5 h-3.5" /> Avanzar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onReject}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
