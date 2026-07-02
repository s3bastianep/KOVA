'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Building2, MapPin, Clock, Users, ChevronRight,
  Calendar, ClipboardCheck, CheckCircle2, Circle, FileText,
  MessageSquare, CheckSquare, StickyNote, BarChart3, Settings,
  Phone, Mail, ArrowRight, XCircle,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { Tabs } from '@/components/ui/Tabs';
import { processStatusLabel, processProgress } from '@/lib/process-status';
import { stageLabel } from '@/lib/stages';

type Proceso = {
  id: string;
  title: string;
  status: string;
  city?: string;
  modality?: string;
  openedAt?: string;
  requiredDate?: string;
  progress?: number;
  daysElapsed?: number;
  daysRemaining?: number;
  company?: { id: string; name: string };
  stats?: { candidates: number; interviewed: number; finalists: number; hired: number };
  nextActivity?: { title: string; date: string };
  pipelineStages?: { stage: string; label: string; order: number }[];
  candidates?: {
    id: string; stage: string; compatibility?: number;
    candidate: { id: string; firstName: string; lastName: string; email?: string; phone?: string; city?: string };
  }[];
  interviews?: { id: string; candidateName: string; scheduledAt: string; status: string; type: string; score: number | null }[];
  assessments?: { id: string; candidateName: string; type: string; competency: string; score: number; maxScore: number; result: string; durationMinutes?: number }[];
  activities?: { id: string; description: string; createdAt: string }[];
  tasks?: { id: string; title: string; status: string; priority?: string; dueDate?: string }[];
  notes?: { id: string; content: string; author: string; createdAt: string }[];
  documents?: { id: string; name: string; type: string; date: string }[];
  checklist?: { id: string; label: string; done: boolean }[];
};

const TAB_IDS = ['resumen', 'pipeline', 'candidatos', 'entrevistas', 'pruebas', 'actividades', 'tareas', 'notas', 'archivos', 'reportes', 'config'] as const;
type TabId = typeof TAB_IDS[number];

