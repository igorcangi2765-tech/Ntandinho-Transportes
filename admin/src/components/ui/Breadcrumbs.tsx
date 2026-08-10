import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  operations: 'Operações & Despacho',
  loads: 'Operações & Despacho',
  crm: 'Comercial & Clientes',
  fleet: 'Frota & Manutenção',
  'drivers-team': 'Motoristas & RH',
  'services-routes': 'Serviços & Rotas',
  finance: 'Financeiro & Caixa',
  reports: 'Análise & Relatórios',
  documents: 'Central de Documentos',
  communication: 'Comunicações',
  'audit-logs': 'Auditoria',
  settings: 'Administração',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'admin');

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4 select-none">
      <Link
        to="/"
        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-brand-orange transition-colors"
      >
        <Home size={13} className="text-amber-600 dark:text-[#F6A823] shrink-0" />
        <span className="font-semibold">Início</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
            {isLast ? (
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">{label}</span>
            ) : (
              <Link
                to={to}
                className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-brand-orange font-semibold transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

