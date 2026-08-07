import React from 'react';
import { X, AlertTriangle, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface DriverDocAlertsModalProps {
  onClose: () => void;
}

export const DriverDocAlertsModal: React.FC<DriverDocAlertsModalProps> = ({ onClose }) => {
  const { drivers } = useErpStore();

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Alertas de Caducidade de Documentos</h2>
            <p className="text-xs text-slate-400">Controlo preventivo de Cartas de Condução de Pesados, Passaportes e Vistos SADC.</p>
          </div>
        </div>

        <div className="space-y-4">
          {drivers.map((drv) => (
            <div
              key={drv.id}
              className={`p-5 rounded-2xl border transition-all ${
                drv.docStatus === 'ALERTA_EXPIRACAO'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 text-white font-bold">
                    <UserCheck size={18} className="text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{drv.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Carta: {drv.licenseNumber} • Tel: {drv.phone}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                    drv.docStatus === 'ALERTA_EXPIRACAO'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {drv.docStatus === 'ALERTA_EXPIRACAO' ? (
                    <>
                      <AlertTriangle size={13} /> EXPIRA EM BREVE
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={13} /> DOCUMENTAÇÃO VÁLIDA
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Carta de Condução:</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                    <Calendar size={12} className="text-brand-orange" /> {drv.licenseExpDate}
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border ${drv.passportExpDate < '2026-10-01' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-900/60 border-slate-800/80 text-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block font-semibold">Passaporte SADC:</span>
                  <span className="font-mono font-bold flex items-center gap-1 mt-0.5">
                    <Calendar size={12} /> {drv.passportExpDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Visto Trabalhador SADC:</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                    <Calendar size={12} className="text-emerald-400" /> {drv.sadcVisaExpDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Fechar Alertas
          </button>
        </div>
      </div>
    </div>
  );
};
