import { DashboardStatsResponse, GlobalSearchResponse } from '../types/dashboard.types';

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const res = await fetch('/api/dashboard/stats', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error('Falha ao obter estatísticas do dashboard.');
  }
  return res.json();
}

export async function searchGlobal(query: string): Promise<GlobalSearchResponse> {
  if (!query || query.trim().length < 2) {
    return { results: [] };
  }
  const encodedQuery = encodeURIComponent(query.trim());
  const res = await fetch(`/api/dashboard/search?q=${encodedQuery}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error('Falha ao realizar pesquisa.');
  }
  return res.json();
}
