import React from 'react';
import { DollarSign } from 'lucide-react';
import { FinanceDashboard } from './finance/FinanceDashboard';
import { PageHeader } from '../shared/layouts/PageHeader';

export const FinancePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Gestão Financeira, Faturação & Cobranças"
        subtitle="Emissão automática de faturas ao concluir viagens, liquidação de recibos e controlo de margem DRE."
        icon={DollarSign}
      />

      <FinanceDashboard />
    </div>
  );
};
