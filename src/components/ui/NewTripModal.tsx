import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { X, Truck } from 'lucide-react';
import { z } from 'zod';

const tripSchema = z.object({
  driverId: z.string().min(1, 'Selecione um motorista'),
  vehicleId: z.string().min(1, 'Selecione um veículo'),
  departure: z.string().min(1, 'Data de saída é obrigatória'),
  distance: z.number().min(0, 'Distância inválida'),
  fuelCost: z.number().min(0, 'Custo de combustível inválido'),
  otherExpenses: z.number().min(0),
  status: z.enum(['Agendada', 'Em Curso', 'Finalizada', 'Cancelada']),
  notes: z.string().optional()
});

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NewTripModal: FC<NewTripModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
    departure: new Date().toISOString().split('T')[0],
    distance: 0,
    fuelCost: 0,
    otherExpenses: 0,
    status: 'Em Curso' as const,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/operations/drivers').then(r => r.json()).catch(() => []),
        fetch('/api/operations/vehicles').then(r => r.json()).catch(() => [])
      ]).then(([d, v]) => {
        if (Array.isArray(d)) setDrivers(d);
        if (Array.isArray(v)) setVehicles(v);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = tripSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/operations/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-white">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white p-1 rounded-lg"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <Truck className="text-[#F5A300]" size={22} />
          <h2 className="text-lg font-bold">Criar Nova Viagem de Transporte</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Selecionar Motorista *</label>
            <select
              value={formData.driverId}
              onChange={e => setFormData({ ...formData, driverId: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            >
              <option value="">Selecione um motorista...</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
              ))}
            </select>
            {errors.driverId && <p className="text-[11px] text-[#EF4444] font-medium">{errors.driverId}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Selecionar Camião / Veículo *</label>
            <select
              value={formData.vehicleId}
              onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            >
              <option value="">Selecione um veículo...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
              ))}
            </select>
            {errors.vehicleId && <p className="text-[11px] text-[#EF4444] font-medium">{errors.vehicleId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#A5B4C7]">Distância (KM)</label>
              <input
                type="number"
                value={formData.distance}
                onChange={e => setFormData({ ...formData, distance: Number(e.target.value) })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#A5B4C7]">Combustível (MZN)</label>
              <input
                type="number"
                value={formData.fuelCost}
                onChange={e => setFormData({ ...formData, fuelCost: Number(e.target.value) })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Notas / Rota de Despacho</label>
            <input
              type="text"
              placeholder="ex: Maputo -> Beira com Carga Pesada"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#13203A] hover:bg-[#13203A]/80 text-[#A5B4C7] rounded-xl text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] hover:opacity-90 text-black font-bold rounded-xl text-xs shadow-lg transition-all"
            >
              {loading ? 'A registar...' : 'Emitir Viagem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
