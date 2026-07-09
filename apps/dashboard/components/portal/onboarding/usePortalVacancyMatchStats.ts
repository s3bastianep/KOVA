'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api';
import {
  aggregateVacancyMatchStats,
  type PortalVacancyMatchStats,
} from '@/lib/portal-vacancies';

export function usePortalVacancyMatchStats(refreshKey: string | number | null) {
  const [stats, setStats] = useState<PortalVacancyMatchStats | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portalApi.vacantes();
      setStats(aggregateVacancyMatchStats(data.vacantes));
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshKey === null) {
      setStats(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [refresh, refreshKey]);

  return { stats, loading, refresh };
}
