import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  ArrowRight
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Fatura Vencida > 450.000 MZN',
      desc: 'Fatura INV-2026-004 do cliente MozCargo excedeu o prazo de 30 dias.',
      level: 'red' as const,
      time: 'Há 15 minutos',
      link: '/admin/financeiro/facturas'
    },
    {
      id: '2',
      title: 'Seguro Veicular Prestes a Expirar',
      desc: 'Seguro da frota Volvo FH-540 (AAA-123-MC) expira em 4 dias.',
      level: 'red' as const,
      time: 'Há 1 hora',
      link: '/admin/operacoes/veiculos'
    },
    {
      id: '3',
      title: 'Atraso em Posto Fronteiriço',
      desc: 'Viagem NT-2026-8941 retida no posto de Ressano Garcia para desembaraço.',
      level: 'yellow' as const,
      time: 'Há 3 horas',
      link: '/admin/operacoes/viagens'
    },
    {
      id: '4',
      title: 'Manutenção Preventiva Requerida',
      desc: 'Camião Scania R-450 atingiu 50.000 KM para troca de óleo.',
      level: 'yellow' as const,
      time: 'Há 5 horas',
      link: '/admin/operacoes/manutencao'
    },
    {
      id: '5',
      title: 'Pagamento Recebido via M-Pesa',
      desc: 'Liquidada fatura INV-2026-012 no valor de 125.000,00 MZN por cliente Cervejas de Moçambique.',
      level: 'green' as const,
      time: 'Há 6 horas',
      link: '/admin/financeiro/pagamentos'
    }
  ];

  const filtered = notifications.filter(n => filter === 'all' || n.level === filter);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 flex flex-col shadow-2xl animate-slideLeft">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Centro de Notificações</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <X size={18} />
        </button>
      </div>

      {/* Severities Filter */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all ${
            filter === 'all' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('red')}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            filter === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-red-500" /> Críticas
        </button>
        <button
          onClick={() => setFilter('yellow')}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            filter === 'yellow' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Importantes
        </button>
        <button
          onClick={() => setFilter('green')}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            filter === 'green' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Info
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            Sem notificações registradas para este filtro.
          </div>
        ) : (
          filtered.map(item => {
            const isRed = item.level === 'red';
            const isYellow = item.level === 'yellow';

            return (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  navigate(item.link);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isRed 
                    ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60' 
                    : isYellow
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${isRed ? 'bg-red-500 animate-pulse' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>Módulo Direto</span>
                  <span className="text-orange-400 flex items-center gap-1">
                    Resolver <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
