import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore } from '../shared/stores/useErpStore';
import { useUserProfileStore, UserProfile } from '../shared/stores/useUserProfileStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import {
  Building2,
  ShieldCheck,
  Save,
  MapPin,
  FileCheck2,
  Users,
  KeyRound,
  UserPlus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';


interface ErpUserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'DISPATCH' | 'READONLY';
  roleName: string;
  lastLogin: string;
  isActive: boolean;
}

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { companyProfile, updateCompanyProfile } = useErpStore();
  const { availableProfiles } = useUserProfileStore();
  const { addToast } = useNotificationStore();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'company' | 'users' | 'rbac'>('company');

  useEffect(() => {
    if (tabParam === 'users' || tabParam === 'utilizadores') setActiveTab('users');
    else if (tabParam === 'rbac' || tabParam === 'permissoes') setActiveTab('rbac');
    else setActiveTab('company');
  }, [tabParam]);

  const handleTabChange = (tab: 'company' | 'users' | 'rbac') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [nomeComercial, setNomeComercial] = useState(companyProfile.nomeComercial || "N' Tandinho");
  const [nomeJuridico, setNomeJuridico] = useState(companyProfile.nomeJuridico || "Transportes e Logística N' Tandinho Lda");
  const [slogan, setSlogan] = useState(companyProfile.slogan || "Transporte Seguro, Eficiente e Confiável");
  const [address, setAddress] = useState(companyProfile.address || "Av. Eduardo Mondlane, Edifício Central");
  const [city, setCity] = useState(companyProfile.city || "Nampula");
  const [province, setProvince] = useState(companyProfile.province || "Nampula");
  const [country, setCountry] = useState(companyProfile.country || "Moçambique");
  const [phones, setPhones] = useState(companyProfile.phones.join(', '));
  const [emails, setEmails] = useState(companyProfile.emails.join(', '));
  const [website, setWebsite] = useState(companyProfile.website || "https://ntandinho.zyphtech.com");
  const [whatsapp, setWhatsapp] = useState(companyProfile.whatsapp || "+258 84 000 0000");
  const [operationArea, setOperationArea] = useState(companyProfile.operationArea || "Nacional (Moçambique) & Internacional (Região da SADC)");
  const [mission, setMission] = useState(companyProfile.mission || "Oferecer soluções logísticas e transporte pesado com máxima excelência.");
  const [vision, setVision] = useState(companyProfile.vision || "Ser a principal operadora logística de referência em Moçambique e região SADC.");
  const [nuit, setNuit] = useState(companyProfile.nuit || "400881920");
  const [bankAccountDetails, setBankAccountDetails] = useState(companyProfile.bankAccountDetails || "Millennium BIM: 102938475 | BCI: 987654321");

  const [usersList, setUsersList] = useState<ErpUserItem[]>([
    { id: 'usr-1', name: "Sérgio N'tandinho", email: 'sergio@ntandinho.co.mz', role: 'ADMIN', roleName: 'Administrador ERP', lastLogin: 'Hoje, 08:30', isActive: true },
    { id: 'usr-2', name: 'Mateus Nhantumbo', email: 'mateus.operacoes@ntandinho.co.mz', role: 'MANAGER', roleName: 'Gestor de Operações', lastLogin: 'Hoje, 09:15', isActive: true },
    { id: 'usr-3', name: 'Beatriz Mabunda', email: 'beatriz.financeiro@ntandinho.co.mz', role: 'FINANCE', roleName: 'Contabilista Sénior', lastLogin: 'Ontem, 16:45', isActive: true },
    { id: 'usr-4', name: 'Celso Macamo', email: 'celso.despacho@ntandinho.co.mz', role: 'DISPATCH', roleName: 'Despachante Nampula', lastLogin: 'Hoje, 07:40', isActive: true },
  ]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'MANAGER' | 'FINANCE' | 'DISPATCH' | 'READONLY'>('DISPATCH');

  const [rbacMatrix, setRbacMatrix] = useState([
    { module: 'Operações & Viagens', create: true, edit: true, delete: false, export: true },
    { module: 'Comercial & Cotações', create: true, edit: true, delete: false, export: true },
    { module: 'Gestão Financeira & Faturas', create: true, edit: true, delete: false, export: true },
    { module: 'Frota & Manutenção', create: true, edit: true, delete: false, export: true },
    { module: 'Administração & Sistema', create: true, edit: true, delete: true, export: true },
  ]);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      name: nomeJuridico,
      nomeComercial,
      nomeJuridico,
      slogan,
      address,
      city,
      province,
      country,
      phones: phones.split(',').map((p) => p.trim()),
      emails: emails.split(',').map((m) => m.trim()),
      website,
      whatsapp,
      operationArea,
      mission,
      vision,
      nuit,
      bankAccountDetails,
    });
    addToast('Definições Guardadas', 'Dados institucionais da N\' Tandinho atualizados no ERP com sucesso.', 'success');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const roleNameMap = {
      ADMIN: 'Administrador ERP',
      MANAGER: 'Gestor de Operações',
      FINANCE: 'Contabilista Sénior',
      DISPATCH: 'Despachante Nampula',
      READONLY: 'Consultor de Leitura',
    };

    const newUser: ErpUserItem = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      roleName: roleNameMap[newUserRole],
      lastLogin: 'Nunca',
      isActive: true,
    };

    setUsersList([...usersList, newUser]);
    addToast('Utilizador Adicionado', `Conta para ${newUserName} criada com perfil ${roleNameMap[newUserRole]}.`, 'success');
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = !u.isActive;
          addToast('Estado do Utilizador', `Conta de ${u.name} ${nextStatus ? 'ativada' : 'bloqueada'}.`, nextStatus ? 'success' : 'warning');
          return { ...u, isActive: nextStatus };
        }
        return u;
      })
    );
  };

  const handleToggleRbacPermission = (index: number, key: 'create' | 'edit' | 'delete' | 'export') => {
    setRbacMatrix((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: !copy[index][key] };
      return copy;
    });
    addToast('Matriz RBAC Atualizada', 'Permissões de acesso ajustadas com sucesso.', 'info');
  };

  const userColumns: Column<ErpUserItem>[] = [
    {
      key: 'name',
      header: 'Utilizador ERP',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'roleName',
      header: 'Perfil de Acesso',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B132B] dark:bg-[#F6A823] text-white dark:text-[#0B132B] font-mono">
          {row.roleName}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'lastLogin',
      header: 'Último Acesso',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">{row.lastLogin}</span>,
    },
    {
      key: 'isActive',
      header: 'Estado da Conta',
      accessor: (row) => (
        <button
          onClick={() => handleToggleUserStatus(row.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border ${
            row.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
          }`}
        >
          {row.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          <span>{row.isActive ? 'ACTIVO' : 'BLOQUEADO'}</span>
        </button>
      ),
    },
  ];

  return (
    <StandardPageLayout
      title="Configurações do Sistema"
      description="Gestão dos dados da empresa, utilizadores, permissões e parâmetros."
      icon={ShieldCheck}
      actions={
        <div className="flex items-center gap-2">
          {activeTab === 'users' && (
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#F6A823] hover:bg-[#D08500] text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer transition-all"
            >
              <UserPlus size={15} strokeWidth={2.5} />
              <span>Novo Utilizador</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        <>
          <MetricCard
            title="Sede Principal"
            value="Nampula"
            subtext="Av. Eduardo Mondlane"
            icon={MapPin}
            iconBg="bg-amber-500/10 dark:bg-[#16223B]"
            iconColor="text-[#F6A823]"
          />
          <MetricCard
            title="Utilizadores ERP"
            value={usersList.length}
            subtext={`${usersList.filter((u) => u.isActive).length} Contas Activas`}
            icon={Users}
            iconBg="bg-blue-500/10 dark:bg-[#16223B]"
            iconColor="text-[#0EA5E9]"
          />
          <MetricCard
            title="Segurança RBAC"
            value="Nível 5"
            subtext="Perfis Credenciados"
            icon={ShieldCheck}
            iconBg="bg-emerald-500/10 dark:bg-[#16223B]"
            iconColor="text-[#16A34A]"
          />
          <MetricCard
            title="Identificação Fiscal"
            value={nuit}
            subtext="NUIT Institucional"
            icon={FileCheck2}
            iconBg="bg-purple-500/10 dark:bg-[#16223B]"
            iconColor="text-purple-500"
          />
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white dark:bg-[#0B132B] p-2 rounded-2xl border border-slate-200 dark:border-[#1C2A48] shadow-subtle mb-6 w-full">
        <button
          onClick={() => handleTabChange('company')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-tight w-full ${
            activeTab === 'company'
              ? 'bg-slate-900 dark:bg-[#F6A823] text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-50 dark:bg-[#16223B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 size={14} className="shrink-0" />
          <span>Empresa & Ficha Institucional</span>
        </button>

        <button
          onClick={() => handleTabChange('users')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-tight w-full ${
            activeTab === 'users'
              ? 'bg-slate-900 dark:bg-[#F6A823] text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-50 dark:bg-[#16223B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users size={14} className="shrink-0" />
          <span>Utilizadores ERP ({usersList.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('rbac')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-tight w-full ${
            activeTab === 'rbac'
              ? 'bg-slate-900 dark:bg-[#F6A823] text-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-50 dark:bg-[#16223B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound size={14} className="shrink-0" />
          <span>Permissões de Acesso (RBAC)</span>
        </button>
      </div>



      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="space-y-4">
          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <Building2 className="text-[#F6A823]" size={20} />
              Identidade Corporativa & Posicionamento Oficial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Nome Comercial</label>
                <input type="text" value={nomeComercial} onChange={(e) => setNomeComercial(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Nome Jurídico Aprovado</label>
                <input type="text" value={nomeJuridico} onChange={(e) => setNomeJuridico(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Slogan da Empresa</label>
                <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div className="lg:col-span-3">
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Área de Operação</label>
                <input type="text" value={operationArea} onChange={(e) => setOperationArea(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
            </div>
          </div>

          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <MapPin className="text-[#0EA5E9]" size={20} />
              Sede Principal em Nampula & Contactos Oficiais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="lg:col-span-2">
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Endereço da Sede Principal</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Cidade Sede</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Província</label>
                <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">País</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Telefone WhatsApp</label>
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Telefones (vírgula)</label>
                <input type="text" value={phones} onChange={(e) => setPhones(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Emails (vírgula)</label>
                <input type="text" value={emails} onChange={(e) => setEmails(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Website Oficial</label>
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
            </div>
          </div>

          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <Building2 className="text-[#16A34A]" size={20} />
              Missão e Visão Institucional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Missão Institucional</label>
                <textarea rows={2} value={mission} onChange={(e) => setMission(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Visão de Futuro</label>
                <textarea rows={2} value={vision} onChange={(e) => setVision(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
            </div>
          </div>

          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <FileCheck2 className="text-[#8B5CF6]" size={20} />
              Registos Fiscais & Bancários Oficiais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">NUIT Oficial</label>
                <input type="text" value={nuit} onChange={(e) => setNuit(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#F6A823]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Contas Bancárias de Faturação</label>
                <input type="text" value={bankAccountDetails} onChange={(e) => setBankAccountDetails(e.target.value)} className="w-full bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#F6A823]" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#F6A823] hover:bg-[#D08500] text-[#0B132B] font-extrabold text-sm rounded-xl shadow-glow cursor-pointer transition-all duration-200">
              <Save size={16} /> Guardar Definições da Empresa
            </button>
          </div>
        </form>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <DataTable
            data={usersList}
            columns={userColumns}
            keyExtractor={(row) => row.id}
            searchPlaceholder="Pesquisar utilizador por nome, email ou perfil..."
            quickActions={[
              {
                label: 'Ativar / Bloquear Utilizador',
                onClick: (row) => handleToggleUserStatus(row.id),
              },
              {
                label: 'Eliminar Utilizador',
                isDestructive: true,
                onClick: (row) => {
                  setUsersList((prev) => prev.filter((u) => u.id !== row.id));
                  addToast('Utilizador Removido', `Conta de ${row.name} removida do sistema.`, 'info');
                },
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <ShieldCheck className="text-[#F6A823]" size={20} />
              Matriz de Controlo de Acessos por Módulo (RBAC)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#16223B] border-b border-slate-200 dark:border-[#1C2A48] text-slate-700 dark:text-slate-300 font-extrabold uppercase">
                    <th className="py-3 px-4">Módulo ERP</th>
                    <th className="py-3 px-4 text-center">Criar</th>
                    <th className="py-3 px-4 text-center">Editar</th>
                    <th className="py-3 px-4 text-center">Eliminar</th>
                    <th className="py-3 px-4 text-center">Exportar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1C2A48]">
                  {rbacMatrix.map((row, idx) => (
                    <tr key={row.module} className="hover:bg-slate-50 dark:hover:bg-[#16223B]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.module}</td>
                      {(['create', 'edit', 'delete', 'export'] as const).map((key) => (
                        <td key={key} className="py-3 px-4 text-center">
                          <button onClick={() => handleToggleRbacPermission(idx, key)} className={`w-6 h-6 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all border ${row[key] ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                            {row[key] ? '✓' : '✕'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#16223B] pb-3">
              <KeyRound className="text-[#0EA5E9]" size={20} />
              Perfis de Segurança Credenciados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {availableProfiles.map((prof: UserProfile) => (
                <div key={prof.id} className="p-3.5 bg-slate-50 dark:bg-[#16223B] border border-slate-200 dark:border-[#273759] rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{prof.name}</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0B132B] dark:bg-[#F6A823] text-white dark:text-[#0B132B] font-mono">
                      {prof.role}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                    <strong>Permissões de Acesso:</strong> {prof.powers.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Registar Novo Utilizador no ERP" subtitle="Atribua credenciais e perfil de acesso seguro">
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Nome Completo</label>
            <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Ex: Armindo Mabunda" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Email Institucional</label>
            <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="armindo@ntandinho.co.mz" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono" />
          </div>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Perfil de Acesso RBAC</label>
            <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold cursor-pointer">
              <option value="ADMIN">Administrador ERP</option>
              <option value="MANAGER">Gestor de Operações</option>
              <option value="FINANCE">Contabilista Sénior</option>
              <option value="DISPATCH">Despachante Nampula</option>
              <option value="READONLY">Consultor de Leitura</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-[#F6A823] hover:bg-[#D08500] text-slate-950 font-bold rounded-xl shadow-glow cursor-pointer">Criar Conta</button>
          </div>
        </form>
      </Modal>
    </StandardPageLayout>
  );
};
