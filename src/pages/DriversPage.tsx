import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Driver, DriverStatus } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { UserCheck, Plus, Star, Truck, ShieldCheck, FileSpreadsheet, FileText, Phone, Mail, Award } from 'lucide-react';

export const DriversPage: React.FC = () => {
  const { drivers, vehicles, createDriver, updateDriverStatus } = useData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newDriverForm, setNewDriverForm] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseCategory: 'CE',
    licenseExpiry: '2028-12-31'
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDriver(newDriverForm);
    setIsCreateModalOpen(false);
    setNewDriverForm({
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseCategory: 'CE',
      licenseExpiry: '2028-12-31'
    });
  };

  const statusBadge = (status: DriverStatus) => {
    const styles: Record<DriverStatus, string> = {
      DISPONIVEL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      EM_VIAGEM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      DESCANSO: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      LICENCA: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
    return (
      <span className={`stripe-badge ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<Driver>[] = [
    {
      header: 'Motorista',
      accessorKey: 'name',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap inline-flex items-center gap-2.5">
          <img
            src={r.avatar}
            alt={r.name}
            className="w-7 h-7 rounded-full border border-slate-700 object-cover shrink-0"
          />
          <span className="font-bold text-slate-100">
            {r.name} <span className="text-[11px] text-slate-400 font-normal">({r.phone})</span>
          </span>
        </span>
      )
    },
    {
      header: 'Carta de Condução',
      cell: (r) => (
        <span className="whitespace-nowrap font-semibold text-slate-200">
          Categoria {r.licenseCategory} <span className="text-[11px] text-slate-400 font-normal">(Nº {r.licenseNumber} • Val: {r.licenseExpiry})</span>
        </span>
      )
    },
    {
      header: 'Caminhão Atribuído',
      accessorKey: 'assignedVehiclePlate',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap inline-flex items-center gap-1 font-bold text-[#F5A300]">
          <Truck className="w-3.5 h-3.5 text-[#F5A300]" />
          <span>{r.assignedVehiclePlate || 'Nenhum'}</span>
        </span>
      )
    },
    {
      header: 'Total Viagens',
      accessorKey: 'totalTrips',
      sortable: true,
      cell: (r) => <span className="whitespace-nowrap font-bold text-slate-200">{r.totalTrips} viagens</span>
    },
    {
      header: 'Avaliação',
      accessorKey: 'rating',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap inline-flex items-center gap-1 font-bold text-amber-400">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{r.rating}</span>
        </span>
      )
    },
    {
      header: 'Disponibilidade',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => statusBadge(r.status)
    },
    {
      header: 'Alterar Estado',
      cell: (r) => (
        <select
          value={r.status}
          onChange={(e) => updateDriverStatus(r.id, e.target.value as DriverStatus)}
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-[#F5A300] outline-none whitespace-nowrap"
        >
          <option value="DISPONIVEL">DISPONÍVEL</option>
          <option value="EM_VIAGEM">EM VIAGEM</option>
          <option value="DESCANSO">DESCANSO</option>
          <option value="LICENCA">LICENÇA</option>
        </select>
      )
    }
  ];

  const handleExportExcel = () => {
    const data = drivers.map((d) => ({
      Nome: d.name,
      Email: d.email,
      Telefone: d.phone,
      CartaNumero: d.licenseNumber,
      Categoria: d.licenseCategory,
      ValidadeCarta: d.licenseExpiry,
      Estado: d.status,
      TotalViagens: d.totalTrips,
      Rating: d.rating
    }));
    exportToExcel('Motoristas_Equipa_NTandinho', 'Motoristas', data);
  };

  const handleExportPDF = () => {
    const headers = ['Nome', 'Telefone', 'Carta', 'Categoria', 'Caminhão', 'Estado', 'Rating'];
    const data = drivers.map((d) => [
      d.name,
      d.phone,
      d.licenseNumber,
      d.licenseCategory,
      d.assignedVehiclePlate || 'Sem Veículo',
      d.status,
      d.rating
    ]);
    exportToPDF('Relatório de Motoristas de Carga Pesada SADC', headers, data, 'Motoristas_NTandinho');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#F5A300]" />
            Gestão da Equipa de Motoristas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastro de condutores de veículos pesados, certificação SADC e controlo de escalas de viagem.
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
            <span>Cadastrar Motorista</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={drivers}
        columns={columns}
        searchPlaceholder="Pesquisar por nome, telefone, nº de carta ou disponibilidade..."
      />

      {/* Modal: Create Driver */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Cadastrar Novo Motorista de Carga"
        subtitle="Preencha os dados profissionais e carta de condução"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: Januário Munguambe"
              value={newDriverForm.name}
              onChange={(e) => setNewDriverForm({ ...newDriverForm, name: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Profissional *</label>
              <input
                type="email"
                placeholder="motorista@ntandinho.co.mz"
                value={newDriverForm.email}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, email: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Telefone Principal *</label>
              <input
                type="text"
                placeholder="+258 84 000 0000"
                value={newDriverForm.phone}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, phone: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nº Carta de Condução *</label>
              <input
                type="text"
                placeholder="Ex: MZ-889911"
                value={newDriverForm.licenseNumber}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, licenseNumber: e.target.value })}
                className="stripe-input w-full font-mono uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Categoria de Carta *</label>
              <select
                value={newDriverForm.licenseCategory}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, licenseCategory: e.target.value })}
                className="stripe-input w-full"
              >
                <option value="CE">CE (Caminhão Articulado)</option>
                <option value="C">C (Caminhão Pesado)</option>
                <option value="C1E">C1E (Pesado C/ Reboque)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Validade da Carta *</label>
              <input
                type="date"
                value={newDriverForm.licenseExpiry}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, licenseExpiry: e.target.value })}
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
              Cadastrar Motorista
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
