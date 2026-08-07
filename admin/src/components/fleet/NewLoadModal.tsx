import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Package, X, Plus } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

const loadSchema = z.object({
  client: z.string().min(2, 'Selecione ou introduza o cliente.'),
  origin: z.string().min(2, 'Informe o ponto de origem.'),
  destination: z.string().min(2, 'Informe o destino.'),
  cargo: z.string().min(3, 'Descrição da mercadoria.'),
  truck: z.string().min(2, 'Selecione o camião.'),
  driver: z.string().min(2, 'Selecione o motorista.'),
});

type LoadFormData = z.infer<typeof loadSchema>;

interface NewLoadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewLoadModal: React.FC<NewLoadModalProps> = ({ onClose, onSuccess }) => {
  const { addLoad, customers, vehicles, drivers } = useErpStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<LoadFormData>({
    defaultValues: {
      client: customers[0]?.name || 'Cervejas de Moçambique (CDM)',
      origin: 'Maputo (Terminal)',
      destination: 'Nampula',
      cargo: 'Paletes de Bebidas 2M (30 Toneladas)',
      truck: vehicles[0]?.plateNumber ? `${vehicles[0].make} (${vehicles[0].plateNumber})` : 'Volvo FH16 (ABM-849-MC)',
      driver: drivers[0]?.name || 'João Mucavel',
    },
  });

  const onSubmit = async (data: LoadFormData) => {
    setSubmitting(true);
    addLoad(data);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
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
            <h2 className="text-xl font-bold text-white tracking-tight">Criar Nova Ordem de Carga</h2>
            <p className="text-xs text-slate-400">Emissão de Guia de Transporte de Mercadorias.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Solicitante</label>
            <select
              {...register('client')}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Origem do Carregamento</label>
              <input
                type="text"
                {...register('origin')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Destino Final</label>
              <input
                type="text"
                {...register('destination')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Detalhada da Carga</label>
            <input
              type="text"
              {...register('cargo')}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Camião Alocado</label>
              <select
                {...register('truck')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 cursor-pointer font-mono"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={`${v.make} (${v.plateNumber})`}>
                    {v.plateNumber} • {v.make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Motorista</label>
              <select
                {...register('driver')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 cursor-pointer"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
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
              <span>Emitir Guia de Carga</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
