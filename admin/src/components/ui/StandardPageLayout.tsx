import React from 'react';
import { PageHeader } from './PageHeader';

interface StandardPageLayoutProps {
  title: string;
  companyName?: string;
  description: string;
  badgeText?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  kpiCards?: React.ReactNode;
  children: React.ReactNode;
}

export const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({
  title,
  companyName,
  description,
  badgeText,
  icon,
  actions,
  kpiCards,
  children,
}) => {
  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. HEADER */}
      <PageHeader
        title={title}
        companyName={companyName}
        description={description}
        badgeText={badgeText}
        icon={icon}
        actions={actions}
      />

      {/* 2. RESUMO (KPI Cards) */}
      {kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
          {kpiCards}
        </div>
      )}

      {/* 3 & 4. CONTEÚDO PRINCIPAL */}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
