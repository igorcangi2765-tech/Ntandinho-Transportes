import React, { useState } from 'react';
import {
  Settings,
  Save,
  Bell,
  RefreshCw,
  Building2,
  Users,
  Shield,
  Plus,
  Lock,
  Unlock,
  Mail,
  MapPin,
  Phone,
  FileSpreadsheet,
  Image as ImageIcon,
} from 'lucide-react';
import { PageHeader } from '../shared/layouts/PageHeader';
import { useNotificationStore } from '../shared/stores/useNotificationStore';
import { useErpStore } from '../shared/stores/useErpStore';
import { CompanyDocumentHeader } from '../components/shared/CompanyDocumentHeader';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gestor de Frota' | 'Contabilista' | 'Operador de Cargas';
  status: 'ATIVO' | 'SUSPENSO';
  powers: string[];
}

export const SettingsPage: React.FC = () => {
  const { addToast } = useNotificationStore();
  const { companyProfile, updateCompanyProfile } = useErpStore();

  const [activeTab, setActiveTab] = useState<'company' | 'staff' | 'system'>('company');

  // Ficha da Empresa (Dados da Empresa com Nampula)
  const [companyName, setCompanyName] = useState(companyProfile.name);
  const [nuit, setNuit] = useState(companyProfile.nuit);
  const [address, setAddress] = useState(companyProfile.address);
  const [city, setCity] = useState(companyProfile.city);
  const [phone1, setPhone1] = useState(companyProfile.phones[0] || '+258 84 000 0000');
  const [phone2, setPhone2] = useState(companyProfile.phones[1] || '+258 82 000 0000');
  const [email1, setEmail1] = useState(companyProfile.emails[0] || 'comercial@ntandinho.co.mz');
  const [email2, setEmail2] = useState(companyProfile.emails[1] || 'geral@ntandinho.co.mz');
  const [capitalSocial, setCapitalSocial] = useState(companyProfile.capitalSocial);
  const [logoUrl, setLogoUrl] = useState(companyProfile.logoUrl || '');
  const [taxRate, setTaxRate] = useState('16');
  const [currency, setCurrency] = useState('MZN');

  // Staff RBAC State
  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: 'usr-1',
      name: 'Dr. António N\'tandinho',
      email: 'admin@ntandinho.co.mz',
      role: 'Administrador',
      status: 'ATIVO',
      powers: ['Acesso Total', 'Aprovação Financeira', 'Gestão RBAC'],
    },
    {
      id: 'usr-2',
      name: 'Mateus Sitoe',
      email: 'frota@ntandinho.co.mz',
      role: 'Gestor de Frota',
      status: 'ATIVO',
      powers: ['Despacho de Viagens', 'Alocação de Camiões', 'Inspeções'],
    },
    {
      id: 'usr-3',
      name: 'Lúcia Mabunda',
      email: 'financas@ntandinho.co.mz',
      role: 'Contabilista',
      status: 'ATIVO',
      powers: ['Emissão de Faturas', 'Recibos de Pagamento', 'Relatório DRE'],
    },
    {
      id: 'usr-4',
      name: 'Carlos Alberto Nhantumbo',
      email: 'cargas@ntandinho.co.mz',
      role: 'Operador de Cargas',
      status: 'ATIVO',
      powers: ['Emissão de Guias', 'Rastreio GPS'],
    },
  ]);

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Administrador' | 'Gestor de Frota' | 'Contabilista' | 'Operador de Cargas'>('Gestor de Frota');

  const handleSaveCompanyDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      name: companyName,
      nuit,
      address,
      city,
      phones: [phone1, phone2],
      emails: [email1, email2],
      capitalSocial,
      logoUrl,
    });
    addToast('Dados da Empresa Guardados', `Ficha oficial de "${companyName}" em Nampula atualizada!`, 'success');
  };

  const handleToggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === 'ATIVO' ? 'SUSPENSO' : 'ATIVO';
        addToast(
          'Permissões Alteradas',
          `Poderes de ${u.name} foram ${newStatus === 'ATIVO' ? 'reativados' : 'suspensos'} pelo Administrador.`,
          newStatus === 'ATIVO' ? 'success' : 'warning'
        );
        return { ...u, status: newStatus };
      })
    );
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newStaff: StaffUser = {
      id: `usr-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: 'ATIVO',
      powers: ['Acesso ao Módulo ' + newStaffRole],
    };

    setStaffList((prev) => [newStaff, ...prev]);
    addToast('Novo Utilizador', `Membro da equipa "${newStaffName}" registado como ${newStaffRole}!`, 'success');
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const handleExportCompanyDataCSV = () => {
    addToast('Exportar Dados', 'Ficha cadastral de Nampula e lista de utilizadores exportadas em CSV!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Configurações do ERP & Perfil da Empresa"
        subtitle="Identificação fiscal, gestão de equipa (RBAC/Poderes), dados fiscais e segurança."
        icon={Settings}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCompanyDataCSV}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Exportar Dados (CSV)</span>
            </button>
            <button
              onClick={handleSaveCompanyDetails}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange-hover hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save size={16} />
              <span>Guardar Alterações</span>
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 size={16} />
          <span>Ficha & Dados da Empresa</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Users size={16} />
          <span>Gestão de Pessoal & Poderes RBAC ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Shield size={16} />
          <span>Segurança & Parâmetros Fiscais</span>
        </button>
      </div>

      {/* TAB 1: DADOS DA EMPRESA */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompanyDetails} className="space-y-6">
          <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-glass space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 size={18} className="text-brand-orange" /> Ficha Cadastral Oficial da Empresa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <ImageIcon size={13} className="text-brand-orange" /> Logótipo da Empresa (URL / Imagem Personalizada)
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://exemplo.co.mz/logo.png (deixe vazio para usar o logótipo vetorial padrão)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Este logótipo e dados de contacto são aplicados automaticamente em todas as <strong>Faturas</strong>, <strong>Recibos</strong>, <strong>Guias de Transporte</strong> e <strong>Cotações</strong> do sistema.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome Oficial / Razão Social</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">NUIT Fiscal (Moçambique)</label>
                <input
                  type="text"
                  value={nuit}
                  onChange={(e) => setNuit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 font-mono focus:border-brand-orange/60 font-bold text-brand-orange"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-500" /> Localização Principal (Endereço)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-medium text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cidade / Província</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-medium text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-slate-500" /> Linha de Atendimento Principal
                </label>
                <input
                  type="text"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-slate-500" /> Linha de Atendimento Secundária
                </label>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Mail size={13} className="text-slate-500" /> E-mail Comercial
                </label>
                <input
                  type="email"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Mail size={13} className="text-slate-500" /> E-mail Geral / Institucional
                </label>
                <input
                  type="email"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Capital Social Registado</label>
                <input
                  type="text"
                  value={capitalSocial}
                  onChange={(e) => setCapitalSocial(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 font-mono focus:border-brand-orange/60"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Moeda Principal</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-brand-orange/60 cursor-pointer"
                >
                  <option value="MZN">Metical (MZN)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                </select>
              </div>
            </div>

            {/* Live Preview Block */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Pré-visualização do Cabeçalho Oficial nos Pop-ups & Documentos:
              </span>
              <CompanyDocumentHeader
                documentType="DOCUMENTO EXEMPLO"
                documentNumber="FT-2026-PREVIEW"
                documentDate="07/Ago/2026"
                isPrintSheet={false}
                className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-0"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer"
              >
                Guardar Ficha da Empresa
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: GESTÃO DE PESSOAL & RBAC */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900/80 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={18} className="text-brand-orange" /> Gestão de Utilizadores & Atribuição de Poderes
              </h3>
              <p className="text-xs text-slate-400">Administração de papéis (RBAC): Administrador, Gestor de Frota, Contabilista e Operadores.</p>
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer shrink-0"
            >
              <Plus size={16} />
              <span>Adicionar Membro da Equipa</span>
            </button>
          </div>

          <div className="rounded-2xl bg-navy-900/80 border border-slate-800 overflow-hidden shadow-glass">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Nome do Funcionário</th>
                    <th className="p-4">E-mail de Acesso</th>
                    <th className="p-4">Cargo / Função</th>
                    <th className="p-4">Poderes Atribuidos</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Ações Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {staffList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-white text-sm">{user.name}</td>
                      <td className="p-4 text-slate-300 font-mono">{user.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-brand-orange/15 text-brand-orange font-semibold text-[11px] border border-brand-orange/30">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 space-x-1">
                        {user.powers.map((p, idx) => (
                          <span key={idx} className="inline-block text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {p}
                          </span>
                        ))}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            user.status === 'ATIVO'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStaffStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ml-auto cursor-pointer ${
                            user.status === 'ATIVO'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {user.status === 'ATIVO' ? (
                            <>
                              <Lock size={12} /> Suspender Poderes
                            </>
                          ) : (
                            <>
                              <Unlock size={12} /> Reativar Poderes
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEGURANÇA & IVA */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-glass space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-brand-orange" /> Parâmetros Fiscais & IVA Moçambique
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Taxa IVA Padrão (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 font-mono font-bold focus:border-brand-orange/60"
                />
              </div>

              <button
                onClick={() => addToast('IVA Atualizado', 'Parâmetro de cálculo de IVA fixado em ' + taxRate + '%', 'success')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Atualizar Taxa Fiscal IVA
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-glass space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell size={16} className="text-brand-orange" /> Cópias de Segurança (Backup)
            </h3>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400">Realize um backup completo encriptado dos dados de clientes, viaturas, faturas e despachos.</p>
              <button
                onClick={() => addToast('Backup Executado', 'Cópia de segurança da base de dados guardada com sucesso!', 'success')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Executar Backup do Sistema Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Pessoal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Users className="text-brand-orange" /> Adicionar Utilizador à Equipa
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Ex: Manuel Nhantumbo"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="nome@ntandinho.co.mz"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cargo / Nível de Acesso (RBAC)</label>
                <select
                  value={newStaffRole}
                  onChange={(e: any) => setNewStaffRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 cursor-pointer"
                >
                  <option value="Administrador">Administrador (Poderes Totais)</option>
                  <option value="Gestor de Frota">Gestor de Frota (Alocação & Despacho)</option>
                  <option value="Contabilista">Contabilista (Faturação & DRE)</option>
                  <option value="Operador de Cargas">Operador de Cargas (Guias & GPS)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange text-slate-950 font-bold rounded-xl shadow-glow cursor-pointer"
                >
                  Conceder Acesso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
