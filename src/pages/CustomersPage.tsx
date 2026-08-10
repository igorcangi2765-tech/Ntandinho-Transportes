import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Customer } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { Users, Plus, Star, MapPin, Mail, Phone, FileSpreadsheet, FileText, Building2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers, trips, invoices, createCustomer } = useData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    companyName: '',
    nuit: '',
    email: '',
    phone: '',
    city: 'Nampula',
    address: '',
    notes: ''
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer(newCustomerForm);
    setIsCreateModalOpen(false);
    setNewCustomerForm({
      name: '',
      companyName: '',
      nuit: '',
      email: '',
      phone: '',
      city: 'Nampula',
      address: '',
      notes: ''
    });
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Cliente / Empresa',
      accessorKey: 'name',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap font-bold text-slate-100">
          {r.name} <span className="text-[11px] text-slate-400 font-normal">({r.companyName} • NUIT: {r.nuit})</span>
        </span>
      )
    },
    {
      header: 'Contactos',
      cell: (r) => (
        <span className="whitespace-nowrap text-xs text-slate-300 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{r.email}</span>
          <span className="text-slate-500">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400"><Phone className="w-3.5 h-3.5 text-slate-400" />{r.phone}</span>
        </span>
      )
    },
    {
      header: 'Cidade / Localização',
      accessorKey: 'city',
      sortable: true,
      cell: (r) => (
        <span className="whitespace-nowrap text-slate-300 font-medium inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#F5A300]" />
          {r.city}
        </span>
      )
    },
    {
      header: 'Viagens Realizadas',
      accessorKey: 'totalTrips',
      sortable: true,
      cell: (r) => <span className="whitespace-nowrap font-bold text-slate-200">{r.totalTrips} expedições</span>
    },
    {
      header: 'Total Faturado (MZN)',
      accessorKey: 'totalSpentMzn',
      sortable: true,
      cell: (r) => <span className="whitespace-nowrap font-bold text-emerald-400">{r.totalSpentMzn.toLocaleString()} MZN</span>
    },
    {
      header: 'Avaliação',
      accessorKey: 'rating',
      sortable: true,
      cell: (r) => (
        <div className="whitespace-nowrap inline-flex items-center gap-1 font-bold text-amber-400">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{r.rating}</span>
        </div>
      )
    },
    {
      header: 'Ações',
      cell: (r) => (
        <button
          onClick={() => setSelectedCustomer(r)}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#F5A300] font-medium text-[11px]"
        >
          Ver Ficha Completa
        </button>
      )
    }
  ];

  const handleExportExcel = () => {
    const data = customers.map((c) => ({
      Nome: c.name,
      Empresa: c.companyName,
      NUIT: c.nuit,
      Email: c.email,
      Telefone: c.phone,
      Cidade: c.city,
      TotalViagens: c.totalTrips,
      TotalFaturadoMzn: c.totalSpentMzn,
      Rating: c.rating
    }));
    exportToExcel('Clientes_NTandinho', 'Clientes', data);
  };

  const handleExportPDF = () => {
    const headers = ['Cliente', 'Empresa', 'NUIT', 'Cidade', 'Viagens', 'Total Faturado', 'Rating'];
    const data = customers.map((c) => [
      c.name,
      c.companyName,
      c.nuit,
      c.city,
      c.totalTrips,
      `${c.totalSpentMzn.toLocaleString()} MZN`,
      c.rating
    ]);
    exportToPDF('Relatório de Clientes e Grandes Contas', headers, data, 'Clientes_NTandinho');
  };

  const customerTrips = selectedCustomer ? trips.filter((t) => t.customerId === selectedCustomer.id) : [];
  const customerInvoices = selectedCustomer ? invoices.filter((i) => i.customerId === selectedCustomer.id) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#F5A300]" />
            Gestão de Clientes & Grandes Contas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastro de empresas contratantes, histórico de expedições e volume financeiro acumulado.
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
            <span>Adicionar Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Pesquisar por nome de cliente, empresa, NUIT ou cidade..."
      />

      {/* Modal: Customer Details */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Ficha do Cliente - ${selectedCustomer?.name}`}
        subtitle={`${selectedCustomer?.companyName} | NUIT: ${selectedCustomer?.nuit}`}
        maxWidth="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs">
            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                <span className="font-bold text-slate-100">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Telefone</span>
                <span className="font-bold text-slate-100">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cidade</span>
                <span className="font-bold text-[#F5A300]">{selectedCustomer.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Faturado</span>
                <span className="font-bold text-emerald-400">{selectedCustomer.totalSpentMzn.toLocaleString()} MZN</span>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Endereço Fiscal & Instalações</span>
              <p className="text-slate-200 font-medium">{selectedCustomer.address}</p>
            </div>

            {/* History Tabs */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Histórico de Viagens Concluídas ({customerTrips.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerTrips.length > 0 ? (
                  customerTrips.map((t) => (
                    <div key={t.id} className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/60 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#F5A300]">{t.code}</span>
                        <span className="text-slate-300 ml-2 font-medium">{t.origin} → {t.destination}</span>
                      </div>
                      <span className="font-bold text-emerald-400">{t.valueMzn.toLocaleString()} MZN</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-3">Sem histórico recente de expedições.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Create Customer */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registar Novo Cliente"
        subtitle="Preencha os dados da empresa contratante"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nome de Exibição *</label>
            <input
              type="text"
              placeholder="Ex: Cervejas de Moçambique"
              value={newCustomerForm.name}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Razão Social / Firma *</label>
              <input
                type="text"
                placeholder="Ex: CDM S.A."
                value={newCustomerForm.companyName}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">NUIT Fiscal *</label>
              <input
                type="text"
                placeholder="Ex: 400129841"
                value={newCustomerForm.nuit}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, nuit: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Comercial *</label>
              <input
                type="email"
                placeholder="Ex: logistica@empresa.co.mz"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Telefone *</label>
              <input
                type="text"
                placeholder="Ex: +258 84 000 0000"
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Cidade Sede *</label>
              <select
                value={newCustomerForm.city}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                className="stripe-input w-full"
              >
                <option value="Nampula">Nampula</option>
                <option value="Nacala-Porto">Nacala-Porto</option>
                <option value="Beira">Beira</option>
                <option value="Maputo">Maputo</option>
                <option value="Matola">Matola</option>
                <option value="Tete">Tete</option>
                <option value="Pemba">Pemba</option>
                <option value="Lichinga">Lichinga</option>
                <option value="Quelimane">Quelimane</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Endereço Completo *</label>
              <input
                type="text"
                placeholder="Avenida / Bairro / Parque Industrial"
                value={newCustomerForm.address}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Observações Comerciais</label>
            <textarea
              rows={2}
              placeholder="Prazos de pagamento, condições especiais..."
              value={newCustomerForm.notes}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
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
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
