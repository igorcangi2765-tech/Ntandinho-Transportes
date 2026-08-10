import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  ArrowRight,
  History
} from 'lucide-react';
import { ActivityItem } from '../../types/dashboard.types';

interface RecentActivityTimelineProps {
  activities: ActivityItem[];
}

export const RecentActivityTimelineSection: FC<RecentActivityTimelineProps> = ({ activities }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'FINANCIAL' | 'OPERATION' | 'SYSTEM'>('ALL');
  const navigate = useNavigate();

  const filtered = activeTab === 'ALL' 
    ? activities 
    : activities.filter(a => a.type === activeTab);

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'FINANCIAL':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: DollarSign, color: 'text-emerald-500', label: 'Financeiro' };
      case 'OPERATION':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Truck, color: 'text-blue-400', label: 'Operações' };
      case 'SYSTEM':
      default:
        return { bg: 'bg-slate-800 text-slate-300 border-slate-700', icon: ShieldCheck, color: 'text-slate-400', label: 'Sistema & Auditoria' };
    }
  };

  return (
    <section aria-label="Feed de Auditoria e Atividades" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-orange-500" />
            Feed de Atividades & Auditoria em Tempo Real
          </h2>
          <p className="text-xs text-slate-400">Registo cronológico de todas as transações, partidas de caminhões e modificações no ERP</p>
        </div>

        {/* Abas de Filtragem de Atividade */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'FINANCIAL', 'OPERATION', 'SYSTEM'] as const).map((tab) => {
            const labels = { ALL: 'Tudo', FINANCIAL: 'Financeiros', OPERATION: 'Viagens & Cargas', SYSTEM: 'Auditoria' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${isActive ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-lg">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Clock className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">Sem registos recentes nesta categoria.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
            {filtered.map((act, idx) => {
              const style = getBadgeStyle(act.type);
              const Icon = style.icon;
              const dateObj = new Date(act.timestamp);

              return (
                <div key={act.id} className="relative pl-6 group">
                  {/* Ponto na Linha do Tempo */}
                  <span className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center group-hover:border-orange-500 transition-colors shadow-sm`}>
                    <Icon className={`h-4 w-4 ${style.color}`} />
                  </span>

                  <div className="bg-slate-950/80 hover:bg-slate-950 rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${style.bg}`}>
                          {style.label}
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {act.action}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end flex-shrink-0 text-[11px] text-slate-400 space-y-1">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                        {act.user}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {dateObj.toLocaleDateString('pt-PT')} às {dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button 
            onClick={() => navigate('/erp/reports')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 ml-auto"
          >
            Acessar Log Completo de Auditoria do Sistema <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
