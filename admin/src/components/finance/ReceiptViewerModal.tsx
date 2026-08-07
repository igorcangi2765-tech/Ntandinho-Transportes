import React from 'react';
import { X, Printer, Download, CreditCard } from 'lucide-react';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';
import { InvoiceItem, useErpStore } from '../../shared/stores/useErpStore';
import { CompanyDocumentHeader } from '../shared/CompanyDocumentHeader';

interface ReceiptViewerModalProps {
  invoice: InvoiceItem;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({ invoice, onClose }) => {
  const { addToast } = useNotificationStore();
  const { companyProfile } = useErpStore();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast('Download Recibo', `Recibo oficial para a Fatura ${invoice.invoiceNumber} descarregado em PDF!`, 'success');
  };

  const receiptNumber = `RC-2026-${invoice.invoiceNumber.replace(/\D/g, '') || '001'}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Barra de Ações Superior Discreta */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 text-slate-300">
          <div className="flex items-center space-x-2">
            <CreditCard size={15} className="text-emerald-400" />
            <span className="text-xs font-semibold text-white">Recibo {receiptNumber}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer ml-1"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Folha Oficial de Documento (SAP / Primavera / PHC Standard - Less is More) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-slate-950/40">
          <div className="max-w-2xl mx-auto bg-white text-slate-900 rounded shadow-xl p-6 sm:p-10 font-sans text-xs border border-slate-200 print:shadow-none print:p-0 print:border-none print:w-full space-y-5">
            {/* Cabeçalho Corporativo Essencial */}
            <CompanyDocumentHeader
              documentType="RECIBO DE PAGAMENTO"
              documentNumber={receiptNumber}
              documentDate={new Date().toISOString().slice(0, 10)}
              documentStatus="LIQUIDADO"
              isPrintSheet={true}
            />

            {/* Ficha de Liquidação Essencial */}
            <div className="py-3 border-y border-slate-200 space-y-2 text-xs text-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Recebido de:</span>
                <span className="font-bold text-slate-900">{invoice.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Quantia de:</span>
                <span className="font-mono font-bold text-slate-900">
                  {Number(invoice.paidAmount).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Referente à Fatura:</span>
                <span className="font-mono text-slate-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Forma de Pagamento:</span>
                <span className="text-slate-900 font-medium">Transferência Bancária (Millennium bim)</span>
              </div>
            </div>

            {/* Coordenadas Bancárias Essenciais */}
            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
              <p>Banco: <strong className="text-slate-900">Millennium bim</strong></p>
              <p>Titular: <strong className="text-slate-900">{companyProfile.name}</strong></p>
              <p>IBAN: <strong className="font-mono text-slate-900">MZ59 0001 0000 4001 9283 401 22</strong></p>
            </div>

            {/* Rodapé Institucional Discreto */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
              <p>Documento emitido eletronicamente via ERP.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
