import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Truck, 
  Wrench, 
  FileText, 
  ChevronRight, 
  Clock
} from 'lucide-react';
import { CalendarEventItem } from '../../types/dashboard.types';

interface OperationalCalendarProps {
  events: CalendarEventItem[];
}

export const OperationalCalendarSection: FC<OperationalCalendarProps> = ({ events }) => {
  const [filter, setFilter] = useState<'all' | 'trip' | 'maintenance' | 'document'>('all');
  const navigate = useNavigate();

  const filteredEvents = events
    .filter(ev => filter === 'all' || ev.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStyle = (type: string) => {
    switch (type) {
      case 'trip':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Truck, label: 'Viagem / Frete', link: '/erp/trips' };
      case 'maintenance':
        return { bg: 'bg-red-500/10 text-red-400 border-red-500/20', icon: Wrench, label: 'Manutenção Oficina', link: '/erp/maintenance' };
      case 'document':
      default:
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: FileText, label: 'Validade de Documento', link: '/erp/vehicles' };
    }
  };

  return (
    <section aria-label="Calendário Operacional e Agendamentos" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            Agenda Operacional & Compromissos
          </h2>
          <p className="text-xs text-slate-400">Previsão de partidas logísticas, entradas em oficina e vencimentos obrigatórios</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${filter === 'all' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            Todos ({events.length})
          </button>
          <button 
            onClick={() => setFilter('trip')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'trip' ? 'bg-blue-500/20 text-blue-300 border-blue-500' : 'bg-slate-900 text-blue-400 border-slate-800'}`}
          >
            <Truck className="h-3 w-3" /> Viagens
          </button>
          <button 
            onClick={() => setFilter('maintenance')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'maintenance' ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-slate-900 text-red-400 border-slate-800'}`}
          >
            <Wrench className="h-3 w-3" /> Manutenções
          </button>
          <button 
            onClick={() => setFilter('document')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${filter === 'document' ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-900 text-amber-400 border-slate-800'}`}
          >
            <FileText className="h-3 w-3" /> Inspeções/Seguros
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-lg">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CalendarIcon className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium">Sem compromissos agendados para este critério.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.slice(0, 9).map((ev) => {
              const style = getStyle(ev.type);
              const Icon = style.icon;
              const evDate = new Date(ev.date);
              const isToday = new Date().toISOString().split('T')[0] === ev.date;

              return (
                <div 
                  key={ev.id}
                  onClick={() => navigate(style.link)}
                  className="group bg-slate-950/80 hover:bg-slate-950 p-4 rounded-xl border border-slate-800/80 hover:border-orange-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${style.bg} flex-shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {style.label}
                      </span>
                    </div>
                    {isToday && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        Hoje
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                      {ev.title}
                    </h3>
                    {ev.details && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {ev.details}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Data: {evDate.toLocaleDateString('pt-PT')}
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-orange-400 transition-colors flex items-center">
                      Gerir <ChevronRight className="h-3 w-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
