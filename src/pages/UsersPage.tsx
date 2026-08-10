import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { User, AuditLog } from '../types';
import { Role } from '../permissions/rbacConfig';
import { UserCog, Plus, Trash2, ShieldCheck, Lock, UserCheck, Mail, Phone, Building } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { auditLogs } = useData();
  const { usersList, currentUser, switchRole, addUser, deleteUser, updateUserRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'UTILIZADORES' | 'AUDIT_LOG' | 'PERMISSOES'>('UTILIZADORES');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Operações',
    role: 'OPERADOR' as Role
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(userForm);
    setIsCreateModalOpen(false);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      department: 'Operações',
      role: 'OPERADOR'
    });
  };

  const userColumns: Column<User>[] = [
    {
      header: 'Utilizador',
      accessorKey: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
          <div>
            <div className="font-bold text-slate-100">{r.name}</div>
            <div className="text-[11px] text-slate-400">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Departamento',
      accessorKey: 'department',
      sortable: true,
      cell: (r) => <span className="text-slate-300 font-medium">{r.department}</span>
    },
    {
      header: 'Cargo / Perfil (RBAC)',
      accessorKey: 'role',
      sortable: true,
      cell: (r) => (
        <select
          value={r.role}
          onChange={(e) => updateUserRole(r.id, e.target.value as Role)}
          className="bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-[#F5A300]"
        >
          <option value="ADMIN">ADMINISTRADOR</option>
          <option value="GESTOR">GESTOR OPERACIONAL</option>
          <option value="FINANCEIRO">FINANCEIRO</option>
          <option value="OPERADOR">OPERADOR</option>
        </select>
      )
    },
    {
      header: 'Último Acesso',
      accessorKey: 'lastLogin',
      cell: (r) => <span className="text-slate-400 text-[11px]">{r.lastLogin}</span>
    },
    {
      header: 'Ações de Conta',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole(r.role)}
            disabled={currentUser.role === r.role}
            className={`px-2 py-1 rounded font-bold text-[11px] ${
              currentUser.role === r.role
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-[#F5A300] text-slate-950 hover:bg-[#E59200]'
            }`}
          >
            {currentUser.role === r.role ? 'Perfil Ativo' : 'Assumir Perfil'}
          </button>

          {r.id !== currentUser.id && (
            <button
              onClick={() => setDeletingUser(r)}
              className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Eliminar Conta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const auditColumns: Column<AuditLog>[] = [
    {
      header: 'Data / Hora',
      accessorKey: 'timestamp',
      sortable: true,
      cell: (r) => <span className="text-slate-400 font-mono text-[11px]">{r.timestamp}</span>
    },
    {
      header: 'Utilizador',
      accessorKey: 'userName',
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-bold text-slate-200">{r.userName}</span>
          <span className="text-[10px] text-amber-400 font-semibold block uppercase">{r.userRole}</span>
        </div>
      )
    },
    {
      header: 'Ação Realizada',
      accessorKey: 'action',
      sortable: true,
      cell: (r) => <span className="font-bold text-slate-100">{r.action}</span>
    },
    {
      header: 'Módulo',
      accessorKey: 'module',
      sortable: true,
      cell: (r) => <span className="text-slate-300 font-medium">{r.module}</span>
    },
    {
      header: 'Detalhes da Operação',
      accessorKey: 'details',
      cell: (r) => <span className="text-slate-300 text-[11px]">{r.details}</span>
    },
    {
      header: 'IP / Dispositivo',
      accessorKey: 'ipAddress',
      cell: (r) => <span className="text-slate-500 font-mono text-[11px]">{r.ipAddress}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-[#F5A300]" />
            Gestão de Utilizadores & Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Controlo de contas empresariais, atribuição de privilégios RBAC e registo de auditoria.
          </p>
        </div>

        {activeTab === 'UTILIZADORES' && (
          <button onClick={() => setIsCreateModalOpen(true)} className="stripe-button-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Criar Novo Utilizador</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('UTILIZADORES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'UTILIZADORES'
              ? 'bg-[#F5A300] text-slate-950 border-[#F5A300] shadow'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          Contas de Utilizador ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'AUDIT_LOG'
              ? 'bg-[#F5A300] text-slate-950 border-[#F5A300] shadow'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          Registo de Auditoria (Audit Log)
        </button>
        <button
          onClick={() => setActiveTab('PERMISSOES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'PERMISSOES'
              ? 'bg-[#F5A300] text-slate-950 border-[#F5A300] shadow'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          Matriz de Permissões RBAC
        </button>
      </div>

      {/* Content */}
      {activeTab === 'UTILIZADORES' && (
        <DataTable
          data={usersList}
          columns={userColumns}
          searchPlaceholder="Pesquisar utilizador por nome, email ou cargo..."
        />
      )}

      {activeTab === 'AUDIT_LOG' && (
        <DataTable
          data={auditLogs}
          columns={auditColumns}
          searchPlaceholder="Pesquisar no histórico de auditoria por ação, utilizador ou módulo..."
        />
      )}

      {activeTab === 'PERMISSOES' && (
        <div className="stripe-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F5A300]" />
            Matriz Oficial de Acesso ao Sistema (RBAC)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020817] text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3">Módulo / Funcionalidade</th>
                  <th className="p-3 text-center text-amber-400">ADMINISTRADOR</th>
                  <th className="p-3 text-center text-blue-400">GESTOR OPERACIONAL</th>
                  <th className="p-3 text-center text-emerald-400">FINANCEIRO</th>
                  <th className="p-3 text-center text-purple-400">OPERADOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { module: 'Dashboard Geral', admin: true, gestor: true, financeiro: true, operador: true },
                  { module: 'Pedidos de Transporte', admin: true, gestor: true, financeiro: false, operador: true },
                  { module: 'Viagens & Expedição', admin: true, gestor: true, financeiro: false, operador: true },
                  { module: 'Clientes & CRM', admin: true, gestor: true, financeiro: false, operador: true },
                  { module: 'Frota de Caminhões', admin: true, gestor: true, financeiro: false, operador: false },
                  { module: 'Quadro de Motoristas', admin: true, gestor: true, financeiro: false, operador: false },
                  { module: 'Catálogo de Serviços', admin: true, gestor: true, financeiro: false, operador: false },
                  { module: 'Faturação & Finanças', admin: true, gestor: false, financeiro: true, operador: false },
                  { module: 'Relatórios Executivos', admin: true, gestor: true, financeiro: true, operador: false },
                  { module: 'Gestão de Utilizadores', admin: true, gestor: false, financeiro: false, operador: false },
                  { module: 'Configurações da Empresa', admin: true, gestor: false, financeiro: false, operador: false },
                  { module: 'Audit Log de Auditoria', admin: true, gestor: false, financeiro: false, operador: false }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-200">{row.module}</td>
                    <td className="p-3 text-center font-bold text-emerald-400">✓ Acesso Total</td>
                    <td className="p-3 text-center">{row.gestor ? <span className="text-emerald-400 font-bold">✓ Permitido</span> : <span className="text-slate-600">✕ Bloqueado</span>}</td>
                    <td className="p-3 text-center">{row.financeiro ? <span className="text-emerald-400 font-bold">✓ Permitido</span> : <span className="text-slate-600">✕ Bloqueado</span>}</td>
                    <td className="p-3 text-center">{row.operador ? <span className="text-emerald-400 font-bold">✓ Permitido</span> : <span className="text-slate-600">✕ Bloqueado</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Criar Utilizador */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Nova Conta de Utilizador"
        subtitle="Registe os dados do membro da equipa e atribua o perfil RBAC"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: Carlos Macuacua"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Corporativo *</label>
              <input
                type="email"
                placeholder="carlos@ntandinho.co.mz"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Telefone *</label>
              <input
                type="text"
                placeholder="+258 84 000 0000"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Departamento *</label>
              <input
                type="text"
                placeholder="Ex: Logística / Finanças"
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Perfil (RBAC) *</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })}
                className="stripe-input w-full font-bold"
              >
                <option value="ADMIN">ADMINISTRADOR GERAL</option>
                <option value="GESTOR">GESTOR OPERACIONAL</option>
                <option value="FINANCEIRO">FINANCEIRO</option>
                <option value="OPERADOR">OPERADOR DE CAMPO</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="stripe-button-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="stripe-button-primary text-xs">
              Criar Utilizador
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete User */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => {
          if (deletingUser) deleteUser(deletingUser.id);
        }}
        title="Eliminar Conta de Utilizador"
        message={`Tem a certeza de que deseja eliminar permanentemente a conta de ${deletingUser?.name} (${deletingUser?.email})?`}
      />
    </div>
  );
};
