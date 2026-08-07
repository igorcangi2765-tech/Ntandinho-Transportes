import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';
import { InvoiceItem, useErpStore } from '../../shared/stores/useErpStore';
import { CompanyDocumentHeader } from '../shared/CompanyDocumentHeader';

interface InvoiceViewerModalProps {
  invoice: InvoiceItem;
  onClose: () => void;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({ invoice, onClose }) => {
  const { addToast } = useNotificationStore();
  const { companyProfile } = useErpStore();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast('Download Fatura', `Fatura ${invoice.invoiceNumber} descarregada em formato PDF!`, 'success');
  };

  const isPaid = invoice.status === 'PAGO';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Barra de Ações Superior Discreta */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 text-slate-300">
          <div className="flex items-center space-x-2">
            <FileText size={15} className="text-brand-orange" />
            <span className="text-xs font-semibold text-white">Fatura {invoice.invoiceNumber}</span>
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
              className="px-3 py-1 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 text-xs font-bold rounded transition-all flex items-center gap-1.5 cursor-pointer"
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
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded shadow-xl p-6 sm:p-10 font-sans text-xs border border-slate-200 print:shadow-none print:p-0 print:border-none print:w-full space-y-5">
            {/* Cabeçalho Corporativo Essencial */}
            <CompanyDocumentHeader
              documentType="FATURA DE FRETE"
              documentNumber={invoice.invoiceNumber}
              documentDate={invoice.createdAt}
              dueDate={invoice.dueDate}
              documentStatus={isPaid ? 'PAGO' : 'PENDENTE'}
              isPrintSheet={true}
            />

            {/* Dados do Cliente (Apenas Nome e NUIT) */}
            <div className="py-2 border-b border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Faturado a:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{invoice.customerName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">NUIT Cliente:</span>
                <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">400192834</p>
              </div>
            </div>

            {/* Tabela de Serviços (Objetiva e Resumida) */}
            <div className="pt-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200 text-[11px]">
                    <th className="py-2 px-3">Descrição do Serviço</th>
                    <th className="py-2 px-3 text-right font-mono">Subtotal</th>
                    <th className="py-2 px-3 text-right font-mono">IVA (16%)</th>
                    <th className="py-2 px-3 text-right font-mono">Total ({invoice.currency || 'MZN'})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  <tr>
                    <td className="py-2.5 px-3">
                      <p className="font-medium text-slate-900">Serviço de Transporte Rodoviário de Cargas</p>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {Number(invoice.subtotal).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {Number(invoice.taxAmount).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {Number(invoice.totalAmount).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dados Bancários & Resumo Financeiro */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start text-xs">
              {/* Lado Esquerdo: Dados Bancários Essenciais (Banco, Titular, IBAN) */}
              <div className="sm:col-span-7 text-[11px] text-slate-600 space-y-0.5">
                <p className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider mb-1">Coordenadas Bancárias:</p>
                <p>Banco: <strong className="text-slate-900">Millennium bim</strong></p>
                <p>Titular: <strong className="text-slate-900">{companyProfile.name}</strong></p>
                <p>IBAN: <strong className="font-mono text-slate-900">MZ59 0001 0000 4001 9283 401 22</strong></p>
              </div>

              {/* Lado Direito: Resumo Financeiro (Subtotal, IVA, Total) */}
              <div className="sm:col-span-5 space-y-1 text-slate-700 sm:text-right">
                <div className="flex justify-between sm:justify-end gap-4">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900">
                    {Number(invoice.subtotal).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4">
                  <span>IVA (16%):</span>
                  <span className="font-mono text-slate-900">
                    {Number(invoice.taxAmount).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                  <span>TOTAL:</span>
                  <span className="font-mono">
                    {Number(invoice.totalAmount).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                  </span>
                </div>
              </div>
            </div>

            {/* Rodapé Institucional Discreto (Nota Única) */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
              <p>Documento emitido eletronicamente via ERP.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
