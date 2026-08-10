import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissions } from '../hooks/usePermissions';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Order, OrderStatus } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import {
  PackageCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Truck,
  FileSpreadsheet,
  FileText,
  Filter,
  Eye
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const {
    orders,
    customers,
    drivers,
    vehicles,
    createOrder,
    updateOrderStatus,
    convertOrderToTrip,
    showToast
  } = useData();

  const { canAccess } = usePermissions();

  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Convert form
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Create form
  const [newOrderForm, setNewOrderForm] = useState({
    customerId: customers[0]?.id || '',
    serviceType: 'Transporte de Mercadorias',
    origin: '',
    destination: '',
    cargoType: '',
    weightTons: 25,
    valueMzn: 350000,
    desiredDate: '2026-08-15',
    notes: ''
  });

  const availableDrivers = drivers.filter((d) => d.status === 'DISPONIVEL');
  const availableVehicles = vehicles.filter((v) => v.status === 'DISPONIVEL');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'TODOS') return true;
    return o.status === statusFilter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newOrderForm.customerId);
    createOrder({
      ...newOrderForm,
      customerName: cust ? cust.name : 'Cliente General'
    });
    setIsCreateModalOpen(false);
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!selectedDriverId || !selectedVehicleId) {
      showToast('Seleção Necessária', 'Por favor escolha um motorista e um caminhão disponível.', 'warning');
      return;
    }
    convertOrderToTrip(selectedOrder.id, selectedDriverId, selectedVehicleId);
    setIsConvertModalOpen(false);
    setSelectedOrder(null);
  };

  const statusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      NOVO: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      EM_ANALISE: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      APROVADO: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      EM_CURSO: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      CONCLUIDO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      CANCELADO: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
    return (
      <span className={`stripe-badge ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Order>[] = [
    {
      header: 'Código',
      accessorKey: 'code',
      sortable: true,
      cell: (r) => <span className="font-bold text-[#F5A300] whitespace-nowrap">{r.code}</span>
    },
    {
      header: 'Cliente',
      accessorKey: 'customerName',
      sortable: true,
      cell: (r) => <span className="font-semibold text-slate-100 whitespace-nowrap">{r.customerName}</span>
    },
    {
      header: 'Serviço & Carga',
      cell: (r) => (
        <span className="whitespace-nowrap font-medium text-slate-200">
          {r.serviceType} <span className="text-[11px] text-slate-400 font-normal">({r.cargoType}, {r.weightTons} T)</span>
        </span>
      )
    },
    {
      header: 'Rota (Origem → Destino)',
      cell: (r) => (
        <span className="whitespace-nowrap text-slate-300 font-medium">
          {r.origin} → {r.destination}
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
      header: 'Data Pedido',
      accessorKey: 'requestDate',
      sortable: true,
      cell: (r) => <span className="text-slate-400 whitespace-nowrap">{r.requestDate}</span>
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => statusBadge(r.status)
    },
    {
      header: 'Ações Operacionais',
      cell: (r) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          {r.status === 'NOVO' && (
            <button
              onClick={() => updateOrderStatus(r.id, 'EM_ANALISE')}
              className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-medium text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              Analisar
            </button>
          )}

          {(r.status === 'NOVO' || r.status === 'EM_ANALISE') && (
            <button
              onClick={() => updateOrderStatus(r.id, 'APROVADO')}
              className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-medium text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aprovar
            </button>
          )}

          {r.status === 'APROVADO' && (
            <button
              onClick={() => {
                setSelectedOrder(r);
                setIsConvertModalOpen(true);
              }}
              className="px-2.5 py-1 rounded bg-[#F5A300] text-slate-950 hover:bg-[#E59200] font-bold text-[11px] inline-flex items-center gap-1 shadow shrink-0 whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5 text-slate-950" />
              Converter em Viagem
            </button>
          )}

          {r.status !== 'CONCLUIDO' && r.status !== 'CANCELADO' && (
            <button
              onClick={() => updateOrderStatus(r.id, 'CANCELADO')}
              className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-medium text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleExportExcel = () => {
    const data = filteredOrders.map((o) => ({
      Codigo: o.code,
      Cliente: o.customerName,
      Servico: o.serviceType,
      Origem: o.origin,
      Destino: o.destination,
      PesoTons: o.weightTons,
      ValorMzn: o.valueMzn,
      Estado: o.status,
      DataDesejada: o.desiredDate
    }));
    exportToExcel('Pedidos_Transportes_NTandinho', 'Pedidos', data);
  };

  const handleExportPDF = () => {
    const headers = ['Código', 'Cliente', 'Serviço', 'Origem', 'Destino', 'Valor (MZN)', 'Estado'];
    const data = filteredOrders.map((o) => [
      o.code,
      o.customerName,
      o.serviceType,
      o.origin,
      o.destination,
      `${o.valueMzn.toLocaleString()} MZN`,
      o.status
    ]);
    exportToPDF('Relatório de Pedidos de Transporte', headers, data, 'Pedidos_NTandinho');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-[#F5A300]" />
            Gestão de Pedidos de Transporte
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Receber, analisar, aprovar e converter pedidos em viagens de expedição.
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
            <span>Registar Novo Pedido</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['TODOS', 'NOVO', 'EM_ANALISE', 'APROVADO', 'EM_CURSO', 'CONCLUIDO', 'CANCELADO'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              statusFilter === st
                ? 'bg-[#F5A300] text-slate-950 border-[#F5A300] shadow'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
          >
            {st === 'TODOS' ? 'Todos os Pedidos' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        searchPlaceholder="Pesquisar pedidos por código, cliente ou destino..."
        emptyTitle="Nenhum pedido encontrado"
        emptyDescription="Não existem pedidos registados com o filtro selecionado."
      />

      {/* Modal: Create Order */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registar Novo Pedido de Transporte"
        subtitle="Preencha as especificações da carga e a rota pretendida"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Cliente Solicitante *</label>
            <select
              value={newOrderForm.customerId}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, customerId: e.target.value })}
              className="stripe-input w-full"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.companyName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tipo de Serviço *</label>
              <select
                value={newOrderForm.serviceType}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, serviceType: e.target.value })}
                className="stripe-input w-full"
              >
                <option value="Aluguer de Caminhões">Aluguer de Caminhões</option>
                <option value="Transporte de Mercadorias">Transporte de Mercadorias</option>
                <option value="Carga Geral">Carga Geral</option>
                <option value="Transporte Internacional (SADC)">Transporte Internacional (SADC)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tipo de Carga *</label>
              <input
                type="text"
                placeholder="Ex: Cerveja, Alumínio, Contentor"
                value={newOrderForm.cargoType}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, cargoType: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Origem *</label>
              <input
                type="text"
                placeholder="Cidade / Local de Carga"
                value={newOrderForm.origin}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, origin: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Destino *</label>
              <input
                type="text"
                placeholder="Cidade / Local de Descarga"
                value={newOrderForm.destination}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, destination: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Peso Estimado (Tons) *</label>
              <input
                type="number"
                value={newOrderForm.weightTons}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, weightTons: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Valor Acordado (MZN) *</label>
              <input
                type="number"
                value={newOrderForm.valueMzn}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, valueMzn: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Data Pretendida *</label>
              <input
                type="date"
                value={newOrderForm.desiredDate}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, desiredDate: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Observações Adicionais</label>
            <textarea
              rows={2}
              placeholder="Instruções especiais de transporte ou manuseamento..."
              value={newOrderForm.notes}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
              className="stripe-input w-full"
            />
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
              Criar Pedido
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Convert Order to Trip */}
      <Modal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        title={`Converter Pedido ${selectedOrder?.code} em Viagem`}
        subtitle="Atribua um motorista e um caminhão disponíveis para iniciar a expedição"
      >
        <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Cliente: {selectedOrder?.customerName}</span>
              <span className="text-[#F5A300]">{selectedOrder?.valueMzn.toLocaleString()} MZN</span>
            </div>
            <div className="text-slate-400">
              Rota: {selectedOrder?.origin} → {selectedOrder?.destination} ({selectedOrder?.weightTons} Tons)
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Motorista Atribuído *</label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="stripe-input w-full"
              required
            >
              <option value="">-- Selecione um motorista disponível --</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} (Carta: {d.licenseCategory}) ★ {d.rating}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Caminhão da Frota *</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="stripe-input w-full"
              required
            >
              <option value="">-- Selecione um caminhão disponível --</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} - {v.brand} {v.model} ({v.capacityTons} Tons Cap.)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConvertModalOpen(false)}
              className="stripe-button-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="stripe-button-primary text-xs">
              Iniciar Viagem & Expedição
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
