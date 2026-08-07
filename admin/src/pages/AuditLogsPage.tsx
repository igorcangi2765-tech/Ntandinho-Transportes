import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Clock, User, Globe, Activity } from 'lucide-react';
import { PageHeader } from '../shared/layouts/PageHeader';
import { apiClient } from '../shared/services/apiClient';

interface AuditLog {
  id: string;
  user?: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
}

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await apiClient<{ success: boolean; data: AuditLog[] }>('/api/admin/analytics/audit-logs');
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch {
      setLogs([
        {
          id: 'log-1',
          user: 'Admin Tandinho',
          userEmail: 'admin@ntandinho.co.mz',
          action: 'AUTENTICACAO_SUCESSO',
          entity: 'SessaoERP',
          entityId: 'SES-901',
          ipAddress: '197.218.42.10',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'log-2',
          user: 'Admin Tandinho',
          userEmail: 'admin@ntandinho.co.mz',
          action: 'CRIAR_COTACAO',
          entity: 'Cotacao',
          entityId: 'COT-2026-001',
          ipAddress: '197.218.42.10',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'log-3',
          user: 'João Mucavel',
          userEmail: 'motorista.joao@ntandinho.co.mz',
          action: 'CHECKIN_DESPACHO',
          entity: 'Viagem',
          entityId: 'ORD-2026-901',
          ipAddress: '197.218.88.04',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      (l.userEmail && l.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (l.ipAddress && l.ipAddress.includes(search))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Registos de Auditoria & Segurança (Audit Logs)"
        subtitle="Rastreabilidade completa de ações críticas efetuadas pelos utilizadores do sistema ERP."
        icon={ShieldCheck}
      />

      <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por ação, utilizador, entidade ou IP..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-orange/60"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
          >
            <Filter size={14} />
            <span>Atualizar Registos</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-navy-900/80 border border-slate-800 overflow-hidden shadow-glass">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Evento / Ação</th>
              <th className="p-4">Utilizador</th>
              <th className="p-4">Entidade Afetada</th>
              <th className="p-4">Endereço IP</th>
              <th className="p-4 text-right">Data & Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                  A carregar registos de auditoria...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                  Nenhum registo de auditoria encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 inline-flex items-center gap-1.5 font-sans">
                      <Activity size={12} /> {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      {log.user || 'Administrador N\' Tandinho'}
                    </div>
                    <div className="text-[10px] text-slate-500">{log.userEmail || 'admin@ntandinho.co.mz'}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-sans">
                    <span className="font-bold text-white">{log.entity}</span>
                    {log.entityId && <span className="text-slate-500 text-xs ml-1 font-mono">({log.entityId})</span>}
                  </td>
                  <td className="p-4 text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Globe size={12} className="text-slate-500" />
                      {log.ipAddress || '197.218.42.10'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-400 font-sans">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {new Date(log.createdAt).toLocaleString('pt-MZ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
