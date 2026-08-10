import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore, InvoiceItem, PaymentItem, ExpenseItem } from '../shared/stores/useErpStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { exportToCSV } from '../utils/csvExporter';
import { printInvoice, printPaymentReceipt, printGeneralReport } from '../utils/documentPrinter';
import {
  Receipt,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Printer,
  Download,
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { invoices, payments, expenses, payInvoice, addInvoice, addExpense, deleteInvoice, deleteExpense } = useErpStore();
  const [activeTab, setActiveTab] = useState<'faturacao' | 'pagamentos' | 'despesas' | 'caixa'>('faturacao');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam === 'invoices' || tabParam === 'faturacao' || tabParam === 'facturas') setActiveTab('faturacao');
    else if (tabParam === 'payments' || tabParam === 'pagamentos' || tabParam === 'incomes' || tabParam === 'receitas') setActiveTab('pagamentos');
    else if (tabParam === 'expenses' || tabParam === 'despesas') setActiveTab('despesas');
    else if (tabParam === 'cash' || tabParam === 'caixa' || tabParam === 'overview') setActiveTab('caixa');
    else setActiveTab('faturacao');
  }, [tabParam]);

  const handleTabChange = (tab: 'faturacao' | 'pagamentos' | 'despesas' | 'caixa') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [payModalInvoice, setPayModalInvoice] = useState<InvoiceItem | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentItem['method']>('TRANSFERENCIA_BANCARIA');
  const [payRefNo, setPayRefNo] = useState('');

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

  // Form Invoice state
  const [invCustomerName, setInvCustomerName] = useState('Cervejas de Moçambique');
  const [invAmount, setInvAmount] = useState(150000);

  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = Math.round(Number(invAmount) / 1.16);
    const taxAmount = Number(invAmount) - subtotal;
    addInvoice({
      customerId: `cli-${Date.now()}`,
      customerName: invCustomerName,
      subtotal,
      taxAmount,
      totalAmount: Number(invAmount),
      currency: 'MZN',
      dueDate: new Date(Date.now() + 86400000 * 15).toISOString().slice(0, 10),
    });
    setIsAddInvoiceOpen(false);
  };
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('COMBUSTIVEL');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState(10000);

  const totalInvoicedMzn = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaidMzn = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalExpensesMzn = expenses.reduce((acc, e) => acc + e.amountMzn, 0);
  const cashBalanceMzn = totalPaidMzn - totalExpensesMzn;

  const handleExportCSV = () => {
    if (activeTab === 'faturacao') {
      const headers = ['Nº Fatura', 'Cliente', 'Subtotal (MZN)', 'IVA 16%', 'Total (MZN)', 'Liquidado (MZN)', 'Estado'];
      const rows = invoices.map((i) => [i.invoiceNumber, i.customerName, i.subtotal, i.taxAmount, i.totalAmount, i.paidAmount, i.status]);
      exportToCSV('faturamento_ntandinho', headers, rows);
    } else if (activeTab === 'pagamentos') {
      const headers = ['Ref. Recibo', 'Cliente', 'Fatura', 'Método', 'Valor (MZN)', 'Data'];
      const rows = payments.map((p) => [p.paymentNumber, p.customerName, p.invoiceNumber, p.method, p.amountMzn, p.paidAt]);
      exportToCSV('recibos_pagamento_ntandinho', headers, rows);
    } else if (activeTab === 'despesas') {
      const headers = ['Categoria', 'Descrição', 'Registado por', 'Valor (MZN)', 'Data'];
      const rows = expenses.map((e) => [e.category, e.description, e.registeredBy, e.amountMzn, e.date]);
      exportToCSV('despesas_operacionais_ntandinho', headers, rows);
    } else {
      const headers = ['Conta Bancária', 'Titular', 'Saldo Actual (MZN)'];
      const rows = [
        ['BCI — Banco Comercial e de Investimentos', "N' Tandinho S.A.", 4850000],
        ['Millennium BIM', "N' Tandinho S.A.", 2140000],
      ];
      exportToCSV('tesouraria_caixa_ntandinho', headers, rows);
    }
  };

  const handlePrintReport = () => {
    if (activeTab === 'faturacao') {
      const headers = ['Nº Fatura', 'Cliente', 'Subtotal (MZN)', 'IVA 16%', 'Total (MZN)', 'Liquidado', 'Estado'];
      const rows = invoices.map((i) => [i.invoiceNumber, i.customerName, `${i.subtotal.toLocaleString('pt-MZ')} MZN`, `${i.taxAmount.toLocaleString('pt-MZ')} MZN`, `${i.totalAmount.toLocaleString('pt-MZ')} MZN`, `${i.paidAmount.toLocaleString('pt-MZ')} MZN`, i.status]);
      printGeneralReport('Faturação e IVA (16%)', headers, rows);
    } else if (activeTab === 'pagamentos') {
      const headers = ['Ref. Recibo', 'Cliente', 'Fatura', 'Método', 'Valor Recebido (MZN)', 'Data'];
      const rows = payments.map((p) => [p.paymentNumber, p.customerName, p.invoiceNumber, p.method, `${p.amountMzn.toLocaleString('pt-MZ')} MZN`, p.paidAt]);
      printGeneralReport('Recebimentos e Recibos Emitidos', headers, rows);
    } else {
      const headers = ['Categoria', 'Descrição', 'Registado por', 'Valor Pago (MZN)', 'Data'];
      const rows = expenses.map((e) => [e.category, e.description, e.registeredBy, `${e.amountMzn.toLocaleString('pt-MZ')} MZN`, e.date]);
      printGeneralReport('Despesas Operacionais', headers, rows);
    }
  };

  // Columns for Faturas
  const invoiceColumns: Column<InvoiceItem>[] = [
    {
      key: 'invoiceNumber',
      header: 'Nº Fatura',
      accessor: (row) => <span className="font-mono font-extrabold text-brand-orange">{row.invoiceNumber}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Cliente Solicitante',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'subtotal',
      header: 'Subtotal (MZN)',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-300">{row.subtotal.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'taxAmount',
      header: 'IVA (16%)',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-300">{row.taxAmount.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'totalAmount',
      header: 'Valor Total',
      accessor: (row) => <span className="font-mono font-black text-slate-900 dark:text-white">{row.totalAmount.toLocaleString('pt-MZ')} MZN</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'paidAmount',
      header: 'Valor Liquidado',
      accessor: (row) => <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.paidAmount.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  // Columns for Pagamentos
  const paymentColumns: Column<PaymentItem>[] = [
    {
      key: 'paymentNumber',
      header: 'Ref. Recibo',
      accessor: (row) => <span className="font-mono font-extrabold text-brand-orange">{row.paymentNumber}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'invoiceNumber',
      header: 'Fatura Associada',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.invoiceNumber}</span>,
    },
    {
      key: 'method',
      header: 'Método & Comprovativo',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-medium">{row.method} ({row.referenceNo})</span>,
    },
    {
      key: 'amountMzn',
      header: 'Valor Recebido',
      accessor: (row) => <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{row.amountMzn.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'paidAt',
      header: 'Data Recebimento',
      accessor: (row) => <span className="font-mono text-slate-500 dark:text-slate-400">{row.paidAt}</span>,
    },
  ];

  // Columns for Despesas
  const expenseColumns: Column<ExpenseItem>[] = [
    {
      key: 'category',
      header: 'Categoria',
      accessor: (row) => (
        <span className="font-bold text-brand-orange px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-[#F6A823]/30 text-[10px]">
          {row.category}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Descrição da Despesa',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.description}</span>,
    },
    {
      key: 'registeredBy',
      header: 'Registado por',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-300">{row.registeredBy}</span>,
    },
    {
      key: 'amountMzn',
      header: 'Valor Pago',
      accessor: (row) => <span className="font-mono font-black text-rose-600 dark:text-rose-400">{row.amountMzn.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
    {
      key: 'date',
      header: 'Data Lançamento',
      accessor: (row) => <span className="font-mono text-slate-500 dark:text-slate-400">{row.date}</span>,
    },
  ];

  const handleOpenPayModal = (inv: InvoiceItem) => {
    setPayModalInvoice(inv);
    setPayAmount(inv.totalAmount - inv.paidAmount);
    setPayRefNo(`BCI-TRF-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (payModalInvoice && payAmount > 0) {
      payInvoice(payModalInvoice.id, Number(payAmount), payMethod, payRefNo);
      setPayModalInvoice(null);
    }
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category: expCategory,
      description: expDesc || `Despesa ${expCategory}`,
      amountMzn: Number(expAmount),
      registeredBy: 'Equipa Financeira',
    });
    setIsAddExpenseOpen(false);
  };

  return (
    <StandardPageLayout
      title="Gestão Financeira, Faturação (IVA 16%) & Caixa"
      description="Emissão de faturas, registo de recebimentos bancários/M-Pesa e controlo de despesas operacionais."
      icon={Receipt}
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
              onClick={() => handleTabChange('caixa')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'caixa' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => handleTabChange('faturacao')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'faturacao' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Faturas (IVA 16%)
            </button>
            <button
              onClick={() => handleTabChange('despesas')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'despesas' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Receitas & Despesas
            </button>
            <button
              onClick={() => handleTabChange('pagamentos')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'pagamentos' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recebimentos
            </button>
          </div>



          {/* DYNAMIC CONTEXTUAL PRIMARY ACTION BUTTON PER TAB */}
          {activeTab === 'faturacao' && (
            <button
              onClick={() => setIsAddInvoiceOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Emitir Fatura</span>
            </button>
          )}

          {activeTab === 'despesas' && (
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Lançar Despesa</span>
            </button>
          )}

          {(activeTab === 'pagamentos' || activeTab === 'caixa') && (
            <button
              onClick={() => setPayModalInvoice(invoices[0] || null)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <DollarSign size={15} />
              <span>Registar Pagamento</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        <>
          <MetricCard
            title="Total Faturado"
            value={`${(totalInvoicedMzn / 1000000).toFixed(2)}M`}
            unit="MZN"
            subtext="Faturas emitidas IVA 16%"
            icon={Receipt}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Total Recebido"
            value={`${(totalPaidMzn / 1000000).toFixed(2)}M`}
            unit="MZN"
            subtext="Entradas liquidadas"
            icon={TrendingUp}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Despesas Operacionais"
            value={`${(totalExpensesMzn / 1000).toFixed(0)}k`}
            unit="MZN"
            subtext="Combustível & Oficina"
            icon={TrendingDown}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            title="Saldo Líquido Caixa"
            value={`${(cashBalanceMzn / 1000000).toFixed(2)}M`}
            unit="MZN"
            subtext="Balanço Tesouraria S.A."
            icon={DollarSign}
            iconBg="bg-amber-50"
            iconColor="text-brand-orange"
          />
        </>
      }
    >
      {/* TAB 1: FATURAÇÃO */}
      {activeTab === 'faturacao' && (
        <DataTable
          data={invoices}
          columns={invoiceColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar por nº fatura ou cliente..."
          filterOptions={[
            {
              label: 'Estado',
              key: 'status',
              options: [
                { value: 'PAGO', label: 'Pago' },
                { value: 'EMITIDA', label: 'Emitida' },
                { value: 'VENCIDA', label: 'Vencida' },
              ],
            },
          ]}
          quickActions={[
            {
              label: 'Imprimir Fatura (PDF)',
              icon: Printer,
              onClick: (row) => printInvoice(row),
            },
            {
              label: 'Registar Pagamento',
              icon: CreditCard,
              onClick: (row) => handleOpenPayModal(row),
            },
            {
              label: 'Eliminar Fatura',
              isDestructive: true,
              onClick: (row) => deleteInvoice(row.id),
            },
          ]}
        />
      )}

      {/* TAB 2: RECEBIMENTOS */}
      {activeTab === 'pagamentos' && (
        <DataTable
          data={payments}
          columns={paymentColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar recibo ou cliente..."
          quickActions={[
            {
              label: 'Imprimir Recibo (PDF)',
              icon: Printer,
              onClick: (row) => printPaymentReceipt(row),
            },
          ]}
        />
      )}

      {/* TAB 3: DESPESAS */}
      {activeTab === 'despesas' && (
        <DataTable
          data={expenses}
          columns={expenseColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar despesas..."
          quickActions={[
            {
              label: 'Eliminar Despesa',
              isDestructive: true,
              onClick: (row) => deleteExpense(row.id),
            },
          ]}
        />
      )}

      {/* TAB 4: CAIXA */}
      {activeTab === 'caixa' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Resumo de Tesouraria & Contas Bancárias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-sky-700 dark:text-sky-400 block">BCI — Banco Comercial e de Investimentos</span>
              <p className="text-slate-600 dark:text-slate-400">Conta Principal N' Tandinho S.A.</p>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base block">4.850.000 MZN</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-sky-700 dark:text-sky-400 block">Millennium BIM</span>
              <p className="text-slate-600 dark:text-slate-400">Conta Operacional & Combustível</p>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base block">2.140.000 MZN</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTAR PAGAMENTO */}
      {payModalInvoice && (
        <Modal
          isOpen={!!payModalInvoice}
          onClose={() => setPayModalInvoice(null)}
          title={`Registar Recebimento — Fatura ${payModalInvoice.invoiceNumber}`}
          subtitle={`Cliente: ${payModalInvoice.customerName}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmPay} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor a Receber (MZN)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Método de Pagamento</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                <option value="TRANSFERENCIA_BANCARIA" className="dark:bg-slate-800">Transferência Bancária (BCI / BIM)</option>
                <option value="MPESA" className="dark:bg-slate-800">M-Pesa (Vodacom)</option>
                <option value="EMOLA" className="dark:bg-slate-800">e-Mola (Movitel)</option>
                <option value="CHEQUE" className="dark:bg-slate-800">Cheque Bancário</option>
                <option value="NUMERARIO" className="dark:bg-slate-800">Numerário (Caixa)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Referência do Comprovativo / NUL</label>
              <input
                type="text"
                value={payRefNo}
                onChange={(e) => setPayRefNo(e.target.value)}
                placeholder="Ex: BCI-TRF-901234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setPayModalInvoice(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
              >
                Confirmar Recebimento
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL ADICIONAR DESPESA */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Lançar Nova Despesa Operacional"
        subtitle="Registe pagamentos de combustível, oficina ou portagens"
        maxWidth="md"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Categoria</label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
            >
              <option value="COMBUSTIVEL" className="dark:bg-slate-800">Combustível (Petromoc/Galp)</option>
              <option value="MANUTENCAO" className="dark:bg-slate-800">Manutenção de Camiões</option>
              <option value="PORTAGEM" className="dark:bg-slate-800">Portagens & Escoltas</option>
              <option value="DIARIA_MOTORISTA" className="dark:bg-slate-800">Diárias de Motorista (SADC)</option>
              <option value="ALIMENTACAO" className="dark:bg-slate-800">Alimentação & Alojamento</option>
              <option value="OUTROS" className="dark:bg-slate-800">Outras Despesas</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Descrição da Despesa</label>
            <input
              type="text"
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="Ex: Abastecimento Volvo ABM-849-MC em Nampula"
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor (MZN)</label>
            <input
              type="number"
              value={expAmount}
              onChange={(e) => setExpAmount(Number(e.target.value))}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Lançar Despesa
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL EMITIR FATURA */}
      <Modal
        isOpen={isAddInvoiceOpen}
        onClose={() => setIsAddInvoiceOpen(false)}
        title="Emitir Nova Fatura de Serviços"
        subtitle="Emissão com imposto IVA (16%) para cliente de transporte"
        maxWidth="md"
      >
        <form onSubmit={handleAddInvoiceSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cliente Destinatário *</label>
            <input
              type="text"
              required
              value={invCustomerName}
              onChange={(e) => setInvCustomerName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor Total Faturado (MZN) *</label>
            <input
              type="number"
              required
              value={invAmount}
              onChange={(e) => setInvAmount(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal (Base Tributável):</span>
              <span className="font-mono">{Math.round(Number(invAmount) / 1.16).toLocaleString('pt-MZ')} MZN</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Imposto IVA (16%):</span>
              <span className="font-mono">{(Number(invAmount) - Math.round(Number(invAmount) / 1.16)).toLocaleString('pt-MZ')} MZN</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>Total da Fatura:</span>
              <span className="font-mono text-[#F6A823]">{Number(invAmount).toLocaleString('pt-MZ')} MZN</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddInvoiceOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Emitir Fatura
            </button>
          </div>
        </form>
      </Modal>
    </StandardPageLayout>
  );
};
