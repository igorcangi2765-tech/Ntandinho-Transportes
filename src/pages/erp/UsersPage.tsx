import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Shield, ShieldCheck, Plus, Key, X } from 'lucide-react';
import { User } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+258 84 000 0000',
    password: '',
    roleId: '',
    status: 'Active'
  });

  const fetchUsers = () => {
    fetch('/api/system/users')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); });

    fetch('/api/system/roles')
      .then(r => r.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setRoles(data);
          if (data.length > 0) setFormData(f => ({ ...f, roleId: data[0].id }));
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/system/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      showToast('Utilizador cadastrado com sucesso!', 'success');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast('Erro ao cadastrar utilizador', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-[#F5A300]" />
              <span>Utilizadores & Controlo de Acessos RBAC</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Key size={14} />
              <span>JWT & Permissões Granulares</span>
            </span>
          </div>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Gestão de utilizadores com funções: Administrador, Gestor e Operador.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Novo Utilizador</span>
        </button>
      </div>

      {/* ROLES MATRIX CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D1628] p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5A300]">Administrador</span>
            <Shield size={16} className="text-[#F5A300]" />
          </div>
          <p className="text-[11px] text-[#A5B4C7]">Acesso total a todos os módulos, utilizadores, financeiro e CMS.</p>
        </div>
        <div className="bg-[#0D1628] p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400">Gestor</span>
            <Shield size={16} className="text-blue-400" />
          </div>
          <p className="text-[11px] text-[#A5B4C7]">Gestão de operações, frota, clientes e emissão de facturas.</p>
        </div>
        <div className="bg-[#0D1628] p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400">Operador</span>
            <Shield size={16} className="text-purple-400" />
          </div>
          <p className="text-[11px] text-[#A5B4C7]">Acompanhamento de viagens, despacho e registo de manutenções.</p>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-[#0D1628] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5B4C7]">
            <thead className="bg-[#08101F] text-white uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="p-4">Nome do Utilizador</th>
                <th className="p-4">E-mail Corporativo</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Função (Role)</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Último Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#13203A] transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#13203A] flex items-center justify-center text-[#F5A300] font-bold border border-[#F5A300]/30">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-white">{u.email}</td>
                  <td className="p-4 text-[#A5B4C7]">{u.phone || '+258 84 000 0000'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-[#F5A300]/20 text-[#F5A300] font-bold text-[10px]">
                      {u.role?.name || 'Administrador'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px]">
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-[#A5B4C7] font-mono">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString('pt-MZ') : 'Recente (Hoje)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold">Cadastrar Novo Utilizador ERP</h2>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do colaborador..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@ntandinho.co.mz"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Palavra-passe *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Função (Role)</label>
                  <select
                    value={formData.roleId}
                    onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] rounded-xl text-xs font-semibold">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-bold rounded-xl text-xs shadow-lg">
                  Guardar Utilizador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
