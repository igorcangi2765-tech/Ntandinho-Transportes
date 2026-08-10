import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Building2, X, Plus, AlertCircle } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

const customerSchema = z.object({
  name: z.string().min(2, 'Insira o nome da empresa ou cliente.'),
  nuit: z.string().min(9, 'O NUIT deve ter pelo menos 9 dígitos.'),
  email: z.string().email('Insira um e-mail válido.'),
  phone: z.string().min(8, 'Insira um número de telefone válido.'),
  isCorporate: z.boolean().default(true),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface NewCustomerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({ onClose, onSuccess }) => {
  const addCustomer = useErpStore((state) => state.addCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      nuit: '400',
      email: '',
      phone: '+258 84 ',
      isCorporate: true,
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      addCustomer({
        ...data,
        address: 'Matola / Maputo',
        city: 'Maputo',
        creditLimitMzn: data.isCorporate ? 5000000 : 200000,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registar cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Registar Novo Cliente</h2>
            <p className="text-xs text-slate-400">Adicionar empresa ou cliente individual ao CRM.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Empresa / Cliente</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ex: Cervejas de Moçambique, Mozal S.A."
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">NUIT Fiscal</label>
              <input
                type="text"
                {...register('nuit')}
                placeholder="Ex: 400192834"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
              {errors.nuit && <p className="text-[11px] text-rose-400 mt-1">{errors.nuit.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone de Contacto</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+258 84 000 0000"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Comercial</label>
            <input
              type="email"
              {...register('email')}
              placeholder="logistica@empresa.co.mz"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isCorporate"
              {...register('isCorporate')}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-brand-orange focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isCorporate" className="text-xs text-slate-300 cursor-pointer font-medium">
              Cliente Corporativo (Empresa)
            </label>
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
              <span>{submitting ? 'A guardar...' : 'Salvar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
