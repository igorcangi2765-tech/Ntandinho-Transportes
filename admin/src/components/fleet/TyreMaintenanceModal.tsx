import React, { useState } from 'react';
import { X, Wrench, Plus } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface TyreMaintenanceModalProps {
  onClose: () => void;
}

export const TyreMaintenanceModal: React.FC<TyreMaintenanceModalProps> = ({ onClose }) => {
  const { maintenanceLogs, vehicles, addMaintenanceLog } = useErpStore();

  const [selectedPlate, setSelectedPlate] = useState(vehicles[0]?.plateNumber || 'ABM-849-MC');
  const [type, setType] = useState<'TROCA_OLEO' | 'SUBSTITUICAO_PNEUS' | 'REVISAO_TRAVOES' | 'INSPECAO_GERAL'>('TROCA_OLEO');
  const [description, setDescription] = useState('Substituição de óleo sintético Castrol 10W-40 e rotação de pneus trativos');
  const [costMzn, setCostMzn] = useState<number>(28500);
  const [kmAtService, setKmAtService] = useState<number>(124500);
  const [workshop] = useState('Oficina Central Matola');

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceLog({
      vehiclePlate: selectedPlate,
      type,
      category: 'PREVENTIVA',
      description,
      costMzn: Number(costMzn),
      kmAtService: Number(kmAtService),
      workshop,
    });
  };

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
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Manutenção Preventiva & Pneus</h2>
            <p className="text-xs text-slate-400">Registo de revisões mecânicas e calibração/substituição de pneus da frota N' Tandinho.</p>
          </div>
        </div>

        {/* Historic logs preview */}
        <div className="mb-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Últimas Intervenções em Oficina</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {maintenanceLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-brand-orange mr-2">{log.vehiclePlate}</span>
                  <span className="font-semibold text-white">{log.type}</span>
                  <span className="text-slate-500 block text-[11px]">{log.description}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 block">{log.costMzn.toLocaleString('pt-MZ')} MZN</span>
                  <span className="text-[10px] text-slate-500">{log.workshop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddMaintenance} className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-white">Lançar Nova Intervenção</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Camião Pesado</label>
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} — {v.make} {v.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Serviço</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              >
                <option value="TROCA_OLEO">Troca de Óleo & Filtros</option>
                <option value="SUBSTITUICAO_PNEUS">Substituição / Rotação de Pneus</option>
                <option value="REVISAO_TRAVOES">Revisão de Travões & Calços</option>
                <option value="INSPECAO_GERAL">Inspeção Geral Periódica</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custo Total (MZN)</label>
              <input
                type="number"
                value={costMzn}
                onChange={(e) => setCostMzn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quilometragem no Serviço (Km)</label>
              <input
                type="number"
                value={kmAtService}
                onChange={(e) => setKmAtService(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Técnica</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Registar Manutenção</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
