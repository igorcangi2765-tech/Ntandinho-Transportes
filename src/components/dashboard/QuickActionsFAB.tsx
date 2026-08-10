import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Truck, 
  FileText, 
  Users, 
  Building2, 
  Wrench, 
  X, 
  Sparkles 
} from 'lucide-react';

export const QuickActionsFAB: FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { label: 'Nova Viagem', icon: Truck, color: 'bg-orange-600 hover:bg-orange-500 text-white', action: () => navigate('/admin/operacoes/viagens') },
    { label: 'Emitir Fatura', icon: FileText, color: 'bg-emerald-600 hover:bg-emerald-500 text-white', action: () => navigate('/admin/financeiro/facturas') },
    { label: 'Novo Cliente', icon: Building2, color: 'bg-blue-600 hover:bg-blue-500 text-white', action: () => navigate('/admin/operacoes/clientes') },
    { label: 'Novo Motorista', icon: Users, color: 'bg-amber-600 hover:bg-amber-500 text-white', action: () => navigate('/admin/operacoes/motoristas') },
    { label: 'Registar Manutenção', icon: Wrench, color: 'bg-red-600 hover:bg-red-500 text-white', action: () => navigate('/admin/operacoes/manutencao') },
    { label: 'Perguntar à IA', icon: Sparkles, color: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white', action: () => { setIsOpen(false); onOpenAI(); } }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expanded Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-2 animate-fadeIn">
          {actions.map((act, idx) => {
            const IconComponent = act.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setIsOpen(false);
                  act.action();
                }}
                className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl transition-all hover:scale-105"
              >
                <span>{act.label}</span>
                <div className={`p-1.5 rounded-lg ${act.color}`}>
                  <IconComponent size={14} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:scale-105 transition-all border border-orange-400/30 group"
        title="Ações Rápidas (FAB)"
      >
        {isOpen ? (
          <X size={24} className="transition-transform group-hover:rotate-90" />
        ) : (
          <Plus size={24} className="transition-transform group-hover:rotate-90" />
        )}
      </button>
    </div>
  );
};
