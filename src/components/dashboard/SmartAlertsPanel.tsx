import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Filter,
  ExternalLink
} from 'lucide-react';
import { SmartAlert, AlertLevel } from '../../types/dashboard.types';

interface SmartAlertsPanelProps {
  alerts: SmartAlert[];
}

export const SmartAlertsPanelSection: FC<SmartAlertsPanelProps> = ({ alerts }) => {
  const [filter, setFilter] = useState<'all' | AlertLevel>('all');
  const navigate = useNavigate();

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.level === filter);

  const counts = {
    red: alerts.filter(a => a.level === 'red').length,
    yellow: alerts.filter(a => a.level === 'yellow').length,
    green: alerts.filter(a => a.level === 'green').length,
  };

  const getStyle = (level: AlertLevel) => {
    switch (level) {
      case 'red':
        return {
          border: 'border-red-500/40 hover:border-red-500',
          bg: 'bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900',
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: AlertOctagon,
          iconColor: 'text-red-500',
          actionText: 'Ação Imediata',
          glow: 'shadow-md shadow-red-500/5'
        };
      case 'yellow':
        return {
          border: 'border-amber-500/40 hover:border-amber-500',
          bg: 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900',
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          actionText: 'Requer Atenção',
          glow: 'shadow-md shadow-amber-500/5'
        };
      case 'green':
      default:
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          bg: 'bg-slate-900/90',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          actionText: 'Conforme',
          glow: 'shadow-md shadow-emerald-500/5'
        };
    }
  };

  return (
    <section aria-label="Central de Alertas Inteligentes e Compliance" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Watchdog: Alertas Inteligentes & Auditoria Preventiva
          </h2>
          <p className="text-xs text-slate-400">Deteção automática de vencimentos de frota, faturas atrasadas e riscos operacionais</p>
        </div>

        {/* Filtros por Severidade */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'all' ? 'bg-slate-800 text-white border-slate-600 shadow' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            <Filter className="h-3 w-3" /> Todos ({alerts.length})
          </button>
          <button 
            onClick={() => setFilter('red')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'red' ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md shadow-red-500/20' : 'bg-slate-900 text-red-400 border-slate-800 hover:border-red-500/30'}`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Críticos ({counts.red})
          </button>
          <button 
            onClick={() => setFilter('yellow')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'yellow' ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20' : 'bg-slate-900 text-amber-400 border-slate-800 hover:border-amber-500/30'}`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Atenção ({counts.yellow})
          </button>
          <button 
            onClick={() => setFilter('green')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'green' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-900 text-emerald-400 border-slate-800 hover:border-emerald-500/30'}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Normais ({counts.green})
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-8 text-center text-slate-400 flex flex-col items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2 opacity-80" />
          <p className="font-medium text-slate-200">Sem alertas para este filtro no momento.</p>
          <p className="text-xs text-slate-400 mt-1">A frota e o sistema financeiro operam dentro dos parâmetros estipulados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAlerts.map((alt) => {
            const style = getStyle(alt.level);
            const Icon = style.icon;

            return (
              <div 
                key={alt.id}
                onClick={() => navigate(alt.link)}
                className={`group rounded-xl border ${style.border} ${style.bg} ${style.glow} p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-0.5`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      <Icon className={`h-4 w-4 ${style.iconColor} flex-shrink-0`} />
                      {alt.module}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${style.badgeBg}`}>
                      {style.actionText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {alt.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {alt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Data de Registo/Venc.: <strong className="text-slate-300">{new Date(alt.date).toLocaleDateString('pt-PT')}</strong></span>
                  <span className="font-semibold flex items-center gap-1 text-slate-300 group-hover:text-orange-400 transition-colors">
                    Resolver <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
