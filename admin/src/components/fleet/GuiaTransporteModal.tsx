import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { TripItem, useErpStore } from '../../shared/stores/useErpStore';

interface GuiaTransporteModalProps {
  load: TripItem;
  onClose: () => void;
}

export const GuiaTransporteModal: React.FC<GuiaTransporteModalProps> = ({ load, onClose }) => {
  const companyProfile = useErpStore((state) => state.companyProfile);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Guia de Transporte Oficial — N' Tandinho</h2>
            <p className="text-xs text-slate-400">Documento de acompanhamento da mercadoria em trânsito (Lei Fiscal de Moçambique).</p>
          </div>
        </div>

        {/* Printable Document Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black text-white">{companyProfile.name}</h3>
              <p className="text-slate-400">NUIT: {companyProfile.nuit}</p>
              <p className="text-slate-400">{companyProfile.address}, Matola / Maputo</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-brand-orange block">GUIA Nº: GT-{load.tripNumber}</span>
              <span className="text-[11px] text-slate-400 block">Data: {load.createdAt}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 font-bold block mb-1">CLIENTE / DESTINATÁRIO</span>
              <span className="font-bold text-white block">{load.customerName}</span>
              <span className="text-slate-300 block">{load.destination}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block mb-1">VIATURA & MOTORISTA</span>
              <span className="font-mono font-bold text-brand-orange block">{load.vehiclePlate} ({load.vehicleModel})</span>
              <span className="text-slate-300 block">Condutor: {load.driverName}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold block mb-1">DISCRIMINAÇÃO DA CARGA</span>
            <p className="text-slate-200 font-medium">{load.cargoDescription} ({load.weightKg.toLocaleString('pt-MZ')} kg)</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir Guia Oficial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
