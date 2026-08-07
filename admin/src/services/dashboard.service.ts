import { apiClient } from './apiClient';
import { DashboardMetrics } from '../types/dashboard.types';

const defaultMetrics: DashboardMetrics = {
  totalRevenue: 4850000,
  pendingRevenue: 1200000,
  activeTrips: 28,
  pendingQuotations: 12,
  fleetStatus: {
    OPERACIONAL: 24,
    EM_VIAGEM: 10,
    MANUTENCAO: 3,
    TOTAL: 37,
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 3200000, expenses: 1400000 },
    { month: 'Fev', revenue: 3800000, expenses: 1600000 },
    { month: 'Mar', revenue: 4100000, expenses: 1800000 },
    { month: 'Abr', revenue: 4500000, expenses: 1900000 },
    { month: 'Mai', revenue: 4800000, expenses: 2100000 },
    { month: 'Jun', revenue: 5200000, expenses: 2200000 },
  ],
  priorityTrips: [
    {
      id: 'trip-1',
      code: '#C849',
      origin: 'Maputo',
      destination: 'Nampula',
      cargoType: 'Container 40ft',
      vehicle: 'Volvo FH16 (MZ-88-21)',
      driver: 'João Mucavel',
      status: 'EM_ROTA',
      progressPercentage: 75,
    },
    {
      id: 'trip-2',
      code: '#C850',
      origin: 'Beira',
      destination: 'Lilongwe (Malawi)',
      cargoType: 'Carga Geral / Maquinaria',
      vehicle: 'Scania R500 (MZ-12-90)',
      driver: 'Mateus Sitoe',
      status: 'FRONTEIRA',
      progressPercentage: 45,
    },
    {
      id: 'trip-3',
      code: '#C851',
      origin: 'Nampula',
      destination: 'Pemba',
      cargoType: 'Combustível / Tanque',
      vehicle: 'MAN TGX (MZ-44-01)',
      driver: 'Carlos Tembe',
      status: 'CARREGANDO',
      progressPercentage: 10,
    },
  ],
};

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await apiClient<{ success: boolean; data: DashboardMetrics }>(
        '/api/admin/analytics/dashboard'
      );
      if (res.success && res.data) {
        return res.data;
      }
      return defaultMetrics;
    } catch {
      // Graceful fallback for preview / offline mode
      return defaultMetrics;
    }
  },
};
