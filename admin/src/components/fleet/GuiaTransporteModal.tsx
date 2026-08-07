import React from 'react';
import { X, Printer, Download, Truck } from 'lucide-react';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';
import { LoadItem } from '../../shared/stores/useErpStore';
import { CompanyDocumentHeader } from '../shared/CompanyDocumentHeader';

interface GuiaTransporteModalProps {
  load: LoadItem;
  onClose: () => void;
}

export const GuiaTransporteModal: React.FC<GuiaTransporteModalProps> = ({ load, onClose }) => {
  const { addToast } = useNotificationStore();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast('Download Guia', `Guia de Transporte ${load.id} descarregada em formato PDF!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Barra de Ações Superior Discreta */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 text-slate-300">
          <div className="flex items-center space-x-2">
            <Truck size={15} className="text-brand-orange" />
            <span className="text-xs font-semibold text-white">Guia de Transporte {load.id}</span>
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
              documentType="GUIA DE TRANSPORTE"
              documentNumber={load.id}
              documentDate={load.departureDate}
              documentStatus={load.statusLabel}
              isPrintSheet={true}
            />

            {/* Expedidor & Destinatário */}
            <div className="py-2 border-y border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Expedidor / Cliente:</span>
                <p className="font-bold text-slate-900 mt-0.5">{load.client}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Origem: {load.origin}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Destino:</span>
                <p className="font-bold text-slate-900 mt-0.5">{load.destination}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Previsão (ETA): {load.eta}</p>
              </div>
            </div>

            {/* Frota & Motorista */}
            <div className="py-1 text-xs text-slate-700 flex flex-wrap justify-between gap-2 border-b border-slate-200 pb-2">
              <p>Camião: <strong className="font-mono text-slate-900">{load.truck}</strong></p>
              <p>Motorista: <strong className="text-slate-900">{load.driver}</strong></p>
            </div>

            {/* Tabela de Mercadorias */}
            <div className="pt-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200 text-[11px]">
                    <th className="py-2 px-3">Descrição da Carga</th>
                    <th className="py-2 px-3">Acondicionamento</th>
                    <th className="py-2 px-3 text-right font-mono">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{load.cargo}</td>
                    <td className="py-2.5 px-3 text-slate-600">Container 40ft / Paletizado</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">32.000 Kg</td>
                  </tr>
                </tbody>
              </table>
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
