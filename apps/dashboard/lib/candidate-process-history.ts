import { stageLabel } from '@/lib/stages';
import { processStatusLabel } from '@/lib/process-status';

export type CandidateProcessHistoryItem = {
  candidateVacancyId: string;
  vacancyId: string;
  vacancyTitle: string;
  companyId?: string;
  companyName?: string;
  vacancyStatus: string;
  vacancyStatusLabel: string;
  stage: string;
  stageLabel: string;
  ranking?: number | null;
  startedAt: string;
  updatedAt: string;
  isCurrent: boolean;
};

type VacancyLink = {
  id: string;
  stage: string;
  ranking?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  vacancy: {
    id: string;
    title: string;
    status: string;
    company?: { id: string; name: string } | null;
  };
};

export function mapCandidateProcessHistory(links: VacancyLink[]): CandidateProcessHistoryItem[] {
  return [...links]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((link, index) => ({
      candidateVacancyId: link.id,
      vacancyId: link.vacancy.id,
      vacancyTitle: link.vacancy.title,
      companyId: link.vacancy.company?.id,
      companyName: link.vacancy.company?.name ?? undefined,
      vacancyStatus: link.vacancy.status,
      vacancyStatusLabel: processStatusLabel(link.vacancy.status),
      stage: link.stage,
      stageLabel: stageLabel(link.stage),
      ranking: link.ranking,
      startedAt: new Date(link.createdAt).toISOString(),
      updatedAt: new Date(link.updatedAt).toISOString(),
      isCurrent: index === 0,
    }));
}
