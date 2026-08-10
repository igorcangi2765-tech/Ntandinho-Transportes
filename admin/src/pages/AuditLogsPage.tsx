import React from 'react';
import { useErpStore, AuditLogItem } from '../shared/stores/useErpStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { ShieldCheck, Activity, Users, Clock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useErpStore();

  // Columns for Audit Logs
  const uniqueUsersCount = Array.from(new Set(auditLogs.map((log) => log.userName))).length;

  const auditColumns: Column<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Data / Hora',
      accessor: (row) => <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">{row.timestamp}</span>,
      sortable: true,
    },
    {
      key: 'userName',
      header: 'Utilizador Responsável',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.userName}</span>,
      sortable: true,
    },
    {
      key: 'module',
      header: 'Módulo Mapeado',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
          {row.module}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Acção Executada',
      accessor: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.action}</span>,
    },
    {
      key: 'recordRef',
      header: 'Ref. Registo',
      accessor: (row) => <span className="font-mono text-brand-orange font-bold">{row.recordRef}</span>,
    },
    {
      key: 'details',
      header: 'Detalhes da Operação',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.details}</span>,
    },
  ];

  return (
    <StandardPageLayout
      title="Registo de Actividades & Auditoria Operacional"
      description="Histórico e rastreabilidade integral das acções realizadas pelos utilizadores no ERP N' Tandinho."
      icon={ShieldCheck}
      kpiCards={
        <>
          <MetricCard
            title="Total Actividades"
            value={auditLogs.length}
            subtext="Eventos registados"
            icon={Activity}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Utilizadores Ativos"
            value={uniqueUsersCount}
            subtext="Operadores com acessos"
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Conformidade ERP"
            value="100%"
            subtext="Rastreabilidade activa"
            icon={ShieldCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Sessão Actual"
            value="Sérgio N'tandinho"
            subtext="Administrador Principal"
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-brand-orange"
          />
        </>
      }
    >
      <DataTable
        data={auditLogs}
        columns={auditColumns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Pesquisar acção, utilizador, módulo ou ref..."
        filterOptions={[
          {
            label: 'Módulo',
            key: 'module',
            options: [
              { value: 'OPERACOES', label: 'Operações' },
              { value: 'FROTA', label: 'Frota' },
              { value: 'CRM', label: 'CRM' },
              { value: 'FINANCEIRO', label: 'Financeiro' },
            ],
          },
        ]}
      />
    </StandardPageLayout>
  );
};
