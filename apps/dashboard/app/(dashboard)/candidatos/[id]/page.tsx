'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, StickyNote, Calendar, Award } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';

type Candidate = {
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
  vacancyId?: string;
  companyName?: string;
  profileSummary?: string;
  experiences?: { id: string; company: string; role: string; period: string; achievement: string }[];
  competencies?: { name: string; score: number }[];
  notes?: { id: string; text: string; author: string; date: string }[];
  interviews?: { id: string; title: string; status: string; scheduledAt?: string; score?: number }[];
  stageHistory?: { from: string; to: string; date: string }[];
  compatibilityBreakdown?: { label: string; met: boolean; earned: number; max: number; detail: string }[];
};

export default function CandidatoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => dashboardApi.candidate(id),
  });

  const c = data as Candidate | undefined;

  return (
    <div className="space-y-6">
      <Link href="/candidatos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a candidatos
      </Link>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : isError || !c ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar el candidato.</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg text-white" style={{ background: 'var(--kova-blue)' }}>
              {c.firstName[0]}{c.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>
                {c.firstName} {c.lastName}
              </h1>
              <p className="text-sm text-slate-500">
                {stageLabel(c.currentStage)} · {c.status}
                {c.source ? ` · Fuente: ${c.source}` : ''}
              </p>
              {c.vacancyTitle && (
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--kova-blue)' }}>
                  <Briefcase className="w-3.5 h-3.5" />
                  {c.vacancyTitle}
                  {c.companyName ? ` · ${c.companyName}` : ''}
                </p>
              )}
            </div>
            <div className="flex gap-4 ml-auto">
              {c.ranking != null && (
                <div className="text-center">
                  <span className="font-heading font-bold text-xl" style={{ color: 'var(--kova-navy)' }}>#{c.ranking}</span>
                  <p className="text-xs text-slate-400">ranking</p>
                </div>
              )}
              {c.compatibility != null && (
                <div className="text-center">
                  <span className="font-heading font-bold text-2xl" style={{ color: 'var(--kova-green)' }}>{Math.round(c.compatibility)}%</span>
                  <p className="text-xs text-slate-400">compatibilidad</p>
                </div>
              )}
            </div>
          </div>

          {c.compatibilityBreakdown && c.compatibilityBreakdown.length > 0 && (
            <div className="kova-card p-6">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Compatibilidad automática (reglas)</h2>
              <div className="space-y-2">
                {c.compatibilityBreakdown.map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-sm">
                    <span style={{ color: 'var(--kova-navy)' }}>{row.label}</span>
                    <span>{row.met ? '✔' : '✘'} {row.earned}/{row.max}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-semibold" style={{ color: 'var(--kova-navy)' }}>
                  <span>TOTAL</span>
                  <span>{Math.round(c.compatibility ?? 0)}%</span>
                </div>
              </div>
            </div>
          )}

          {c.profileSummary && (
            <div className="kova-card p-5">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-2">Resumen del perfil</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{c.profileSummary}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="kova-card p-6 space-y-3">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Contacto</h2>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Mail className="w-4 h-4 text-slate-400" /> {c.email ?? '—'}</p>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><Phone className="w-4 h-4 text-slate-400" /> {c.phone ?? '—'}</p>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}><MapPin className="w-4 h-4 text-slate-400" /> {c.city ?? '—'}</p>
            </div>

            <div className="kova-card p-6 lg:col-span-2">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Competencias evaluadas</h2>
              {c.competencies?.length ? (
                <div className="space-y-3">
                  {c.competencies.map((comp) => (
                    <div key={comp.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--kova-navy)' }}>{comp.name}</span>
                        <span className="text-slate-400">{comp.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${comp.score}%`, background: 'var(--kova-green)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Sin competencias evaluadas aún.</p>
              )}
            </div>
          </div>

          <div className="kova-card p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Experiencia laboral</h2>
            {c.experiences?.length ? (
              <div className="space-y-4">
                {c.experiences.map((e) => (
                  <div key={e.id} className="flex gap-3">
                    <Briefcase className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{e.role} · {e.company}</p>
                      <p className="text-xs text-slate-400">{e.period}</p>
                      {e.achievement && <p className="text-sm text-slate-600 mt-1">{e.achievement}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin experiencia registrada.</p>
            )}
          </div>

          {c.interviews && c.interviews.length > 0 && (
            <div className="kova-card p-6">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Entrevistas</h2>
              <div className="space-y-3">
                {c.interviews.map((iv) => (
                  <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{iv.title}</p>
                        <p className="text-xs text-slate-400">
                          {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleDateString() : '—'} · {iv.status}
                        </p>
                      </div>
                    </div>
                    {iv.score != null && (
                      <span className="font-semibold text-sm" style={{ color: 'var(--kova-green)' }}>{iv.score}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.stageHistory && c.stageHistory.length > 0 && (
            <div className="kova-card p-6">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Historial en pipeline</h2>
              <div className="space-y-2">
                {c.stageHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Award className="w-4 h-4 text-slate-400 shrink-0" />
                    <span style={{ color: 'var(--kova-navy)' }}>
                      {stageLabel(h.from)} → {stageLabel(h.to)}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">{new Date(h.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="kova-card p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500 mb-4">Notas del consultor</h2>
            {c.notes?.length ? (
              <div className="space-y-3">
                {c.notes.map((n) => (
                  <div key={n.id} className="flex gap-3 p-3 rounded-lg bg-slate-50">
                    <StickyNote className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.author} · {new Date(n.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin notas registradas.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
