import { create } from 'zustand';
import { useNotificationStore } from './useNotificationStore';

export interface CustomerItem {
  id: string;
  name: string;
  nuit: string;
  email: string;
  phone: string;
  isCorporate: boolean;
  status: string;
  createdAt: string;
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
  status: string;
  createdAt: string;
}

export interface VehicleItem {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'OPERACIONAL' | 'EM_VIAGEM' | 'MANUTENCAO';
  mileageKm: number;
  driverName?: string;
  isAvailable: boolean;
  nextOilChangeKm: number;
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
  status: 'DISPONIVEL' | 'EM_VIAGEM' | 'FOLGA';
  isAvailable: boolean;
  docStatus: 'VALIDO' | 'ALERTA_EXPIRACAO' | 'EXPIRADO';
}

export interface FuelLogItem {
  id: string;
  date: string;
  vehiclePlate: string;
  driverName: string;
  stationName: 'Petromoc' | 'Galp' | 'TotalEnergies' | 'Engen';
  liters: number;
  totalCostMzn: number;
  currentKm: number;
  consumptionL100Km: number;
}

export interface MaintenanceLogItem {
  id: string;
  date: string;
  vehiclePlate: string;
  type: 'TROCA_OLEO' | 'SUBSTITUICAO_PNEUS' | 'REVISAO_TRAVOES' | 'INSPECAO_GERAL';
  description: string;
  costMzn: number;
  kmAtService: number;
  technician: string;
}

export interface TripItem {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  status: 'ALOCADO' | 'EM_TRANSITO' | 'CONCLUIDO' | 'CANCELADO';
  vehicleId?: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId?: string;
  driverName: string;
  cargoDescription: string;
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
  status: 'PENDENTE' | 'PAGO_PARCIAL' | 'PAGO';
  dueDate: string;
  createdAt: string;
}

export interface LoadItem {
  id: string;
  client: string;
  origin: string;
  destination: string;
  cargo: string;
  truck: string;
  driver: string;
  status: 'CARREGAMENTO' | 'EM_TRANSITO' | 'ALFANDEGA' | 'CONCLUIDO';
  statusLabel: string;
  statusColor: string;
  departureDate: string;
  eta: string;
}

interface ErpState {
  companyProfile: {
    name: string;
    nuit: string;
    address: string;
    city: string;
    phones: string[];
    emails: string[];
    capitalSocial: string;
    logoUrl?: string;
  };
  customers: CustomerItem[];
  quotations: QuotationItem[];
  vehicles: VehicleItem[];
  drivers: DriverItem[];
  trips: TripItem[];
  invoices: InvoiceItem[];
  loads: LoadItem[];
  fuelLogs: FuelLogItem[];
  maintenanceLogs: MaintenanceLogItem[];

  // Actions
  updateCompanyProfile: (profile: Partial<ErpState['companyProfile']>) => void;
  addCustomer: (customer: Omit<CustomerItem, 'id' | 'createdAt' | 'status'>) => void;
  addQuotation: (quotation: Omit<QuotationItem, 'id' | 'quotationNumber' | 'createdAt' | 'taxAmount' | 'totalPrice'>) => void;
  addVehicle: (vehicle: Omit<VehicleItem, 'id' | 'status' | 'isAvailable' | 'nextOilChangeKm' | 'tyreInspectionStatus'>) => void;
  addDriver: (driver: Omit<DriverItem, 'id' | 'status' | 'isAvailable' | 'docStatus'>) => void;
  addFuelLog: (log: Omit<FuelLogItem, 'id' | 'date' | 'consumptionL100Km'>) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLogItem, 'id' | 'date'>) => void;
  addTrip: (trip: Omit<TripItem, 'id' | 'tripNumber' | 'createdAt' | 'status'>) => void;
  updateTripStatus: (tripId: string, newStatus: 'EM_TRANSITO' | 'CONCLUIDO' | 'CANCELADO') => void;
  payInvoice: (invoiceId: string, amount: number) => void;
  addLoad: (load: Omit<LoadItem, 'id' | 'status' | 'statusLabel' | 'statusColor' | 'departureDate' | 'eta'> & { status?: 'CARREGAMENTO' | 'EM_TRANSITO' | 'ALFANDEGA' | 'CONCLUIDO' }) => void;
  advanceLoadStatus: (loadId: string) => void;
  convertQuotationToInvoice: (quotationId: string) => void;
}

