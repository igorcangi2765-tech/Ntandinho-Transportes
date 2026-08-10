import {
  User,
  AuditLog,
  Order,
  Trip,
  Customer,
  Vehicle,
  Driver,
  ServiceItem,
  Invoice,
  Budget,
  FinancialTransaction,
  NotificationItem,
  CompanySettings
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Tandinho Macuacua',
    email: 'tandinho@ntandinho.co.mz',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    phone: '+258 84 100 2000',
    department: 'Direção Geral',
    active: true,
    lastLogin: '2026-08-06 12:30'
  },
  {
    id: 'usr-2',
    name: 'Amélia Nhantumbo',
    email: 'amelia.n@ntandinho.co.mz',
    role: 'GESTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    phone: '+258 84 300 4000',
    department: 'Operações & Logística',
    active: true,
    lastLogin: '2026-08-06 11:15'
  },
  {
    id: 'usr-3',
    name: 'Mateus Langa',
    email: 'mateus.l@ntandinho.co.mz',
    role: 'OPERADOR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    phone: '+258 84 500 6000',
    department: 'Gestão de Frotas',
    active: true,
    lastLogin: '2026-08-06 09:45'
  },
  {
    id: 'usr-4',
    name: 'Celeste Mabote',
    email: 'financeiro@ntandinho.co.mz',
    role: 'FINANCEIRO',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    phone: '+258 84 700 8000',
    department: 'Finanças & Contabilidade',
    active: true,
    lastLogin: '2026-08-06 10:00'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Cervejas de Moçambique (CDM)',
    companyName: 'CDM S.A.',
    nuit: '400129841',
    email: 'logistica@cdm.co.mz',
    phone: '+258 21 480 000',
    city: 'Nampula',
    address: 'Zona Industrial de Nampula, Av. das Indústrias #102',
    totalTrips: 48,
    totalSpentMzn: 8450000,
    rating: 5,
    status: 'ATIVO',
    registrationDate: '2024-01-15',
    notes: 'Cliente preferencial com pagamentos em dia (Prazo 30 dias).'
  },
  {
    id: 'cust-2',
    name: 'Mozal Alumínio S.A.',
    companyName: 'Mozal SARL',
    nuit: '400088123',
    email: 'procurement@mozal.com',
    phone: '+258 21 730 000',
    city: 'Maputo / Beluluane',
    address: 'Parque Industrial de Beluluane, Matola',
    totalTrips: 32,
    totalSpentMzn: 12100000,
    rating: 4.9,
    status: 'ATIVO',
    registrationDate: '2024-03-20',
    notes: 'Requer inspecção técnica rigorosa dos caminhões antes de cada viagem.'
  },
  {
    id: 'cust-3',
    name: 'Porto de Nacala Logistics',
    companyName: 'Nacala Corridor Logistics Limitada',
    nuit: '400567890',
    email: 'operacoes@nacalacorridor.mz',
    phone: '+258 26 526 100',
    city: 'Nacala-Porto',
    address: 'Terminal de Contentores de Nacala',
    totalTrips: 27,
    totalSpentMzn: 6800000,
    rating: 4.7,
    status: 'ATIVO',
    registrationDate: '2024-06-10',
    notes: 'Especialista em transporte intermodal e carga geral.'
  },
  {
    id: 'cust-4',
    name: 'Tropigalia Distribuição',
    companyName: 'Tropigalia Moçambique Lda',
    nuit: '400345678',
    email: 'faturas@tropigalia.co.mz',
    phone: '+258 21 901 234',
    city: 'Beira',
    address: 'Estrada Nacional EN6, Manga - Beira',
    totalTrips: 19,
    totalSpentMzn: 3950000,
    rating: 4.5,
    status: 'ATIVO',
    registrationDate: '2024-09-01'
  },
  {
    id: 'cust-5',
    name: 'Agro-Pequena Moçambique',
    companyName: 'AgroPequena Lda',
    nuit: '400998877',
    email: 'contato@agropequena.mz',
    phone: '+258 26 212 345',
    city: 'Gurué',
    address: 'Distrito de Gurué, Província da Zambézia',
    totalTrips: 14,
    totalSpentMzn: 2100000,
    rating: 4.8,
    status: 'ATIVO',
    registrationDate: '2025-02-14'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    plate: 'AFB-482-MC',
    brand: 'Volvo',
    model: 'FH 540 6x4',
    year: 2023,
    capacityTons: 34,
    mileageKm: 124500,
    status: 'EM_VIAGEM',
    insuranceExpiry: '2027-01-15',
    inspectionExpiry: '2026-11-30',
    fuelType: 'Diesel S10',
    assignedDriverName: 'Januário Munguambe',
    maintenances: [
      { id: 'm-1', date: '2026-06-10', type: 'PREVENTIVA', description: 'Troca de óleos, filtros e revisão dos travões', costMzn: 85000, mechanicShop: 'AutoNampula Serv' }
    ]
  },
  {
    id: 'veh-2',
    plate: 'AEM-903-MP',
    brand: 'Scania',
    model: 'R 500 Streamline',
    year: 2022,
    capacityTons: 30,
    mileageKm: 189200,
    status: 'DISPONIVEL',
    insuranceExpiry: '2026-09-20',
    inspectionExpiry: '2026-08-15',
    fuelType: 'Diesel S10',
    assignedDriverName: 'Bernardo Sitoe',
    maintenances: [
      { id: 'm-2', date: '2026-05-18', type: 'CORRETIVA', description: 'Substituição de 4 pneus traseiros e calibração', costMzn: 140000, mechanicShop: 'Pneus da Beira Lda' }
    ]
  },
  {
    id: 'veh-3',
    plate: 'AIK-112-MC',
    brand: 'MAN',
    model: 'TGX 26.480',
    year: 2024,
    capacityTons: 32,
    mileageKm: 65000,
    status: 'EM_VIAGEM',
    insuranceExpiry: '2027-04-10',
    inspectionExpiry: '2027-03-01',
    fuelType: 'Diesel S10',
    assignedDriverName: 'Fausto Machava',
    maintenances: []
  },
  {
    id: 'veh-4',
    plate: 'ADC-774-MN',
    brand: 'Mercedes-Benz',
    model: 'Actros 3344',
    year: 2021,
    capacityTons: 28,
    mileageKm: 240100,
    status: 'MANUTENCAO',
    insuranceExpiry: '2026-10-05',
    inspectionExpiry: '2026-08-28',
    fuelType: 'Diesel',
    assignedDriverName: 'Dinis Tembe',
    maintenances: [
      { id: 'm-3', date: '2026-08-02', type: 'CORRETIVA', description: 'Reparação do sistema hidráulico e suspensão pneumática', costMzn: 115000, mechanicShop: 'Oficina Central Nampula' }
    ]
  },
  {
    id: 'veh-5',
    plate: 'AGG-305-MC',
    brand: 'Volvo',
    model: 'FMX 460',
    year: 2023,
    capacityTons: 30,
    mileageKm: 98000,
    status: 'DISPONIVEL',
    insuranceExpiry: '2026-12-19',
    inspectionExpiry: '2026-12-01',
    fuelType: 'Diesel S10',
    maintenances: []
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Januário Munguambe',
    email: 'januario.m@ntandinho.co.mz',
    phone: '+258 84 911 2233',
    licenseNumber: 'MZ-8849201-CE',
    licenseCategory: 'CE + Perigosas',
    licenseExpiry: '2028-05-12',
    assignedVehiclePlate: 'AFB-482-MC',
    assignedVehicleId: 'veh-1',
    status: 'EM_VIAGEM',
    rating: 4.9,
    totalTrips: 84,
    hireDate: '2022-03-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'drv-2',
    name: 'Bernardo Sitoe',
    email: 'bernardo.s@ntandinho.co.mz',
    phone: '+258 84 222 3344',
    licenseNumber: 'MZ-7738192-CE',
    licenseCategory: 'CE',
    licenseExpiry: '2027-11-20',
    assignedVehiclePlate: 'AEM-903-MP',
    assignedVehicleId: 'veh-2',
    status: 'DISPONIVEL',
    rating: 4.8,
    totalTrips: 62,
    hireDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'drv-3',
    name: 'Fausto Machava',
    email: 'fausto.m@ntandinho.co.mz',
    phone: '+258 84 444 5566',
    licenseNumber: 'MZ-9920184-CE',
    licenseCategory: 'CE + SADC International',
    licenseExpiry: '2029-01-10',
    assignedVehiclePlate: 'AIK-112-MC',
    assignedVehicleId: 'veh-3',
    status: 'EM_VIAGEM',
    rating: 5.0,
    totalTrips: 110,
    hireDate: '2021-08-01',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'drv-4',
    name: 'Dinis Tembe',
    email: 'dinis.t@ntandinho.co.mz',
    phone: '+258 84 666 7788',
    licenseNumber: 'MZ-6648392-CE',
    licenseCategory: 'CE',
    licenseExpiry: '2026-10-18',
    assignedVehiclePlate: 'ADC-774-MN',
    assignedVehicleId: 'veh-4',
    status: 'DESCANSO',
    rating: 4.6,
    totalTrips: 45,
    hireDate: '2023-09-10',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    code: 'PED-2026-089',
    customerId: 'cust-1',
    customerName: 'Cervejas de Moçambique (CDM)',
    serviceType: 'Transporte de Mercadorias',
    origin: 'Nampula (Fábrica CDM)',
    destination: 'Pemba (Centro de Distribuição)',
    cargoType: 'Bebidas e Paletes Cerveja',
    weightTons: 28,
    valueMzn: 380000,
    requestDate: '2026-08-05 14:20',
    desiredDate: '2026-08-08',
    status: 'APROVADO',
    notes: 'Carregamento prioritário na manhã de 8 de Agosto.'
  },
  {
    id: 'ord-102',
    code: 'PED-2026-090',
    customerId: 'cust-2',
    customerName: 'Mozal Alumínio S.A.',
    serviceType: 'Transporte Internacional (SADC)',
    origin: 'Matola / Beluluane',
    destination: 'Joanesburgo (Área Industrial RSA)',
    cargoType: 'Lingotes de Alumínio Exportação',
    weightTons: 32,
    valueMzn: 920000,
    requestDate: '2026-08-06 09:10',
    desiredDate: '2026-08-10',
    status: 'NOVO',
    notes: 'Transporte internacional via fronteira de Ressano Garcia.'
  },
  {
    id: 'ord-103',
    code: 'PED-2026-091',
    customerId: 'cust-3',
    customerName: 'Porto de Nacala Logistics',
    serviceType: 'Carga Geral',
    origin: 'Porto de Nacala',
    destination: 'Blantyre (Malawi)',
    cargoType: 'Contentor 40ft Maersk',
    weightTons: 26,
    valueMzn: 740000,
    requestDate: '2026-08-04 11:00',
    desiredDate: '2026-08-07',
    status: 'EM_ANALISE',
    notes: 'Aguardando desalfandegamento de documentos no Porto de Nacala.'
  },
  {
    id: 'ord-104',
    code: 'PED-2026-085',
    customerId: 'cust-4',
    customerName: 'Tropigalia Distribuição',
    serviceType: 'Aluguer de Caminhões',
    origin: 'Beira',
    destination: 'Chimoio / Manica',
    cargoType: 'Produtos Alimentares FMCG',
    weightTons: 22,
    valueMzn: 290000,
    requestDate: '2026-08-01 08:30',
    desiredDate: '2026-08-03',
    status: 'EM_CURSO',
    convertedTripId: 'tr-501',
    notes: 'Caminhão com reboque fechado.'
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'tr-501',
    code: 'VIA-2026-044',
    orderId: 'ord-104',
    customerId: 'cust-4',
    customerName: 'Tropigalia Distribuição',
    driverId: 'drv-1',
    driverName: 'Januário Munguambe',
    vehicleId: 'veh-1',
    vehiclePlate: 'AFB-482-MC',
    origin: 'Porto da Beira',
    destination: 'Nampula Central',
    cargoType: 'Produtos Alimentares Processados',
    weightTons: 30,
    valueMzn: 520000,
    startDate: '2026-08-04 06:00',
    estimatedEndDate: '2026-08-07 18:00',
    status: 'EM_TRANSITO',
    timeline: [
      { id: 'tl-1', title: 'Carregamento Concluído', description: 'Carga inspecionada e selada na Beira', timestamp: '2026-08-04 08:30', location: 'Beira', status: 'DONE' },
      { id: 'tl-2', title: 'Passagem por Caia / Ponte Guebuza', description: 'Check-in de segurança no posto fiscal', timestamp: '2026-08-05 13:15', location: 'Caia (Rio Zambeze)', status: 'DONE' },
      { id: 'tl-3', title: 'Em Trânsito EN1 Norte', description: 'Aproximação a Alto Molócuè', timestamp: '2026-08-06 10:00', location: 'Alto Molócuè', status: 'IN_PROGRESS' },
      { id: 'tl-4', title: 'Chegada e Descarregamento', description: 'Entrega final ao armazém Tropigalia Nampula', timestamp: '2026-08-07 16:00', location: 'Nampula', status: 'PENDING' }
    ],
    notes: 'Condições meteorológicas estáveis durante o percurso.'
  },
  {
    id: 'tr-502',
    code: 'VIA-2026-043',
    customerId: 'cust-3',
    customerName: 'Porto de Nacala Logistics',
    driverId: 'drv-3',
    driverName: 'Fausto Machava',
    vehicleId: 'veh-3',
    vehiclePlate: 'AIK-112-MC',
    origin: 'Porto de Nacala',
    destination: 'Lilongwe (Malawi Corredor SADC)',
    cargoType: 'Fertilizantes Agrícolas Ensacados',
    weightTons: 32,
    valueMzn: 890000,
    startDate: '2026-08-03 07:00',
    estimatedEndDate: '2026-08-08 12:00',
    status: 'EM_TRANSITO',
    timeline: [
      { id: 'tl-10', title: 'Saída do Porto de Nacala', description: 'Conceção de trânsito internacional emitida', timestamp: '2026-08-03 09:00', location: 'Nacala', status: 'DONE' },
      { id: 'tl-11', title: 'Trânsito por Cuamba', description: 'Inspeção de rotina da Polícia de Trânsito', timestamp: '2026-08-04 16:20', location: 'Cuamba', status: 'DONE' },
      { id: 'tl-12', title: 'Posto Fronteiriço de Mandimba', description: 'Processamento aduaneiro Moçambique-Malawi', timestamp: '2026-08-06 08:30', location: 'Mandimba / Mangochi', status: 'IN_PROGRESS' },
      { id: 'tl-13', title: 'Entrega Lilongwe Hub', description: 'Descarga no terminal agro', timestamp: '2026-08-08 11:00', location: 'Lilongwe', status: 'PENDING' }
    ]
  },
  {
    id: 'tr-503',
    code: 'VIA-2026-041',
    customerId: 'cust-1',
    customerName: 'Cervejas de Moçambique (CDM)',
    driverId: 'drv-2',
    driverName: 'Bernardo Sitoe',
    vehicleId: 'veh-2',
    vehiclePlate: 'AEM-903-MP',
    origin: 'Nampula',
    destination: 'Lichinga (Niassa)',
    cargoType: 'Bebidas em Garrafa',
    weightTons: 28,
    valueMzn: 430000,
    startDate: '2026-07-28 06:00',
    estimatedEndDate: '2026-07-31 15:00',
    actualEndDate: '2026-07-31 14:10',
    status: 'CONCLUIDA',
    timeline: [
      { id: 'tl-20', title: 'Saída da Fábrica', description: 'Viagem iniciada com sucesso', timestamp: '2026-07-28 06:15', location: 'Nampula', status: 'DONE' },
      { id: 'tl-21', title: 'Chegada a Lichinga', description: 'Descarga efetuada com 0 avarias', timestamp: '2026-07-31 14:10', location: 'Lichinga', status: 'DONE' }
    ]
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Aluguer de Caminhões com Reboque',
    category: 'Aluguer de Caminhões',
    description: 'Disponibilização de caminhões Volvo/Scania de 28 a 34 toneladas com motorista experiente por dia ou por viagem.',
    baseRatePerKmMzn: 140,
    baseRatePerTonMzn: 850,
    active: true,
    totalOrdersCount: 64,
    popularRoutes: ['Maputo - Nampula', 'Beira - Tete', 'Nampula - Pemba']
  },
  {
    id: 'srv-2',
    name: 'Transporte de Mercadorias e Produtos Processados',
    category: 'Transporte de Mercadorias',
    description: 'Logística integrada para distribuição industrial, bebidas, alimentos e bens de consumo massivo.',
    baseRatePerKmMzn: 160,
    baseRatePerTonMzn: 920,
    active: true,
    totalOrdersCount: 112,
    popularRoutes: ['Nampula - Nacala', 'Beira - Chimoio', 'Maputo - Xai-Xai']
  },
  {
    id: 'srv-3',
    name: 'Transporte de Carga Geral & Contentores',
    category: 'Carga Geral',
    description: 'Movimentação de contentores marítimos de 20ft e 40ft a partir dos portos de Nacala, Beira e Maputo.',
    baseRatePerKmMzn: 180,
    baseRatePerTonMzn: 1100,
    active: true,
    totalOrdersCount: 88,
    popularRoutes: ['Porto de Nacala - Cuamba', 'Porto da Beira - Tete']
  },
  {
    id: 'srv-4',
    name: 'Corredor Internacional SADC',
    category: 'Transporte Internacional (SADC)',
    description: 'Transporte transfronteiriço de mercadorias com documentação aduaneira para África do Sul, Malawi, Zimbabué e Zâmbia.',
    baseRatePerKmMzn: 220,
    baseRatePerTonMzn: 1450,
    active: true,
    totalOrdersCount: 45,
    popularRoutes: ['Matola - Joanesburgo (RSA)', 'Nacala - Lilongwe (Malawi)', 'Beira - Harare (Zimbabué)']
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-901',
    code: 'FT-2026-0310',
    customerId: 'cust-1',
    customerName: 'Cervejas de Moçambique (CDM)',
    tripId: 'tr-503',
    issueDate: '2026-08-01',
    dueDate: '2026-08-31',
    amountMzn: 430000,
    taxMzn: 73100, // 17% IVA Moçambique
    totalAmountMzn: 503100,
    status: 'PENDENTE',
    items: [
      { description: 'Transporte de Cerveja Nampula - Lichinga (Caminhão AEM-903-MP)', quantity: 1, unitPriceMzn: 430000, totalMzn: 430000 }
    ]
  },
  {
    id: 'inv-902',
    code: 'FT-2026-0302',
    customerId: 'cust-2',
    customerName: 'Mozal Alumínio S.A.',
    issueDate: '2026-07-15',
    dueDate: '2026-08-14',
    amountMzn: 820000,
    taxMzn: 139400,
    totalAmountMzn: 959400,
    status: 'PAGA',
    paymentMethod: 'Transferência Bancária BCI',
    items: [
      { description: 'Transporte Especializado de Alumínio Matola - Ressano Garcia', quantity: 1, unitPriceMzn: 820000, totalMzn: 820000 }
    ]
  },
  {
    id: 'inv-903',
    code: 'FT-2026-0298',
    customerId: 'cust-3',
    customerName: 'Porto de Nacala Logistics',
    issueDate: '2026-06-25',
    dueDate: '2026-07-25',
    amountMzn: 640000,
    taxMzn: 108800,
    totalAmountMzn: 748800,
    status: 'VENCIDA',
    items: [
      { description: 'Frete Marítimo-Terrestre Nacala - Cuamba', quantity: 1, unitPriceMzn: 640000, totalMzn: 640000 }
    ]
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    code: 'ORC-2026-015',
    customerName: 'Mozal Alumínio S.A.',
    serviceName: 'Corredor Internacional SADC',
    amountMzn: 1150000,
    date: '2026-08-05',
    status: 'ENVIADO'
  },
  {
    id: 'bud-2',
    code: 'ORC-2026-014',
    customerName: 'Agro-Pequena Moçambique',
    serviceName: 'Aluguer de Caminhões com Reboque',
    amountMzn: 450000,
    date: '2026-08-02',
    status: 'ACEITO'
  }
];

