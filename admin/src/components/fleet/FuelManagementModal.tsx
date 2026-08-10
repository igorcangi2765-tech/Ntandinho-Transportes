import React, { useState } from 'react';
import { Fuel, X, Check, AlertCircle } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface FuelManagementModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const FuelManagementModal: React.FC<FuelManagementModalProps> = ({ onClose, onSuccess }) => {
  const { vehicles, drivers, addFuelLog } = useErpStore();

  const [vehiclePlate, setVehiclePlate] = useState(vehicles[0]?.plateNumber || 'ABM-849-MC');
  const [driverName, setDriverName] = useState(drivers[0]?.name || 'João Mucavel');
  const [stationName, setStationName] = useState<'Petromoc' | 'Galp' | 'TotalEnergies' | 'Engen'>('Petromoc');
  const [liters, setLiters] = useState(400);
  const [pricePerLiterMzn, setPricePerLiterMzn] = useState(94.0);
  const [currentKm] = useState(125000);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalCostMzn = liters * pricePerLiterMzn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      addFuelLog({
        vehiclePlate,
        driverName,
        stationName,
        liters: Number(liters),
        pricePerLiterMzn: Number(pricePerLiterMzn),
        totalCostMzn,
        currentKm: Number(currentKm),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registar abastecimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Fuel size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Vale de Abastecimento</h2>
            <p className="text-xs text-slate-400">Registo de abastecimento Petromoc, Galp, TotalEnergies ou Engen.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Camião Pesado</label>
            <select
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Motorista</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Posto de Abastecimento</label>
            <select
              value={stationName}
              onChange={(e) => setStationName(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            >
              <option value="Petromoc">Petromoc</option>
              <option value="Galp">Galp Moçambique</option>
              <option value="TotalEnergies">TotalEnergies</option>
              <option value="Engen">Engen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Litros (Gasóleo)</label>
              <input
                type="number"
                value={liters}
                onChange={(e) => setLiters(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preço / Litro (MZN)</label>
              <input
                type="number"
                value={pricePerLiterMzn}
                onChange={(e) => setPricePerLiterMzn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-bold">
            <span className="text-slate-400">Custo Total de Abastecimento:</span>
            <span className="text-brand-orange text-sm font-mono">{totalCostMzn.toLocaleString('pt-MZ')} MZN</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{loading ? 'A registar...' : 'Emitir Vale'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
