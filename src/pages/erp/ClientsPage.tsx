import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Building2, Plus, Search, Phone, Mail, MapPin, FileText, Download, FileSpreadsheet, Edit2, Trash2, X } from 'lucide-react';
import { Client } from '../../types/index.js';
import { SkeletonCard } from '../../components/ui/SkeletonLoader.js';
import { useToast } from '../../context/ToastContext.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ClientsPage: FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    companyName: '',
    nuit: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: 'Nampula',
    address: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/clients');
      const data = await res.json();
      if (Array.isArray(data)) setClients(data);
    } catch (err) {
      showToast('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cl?: Client) => {
    setErrors({});
    if (cl) {
      setEditingClient(cl);
      setFormData({
        companyName: cl.companyName,
        nuit: cl.nuit || '',
        contactPerson: cl.contactPerson || '',
        phone: cl.phone,
        email: cl.email,
        city: cl.city || 'Nampula',
        address: cl.address || ''
      });
    } else {
      setEditingClient(null);
      setFormData({
        companyName: '',
        nuit: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: 'Nampula',
        address: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.companyName) {
      showToast('Nome da empresa é obrigatório', 'error');
      return;
    }

    const method = editingClient ? 'PUT' : 'POST';
    const url = editingClient ? `/api/operations/clients/${editingClient.id}` : '/api/operations/clients';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast(editingClient ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!', 'success');
        setIsModalOpen(false);
        fetchClients();
      } else {
        showToast('Erro ao guardar cliente.', 'error');
      }
    } catch (err) {
      showToast('Erro de ligação ao servidor.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/operations/clients/${id}`, { method: 'DELETE' });
      showToast('Cliente removido com sucesso.', 'info');
      fetchClients();
    } catch (err) {
      showToast('Erro ao eliminar cliente.', 'error');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("TRANSPORTES N' TANDINHO - RELATÓRIO DE CLIENTES", 14, 20);

    autoTable(doc, {
      startY: 35,
      head: [['Empresa', 'NUIT', 'Contacto', 'Telefone', 'E-mail', 'Cidade']],
      body: clients.map(c => [
        c.companyName,
        c.nuit || 'N/A',
        c.contactPerson || 'N/A',
        c.phone,
        c.email,
        c.city || 'Nampula'
      ])
    });

    doc.save(`Clientes-Ntandinho-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    const data = clients.map(c => ({
      Empresa: c.companyName,
      NUIT: c.nuit || 'N/A',
      Contacto: c.contactPerson || 'N/A',
      Telefone: c.phone,
      Email: c.email,
      Cidade: c.city || 'Nampula',
      Endereco: c.address || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, `Clientes-Ntandinho-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filtered = clients.filter(c =>
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="text-orange-500" />
            <span>Gestão de Clientes Corporativos</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Diretório de empresas clientes, dados fiscais (NUIT), contactos e exportação em PDF/Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar PDF</span>
          </button>
          <button 
            onClick={exportExcel}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-800/60 transition-all cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Exportar Excel</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Pesquisar por empresa, contacto ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-orange-500/50 transition-all shadow-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Empresa Cliente</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{c.companyName}</h3>
                  <p className="text-xs text-slate-400 font-mono">NUIT: {c.nuit || 'N/A'}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleOpenModal(c)}
                    title="Editar Cliente"
                    className="p-1.5 text-slate-400 hover:text-orange-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    title="Eliminar Cliente"
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-orange-500 shrink-0" />
                  <span>Contacto: <strong>{c.contactPerson || 'Geral'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400 shrink-0" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-blue-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-rose-400 shrink-0" />
                  <span>{c.city || 'Nampula'} {c.address ? `• ${c.address}` : ''}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Histórico:</span>
                <span className="font-semibold text-orange-400">{(c as any)._count?.invoices || 0} Facturas</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-white">
              {editingClient ? `Editar Cliente (${editingClient.companyName})` : 'Cadastrar Novo Cliente Corporativo'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Razão Social / Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cervejas de Moçambique..."
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">NUIT Fiscal</label>
                  <input
                    type="text"
                    placeholder="400012991"
                    value={formData.nuit}
                    onChange={e => setFormData({ ...formData, nuit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Pessoa de Contacto</label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Telefone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+258 84..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">E-mail *</label>
                  <input
                    type="email"
                    required
                    placeholder="empresa@email.co.mz"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/30"
                >
                  {editingClient ? 'Atualizar Cliente' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
