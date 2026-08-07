import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, Building2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { NewCustomerModal } from '../../components/crm/NewCustomerModal';
import { CustomerHistoryModal } from '../../components/crm/CustomerHistoryModal';
import { useErpStore, CustomerItem } from '../../shared/stores/useErpStore';

export const CustomersList: React.FC = () => {
  const { customers } = useErpStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ATIVO' | 'INATIVO'>('ALL');
  const [page, setPage] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const pageSize = 5;

  const toggleStatusFilter = () => {
    if (statusFilter === 'ALL') setStatusFilter('ATIVO');
    else if (statusFilter === 'ATIVO') setStatusFilter('INATIVO');
    else setStatusFilter('ALL');
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nuit && c.nuit.includes(search)) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Pesquisar por empresa, NUIT ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-orange/60"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={toggleStatusFilter}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              statusFilter !== 'ALL'
                ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Filter size={14} />
            <span>Filtro: {statusFilter === 'ALL' ? 'Todos os Estados' : statusFilter}</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 text-xs font-bold rounded-xl shadow-glow transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="rounded-2xl bg-navy-900/80 border border-slate-800 overflow-hidden shadow-glass">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Empresa / Cliente</th>
                <th className="p-4">NUIT Fiscal</th>
                <th className="p-4">Contactos</th>
                <th className="p-4">Perfil</th>
                <th className="p-4">Estatuto</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                paginated.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <Building2 size={16} className="text-brand-orange shrink-0" />
                        {customer.name}
                      </div>
                      <div className="text-[10px] text-slate-500">ID: {customer.id}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      {customer.nuit || '400192834'}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Mail size={12} className="text-brand-orange shrink-0" /> {customer.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone size={12} className="shrink-0" /> {customer.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {customer.isCorporate ? 'Corporativo' : 'Particular'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
                        {customer.status || 'ATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-brand-orange hover:underline font-semibold cursor-pointer"
                      >
                        Ver Histórico
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            A mostrar {paginated.length} de {filtered.length} clientes
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-white px-2">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewCustomerModal
          onClose={() => setShowNewModal(false)}
          onSuccess={() => setPage(1)}
        />
      )}

      {selectedCustomer && (
        <CustomerHistoryModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};
