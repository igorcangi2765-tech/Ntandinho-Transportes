import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../../shared/layouts/PageHeader';
import { FilamentTable, FilamentColumn, FilamentFilter } from '../../shared/components/ui/FilamentTable';
import { SlideOverDrawer } from '../../shared/components/ui/SlideOverDrawer';
import { RowActionsDropdown } from '../../shared/components/ui/RowActionsDropdown';
import { InvoiceViewerModal } from '../../components/finance/InvoiceViewerModal';
import { ReceiptViewerModal } from '../../components/finance/ReceiptViewerModal';
import { PaymentReceiptModal } from '../../components/finance/PaymentReceiptModal';
import { DreStatementModal } from '../../components/finance/DreStatementModal';
import { InvoiceItem, useErpStore } from '../../shared/stores/useErpStore';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';

export const FinanceDashboard: React.FC = () => {
  const { invoices } = useErpStore();
  const { addToast } = useNotificationStore();

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<InvoiceItem | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceItem | null>(null);
  const [drawerInvoice, setDrawerInvoice] = useState<InvoiceItem | null>(null);
  const [showDreModal, setShowDreModal] = useState(false);

  // Financial Metrics Calculation
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = totalRevenue - totalPaid;

  const handleExportCsv = () => {
    addToast('Exportar Faturação', 'Histórico financeiro exportado em ficheiro CSV com sucesso!', 'success');
  };

  // Hybrid 2-Line Grouped Columns
  const columns: FilamentColumn<InvoiceItem>[] = [
    {
      key: 'invoiceNumber',
      header: 'Fatura & Cliente',
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-brand-orange text-xs flex items-center gap-1.5">
            <FileText size={13} className="text-slate-500 shrink-0" />
            {item.invoiceNumber}
          </span>
          <span className="font-bold text-white text-xs block truncate">{item.customerName}</span>
        </div>
      ),
    },
    {
      key: 'subtotal',
      header: 'Subtotal & IVA (16%)',
      align: 'right',
      render: (item) => (
        <div className="space-y-0.5 font-mono text-xs text-right">
          <span className="text-slate-300 block">Subtotal: {Number(item.subtotal).toLocaleString('pt-MZ')} MT</span>
          <span className="text-brand-orange block text-[11px]">IVA (16%): {Number(item.taxAmount).toLocaleString('pt-MZ')} MT</span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Valor Total & Pago',
      align: 'right',
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5 font-mono text-xs text-right">
          <span className="font-extrabold text-emerald-400 block">{Number(item.totalAmount).toLocaleString('pt-MZ')} MT</span>
          <span className="text-slate-400 block text-[11px]">Pago: {Number(item.paidAmount).toLocaleString('pt-MZ')} MT</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado & Vencimento',
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
              item.status === 'PAGO'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : item.status === 'PAGO_PARCIAL'
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {item.status === 'PAGO' ? (
              <>
                <CheckCircle2 size={11} /> Pago Integral
              </>
            ) : item.status === 'PAGO_PARCIAL' ? (
              'Pago Parcial'
            ) : (
              <>
                <Clock size={11} /> Pendente
              </>
            )}
          </span>
          <span className="font-mono text-slate-400 text-[11px] block">Venc: {item.dueDate}</span>
        </div>
      ),
    },
  ];

  const filters: FilamentFilter[] = [
    {
      key: 'status',
      label: 'Estado de Pagamento',
      options: [
        { label: 'Pago Integralmente', value: 'PAGO' },
        { label: 'Pagamento Pendente', value: 'PENDENTE' },
        { label: 'Pago Parcial', value: 'PAGO_PARCIAL' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Faturação & Gestão Financeira"
        subtitle="Emissão de Faturas de Frete (IVA 16%), liquidação de recibos e relatório DRE corporativo."
        icon={Receipt}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDreModal(true)}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Demonstração DRE</span>
            </button>
          </div>
        }
      />

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-glass space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>Faturação Global Emitida</span>
            <DollarSign size={16} className="text-brand-orange" />
          </span>
          <p className="text-2xl font-extrabold text-white font-mono">{totalRevenue.toLocaleString('pt-MZ')} MZN</p>
          <span className="text-[11px] text-slate-400">Total bruto com IVA 16% incluído</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-glass space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>Valores Liquidados (Recebidos)</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{totalPaid.toLocaleString('pt-MZ')} MZN</p>
          <span className="text-[11px] text-slate-400">Transferências bancárias confirmadas</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-glass space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>Valores Pendentes a Receber</span>
            <Clock size={16} className="text-amber-400" />
          </span>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{totalPending.toLocaleString('pt-MZ')} MZN</p>
          <span className="text-[11px] text-slate-400">Faturas em prazo de vencimento</span>
        </div>
      </div>

      {/* Enterprise Filament Hybrid Table */}
      <FilamentTable
        title="Histórico de Faturas de Transporte & Serviços"
        subtitle="Registo fiscal oficial organizado em blocos híbridos de 2 linhas."
        columns={columns}
        data={invoices}
        searchPlaceholder="Pesquisar por fatura, cliente..."
        searchFields={['invoiceNumber', 'customerName']}
        filters={filters}
        onExportCsv={handleExportCsv}
        actions={(inv) => (
          <RowActionsDropdown
            items={[
              {
                label: 'Ver Fatura Oficial PDF',
                icon: Printer,
                onClick: () => setSelectedInvoice(inv),
              },
              ...(inv.status === 'PAGO'
                ? [
                    {
                      label: 'Ver Recibo de Pagamento',
                      icon: CreditCard,
                      variant: 'success' as const,
                      onClick: () => setReceiptInvoice(inv),
                    },
                  ]
                : [
                    {
                      label: 'Registar Liquidação',
                      icon: DollarSign,
                      variant: 'primary' as const,
                      onClick: () => setPaymentModalInvoice(inv),
                    },
                  ]),
              {
                label: 'Detalhes da Fatura (Drawer)',
                icon: Eye,
                onClick: () => setDrawerInvoice(inv),
              },
            ]}
          />
        )}
      />

      {/* Slide-Over Invoice Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(drawerInvoice)}
        onClose={() => setDrawerInvoice(null)}
        title={`Fatura: ${drawerInvoice?.invoiceNumber}`}
        subtitle="Detalhes cadastrais e financeiros do documento fiscal"
        icon={Receipt}
      >
        {drawerInvoice && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cliente Faturado</span>
              <p className="font-bold text-white text-base">{drawerInvoice.customerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Subtotal Sem Imposto</span>
                <span className="font-mono text-white font-bold mt-1 block">
                  {Number(drawerInvoice.subtotal).toLocaleString('pt-MZ')} MZN
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Imposto IVA (16%)</span>
                <span className="font-mono text-brand-orange font-bold mt-1 block">
                  {Number(drawerInvoice.taxAmount).toLocaleString('pt-MZ')} MZN
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total a Liquidar</span>
                <span className="font-mono text-xl font-extrabold text-emerald-400">
                  {Number(drawerInvoice.totalAmount).toLocaleString('pt-MZ')} MZN
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2">
                <span className="text-slate-400">Valor Já Pago:</span>
                <span className="font-mono font-bold text-white">
                  {Number(drawerInvoice.paidAmount).toLocaleString('pt-MZ')} MZN
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedInvoice(drawerInvoice);
                  setDrawerInvoice(null);
                }}
                className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer text-center"
              >
                Ver Fatura Oficial PDF
              </button>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Modals */}
      {selectedInvoice && (
        <InvoiceViewerModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {receiptInvoice && (
        <ReceiptViewerModal invoice={receiptInvoice} onClose={() => setReceiptInvoice(null)} />
      )}

      {paymentModalInvoice && (
        <PaymentReceiptModal
          onClose={() => setPaymentModalInvoice(null)}
          onSuccess={() => setPaymentModalInvoice(null)}
        />
      )}

      {showDreModal && (
        <DreStatementModal onClose={() => setShowDreModal(false)} />
      )}
    </div>
  );
};
