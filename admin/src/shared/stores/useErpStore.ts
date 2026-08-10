import { create } from 'zustand';
import { useNotificationStore } from './useNotificationStore';

export interface CustomerItem {
  id: string;
  name: string;
  nuit: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  isCorporate: boolean;
  creditLimitMzn: number;
  totalSpentMzn: number;
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
  lastActivity?: string;
  notes?: string;
}

export interface QuotationItem {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  origin: string;
  destination: string;
  cargoDescription: string;
  weightKg: number;
  priceSubtotal: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
  validUntil: string;
  status: 'RASCUNHO' | 'EM_ANALISE' | 'ENVIADA' | 'ACEITE' | 'RECUSADA' | 'EXPIRADA' | 'FATURADO';
  createdAt: string;
}

export interface BookingItem {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  origin: string;
  destination: string;
  scheduledDate: string;
  cargoDetails: string;
  totalPriceMzn: number;
  status: 'NOVA' | 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
  createdAt: string;
}

export interface VehicleItem {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  category: 'Camião Pesado' | 'Semi-Reboque' | 'Camião Basculante' | 'Carrinha Distribuição';
  status: 'OPERACIONAL' | 'EM_VIAGEM' | 'MANUTENCAO' | 'INDISPONIVEL';
  mileageKm: number;
  driverName?: string;
  isAvailable: boolean;
  nextOilChangeKm: number;
  licenseExpiry: string;
  insuranceExpiry: string;
  inspectionExpiry: string;
  tyreInspectionStatus: 'BOM' | 'ATENCAO' | 'SUBSTITUIR';
}

export interface DriverItem {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpDate: string;
  passportExpDate: string;
  sadcVisaExpDate: string;
  phone: string;
  assignedVehiclePlate?: string;
  status: 'DISPONIVEL' | 'EM_VIAGEM' | 'INDISPONIVEL';
  isAvailable: boolean;
  docStatus: 'VALIDO' | 'ALERTA_EXPIRACAO' | 'EXPIRADO';
  ratingScore: number;
  totalTripsCompleted: number;
}

export interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchCity: 'Matola (Sede)' | 'Beira (Corredor)' | 'Nacala (Porto)';
  position: string;
  department: 'Direcção' | 'Operações' | 'Frota' | 'Financeiro' | 'Comercial';
  role: 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'FINANCEIRO' | 'RESPONSAVEL_FROTA' | 'MOTORISTA';
  isActive: boolean;
  hireDate: string;
}

export interface FuelLogItem {
  id: string;
  date: string;
  vehiclePlate: string;
  driverName: string;
  stationName: 'Petromoc' | 'Galp' | 'TotalEnergies' | 'Engen';
  liters: number;
  pricePerLiterMzn: number;
  totalCostMzn: number;
  currentKm: number;
  consumptionL100Km: number;
}

export interface MaintenanceLogItem {
  id: string;
  date: string;
  vehiclePlate: string;
  type: 'TROCA_OLEO' | 'SUBSTITUICAO_PNEUS' | 'REVISAO_TRAVOES' | 'INSPECAO_GERAL' | 'REPARACAO_MOTOR';
  category: 'PREVENTIVA' | 'CORRECTIVA';
  description: string;
  costMzn: number;
  kmAtService: number;
  workshop: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

export interface TripItem {
  id: string;
  tripNumber: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  origin: string;
  destination: string;
  vehicleId?: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId?: string;
  driverName: string;
  cargoDescription: string;
  weightKg: number;
  departureTime?: string;
  etaTime?: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'EM_PREPARACAO' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'ATRASADA';
  paymentStatus: 'PAGO' | 'PENDENTE' | 'PAGO_PARCIAL';
  totalPriceMzn: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  tripId?: string;
  customerId: string;
  customerName: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  status: 'PENDENTE' | 'PAGO_PARCIAL' | 'PAGO' | 'VENCIDA' | 'CANCELADA';
  dueDate: string;
  createdAt: string;
}

export interface PaymentItem {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  customerName: string;
  amountMzn: number;
  method: 'TRANSFERENCIA_BANCARIA' | 'MPESA' | 'EMOLA' | 'NUMERARIO' | 'CHEQUE';
  referenceNo: string;
  paidAt: string;
  bankName?: string;
}

export interface ExpenseItem {
  id: string;
  category: 'COMBUSTIVEL' | 'MANUTENCAO' | 'OPERACIONAL' | 'PORTAGEM' | 'DIARIA_MOTORISTA' | 'ALIMENTACAO' | 'OUTROS';
  description: string;
  vehiclePlate?: string;
  tripNumber?: string;
  amountMzn: number;
  date: string;
  receiptNo?: string;
  registeredBy: string;
}

export interface RouteItem {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estDurationHours: number;
  borderCheckpoints: string;
  basePriceMzn: number;
  totalTripsCount: number;
  totalRevenueMzn: number;
  status: 'ATIVA' | 'INATIVA';
}

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: 'Aluguer de Camiões' | 'Transporte de Mercadorias' | 'Logística Nacional' | 'Transporte Internacional SADC';
  description: string;
  pricePerKmMzn: number;
  pricePerDayMzn?: number;
  isActive: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  entityType: 'EMPRESA' | 'VIATURA' | 'MOTORISTA' | 'CLIENTE';
  entityName: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALIDO' | 'PROXIMO_VENCIMENTO' | 'EXPIRADO';
  fileCategory: 'Seguros' | 'Licenciamento' | 'Inspecções' | 'Contratos' | 'Certificados';
}

export interface AuditLogItem {
  id: string;
  userName: string;
  action: string;
  module: string;
  recordRef: string;
  timestamp: string;
  details: string;
}

export interface CompanyProfile {
  name: string;
  nomeComercial: string;
  nomeJuridico: string;
  slogan: string;
  address: string;
  city: string;
  province: string;
  country: string;
  phones: string[];
  emails: string[];
  website: string;
  whatsapp: string;
  operationArea: string;
  mission: string;
  vision: string;
  values: string[];
  institutionalMetrics: {
    experienceYears: string;
    fleetCount: string;
    tripsCompleted: string;
    satisfiedClients: string;
  };
  nuit?: string;
  bankAccountDetails?: string;
  taxRegistrationDetails?: string;
  logoUrl?: string;
}

interface ErpState {
  companyProfile: CompanyProfile;
  customers: CustomerItem[];
  quotations: QuotationItem[];
  bookings: BookingItem[];
  vehicles: VehicleItem[];
  drivers: DriverItem[];
  employees: EmployeeItem[];
  trips: TripItem[];
  invoices: InvoiceItem[];
  payments: PaymentItem[];
  expenses: ExpenseItem[];
  fuelLogs: FuelLogItem[];
  maintenanceLogs: MaintenanceLogItem[];
  routes: RouteItem[];
  services: ServiceItem[];
  documents: DocumentItem[];
  auditLogs: AuditLogItem[];

  // Global Quick Actions
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  addCustomer: (customer: Omit<CustomerItem, 'id' | 'createdAt' | 'status' | 'totalSpentMzn'>) => void;
  addQuotation: (quotation: Omit<QuotationItem, 'id' | 'quotationNumber' | 'createdAt' | 'taxAmount' | 'totalPrice' | 'status'>) => void;
  updateQuotationStatus: (quotationId: string, status: QuotationItem['status']) => void;
  addBooking: (booking: Omit<BookingItem, 'id' | 'bookingNumber' | 'createdAt' | 'status'>) => void;
  confirmBooking: (bookingId: string) => void;
  addVehicle: (vehicle: Omit<VehicleItem, 'id' | 'status' | 'isAvailable' | 'tyreInspectionStatus'>) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleItem['status']) => void;
  addDriver: (driver: Omit<DriverItem, 'id' | 'status' | 'isAvailable' | 'docStatus' | 'ratingScore' | 'totalTripsCompleted'>) => void;
  updateDriverStatus: (driverId: string, status: DriverItem['status']) => void;
  addFuelLog: (log: Omit<FuelLogItem, 'id' | 'date' | 'consumptionL100Km'>) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLogItem, 'id' | 'date' | 'status'>) => void;
  addTrip: (trip: Omit<TripItem, 'id' | 'tripNumber' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  updateTripStatus: (tripId: string, newStatus: TripItem['status']) => void;
  assignDriverAndVehicle: (tripId: string, vehicleId: string, driverId: string) => void;
  addInvoice: (invoice: Omit<InvoiceItem, 'id' | 'invoiceNumber' | 'createdAt' | 'paidAmount' | 'status'>) => void;
  payInvoice: (invoiceId: string, amountMzn: number, method: PaymentItem['method'], referenceNo: string) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'date'>) => void;
  addDocument: (document: Omit<DocumentItem, 'id' | 'status'>) => void;
  addAuditLog: (action: string, module: string, recordRef: string, details: string) => void;
  convertQuotationToBooking: (quotationId: string) => void;
  convertBookingToTrip: (bookingId: string) => void;
  deleteCustomer: (customerId: string) => void;
  updateCustomer: (id: string, data: Partial<CustomerItem>) => void;
  deleteVehicle: (vehicleId: string) => void;
  updateVehicle: (id: string, data: Partial<VehicleItem>) => void;
  deleteDriver: (driverId: string) => void;
  updateDriver: (id: string, data: Partial<DriverItem>) => void;
  deleteTrip: (tripId: string) => void;
  updateTrip: (id: string, data: Partial<TripItem>) => void;
  deleteQuotation: (id: string) => void;
  updateQuotation: (id: string, data: Partial<QuotationItem>) => void;
  deleteBooking: (id: string) => void;
  updateBooking: (id: string, data: Partial<BookingItem>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoice: (id: string, data: Partial<InvoiceItem>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, data: Partial<ExpenseItem>) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, data: Partial<DocumentItem>) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, data: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addRoute: (route: Omit<RouteItem, 'id' | 'totalTripsCount' | 'totalRevenueMzn' | 'status'>) => void;
  updateRoute: (id: string, data: Partial<RouteItem>) => void;
  deleteRoute: (id: string) => void;
}

