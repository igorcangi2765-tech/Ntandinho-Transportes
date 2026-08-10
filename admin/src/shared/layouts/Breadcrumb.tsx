import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  crm: 'CRM & Cotações',
  fleet: 'Gestão de Frota',
  loads: 'Logística & Cargas',
  finance: 'Financeiro',
  'audit-logs': 'Auditoria & Logs',
  settings: 'Configurações',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Home size={13} className="text-amber-600 dark:text-[#F6A823] shrink-0" />
        <span>Início</span>
      </Link>

      {pathSegments.map((segment, idx) => {
        const path = `/${pathSegments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === pathSegments.length - 1;
        const label = routeLabels[segment] || segment;

        return (
          <React.Fragment key={path}>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 dark:text-white font-extrabold tracking-tight">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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

