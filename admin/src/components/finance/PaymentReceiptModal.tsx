import React, { useState } from 'react';
import { Receipt, X, Check, AlertCircle } from 'lucide-react';
import { useErpStore, PaymentItem } from '../../shared/stores/useErpStore';

interface PaymentReceiptModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({ onClose, onSuccess }) => {
  const { invoices, payInvoice } = useErpStore();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[0]?.id || '');
  const [amount, setAmount] = useState<number>(invoices[0]?.totalAmount || 100000);
  const [method, setMethod] = useState<PaymentItem['method']>('TRANSFERENCIA_BANCARIA');
  const [refNumber, setRefNumber] = useState<string>('BCI-TRF-908123');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    const inv = invoices.find((i) => i.id === id);
    if (inv) {
      setAmount(inv.totalAmount - inv.paidAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!selectedInvoiceId) {
        throw new Error('Selecione uma fatura pendente.');
      }
      payInvoice(selectedInvoiceId, Number(amount), method, refNumber);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao submeter recibo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Receipt size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Emitir Recibo & Dar Baixa de Pagamento</h2>
            <p className="text-xs text-slate-400">Liquidação de faturas emitidas aos clientes N' Tandinho.</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selecionar Fatura a Liquidar</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleSelectInvoice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customerName} (Pendente: {(inv.totalAmount - inv.paidAmount).toLocaleString('pt-MZ')} MZN)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor a Liquidar (MZN)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Método de Pagamento</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
              >
                <option value="TRANSFERENCIA_BANCARIA">Transferência Bancária (BCI / BIM / Standard)</option>
                <option value="MPESA">M-Pesa Vodacom</option>
                <option value="EMOLA">e-Mola Movitel</option>
                <option value="NUMERARIO">Numerário / Caixa</option>
                <option value="CHEQUE">Cheque Visado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Número do Comprovativo / Referência</label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="Ex: BCI-TRF-908123"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono focus:border-brand-orange/60"
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
              <span>{loading ? 'A processar...' : 'Confirmar Recibo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
