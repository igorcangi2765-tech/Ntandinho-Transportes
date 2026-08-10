import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Invoice, FinancialTransaction } from '../types';
import { exportToExcel, exportToPDF, generateInvoicePDF } from '../utils/exportUtils';
import {
  DollarSign,
  Plus,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  PieChart as PieIcon
} from 'lucide-react';

export const FinancialPage: React.FC = () => {
  const { invoices, transactions, customers, createInvoice, markInvoicePaid } = useData();

  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions'>('invoices');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New invoice form
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    customerId: customers[0]?.id || '',
    amountMzn: 350000,
    dueDate: '2026-09-01',
    description: 'Serviço de Transporte de Carga Nacional'
  });

  const totalInvoicedMzn = invoices.reduce((acc, i) => acc + i.totalAmountMzn, 0);
  const totalPaidMzn = invoices.filter((i) => i.status === 'PAGA').reduce((acc, i) => acc + i.totalAmountMzn, 0);
  const totalPendingMzn = invoices.filter((i) => i.status === 'PENDENTE').reduce((acc, i) => acc + i.totalAmountMzn, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newInvoiceForm.customerId);
    createInvoice({
      ...newInvoiceForm,
      customerName: cust ? cust.name : 'Cliente',
      items: [
        {
          description: newInvoiceForm.description,
          quantity: 1,
          unitPriceMzn: newInvoiceForm.amountMzn,
          totalMzn: newInvoiceForm.amountMzn
        }
      ]
    });
    setIsCreateModalOpen(false);
  };

  const invoiceColumns: Column<Invoice>[] = [
    {
      header: 'Código Fatura',
      accessorKey: 'code',
      sortable: true,
      cell: (r) => <span className="font-bold text-[#F5A300] whitespace-nowrap">{r.code}</span>
    },
    {
      header: 'Cliente Solicitante',
      accessorKey: 'customerName',
      sortable: true,
      cell: (r) => <span className="font-semibold text-slate-100 whitespace-nowrap">{r.customerName}</span>
    },
    {
      header: 'Data Emissão',
      accessorKey: 'issueDate',
      sortable: true,
      cell: (r) => <span className="text-slate-400 whitespace-nowrap">{r.issueDate}</span>
    },
    {
      header: 'Vencimento',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (r) => <span className="text-slate-400 whitespace-nowrap">{r.dueDate}</span>
    },
    {
      header: 'Total com IVA (MZN)',
      accessorKey: 'totalAmountMzn',
      sortable: true,
      cell: (r) => <span className="font-extrabold text-emerald-400 whitespace-nowrap">{r.totalAmountMzn.toLocaleString()} MZN</span>
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => (
        <span
          className={`stripe-badge ${
            r.status === 'PAGA'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : r.status === 'VENCIDA'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {r.status}
        </span>
      )
    },
    {
      header: 'Ações Fiscais',
      cell: (r) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => generateInvoicePDF(r)}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#F5A300] font-medium text-[11px] flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#F5A300]" />
            Baixar PDF
          </button>

          {r.status !== 'PAGA' && (
            <button
              onClick={() => markInvoicePaid(r.id)}
              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold text-[11px] flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Liquidar
            </button>
          )}
        </div>
      )
    }
  ];

  const transactionColumns: Column<FinancialTransaction>[] = [
    {
      header: 'Data',
      accessorKey: 'date',
      sortable: true,
      cell: (r) => <span className="text-slate-400 whitespace-nowrap">{r.date}</span>
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      sortable: true,
      cell: (r) => (
        <span className={`stripe-badge ${
          r.type === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          {r.type}
        </span>
      )
    },
    {
      header: 'Categoria',
      accessorKey: 'category',
      sortable: true,
      cell: (r) => <span className="font-semibold text-slate-200 whitespace-nowrap">{r.category}</span>
    },
    {
      header: 'Descrição',
      accessorKey: 'description',
      cell: (r) => <span className="text-slate-300 whitespace-nowrap">{r.description}</span>
    },
    {
      header: 'Valor (MZN)',
      accessorKey: 'amountMzn',
      sortable: true,
      cell: (r) => (
        <span className={`font-bold whitespace-nowrap ${r.type === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {r.type === 'RECEITA' ? '+' : '-'}{r.amountMzn.toLocaleString()} MZN
        </span>
      )
    }
  ];

  const handleExportInvoicesExcel = () => {
    const data = invoices.map((i) => ({
      Codigo: i.code,
      Cliente: i.customerName,
      Emissao: i.issueDate,
      Vencimento: i.dueDate,
      SubtotalMzn: i.amountMzn,
      IvaMzn: i.taxMzn,
      TotalMzn: i.totalAmountMzn,
      Estado: i.status
    }));
    exportToExcel('Faturacao_NTandinho', 'Faturas', data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#F5A300]" />
            Gestão Financeira & Faturação Fiscal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Emissão de faturas com IVA (16%), contas a receber e fluxo de caixa operacional.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportInvoicesExcel} className="stripe-button-secondary text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Faturas</span>
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="stripe-button-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Emitir Nova Fatura</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stripe-card p-4 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Faturado</span>
          <div className="text-xl font-black text-slate-100">{totalInvoicedMzn.toLocaleString()} MZN</div>
          <span className="text-[11px] text-slate-400">Acumulado no sistema</span>
        </div>

        <div className="stripe-card p-4 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Recebido (Pago)</span>
          <div className="text-xl font-black text-emerald-400">{totalPaidMzn.toLocaleString()} MZN</div>
          <span className="text-[11px] text-emerald-400 font-medium">Liquidadas no banco</span>
        </div>

        <div className="stripe-card p-4 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pendente de Cobrança</span>
          <div className="text-xl font-black text-amber-400">{totalPendingMzn.toLocaleString()} MZN</div>
          <span className="text-[11px] text-amber-400 font-medium">A aguardar pagamento</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
            activeTab === 'invoices'
              ? 'bg-[#F5A300] text-slate-950 border-[#F5A300]'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          Faturas Emitidas ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
            activeTab === 'transactions'
              ? 'bg-[#F5A300] text-slate-950 border-[#F5A300]'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          Livro de Caixa & Transações ({transactions.length})
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'invoices' ? (
        <DataTable
          data={invoices}
          columns={invoiceColumns}
          searchPlaceholder="Pesquisar faturas por código, cliente ou estado..."
        />
      ) : (
        <DataTable
          data={transactions}
          columns={transactionColumns}
          searchPlaceholder="Pesquisar transações por categoria, descrição ou tipo..."
        />
      )}

      {/* Modal: Create Invoice */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Emitir Nova Fatura Fiscal"
        subtitle="O IVA de 16% será calculado automaticamente sobre o valor base"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Cliente Solicitante *</label>
            <select
              value={newInvoiceForm.customerId}
              onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customerId: e.target.value })}
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

          <div>
            <label className="block text-slate-300 font-medium mb-1">Descrição do Serviço *</label>
            <input
              type="text"
              placeholder="Ex: Transporte de Mercadorias Nampula -> Maputo"
              value={newInvoiceForm.description}
              onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, description: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Valor Base sem IVA (MZN) *</label>
              <input
                type="number"
                value={newInvoiceForm.amountMzn}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amountMzn: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Data de Vencimento *</label>
              <input
                type="date"
                value={newInvoiceForm.dueDate}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Valor Base:</span>
              <span>{newInvoiceForm.amountMzn.toLocaleString()} MZN</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>IVA (16%):</span>
              <span>{(newInvoiceForm.amountMzn * 0.16).toLocaleString()} MZN</span>
            </div>
            <div className="flex justify-between font-bold text-[#F5A300] pt-1 border-t border-slate-700">
              <span>Total da Fatura:</span>
              <span>{(newInvoiceForm.amountMzn * 1.16).toLocaleString()} MZN</span>
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
              Emitir Fatura
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
