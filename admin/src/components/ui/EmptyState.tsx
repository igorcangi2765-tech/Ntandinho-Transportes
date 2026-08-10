import React from 'react';
import { PackageOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Sem registos',
  description = 'Sem dados disponíveis.',
  icon: Icon = PackageOpen,
  action,
}) => {
  return (
    <div className="p-12 text-center rounded-2xl bg-navy-900/40 border border-slate-800/80 flex flex-col items-center justify-center space-y-4">
      <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 border border-slate-700/50">
        <Icon size={32} />
      </div>
      <div className="max-w-md">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
