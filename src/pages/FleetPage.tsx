import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Vehicle, VehicleStatus } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import {
  ShieldCheck,
  Plus,
  Wrench,
  Gauge,
  Calendar,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const FleetPage: React.FC = () => {
  const { vehicles, createVehicle, addMaintenanceRecord } = useData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // New vehicle form
  const [newVehicleForm, setNewVehicleForm] = useState({
    plate: '',
    brand: 'Volvo',
    model: 'FH 540',
    capacityTons: 35,
    year: 2024,
    mileageKm: 15000,
    fuelType: 'Diesel S10'
  });

  // Maintenance form
  const [maintDescription, setMaintDescription] = useState('');
  const [maintCostMzn, setMaintCostMzn] = useState(45000);
  const [maintShop, setMaintShop] = useState('Volvo Auto-Sueco Nampula');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicle(newVehicleForm);
    setIsCreateModalOpen(false);
    setNewVehicleForm({
      plate: '',
      brand: 'Volvo',
      model: 'FH 540',
      capacityTons: 35,
      year: 2024,
      mileageKm: 15000,
      fuelType: 'Diesel S10'
    });
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    addMaintenanceRecord(selectedVehicle.id, maintDescription, maintCostMzn, maintShop);
    setIsMaintenanceModalOpen(false);
    setSelectedVehicle(null);
    setMaintDescription('');
  };

  const statusBadge = (status: VehicleStatus) => {
    const styles: Record<VehicleStatus, string> = {
      DISPONIVEL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      EM_VIAGEM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      MANUTENCAO: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold',
      INATIVO: 'bg-slate-800 text-slate-400 border-slate-700'
    };
    return (
      <span className={`stripe-badge ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Vehicle>[] = [
    {
      header: 'Matrícula',
      accessorKey: 'plate',
      sortable: true,
      cell: (r) => <span className="font-extrabold text-[#F5A300] font-mono text-xs whitespace-nowrap">{r.plate}</span>
    },
    {
      header: 'Marca & Modelo',
      cell: (r) => (
        <span className="whitespace-nowrap font-bold text-slate-100">
          {r.brand} {r.model} <span className="text-[11px] text-slate-400 font-normal">({r.year} • {r.fuelType})</span>
        </span>
      )
    },
    {
      header: 'Capacidade & KM',
      cell: (r) => (
        <span className="whitespace-nowrap text-slate-200 font-semibold inline-flex items-center gap-1.5">
          <span>{r.capacityTons} T Cap.</span>
          <span className="text-slate-500">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-normal"><Gauge className="w-3.5 h-3.5 text-slate-500" />{r.mileageKm.toLocaleString()} KM</span>
        </span>
      )
    },
    {
      header: 'Validade do Seguro',
      accessorKey: 'insuranceExpiry',
      sortable: true,
      cell: (r) => <span className="text-slate-300 font-medium whitespace-nowrap">{r.insuranceExpiry}</span>
    },
    {
      header: 'Inspeção Obrigatória',
      accessorKey: 'inspectionExpiry',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap inline-flex items-center gap-1 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{r.inspectionExpiry}</span>
        </span>
      )
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => statusBadge(r.status)
    },
    {
      header: 'Ações de Gestão',
      cell: (r) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => {
              setSelectedVehicle(r);
              setIsMaintenanceModalOpen(true);
            }}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-rose-500/50 hover:text-rose-400 font-medium text-[11px] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5" />
            Lançar Manutenção
          </button>
        </div>
      )
    }
  ];

  const handleExportExcel = () => {
    const data = vehicles.map((v) => ({
      Matricula: v.plate,
      Marca: v.brand,
      Modelo: v.model,
      Ano: v.year,
      CapacidadeTons: v.capacityTons,
      QuilometragemKm: v.mileageKm,
      Combustivel: v.fuelType,
      Estado: v.status,
      ValidadeSeguro: v.insuranceExpiry,
      Inspecao: v.inspectionExpiry
    }));
    exportToExcel('Frota_Caminhoes_NTandinho', 'Frota', data);
  };

  const handleExportPDF = () => {
    const headers = ['Matrícula', 'Marca / Modelo', 'Ano', 'Capacidade', 'Quilometragem', 'Estado', 'Inspeção'];
    const data = vehicles.map((v) => [
      v.plate,
      `${v.brand} ${v.model}`,
      v.year,
      `${v.capacityTons} Ton`,
      `${v.mileageKm.toLocaleString()} KM`,
      v.status,
      v.inspectionExpiry
    ]);
    exportToPDF('Relatório de Frota de Caminhões de Carga', headers, data, 'Frota_NTandinho');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#F5A300]" />
            Gestão da Frota de Caminhões
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Controlo de caminhões articulados, plano de manutenção e inspeção técnica preventiva.
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
            <span>Registar Novo Caminhão</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={vehicles}
        columns={columns}
        searchPlaceholder="Pesquisar por matrícula, marca, modelo ou estado..."
      />

      {/* Modal: Register Vehicle */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registar Novo Caminhão na Frota"
        subtitle="Adicione um novo veículo articulado para expedição"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Matrícula (Moçambique) *</label>
            <input
              type="text"
              placeholder="Ex: AFB-482-MC"
              value={newVehicleForm.plate}
              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, plate: e.target.value })}
              className="stripe-input w-full font-mono uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Marca *</label>
              <select
                value={newVehicleForm.brand}
                onChange={(e) => setNewVehicleForm({ ...newVehicleForm, brand: e.target.value })}
                className="stripe-input w-full"
              >
                <option value="Volvo">Volvo Trucks</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Scania">Scania</option>
                <option value="MAN">MAN Trucks</option>
                <option value="DAF">DAF</option>
                <option value="Isuzu">Isuzu Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Modelo *</label>
              <input
                type="text"
                placeholder="Ex: FH 540 6x4"
                value={newVehicleForm.model}
                onChange={(e) => setNewVehicleForm({ ...newVehicleForm, model: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Capacidade (Tons) *</label>
              <input
                type="number"
                value={newVehicleForm.capacityTons}
                onChange={(e) => setNewVehicleForm({ ...newVehicleForm, capacityTons: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Ano de Fabrico *</label>
              <input
                type="number"
                value={newVehicleForm.year}
                onChange={(e) => setNewVehicleForm({ ...newVehicleForm, year: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quilometragem (KM) *</label>
              <input
                type="number"
                value={newVehicleForm.mileageKm}
                onChange={(e) => setNewVehicleForm({ ...newVehicleForm, mileageKm: Number(e.target.value) })}
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
              Adicionar Veículo
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Maintenance Record */}
      <Modal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        title={`Lançar Manutenção - ${selectedVehicle?.plate}`}
        subtitle={`Veículo: ${selectedVehicle?.brand} ${selectedVehicle?.model}`}
      >
        <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Descrição do Serviço / Reparação *</label>
            <textarea
              rows={2}
              placeholder="Ex: Troca de pastilhas de travão e óleo do motor..."
              value={maintDescription}
              onChange={(e) => setMaintDescription(e.target.value)}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Custo Estimado (MZN) *</label>
              <input
                type="number"
                value={maintCostMzn}
                onChange={(e) => setMaintCostMzn(Number(e.target.value))}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Oficina / Concessionário *</label>
              <input
                type="text"
                value={maintShop}
                onChange={(e) => setMaintShop(e.target.value)}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMaintenanceModalOpen(false)}
              className="stripe-button-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="stripe-button-primary text-xs bg-rose-600 hover:bg-rose-500 border-rose-500">
              Confirmar Manutenção
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
