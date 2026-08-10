import { useState, useEffect, useMemo } from 'react';
import type { FC, FormEvent } from 'react';
import { FileText, Plus, Search, Download, CheckCircle, Clock, X } from 'lucide-react';
import { Invoice, Client } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const InvoicesPage: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('100000');
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  
  const { showToast } = useToast();

  const fetchInvoices = () => {
    fetch('/api/financial/invoices')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setInvoices(data); });
  };

  useEffect(() => {
    fetchInvoices();
    fetch('/api/operations/clients')
      .then(r => r.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setClients(data);
          if (data.length > 0) setClientId(data[0].id);
        }
      });
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const q = search.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        (inv.client?.companyName || '').toLowerCase().includes(q)
      );
    });
  }, [invoices, search]);

  const handleCreateInvoice = async (e: FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    const vat = 0.16;
    const totalAmount = numAmount + (numAmount * vat);

    try {
      const res = await fetch('/api/financial/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId || undefined,
          amount: numAmount,
          vat,
          totalAmount,
          dueDate: new Date(dueDate),
          status: 'Pendente'
        })
      });
      if (res.ok) {
        showToast('Factura emitida com sucesso!', 'success');
        setModalOpen(false);
        fetchInvoices();
      } else {
        showToast('Erro ao emitir factura.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao servidor.', 'error');
    }
  };

  const downloadInvoicePDF = (inv: Invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // Dark Navy
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("TRANSPORTES N' TANDINHO", 14, 25);
    doc.setFontSize(10);
    doc.text("FACTURA DE SERVIÇOS LOGÍSTICOS", 14, 33);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`Factura Nº: ${inv.invoiceNumber}`, 14, 55);
    doc.text(`Data de Emissão: ${new Date(inv.createdAt || Date.now()).toLocaleDateString()}`, 14, 62);
    doc.text(`Cliente: ${inv.client?.companyName || 'Cliente Corporativo'}`, 14, 69);
    doc.text(`NUIT: ${inv.client?.nuit || '400012991'}`, 14, 76);

    autoTable(doc, {
      startY: 85,
      head: [['Descrição do Serviço', 'Valor Base (MZN)', 'IVA (16%)', 'Total (MZN)']],
      body: [
        [
          'Serviço de Transporte de Carga / Logística SADC',
          inv.amount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }),
          (inv.amount * inv.vat).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }),
          inv.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })
        ]
      ]
    });

    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="text-orange-500" />
            <span>Facturação & Faturas Comerciais</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Emissão de faturas em Meticais (MZN) com cálculo de IVA 16% e download em PDF formatado.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por factura ou cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <button 
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/30 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Emitir Factura</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Nº Factura</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Valor Base</th>
              <th className="p-4">IVA (16%)</th>
              <th className="p-4">Total com IVA</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-orange-400">{inv.invoiceNumber}</td>
                <td className="p-4 font-medium text-white">{inv.client?.companyName}</td>
                <td className="p-4 font-semibold text-slate-200">
                  {inv.amount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </td>
                <td className="p-4 text-slate-400">
                  {(inv.amount * inv.vat).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </td>
                <td className="p-4 font-bold text-emerald-400">
                  {inv.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    inv.status === 'Paga' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {inv.status === 'Paga' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    <span>{inv.status}</span>
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => downloadInvoicePDF(inv)}
                    className="flex items-center gap-1 ml-auto text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Baixar PDF</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                  Nenhuma factura encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Emitir Factura */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emitir Nova Factura</h3>
                <p className="text-xs text-slate-400">Cálculo automático de IVA (16%) no sistema</p>
              </div>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Cliente Corporativo</label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Selecione ou deixe geral</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Valor Base (MZN) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Data de Vencimento *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono">{(parseFloat(amount) || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IVA (16%):</span>
                  <span className="font-mono">{((parseFloat(amount) || 0) * 0.16).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1 mt-1 text-sm">
                  <span>Total a Facturar:</span>
                  <span className="font-mono">{((parseFloat(amount) || 0) * 1.16).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  Confirmar Emissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
