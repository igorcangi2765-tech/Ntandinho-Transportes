import React, { createContext, useContext, useState } from 'react';
import {
  Order,
  Trip,
  Customer,
  Vehicle,
  Driver,
  ServiceItem,
  Invoice,
  Budget,
  FinancialTransaction,
  AuditLog,
  NotificationItem,
  CompanySettings,
  OrderStatus,
  TripStatus,
  DriverStatus,
  VehicleStatus
} from '../types';
import {
  INITIAL_ORDERS,
  INITIAL_TRIPS,
  INITIAL_CUSTOMERS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_SERVICES,
  INITIAL_INVOICES,
  INITIAL_BUDGETS,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPANY_SETTINGS
} from '../data/mockData';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface DataContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  orders: Order[];
  trips: Trip[];
  customers: Customer[];
  vehicles: Vehicle[];
  drivers: Driver[];
  services: ServiceItem[];
  invoices: Invoice[];
  budgets: Budget[];
  transactions: FinancialTransaction[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  companySettings: CompanySettings;
  toasts: ToastMessage[];

  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Actions
  createOrder: (orderData: Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  convertOrderToTrip: (orderId: string, driverId: string, vehicleId: string) => void;
  deleteOrder: (orderId: string) => void;

  createTrip: (tripData: Partial<Trip>) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  deleteTrip: (tripId: string) => void;

  createCustomer: (customerData: Partial<Customer>) => void;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;

  createVehicle: (vehicleData: Partial<Vehicle>) => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  addMaintenanceRecord: (vehicleId: string, description: string, costMzn: number, shop: string) => void;
  deleteVehicle: (vehicleId: string) => void;

  createDriver: (driverData: Partial<Driver>) => void;
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  deleteDriver: (driverId: string) => void;

  createService: (serviceData: Partial<ServiceItem>) => void;
  updateService: (id: string, serviceData: Partial<ServiceItem>) => void;
  deleteService: (serviceId: string) => void;

  createInvoice: (invoiceData: Partial<Invoice>) => void;
  markInvoicePaid: (invoiceId: string) => void;
  deleteInvoice: (invoiceId: string) => void;

  markNotificationRead: (id: string) => void;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_FINANCIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, moduleName: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentUser?.id || 'usr-1',
      userName: currentUser?.name || 'Sistema',
      userRole: currentUser?.role || 'ADMIN',
      action,
      module: moduleName,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '197.249.12.100'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Orders Actions
  const createOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: 'ord-' + (orders.length + 101),
      code: `PED-2026-0${orders.length + 95}`,
      customerId: orderData.customerId || customers[0].id,
      customerName: orderData.customerName || customers[0].name,
      serviceType: orderData.serviceType || 'Transporte de Mercadorias',
      origin: orderData.origin || 'Nampula',
      destination: orderData.destination || 'Maputo',
      cargoType: orderData.cargoType || 'Carga Geral',
      weightTons: orderData.weightTons || 25,
      valueMzn: orderData.valueMzn || 350000,
      requestDate: new Date().toISOString().substring(0, 10),
      desiredDate: orderData.desiredDate || '2026-08-15',
      status: 'NOVO',
      notes: orderData.notes
    };
    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog('Criação de Pedido', 'Pedidos', `Criou o pedido ${newOrder.code} no valor de ${newOrder.valueMzn.toLocaleString()} MZN`);
    showToast('Pedido Registado', `Pedido ${newOrder.code} criado com sucesso.`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, notes: notes || o.notes } : o))
    );
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      addAuditLog('Alteração de Estado de Pedido', 'Pedidos', `Atualizou pedido ${target.code} para ${status}`);
    }
    showToast('Estado Atualizado', `Pedido alterado para ${status}.`, 'info');
  };

  const convertOrderToTrip = (orderId: string, driverId: string, vehicleId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const driver = drivers.find((d) => d.id === driverId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!order || !driver || !vehicle) return;

    // Create trip
    const newTrip: Trip = {
      id: 'trip-' + (trips.length + 101),
      code: `VIA-2026-0${trips.length + 45}`,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      driverId: driver.id,
      driverName: driver.name,
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plate,
      origin: order.origin,
      destination: order.destination,
      cargoType: order.cargoType,
      weightTons: order.weightTons,
      valueMzn: order.valueMzn,
      startDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedEndDate: '2026-08-15 18:00',
      status: 'EM_TRANSITO',
      timeline: [
        {
          id: 'tl-1',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          title: 'Expedição Iniciada',
          description: 'Carga levantada e transporte iniciado.',
          location: order.origin,
          status: 'DONE'
        }
      ]
    };

    setTrips((prev) => [newTrip, ...prev]);

    // Update order status
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'EM_CURSO' } : o)));

    // Update driver and vehicle status
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, status: 'EM_VIAGEM' } : d)));
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: 'EM_VIAGEM' } : v)));

    addAuditLog('Conversão de Pedido em Viagem', 'Viagens', `Converteu pedido ${order.code} na viagem ${newTrip.code}`);
    showToast('Viagem Iniciada', `Viagem ${newTrip.code} criada e em trânsito.`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (target) {
      addAuditLog('Remoção de Pedido', 'Pedidos', `Eliminou o pedido ${target.code}`);
    }
    showToast('Pedido Removido', 'Pedido eliminado com sucesso.', 'info');
  };

  // Trips Actions
  const createTrip = (tripData: Partial<Trip>) => {
    const newTrip: Trip = {
      id: 'trip-' + (trips.length + 101),
      code: `VIA-2026-0${trips.length + 45}`,
      customerId: tripData.customerId || customers[0].id,
      customerName: tripData.customerName || 'Cliente',
      driverId: tripData.driverId || drivers[0].id,
      driverName: tripData.driverName || drivers[0].name,
      vehicleId: tripData.vehicleId || vehicles[0].id,
      vehiclePlate: tripData.vehiclePlate || vehicles[0].plate,
      origin: tripData.origin || 'Nampula',
      destination: tripData.destination || 'Maputo',
      cargoType: tripData.cargoType || 'Carga Geral',
      weightTons: tripData.weightTons || 30,
      valueMzn: tripData.valueMzn || 450000,
      startDate: tripData.startDate || new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedEndDate: tripData.estimatedEndDate || '2026-08-14 18:00',
      status: 'EM_TRANSITO',
      timeline: [
        {
          id: 'tl-1',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          title: 'Início de Expedição',
          description: 'Camião saiu da base logística.',
          location: tripData.origin || 'Nampula',
          status: 'DONE'
        }
      ]
    };
    setTrips((prev) => [newTrip, ...prev]);
    addAuditLog('Criação de Viagem Direta', 'Viagens', `Criou a viagem ${newTrip.code}`);
    showToast('Viagem Criada', `Viagem ${newTrip.code} criada com sucesso.`, 'success');
  };

  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status } : t)));
    const target = trips.find((t) => t.id === tripId);
    if (target) {
      if (status === 'CONCLUIDA') {
        // Free driver and vehicle
        setDrivers((prev) => prev.map((d) => (d.id === target.driverId ? { ...d, status: 'DISPONIVEL' } : d)));
        setVehicles((prev) => prev.map((v) => (v.id === target.vehicleId ? { ...v, status: 'DISPONIVEL' } : v)));
      }
      addAuditLog('Atualização de Estado de Viagem', 'Viagens', `Alterou estado da viagem ${target.code} para ${status}`);
    }
    showToast('Estado da Viagem Atualizado', `Viagem alterada para ${status}.`, 'info');
  };

  const deleteTrip = (tripId: string) => {
    const target = trips.find((t) => t.id === tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (target) {
      addAuditLog('Remoção de Viagem', 'Viagens', `Eliminou a viagem ${target.code}`);
    }
    showToast('Viagem Removida', 'Viagem eliminada com sucesso.', 'info');
  };

  // Customers Actions
  const createCustomer = (customerData: Partial<Customer>) => {
    const newCust: Customer = {
      id: 'cust-' + (customers.length + 101),
      name: customerData.name || 'Novo Cliente',
      companyName: customerData.companyName || customerData.name || 'Empresa',
      nuit: customerData.nuit || '400' + Math.floor(100000 + Math.random() * 900000),
      email: customerData.email || 'contato@cliente.mz',
      phone: customerData.phone || '+258 84 000 0000',
      city: customerData.city || 'Nampula',
      address: customerData.address || 'Moçambique',
      totalTrips: 0,
      totalSpentMzn: 0,
      rating: 5,
      status: 'ATIVO',
      registrationDate: new Date().toISOString().substring(0, 10),
      notes: customerData.notes
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog('Registo de Cliente', 'Clientes', `Cadastrou o cliente ${newCust.name}`);
    showToast('Cliente Adicionado', `Cliente ${newCust.name} registado com sucesso.`, 'success');
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...customerData } : c)));
    addAuditLog('Atualização de Cliente', 'Clientes', `Atualizou dados do cliente ID ${id}`);
    showToast('Dados Atualizados', 'Cliente modificado com sucesso.', 'info');
  };

  const deleteCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (target) {
      addAuditLog('Remoção de Cliente', 'Clientes', `Eliminou o cliente ${target.name}`);
    }
    showToast('Cliente Removido', 'Cliente eliminado com sucesso.', 'info');
  };

  // Vehicles Actions
  const createVehicle = (vehicleData: Partial<Vehicle>) => {
    const newVeh: Vehicle = {
      id: 'veh-' + (vehicles.length + 101),
      plate: vehicleData.plate || 'AAA-000-MC',
      brand: vehicleData.brand || 'Volvo',
      model: vehicleData.model || 'FH 540',
      capacityTons: vehicleData.capacityTons || 35,
      year: vehicleData.year || 2024,
      mileageKm: vehicleData.mileageKm || 12000,
      status: 'DISPONIVEL',
      insuranceExpiry: '2027-08-30',
      inspectionExpiry: '2027-08-30',
      fuelType: 'Diesel S10',
      maintenances: []
    };
    setVehicles((prev) => [newVeh, ...prev]);
    addAuditLog('Registo de Veículo', 'Frota', `Adicionou o caminhão ${newVeh.plate}`);
    showToast('Veículo Adicionado', `Caminhão ${newVeh.plate} registado na frota.`, 'success');
  };

  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...vehicleData } : v)));
    addAuditLog('Atualização de Veículo', 'Frota', `Modificou dados do caminhão ID ${id}`);
    showToast('Frota Atualizada', 'Veículo modificado com sucesso.', 'info');
  };

  const addMaintenanceRecord = (vehicleId: string, description: string, costMzn: number, shop: string) => {
    const target = vehicles.find((v) => v.id === vehicleId);
    if (!target) return;

    const newRecord = {
      id: 'maint-' + Date.now(),
      date: new Date().toISOString().substring(0, 10),
      type: 'PREVENTIVA' as const,
      description,
      costMzn,
      mechanicShop: shop
    };

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              status: 'MANUTENCAO' as VehicleStatus,
              maintenances: [newRecord, ...v.maintenances]
            }
          : v
      )
    );

    addAuditLog('Manutenção Registada', 'Frota', `Registou manutenção no caminhão ${target.plate} no valor de ${costMzn.toLocaleString()} MZN`);
    showToast('Manutenção Registada', `Manutenção lançada para o veículo ${target.plate}.`, 'warning');
  };

  const deleteVehicle = (vehicleId: string) => {
    const target = vehicles.find((v) => v.id === vehicleId);
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    if (target) {
      addAuditLog('Remoção de Veículo', 'Frota', `Eliminou o caminhão ${target.plate}`);
    }
    showToast('Veículo Removido', 'Caminhão eliminado da frota.', 'info');
  };

  // Drivers Actions
  const createDriver = (driverData: Partial<Driver>) => {
    const newDrv: Driver = {
      id: 'drv-' + (drivers.length + 101),
      name: driverData.name || 'Novo Motorista',
      email: driverData.email || 'motorista@ntandinho.co.mz',
      phone: driverData.phone || '+258 84 000 1111',
      licenseNumber: driverData.licenseNumber || 'MZ-889911',
      licenseCategory: driverData.licenseCategory || 'CE',
      licenseExpiry: driverData.licenseExpiry || '2028-12-31',
      status: 'DISPONIVEL',
      rating: 5,
      totalTrips: 0,
      hireDate: new Date().toISOString().substring(0, 10),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
    };
    setDrivers((prev) => [newDrv, ...prev]);
    addAuditLog('Registo de Motorista', 'Motoristas', `Adicionou o motorista ${newDrv.name}`);
    showToast('Motorista Adicionado', `Motorista ${newDrv.name} cadastrado com sucesso.`, 'success');
  };

  const updateDriverStatus = (driverId: string, status: DriverStatus) => {
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, status } : d)));
    addAuditLog('Estado do Motorista', 'Motoristas', `Alterou estado do motorista ID ${driverId} para ${status}`);
    showToast('Motorista Atualizado', `Estado alterado para ${status}.`, 'info');
  };

  const deleteDriver = (driverId: string) => {
    const target = drivers.find((d) => d.id === driverId);
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    if (target) {
      addAuditLog('Remoção de Motorista', 'Motoristas', `Eliminou o motorista ${target.name}`);
    }
    showToast('Motorista Removido', 'Motorista eliminado da base de dados.', 'info');
  };

  // Services Actions
  const createService = (serviceData: Partial<ServiceItem>) => {
    const newSvc: ServiceItem = {
      id: 'svc-' + (services.length + 101),
      name: serviceData.name || 'Novo Serviço',
      category: (serviceData.category as any) || 'Transporte de Mercadorias',
      description: serviceData.description || 'Descrição do serviço de transporte',
      baseRatePerKmMzn: serviceData.baseRatePerKmMzn || 180,
      baseRatePerTonMzn: serviceData.baseRatePerTonMzn || 250,
      active: true,
      totalOrdersCount: 0,
      popularRoutes: ['Nampula → Maputo']
    };
    setServices((prev) => [newSvc, ...prev]);
    addAuditLog('Criação de Serviço', 'Serviços', `Cadastrou serviço ${newSvc.name}`);
    showToast('Serviço Adicionado', `Serviço ${newSvc.name} registado.`, 'success');
  };

  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s)));
    addAuditLog('Atualização de Serviço', 'Serviços', `Modificou serviço ID ${id}`);
    showToast('Serviço Modificado', 'Serviço atualizado com sucesso.', 'info');
  };

  const deleteService = (serviceId: string) => {
    const target = services.find((s) => s.id === serviceId);
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    if (target) {
      addAuditLog('Remoção de Serviço', 'Serviços', `Eliminou o serviço ${target.name}`);
    }
    showToast('Serviço Removido', 'Serviço eliminado com sucesso.', 'info');
  };

  // Invoices Actions
  const createInvoice = (invoiceData: Partial<Invoice>) => {
    const amount = invoiceData.amountMzn || 500000;
    const tax = amount * 0.16;
    const newInv: Invoice = {
      id: 'inv-' + (invoices.length + 101),
      code: `FT-2026-0${invoices.length + 310}`,
      customerId: invoiceData.customerId || customers[0].id,
      customerName: invoiceData.customerName || customers[0].name,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: invoiceData.dueDate || '2026-09-01',
      amountMzn: amount,
      taxMzn: tax,
      totalAmountMzn: amount + tax,
      status: 'PENDENTE',
      items: [
        {
          description: invoiceData.items?.[0]?.description || 'Serviço de Transporte de Carga',
          quantity: 1,
          unitPriceMzn: amount,
          totalMzn: amount
        }
      ]
    };
    setInvoices((prev) => [newInv, ...prev]);
    addAuditLog('Emissão de Fatura', 'Financeiro', `Emitiu fatura ${newInv.code} de ${newInv.totalAmountMzn.toLocaleString()} MZN`);
    showToast('Fatura Emitida', `Fatura ${newInv.code} criada com sucesso.`, 'success');
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === invoiceId ? { ...i, status: 'PAGA' } : i)));
    const target = invoices.find((i) => i.id === invoiceId);
    if (target) {
      addAuditLog('Pagamento de Fatura', 'Financeiro', `Marcou a fatura ${target.code} como PAGA`);
    }
    showToast('Fatura Liquidada', 'Fatura marcada como PAGA.', 'success');
  };

  const deleteInvoice = (invoiceId: string) => {
    const target = invoices.find((i) => i.id === invoiceId);
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    if (target) {
      addAuditLog('Remoção de Fatura', 'Financeiro', `Eliminou a fatura ${target.code}`);
    }
    showToast('Fatura Eliminada', 'Fatura removida do sistema.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setCompanySettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('Atualização de Definições', 'Configurações', 'Modificou definições da empresa');
    showToast('Definições Guardadas', 'Informações da empresa atualizadas.', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        activeModule,
        setActiveModule,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        orders,
        trips,
        customers,
        vehicles,
        drivers,
        services,
        invoices,
        budgets,
        transactions,
        auditLogs,
        notifications,
        companySettings,
        toasts,
        showToast,
        removeToast,
        createOrder,
        updateOrderStatus,
        convertOrderToTrip,
        deleteOrder,
        createTrip,
        updateTripStatus,
        deleteTrip,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createVehicle,
        updateVehicle,
        addMaintenanceRecord,
        deleteVehicle,
        createDriver,
        updateDriverStatus,
        deleteDriver,
        createService,
        updateService,
        deleteService,
        createInvoice,
        markInvoicePaid,
        deleteInvoice,
        markNotificationRead,
        updateSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
