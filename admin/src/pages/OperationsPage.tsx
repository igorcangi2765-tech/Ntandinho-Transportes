import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useErpStore,
  TripItem,
  BookingItem,
} from '../shared/stores/useErpStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { DetailDrawer } from '../components/ui/DetailDrawer';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { CalendarView } from '../components/ui/CalendarView';
import { exportToCSV } from '../utils/csvExporter';
import { printGeneralReport } from '../utils/documentPrinter';
import {
  Truck,
  Plus,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  Download,
} from 'lucide-react';

export const OperationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    trips,
    bookings,
    vehicles,
    drivers,
    assignDriverAndVehicle,
    updateTripStatus,
    convertBookingToTrip,
    addTrip,
    addBooking,
  } = useErpStore();
  const { addToast } = useNotificationStore();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'trips' | 'bookings' | 'calendar'>('trips');

  useEffect(() => {
    if (tabParam === 'bookings' || tabParam === 'reservas') setActiveTab('bookings');
    else if (tabParam === 'calendar' || tabParam === 'agenda' || tabParam === 'schedule') setActiveTab('calendar');
    else setActiveTab('trips');
  }, [tabParam]);

  const handleTabChange = (tab: 'trips' | 'bookings' | 'calendar') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Drawers and Modals State
  const [selectedTripDrawer, setSelectedTripDrawer] = useState<TripItem | null>(null);
  const [selectedBookingDrawer, setSelectedBookingDrawer] = useState<BookingItem | null>(null);

  const [assignModalTrip, setAssignModalTrip] = useState<TripItem | null>(null);
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [assignDriverId, setAssignDriverId] = useState('');

  const [cancelModalTripId, setCancelModalTripId] = useState<string | null>(null);

  // New Record Modals State
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  // Form states
  const [custName, setCustName] = useState('Cervejas de Moçambique');
  const [servName, setServName] = useState('Transporte de Carga Geral');
  const [origCity, setOrigCity] = useState('Maputo');
  const [destCity, setDestCity] = useState('Beira');
  const [cargoDesc, setCargoDesc] = useState('Mercadorias em paletes');
  const [totalPrice, setTotalPrice] = useState(125000);

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrip({
      customerId: `cli-${Date.now()}`,
      customerName: custName,
      serviceName: servName,
      origin: origCity,
      destination: destCity,
      cargoDescription: cargoDesc,
      weightKg: 20000,
      departureTime: '07:00',
      etaTime: '18:00',
      vehiclePlate: 'Sem Viatura',
      vehicleModel: 'Por Atribuir',
      driverName: 'Sem Motorista',
      totalPriceMzn: Number(totalPrice),
    });
    setIsAddTripOpen(false);
  };

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      customerId: `cli-${Date.now()}`,
      customerName: custName,
      serviceName: servName,
      origin: origCity,
      destination: destCity,
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      cargoDetails: cargoDesc,
      totalPriceMzn: Number(totalPrice),
    });
    setIsAddBookingOpen(false);
  };

  // Computations
  const totalTrips = trips.length;
  const inTransitTrips = trips.filter((t) => t.status === 'EM_ANDAMENTO').length;
  const confirmedTrips = trips.filter((t) => t.status === 'CONFIRMADA' || t.status === 'EM_PREPARACAO').length;
  const newBookings = bookings.filter((b) => b.status === 'NOVA' || b.status === 'PENDENTE').length;

  // Columns for Viagens
  const tripColumns: Column<TripItem>[] = [
    {
      key: 'tripNumber',
      header: 'Ref. Viagem',
      accessor: (row) => <span className="font-mono font-extrabold text-brand-orange">{row.tripNumber}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Cliente Solicitante',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'route',
      header: 'Origem ➔ Destino',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-300 font-medium">{row.origin} ➔ {row.destination}</span>,
    },
    {
      key: 'vehiclePlate',
      header: 'Camião Pesado',
      accessor: (row) =>
        row.driverName === 'Sem Motorista' || !row.vehicleId ? (
          <span className="text-rose-600 font-bold">Sem Viatura</span>
        ) : (
          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{row.vehiclePlate}</span>
        ),
    },
    {
      key: 'driverName',
      header: 'Motorista Credenciado',
      accessor: (row) =>
        row.driverName === 'Sem Motorista' ? (
          <span className="text-rose-600 font-bold">Sem Motorista</span>
        ) : (
          <span className="text-slate-700 dark:text-slate-300 font-medium">{row.driverName}</span>
        ),
    },
    {
      key: 'totalPriceMzn',
      header: 'Valor Frete',
      accessor: (row) => <span className="font-mono font-bold text-slate-900 dark:text-white">{row.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  // Columns for Reservas
  const bookingColumns: Column<BookingItem>[] = [
    {
      key: 'bookingNumber',
      header: 'Ref. Reserva',
      accessor: (row) => <span className="font-mono font-extrabold text-brand-orange">{row.bookingNumber}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'originDestination',
      header: 'Origem ➔ Destino',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-300 font-medium">{row.origin} ➔ {row.destination}</span>,
    },
    {
      key: 'scheduledDate',
      header: 'Data Agendada',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{row.scheduledDate}</span>,
      sortable: true,
    },
    {
      key: 'totalPriceMzn',
      header: 'Valor Acordado',
      accessor: (row) => <span className="font-mono font-bold text-slate-900 dark:text-white">{row.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  const handleOpenAssignModal = (trip: TripItem) => {
    setAssignModalTrip(trip);
    setAssignVehicleId(vehicles.find((v) => v.isAvailable)?.id || '');
    setAssignDriverId(drivers.find((d) => d.isAvailable)?.id || '');
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalTrip || !assignVehicleId || !assignDriverId) return;

    assignDriverAndVehicle(assignModalTrip.id, assignVehicleId, assignDriverId);
    addToast('Alocação Efetuada com Sucesso', `Viatura e motorista alocados à viagem ${assignModalTrip.tripNumber}.`, 'success');
    setAssignModalTrip(null);
  };

  const handleExportCSV = () => {
    if (activeTab === 'trips') {
      const headers = ['Ref. Viagem', 'Cliente', 'Serviço', 'Origem', 'Destino', 'Viatura', 'Motorista', 'Estado'];
      const rows = trips.map((t) => [t.tripNumber, t.customerName, t.serviceName, t.origin, t.destination, t.vehiclePlate, t.driverName, t.status]);
      exportToCSV('viagens_operacoes_ntandinho', headers, rows);
    } else {
      const headers = ['Ref. Reserva', 'Cliente', 'Serviço', 'Rota Solicitada', 'Data Agendada', 'Valor Total', 'Estado'];
      const rows = bookings.map((b) => [b.bookingNumber, b.customerName, b.serviceName, `${b.origin} ➔ ${b.destination}`, b.scheduledDate, `${b.totalPriceMzn} MZN`, b.status]);
      exportToCSV('reservas_operacoes_ntandinho', headers, rows);
    }
    addToast('Exportação Concluída', 'Ficheiro CSV das operações descarregado com sucesso.', 'success');
  };

  const handlePrintReport = () => {
    if (activeTab === 'trips') {
      const headers = ['Ref. Viagem', 'Cliente', 'Rota Operacional', 'Viatura', 'Motorista', 'Estado'];
      const rows = trips.map((t) => [t.tripNumber, t.customerName, `${t.origin} ➔ ${t.destination}`, `${t.vehiclePlate} (${t.vehicleModel})`, t.driverName, t.status]);
      printGeneralReport('Relatório Geral de Viagens & Despacho', headers, rows);
    } else {
      const headers = ['Ref. Reserva', 'Cliente Solicitante', 'Serviço Prestado', 'Data Agendada', 'Valor Total', 'Estado'];
      const rows = bookings.map((b) => [b.bookingNumber, b.customerName, b.serviceName, b.scheduledDate, `${b.totalPriceMzn.toLocaleString('pt-MZ')} MZN`, b.status]);
      printGeneralReport('Relatório Operacional de Reservas de Transporte', headers, rows);
    }
    addToast('Relatório Gerado', 'Documento PDF impresso gerado com sucesso.', 'info');
  };

  return (
    <StandardPageLayout
      title="Gestão Operacional, Viagens & Cotações"
      description="Pipeline inteligente de transporte: Cotação ➔ Reserva ➔ Viagem com alocação técnica de frota."
      icon={Truck}
      actions={
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer size={14} />
            <span>Imprimir PDF</span>
          </button>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('trips')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'trips' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Viagens ({trips.length})
            </button>
            <button
              onClick={() => handleTabChange('bookings')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'bookings' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reservas ({bookings.length})
            </button>
            <button
              onClick={() => handleTabChange('calendar')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight col-span-2 sm:col-span-1 sm:w-auto ${
                activeTab === 'calendar' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Agenda
            </button>
          </div>



          {/* DYNAMIC CONTEXTUAL PRIMARY ACTION BUTTON PER TAB */}
          {activeTab === 'trips' && (
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Nova Viagem</span>
            </button>
          )}

          {activeTab === 'bookings' && (
            <button
              onClick={() => setIsAddBookingOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <CalendarCheck size={15} />
              <span>Nova Reserva</span>
            </button>
          )}
        </div>
    }
      kpiCards={
        <>
          <MetricCard
            title="Total Viagens"
            value={totalTrips}
            subtext="Operação global em curso"
            icon={Truck}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Em Trânsito"
            value={inTransitTrips}
            subtext="Camiões na estrada SADC"
            icon={Clock}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
          />
          <MetricCard
            title="Confirmadas"
            value={confirmedTrips}
            subtext="Prontas para partida"
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Reservas Pendentes"
            value={newBookings}
            subtext="Necessita de confirmação"
            icon={CalendarCheck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          <MetricCard
            title="Total de Reservas"
            value={bookings.length}
            subtext="Operações agendadas"
            icon={CalendarCheck}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </>
      }
    >
      {/* TAB 1: VIAGENS */}
      {activeTab === 'trips' && (
        <DataTable
          data={trips}
          columns={tripColumns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => setSelectedTripDrawer(row)}
          searchPlaceholder="Pesquisar viagem por ref., cliente, rota ou matrícula..."
          filterOptions={[
            {
              label: 'Estado',
              key: 'status',
              options: [
                { value: 'EM_ANDAMENTO', label: 'Em Trânsito' },
                { value: 'CONFIRMADA', label: 'Confirmada' },
                { value: 'EM_PREPARACAO', label: 'Em Preparação' },
                { value: 'CONCLUIDA', label: 'Concluída' },
                { value: 'CANCELADA', label: 'Cancelada' },
              ],
            },
          ]}
          quickActions={[
            {
              label: 'Ver Ficha da Viagem',
              onClick: (row) => setSelectedTripDrawer(row),
            },
            {
              label: 'Alocar Viatura/Motorista',
              onClick: (row) => handleOpenAssignModal(row),
            },
            {
              label: 'Iniciar Viagem (Em Trânsito)',
              onClick: (row) => updateTripStatus(row.id, 'EM_ANDAMENTO'),
            },
            {
              label: 'Marcar como Concluída',
              onClick: (row) => updateTripStatus(row.id, 'CONCLUIDA'),
            },
            {
              label: 'Cancelar Viagem',
              isDestructive: true,
              onClick: (row) => setCancelModalTripId(row.id),
            },
          ]}
        />
      )}

      {/* TAB 4: CALENDÁRIO / AGENDA */}
      {activeTab === 'calendar' && (
        <CalendarView 
          events={[
            ...bookings.map(b => ({
              id: b.id,
              title: `${b.customerName} (${b.origin} ➔ ${b.destination})`,
              date: b.scheduledDate, // format must be YYYY-MM-DD
              type: 'booking' as const,
              status: b.status,
              description: b.serviceName
            })),
            ...trips.filter(t => t.status === 'CONFIRMADA' || t.status === 'EM_ANDAMENTO').map(t => {
              const tripDate = t.createdAt || new Date().toISOString().slice(0, 10);
              return {
                id: t.id,
                title: `${t.tripNumber} - ${t.customerName}`,
                date: tripDate,
                type: 'trip' as const,
                status: t.status,
                description: t.cargoDescription,
              };
            })
          ]}
          onEventClick={(event) => {
            if (event.type === 'booking') {
              const booking = bookings.find(b => b.id === event.id);
              if (booking) setSelectedBookingDrawer(booking);
            } else if (event.type === 'trip') {
              const trip = trips.find(t => t.id === event.id);
              if (trip) setSelectedTripDrawer(trip);
            }
          }}
        />
      )}

      {/* TAB 2: RESERVAS */}
      {activeTab === 'bookings' && (
        <DataTable
          data={bookings}
          columns={bookingColumns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => setSelectedBookingDrawer(row)}
          searchPlaceholder="Pesquisar reserva por ref. ou cliente..."
          quickActions={[
            {
              label: 'Ver Detalhes da Reserva',
              onClick: (row) => setSelectedBookingDrawer(row),
            },
            {
              label: 'Converter em Viagem Activa',
              icon: ArrowRight,
              onClick: (row) => convertBookingToTrip(row.id),
            },
          ]}
        />
      )}

      {/* TAB 4: CALENDÁRIO / AGENDA */}
      {activeTab === 'calendar' && (
        <CalendarView 
          events={[
            ...bookings.map(b => ({
              id: b.id,
              title: `${b.customerName} (${b.origin} ➔ ${b.destination})`,
              date: b.scheduledDate, // format must be YYYY-MM-DD
              type: 'booking' as const,
              status: b.status,
              description: b.serviceName
            })),
            ...trips.filter(t => t.status === 'CONFIRMADA' || t.status === 'EM_ANDAMENTO').map(t => {
              // Extract date from a mock schedule or created date if available.
              // As standard TripItem doesn't have a specific scheduled date, we'll use a placeholder or today's date for demo
              const today = new Date();
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              
              return {
                id: t.id,
                title: `${t.tripNumber} - ${t.customerName}`,
                date: dateStr,
                type: 'trip' as const,
                status: t.status,
                description: t.cargoDescription
              };
            })
          ]}
          onEventClick={(event) => {
            if (event.type === 'booking') {
              const booking = bookings.find(b => b.id === event.id);
              if (booking) setSelectedBookingDrawer(booking);
            } else if (event.type === 'trip') {
              const trip = trips.find(t => t.id === event.id);
              if (trip) setSelectedTripDrawer(trip);
            }
          }}
        />
      )}

      {/* DETAIL DRAWER VIAGEM */}
      {selectedTripDrawer && (
        <DetailDrawer
          isOpen={!!selectedTripDrawer}
          onClose={() => setSelectedTripDrawer(null)}
          title={`Ficha Técnica — Viagem ${selectedTripDrawer.tripNumber}`}
          subtitle={`Cliente: ${selectedTripDrawer.customerName} • Rota: ${selectedTripDrawer.origin} ➔ ${selectedTripDrawer.destination}`}
          width="xl"
          tabs={[
            {
              id: 'resumo',
              label: 'Resumo Operacional',
              content: (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Serviço Contratado</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedTripDrawer.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Valor Total do Frete</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{selectedTripDrawer.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Origem e Destino</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTripDrawer.origin} ➔ {selectedTripDrawer.destination}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Estado da Viagem</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedTripDrawer.status}</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'recursos',
              label: 'Viatura & Motorista',
              content: (
                <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Camião Pesado Alocado</span>
                    <span className="font-mono font-bold text-brand-orange text-sm">{selectedTripDrawer.vehiclePlate} ({selectedTripDrawer.vehicleModel})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Motorista Credenciado</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedTripDrawer.driverName}</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'carga',
              label: 'Carga & Logística',
              content: (
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 block">Especificação da Carga</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedTripDrawer.cargoDescription}</p>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* DETAIL DRAWER RESERVA */}
      {selectedBookingDrawer && (
        <DetailDrawer
          isOpen={!!selectedBookingDrawer}
          onClose={() => setSelectedBookingDrawer(null)}
          title={`Ficha de Reserva — ${selectedBookingDrawer.bookingNumber}`}
          subtitle={`Cliente: ${selectedBookingDrawer.customerName} • Data: ${selectedBookingDrawer.scheduledDate}`}
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <span className="text-slate-500 dark:text-slate-400 block">Serviço: {selectedBookingDrawer.serviceName}</span>
              <span className="font-bold text-slate-900 dark:text-white block">{selectedBookingDrawer.origin} ➔ {selectedBookingDrawer.destination}</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base block">{selectedBookingDrawer.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>
            </div>
            <button
              onClick={() => {
                convertBookingToTrip(selectedBookingDrawer.id);
                setSelectedBookingDrawer(null);
              }}
              className="w-full py-2.5 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-subtle flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Converter em Viagem Activa</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </DetailDrawer>
      )}

      {/* MODAL ALOCAR RECURSOS */}
      {assignModalTrip && (
        <Modal
          isOpen={!!assignModalTrip}
          onClose={() => setAssignModalTrip(null)}
          title={`Alocar Recursos — Viagem ${assignModalTrip.tripNumber}`}
          subtitle="Atribuir camião disponível e motorista credenciado"
          maxWidth="md"
        >
          <form onSubmit={handleConfirmAssignment} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Selecionar Camião Pesado</label>
              <select
                value={assignVehicleId}
                onChange={(e) => setAssignVehicleId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.status === 'MANUTENCAO' || v.status === 'INDISPONIVEL'} className="dark:bg-slate-800">
                    {v.plateNumber} — {v.make} {v.model} ({v.status === 'MANUTENCAO' ? '⚠️ EM MANUTENÇÃO (BLOQUEADO)' : v.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Selecionar Motorista Credenciado</label>
              <select
                value={assignDriverId}
                onChange={(e) => setAssignDriverId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.status === 'INDISPONIVEL'} className="dark:bg-slate-800">
                    {d.name} ({d.status === 'INDISPONIVEL' ? '⚠️ INDISPONÍVEL' : d.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setAssignModalTrip(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
              >
                Confirmar Alocação
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRM MODAL CANCELAR VIAGEM */}
      <ConfirmModal
        isOpen={!!cancelModalTripId}
        onClose={() => setCancelModalTripId(null)}
        onConfirm={() => {
          if (cancelModalTripId) {
            updateTripStatus(cancelModalTripId, 'CANCELADA');
            setCancelModalTripId(null);
          }
        }}
        title="Cancelar Viagem Operacional"
        description="Tem a certeza de que deseja cancelar esta viagem? Esta acção libertará a viatura e o motorista para novas expedições."
        confirmLabel="Cancelar Viagem"
        isDestructive={true}
      />

      {/* MODAL CRIAR VIAGEM */}
      <Modal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
        title="Nova Viagem Operacional"
        subtitle="Registo de expedição de transporte de carga"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTripSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cliente Solicitante *</label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tipo de Serviço</label>
              <input
                type="text"
                value={servName}
                onChange={(e) => setServName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Origem</label>
              <input
                type="text"
                value={origCity}
                onChange={(e) => setOrigCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Destino</label>
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Descrição da Carga</label>
            <input
              type="text"
              value={cargoDesc}
              onChange={(e) => setCargoDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor do Serviço (MZN)</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddTripOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Lançar Viagem
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL CRIAR RESERVA */}
      <Modal
        isOpen={isAddBookingOpen}
        onClose={() => setIsAddBookingOpen(false)}
        title="Nova Reserva de Transporte"
        subtitle="Registo prévio de agendamento de expedição"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBookingSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cliente Solicitante *</label>
            <input
              type="text"
              required
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Origem</label>
              <input
                type="text"
                value={origCity}
                onChange={(e) => setOrigCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Destino</label>
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor Acordado (MZN)</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddBookingOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Guardar Reserva
            </button>
          </div>
        </form>
      </Modal>
    </StandardPageLayout>
  );
};