export const useErpStore = create<ErpState>((set, get) => ({
  companyProfile: {
    name: "N' Tandinho Transportes & Logística S.A.",
    nuit: '400192834',
    address: 'Av. Eduardo Mondlane, Edifício Central',
    city: 'Nampula, Moçambique',
    phones: ['+258 84 000 0000', '+258 82 000 0000'],
    emails: ['comercial@ntandinho.co.mz', 'geral@ntandinho.co.mz'],
    capitalSocial: '5.000.000 MZN',
    logoUrl: '',
  },

  customers: [
    {
      id: 'CLI-001',
      name: 'Cervejas de Moçambique (CDM S.A.)',
      nuit: '400192834',
      email: 'logistica@cdm.co.mz',
      phone: '+258 21 480 100',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-01-15',
    },
    {
      id: 'CLI-002',
      name: 'Mozal S.A.',
      nuit: '400551920',
      email: 'supply@mozal.com',
      phone: '+258 21 720 000',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-02-10',
    },
    {
      id: 'CLI-003',
      name: 'Vulcan Minerals Moçambique',
      nuit: '400998811',
      email: 'transporte@vulcan.co.mz',
      phone: '+258 25 220 900',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-03-01',
    },
    {
      id: 'CLI-004',
      name: 'Coca-Cola Sabco Moçambique',
      nuit: '400281920',
      email: 'expedicao@cocacola.co.mz',
      phone: '+258 21 720 300',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-03-15',
    },
    {
      id: 'CLI-005',
      name: 'Cimentos de Moçambique S.A.',
      nuit: '400334812',
      email: 'distribuicao@cimentos.co.mz',
      phone: '+258 21 350 200',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-04-02',
    },
    {
      id: 'CLI-006',
      name: 'Fazendas Agrícolas de Nampula Lda',
      nuit: '400551928',
      email: 'compras@fazendasnampula.co.mz',
      phone: '+258 26 218 440',
      isCorporate: true,
      status: 'ATIVO',
      createdAt: '2026-04-12',
    },
  ],

  quotations: [
    {
      id: 'COT-01',
      quotationNumber: 'COT-2026-001',
      customerId: 'CLI-001',
      customerName: 'Cervejas de Moçambique (CDM)',
      origin: 'Maputo',
      destination: 'Nampula',
      cargoDescription: 'Paletes de Cerveja 2M em Container 40ft',
      weightKg: 28000,
      priceSubtotal: 350000,
      taxAmount: 56000,
      totalPrice: 406000,
      currency: 'MZN',
      status: 'APROVADA',
      createdAt: '2026-08-01',
    },
  ],

  vehicles: [
    {
      id: 'veh-1',
      plateNumber: 'ABM-849-MC',
      make: 'Volvo',
      model: 'FH16 750 HP (3 Eixos)',
      year: 2024,
      status: 'EM_VIAGEM',
      mileageKm: 124500,
      driverName: 'João Mucavel',
      isAvailable: false,
      nextOilChangeKm: 130000,
      tyreInspectionStatus: 'BOM',
    },
    {
      id: 'veh-2',
      plateNumber: 'AFK-302-MC',
      make: 'Scania',
      model: 'R500 V8 Streamline',
      year: 2023,
      status: 'EM_VIAGEM',
      mileageKm: 88200,
      driverName: 'Mateus Sitoe',
      isAvailable: false,
      nextOilChangeKm: 90000,
      tyreInspectionStatus: 'ATENCAO',
    },
    {
      id: 'veh-3',
      plateNumber: 'AGG-119-MC',
      make: 'DAF',
      model: 'XF 530 Super Space Cab',
      year: 2025,
      status: 'OPERACIONAL',
      mileageKm: 45000,
      driverName: 'Carlos Alberto Nhantumbo',
      isAvailable: true,
      nextOilChangeKm: 60000,
      tyreInspectionStatus: 'BOM',
    },
  ],

  drivers: [
    {
      id: 'drv-1',
      name: 'João Mucavel',
      licenseNumber: 'C-901823 (Pesados)',
      licenseExpDate: '2027-11-20',
      passportExpDate: '2026-09-01', // Alert: expiring soon!
      sadcVisaExpDate: '2027-05-15',
      phone: '+258 84 901 8822',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'ALERTA_EXPIRACAO',
    },
    {
      id: 'drv-2',
      name: 'Mateus Sitoe',
      licenseNumber: 'C-445129 (Pesados)',
      licenseExpDate: '2028-04-10',
      passportExpDate: '2029-01-15',
      sadcVisaExpDate: '2028-08-20',
      phone: '+258 82 445 1199',
      status: 'EM_VIAGEM',
      isAvailable: false,
      docStatus: 'VALIDO',
    },
    {
      id: 'drv-3',
      name: 'Carlos Alberto Nhantumbo',
      licenseNumber: 'C-772910 (Pesados)',
      licenseExpDate: '2026-08-25', // Alert: expiring in 18 days!
      passportExpDate: '2028-06-12',
      sadcVisaExpDate: '2027-12-01',
      phone: '+258 84 772 9900',
      status: 'DISPONIVEL',
      isAvailable: true,
      docStatus: 'ALERTA_EXPIRACAO',
    },
  ],

  trips: [
    {
      id: 'trip-1',
      tripNumber: 'TRIP-2026-901',
      origin: 'Maputo',
      destination: 'Nampula',
      status: 'EM_TRANSITO',
      vehiclePlate: 'ABM-849-MC',
      vehicleModel: 'Volvo FH16 750 HP',
      driverName: 'João Mucavel',
      cargoDescription: 'Cerveja 2M em Paletes (32 Toneladas)',
      createdAt: '2026-08-05',
    },
  ],

  invoices: [
    {
      id: 'inv-1',
      invoiceNumber: 'FT-2026-001',
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
  ],

  loads: [
    {
      id: 'ORD-2026-901',
      client: 'Cervejas de Moçambique (CDM)',
      origin: 'Maputo (Fábrica)',
      destination: 'Depósito Nampula',
      cargo: 'Cerveja 2M & Laurentina (32 Toneladas)',
      truck: 'Volvo FH16 (ABM-849-MC)',
      driver: 'João Mucavel',
      status: 'EM_TRANSITO',
      statusLabel: 'Em Trânsito',
      statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      departureDate: '06/Ago/2026',
      eta: '08/Ago/2026',
    },
  ],

  fuelLogs: [
    {
      id: 'fuel-1',
      date: '2026-08-06',
      vehiclePlate: 'ABM-849-MC',
      driverName: 'João Mucavel',
      stationName: 'Petromoc',
      liters: 450,
      totalCostMzn: 42300,
      currentKm: 124500,
      consumptionL100Km: 32.4,
    },
    {
      id: 'fuel-2',
      date: '2026-08-05',
      vehiclePlate: 'AFK-302-MC',
      driverName: 'Mateus Sitoe',
      stationName: 'Galp',
      liters: 380,
      totalCostMzn: 35720,
      currentKm: 88200,
      consumptionL100Km: 33.1,
    },
  ],

  maintenanceLogs: [
    {
      id: 'maint-1',
      date: '2026-07-28',
      vehiclePlate: 'ABM-849-MC',
      type: 'TROCA_OLEO',
      description: 'Substituição de óleo sintético Castrol Enduron 10W-40 e filtros de ar',
      costMzn: 24500,
      kmAtService: 120000,
      technician: 'Oficina Central Nampula',
    },
  ],

  // Actions
  updateCompanyProfile: (profile) => {
    set((state) => ({
      companyProfile: { ...state.companyProfile, ...profile },
    }));
    useNotificationStore.getState().addToast('Perfil da Empresa', 'Dados de contacto e localização atualizados com sucesso!', 'success');
  },

  addCustomer: (data) => {
    const newCustomer: CustomerItem = {
      ...data,
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ATIVO',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({ customers: [newCustomer, ...state.customers] }));
    useNotificationStore.getState().addToast('Novo Cliente', `Cliente "${newCustomer.name}" adicionado!`, 'success');
  },

  addQuotation: (data) => {
    const quotationNumber = `COT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const taxAmount = Math.round(data.priceSubtotal * 0.16 * 100) / 100;
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
    set((state) => ({ quotations: [newQuotation, ...state.quotations] }));
    useNotificationStore.getState().addToast('Nova Cotação', `Cotação ${quotationNumber} emitida com sucesso!`, 'success');
  },

  addVehicle: (data) => {
    const newVehicle: VehicleItem = {
      ...data,
      id: `veh-${Date.now()}`,
      status: 'OPERACIONAL',
      isAvailable: true,
      nextOilChangeKm: data.mileageKm + 15000,
      tyreInspectionStatus: 'BOM',
    };
    set((state) => ({ vehicles: [newVehicle, ...state.vehicles] }));
    useNotificationStore.getState().addToast('Nova Viatura', `Camião ${newVehicle.plateNumber} registado na frota!`, 'success');
  },

  addDriver: (data) => {
    const newDriver: DriverItem = {
      ...data,
      id: `drv-${Date.now()}`,
      status: 'DISPONIVEL',
      isAvailable: true,
      docStatus: 'VALIDO',
    };
    set((state) => ({ drivers: [newDriver, ...state.drivers] }));
    useNotificationStore.getState().addToast('Novo Motorista', `Motorista ${newDriver.name} credenciado!`, 'success');
  },

  addFuelLog: (data) => {
    const consumptionL100Km = 32.5; // Calculated average
    const newLog: FuelLogItem = {
      ...data,
      id: `fuel-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      consumptionL100Km,
    };
    set((state) => ({ fuelLogs: [newLog, ...state.fuelLogs] }));
    useNotificationStore.getState().addToast('Vale de Combustível', `Abastecimento de ${data.liters}L para ${data.vehiclePlate} registado!`, 'success');
  },

  addMaintenanceLog: (data) => {
    const newLog: MaintenanceLogItem = {
      ...data,
      id: `maint-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({ maintenanceLogs: [newLog, ...state.maintenanceLogs] }));
    useNotificationStore.getState().addToast('Manutenção Programada', `Intervenção técnica no camião ${data.vehiclePlate} lançada!`, 'success');
  },

  addTrip: (data) => {
    const tripNumber = `TRIP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newTrip: TripItem = {
      ...data,
      id: `trip-${Date.now()}`,
      tripNumber,
      status: 'ALOCADO',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    set((state) => ({
      trips: [newTrip, ...state.trips],
      vehicles: state.vehicles.map((v) =>
        v.plateNumber === data.vehiclePlate ? { ...v, status: 'EM_VIAGEM', driverName: data.driverName, isAvailable: false } : v
      ),
      drivers: state.drivers.map((d) =>
        d.name === data.driverName ? { ...d, status: 'EM_VIAGEM', isAvailable: false } : d
      ),
    }));

    useNotificationStore.getState().addToast('Nova Viagem', `Viagem ${tripNumber} alocada com sucesso!`, 'success');
  },

  updateTripStatus: (tripId, newStatus) => {
    const state = get();
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;

    let updatedInvoices = [...state.invoices];
    let updatedVehicles = [...state.vehicles];
    let updatedDrivers = [...state.drivers];

    if (newStatus === 'CONCLUIDO') {
      updatedVehicles = updatedVehicles.map((v) =>
        v.plateNumber === trip.vehiclePlate ? { ...v, status: 'OPERACIONAL', isAvailable: true } : v
      );
      updatedDrivers = updatedDrivers.map((d) =>
        d.name === trip.driverName ? { ...d, status: 'DISPONIVEL', isAvailable: true } : d
      );

      const invNum = `FT-2026-${Math.floor(100 + Math.random() * 900)}`;
      const subtotal = 350000;
      const taxAmount = Math.round(subtotal * 0.16);
      const totalAmount = subtotal + taxAmount;
      const newInvoice: InvoiceItem = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNum,
        tripId: trip.id,
        customerId: 'CLI-001',
        customerName: 'Cervejas de Moçambique (CDM S.A.)',
        subtotal,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        currency: 'MZN',
        status: 'PENDENTE',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      updatedInvoices = [newInvoice, ...updatedInvoices];

      useNotificationStore.getState().addToast(
        'Viagem Concluída',
        `Viagem ${trip.tripNumber} finalizada! Camião/motorista libertados e Fatura ${invNum} gerada.`,
        'success'
      );
    }

    set({
      trips: state.trips.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t)),
      vehicles: updatedVehicles,
      drivers: updatedDrivers,
      invoices: updatedInvoices,
    });
  },

  payInvoice: (invoiceId, amount) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.paidAmount + amount;
        let newStatus: 'PENDENTE' | 'PAGO_PARCIAL' | 'PAGO' = 'PAGO_PARCIAL';
        if (newPaid >= inv.totalAmount) newStatus = 'PAGO';
        return {
          ...inv,
          paidAmount: newPaid,
          status: newStatus,
        };
      }),
    }));
    useNotificationStore.getState().addToast('Recibo de Pagamento', `Recibo de ${amount.toLocaleString('pt-MZ')} MZN registado!`, 'success');
  },

  addLoad: (data) => {
    const newLoad: LoadItem = {
      ...data,
      id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'EM_TRANSITO',
      statusLabel: 'Em Trânsito',
      statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      departureDate: new Date().toISOString().slice(0, 10),
      eta: 'Em 2 dias',
    };
    set((state) => ({ loads: [newLoad, ...state.loads] }));
    useNotificationStore.getState().addToast('Ordem de Carga', `Guia de Transporte ${newLoad.id} emitida com sucesso!`, 'success');
  },

  advanceLoadStatus: (loadId) => {
    set((state) => {
      const target = state.loads.find((l) => l.id === loadId);
      if (!target) return state;

      let nextStatus: LoadItem['status'] = 'EM_TRANSITO';
      let label = 'Em Trânsito';
      let color = 'bg-sky-500/10 text-sky-400 border-sky-500/20';

      if (target.status === 'CARREGAMENTO') {
        nextStatus = 'EM_TRANSITO';
        label = 'Em Trânsito';
        color = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      } else if (target.status === 'EM_TRANSITO') {
        nextStatus = 'ALFANDEGA';
        label = 'Alfândega SADC';
        color = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      } else if (target.status === 'ALFANDEGA') {
        nextStatus = 'CONCLUIDO';
        label = 'Concluído';
        color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      }

      useNotificationStore.getState().addToast(
        'Automação de Despacho',
        `Ordem de Carga ${target.id} avançada para: ${label}`,
        'info'
      );

      return {
        loads: state.loads.map((l) =>
          l.id === loadId ? { ...l, status: nextStatus, statusLabel: label, statusColor: color } : l
        ),
      };
    });
  },

  convertQuotationToInvoice: (quotationId) => {
    const state = get();
    const q = state.quotations.find((item) => item.id === quotationId);
    if (!q) return;

    const invNum = `FT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      customerId: q.customerId,
      customerName: q.customerName,
      subtotal: q.priceSubtotal,
      taxAmount: q.taxAmount,
      totalAmount: q.totalPrice,
      paidAmount: 0,
      currency: 'MZN',
      status: 'PENDENTE',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    set({
      quotations: state.quotations.map((item) =>
        item.id === quotationId ? { ...item, status: 'FATURADO' } : item
      ),
      invoices: [newInvoice, ...state.invoices],
    });

    useNotificationStore.getState().addToast(
      'Faturação Automática',
      `Cotação ${q.quotationNumber} convertida na Fatura ${invNum}!`,
      'success'
    );
  },
}));
