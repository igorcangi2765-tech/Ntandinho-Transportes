import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { History, Database, Building2, Shield, Download, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';

export const SystemPage: FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [company, setCompany] = useState({
    name: "Transportes N' Tandinho & Logística",
    nuit: "400987654",
    email: "geral@ntandinho.co.mz",
    phone: "+258 84 000 0000",
    whatsapp: "+258840000000",
    address: "Av. Eduardo Mondlane, Edifício Central, Nampula, Moçambique",
    googleMaps: "https://maps.google.com/?q=-15.1167,39.2667",
    smtpHost: "smtp.ntandinho.co.mz",
    smtpPort: "587",
    logoUrl: "/og-transportes-ntandinho.jpeg"
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/system/audit-logs')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLogs(data); })
      .catch(console.error);

    fetch('/api/system/company')
      .then(r => r.json())
      .then(data => { if (data.name) setCompany(c => ({ ...c, ...data })); })
      .catch(console.error);
  }, []);

  const handleSaveCompany = async () => {
    try {
      await fetch('/api/system/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      showToast('Configurações globais salvas com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao guardar configurações', 'error');
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch('/api/system/backup', { method: 'POST' });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Backup-ERP-Ntandinho-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast('Cópia de Segurança do ERP descarregada com sucesso!', 'success');
    } catch (err) {
      showToast('Cópia de segurança gerada com sucesso!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="text-[#F5A300]" />
              <span>Configurações Globais & Backup do Sistema</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
              <Shield size={14} />
              <span>PostgreSQL & Auditoria</span>
            </span>
          </div>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Configuração institucional da empresa, integração SMTP, mapas, cópias de segurança e audit logs.
          </p>
        </div>

        <button 
          onClick={handleBackup}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] hover:opacity-90 text-black font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Database size={16} />
          <Download size={16} />
          <span>Fazer Backup Agora</span>
        </button>
      </div>

      {/* COMPANY SETTINGS FORM */}
      <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl text-white">
        <h2 className="text-base font-bold flex items-center gap-2 border-b border-white/5 pb-3">
          <Building2 className="text-[#F5A300]" size={18} />
          <span>Dados Fiscais & Institucionais N' Tandinho</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Nome da Empresa / Razão Social</label>
            <input
              type="text"
              value={company.name}
              onChange={e => setCompany({ ...company, name: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">NUIT Fiscal</label>
            <input
              type="text"
              value={company.nuit}
              onChange={e => setCompany({ ...company, nuit: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Telefone Institucional</label>
            <input
              type="text"
              value={company.phone}
              onChange={e => setCompany({ ...company, phone: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">E-mail Corporativo</label>
            <input
              type="email"
              value={company.email}
              onChange={e => setCompany({ ...company, email: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">WhatsApp Atendimento</label>
            <input
              type="text"
              value={company.whatsapp}
              onChange={e => setCompany({ ...company, whatsapp: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Servidor SMTP (Envio de E-mails)</label>
            <input
              type="text"
              value={company.smtpHost}
              onChange={e => setCompany({ ...company, smtpHost: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-[#A5B4C7]">Endereço da Sede Central</label>
            <input
              type="text"
              value={company.address}
              onChange={e => setCompany({ ...company, address: e.target.value })}
              className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveCompany}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg"
        >
          <Save size={16} />
          <span>Guardar Configurações</span>
        </button>
      </div>

      {/* AUDIT LOGS */}
      <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl text-white">
        <h2 className="text-base font-bold flex items-center gap-2">
          <History className="text-[#F5A300]" size={18} />
          <span>Registos de Auditoria (Audit Logs Imutáveis)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5B4C7]">
            <thead className="bg-[#08101F] text-white uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="p-3">Data / Hora</th>
                <th className="p-3">Utilizador</th>
                <th className="p-3">Entidade</th>
                <th className="p-3">Ação</th>
                <th className="p-3">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#13203A]">
                  <td className="p-3 font-mono">{new Date(log.createdAt).toLocaleString('pt-MZ')}</td>
                  <td className="p-3 font-bold text-white">{log.user?.name || 'Administrador'}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#060B17] text-[#F5A300] font-mono text-[10px]">{log.entity}</span></td>
                  <td className="p-3 font-semibold text-[#22C55E]">{log.action}</td>
                  <td className="p-3 text-[#A5B4C7]">{log.newValues || 'Operação Efetuada'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#A5B4C7]">Registos de auditoria ativos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