function scoreColor(pct: number) {
  if (pct >= 80) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

export default function ProcesoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<TabId>('resumen');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => dashboardApi.vacancy(id),
  });

  const p = data as Proceso | undefined;
  const progress = p?.progress ?? processProgress(p?.status);
  const candidates = p?.candidates ?? [];

  const pipelineByStage = useMemo(() => {
    const map = new Map<string, typeof candidates>();
    for (const stage of p?.pipelineStages ?? []) {
      map.set(stage.stage, candidates.filter((c) => c.stage === stage.stage));
    }
    for (const c of candidates) {
      if (!map.has(c.stage)) map.set(c.stage, [c]);
    }
    return map;
  }, [p?.pipelineStages, candidates]);

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'pipeline', label: 'Pipeline', count: candidates.length },
    { id: 'candidatos', label: 'Candidatos', count: candidates.length },
    { id: 'entrevistas', label: 'Entrevistas', count: p?.interviews?.length },
    { id: 'pruebas', label: 'Pruebas', count: p?.assessments?.length },
    { id: 'actividades', label: 'Actividades', count: p?.activities?.length },
    { id: 'tareas', label: 'Tareas', count: p?.tasks?.length },
    { id: 'notas', label: 'Notas', count: p?.notes?.length },
    { id: 'archivos', label: 'Archivos', count: p?.documents?.length },
    { id: 'reportes', label: 'Reportes' },
    { id: 'config', label: 'Configuración' },
  ];

  return (
    <div className="space-y-6">
      <Link href="/procesos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Volver a procesos
      </Link>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : isError || !p ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No se pudo cargar el proceso.</div>
      ) : (
        <>
          <div className="kova-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{processStatusLabel(p.status)}</span>
                  {p.company && (
                    <Link href={`/empresas/${p.company.id}`} className="text-xs text-slate-500 hover:underline flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {p.company.name}
                    </Link>
                  )}
                </div>
                <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{p.title}</h1>
                <p className="text-sm text-slate-500 mt-1">{p.city ?? '—'} · {p.modality ?? '—'}</p>
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-bold" style={{ color: 'var(--kova-blue)' }}>{progress}%</p>
                <p className="text-xs text-slate-400">progreso general</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'var(--kova-blue)' }} />
            </div>
          </div>

          <Tabs tabs={tabs} active={tab} onChange={(t) => setTab(t as TabId)} />

          {tab === 'resumen' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Candidatos" value={p.stats?.candidates ?? candidates.length} icon={Users} />
                <StatCard label="Entrevistados" value={p.stats?.interviewed ?? 0} icon={MessageSquare} />
                <StatCard label="Finalistas" value={p.stats?.finalists ?? 0} icon={CheckCircle2} />
                <StatCard label="Días restantes" value={p.daysRemaining ?? '—'} icon={Clock} />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {p.nextActivity && (
                  <div className="kova-card p-5">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">Próxima actividad</h3>
                    <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{p.nextActivity.title}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(p.nextActivity.date).toLocaleString('es-CO')}
                    </p>
                  </div>
                )}
                <div className="kova-card p-5">
                  <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3">Checklist del proceso</h3>
                  <div className="space-y-2">
                    {(p.checklist ?? []).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--kova-green)' }} />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0 text-slate-300" />
                        )}
                        <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-700'}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="kova-card p-5">
                <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3">Pendientes</h3>
                <div className="space-y-2">
                  {(p.tasks ?? []).filter((t) => t.status !== 'COMPLETED').map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm" style={{ color: 'var(--kova-navy)' }}>{t.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{t.priority ?? 'MEDIUM'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kova-card p-5">
                <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3">Actividad reciente</h3>
                <div className="space-y-3">
                  {(p.activities ?? []).slice(0, 5).map((a) => (
                    <div key={a.id} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--kova-blue)' }} />
                      <div>
                        <p style={{ color: 'var(--kova-navy)' }}>{a.description}</p>
                        <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'pipeline' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {(p.pipelineStages ?? []).map((stage) => (
                <div key={stage.stage} className="shrink-0 w-56">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{stage.label}</h3>
                    <span className="text-xs text-slate-400">{(pipelineByStage.get(stage.stage) ?? []).length}</span>
                  </div>
                  <div className="space-y-2 min-h-[120px] p-2 rounded-lg bg-slate-50">
                    {(pipelineByStage.get(stage.stage) ?? []).map((c) => (
                      <Link
                        key={c.id}
                        href={`/candidatos/${c.candidate.id}`}
                        className="block p-3 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow"
                      >
                        <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>
                          {c.candidate.firstName} {c.candidate.lastName}
                        </p>
                        {c.compatibility != null && (
                          <p className="text-xs mt-1" style={{ color: scoreColor(c.compatibility) }}>{c.compatibility}% match</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'candidatos' && (
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <EmptyState text="No hay candidatos en este proceso." />
              ) : (
                candidates.map((c) => (
                  <div key={c.id} className="kova-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--kova-blue)' }}>
                          {c.candidate.firstName[0]}{c.candidate.lastName[0]}
                        </div>
                        <div>
                          <Link href={`/candidatos/${c.candidate.id}`} className="font-semibold hover:underline" style={{ color: 'var(--kova-navy)' }}>
                            {c.candidate.firstName} {c.candidate.lastName}
                          </Link>
                          <p className="text-xs text-slate-500">{c.candidate.city ?? '—'} · {stageLabel(c.stage)}</p>
                          <div className="flex gap-3 mt-1 text-xs text-slate-400">
                            {c.candidate.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.candidate.phone}</span>}
                            {c.candidate.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.candidate.email}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {c.compatibility != null && (
                          <p className="font-heading text-xl font-bold" style={{ color: scoreColor(c.compatibility) }}>{c.compatibility}%</p>
                        )}
                        <p className="text-xs text-slate-400">cumplimiento</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                      <ActionBtn href={`/candidatos/${c.candidate.id}`} label="Ver perfil" />
                      <ActionBtn label="Avanzar" icon={ArrowRight} />
                      <ActionBtn label="Rechazar" icon={XCircle} variant="danger" />
                      <ActionBtn label="Agendar entrevista" icon={Calendar} />
                      <ActionBtn label="Enviar prueba" icon={ClipboardCheck} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'entrevistas' && (
            <div className="space-y-3">
              {(p.interviews ?? []).length === 0 ? <EmptyState text="No hay entrevistas registradas." /> : (
                p.interviews!.map((iv) => (
                  <div key={iv.id} className="kova-card p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{iv.candidateName}</p>
                      <p className="text-xs text-slate-500">{iv.type} · {new Date(iv.scheduledAt).toLocaleString('es-CO')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                        {iv.status === 'COMPLETED' ? 'Completada' : 'Programada'}
                      </span>
                      {iv.score != null && <span className="font-bold" style={{ color: 'var(--kova-green)' }}>{iv.score}/10</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'pruebas' && (
            <div className="space-y-3">
              {(p.assessments ?? []).length === 0 ? <EmptyState text="No hay pruebas registradas." /> : (
                p.assessments!.map((a) => (
                  <div key={a.id} className="kova-card p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{a.candidateName}</p>
                      <p className="text-xs text-slate-500">{a.type} · {a.competency}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold" style={{ color: scoreColor((a.score / a.maxScore) * 100) }}>{a.score}/{a.maxScore}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{a.result}</span>
                      {a.durationMinutes && <span className="text-xs text-slate-400">{a.durationMinutes} min</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'actividades' && (
            <div className="kova-card p-5 space-y-4">
              {(p.activities ?? []).map((a) => (
                <div key={a.id} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--kova-blue)' }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--kova-navy)' }}>{a.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(a.createdAt).toLocaleString('es-CO')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'tareas' && (
            <div className="space-y-3">
              {(p.tasks ?? []).map((t) => (
                <div key={t.id} className="kova-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{t.title}</p>
                      {t.dueDate && <p className="text-xs text-slate-400">Vence: {new Date(t.dueDate).toLocaleDateString('es-CO')}</p>}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{t.status}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'notas' && (
            <div className="space-y-3">
              {(p.notes ?? []).length === 0 ? <EmptyState text="No hay notas." /> : (
                p.notes!.map((n) => (
                  <div key={n.id} className="kova-card p-4">
                    <p className="text-sm text-slate-700">{n.content}</p>
                    <p className="text-xs text-slate-400 mt-2">{n.author} · {new Date(n.createdAt).toLocaleDateString('es-CO')}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'archivos' && (
            <div className="space-y-3">
              {(p.documents ?? []).length === 0 ? <EmptyState text="No hay archivos." /> : (
                p.documents!.map((d) => (
                  <div key={d.id} className="kova-card p-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{d.name}</p>
                      <p className="text-xs text-slate-400">{d.type} · {new Date(d.date).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'reportes' && (
            <div className="kova-card p-8 text-center text-slate-400 text-sm">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Reportes del proceso disponibles próximamente.
            </div>
          )}

          {tab === 'config' && (
            <div className="kova-card p-8 text-center text-slate-400 text-sm">
              <Settings className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Configuración del pipeline, pruebas y automatizaciones.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="kova-card p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide mb-1">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <p className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="kova-card p-8 text-center text-slate-400 text-sm">{text}</div>;
}

function ActionBtn({ label, icon: Icon, href, variant }: { label: string; icon?: React.ElementType; href?: string; variant?: 'danger' }) {
  const cls = `inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
    variant === 'danger' ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
  }`;
  if (href) return <Link href={href} className={cls}>{Icon && <Icon className="w-3 h-3" />}{label}</Link>;
  return <button type="button" className={cls}>{Icon && <Icon className="w-3 h-3" />}{label}</button>;
}
