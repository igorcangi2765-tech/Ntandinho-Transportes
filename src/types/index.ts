export type Role = 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'FINANCEIRO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone: string;
  department: string;
  active: boolean;
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export type OrderStatus = 'NOVO' | 'EM_ANALISE' | 'APROVADO' | 'EM_CURSO' | 'CONCLUIDO' | 'CANCELADO';

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  origin: string;
  destination: string;
  cargoType: string;
  weightTons: number;
  valueMzn: number;
  requestDate: string;
  desiredDate: string;
  status: OrderStatus;
  notes?: string;
  convertedTripId?: string;
}

export type TripStatus = 'AGENDADA' | 'EM_TRANSITO' | 'EM_DESCARGA' | 'CONCLUIDA' | 'CANCELADA';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  status: 'DONE' | 'IN_PROGRESS' | 'PENDING';
}

export interface Trip {
  id: string;
  code: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  origin: string;
  destination: string;
  cargoType: string;
  weightTons: number;
  valueMzn: number;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: TripStatus;
  timeline: TimelineEvent[];
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  nuit: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalTrips: number;
  totalSpentMzn: number;
  rating: number; // 1-5
  status: 'ATIVO' | 'INATIVO';
  registrationDate: string;
  notes?: string;
}

export type VehicleStatus = 'DISPONIVEL' | 'EM_VIAGEM' | 'MANUTENCAO' | 'INATIVO';

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'PREVENTIVA' | 'CORRETIVA';
  description: string;
  costMzn: number;
  mechanicShop: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacityTons: number;
  mileageKm: number;
  status: VehicleStatus;
  insuranceExpiry: string;
  inspectionExpiry: string;
  fuelType: string;
  maintenances: MaintenanceRecord[];
  assignedDriverName?: string;
}

export type DriverStatus = 'DISPONIVEL' | 'EM_VIAGEM' | 'DESCANSO' | 'LICENCA';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  assignedVehiclePlate?: string;
  assignedVehicleId?: string;
  status: DriverStatus;
  rating: number; // 1 to 5
  totalTrips: number;
  hireDate: string;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Aluguer de Caminhões' | 'Transporte de Mercadorias' | 'Carga Geral' | 'Transporte Internacional (SADC)';
  description: string;
  baseRatePerKmMzn: number;
  baseRatePerTonMzn: number;
  active: boolean;
  totalOrdersCount: number;
  popularRoutes: string[];
}

export type InvoiceStatus = 'PAGA' | 'PENDENTE' | 'VENCIDA' | 'CANCELADA';

export interface Invoice {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  tripId?: string;
  issueDate: string;
  dueDate: string;
  amountMzn: number;
  taxMzn: number;
  totalAmountMzn: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  items: { description: string; quantity: number; unitPriceMzn: number; totalMzn: number }[];
}

export interface Budget {
  id: string;
  code: string;
  customerName: string;
  serviceName: string;
  amountMzn: number;
  date: string;
  status: 'RASCUNHO' | 'ENVIADO' | 'ACEITO' | 'REJEITADO';
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'RECEITA' | 'DESPESA';
  category: string; // e.g. "Frete", "Combustível", "Manutenção", "Salários", "Portagem"
  description: string;
  amountMzn: number;
  referenceCode: string;
  status: 'CONCLUIDO' | 'PENDENTE';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ORDER' | 'TRIP' | 'MAINTENANCE' | 'FINANCE' | 'SYSTEM';
}

export interface CompanySettings {
  name: string;
  nuit: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currency: 'MZN' | 'USD' | 'ZAR';
  language: 'pt-MZ' | 'en-US';
  autoApproveOrdersThresholdMzn: number;
  emailNotifications: boolean;
  smsAlerts: boolean;
}
