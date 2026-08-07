import React, { useState } from 'react';
import { X, Wrench, ShieldCheck, Plus, Truck, AlertTriangle } from 'lucide-react';
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
  const [technician] = useState('Oficina Central Nampula');

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceLog({
      vehiclePlate: selectedPlate,
      type,
      description,
      costMzn: Number(costMzn),
      kmAtService: Number(kmAtService),
      technician,
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
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Manutenção Preventiva & Pneus por Eixo</h2>
            <p className="text-xs text-slate-400">Plano de mudança de óleo aos 30.000 KM e inspecção de piso dos pneus Michelin/Bridgestone.</p>
          </div>
        </div>

        {/* Visual Axle Tyre Status */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Truck size={16} className="text-brand-orange" /> Estado dos Eixos & Pneus (Cavalo Mecânico)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">1º Eixo Direcional (Frente)</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck size={14} /> Piso 8.5 mm (Excelente)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">2º Eixo Trativo (Duplo)</span>
              <span className="font-bold text-amber-400 flex items-center gap-1 mt-1">
                <AlertTriangle size={14} /> Piso 4.2 mm (Atenção / Rotação)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">3º Eixo Reboque (Tri-Axle)</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck size={14} /> Piso 9.0 mm (Novo)
              </span>
            </div>
          </div>
        </div>

        {/* Form para registar intervenção */}
        <form onSubmit={handleAddMaintenance} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Plus size={14} className="text-brand-orange" /> Lançar Ordem de Manutenção
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Camião</label>
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono cursor-pointer"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.make})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tipo de Intervenção</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 cursor-pointer"
              >
                <option value="TROCA_OLEO">Troca de Óleo & Filtros</option>
                <option value="SUBSTITUICAO_PNEUS">Substituição / Rotação de Pneus</option>
                <option value="REVISAO_TRAVOES">Revisão de Travões & Calços</option>
                <option value="INSPECAO_GERAL">Inspeção Preventiva Geral</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Custo Total (MZN)</label>
              <input
                type="number"
                value={costMzn}
                onChange={(e) => setCostMzn(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono font-bold text-emerald-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Descrição do Serviço Realizado</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Quilometragem no Serviço</label>
              <input
                type="number"
                value={kmAtService}
                onChange={(e) => setKmAtService(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer"
            >
              Gravar Intervenção de Manutenção
            </button>
          </div>
        </form>

        {/* Historico Manutencoes */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Histórico de Manutenções da Frota</h3>
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Camião</th>
                  <th className="p-3">Intervenção</th>
                  <th className="p-3 font-mono">KM</th>
                  <th className="p-3 font-mono">Custo MZN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-navy-900/60">
                {maintenanceLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 font-mono text-slate-400">{log.date}</td>
                    <td className="p-3 font-bold text-white font-mono">{log.vehiclePlate}</td>
                    <td className="p-3 text-slate-200">
                      <span className="font-semibold text-brand-orange block">{log.type.replace('_', ' ')}</span>
                      <span className="text-[11px] text-slate-400">{log.description}</span>
                    </td>
                    <td className="p-3 font-mono text-white">{log.kmAtService.toLocaleString('pt-MZ')} KM</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{log.costMzn.toLocaleString('pt-MZ')} MT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
