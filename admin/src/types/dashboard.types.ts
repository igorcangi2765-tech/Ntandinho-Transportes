export interface FleetStatus {
  OPERACIONAL: number;
  EM_VIAGEM: number;
  MANUTENCAO: number;
  TOTAL: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface PriorityTrip {
  id: string;
  code: string;
  origin: string;
  destination: string;
  cargoType: string;
  vehicle: string;
  driver: string;
  status: 'EM_ROTA' | 'FRONTEIRA' | 'CARREGANDO' | 'CONCLUIDO';
  progressPercentage: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  pendingRevenue: number;
  activeTrips: number;
  pendingQuotations: number;
  fleetStatus: FleetStatus;
  monthlyRevenue: RevenueDataPoint[];
  priorityTrips: PriorityTrip[];
}
