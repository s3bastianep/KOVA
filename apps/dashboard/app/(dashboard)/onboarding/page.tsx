'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle, FileText, Video, BookOpen, ClipboardList } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Onboarding = {
  candidate: string;
  role: string;
  progress: number;
  modules: { id: string; title: string; type: string; done: boolean }[];
};

const typeIcon: Record<string, React.ElementType> = {
  Video: Video,
  Documento: FileText,
  Curso: BookOpen,
  Playbook: BookOpen,
  Evaluación: ClipboardList,
};

export default function OnboardingPage() {
  const { data, isLoading } = useQuery({ queryKey: ['onboarding'], queryFn: dashboardApi.onboarding });
  const ob = data as Onboarding | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Onboarding</h1>
        <p className="text-sm text-slate-500">Plan de inducción con seguimiento de progreso.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : !ob || !ob.modules?.length ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay procesos de onboarding activos.</div>
      ) : (
        <>
          <div className="kova-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{ob.candidate}</h3>
                <p className="text-sm text-slate-500">{ob.role}</p>
              </div>
              <span className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-blue)' }}>{ob.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${ob.progress}%`, background: 'var(--kova-blue)' }} />
            </div>
          </div>

          <div className="space-y-3">
            {ob.modules.map((m) => {
              const Icon = typeIcon[m.type] ?? FileText;
              return (
                <div key={m.id} className="kova-card p-4 flex items-center gap-4">
                  {m.done ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}
                  <Icon className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{m.title}</p>
                    <p className="text-xs text-slate-400">{m.type}</p>
                  </div>
                  <span className="text-xs" style={{ color: m.done ? 'var(--kova-green)' : '#94a3b8' }}>{m.done ? 'Completado' : 'Pendiente'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
