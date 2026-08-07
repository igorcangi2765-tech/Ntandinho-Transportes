import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calculator, Send, X, AlertCircle, DollarSign, Package } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';
import { CompanyDocumentHeader } from '../shared/CompanyDocumentHeader';

const quotationSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente.'),
  origin: z.string().min(2, 'Especifique a origem da carga.'),
  destination: z.string().min(2, 'Especifique o destino da carga.'),
  cargoDescription: z.string().min(3, 'Descreva a carga a ser transportada.'),
  weightKg: z.coerce.number().min(100, 'O peso mínimo é 100 Kg.'),
  priceSubtotal: z.coerce.number().min(1000, 'O valor base mínimo é 1.000 MT.'),
  currency: z.enum(['MZN', 'USD']),
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
    formState: { errors },
  } = useForm<QuotationFormData>({
    defaultValues: {
      customerId: customers[0]?.id || 'CLI-001',
      origin: 'Maputo',
      destination: 'Nampula',
      cargoDescription: 'Carga de Mercadoria Geral em Paletes',
      weightKg: 24000,
      priceSubtotal: 320000,
      currency: 'MZN',
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
        status: 'RASCUNHO',
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
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X size={20} />
        </button>

        {/* Top Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
            <Calculator size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Nova Cotação de Transporte</h2>
            <p className="text-xs text-slate-400">Geração de proposta comercial oficial com cálculo de IVA (16%).</p>
          </div>
        </div>

        {/* Company Header Preview */}
        <CompanyDocumentHeader
          documentType="PROPOSTA COMERCIAL"
          documentNumber="COT-2026-DRAFT"
          isPrintSheet={false}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6"
        />

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Corporativo</label>
              <select
                {...register('customerId')}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} • NUIT: {c.nuit}
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="text-[11px] text-rose-400 mt-1">{errors.customerId.message}</p>}
            </div>

            {/* Origem */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Origem do Carregamento</label>
              <input
                type="text"
                {...register('origin')}
                placeholder="Ex: Maputo, Nampula, Beira"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.origin && <p className="text-[11px] text-rose-400 mt-1">{errors.origin.message}</p>}
            </div>

            {/* Destino */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Destino Final</label>
              <input
                type="text"
                {...register('destination')}
                placeholder="Ex: Pemba, Nacala, Lilongwe"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.destination && <p className="text-[11px] text-rose-400 mt-1">{errors.destination.message}</p>}
            </div>

            {/* Descrição da Carga */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição da Mercadoria</label>
              <input
                type="text"
                {...register('cargoDescription')}
                placeholder="Ex: Paletes de Bebidas em Container 40ft"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              />
              {errors.cargoDescription && <p className="text-[11px] text-rose-400 mt-1">{errors.cargoDescription.message}</p>}
            </div>

            {/* Peso (Kg) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Peso Estimado (Kg)</label>
              <div className="relative">
                <Package size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  {...register('weightKg')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono"
                />
              </div>
              {errors.weightKg && <p className="text-[11px] text-rose-400 mt-1">{errors.weightKg.message}</p>}
            </div>

            {/* Valor Base (Subtotal) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Base da Viagem ({currency})</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  {...register('priceSubtotal')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono"
                />
              </div>
              {errors.priceSubtotal && <p className="text-[11px] text-rose-400 mt-1">{errors.priceSubtotal.message}</p>}
            </div>
          </div>

          {/* Recalculo ao vivo de Valores */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Frete:</span>
              <span className="font-mono text-slate-200">{Number(subtotal).toLocaleString('pt-MZ')} {currency}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>IVA Aplicável (16% Moçambique):</span>
              <span className="font-mono text-brand-orange">{taxAmount.toLocaleString('pt-MZ')} {currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Valor Total da Proposta:</span>
              <span className="font-mono text-emerald-400">{totalPrice.toLocaleString('pt-MZ')} {currency}</span>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
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
              <Send size={14} />
              <span>{submitting ? 'A Gerar Cotação...' : 'Emitir Cotação Formal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
