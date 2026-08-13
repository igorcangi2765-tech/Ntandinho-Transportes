import React from 'react';

export type StatusType =
  | 'EM_ANDAMENTO'
  | 'CONFIRMADA'
  | 'CONCLUIDA'
  | 'CANCELADA'
  | 'EM_PREPARACAO'
  | 'NOVA'
  | 'PENDENTE'
  | 'ACEITE'
  | 'EM_ANALISE'
  | 'ENVIADA'
  | 'RASCUNHO'
  | 'REJEITADA'
  | 'OPERACIONAL'
  | 'EM_VIAGEM'
  | 'MANUTENCAO'
  | 'INDISPONIVEL'
  | 'VALIDO'
  | 'PROXIMO_VENCIMENTO'
  | 'EXPIRADO'
  | 'PAGO'
  | 'PARCIAL'
  | 'VENCIDA'
  | 'EMITIDA'
  | 'ATIVO'
  | 'INATIVO';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const displayLabel = label || String(status).replace(/_/g, ' ');

  const getStyle = (st: string) => {
    switch (st) {
      case 'CONCLUIDA':
      case 'VALIDO':
      case 'PAGO':
      case 'ACEITE':
      case 'OPERACIONAL':
      case 'ATIVO':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';

      case 'EM_ANDAMENTO':
      case 'EM_VIAGEM':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20';

      case 'CONFIRMADA':
      case 'EM_PREPARACAO':
      case 'ENVIADA':
      case 'PARCIAL':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';

      case 'NOVA':
      case 'PENDENTE':
      case 'EM_ANALISE':
      case 'RASCUNHO':
      case 'PROXIMO_VENCIMENTO':
      case 'EMITIDA':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';

      case 'CANCELADA':
      case 'EXPIRADO':
      case 'VENCIDA':
      case 'REJEITADA':
      case 'MANUTENCAO':
      case 'INDISPONIVEL':
      case 'INATIVO':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';

      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border transition-colors whitespace-nowrap shrink-0 ${getStyle(
        status
      )} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0 opacity-70" />
      {displayLabel}
    </span>
  );
};
