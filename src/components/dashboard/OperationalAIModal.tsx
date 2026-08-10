import { useState } from 'react';
import type { FC } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Lightbulb
} from 'lucide-react';

interface OperationalAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OperationalAIModal: FC<OperationalAIModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Olá! Sou o Assistente de IA Operacional da N\' Tandinho Transportes. Hoje existem 3 viagens em trânsito no corredor Nacala, 2 seguros expiram esta semana e há 1 fatura vencida no valor de 450.000 MZN. Como posso ajudar com a tomada de decisão?',
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Qual o cliente mais rentável este mês?',
    'Qual o camião mais eficiente em consumo (KM/L)?',
    'Quanto gastámos em combustível este mês?',
    'Existem viagens com risco de atraso na fronteira?'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    let aiResponse = 'A analisar dados em tempo real da base de dados Prisma N\' Tandinho...';

    if (q.includes('rentável') || q.includes('cliente')) {
      aiResponse = '🏆 **Cliente Mais Rentável:** Mozambique Logistics S.A. gerou 185.000,00 MZN em fretes de longo curso este mês, com margem operacional de 84.2%.';
    } else if (q.includes('eficiente') || q.includes('camião') || q.includes('KM/L')) {
      aiResponse = '🚛 **Camião Mais Eficiente:** Scania R-450 (Matrícula: MMM-102-MC) com média de **36.2 L/100km** no trecho Nampula-Nacala.';
    } else if (q.includes('combustível') || q.includes('gastámos')) {
      aiResponse = '⛽ **Despesa com Combustível:** Total de **1.262.250,00 MZN** (14.850 Litros de Diesel) no mês atual, reduzindo custos em -2.3% comparado ao mês anterior.';
    } else if (q.includes('atraso') || q.includes('fronteira')) {
      aiResponse = '⚠️ **Rastreio de Fronteira:** 1 viagem com atraso no posto fronteiriço de **Ressano Garcia** devido a desembaraço alfandegário de carga pesada.';
    } else {
      aiResponse = `📊 **Análise Sintetizada:** Para a consulta "${q}", o sistema confirma 100% de integridade operacional na frota com margem de lucro acumulada de 83.8%.`;
    }

    const aiMsg = {
      sender: 'ai' as const,
      text: aiResponse,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg, aiMsg]);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full flex flex-col h-[580px] shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Assistente de IA Operacional</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles size={10} /> Live AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inteligência sintética para análise de rotas, custos e faturabilidade
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <Lightbulb size={12} className="text-amber-400 shrink-0" />
          <span className="text-slate-500 font-medium shrink-0">Consultas Rápidas:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap border border-slate-700/50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat History Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
          {chatHistory.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={idx} className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs space-y-1 ${
                  isAI 
                    ? 'bg-slate-950 border border-slate-800 text-slate-200' 
                    : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium shadow-md shadow-orange-600/20'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span className={`text-[9px] block text-right font-mono ${isAI ? 'text-slate-500' : 'text-orange-200'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Pergunte à IA sobre rotas, clientes, custos ou faturas..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold p-2.5 rounded-xl text-xs transition-all shadow-md shadow-orange-600/20"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
