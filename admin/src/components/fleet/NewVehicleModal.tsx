import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Truck, X, Plus, AlertCircle } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

const vehicleSchema = z.object({
  plateNumber: z.string().min(6, 'Matrícula inválida (ex: ABM-849-MC).'),
  make: z.string().min(2, 'Marca (ex: Volvo, Scania).'),
  model: z.string().min(2, 'Modelo (ex: FH16 750 HP).'),
  year: z.coerce.number().min(2010, 'Ano inválido.'),
  mileageKm: z.coerce.number().min(0, 'Quilometragem.'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface NewVehicleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewVehicleModal: React.FC<NewVehicleModalProps> = ({ onClose, onSuccess }) => {
  const addVehicle = useErpStore((state) => state.addVehicle);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      plateNumber: 'AGG-119-MC',
      make: 'Volvo',
      model: 'FH16 750 HP',
      year: 2025,
      mileageKm: 15000,
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      addVehicle(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao adicionar veículo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Truck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Adicionar Camião à Frota</h2>
            <p className="text-xs text-slate-400">Registo de cavalo mecânico ou viatura pesada.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Matrícula (Moçambique)</label>
            <input
              type="text"
              {...register('plateNumber')}
              placeholder="Ex: ABM-849-MC"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono uppercase focus:border-brand-orange/60"
            />
            {errors.plateNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.plateNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Marca</label>
              <input
                type="text"
                {...register('make')}
                placeholder="Volvo, Scania, DAF"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.make && <p className="text-[11px] text-rose-400 mt-1">{errors.make.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo</label>
              <input
                type="text"
                {...register('model')}
                placeholder="FH16, R500"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.model && <p className="text-[11px] text-rose-400 mt-1">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ano de Fabrico</label>
              <input
                type="number"
                {...register('year')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quilometragem (KM)</label>
              <input
                type="number"
                {...register('mileageKm')}
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
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>{submitting ? 'A guardar...' : 'Registar Camião'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
