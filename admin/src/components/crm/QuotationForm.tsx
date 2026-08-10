import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileText, X, Plus, AlertCircle, Calculator } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

const quotationSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente.'),
  origin: z.string().min(2, 'Informe a origem da carga.'),
  destination: z.string().min(2, 'Informe o destino da carga.'),
  cargoDescription: z.string().min(3, 'Descreva a mercadoria a transportar.'),
  weightKg: z.coerce.number().min(1, 'Informe o peso estimado em quilogramas.'),
  priceSubtotal: z.coerce.number().min(100, 'Informe o valor subtotal em MZN.'),
  currency: z.string().default('MZN'),
  validityDays: z.coerce.number().default(15),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({ onClose, onSuccess }) => {
  const { customers, addQuotation } = useErpStore();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<QuotationFormData>({
    defaultValues: {
      customerId: customers[0]?.id || '',
      origin: 'Matola, Maputo',
      destination: 'Nampula (Corredor N1)',
      cargoDescription: 'Carga industrial em paletes',
      weightKg: 15000,
      priceSubtotal: 250000,
      currency: 'MZN',
      validityDays: 15,
    },
  });

  const subtotal = watch('priceSubtotal') || 0;
  const currency = watch('currency') || 'MZN';
  const taxAmount = Math.round(subtotal * 0.16 * 100) / 100;
  const totalPrice = Number(subtotal) + taxAmount;

  const onSubmit = async (data: QuotationFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const customer = customers.find((c) => c.id === data.customerId);
      addQuotation({
        ...data,
        customerName: customer ? customer.name : 'Cliente Corporativo',
        currency,
        validUntil: '2026-08-30',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao submeter cotação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Emitir Nova Cotação Formal</h2>
            <p className="text-xs text-slate-400">Gerar orçamento detalhado de transporte com cálculo automático de IVA (16%).</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selecionar Cliente</label>
            <select
              {...register('customerId')}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ponto de Origem</label>
              <input
                type="text"
                {...register('origin')}
                placeholder="Ex: Matola, Maputo"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ponto de Destino</label>
              <input
                type="text"
                {...register('destination')}
                placeholder="Ex: Nampula, Beira"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Detalhada da Carga</label>
            <input
              type="text"
              {...register('cargoDescription')}
              placeholder="Ex: 24 paletes de cerveja encatada (Cervejas de Moçambique)"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Peso Estimado (kg)</label>
              <input
                type="number"
                {...register('weightKg')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Subtotal (MZN)</label>
              <input
                type="number"
                {...register('priceSubtotal')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Validade (Dias)</label>
              <input
                type="number"
                {...register('validityDays')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>
          </div>

          {/* Tax Breakdown Preview */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Subtotal sem Imposto:</span>
              <span className="font-mono font-semibold text-slate-200">{Number(subtotal).toLocaleString('pt-MZ')} {currency}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">IVA Aplicável (16% Moçambique):</span>
              <span className="font-mono font-semibold text-slate-300">{taxAmount.toLocaleString('pt-MZ')} {currency}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Calculator size={16} className="text-brand-orange" />
                Valor Total da Cotação:
              </span>
              <span className="font-mono text-brand-orange text-base">{totalPrice.toLocaleString('pt-MZ')} {currency}</span>
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
              <span>{submitting ? 'A emitir...' : 'Emitir Cotação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
