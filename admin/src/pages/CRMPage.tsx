import React, { useState } from 'react';
import { Building2, Plus, Mail, Phone, FileText, CheckCircle2, Eye, Receipt } from 'lucide-react';
import { PageHeader } from '../shared/layouts/PageHeader';
import { FilamentTable, FilamentColumn, FilamentFilter } from '../shared/components/ui/FilamentTable';
import { SlideOverDrawer } from '../shared/components/ui/SlideOverDrawer';
import { RowActionsDropdown } from '../shared/components/ui/RowActionsDropdown';
import { NewCustomerModal } from '../components/crm/NewCustomerModal';
import { CustomerHistoryModal } from '../components/crm/CustomerHistoryModal';
import { QuotationForm } from '../components/crm/QuotationForm';
import { CustomerItem, useErpStore } from '../shared/stores/useErpStore';
import { useNotificationStore } from '../shared/stores/useNotificationStore';

export const CRMPage: React.FC = () => {
  const { customers, quotations, convertQuotationToInvoice } = useErpStore();
  const { addToast } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'customers' | 'quotations'>('customers');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showQuotationFormModal, setShowQuotationFormModal] = useState(false);
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState<CustomerItem | null>(null);
  const [drawerCustomer, setDrawerCustomer] = useState<CustomerItem | null>(null);

  const handleExportCsv = () => {
    addToast('Exportar Clientes', 'Carteira corporativa de clientes exportada para CSV com sucesso!', 'success');
  };

  // Hybrid 2-Line Grouped Columns
  const customerColumns: FilamentColumn<CustomerItem>[] = [
    {
      key: 'name',
      header: 'Cliente & NUIT',
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <span className="font-bold text-white text-xs block truncate">{item.name}</span>
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span className="text-brand-orange font-bold">NUIT: {item.nuit}</span>
            <span className="text-slate-600">•</span>
            <span>{item.id}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contactos Diretos',
      render: (item) => (
        <div className="text-xs space-y-0.5">
          <span className="text-slate-300 flex items-center gap-1.5 truncate">
            <Mail size={12} className="text-brand-orange shrink-0" /> {item.email}
          </span>
          <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
            <Phone size={12} className="text-slate-500 shrink-0" /> {item.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Tipo & Estado',
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px] border border-slate-700 block w-fit">
            {item.isCorporate ? 'Pessoa Coletiva' : 'Pessoa Singular'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
            <CheckCircle2 size={11} /> {item.status}
          </span>
        </div>
      ),
    },
  ];

  const customerFilters: FilamentFilter[] = [
    {
      key: 'status',
      label: 'Estado do Cliente',
      options: [
        { label: 'Ativos', value: 'ATIVO' },
        { label: 'Inativos', value: 'INATIVO' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Comercial & Gestão de Clientes (CRM)"
        subtitle="Carteira de clientes corporativos, emissão de cotações de frete e histórico de faturação."
        icon={Building2}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuotationFormModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <FileText size={14} className="text-brand-orange" />
              <span>Emitir Cotação</span>
            </button>

            <button
              onClick={() => setShowNewCustomerModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus size={16} />
              <span>Novo Cliente Corporativo</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 size={16} />
          <span>Carteira de Clientes ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'quotations'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText size={16} />
          <span>Cotações Emitidas ({quotations.length})</span>
        </button>
      </div>

      {activeTab === 'customers' ? (
        <FilamentTable
          title="Lista de Clientes Cadastrados"
          subtitle="Empresas parceiras organizadas em blocos informativos de 2 linhas."
          columns={customerColumns}
          data={customers}
          searchPlaceholder="Pesquisar cliente por nome, NUIT ou email..."
          searchFields={['name', 'nuit', 'email', 'phone']}
          filters={customerFilters}
          onExportCsv={handleExportCsv}
          actions={(cust) => (
            <RowActionsDropdown
              items={[
                {
                  label: 'Histórico Comercial',
                  icon: FileText,
                  onClick: () => setSelectedHistoryCustomer(cust),
                },
                {
                  label: 'Ficha do Cliente (Drawer)',
                  icon: Eye,
                  onClick: () => setDrawerCustomer(cust),
                },
              ]}
            />
          )}
        />
      ) : (
        <div className="rounded-2xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-glass">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 align-middle">Cotação & Cliente</th>
                  <th className="p-3.5 align-middle">Rota & Carga</th>
                  <th className="p-3.5 font-mono text-right align-middle">Valores (Subtotal / IVA)</th>
                  <th className="p-3.5 align-middle">Estado</th>
                  <th className="p-3.5 text-right align-middle">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 align-middle space-y-0.5">
                      <span className="font-mono font-bold text-brand-orange block">{q.quotationNumber}</span>
                      <span className="font-bold text-white block">{q.customerName}</span>
                    </td>
                    <td className="p-3.5 align-middle space-y-0.5">
                      <span className="text-slate-300 block font-semibold">{q.origin} → {q.destination}</span>
                      <span className="text-slate-400 text-[11px] block">{q.cargoDescription}</span>
                    </td>
                    <td className="p-3.5 font-mono text-right align-middle space-y-0.5">
                      <span className="font-bold text-emerald-400 block">{q.totalPrice.toLocaleString('pt-MZ')} MT</span>
                      <span className="text-slate-400 text-[11px] block">Sub: {q.priceSubtotal.toLocaleString('pt-MZ')} MT</span>
                    </td>
                    <td className="p-3.5 align-middle">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${
                          q.status === 'APROVADA'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : q.status === 'FATURADO'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right align-middle">
                      <RowActionsDropdown
                        items={[
                          ...(q.status === 'APROVADA'
                            ? [
                                {
                                  label: 'Gerar Fatura Fiscal',
                                  icon: Receipt,
                                  variant: 'primary' as const,
                                  onClick: () => convertQuotationToInvoice(q.id),
                                },
                              ]
                            : []),
                          {
                            label: 'Ver Cotação',
                            icon: Eye,
                            onClick: () => addToast('Cotação', `Visualização da Cotação ${q.quotationNumber}`, 'info'),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-Over Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(drawerCustomer)}
        onClose={() => setDrawerCustomer(null)}
        title={`Ficha do Cliente: ${drawerCustomer?.name}`}
        subtitle="Dados cadastrais e histórico comercial"
        icon={Building2}
      >
        {drawerCustomer && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Identificação Fiscal</span>
              <p className="font-bold text-white text-base">{drawerCustomer.name}</p>
              <p className="font-mono text-brand-orange font-bold">NUIT: {drawerCustomer.nuit}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Contactos Principais</span>
              <p className="text-slate-200 flex items-center gap-1.5">
                <Mail size={14} className="text-brand-orange" /> {drawerCustomer.email}
              </p>
              <p className="text-slate-200 flex items-center gap-1.5 font-mono">
                <Phone size={14} className="text-slate-500" /> {drawerCustomer.phone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Estatuto Cadastral</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 inline-block">
                {drawerCustomer.status} (Credenciado)
              </span>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Modals */}
      {showNewCustomerModal && (
        <NewCustomerModal onClose={() => setShowNewCustomerModal(false)} onSuccess={() => setShowNewCustomerModal(false)} />
      )}

      {showQuotationFormModal && (
        <QuotationForm onClose={() => setShowQuotationFormModal(false)} onSuccess={() => setShowQuotationFormModal(false)} />
      )}

      {selectedHistoryCustomer && (
        <CustomerHistoryModal customer={selectedHistoryCustomer} onClose={() => setSelectedHistoryCustomer(null)} />
      )}
    </div>
  );
};
