import React from 'react';
import { X, Printer, Download, PieChart } from 'lucide-react';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';
import { CompanyDocumentHeader } from '../shared/CompanyDocumentHeader';

interface DreStatementModalProps {
  onClose: () => void;
}

export const DreStatementModal: React.FC<DreStatementModalProps> = ({ onClose }) => {
  const { addToast } = useNotificationStore();

  const handleDownloadPDF = () => {
    addToast('Download DRE', 'Demonstração de Resultados DRE descarregada em formato PDF!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Barra de Ações Superior Discreta */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 text-slate-300">
          <div className="flex items-center space-x-2">
            <PieChart size={15} className="text-brand-orange" />
            <span className="text-xs font-semibold text-white">Demonstração de Resultados (DRE)</span>
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
              onClick={handleDownloadPDF}
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
              documentType="DEMONSTRAÇÃO DE RESULTADOS"
              documentNumber="DRE-2026-AGO"
              documentDate="07/Ago/2026"
              isPrintSheet={true}
            />

            {/* Demonstração de Resultados Limpa */}
            <div className="border border-slate-200 rounded font-mono text-xs overflow-hidden">
              <div className="bg-slate-50 p-2.5 font-bold text-slate-900 flex justify-between border-b border-slate-200">
                <span>RECEITA BRUTA DE FRETES</span>
                <span>4.850.000,00 MZN</span>
              </div>

              <div className="p-2.5 space-y-1.5 border-b border-slate-200 text-slate-700">
                <div className="flex justify-between">
                  <span>(-) IVA (16%)</span>
                  <span className="text-red-700">-668.965,52 MZN</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>(=) RECEITA LÍQUIDA DE FRETES</span>
                  <span>4.181.034,48 MZN</span>
                </div>
              </div>

              <div className="p-2.5 space-y-1 border-b border-slate-200 text-slate-600 bg-slate-50/50">
                <span className="font-bold text-slate-700 font-sans block mb-0.5 text-[10px] uppercase">
                  (-) Custos Operacionais Directos:
                </span>
                <div className="flex justify-between">
                  <span>• Combustível Diesel</span>
                  <span>-940.000,00 MZN</span>
                </div>
                <div className="flex justify-between">
                  <span>• Dietas de Motoristas</span>
                  <span>-210.000,00 MZN</span>
                </div>
                <div className="flex justify-between">
                  <span>• Portagens & Fronteiras</span>
                  <span>-145.000,00 MZN</span>
                </div>
                <div className="flex justify-between">
                  <span>• Manutenção & Pneus</span>
                  <span>-226.034,48 MZN</span>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-3 font-bold flex justify-between text-sm">
                <span>(=) MARGEM LÍQUIDA OPERACIONAL</span>
                <span className="text-emerald-400">2.660.000,00 MZN (54.8%)</span>
              </div>
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
