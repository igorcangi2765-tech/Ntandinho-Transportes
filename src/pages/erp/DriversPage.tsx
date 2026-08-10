import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Users, Plus, Search, Phone, Mail, Award, CheckCircle, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { Driver } from '../../types/index.js';
import { SkeletonCard } from '../../components/ui/SkeletonLoader.js';
import { useToast } from '../../context/ToastContext.js';
import { z } from 'zod';

const driverSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  phone: z.string().min(8, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  licenseNumber: z.string().min(3, 'Carta de condução é obrigatória'),
  licenseExpiry: z.string().min(1, 'Validade é obrigatória'),
  salary: z.number().min(0, 'Salário deve ser positivo'),
  status: z.enum(['Activo', 'Em Viagem', 'Ferias', 'Inactivo'])
});

export const DriversPage: FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseExpiry: new Date().toISOString().split('T')[0],
    salary: 45000,
    status: 'Activo' as const
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/drivers');
      const data = await res.json();
      if (Array.isArray(data)) setDrivers(data);
    } catch (err) {
      showToast('Erro ao carregar motoristas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (drv?: Driver) => {
    setErrors({});
    if (drv) {
      setEditingDriver(drv);
      setFormData({
        name: drv.name,
        phone: drv.phone,
        email: drv.email || '',
        licenseNumber: drv.licenseNumber,
        licenseExpiry: drv.licenseExpiry ? new Date(drv.licenseExpiry).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        salary: drv.salary,
        status: drv.status as any
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        licenseNumber: '',
        licenseExpiry: new Date().toISOString().split('T')[0],
        salary: 45000,
        status: 'Activo'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = driverSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const method = editingDriver ? 'PUT' : 'POST';
    const url = editingDriver ? `/api/operations/drivers/${editingDriver.id}` : '/api/operations/drivers';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast(editingDriver ? 'Motorista atualizado!' : 'Motorista cadastrado!', 'success');
        setIsModalOpen(false);
        fetchDrivers();
      } else {
        showToast('Erro ao guardar motorista.', 'error');
      }
    } catch (err) {
      showToast('Erro de ligação ao servidor.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingDriverId) return;
    try {
      await fetch(`/api/operations/drivers/${deletingDriverId}`, { method: 'DELETE' });
      showToast('Motorista removido do sistema.', 'info');
      setDeletingDriverId(null);
      fetchDrivers();
    } catch (err) {
      showToast('Erro ao eliminar motorista.', 'error');
    }
  };

  const filtered = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="text-orange-500" />
            <span>Gestão de Motoristas</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Cadastro de condutores, cartas de condução Classe C/E, salários e disponibilidade.
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Cadastrar Motorista</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Pesquisar por nome, carta ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Drivers List & Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(d => (
            <div key={d.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-orange-500/50 transition-all shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center font-bold text-lg text-white shrink-0 overflow-hidden">
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      d.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{d.name}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                      d.status === 'Activo' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleOpenModal(d)}
                    title="Editar Motorista"
                    className="p-1.5 text-slate-400 hover:text-orange-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={() => setDeletingDriverId(d.id)}
                    title="Eliminar Motorista"
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-orange-500 shrink-0" />
                  <span>{d.phone}</span>
                </div>
                {d.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-400 shrink-0" />
                    <span className="truncate">{d.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-orange-500 shrink-0" />
                  <span>Carta: <strong>{d.licenseNumber}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Validade: {new Date(d.licenseExpiry).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Salário Base</span>
                <span className="font-extrabold text-white">
                  {d.salary.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
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
              {editingDriver ? `Editar Motorista (${editingDriver.name})` : 'Cadastrar Novo Motorista'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Nome do motorista..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                {errors.name && <p className="text-[11px] text-red-400 font-medium">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Telefone *</label>
                  <input
                    type="text"
                    placeholder="+258 84..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 font-medium">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Carta de Condução *</label>
                  <input
                    type="text"
                    placeholder="C-8849102-MZ"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                  {errors.licenseNumber && <p className="text-[11px] text-red-400 font-medium">{errors.licenseNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Validade da Carta *</label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={e => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Salário Base (MZN)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Estado</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="Activo">Activo</option>
                  <option value="Em Viagem">Em Viagem</option>
                  <option value="Ferias">De Férias</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
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
                  {editingDriver ? 'Atualizar Motorista' : 'Guardar Motorista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingDriverId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <AlertTriangle size={36} className="text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Eliminar Registo de Motorista?</h3>
            <p className="text-xs text-slate-400">Esta ação não pode ser desfeita e removerá o perfil do condutor.</p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingDriverId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/30"
              >
                Sim, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
