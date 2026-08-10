export interface ExecutiveKPIs {
  revenueToday: number;
  revenueTodayChange: string;
  revenueMonth: number;
  revenueMonthChange: string;
  netProfit: number;
  profitMargin: string;
  cashFlow: number;
  pendingInvoicesAmount: number;
  pendingInvoicesCount: number;
  tripsInCourse: number;
  totalRevenue: number;
  totalExpenses: number;
}

export interface IdealDashboardKPIs {
  tripsToday: number;
  tripsInCourse: number;
  tripsCompleted: number;
  activeClients: number;
  availableTrucks: number;
  maintenanceTrucks: number;
  availableDrivers: number;
  monthRevenue: number;
  fuelConsumedLiters: number;
  pendingInvoicesCount: number;
  pendingInvoicesAmount: number;
}

export interface OperationsMetrics {
  scheduled: number;
  inCourse: number;
  completed: number;
  delayed: number;
  cancelled: number;
  totalTrips: number;
  fleetTotal: number;
  fleetAvailable: number;
  fleetInMaintenance: number;
  fleetInTransit: number;
  revenuePerTrip: number;
  averageTransitHours: number;
  totalWeightTons: number;
  activeDrivers: number;
  totalClients: number;
}

export type AlertLevel = 'red' | 'yellow' | 'green';

export interface SmartAlert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  module: string;
  link: string;
  date: string | Date;
}

export interface ActivityItem {
  id: string;
  type: 'FINANCIAL' | 'OPERATION' | 'SYSTEM' | 'GENERAL';
  action: string;
  description: string;
  user: string;
  timestamp: string | Date;
  badgeColor: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  type: 'trip' | 'maintenance' | 'document' | 'payment';
  status?: string;
  details?: string;
}

export type MapStatusColor = 'in_transit' | 'stopped' | 'border' | 'issue';

export interface FleetMapVehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  capacity: string;
  status: string;
  mapStatus: MapStatusColor; // in_transit (Verde), stopped (Azul), border (Laranja), issue (Vermelho)
  driverName: string;
  currentKm: number;
  origin: string;
  destination: string;
  speed: string;
  ignition: 'ON' | 'OFF';
  lastPing: string;
  lat: number;
  lng: number;
  tripCode: string | null;
}

export interface TodayTripItem {
  id: string;
  trackingCode: string;
  origin: string;
  destination: string;
  driverName: string;
  truckPlate: string;
  status: 'Cotação' | 'Confirmada' | 'Planeada' | 'Em carregamento' | 'Em viagem' | 'Na fronteira' | 'Entregue' | 'Concluída';
  departureTime: string;
  cargoType: string;
  clientName: string;
  amount: number;
}

export interface RevenueChartData {
  month: string;
  receita: number;
  despesas: number;
  lucro?: number;
  viagens?: number;
}

export interface DashboardStatsResponse {
  executiveKPIs: ExecutiveKPIs;
  idealKPIs: IdealDashboardKPIs;
  operations: OperationsMetrics;
  smartAlerts: SmartAlert[];
  activityTimeline: ActivityItem[];
  fleetMapVehicles: FleetMapVehicle[];
  todayTrips: TodayTripItem[];
  chartRevenueData: RevenueChartData[];
  calendarEvents: CalendarEventItem[];
  // Backwards compatible fields
  metrics?: any;
  recentPayments?: any[];
  recentClients?: any[];
  recentTrips?: any[];
  recentActivities?: any[];
  notifications?: any[];
}

export interface SearchResultItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  link: string;
  icon: string;
}

export interface GlobalSearchResponse {
  results: SearchResultItem[];
}
