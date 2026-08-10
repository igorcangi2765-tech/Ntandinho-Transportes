import React, { useState } from 'react';
import { Package, X, Plus, AlertCircle } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface NewLoadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewLoadModal: React.FC<NewLoadModalProps> = ({ onClose, onSuccess }) => {
  const { customers, addTrip } = useErpStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [origin, setOrigin] = useState('Matola, Maputo');
  const [destination, setDestination] = useState('Nampula (Corredor N1)');
  const [cargoDescription, setCargoDescription] = useState('Mercadorias em Contentor');
  const [weightKg, setWeightKg] = useState(18000);
  const [totalPriceMzn, setTotalPriceMzn] = useState(250000);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

      addTrip({
        customerId: customer?.id || 'cust-1',
        customerName: customer ? customer.name : 'Cliente Corporativo',
        origin,
        destination,
        cargoDescription,
        weightKg: Number(weightKg),
        vehiclePlate: 'ABM-849-MC',
        vehicleModel: 'Volvo FH16',
        driverName: 'João Mucavel',
        serviceName: 'Transporte de Mercadorias',
        totalPriceMzn: totalPriceMzn * 1.16,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao criar ordem de transporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Criar Ordem de Carga & Transporte</h2>
            <p className="text-xs text-slate-400">Registo de nova expedição de mercadorias no sistema ERP.</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Solicitante</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nuit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Origem</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Destino</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Peso Estimado (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor do Serviço (MZN)</label>
              <input
                type="number"
                value={totalPriceMzn}
                onChange={(e) => setTotalPriceMzn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
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
              <Plus size={14} />
              <span>{loading ? 'A criar...' : 'Criar Ordem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
