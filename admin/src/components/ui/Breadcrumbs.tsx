import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const mainRouteLabels: Record<string, string> = {
  operations: 'Operações',
  fleet: 'Frota',
  'drivers-team': 'Equipa',
  crm: 'Comercial',
  finance: 'Financeiro',
  reports: 'Relatórios',
  documents: 'Documentos',
  settings: 'Configurações',
};

const tabLabels: Record<string, Record<string, string>> = {
  operations: {
    trips: 'Viagens',
    bookings: 'Reservas',
    calendar: 'Agenda',
  },
  fleet: {
    vehicles: 'Viaturas',
    maintenance: 'Manutenção',
    fuel: 'Abastecimento',
  },
  'drivers-team': {
    motoristas: 'Motoristas',
    equipa: 'Equipa Interna',
  },
  crm: {
    customers: 'Clientes',
    quotations: 'Cotações',
    services: 'Serviços',
  },
  finance: {
    caixa: 'Resumo',
    overview: 'Resumo',
    faturacao: 'Faturas',
    invoices: 'Faturas',
    despesas: 'Receitas & Despesas',
    expenses: 'Receitas & Despesas',
    pagamentos: 'Recebimentos',
    payments: 'Recebimentos',
  },
  settings: {
    company: 'Empresa',
    users: 'Utilizadores',
    permissions: 'Permissões',
  },
};

const defaultTabs: Record<string, string> = {
  operations: 'Viagens',
  fleet: 'Viaturas',
  'drivers-team': 'Motoristas',
  crm: 'Clientes',
  finance: 'Faturas',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'admin');
  const searchParams = new URLSearchParams(location.search);
  const activeTabParam = searchParams.get('tab');

  // Na Dashboard principal: NÃO mostrar breadcrumb
  if (pathnames.length === 0 || pathnames[0] === 'dashboard') {
    return null;
  }

  const moduleKey = pathnames[0];
  const mainLabel = mainRouteLabels[moduleKey] || moduleKey;

  // Determinar rótulo da tab ativa
  let subLabel = '';
  if (activeTabParam && tabLabels[moduleKey] && tabLabels[moduleKey][activeTabParam]) {
    subLabel = tabLabels[moduleKey][activeTabParam];
  } else if (defaultTabs[moduleKey]) {
    subLabel = defaultTabs[moduleKey];
  }

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4 select-none">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-brand-orange transition-colors"
      >
        <Home size={13} className="text-amber-600 dark:text-[#F6A823] shrink-0" />
        <span className="font-semibold">Início</span>
      </Link>

      <ChevronRight size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
      
      {subLabel ? (
        <>
          <Link
            to={`/${moduleKey}`}
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-brand-orange font-semibold transition-colors"
          >
            {mainLabel}
          </Link>
          <ChevronRight size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">{subLabel}</span>
        </>
      ) : (
        <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">{mainLabel}</span>
      )}
    </nav>
  );
};

