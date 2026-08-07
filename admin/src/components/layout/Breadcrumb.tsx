import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  admin: 'N\' Tandinho ERP',
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
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400">
      <Link
        to="/"
        className="hover:text-white flex items-center gap-1 transition-colors"
      >
        <Home size={13} className="text-brand-orange" />
        <span>Início</span>
      </Link>

      {pathSegments.map((segment, idx) => {
        if (segment === 'admin' && idx === 0) return null;

        const path = `/${pathSegments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === pathSegments.length - 1;
        const label = routeLabels[segment] || segment;

        return (
          <React.Fragment key={path}>
            <ChevronRight size={12} className="text-slate-600" />
            {isLast ? (
              <span className="text-white font-semibold">{label}</span>
            ) : (
              <Link to={path} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
