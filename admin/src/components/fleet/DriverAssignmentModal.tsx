import React, { useState } from 'react';
import { Truck, X, Check, AlertCircle } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface DriverAssignmentModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DriverAssignmentModal: React.FC<DriverAssignmentModalProps> = ({ onClose, onSuccess }) => {
  const { vehicles, drivers, addTrip } = useErpStore();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || '');
  const [origin, setOrigin] = useState('Matola, Maputo');
  const [destination, setDestination] = useState('Nampula (Corredor N1)');
  const [cargoDescription, setCargoDescription] = useState('Container 40ft (Carga Comercial)');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
      const driver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

      addTrip({
        origin,
        destination,
        vehicleId: vehicle?.id,
        vehiclePlate: vehicle ? vehicle.plateNumber : 'ABM-849-MC',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Volvo FH16',
        driverId: driver?.id,
        driverName: driver ? driver.name : 'João Mucavel',
        cargoDescription,
        customerId: 'cust-1',
        customerName: 'Mozal S.A.',
        weightKg: 28000,
        serviceName: 'Transporte de Mercadorias',
        totalPriceMzn: 406000,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao alocar recursos para a viagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Truck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Alocar Camião & Motorista</h2>
            <p className="text-xs text-slate-400">Atribuir recursos operacionais para nova viagem de transporte.</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selecionar Camião Pesado</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} — {v.make} {v.model} ({v.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selecionar Motorista Credenciado</label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ponto de Origem</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ponto de Destino</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição da Carga</label>
            <input
              type="text"
              value={cargoDescription}
              onChange={(e) => setCargoDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
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
              <span>{loading ? 'A alocar...' : 'Confirmar Alocação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
