import React, { useState } from 'react';
import { X, Fuel, Plus, Gauge, Truck } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface FuelManagementModalProps {
  onClose: () => void;
}

export const FuelManagementModal: React.FC<FuelManagementModalProps> = ({ onClose }) => {
  const { fuelLogs, vehicles, drivers, addFuelLog } = useErpStore();

  const [selectedPlate, setSelectedPlate] = useState(vehicles[0]?.plateNumber || 'ABM-849-MC');
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]?.name || 'João Mucavel');
  const [stationName, setStationName] = useState<'Petromoc' | 'Galp' | 'TotalEnergies' | 'Engen'>('Petromoc');
  const [liters, setLiters] = useState<number>(400);
  const [costMzn, setCostMzn] = useState<number>(37600);
  const [currentKm, setCurrentKm] = useState<number>(124500);

  const handleAddFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelLog({
      vehiclePlate: selectedPlate,
      driverName: selectedDriver,
      stationName,
      liters: Number(liters),
      totalCostMzn: Number(costMzn),
      currentKm: Number(currentKm),
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Fuel size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Gestão de Abastecimentos & Vales de Combustível</h2>
            <p className="text-xs text-slate-400">Registo de consumo por posto (Petromoc, Galp) e média de litros por 100km.</p>
          </div>
        </div>

        {/* Lançamento Form */}
        <form onSubmit={handleAddFuelSubmit} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Plus size={14} className="text-brand-orange" /> Lançar Novo Vale de Abastecimento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Camião / Matrícula</label>
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
              <label className="block text-slate-400 font-semibold mb-1">Motorista</label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 cursor-pointer"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Posto de Combustível</label>
              <select
                value={stationName}
                onChange={(e: any) => setStationName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 cursor-pointer"
              >
                <option value="Petromoc">Petromoc Moçambique</option>
                <option value="Galp">Galp Energia</option>
                <option value="TotalEnergies">TotalEnergies</option>
                <option value="Engen">Engen Petroleum</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Litros Abastecidos (L)</label>
              <input
                type="number"
                value={liters}
                onChange={(e) => setLiters(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono font-bold"
              />
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

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Quilometragem no Viatómetro</label>
              <input
                type="number"
                value={currentKm}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer"
            >
              Registar Abastecimento
            </button>
          </div>
        </form>

        {/* Histórico de Abastecimentos */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Histórico Recente de Abastecimentos de Frota</h3>
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Camião</th>
                  <th className="p-3">Posto</th>
                  <th className="p-3 font-mono">Litros</th>
                  <th className="p-3 font-mono">Custo MZN</th>
                  <th className="p-3 font-mono">Média L/100km</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-navy-900/60">
                {fuelLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 font-mono text-slate-400">{log.date}</td>
                    <td className="p-3 font-bold text-white font-mono flex items-center gap-1.5">
                      <Truck size={14} className="text-brand-orange" /> {log.vehiclePlate}
                    </td>
                    <td className="p-3 font-semibold text-slate-200">{log.stationName}</td>
                    <td className="p-3 font-mono text-white font-bold">{log.liters} L</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{log.totalCostMzn.toLocaleString('pt-MZ')} MT</td>
                    <td className="p-3 font-mono font-semibold text-amber-400 flex items-center gap-1">
                      <Gauge size={13} /> {log.consumptionL100Km} L/100km
                    </td>
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
