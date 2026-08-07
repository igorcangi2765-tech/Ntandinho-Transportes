import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Truck,
  Package,
  AlertTriangle,
  MapPin,
  CalendarDays,
  ArrowRight,
  Activity,
  Fuel,
  Wrench,
} from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import { DashboardMetrics } from '../types/dashboard.types';
import { MetricCard } from '../shared/components/ui/cards/MetricCard';
import { useNotificationStore } from '../shared/stores/useNotificationStore';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useNotificationStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-slate-400">A iniciar o Centro de Operações...</span>
        </div>
      </div>
    );
  }

  const rev = metrics?.totalRevenue || 4850000;
  const fleet = metrics?.fleetStatus || { OPERACIONAL: 14, EM_VIAGEM: 8, MANUTENCAO: 2, TOTAL: 24 };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      
      {/* Cabeçalho da Página */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Visão Geral
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Métricas operacionais e financeiras em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/reports')}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-md hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
          >
            Gerar Relatório
          </button>
          <button 
            onClick={() => navigate('/loads')}
            className="px-3 py-1.5 bg-brand-orange text-white text-xs font-semibold rounded-md hover:bg-[#ea580c] transition-colors shadow-sm cursor-pointer"
          >
            Novo Despacho
          </button>
        </div>
      </motion.div>

      {/* BLOCO 1: KPIs Principais (MetricCards Clicáveis) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Faturação Mensal"
          value={`${(rev / 1000).toFixed(1)}k MZN`}
          icon={TrendingUp}
          trend={{ value: 12.5, direction: 'up', label: 'vs mês passado' }}
          delay={0.1}
          onClick={() => navigate('/finance')}
        />
        <MetricCard
          title="Viagens Ativas"
          value={metrics?.activeTrips || 12}
          icon={Activity}
          trend={{ value: 5, direction: 'up', label: 'novos despachos hoje' }}
          delay={0.2}
          onClick={() => navigate('/loads')}
        />
        <MetricCard
          title="Disponibilidade Frota"
          value={`${fleet.OPERACIONAL} / ${fleet.TOTAL}`}
          icon={Truck}
          trend={{ value: 82, direction: 'neutral', label: 'taxa de operacionalidade' }}
          delay={0.3}
          onClick={() => navigate('/fleet')}
        />
        <MetricCard
          title="Cargas Pendentes"
          value={metrics?.pendingQuotations || 5}
          icon={Package}
          trend={{ value: 2, direction: 'down', label: 'cargas atrasadas' }}
          delay={0.4}
          onClick={() => navigate('/crm')}
        />
      </motion.div>

      {/* BLOCO 2: MAPA OPERACIONAL & AÇÕES REQUERIDAS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Mapa Operacional em Tempo Real (Span 8) */}
        <div className="lg:col-span-8 bg-[#0f172a] rounded-xl flex flex-col shadow-sm border border-slate-800/40 overflow-hidden h-[360px] relative group">
          <div className="px-4 py-3 border-b border-slate-800/40 flex items-center justify-between bg-[#0f172a] z-10">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-slate-500" /> Mapa Operacional SADC
            </h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/loads')}
                className="flex items-center gap-1.5 text-xs text-blue-400 font-medium hover:underline cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Em Rota (8) — Ver no mapa completo</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-900/50 relative overflow-hidden">
            {/* Background Map Placeholder */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            
            {/* Markers Clicáveis */}
            <div 
              onClick={() => {
                addToast('Telemetria GPS', 'Veículo ABM-849-MC localizado em trânsito Nampula ➔ Beira', 'info');
                navigate('/fleet');
              }}
              className="absolute top-[30%] left-[25%] group/marker cursor-pointer"
            >
              <div className="w-3.5 h-3.5 bg-blue-400 rounded-full ring-4 ring-blue-400/20 shadow-lg animate-pulse" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 text-[11px] text-white px-2 py-1 rounded shadow-md opacity-0 group-hover/marker:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                ABM-849-MC (Nampula ➔ Beira) — Clique para ver ficha
              </div>
            </div>

            <div 
              onClick={() => {
                addToast('Telemetria GPS', 'Veículo AEK-201-MC em atracagem no Porto da Beira', 'info');
                navigate('/fleet');
              }}
              className="absolute top-[60%] left-[55%] group/marker cursor-pointer"
            >
              <div className="w-3.5 h-3.5 bg-blue-400 rounded-full ring-4 ring-blue-400/20 shadow-lg animate-pulse" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 text-[11px] text-white px-2 py-1 rounded shadow-md opacity-0 group-hover/marker:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                AEK-201-MC (Porto da Beira) — Clique para ver ficha
              </div>
            </div>

            <div 
              onClick={() => {
                addToast('Telemetria GPS', 'Veículo ADZ-990-MC em desalfandegamento na Fronteira Blantyre', 'info');
                navigate('/fleet');
              }}
              className="absolute top-[35%] right-[20%] group/marker cursor-pointer"
            >
              <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full ring-4 ring-emerald-400/20 shadow-lg" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 text-[11px] text-white px-2 py-1 rounded shadow-md opacity-0 group-hover/marker:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                ADZ-990-MC (Fronteira Blantyre) — Clique para ver ficha
              </div>
            </div>
            
          </div>
        </div>

        {/* Ações Requeridas / Alertas Clicáveis (Span 4) */}
        <div className="lg:col-span-4 bg-[#0f172a] rounded-xl flex flex-col shadow-sm border border-slate-800/40 h-[360px]">
          <div className="px-4 py-3 border-b border-slate-800/40 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={14} className="text-slate-500" /> Ações Requeridas
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">
              3 Alertas
            </span>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto custom-scrollbar space-y-1">
            <div 
              onClick={() => {
                addToast('Processando Alerta', 'A redirecionar para a Guia #NT-842...', 'warning');
                navigate('/loads');
              }}
              className="p-2.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-2.5 group/alert border border-transparent hover:border-slate-700/50"
            >
              <div className="mt-0.5 text-rose-400 shrink-0">
                <AlertTriangle size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover/alert:text-brand-orange transition-colors">Carga Retida no Porto</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Guia #NT-842 aguarda desalfandegamento há 4 horas.</p>
              </div>
            </div>

            <div 
              onClick={() => {
                addToast('Manutenção', 'A abrir ficha técnica do veículo ABM-849-MC...', 'info');
                navigate('/fleet');
              }}
              className="p-2.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-2.5 group/alert border border-transparent hover:border-slate-700/50"
            >
              <div className="mt-0.5 text-amber-400 shrink-0">
                <Wrench size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover/alert:text-amber-400 transition-colors">Manutenção Programada</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Camião ABM-849-MC necessita de mudança de óleo (15k).</p>
              </div>
            </div>

            <div 
              onClick={() => {
                addToast('Telemetria', 'A abrir relatório de consumo de combustível...', 'info');
                navigate('/reports');
              }}
              className="p-2.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-2.5 group/alert border border-transparent hover:border-slate-700/50"
            >
              <div className="mt-0.5 text-rose-400 shrink-0">
                <Fuel size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover/alert:text-rose-400 transition-colors">Anomalia de Combustível</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Consumo elevado na Rota Nampula-Malawi.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* BLOCO 3: PARTIDAS DE HOJE & ATIVIDADE RECENTE */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Tabela de Partidas de Hoje (Span 8) */}
        <div className="lg:col-span-8 bg-[#0f172a] rounded-xl flex flex-col shadow-sm border border-slate-800/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800/40 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CalendarDays size={14} className="text-slate-500" /> Partidas & Entregas
            </h3>
            <button 
              onClick={() => navigate('/loads')}
              className="text-[11px] font-semibold text-brand-orange hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              Ver Todas <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[10px] text-slate-500 bg-slate-900/40 border-b border-slate-800/40 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Rota</th>
                  <th className="px-4 py-2.5">Veículo</th>
                  <th className="px-4 py-2.5">Estado</th>
                  <th className="px-4 py-2.5 text-right">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30 font-medium">
                
                <tr 
                  onClick={() => navigate('/loads')}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">Nampula</span>
                      <ArrowRight size={12} className="text-slate-600 group-hover:text-brand-orange transition-colors" />
                      <span className="text-slate-200">Beira</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300 font-mono group-hover:text-brand-orange transition-colors">ABM-849-MC</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-blue-400 text-[10px] font-bold border border-blue-400/20 bg-blue-400/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      EM ROTA
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    Hoje, 14:30
                  </td>
                </tr>

                <tr 
                  onClick={() => navigate('/loads')}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">Nampula</span>
                      <ArrowRight size={12} className="text-slate-600 group-hover:text-brand-orange transition-colors" />
                      <span className="text-slate-200">Blantyre</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300 font-mono group-hover:text-brand-orange transition-colors">ADZ-990-MC</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-amber-400 text-[10px] font-bold border border-amber-400/20 bg-amber-400/5">
                      CARREGAMENTO
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    Hoje, 18:00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Atividade Recente Clicável (Span 4) */}
        <div className="lg:col-span-4 bg-[#0f172a] rounded-xl flex flex-col shadow-sm border border-slate-800/40">
          <div className="px-4 py-3 border-b border-slate-800/40 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-slate-500" /> Atividade Recente
            </h3>
          </div>
          
          <div className="p-4 flex-1">
            <div className="relative border-l border-slate-800/60 ml-2 space-y-5 pb-1">
              
              <div 
                onClick={() => navigate('/finance')}
                className="relative pl-4 group/timeline cursor-pointer"
              >
                <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700 group-hover/timeline:border-emerald-500 transition-colors" />
                <p className="text-xs font-semibold text-slate-200 group-hover/timeline:text-emerald-400 transition-colors">Fatura #INV-209 Liquidada</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Pagamento de Fazendas de Moçambique Lda.</p>
                <span className="text-[10px] text-slate-600 mt-1 block font-mono">Há 10 min</span>
              </div>

              <div 
                onClick={() => navigate('/loads')}
                className="relative pl-4 group/timeline cursor-pointer"
              >
                <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700 group-hover/timeline:border-blue-400 transition-colors" />
                <p className="text-xs font-semibold text-slate-200 group-hover/timeline:text-blue-400 transition-colors">Check-in Motorista</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Carlos Mendes registou chegada (Beira).</p>
                <span className="text-[10px] text-slate-600 mt-1 block font-mono">Há 45 min</span>
              </div>

            </div>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
};
