'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

const STAGES = ['APPLIED', 'SCREENING', 'CALL', 'INTERVIEW', 'ASSESSMENT', 'ROLE_PLAY', 'CLIENT_REVIEW', 'OFFER', 'HIRED', 'ONBOARDING'];
const LABELS: Record<string, string> = {
  APPLIED: 'Postulados', SCREENING: 'Filtro', CALL: 'Llamada', INTERVIEW: 'Entrevista',
  ASSESSMENT: 'Prueba', ROLE_PLAY: 'Role Play', CLIENT_REVIEW: 'Cliente', OFFER: 'Oferta',
  HIRED: 'Contratado', ONBOARDING: 'Onboarding',
};

export default function AtsPage() {
  const { data: vacancies } = useQuery({ queryKey: ['vacancies'], queryFn: dashboardApi.vacancies });
  const firstVacancy = (vacancies as { id: string }[])?.[0]?.id;
  const { data: candidates } = useQuery({
    queryKey: ['candidates', firstVacancy],
    queryFn: () => dashboardApi.candidates(firstVacancy),
    enabled: !!firstVacancy,
  });

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = ((candidates as { vacancies?: { stage: string; candidate: { firstName: string; lastName: string } }[] }[]) ?? [])
      .filter((c) => c.vacancies?.[0]?.stage === stage);
    return acc;
  }, {} as Record<string, unknown[]>);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>ATS — Pipeline visual</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[220px] kova-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">{LABELS[stage]}</h3>
            <div className="space-y-2">
              {(grouped[stage] as { vacancies?: { candidate: { firstName: string; lastName: string } }[] }[]).map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border text-sm" style={{ borderColor: 'var(--kova-border)' }}>
                  {c.vacancies?.[0]?.candidate.firstName} {c.vacancies?.[0]?.candidate.lastName}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
