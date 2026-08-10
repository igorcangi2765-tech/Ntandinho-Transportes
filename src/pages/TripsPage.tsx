import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Trip, TripStatus } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import {
  Truck,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  User,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TripsPage: React.FC = () => {
  const { trips, customers, drivers, vehicles, createTrip, updateTripStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTripTimeline, setSelectedTripTimeline] = useState<Trip | null>(null);

  // New trip form
  const [newTripForm, setNewTripForm] = useState({
    customerId: customers[0]?.id || '',
    driverId: drivers[0]?.id || '',
    vehicleId: vehicles[0]?.id || '',
    origin: '',
    destination: '',
    cargoType: 'Carga Geral',
    weightTons: 30,
    valueMzn: 450000,
    startDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    estimatedEndDate: '2026-08-14 18:00'
  });

  const filteredTrips = trips.filter((t) => {
    if (statusFilter === 'TODOS') return true;
    return t.status === statusFilter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newTripForm.customerId);
    const drv = drivers.find((d) => d.id === newTripForm.driverId);
    const veh = vehicles.find((v) => v.id === newTripForm.vehicleId);

    createTrip({
      ...newTripForm,
      customerName: cust ? cust.name : 'Cliente',
      driverName: drv ? drv.name : 'Motorista',
      vehiclePlate: veh ? veh.plate : 'Matrícula'
    });
    setIsCreateModalOpen(false);
  };

  const statusBadge = (status: TripStatus) => {
    const styles: Record<TripStatus, string> = {
      AGENDADA: 'bg-[#F5A300]/10 text-[#F5A300] border-[#F5A300]/30',
      EM_TRANSITO: 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse',
      EM_DESCARGA: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      CONCLUIDA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      CANCELADA: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
    return (
      <span className={`stripe-badge ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Trip>[] = [
    {
      header: 'Código Viagem',
      accessorKey: 'code',
      sortable: true,
      cell: (r) => <span className="font-bold text-[#F5A300] whitespace-nowrap">{r.code}</span>
    },
    {
      header: 'Cliente & Carga',
      cell: (r) => (
        <span className="whitespace-nowrap font-semibold text-slate-100">
          {r.customerName} <span className="text-[11px] text-slate-400 font-normal">({r.cargoType}, {r.weightTons} T)</span>
        </span>
      )
    },
    {
      header: 'Motorista & Caminhão',
      cell: (r) => (
        <span className="whitespace-nowrap text-slate-200 font-medium inline-flex items-center gap-1.5">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" />{r.driverName}</span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-[#F5A300] font-semibold"><ShieldCheck className="w-3.5 h-3.5 text-[#F5A300]" />{r.vehiclePlate}</span>
        </span>
      )
    },
    {
      header: 'Rota da Expedição',
      cell: (r) => (
        <span className="whitespace-nowrap text-slate-300 font-medium inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{r.origin} → {r.destination}</span>
        </span>
      )
    },
    {
      header: 'Valor (MZN)',
      accessorKey: 'valueMzn',
      sortable: true,
      cell: (r) => <span className="font-bold text-emerald-400 whitespace-nowrap">{r.valueMzn.toLocaleString()} MZN</span>
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => statusBadge(r.status)
    },
    {
      header: 'Ações',
      cell: (r) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => setSelectedTripTimeline(r)}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#F5A300] font-medium text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Clock className="w-3.5 h-3.5 text-[#F5A300]" />
            Linha Temporal
          </button>

          {r.status === 'EM_TRANSITO' && (
            <button
              onClick={() => updateTripStatus(r.id, 'CONCLUIDA')}
              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              Concluir
            </button>
          )}
        </div>
      )
    }
  ];

  const handleExportExcel = () => {
    const data = filteredTrips.map((t) => ({
      Codigo: t.code,
      Cliente: t.customerName,
      Motorista: t.driverName,
      Caminhao: t.vehiclePlate,
      Origem: t.origin,
      Destino: t.destination,
      ValorMzn: t.valueMzn,
      Estado: t.status,
      DataInicio: t.startDate
    }));
    exportToExcel('Viagens_Expedicao_NTandinho', 'Viagens', data);
  };

  const handleExportPDF = () => {
    const headers = ['Código', 'Cliente', 'Motorista', 'Veículo', 'Origem → Destino', 'Valor MZN', 'Estado'];
    const data = filteredTrips.map((t) => [
      t.code,
      t.customerName,
      t.driverName,
      t.vehiclePlate,
      `${t.origin} → ${t.destination}`,
      `${t.valueMzn.toLocaleString()} MZN`,
      t.status
    ]);
    exportToPDF('Relatório de Viagens e Expedição Operacional', headers, data, 'Viagens_NTandinho');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#F5A300]" />
            Gestão de Viagens & Expedições
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitorização em tempo real do transporte de carga nacional e internacional SADC.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportExcel} className="stripe-button-secondary text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel</span>
          </button>
          <button onClick={handleExportPDF} className="stripe-button-secondary text-xs">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>PDF</span>
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="stripe-button-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Criar Nova Viagem</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['TODOS', 'AGENDADA', 'EM_TRANSITO', 'EM_DESCARGA', 'CONCLUIDA', 'CANCELADA'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              statusFilter === st
                ? 'bg-[#F5A300] text-slate-950 border-[#F5A300] shadow'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            {st === 'TODOS' ? 'Todas as Viagens' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filteredTrips}
        columns={columns}
        searchPlaceholder="Pesquisar por código de viagem, motorista, cliente ou rota..."
      />

      {/* Modal: Linha Temporal (Timeline) */}
      <Modal
        isOpen={!!selectedTripTimeline}
        onClose={() => setSelectedTripTimeline(null)}
        title={`Linha Temporal da Operação - ${selectedTripTimeline?.code}`}
        subtitle={`Cliente: ${selectedTripTimeline?.customerName} | Rota: ${selectedTripTimeline?.origin} → ${selectedTripTimeline?.destination}`}
        maxWidth="xl"
      >
        {selectedTripTimeline && (
          <div className="space-y-6 text-xs">
            {/* Top Cards Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Motorista</span>
                <span className="font-bold text-slate-100">{selectedTripTimeline.driverName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Caminhão</span>
                <span className="font-bold text-[#F5A300]">{selectedTripTimeline.vehiclePlate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Carga / Peso</span>
                <span className="font-bold text-slate-100">{selectedTripTimeline.cargoType} ({selectedTripTimeline.weightTons} T)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Valor Frete</span>
                <span className="font-bold text-emerald-400">{selectedTripTimeline.valueMzn.toLocaleString()} MZN</span>
              </div>
            </div>

            {/* Timeline Vertical */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F5A300]" />
                Marcos Operacionais em Tempo Real
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {selectedTripTimeline.timeline.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        event.status === 'DONE'
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : event.status === 'IN_PROGRESS'
                          ? 'bg-[#F5A300] border-amber-300 text-slate-950 animate-pulse'
                          : 'bg-slate-800 border-slate-600 text-slate-400'
                      }`}
                    >
                      {event.status === 'DONE' && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60 w-full">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-100 text-xs">{event.title}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px]">{event.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-[#F5A300] font-semibold mt-2">
                        <MapPin className="w-3 h-3" />
                        <span>Localização: {event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Create Direct Trip */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Nova Viagem Direta"
        subtitle="Registe uma expedição direta sem pedido prévio"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Cliente *</label>
            <select
              value={newTripForm.customerId}
              onChange={(e) => setNewTripForm({ ...newTripForm, customerId: e.target.value })}
              className="stripe-input w-full"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Motorista *</label>
              <select
                value={newTripForm.driverId}
                onChange={(e) => setNewTripForm({ ...newTripForm, driverId: e.target.value })}
                className="stripe-input w-full"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Caminhão *</label>
              <select
                value={newTripForm.vehicleId}
                onChange={(e) => setNewTripForm({ ...newTripForm, vehicleId: e.target.value })}
                className="stripe-input w-full"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} - {v.brand} {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Origem *</label>
              <input
                type="text"
                value={newTripForm.origin}
                onChange={(e) => setNewTripForm({ ...newTripForm, origin: e.target.value })}
                placeholder="Ex: Nampula"
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Destino *</label>
              <input
                type="text"
                value={newTripForm.destination}
                onChange={(e) => setNewTripForm({ ...newTripForm, destination: e.target.value })}
                placeholder="Ex: Maputo / Lilongwe"
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Valor do Frete (MZN) *</label>
              <input
                type="number"
                value={newTripForm.valueMzn}
                onChange={(e) => setNewTripForm({ ...newTripForm, valueMzn: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Previsão Conclusão *</label>
              <input
                type="datetime-local"
                value={newTripForm.estimatedEndDate.replace(' ', 'T')}
                onChange={(e) => setNewTripForm({ ...newTripForm, estimatedEndDate: e.target.value.replace('T', ' ') })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="stripe-button-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="stripe-button-primary text-xs">
              Criar Viagem
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
