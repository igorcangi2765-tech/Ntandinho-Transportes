import React from 'react';
import { QuotationItem } from '../../shared/stores/useErpStore';
import { MoreHorizontal, Calendar, ArrowRight, DollarSign } from 'lucide-react';

interface QuotationsFunnelProps {
  quotations: QuotationItem[];
  onQuotationClick: (quotation: QuotationItem) => void;
}

const COLUMN_DEF = [
  { id: 'RASCUNHO', label: 'Rascunhos', color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { id: 'EM_ANALISE', label: 'Em Análise', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
  { id: 'ENVIADA', label: 'Enviadas', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
  { id: 'ACEITE', label: 'Ganhas (Aceite)', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  { id: 'RECUSADA', label: 'Perdidas', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
];

export const QuotationsFunnel: React.FC<QuotationsFunnelProps> = ({ quotations, onQuotationClick }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[500px]">
      {COLUMN_DEF.map((col) => {
        const colQuotations = quotations.filter((q) => {
          if (col.id === 'ACEITE') return q.status === 'ACEITE' || q.status === 'FATURADO';
          if (col.id === 'RECUSADA') return q.status === 'RECUSADA' || q.status === 'EXPIRADA';
          return q.status === col.id;
        });

        const totalValue = colQuotations.reduce((acc, q) => acc + q.totalPrice, 0);

        return (
          <div key={col.id} className="flex-1 min-w-[280px] flex flex-col bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            {/* Header Column */}
            <div className={`p-3 border-b flex flex-col gap-1 ${col.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{col.label}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
                  {colQuotations.length}
                </span>
              </div>
              <div className="text-xs font-bold opacity-80 flex items-center gap-1">
                <DollarSign size={12} />
                {totalValue.toLocaleString('pt-MZ')} MZN
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 flex-1 overflow-y-auto space-y-2">
              {colQuotations.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onQuotationClick(q)}
                  className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-brand-orange">{q.quotationNumber}</span>
                    <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{q.customerName}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="truncate">{q.origin}</span>
                      <ArrowRight size={10} className="shrink-0" />
                      <span className="truncate">{q.destination}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar size={12} />
                      Val: {q.validUntil}
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {q.totalPrice.toLocaleString('pt-MZ')} MZN
                    </span>
                  </div>
                </div>
              ))}
              
              {colQuotations.length === 0 && (
                <div className="h-24 flex items-center justify-center text-xs font-medium text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
                  Sem cotações
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
