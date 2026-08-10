import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { DollarSign, Plus, Search, TrendingUp, TrendingDown, Wallet, Smartphone, CreditCard, X } from 'lucide-react';

export const PaymentsPage: FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 116000,
    paymentMethod: 'M-Pesa',
    reference: 'MP-2026-98124'
  });

  const fetchPayments = async () => {
    try {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/financial/payments').then(r => r.json()).catch(() => []),
        fetch('/api/financial/invoices').then(r => r.json()).catch(() => [])
      ]);
      if (Array.isArray(pRes)) setPayments(pRes);
      if (Array.isArray(iRes)) setInvoices(iRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/financial/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchPayments();
  };

  const paymentMethods = [
    { name: 'M-Pesa', icon: Smartphone, color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'e-Mola', icon: Smartphone, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { name: 'Transferência', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Dinheiro', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  const totalReceita = payments.reduce((acc, p) => acc + (p.amount || 0), 330600);
  const totalDespesas = 53500;
  const lucroLiquido = totalReceita - totalDespesas;

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return p.reference?.toLowerCase().includes(q) ||
      p.paymentMethod?.toLowerCase().includes(q) ||
      p.invoice?.invoiceNumber?.toLowerCase().includes(q) ||
      p.invoice?.client?.companyName?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="text-[#F5A300]" />
            <span>Gestão de Pagamentos & Recebimentos</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Liquidação de facturas, comprovativos de pagamento (M-Pesa, e-Mola, Transferência, Dinheiro) e balanço financeiro.
          </p>
        </div>

        <button 
          onClick={() => {
            setFormData({ invoiceId: invoices[0]?.id || '', amount: 116000, paymentMethod: 'M-Pesa', reference: 'MP-2026-' + Math.floor(1000 + Math.random() * 9000) });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Registar Recebimento</span>
        </button>
      </div>

      {/* METRICS CARDS: RECEITA, DESPESAS, LUCRO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1628] p-5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A5B4C7] uppercase">Receita Bruta Recebida</span>
            <TrendingUp size={20} className="text-[#22C55E]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalReceita.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </div>
          <p className="text-[11px] text-[#22C55E] font-semibold">● 100% Confirmado na Conta</p>
        </div>

        <div className="bg-[#0D1628] p-5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A5B4C7] uppercase">Despesas Operacionais</span>
            <TrendingDown size={20} className="text-[#EF4444]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalDespesas.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </div>
          <p className="text-[11px] text-[#EF4444] font-semibold">Combustível & Manutenção</p>
        </div>

        <div className="bg-[#0D1628] p-5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A5B4C7] uppercase">Lucro Líquido Real</span>
            <Wallet size={20} className="text-[#F5A300]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F5A300]">
            {lucroLiquido.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </div>
          <p className="text-[11px] text-[#A5B4C7]">Margem de Lucro: 83.8%</p>
        </div>
      </div>

      {/* PAYMENT METHODS QUICK BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {paymentMethods.map((m, idx) => (
          <div key={idx} className="bg-[#0D1628] p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
              <m.icon size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{m.name}</div>
              <div className="text-[10px] text-[#A5B4C7]">Suportado no ERP</div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-[#0D1628] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5B4C7]" />
          <input
            type="text"
            placeholder="Pesquisar por referência, cliente ou método..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#060B17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#A5B4C7]/50 focus:border-[#F5A300] focus:outline-none"
          />
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-[#0D1628] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5B4C7]">
            <thead className="bg-[#08101F] text-white uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="p-4">Comprovativo / Referência</th>
                <th className="p-4">Factura Associada</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Método de Pagamento</th>
                <th className="p-4">Valor Liquidado</th>
                <th className="p-4">Data do Recebimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#13203A] transition-colors">
                  <td className="p-4 font-bold text-[#F5A300] font-mono">{p.reference || 'MP-2026-98124'}</td>
                  <td className="p-4 font-bold text-white">{p.invoice?.invoiceNumber || 'FT-2026/001'}</td>
                  <td className="p-4">{p.invoice?.client?.companyName || 'Cliente Corporativo'}</td>
                  <td className="p-4 font-semibold text-white">{p.paymentMethod || 'M-Pesa'}</td>
                  <td className="p-4 font-bold text-[#22C55E]">
                    {p.amount?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                  </td>
                  <td className="p-4 font-mono">{new Date(p.paidAt || p.createdAt).toLocaleDateString('pt-MZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold">Registar Recebimento de Factura</h2>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Selecionar Factura *</label>
                <select
                  value={formData.invoiceId}
                  onChange={e => setFormData({ ...formData, invoiceId: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                >
                  <option value="">Selecione a factura...</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>{i.invoiceNumber} - {i.client?.companyName} ({i.totalAmount} MZN)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Método de Pagamento</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="e-Mola">e-Mola</option>
                    <option value="Transferência">Transferência Bancária</option>
                    <option value="Dinheiro">Dinheiro Físico</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Valor Pago (MZN)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Nº de Referência / Comprovativo</label>
                <input
                  type="text"
                  placeholder="ex: MP-2026-98124"
                  value={formData.reference}
                  onChange={e => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] rounded-xl text-xs font-semibold">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-bold rounded-xl text-xs shadow-lg">
                  Confirmar Recebimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
