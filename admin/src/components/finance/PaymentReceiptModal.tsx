import React, { useState } from 'react';
import { CreditCard, DollarSign, X, AlertCircle, Send, FileText } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface PaymentReceiptModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { invoices, payInvoice } = useErpStore();
  const pendingInvoices = invoices.filter((i) => i.status !== 'PAGO');

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(pendingInvoices[0]?.id || invoices[0]?.id || '');
  const selectedInv = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];
  const defaultAmount = selectedInv ? selectedInv.totalAmount - selectedInv.paidAmount : 406000;

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [paymentMethod, setPaymentMethod] = useState<
    'TRANSFERENCIA_BANCARIA' | 'CHEQUE' | 'MPESA' | 'EMOLA' | 'DINHEIRO'
  >('TRANSFERENCIA_BANCARIA');
  const [referenceNo, setReferenceNo] = useState('BVM-901823');
  const [notes, setNotes] = useState('Pagamento efetuado via Millennium bim');

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
      payInvoice(selectedInvoiceId, Number(amount));
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
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CreditCard size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Registo de Recibo de Pagamento</h2>
            <p className="text-xs text-slate-400">Liquidação total ou parcial de faturas de frete.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fatura Pendente */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText size={14} className="text-brand-orange" /> Fatura Pendente
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleSelectInvoice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono cursor-pointer"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} • {inv.customerName} (Falta:{' '}
                  {(inv.totalAmount - inv.paidAmount).toLocaleString('pt-MZ')} {inv.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Valor a Pagar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <DollarSign size={12} className="text-slate-500" /> Valor Recebido (MZN)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono font-bold"
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Forma de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 cursor-pointer"
            >
              <option value="TRANSFERENCIA_BANCARIA">Transferência Bancária (Millennium bim / BCI / Standard Bank)</option>
              <option value="CHEQUE">Cheque Bancário Visado</option>
              <option value="MPESA">M-Pesa Business / POS</option>
              <option value="EMOLA">e-Mola</option>
              <option value="DINHEIRO">Depósito em Dinheiro / Caixa</option>
            </select>
          </div>

          {/* Nº de Comprovativo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nº do Comprovativo / Referência Bancária
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60 font-mono"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notas / Observações</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs focus:border-brand-orange/60"
            />
          </div>

          {/* Action buttons */}
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
              className="flex items-center space-x-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>{loading ? 'A Emitir Recibo...' : 'Emitir Recibo de Pagamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
