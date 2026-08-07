import React from 'react';
import { X, Building2, Mail, Phone, FileText, CheckCircle2, Truck } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  nuit: string;
  email: string;
  phone: string;
  isCorporate: boolean;
  status: string;
  createdAt: string;
}

interface CustomerHistoryModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{customer.name}</h2>
            <p className="text-xs text-slate-400 font-mono">NUIT: {customer.nuit || '400192834'} • ID: {customer.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
            <p className="text-slate-400">Contactos Comerciais</p>
            <p className="font-semibold text-slate-200 flex items-center gap-1.5"><Mail size={12} className="text-brand-orange" /> {customer.email}</p>
            <p className="font-semibold text-slate-300 flex items-center gap-1.5"><Phone size={12} /> {customer.phone}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
            <p className="text-slate-400">Estatuto Comercial</p>
            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Cliente Ativo Corporativo
            </p>
            <p className="text-[11px] text-slate-500">Registo no ERP: {customer.createdAt || '2026-01-15'}</p>
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Histórico de Operações & Fretes</h3>

        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                <Truck size={14} className="text-brand-orange" />
                Maputo ➔ Nampula (32 Ton Cerveja 2M)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Viagem TRIP-2026-901 • Fatura FT-2026-001</p>
            </div>
            <span className="font-mono font-bold text-emerald-400">406.000 MZN</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                <FileText size={14} className="text-brand-orange" />
                Cotação COT-2026-001 (Aprovada)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Contrato Anual de Logística CTR-2026-101</p>
            </div>
            <span className="font-mono font-bold text-slate-300">4.860.000 MZN</span>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Fechar Ficha do Cliente
          </button>
        </div>
      </div>
    </div>
  );
};