export const INITIAL_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-08-05',
    type: 'RECEITA',
    category: 'Frete de Transporte',
    description: 'Pagamento Fatura FT-2026-0302 (Mozal Alumínio)',
    amountMzn: 959400,
    referenceCode: 'REC-884102',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-2',
    date: '2026-08-04',
    type: 'DESPESA',
    category: 'Combustível',
    description: 'Abastecimento 800L Diesel S10 para Volvo AFB-482-MC (Petromoc Nampula)',
    amountMzn: 68000,
    referenceCode: 'DES-402910',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-3',
    date: '2026-08-03',
    type: 'DESPESA',
    category: 'Portagem e Taxas Fronteiriças',
    description: 'Taxa Aduaneira SADC e Portagem Caia',
    amountMzn: 14500,
    referenceCode: 'DES-402911',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-4',
    date: '2026-08-02',
    type: 'DESPESA',
    category: 'Manutenção de Veículos',
    description: 'Manutenção Hidráulica Oficina Central Nampula (Actros ADC-774-MN)',
    amountMzn: 115000,
    referenceCode: 'DES-402890',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-5',
    date: '2026-07-30',
    type: 'RECEITA',
    category: 'Frete de Transporte',
    description: 'Adiantamento 50% Pedido Tropigalia Distribuição',
    amountMzn: 260000,
    referenceCode: 'REC-883905',
    status: 'CONCLUIDO'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userName: 'Tandinho Macuacua',
    userRole: 'ADMIN',
    action: 'Aprovação de Pedido',
    module: 'Pedidos',
    details: 'Aprovou o pedido PED-2026-089 (CDM) no valor de 380.000,00 MZN',
    timestamp: '2026-08-06 11:45',
    ipAddress: '197.249.12.44'
  },
  {
    id: 'log-2',
    userId: 'usr-2',
    userName: 'Amélia Nhantumbo',
    userRole: 'GESTOR',
    action: 'Criação de Viagem',
    module: 'Viagens',
    details: 'Criou a viagem VIA-2026-044 atribuindo o motorista Januário Munguambe e veículo AFB-482-MC',
    timestamp: '2026-08-06 10:15',
    ipAddress: '197.249.12.50'
  },
  {
    id: 'log-3',
    userId: 'usr-4',
    userName: 'Celeste Mabote',
    userRole: 'FINANCEIRO',
    action: 'Emissão de Fatura',
    module: 'Financeiro',
    details: 'Emitiu a fatura FT-2026-0310 para Cervejas de Moçambique (CDM)',
    timestamp: '2026-08-05 16:30',
    ipAddress: '197.249.12.88'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Novo Pedido Recebido',
    message: 'Mozal Alumínio S.A. submeteu o pedido PED-2026-090 para transporte internacional SADC.',
    timestamp: 'Há 25 min',
    read: false,
    type: 'ORDER'
  },
  {
    id: 'notif-2',
    title: 'Inspeção Veicular Próxima do Vencimento',
    message: 'O caminhão Mercedes-Benz Actros (ADC-774-MN) tem inspeção obrigatória a vencer a 28/08/2026.',
    timestamp: 'Há 2 horas',
    read: false,
    type: 'MAINTENANCE'
  },
  {
    id: 'notif-3',
    title: 'Atualização de Viagem',
    message: 'A viagem VIA-2026-044 deu entrada no posto fiscal de Mandimba com sucesso.',
    timestamp: 'Há 4 horas',
    read: true,
    type: 'TRIP'
  }
];

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  name: "Transportes N' Tandinho S.A.",
  nuit: '400982310',
  email: 'geral@ntandinho.co.mz',
  phone: '+258 84 000 0000',
  address: 'Avenida das Indústrias, Bairro de Namicopo #402',
  city: 'Nampula',
  country: 'Moçambique',
  currency: 'MZN',
  language: 'pt-MZ',
  autoApproveOrdersThresholdMzn: 300000,
  emailNotifications: true,
  smsAlerts: true
};