export const useErpStore = create<ErpState>((set, get) => ({
  companyProfile: {
    name: "Transportes e Logística N' Tandinho Lda",
    nomeComercial: "N' Tandinho",
    nomeJuridico: "Transportes e Logística N' Tandinho Lda",
    slogan: "Transporte Seguro, Eficiente e Confiável",
    address: "Av. Eduardo Mondlane, Edifício Central",
    city: "Nampula",
    province: "Nampula",
    country: "Moçambique",
    phones: ["+258 84 000 0000", "+258 82 000 0000"],
    emails: ["comercial@ntandinho.co.mz", "geral@ntandinho.co.mz"],
    website: "https://ntandinho.zyphtech.com",
    whatsapp: "+258 84 000 0000",
    operationArea: "Nacional (Moçambique) & Internacional (Região da SADC)",
    mission: "Providenciar soluções logísticas e de transporte seguras, eficientes e pontuais, superando as expectativas dos nossos clientes e contribuindo para o desenvolvimento económico da região.",
    vision: "Ser a empresa de referência no sector de transportes e logística em Moçambique, reconhecida pela fiabilidade, inovação e excelência no serviço.",
    values: ["Segurança", "Integridade", "Compromisso", "Valorização humana", "Responsabilidade ambiental"],
    institutionalMetrics: {
      experienceYears: "+10 anos de experiência",
      fleetCount: "+50 viaturas na frota",
      tripsCompleted: "+10k viagens realizadas",
      satisfiedClients: "+500 clientes satisfeitos",
    },
    nuit: "Aguardando preenchimento fiscal oficial",
    bankAccountDetails: "Aguardando cadastro de conta bancária",
    taxRegistrationDetails: "Aguardando registro de licenças operacionais",
    logoUrl: "",
  },

  customers: [
    {
      id: 'CLI-001',
      name: 'Cervejas de Moçambique (CDM S.A.)',
      nuit: '400192834',
      email: 'logistica@cdm.co.mz',
      phone: '+258 21 480 100',
      address: 'Av. 25 de Setembro, Nº 1020',
      city: 'Maputo',
      isCorporate: true,
      creditLimitMzn: 5000000,
      totalSpentMzn: 4850000,
      status: 'ATIVO',
      createdAt: '2026-01-15',
      lastActivity: '2026-08-07',
    },
    {
      id: 'CLI-002',
      name: 'Mozal S.A.',
      nuit: '400551920',
      email: 'supply@mozal.com',
      phone: '+258 21 720 000',
      address: 'Parque Industrial de Beluluane',
      city: 'Matola',
      isCorporate: true,
      creditLimitMzn: 10000000,
      totalSpentMzn: 8900000,
      status: 'ATIVO',
      createdAt: '2026-02-10',
      lastActivity: '2026-08-06',
    },
    {
      id: 'CLI-003',
      name: 'Vulcan Minerals Moçambique',
      nuit: '400998811',
      email: 'transporte@vulcan.co.mz',
      phone: '+258 25 220 900',
      address: 'Mina de Carvão de Moatize',
      city: 'Tete',
      isCorporate: true,
      creditLimitMzn: 8000000,
      totalSpentMzn: 6700000,
      status: 'ATIVO',
      createdAt: '2026-03-01',
      lastActivity: '2026-08-05',
    },
    {
      id: 'CLI-004',
      name: 'Coca-Cola Sabco Moçambique',
      nuit: '400281920',
      email: 'expedicao@cocacola.co.mz',
      phone: '+258 21 720 300',
      address: 'Bairro da Machava',
      city: 'Matola',
      isCorporate: true,
      creditLimitMzn: 4000000,
      totalSpentMzn: 3200000,
      status: 'ATIVO',
      createdAt: '2026-03-15',
      lastActivity: '2026-08-04',
    },
    {
      id: 'CLI-005',
      name: 'Cimentos de Moçambique S.A.',
      nuit: '400334812',
      email: 'distribuicao@cimentos.co.mz',
      phone: '+258 21 350 200',
      address: 'Fábrica da Matola',
      city: 'Matola',
      isCorporate: true,
      creditLimitMzn: 6000000,
      totalSpentMzn: 4100000,
      status: 'ATIVO',
      createdAt: '2026-04-02',
      lastActivity: '2026-08-01',
    },
    {
      id: 'CLI-006',
      name: 'Fazendas Agrícolas de Nampula Lda',
      nuit: '400551928',
      email: 'compras@fazendasnampula.co.mz',
      phone: '+258 26 218 440',
      address: 'Estrada Nacional N1, Km 12',
      city: 'Nampula',
      isCorporate: true,
      creditLimitMzn: 2500000,
      totalSpentMzn: 1850000,
      status: 'ATIVO',
      createdAt: '2026-04-12',
      lastActivity: '2026-07-29',
    },
    {
      id: 'CLI-007',
      name: 'Matias Manuel Nhaca',
      nuit: '109884912',
      email: 'm.nhaca@gmail.com',
      phone: '+258 84 123 4490',
      address: 'Bairro Triunfo',
      city: 'Maputo',
      isCorporate: false,
      creditLimitMzn: 150000,
      totalSpentMzn: 85000,
      status: 'ATIVO',
      createdAt: '2026-05-18',
      lastActivity: '2026-08-02',
    },
  ],

  quotations: [
    {
      id: 'COT-01',
      quotationNumber: 'COT-2026-001',
      customerId: 'CLI-001',
      customerName: 'Cervejas de Moçambique (CDM S.A.)',
      origin: 'Maputo',
      destination: 'Nampula',
      cargoDescription: 'Paletes de Cerveja 2M em Container 40ft',
      weightKg: 28000,
      priceSubtotal: 350000,
      taxAmount: 56000,
      totalPrice: 406000,
      currency: 'MZN',
      validUntil: '2026-08-20',
      status: 'ACEITE',
      createdAt: '2026-08-01',
    },
    {
      id: 'COT-02',
      quotationNumber: 'COT-2026-002',
      customerId: 'CLI-002',
      customerName: 'Mozal S.A.',
      origin: 'Matola (Beluluane)',
      destination: 'Porto da Beira',
      cargoDescription: 'Lingotes de Alumínio (40 Toneladas)',
      weightKg: 40000,
      priceSubtotal: 480000,
      taxAmount: 76800,
      totalPrice: 556800,
      currency: 'MZN',
      validUntil: '2026-08-25',
      status: 'ENVIADA',
      createdAt: '2026-08-04',
    },
    {
      id: 'COT-03',
      quotationNumber: 'COT-2026-003',
      customerId: 'CLI-003',
      customerName: 'Vulcan Minerals Moçambique',
      origin: 'Moatize (Tete)',
      destination: 'Lilongwe (Malawi)',
      cargoDescription: 'Maquinaria Mineira e Peças Pesadas',
      weightKg: 35000,
      priceSubtotal: 620000,
      taxAmount: 99200,
      totalPrice: 719200,
      currency: 'MZN',
      validUntil: '2026-08-15',
      status: 'EM_ANALISE',
      createdAt: '2026-08-06',
    },
    {
      id: 'COT-04',
      quotationNumber: 'COT-2026-004',
      customerId: 'CLI-004',
      customerName: 'Coca-Cola Sabco Moçambique',
      origin: 'Matola',
      destination: 'Pemba (Cabo Delgado)',
      cargoDescription: 'Refrigerantes em Paletes (28 Toneladas)',
      weightKg: 28000,
      priceSubtotal: 510000,
      taxAmount: 81600,
      totalPrice: 591600,
      currency: 'MZN',
      validUntil: '2026-08-18',
      status: 'RASCUNHO',
      createdAt: '2026-08-07',
    },
  ],

  bookings: [
    {
      id: 'RES-101',
      bookingNumber: 'RES-2026-01',
      customerId: 'CLI-001',
      customerName: 'Cervejas de Moçambique (CDM S.A.)',
      serviceName: 'Transporte de Mercadorias (Contentores)',
      origin: 'Maputo',
      destination: 'Nampula',
      scheduledDate: '2026-08-09',
      cargoDetails: '2 Camiões Volvo FH16 de 32 Toneladas cada',
      totalPriceMzn: 812000,
      status: 'CONFIRMADA',
      createdAt: '2026-08-05',
    },
    {
      id: 'RES-102',
      bookingNumber: 'RES-2026-02',
      customerId: 'CLI-005',
      customerName: 'Cimentos de Moçambique S.A.',
      serviceName: 'Aluguer de Camião Basculante',
      origin: 'Matola',
      destination: 'Beira',
      scheduledDate: '2026-08-10',
      cargoDetails: 'Cimento Ensacado 40 Toneladas',
      totalPriceMzn: 490000,
      status: 'PENDENTE',
      createdAt: '2026-08-07',
    },
    {
      id: 'RES-103',
      bookingNumber: 'RES-2026-03',
      customerId: 'CLI-006',
      customerName: 'Fazendas Agrícolas de Nampula Lda',
      serviceName: 'Logística Nacional',
      origin: 'Nampula',
      destination: 'Maputo',
      scheduledDate: '2026-08-12',
      cargoDetails: 'Produtos Agrícolas a Granel',
      totalPriceMzn: 380000,
      status: 'NOVA',
      createdAt: '2026-08-08',
    },
  ],

  vehicles: [
    {
      id: 'veh-1',
      plateNumber: 'ABM-849-MC',
      make: 'Volvo',
      model: 'FH16 750 HP (3 Eixos)',
      year: 2024,
      category: 'Camião Pesado',
      status: 'EM_VIAGEM',
      mileageKm: 124500,
      driverName: 'João Mucavel',
      isAvailable: false,
      nextOilChangeKm: 130000,
      licenseExpiry: '2027-04-15',
      insuranceExpiry: '2026-11-30',
      inspectionExpiry: '2026-10-15',
      tyreInspectionStatus: 'BOM',
    },
    {
      id: 'veh-2',
      plateNumber: 'AFK-302-MC',
      make: 'Scania',
      model: 'R500 V8 Streamline',
      year: 2023,
      category: 'Camião Pesado',
      status: 'EM_VIAGEM',
      mileageKm: 88200,
      driverName: 'Mateus Sitoe',
      isAvailable: false,
      nextOilChangeKm: 90000,
      licenseExpiry: '2027-02-10',
      insuranceExpiry: '2026-12-15',
      inspectionExpiry: '2026-09-01',
      tyreInspectionStatus: 'ATENCAO',
    },
    {
      id: 'veh-3',
      plateNumber: 'AGG-119-MC',
      make: 'DAF',
      model: 'XF 530 Super Space Cab',
      year: 2025,
      category: 'Camião Pesado',
      status: 'OPERACIONAL',
      mileageKm: 45000,
      driverName: 'Carlos Alberto Nhantumbo',
      isAvailable: true,
      nextOilChangeKm: 60000,
      licenseExpiry: '2028-01-20',
      insuranceExpiry: '2027-01-10',
      inspectionExpiry: '2027-02-15',
      tyreInspectionStatus: 'BOM',
    },
    {
      id: 'veh-4',
      plateNumber: 'AEK-201-MC',
      make: 'Mercedes-Benz',
      model: 'Actros 3354 6x4',
      year: 2023,
      category: 'Camião Pesado',
      status: 'EM_VIAGEM',
      mileageKm: 105400,
      driverName: 'Paulo Mondlane',
      isAvailable: false,
      nextOilChangeKm: 110000,
      licenseExpiry: '2026-08-30',
      insuranceExpiry: '2026-08-28',
      inspectionExpiry: '2026-08-25',
      tyreInspectionStatus: 'BOM',
    },
    {
      id: 'veh-5',
      plateNumber: 'ADZ-990-MC',
      make: 'MAN',
      model: 'TGX 26.540 6x4',
      year: 2024,
      category: 'Camião Pesado',
      status: 'EM_VIAGEM',
      mileageKm: 67300,
      driverName: 'Bernardo Cossa',
      isAvailable: false,
      nextOilChangeKm: 75000,
      licenseExpiry: '2027-06-15',
      insuranceExpiry: '2027-05-10',
      inspectionExpiry: '2027-04-12',
      tyreInspectionStatus: 'BOM',
    },
    {
      id: 'veh-6',
      plateNumber: 'AHB-405-MC',
      make: 'Volvo',
      model: 'FMX 460 Dump Truck',
      year: 2024,
      category: 'Camião Basculante',
      status: 'MANUTENCAO',
      mileageKm: 142000,
      driverName: 'Nenhum',
      isAvailable: false,
      nextOilChangeKm: 140000,
      licenseExpiry: '2026-10-10',
      insuranceExpiry: '2026-09-20',
      inspectionExpiry: '2026-08-15',
      tyreInspectionStatus: 'SUBSTITUIR',
    },
    {
      id: 'veh-7',
      plateNumber: 'AIC-772-MC',
      make: 'Scania',
      model: 'G460 Heavy Hauler',
      year: 2025,
      category: 'Semi-Reboque',
      status: 'OPERACIONAL',
      mileageKm: 28900,
      driverName: 'Tomas Macamo',
      isAvailable: true,
      nextOilChangeKm: 40000,
      licenseExpiry: '2028-03-01',
      insuranceExpiry: '2027-08-10',
      inspectionExpiry: '2027-09-05',
      tyreInspectionStatus: 'BOM',
    },
  ],

  drivers: [
    {
      id: 'drv-1',
      name: 'João Mucavel',
      licenseNumber: 'C-901823 (Pesados)',
      licenseExpDate: '2027-11-20',
      passportExpDate: '2026-09-01',
      sadcVisaExpDate: '2027-05-15',
      phone: '+258 84 901 8822',
      assignedVehiclePlate: 'ABM-849-MC',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'VALIDO',
      ratingScore: 4.9,
      totalTripsCompleted: 142,
    },
    {
      id: 'drv-2',
      name: 'Mateus Sitoe',
      licenseNumber: 'C-445129 (Pesados)',
      licenseExpDate: '2028-04-10',
      passportExpDate: '2029-01-15',
      sadcVisaExpDate: '2028-08-20',
      phone: '+258 82 445 1199',
      assignedVehiclePlate: 'AFK-302-MC',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'VALIDO',
      ratingScore: 4.8,
      totalTripsCompleted: 118,
    },
    {
      id: 'drv-3',
      name: 'Carlos Alberto Nhantumbo',
      licenseNumber: 'C-772910 (Pesados)',
      licenseExpDate: '2026-08-25',
      passportExpDate: '2028-06-12',
      sadcVisaExpDate: '2027-12-01',
      phone: '+258 84 772 9900',
      assignedVehiclePlate: 'AGG-119-MC',
      status: 'DISPONIVEL',
      isAvailable: true,
      docStatus: 'ALERTA_EXPIRACAO',
      ratingScore: 4.7,
      totalTripsCompleted: 96,
    },
    {
      id: 'drv-4',
      name: 'Paulo Mondlane',
      licenseNumber: 'C-338192 (Pesados)',
      licenseExpDate: '2027-09-30',
      passportExpDate: '2027-10-15',
      sadcVisaExpDate: '2026-08-20',
      phone: '+258 86 338 1900',
      assignedVehiclePlate: 'AEK-201-MC',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'ALERTA_EXPIRACAO',
      ratingScore: 4.9,
      totalTripsCompleted: 164,
    },
    {
      id: 'drv-5',
      name: 'Bernardo Cossa',
      licenseNumber: 'C-551029 (Pesados)',
      licenseExpDate: '2028-02-14',
      passportExpDate: '2028-11-20',
      sadcVisaExpDate: '2027-07-01',
      phone: '+258 84 551 0022',
      assignedVehiclePlate: 'ADZ-990-MC',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'VALIDO',
      ratingScore: 4.6,
      totalTripsCompleted: 82,
    },
    {
      id: 'drv-6',
      name: 'Tomas Macamo',
      licenseNumber: 'C-882019 (Pesados)',
      licenseExpDate: '2027-03-22',
      passportExpDate: '2027-08-10',
      sadcVisaExpDate: '2027-09-18',
      phone: '+258 82 882 0111',
      assignedVehiclePlate: 'AIC-772-MC',
      status: 'DISPONIVEL',
      isAvailable: true,
      docStatus: 'VALIDO',
      ratingScore: 4.8,
      totalTripsCompleted: 105,
    },
  ],

  employees: [
    {
      id: 'EMP-01',
      name: 'Sérgio N\'Tandinho',
      email: 'sergio@ntandinho.co.mz',
      phone: '+258 84 300 0001',
      branchCity: 'Matola (Sede)',
      position: 'Director Geral',
      department: 'Direcção',
      role: 'ADMIN',
      isActive: true,
      hireDate: '2020-01-10',
    },
    {
      id: 'EMP-02',
      name: 'Maria Nhachungue',
      email: 'maria.operacoes@ntandinho.co.mz',
      phone: '+258 84 300 0002',
      branchCity: 'Matola (Sede)',
      position: 'Gestora de Tráfego e Operações',
      department: 'Operações',
      role: 'GESTOR',
      isActive: true,
      hireDate: '2021-03-15',
    },
    {
      id: 'EMP-03',
      name: 'Arnaldo Langa',
      email: 'arnaldo.frota@ntandinho.co.mz',
      phone: '+258 84 300 0003',
      branchCity: 'Beira (Corredor)',
      position: 'Responsável Técnico de Frota',
      department: 'Frota',
      role: 'RESPONSAVEL_FROTA',
      isActive: true,
      hireDate: '2022-06-01',
    },
    {
      id: 'EMP-04',
      name: 'Esperança Tembe',
      email: 'esperanca.fin@ntandinho.co.mz',
      phone: '+258 84 300 0004',
      branchCity: 'Matola (Sede)',
      position: 'Chefe de Contabilidade e Finanças',
      department: 'Financeiro',
      role: 'FINANCEIRO',
      isActive: true,
      hireDate: '2021-09-01',
    },
    {
      id: 'EMP-05',
      name: 'Eusébio Mabunda',
      email: 'eusebio.nacala@ntandinho.co.mz',
      phone: '+258 84 300 0005',
      branchCity: 'Nacala (Porto)',
      position: 'Operador Logístico de Porto',
      department: 'Operações',
      role: 'OPERADOR',
      isActive: true,
      hireDate: '2023-02-15',
    },
  ],

  trips: [
    {
      id: 'trip-1',
      tripNumber: 'NT-1024',
      customerId: 'CLI-001',
      customerName: 'Cervejas de Moçambique (CDM S.A.)',
      serviceName: 'Transporte de Mercadorias',
      origin: 'Maputo (Fábrica)',
      destination: 'Nampula (Depósito)',
      vehicleId: 'veh-1',
      vehiclePlate: 'ABM-849-MC',
      vehicleModel: 'Volvo FH16 750 HP',
      driverId: 'drv-1',
      driverName: 'João Mucavel',
      cargoDescription: 'Cerveja 2M em Paletes (32 Toneladas)',
      weightKg: 32000,
      departureTime: '08:30',
      etaTime: '18:00 (Amanhã)',
      status: 'EM_ANDAMENTO',
      paymentStatus: 'PAGO',
      totalPriceMzn: 406000,
      createdAt: '2026-08-08',
    },
    {
      id: 'trip-2',
      tripNumber: 'NT-1025',
      customerId: 'CLI-002',
      customerName: 'Mozal S.A.',
      serviceName: 'Transporte Internacional SADC',
      origin: 'Matola (Beluluane)',
      destination: 'Lilongwe (Malawi)',
      vehicleId: 'veh-2',
      vehiclePlate: 'AFK-302-MC',
      vehicleModel: 'Scania R500 V8',
      driverId: 'drv-2',
      driverName: 'Mateus Sitoe',
      cargoDescription: 'Lingotes de Alumínio em Porta-Contentor',
      weightKg: 40000,
      departureTime: '06:00',
      etaTime: '20:00 (Amanhã)',
      status: 'EM_ANDAMENTO',
      paymentStatus: 'PAGO_PARCIAL',
      totalPriceMzn: 556800,
      createdAt: '2026-08-08',
    },
    {
      id: 'trip-3',
      tripNumber: 'NT-1026',
      customerId: 'CLI-003',
      customerName: 'Vulcan Minerals Moçambique',
      serviceName: 'Transporte Basculante / Minérios',
      origin: 'Moatize (Tete)',
      destination: 'Porto da Beira',
      vehicleId: 'veh-4',
      vehiclePlate: 'AEK-201-MC',
      vehicleModel: 'Mercedes-Benz Actros 3354',
      driverId: 'drv-4',
      driverName: 'Paulo Mondlane',
      cargoDescription: 'Carvão Mineral a Granel (38 Toneladas)',
      weightKg: 38000,
      departureTime: '09:15',
      etaTime: '20:15 (Hoje)',
      status: 'EM_ANDAMENTO',
      paymentStatus: 'PAGO',
      totalPriceMzn: 320000,
      createdAt: '2026-08-08',
    },
    {
      id: 'trip-4',
      tripNumber: 'NT-1027',
      customerId: 'CLI-004',
      customerName: 'Coca-Cola Sabco Moçambique',
      serviceName: 'Logística Nacional (Corredor N1)',
      origin: 'Matola',
      destination: 'Beira',
      vehicleId: 'veh-5',
      vehiclePlate: 'ADZ-990-MC',
      vehicleModel: 'MAN TGX 26.540',
      driverId: 'drv-5',
      driverName: 'Bernardo Cossa',
      cargoDescription: 'Refrigerantes em Garrafa 500ml',
      weightKg: 30000,
      departureTime: '11:00',
      etaTime: '07:00 (Amanhã)',
      status: 'EM_PREPARACAO',
      paymentStatus: 'PENDENTE',
      totalPriceMzn: 285000,
      createdAt: '2026-08-08',
    },
    {
      id: 'trip-5',
      tripNumber: 'NT-1028',
      customerId: 'CLI-005',
      customerName: 'Cimentos de Moçambique S.A.',
      serviceName: 'Aluguer de Camiões',
      origin: 'Matola',
      destination: 'Gaza (Xai-Xai)',
      vehicleId: '',
      vehiclePlate: 'Sem Viatura',
      vehicleModel: 'Pendente Alocação',
      driverId: '',
      driverName: 'Sem Motorista',
      cargoDescription: 'Sacos de Cimento 50kg (35 Toneladas)',
      weightKg: 35000,
      departureTime: '14:30',
      etaTime: '19:00 (Hoje)',
      status: 'PENDENTE',
      paymentStatus: 'PENDENTE',
      totalPriceMzn: 195000,
      createdAt: '2026-08-08',
    },
    {
      id: 'trip-6',
      tripNumber: 'NT-1020',
      customerId: 'CLI-006',
      customerName: 'Fazendas Agrícolas de Nampula Lda',
      serviceName: 'Logística Nacional',
      origin: 'Nampula',
      destination: 'Porto de Nacala',
      vehicleId: 'veh-3',
      vehiclePlate: 'AGG-119-MC',
      vehicleModel: 'DAF XF 530',
      driverId: 'drv-3',
      driverName: 'Carlos Alberto Nhantumbo',
      cargoDescription: 'Castanha de Caju para Exportação',
      weightKg: 28000,
      departureTime: '07:00',
      etaTime: '12:00 (Concluída)',
      status: 'CONCLUIDA',
      paymentStatus: 'PAGO',
      totalPriceMzn: 160000,
      createdAt: '2026-08-07',
    },
  ],

  invoices: [
    {
      id: 'inv-1',
      invoiceNumber: 'FT-2026-001',
      tripId: 'trip-1',
      customerId: 'CLI-001',
      customerName: 'Cervejas de Moçambique (CDM S.A.)',
      subtotal: 350000,
      taxAmount: 56000,
      totalAmount: 406000,
      paidAmount: 406000,
      currency: 'MZN',
      status: 'PAGO',
      dueDate: '2026-08-22',
      createdAt: '2026-08-05',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'FT-2026-002',
      tripId: 'trip-2',
      customerId: 'CLI-002',
      customerName: 'Mozal S.A.',
      subtotal: 480000,
      taxAmount: 76800,
      totalAmount: 556800,
      paidAmount: 200000,
      currency: 'MZN',
      status: 'PAGO_PARCIAL',
      dueDate: '2026-08-25',
      createdAt: '2026-08-06',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'FT-2026-003',
      tripId: 'trip-4',
      customerId: 'CLI-004',
      customerName: 'Coca-Cola Sabco Moçambique',
      subtotal: 245689,
      taxAmount: 39311,
      totalAmount: 285000,
      paidAmount: 0,
      currency: 'MZN',
      status: 'PENDENTE',
      dueDate: '2026-08-20',
      createdAt: '2026-08-07',
    },
    {
      id: 'inv-4',
      invoiceNumber: 'FT-2026-004',
      tripId: 'trip-5',
      customerId: 'CLI-005',
      customerName: 'Cimentos de Moçambique S.A.',
      subtotal: 168103,
      taxAmount: 26897,
      totalAmount: 195000,
      paidAmount: 0,
      currency: 'MZN',
      status: 'VENCIDA',
      dueDate: '2026-08-01',
      createdAt: '2026-07-20',
    },
  ],

  payments: [
    {
      id: 'PAY-001',
      paymentNumber: 'REC-2026-01',
      invoiceNumber: 'FT-2026-001',
      customerName: 'Cervejas de Moçambique (CDM S.A.)',
      amountMzn: 406000,
      method: 'TRANSFERENCIA_BANCARIA',
      referenceNo: 'BCI-TRF-908123',
      paidAt: '2026-08-06',
      bankName: 'BCI (Banco Comercial e de Investimentos)',
    },
    {
      id: 'PAY-002',
      paymentNumber: 'REC-2026-02',
      invoiceNumber: 'FT-2026-002',
      customerName: 'Mozal S.A.',
      amountMzn: 200000,
      method: 'TRANSFERENCIA_BANCARIA',
      referenceNo: 'BIM-TRF-441092',
      paidAt: '2026-08-07',
      bankName: 'Millennium BIM',
    },
  ],

  expenses: [
    {
      id: 'EXP-101',
      category: 'COMBUSTIVEL',
      description: 'Abastecimento 450 Litros de Gasóleo para Camião ABM-849-MC',
      vehiclePlate: 'ABM-849-MC',
      tripNumber: 'NT-1024',
      amountMzn: 42300,
      date: '2026-08-08',
      receiptNo: 'PETRO-8910',
      registeredBy: 'João Mucavel',
    },
    {
      id: 'EXP-102',
      category: 'PORTAGEM',
      description: 'Portagem Ponte Maputo-Katembe e N1 Maputo-Xai-Xai',
      vehiclePlate: 'AEK-201-MC',
      tripNumber: 'NT-1026',
      amountMzn: 2850,
      date: '2026-08-08',
      receiptNo: 'REV-4412',
      registeredBy: 'Paulo Mondlane',
    },
    {
      id: 'EXP-103',
      category: 'DIARIA_MOTORISTA',
      description: 'Abono de viagem e alimentação em rota SADC (Malawi)',
      vehiclePlate: 'AFK-302-MC',
      tripNumber: 'NT-1025',
      amountMzn: 8500,
      date: '2026-08-08',
      receiptNo: 'ABN-102',
      registeredBy: 'Maria Nhachungue',
    },
    {
      id: 'EXP-104',
      category: 'MANUTENCAO',
      description: 'Troca de pastilhas de travão e calços no Camião AHB-405-MC',
      vehiclePlate: 'AHB-405-MC',
      amountMzn: 38500,
      date: '2026-08-07',
      receiptNo: 'OFC-901',
      registeredBy: 'Arnaldo Langa',
    },
  ],

  fuelLogs: [
    {
      id: 'fuel-1',
      date: '2026-08-08',
      vehiclePlate: 'ABM-849-MC',
      driverName: 'João Mucavel',
      stationName: 'Petromoc',
      liters: 450,
      pricePerLiterMzn: 94.0,
      totalCostMzn: 42300,
      currentKm: 124500,
      consumptionL100Km: 32.4,
    },
    {
      id: 'fuel-2',
      date: '2026-08-07',
      vehiclePlate: 'AFK-302-MC',
      driverName: 'Mateus Sitoe',
      stationName: 'Galp',
      liters: 380,
      pricePerLiterMzn: 94.0,
      totalCostMzn: 35720,
      currentKm: 88200,
      consumptionL100Km: 33.1,
    },
  ],

  maintenanceLogs: [
    {
      id: 'maint-1',
      date: '2026-08-07',
      vehiclePlate: 'AHB-405-MC',
      type: 'REPARACAO_MOTOR',
      category: 'CORRECTIVA',
      description: 'Substituição de injectores e revisão do turbocompressor',
      costMzn: 38500,
      kmAtService: 142000,
      workshop: 'Oficina Central Matola',
      status: 'EM_ANDAMENTO',
    },
    {
      id: 'maint-2',
      date: '2026-07-28',
      vehiclePlate: 'ABM-849-MC',
      type: 'TROCA_OLEO',
      category: 'PREVENTIVA',
      description: 'Substituição de óleo sintético Castrol 10W-40 e filtros de ar',
      costMzn: 24500,
      kmAtService: 120000,
      workshop: 'Oficina Central Matola',
      status: 'CONCLUIDA',
    },
  ],

  routes: [
    {
      id: 'ROT-01',
      name: 'Corredor N1 (Maputo ➔ Nampula)',
      origin: 'Maputo',
      destination: 'Nampula',
      distanceKm: 2150,
      estDurationHours: 36,
      borderCheckpoints: 'N/A (Nacional)',
      basePriceMzn: 350000,
      totalTripsCount: 48,
      totalRevenueMzn: 16800000,
      status: 'ATIVA',
    },
    {
      id: 'ROT-02',
      name: 'Corredor da Beira ➔ Malawi (Lilongwe)',
      origin: 'Beira',
      destination: 'Lilongwe (Malawi)',
      distanceKm: 950,
      estDurationHours: 20,
      borderCheckpoints: 'Fronteira de Cuchamano / Zóbuè',
      basePriceMzn: 450000,
      totalTripsCount: 32,
      totalRevenueMzn: 14400000,
      status: 'ATIVA',
    },
    {
      id: 'ROT-03',
      name: 'Corredor de Nacala ➔ Malawi (Blantyre)',
      origin: 'Nacala',
      destination: 'Blantyre (Malawi)',
      distanceKm: 820,
      estDurationHours: 16,
      borderCheckpoints: 'Fronteira de Entre-Lagos',
      basePriceMzn: 410000,
      totalTripsCount: 29,
      totalRevenueMzn: 11890000,
      status: 'ATIVA',
    },
    {
      id: 'ROT-04',
      name: 'Norte (Pemba ➔ Palma LNG)',
      origin: 'Pemba',
      destination: 'Palma (Afungi)',
      distanceKm: 410,
      estDurationHours: 8,
      borderCheckpoints: 'N/A (Nacional)',
      basePriceMzn: 290000,
      totalTripsCount: 19,
      totalRevenueMzn: 5510000,
      status: 'ATIVA',
    },
    {
      id: 'ROT-05',
      name: 'Corredor do Carvão (Tete ➔ Beira)',
      origin: 'Moatize (Tete)',
      destination: 'Porto da Beira',
      distanceKm: 590,
      estDurationHours: 11,
      borderCheckpoints: 'N/A (Nacional)',
      basePriceMzn: 260000,
      totalTripsCount: 54,
      totalRevenueMzn: 14040000,
      status: 'ATIVA',
    },
  ],

  services: [
    {
      id: 'SRV-01',
      code: 'CAM-PES',
      name: 'Aluguer de Camiões Pesados',
      category: 'Aluguer de Camiões',
      description: 'Tractores de Longa Distância 6x4 e 4x2 com capacidade de até 40 Toneladas.',
      pricePerKmMzn: 180,
      pricePerDayMzn: 45000,
      isActive: true,
    },
    {
      id: 'SRV-02',
      code: 'TRP-MEC',
      name: 'Transporte de Mercadorias & Contentores',
      category: 'Transporte de Mercadorias',
      description: 'Transporte de cargas gerais, paletizadas e contentores de 20ft e 40ft.',
      pricePerKmMzn: 165,
      pricePerDayMzn: 40000,
      isActive: true,
    },
    {
      id: 'SRV-03',
      code: 'LOG-NAC',
      name: 'Logística Nacional (Eixo N1)',
      category: 'Logística Nacional',
      description: 'Cobertura integrada de norte a sul ao longo da Estrada Nacional N1.',
      pricePerKmMzn: 160,
      pricePerDayMzn: 38000,
      isActive: true,
    },
    {
      id: 'SRV-04',
      code: 'TRP-SADC',
      name: 'Transporte Internacional SADC',
      category: 'Transporte Internacional SADC',
      description: 'Despacho transfronteiriço para Malawi, Zâmbia, Zimbabwe e África do Sul.',
      pricePerKmMzn: 220,
      pricePerDayMzn: 55000,
      isActive: true,
    },
  ],

  documents: [
    {
      id: 'DOC-01',
      title: 'Alvará de Transporte Rodoviário de Cargas',
      entityType: 'EMPRESA',
      entityName: 'N\' Tandinho Transportes S.A.',
      docNumber: 'ALV-2024-9910',
      issueDate: '2024-01-10',
      expiryDate: '2029-01-10',
      status: 'VALIDO',
      fileCategory: 'Licenciamento',
    },
    {
      id: 'DOC-02',
      title: 'Seguro de Responsabilidade Civil & Cargas (ABM-849-MC)',
      entityType: 'VIATURA',
      entityName: 'Volvo FH16 (ABM-849-MC)',
      docNumber: 'SEG-EMO-44192',
      issueDate: '2025-12-01',
      expiryDate: '2026-11-30',
      status: 'VALIDO',
      fileCategory: 'Seguros',
    },
    {
      id: 'DOC-03',
      title: 'Licenciamento de Transporte de Carga Perigosa (AEK-201-MC)',
      entityType: 'VIATURA',
      entityName: 'Mercedes Actros (AEK-201-MC)',
      docNumber: 'LIC-DNT-8812',
      issueDate: '2025-08-30',
      expiryDate: '2026-08-30',
      status: 'PROXIMO_VENCIMENTO',
      fileCategory: 'Licenciamento',
    },
    {
      id: 'DOC-04',
      title: 'Carta de Condução Profissional (Carlos Nhantumbo)',
      entityType: 'MOTORISTA',
      entityName: 'Carlos Alberto Nhantumbo',
      docNumber: 'C-772910',
      issueDate: '2021-08-25',
      expiryDate: '2026-08-25',
      status: 'PROXIMO_VENCIMENTO',
      fileCategory: 'Certificados',
    },
    {
      id: 'DOC-05',
      title: 'Visto SADC Transfronteiriço (Paulo Mondlane)',
      entityType: 'MOTORISTA',
      entityName: 'Paulo Mondlane',
      docNumber: 'V-SADC-0912',
      issueDate: '2025-08-20',
      expiryDate: '2026-08-20',
      status: 'PROXIMO_VENCIMENTO',
      fileCategory: 'Certificados',
    },
    {
      id: 'DOC-06',
      title: 'Inspecção Periódica Obrigatoria (AHB-405-MC)',
      entityType: 'VIATURA',
      entityName: 'Volvo Basculante (AHB-405-MC)',
      docNumber: 'INSP-2025-331',
      issueDate: '2025-08-15',
      expiryDate: '2026-08-15',
      status: 'PROXIMO_VENCIMENTO',
      fileCategory: 'Inspecções',
    },
  ],

  auditLogs: [
    {
      id: 'AUD-01',
      userName: 'Maria Nhachungue',
      action: 'CONFIRMAR_VIAGEM',
      module: 'Operações',
      recordRef: 'NT-1024',
      timestamp: 'Hoje às 09:42',
      details: 'Maria confirmou a viagem NT-1024 (Maputo -> Nampula) e alocou o camião ABM-849-MC.',
    },
    {
      id: 'AUD-02',
      userName: 'Esperança Tembe',
      action: 'REGISTAR_PAGAMENTO',
      module: 'Financeiro',
      recordRef: 'FT-2026-001',
      timestamp: 'Ontem às 16:15',
      details: 'Esperança registou a liquidação total da Fatura FT-2026-001 no valor de 406.000,00 MZN via BCI.',
    },
    {
      id: 'AUD-03',
      userName: 'Arnaldo Langa',
      action: 'ABRIR_MANUTENCAO',
      module: 'Frota',
      recordRef: 'AHB-405-MC',
      timestamp: 'Ontem às 11:05',
      details: 'Arnaldo alterou o estado do camião AHB-405-MC para MANUTENCAO por intervenção no turbocompressor.',
    },
    {
      id: 'AUD-04',
      userName: 'Sérgio N\'Tandinho',
      action: 'APROVAR_COTACAO',
      module: 'Comercial',
      recordRef: 'COT-2026-001',
      timestamp: '05/Ago às 14:20',
      details: 'Sérgio aprovou a Cotação COT-2026-001 para Cervejas de Moçambique no valor de 406.000,00 MZN.',
    },
  ],

  // Actions implementation
  updateCompanyProfile: (profile) => {
    set((state) => ({
      companyProfile: { ...state.companyProfile, ...profile },
    }));
    useNotificationStore.getState().addToast('Perfil da Empresa', 'Perfil da N\' Tandinho Transportes S.A. atualizado!', 'success');
  },

  addCustomer: (data) => {
    const newCustomer: CustomerItem = {
      ...data,
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      totalSpentMzn: 0,
      status: 'ATIVO',
      createdAt: new Date().toISOString().slice(0, 10),
      lastActivity: 'Hoje',
    };
    set((state) => ({
      customers: [newCustomer, ...state.customers],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CRIAR_CLIENTE',
          module: 'Clientes',
          recordRef: newCustomer.id,
          timestamp: 'Hoje',
          details: `Criado o cliente ${newCustomer.name} (${newCustomer.nuit})`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Novo Cliente', `Cliente "${newCustomer.name}" registado com sucesso!`, 'success');
  },

  addQuotation: (data) => {
    const quotationNumber = `COT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const taxAmount = Math.round(data.priceSubtotal * 0.16);
    const totalPrice = data.priceSubtotal + taxAmount;
    const newQuotation: QuotationItem = {
      ...data,
      id: `COT-${Date.now()}`,
      quotationNumber,
      taxAmount,
      totalPrice,
      status: 'RASCUNHO',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      quotations: [newQuotation, ...state.quotations],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CRIAR_COTACAO',
          module: 'Cotações',
          recordRef: quotationNumber,
          timestamp: 'Hoje',
          details: `Gerada a Cotação ${quotationNumber} para ${newQuotation.customerName}`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Nova Cotação', `Cotação ${quotationNumber} gerada com sucesso!`, 'success');
  },

  updateQuotationStatus: (quotationId, status) => {
    set((state) => {
      const q = state.quotations.find((item) => item.id === quotationId);
      if (!q) return state;
      return {
        quotations: state.quotations.map((item) => (item.id === quotationId ? { ...item, status } : item)),
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'ALTERAR_ESTADO_COTACAO',
            module: 'Cotações',
            recordRef: q.quotationNumber,
            timestamp: 'Hoje',
            details: `Estado da cotação ${q.quotationNumber} alterado para ${status}`,
          },
          ...state.auditLogs,
        ],
      };
    });
    useNotificationStore.getState().addToast('Cotação Atualizada', 'Estado da cotação atualizado com sucesso!', 'info');
  },

  addBooking: (data) => {
    const bookingNumber = `RES-2026-${Math.floor(10 + Math.random() * 90)}`;
    const newBooking: BookingItem = {
      ...data,
      id: `RES-${Date.now()}`,
      bookingNumber,
      status: 'PENDENTE',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      bookings: [newBooking, ...state.bookings],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CRIAR_RESERVA',
          module: 'Reservas',
          recordRef: bookingNumber,
          timestamp: 'Hoje',
          details: `Registada nova reserva ${bookingNumber} para ${newBooking.customerName}`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Nova Reserva', `Reserva ${bookingNumber} registada!`, 'success');
  },

  confirmBooking: (bookingId) => {
    set((state) => {
      const b = state.bookings.find((item) => item.id === bookingId);
      if (!b) return state;
      const tripNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTrip: TripItem = {
        id: `trip-${Date.now()}`,
        tripNumber,
        customerId: b.customerId,
        customerName: b.customerName,
        serviceName: b.serviceName,
        origin: b.origin,
        destination: b.destination,
        vehiclePlate: 'Sem Viatura',
        vehicleModel: 'Pendente Alocação',
        driverName: 'Sem Motorista',
        cargoDescription: b.cargoDetails,
        weightKg: 25000,
        departureTime: '08:00',
        etaTime: 'Pendente',
        status: 'CONFIRMADA',
        paymentStatus: 'PENDENTE',
        totalPriceMzn: b.totalPriceMzn,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      return {
        bookings: state.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'CONFIRMADA' } : item)),
        trips: [newTrip, ...state.trips],
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'CONFIRMAR_RESERVA',
            module: 'Reservas',
            recordRef: b.bookingNumber,
            timestamp: 'Hoje',
            details: `Reserva ${b.bookingNumber} confirmada e convertida na Viagem ${tripNumber}`,
          },
          ...state.auditLogs,
        ],
      };
    });
    useNotificationStore.getState().addToast('Reserva Confirmada', 'Reserva confirmada e viagem correspondente gerada!', 'success');
  },

  addVehicle: (data) => {
    const newVehicle: VehicleItem = {
      ...data,
      id: `veh-${Date.now()}`,
      status: 'OPERACIONAL',
      isAvailable: true,
      tyreInspectionStatus: 'BOM',
    };
    set((state) => ({
      vehicles: [newVehicle, ...state.vehicles],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CRIAR_VIATURA',
          module: 'Frota',
          recordRef: newVehicle.plateNumber,
          timestamp: 'Hoje',
          details: `Adicionada a viatura ${newVehicle.make} ${newVehicle.model} (${newVehicle.plateNumber})`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Nova Viatura', `Viatura ${newVehicle.plateNumber} registada na frota!`, 'success');
  },

  updateVehicleStatus: (vehicleId, status) => {
    set((state) => {
      const v = state.vehicles.find((item) => item.id === vehicleId);
      if (!v) return state;
      const isAvail = status === 'OPERACIONAL';
      return {
        vehicles: state.vehicles.map((item) => (item.id === vehicleId ? { ...item, status, isAvailable: isAvail } : item)),
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'ALTERAR_ESTADO_VIATURA',
            module: 'Frota',
            recordRef: v.plateNumber,
            timestamp: 'Hoje',
            details: `Viatura ${v.plateNumber} alterada para o estado ${status}`,
          },
          ...state.auditLogs,
        ],
      };
    });
    useNotificationStore.getState().addToast('Frota Atualizada', 'Estado da viatura alterado!', 'info');
  },

  addDriver: (data) => {
    const newDriver: DriverItem = {
      ...data,
      id: `drv-${Date.now()}`,
      status: 'DISPONIVEL',
      isAvailable: true,
      docStatus: 'VALIDO',
      ratingScore: 5.0,
      totalTripsCompleted: 0,
    };
    set((state) => ({
      drivers: [newDriver, ...state.drivers],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CRIAR_MOTORISTA',
          module: 'Motoristas',
          recordRef: newDriver.name,
          timestamp: 'Hoje',
          details: `Cadastrado o motorista ${newDriver.name} (${newDriver.licenseNumber})`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Novo Motorista', `Motorista ${newDriver.name} registado!`, 'success');
  },

  updateDriverStatus: (driverId, status) => {
    set((state) => {
      const d = state.drivers.find((item) => item.id === driverId);
      if (!d) return state;
      const isAvail = status === 'DISPONIVEL';
      return {
        drivers: state.drivers.map((item) => (item.id === driverId ? { ...item, status, isAvailable: isAvail } : item)),
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'ALTERAR_ESTADO_MOTORISTA',
            module: 'Motoristas',
            recordRef: d.name,
            timestamp: 'Hoje',
            details: `Motorista ${d.name} alterado para ${status}`,
          },
          ...state.auditLogs,
        ],
      };
    });
    useNotificationStore.getState().addToast('Motorista Atualizado', 'Estado do motorista alterado!', 'info');
  },

  addFuelLog: (data) => {
    const consumptionL100Km = Math.round((data.liters / 14) * 10) / 10;
    const newLog: FuelLogItem = {
      ...data,
      id: `fuel-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      consumptionL100Km,
    };
    set((state) => ({
      fuelLogs: [newLog, ...state.fuelLogs],
      expenses: [
        {
          id: `EXP-${Date.now()}`,
          category: 'COMBUSTIVEL',
          description: `Abastecimento ${newLog.liters}L para ${newLog.vehiclePlate} (${newLog.stationName})`,
          vehiclePlate: newLog.vehiclePlate,
          amountMzn: newLog.totalCostMzn,
          date: newLog.date,
          registeredBy: newLog.driverName,
        },
        ...state.expenses,
      ],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: data.driverName,
          action: 'REGISTAR_ABASTECIMENTO',
          module: 'Frota',
          recordRef: data.vehiclePlate,
          timestamp: 'Hoje',
          details: `Abastecidos ${data.liters}L no valor de ${data.totalCostMzn.toLocaleString('pt-MZ')} MZN`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Vale de Combustível', `Abastecimento de ${data.liters}L registado!`, 'success');
  },

  addMaintenanceLog: (data) => {
    const newLog: MaintenanceLogItem = {
      ...data,
      id: `maint-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'AGENDADA',
    };
    set((state) => ({
      maintenanceLogs: [newLog, ...state.maintenanceLogs],
      vehicles: state.vehicles.map((v) =>
        v.plateNumber === data.vehiclePlate ? { ...v, status: 'MANUTENCAO', isAvailable: false } : v
      ),
      expenses: [
        {
          id: `EXP-${Date.now()}`,
          category: 'MANUTENCAO',
          description: `Manutenção ${data.type} no Camião ${data.vehiclePlate}`,
          vehiclePlate: data.vehiclePlate,
          amountMzn: data.costMzn,
          date: newLog.date,
          registeredBy: 'Equipa Técnica',
        },
        ...state.expenses,
      ],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Responsável de Frota',
          action: 'AGENDAR_MANUTENCAO',
          module: 'Frota',
          recordRef: data.vehiclePlate,
          timestamp: 'Hoje',
          details: `Agendada manutenção de ${data.costMzn.toLocaleString('pt-MZ')} MZN em ${data.workshop}`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Manutenção Agendada', `Intervenção técnica para ${data.vehiclePlate} lançada!`, 'success');
  },

  addTrip: (data) => {
    const tripNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip: TripItem = {
      ...data,
      id: `trip-${Date.now()}`,
      tripNumber,
      status: data.vehicleId && data.driverId ? 'EM_PREPARACAO' : 'PENDENTE',
      paymentStatus: 'PENDENTE',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    set((state) => {
      let updatedVehicles = [...state.vehicles];
      let updatedDrivers = [...state.drivers];

      if (data.vehiclePlate && data.vehiclePlate !== 'Sem Viatura') {
        updatedVehicles = updatedVehicles.map((v) =>
          v.plateNumber === data.vehiclePlate ? { ...v, status: 'EM_VIAGEM', driverName: data.driverName, isAvailable: false } : v
        );
      }
      if (data.driverName && data.driverName !== 'Sem Motorista') {
        updatedDrivers = updatedDrivers.map((d) =>
          d.name === data.driverName ? { ...d, status: 'EM_VIAGEM', isAvailable: false } : d
        );
      }

      return {
        trips: [newTrip, ...state.trips],
        vehicles: updatedVehicles,
        drivers: updatedDrivers,
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'CRIAR_VIAGEM',
            module: 'Operações',
            recordRef: tripNumber,
            timestamp: 'Hoje',
            details: `Criada a Viagem ${tripNumber} (${newTrip.origin} -> ${newTrip.destination})`,
          },
          ...state.auditLogs,
        ],
      };
    });

    useNotificationStore.getState().addToast('Nova Viagem', `Viagem ${tripNumber} registada com sucesso!`, 'success');
  },

  updateTripStatus: (tripId, newStatus) => {
    const state = get();
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;

    let updatedInvoices = [...state.invoices];
    let updatedVehicles = [...state.vehicles];
    let updatedDrivers = [...state.drivers];

    if (newStatus === 'CONCLUIDA') {
      updatedVehicles = updatedVehicles.map((v) =>
        v.plateNumber === trip.vehiclePlate ? { ...v, status: 'OPERACIONAL', isAvailable: true } : v
      );
      updatedDrivers = updatedDrivers.map((d) =>
        d.name === trip.driverName ? { ...d, status: 'DISPONIVEL', isAvailable: true, totalTripsCompleted: d.totalTripsCompleted + 1 } : d
      );

      const invNum = `FT-2026-${Math.floor(100 + Math.random() * 900)}`;
      const subtotal = Math.round(trip.totalPriceMzn / 1.16);
      const taxAmount = trip.totalPriceMzn - subtotal;
      const newInvoice: InvoiceItem = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNum,
        tripId: trip.id,
        customerId: trip.customerId,
        customerName: trip.customerName,
        subtotal,
        taxAmount,
        totalAmount: trip.totalPriceMzn,
        paidAmount: 0,
        currency: 'MZN',
        status: 'PENDENTE',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      updatedInvoices = [newInvoice, ...updatedInvoices];
    } else if (newStatus === 'CANCELADA') {
      updatedVehicles = updatedVehicles.map((v) =>
        v.plateNumber === trip.vehiclePlate ? { ...v, status: 'OPERACIONAL', isAvailable: true } : v
      );
      updatedDrivers = updatedDrivers.map((d) =>
        d.name === trip.driverName ? { ...d, status: 'DISPONIVEL', isAvailable: true } : d
      );
    }

    set({
      trips: state.trips.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t)),
      vehicles: updatedVehicles,
      drivers: updatedDrivers,
      invoices: updatedInvoices,
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'ALTERAR_ESTADO_VIAGEM',
          module: 'Operações',
          recordRef: trip.tripNumber,
          timestamp: 'Hoje',
          details: `Estado da viagem ${trip.tripNumber} alterado para ${newStatus}`,
        },
        ...state.auditLogs,
      ],
    });

    useNotificationStore.getState().addToast('Estado Atualizado', `Viagem ${trip.tripNumber} marcada como ${newStatus}!`, 'info');
  },

  assignDriverAndVehicle: (tripId, vehicleId, driverId) => {
    set((state) => {
      const trip = state.trips.find((t) => t.id === tripId);
      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      const driver = state.drivers.find((d) => d.id === driverId);

      if (!trip || !vehicle || !driver) return state;

      const updatedTrips = state.trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              vehicleId: vehicle.id,
              vehiclePlate: vehicle.plateNumber,
              vehicleModel: `${vehicle.make} ${vehicle.model}`,
              driverId: driver.id,
              driverName: driver.name,
              status: t.status === 'PENDENTE' ? ('EM_PREPARACAO' as const) : t.status,
            }
          : t
      );

      const updatedVehicles = state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, status: 'EM_VIAGEM' as const, driverName: driver.name, isAvailable: false } : v
      );

      const updatedDrivers = state.drivers.map((d) =>
        d.id === driverId ? { ...d, status: 'EM_VIAGEM' as const, assignedVehiclePlate: vehicle.plateNumber, isAvailable: false } : d
      );

      return {
        trips: updatedTrips,
        vehicles: updatedVehicles,
        drivers: updatedDrivers,
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'ATRIBUIR_RECURSOS',
            module: 'Operações',
            recordRef: trip.tripNumber,
            timestamp: 'Hoje',
            details: `Atribuídos camião ${vehicle.plateNumber} e motorista ${driver.name} à viagem ${trip.tripNumber}`,
          },
          ...state.auditLogs,
        ],
      };
    });

    useNotificationStore.getState().addToast('Recursos Atribuídos', 'Camião e motorista alocados à viagem!', 'success');
  },

  addInvoice: (data) => {
    const invoiceNumber = `FT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: InvoiceItem = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      paidAmount: 0,
      status: 'PENDENTE',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'EMITIR_FATURA',
          module: 'Financeiro',
          recordRef: invoiceNumber,
          timestamp: 'Hoje',
          details: `Emitida fatura ${invoiceNumber} para ${newInvoice.customerName} no valor de ${newInvoice.totalAmount.toLocaleString('pt-MZ')} MZN`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Nova Fatura', `Fatura ${invoiceNumber} emitida!`, 'success');
  },

  payInvoice: (invoiceId, amountMzn, method, referenceNo) => {
    set((state) => {
      const inv = state.invoices.find((i) => i.id === invoiceId);
      if (!inv) return state;

      const newPaid = inv.paidAmount + amountMzn;
      let newStatus: InvoiceItem['status'] = 'PAGO_PARCIAL';
      if (newPaid >= inv.totalAmount) newStatus = 'PAGO';

      const newPayment: PaymentItem = {
        id: `PAY-${Date.now()}`,
        paymentNumber: `REC-2026-${Math.floor(10 + Math.random() * 90)}`,
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName,
        amountMzn,
        method,
        referenceNo,
        paidAt: new Date().toISOString().slice(0, 10),
        bankName: method === 'TRANSFERENCIA_BANCARIA' ? 'BCI / Millennium BIM' : undefined,
      };

      const updatedTrips = state.trips.map((t) =>
        t.id === inv.tripId ? { ...t, paymentStatus: newStatus === 'PAGO' ? ('PAGO' as const) : ('PAGO_PARCIAL' as const) } : t
      );

      return {
        invoices: state.invoices.map((i) => (i.id === invoiceId ? { ...i, paidAmount: newPaid, status: newStatus } : i)),
        payments: [newPayment, ...state.payments],
        trips: updatedTrips,
        auditLogs: [
          {
            id: `AUD-${Date.now()}`,
            userName: 'Utilizador Actual',
            action: 'REGISTAR_RECEBIMENTO',
            module: 'Financeiro',
            recordRef: inv.invoiceNumber,
            timestamp: 'Hoje',
            details: `Registo de pagamento de ${amountMzn.toLocaleString('pt-MZ')} MZN para a fatura ${inv.invoiceNumber} via ${method}`,
          },
          ...state.auditLogs,
        ],
      };
    });
    useNotificationStore.getState().addToast('Pagamento Registado', `Recibo emitido no valor de ${amountMzn.toLocaleString('pt-MZ')} MZN!`, 'success');
  },

  addExpense: (data) => {
    const newExpense: ExpenseItem = {
      ...data,
      id: `EXP-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({
      expenses: [newExpense, ...state.expenses],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: data.registeredBy || 'Utilizador Actual',
          action: 'LANCAR_DESPESA',
          module: 'Financeiro',
          recordRef: newExpense.id,
          timestamp: 'Hoje',
          details: `Lançada despesa de ${newExpense.category}: ${newExpense.amountMzn.toLocaleString('pt-MZ')} MZN`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Despesa Registada', `Lançamento de ${data.amountMzn.toLocaleString('pt-MZ')} MZN adicionado!`, 'success');
  },

  addDocument: (data) => {
    const newDoc: DocumentItem = {
      ...data,
      id: `DOC-${Math.floor(10 + Math.random() * 90)}`,
      status: 'VALIDO',
    };
    set((state) => ({
      documents: [newDoc, ...state.documents],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'REGISTAR_DOCUMENTO',
          module: 'Documentos',
          recordRef: newDoc.docNumber,
          timestamp: 'Hoje',
          details: `Cadastrado documento ${newDoc.title} (${newDoc.docNumber}) para ${newDoc.entityName}`,
        },
        ...state.auditLogs,
      ],
    }));
    useNotificationStore.getState().addToast('Novo Documento', `Documento ${newDoc.title} arquivado!`, 'success');
  },

  addAuditLog: (action, module, recordRef, details) => {
    set((state) => ({
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action,
          module,
          recordRef,
          timestamp: 'Agora',
          details,
        },
        ...state.auditLogs,
      ],
    }));
  },

  convertQuotationToBooking: (quotationId) => {
    const state = get();
    const q = state.quotations.find((item) => item.id === quotationId);
    if (!q) return;

    const bookingNumber = `RES-2026-${Math.floor(10 + Math.random() * 90)}`;
    const newBooking: BookingItem = {
      id: `RES-${Date.now()}`,
      bookingNumber,
      customerId: q.customerId,
      customerName: q.customerName,
      serviceName: 'Transporte de Mercadorias',
      origin: q.origin,
      destination: q.destination,
      scheduledDate: q.validUntil,
      cargoDetails: q.cargoDescription,
      totalPriceMzn: q.totalPrice,
      status: 'PENDENTE',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    set({
      quotations: state.quotations.map((item) => (item.id === quotationId ? { ...item, status: 'FATURADO' } : item)),
      bookings: [newBooking, ...state.bookings],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CONVERTER_COTACAO',
          module: 'Cotações',
          recordRef: q.quotationNumber,
          timestamp: 'Hoje',
          details: `Cotação ${q.quotationNumber} convertida na Reserva ${bookingNumber}`,
        },
        ...state.auditLogs,
      ],
    });

    useNotificationStore.getState().addToast('Cotação Convertida', `Reserva ${bookingNumber} gerada a partir da cotação!`, 'success');
  },

  convertBookingToTrip: (bookingId: string) => {
    const state = get();
    const b = state.bookings.find((item) => item.id === bookingId);
    if (!b) return;

    const tripNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip: TripItem = {
      id: `TRIP-${Date.now()}`,
      tripNumber,
      customerId: b.customerId,
      customerName: b.customerName,
      serviceName: b.serviceName,
      origin: b.origin,
      destination: b.destination,
      vehiclePlate: 'Sem Viatura',
      vehicleModel: 'Por Atribuir',
      driverName: 'Sem Motorista',
      cargoDescription: b.cargoDetails,
      weightKg: 15000,
      totalPriceMzn: b.totalPriceMzn,
      status: 'CONFIRMADA',
      paymentStatus: 'PENDENTE',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    set({
      bookings: state.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'CONFIRMADA' } : item)),
      trips: [newTrip, ...state.trips],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          userName: 'Utilizador Actual',
          action: 'CONVERTER_RESERVA',
          module: 'Reservas',
          recordRef: b.bookingNumber,
          timestamp: 'Hoje',
          details: `Reserva ${b.bookingNumber} convertida na Viagem ${tripNumber}`,
        },
        ...state.auditLogs,
      ],
    });

    useNotificationStore.getState().addToast('Reserva Convertida', `Viagem ${tripNumber} criada a partir da reserva!`, 'success');
  },

  deleteCustomer: (customerId) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== customerId),
    }));
    useNotificationStore.getState().addToast('Cliente Removido', 'Cliente desativado/removido do sistema.', 'info');
  },

  updateCustomer: (id, data) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
    useNotificationStore.getState().addToast('Cliente Atualizado', 'Dados do cliente salvos com sucesso.', 'success');
  },

  deleteVehicle: (vehicleId) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== vehicleId),
    }));
    useNotificationStore.getState().addToast('Viatura Removida', 'Viatura desativada/removida da frota.', 'info');
  },

  updateVehicle: (id, data) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
    }));
    useNotificationStore.getState().addToast('Viatura Atualizada', 'Ficha da viatura salva com sucesso.', 'success');
  },

  deleteDriver: (driverId) => {
    set((state) => ({
      drivers: state.drivers.filter((d) => d.id !== driverId),
    }));
    useNotificationStore.getState().addToast('Motorista Removido', 'Motorista desativado/removido do sistema.', 'info');
  },

  updateDriver: (id, data) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
    useNotificationStore.getState().addToast('Motorista Atualizado', 'Dados do motorista salvos com sucesso.', 'success');
  },

  deleteTrip: (tripId) => {
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== tripId),
    }));
    useNotificationStore.getState().addToast('Viagem Removida', 'Viagem removida das operações.', 'info');
  },

  updateTrip: (id, data) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
    useNotificationStore.getState().addToast('Viagem Atualizada', 'Dados da viagem salvos com sucesso.', 'success');
  },

  deleteQuotation: (id) => {
    set((state) => ({
      quotations: state.quotations.filter((q) => q.id !== id),
    }));
    useNotificationStore.getState().addToast('Cotação Removida', 'Cotação eliminada do sistema.', 'info');
  },

  updateQuotation: (id, data) => {
    set((state) => ({
      quotations: state.quotations.map((q) => (q.id === id ? { ...q, ...data } : q)),
    }));
    useNotificationStore.getState().addToast('Cotação Atualizada', 'Proposta de cotação salva com sucesso.', 'success');
  },

  deleteBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    }));
    useNotificationStore.getState().addToast('Reserva Removida', 'Reserva eliminada do sistema.', 'info');
  },

  updateBooking: (id, data) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...data } : b)),
    }));
    useNotificationStore.getState().addToast('Reserva Atualizada', 'Reserva salva com sucesso.', 'success');
  },

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    }));
    useNotificationStore.getState().addToast('Fatura Removida', 'Fatura eliminada do sistema.', 'info');
  },

  updateInvoice: (id, data) => {
    set((state) => ({
      invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...data } : i)),
    }));
    useNotificationStore.getState().addToast('Fatura Atualizada', 'Fatura salva com sucesso.', 'success');
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
    useNotificationStore.getState().addToast('Despesa Removida', 'Despesa eliminada do sistema.', 'info');
  },

  updateExpense: (id, data) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
    useNotificationStore.getState().addToast('Despesa Atualizada', 'Despesa salva com sucesso.', 'success');
  },

  deleteDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    }));
    useNotificationStore.getState().addToast('Documento Removido', 'Documento eliminado da central.', 'info');
  },

  updateDocument: (id, data) => {
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
    useNotificationStore.getState().addToast('Documento Atualizado', 'Documento salvo com sucesso.', 'success');
  },

  addService: (serviceData) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    set((state) => ({
      services: [newService, ...state.services],
    }));
    useNotificationStore.getState().addToast('Serviço Registado', `Serviço ${newService.name} adicionado com sucesso.`, 'success');
  },

  updateService: (id, data) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
    useNotificationStore.getState().addToast('Serviço Atualizado', 'Serviço salvo com sucesso.', 'success');
  },

  deleteService: (id) => {
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
    useNotificationStore.getState().addToast('Serviço Removido', 'Serviço eliminado do catálogo.', 'info');
  },

  addRoute: (routeData) => {
    const newRoute: RouteItem = {
      ...routeData,
      id: `rot-${Date.now()}`,
      totalTripsCount: 0,
      totalRevenueMzn: 0,
      status: 'ATIVA',
    };
    set((state) => ({
      routes: [newRoute, ...state.routes],
    }));
    useNotificationStore.getState().addToast('Corredor / Rota Registada', `Rota ${newRoute.name} adicionada com sucesso.`, 'success');
  },

  updateRoute: (id, data) => {
    set((state) => ({
      routes: state.routes.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
    useNotificationStore.getState().addToast('Corredor / Rota Atualizada', 'Dados da rota salvos com sucesso.', 'success');
  },

  deleteRoute: (id) => {
    set((state) => ({
      routes: state.routes.filter((r) => r.id !== id),
    }));
    useNotificationStore.getState().addToast('Rota Removida', 'Corredor eliminado do tarifário.', 'info');
  },
}));
