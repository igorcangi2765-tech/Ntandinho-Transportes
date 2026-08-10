import { Role, Module } from '../permissions/rbacConfig';

export interface SupabaseUser {
  id: string; // uuid
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  avatar_url?: string;
  role: Role;
  department: string;
  status: 'ATIVO' | 'INATIVO';
  last_login?: string;
}

export interface SupabaseRolePermission {
  id: string;
  role: Role;
  module: Module;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface SupabaseClient {
  id: string;
  created_at: string;
  name: string;
  company_name: string;
  nuit: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  total_trips: number;
  total_spent_mzn: number;
  rating: number;
  status: 'ATIVO' | 'INATIVO';
  notes?: string;
}

export interface SupabaseVehicle {
  id: string;
  created_at: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacity_tons: number;
  mileage_km: number;
  status: 'DISPONIVEL' | 'EM_VIAGEM' | 'MANUTENCAO' | 'INATIVO';
  insurance_expiry: string;
  inspection_expiry: string;
  fuel_type: string;
  assigned_driver_name?: string;
}

export interface SupabaseDriver {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  assigned_vehicle_plate?: string;
  assigned_vehicle_id?: string;
  status: 'DISPONIVEL' | 'EM_VIAGEM' | 'DESCANSO' | 'LICENCA';
  rating: number;
  total_trips: number;
  hire_date: string;
  avatar_url: string;
}

export interface SupabaseOrder {
  id: string;
  created_at: string;
  code: string;
  client_id: string;
  client_name: string;
  service_type: string;
  origin: string;
  destination: string;
  cargo_type: string;
  weight_tons: number;
  value_mzn: number;
  request_date: string;
  desired_date: string;
  status: 'NOVO' | 'EM_ANALISE' | 'APROVADO' | 'EM_CURSO' | 'CONCLUIDO' | 'CANCELADO';
  notes?: string;
  converted_trip_id?: string;
}

export interface SupabaseTrip {
  id: string;
  created_at: string;
  code: string;
  order_id?: string;
  client_id: string;
  client_name: string;
  driver_id: string;
  driver_name: string;
  vehicle_id: string;
  vehicle_plate: string;
  origin: string;
  destination: string;
  cargo_type: string;
  weight_tons: number;
  value_mzn: number;
  start_date: string;
  estimated_end_date: string;
  actual_end_date?: string;
  status: 'AGENDADA' | 'EM_TRANSITO' | 'EM_DESCARGA' | 'CONCLUIDA' | 'CANCELADA';
  timeline: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    location: string;
    status: 'DONE' | 'IN_PROGRESS' | 'PENDING';
  }[];
  notes?: string;
}

export interface SupabaseInvoice {
  id: string;
  created_at: string;
  code: string;
  client_id: string;
  client_name: string;
  trip_id?: string;
  issue_date: string;
  due_date: string;
  amount_mzn: number;
  tax_mzn: number;
  total_amount_mzn: number;
  status: 'PAGA' | 'PENDENTE' | 'VENCIDA' | 'CANCELADA';
  payment_method?: string;
  items: { description: string; quantity: number; unitPriceMzn: number; totalMzn: number }[];
}

export interface SupabaseAuditLog {
  id: string;
  created_at: string;
  user_id: string;
  user_name: string;
  user_role: Role;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  device_info: string;
  browser_info: string;
}
