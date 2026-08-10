import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../services/dashboard.api';
import { DashboardStatsResponse } from '../types/dashboard.types';

export interface UseDashboardStatsReturn {
  data: DashboardStatsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardStats();
      setData(response);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err?.message || 'Erro ao carregar dados operacionais e financeiros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}
