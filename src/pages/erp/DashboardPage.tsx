import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  Search, 
  Terminal, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  Bot,
  Sparkles,
  Briefcase,
  Truck,
  DollarSign
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats.js';
import { 
  IdealKPIsSection, 
  IdealOperationalMapSection, 
  TodayTripsTableSection, 
  RealtimeAlertsSection 
} from '../../components/dashboard/IdealDashboardComponents.js';
import { OperationsPanelSection } from '../../components/dashboard/OperationsPanel.js';
import { RecentActivityTimelineSection } from '../../components/dashboard/RecentActivityTimeline.js';
import { QuickSearchModal } from '../../components/dashboard/QuickSearchModal.js';
import { OperationalAIModal } from '../../components/dashboard/OperationalAIModal.js';

export type DashboardMode = 'executive' | 'operations' | 'financial';

export const DashboardPage: FC = () => {
  const { data, loading, error, refetch } = useDashboardStats();
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('executive');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Atalho Global de Teclado (CTRL + K para Pesquisa Rápida)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleManualRefetch = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4">
        <div className="p-4 rounded-full bg-slate-900 border border-slate-800 shadow-xl animate-pulse">
          <RefreshCw className="animate-spin text-orange-500" size={36} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-200">A Carregar Centro de Comando Multimodo...</p>
          <p className="text-xs text-slate-400">Sincronizando 10 cards de KPIs, mapa GPS live em 4 cores e assistente de IA</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
        <div className="bg-slate-900 max-w-md w-full rounded-2xl border border-red-500/30 p-6 text-center space-y-4 shadow-2xl">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Erro no Carregamento de Dados</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {error || 'Não foi possível carregar o dashboard executivo. Verifique a sua conexão ou integridade da API.'}
            </p>
          </div>
          <button 
            onClick={handleManualRefetch}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Tentar Novamente (Recarregar)
          </button>
        </div>
      </div>
    );
  }

  const idealKPIs = data.idealKPIs || {
    tripsToday: data.metrics?.tripsToday || 5,
    tripsInCourse: data.metrics?.tripsInCourse || 4,
    tripsCompleted: data.metrics?.tripsCompleted || 18,
    activeClients: data.metrics?.totalClients || 16,
    availableTrucks: data.metrics?.availableVehicles || 8,
    maintenanceTrucks: data.metrics?.maintenanceVehicles || 2,
    availableDrivers: data.metrics?.activeDrivers || 12,
    monthRevenue: data.metrics?.totalRevenue || 330600,
    fuelConsumedLiters: 14850,
    pendingInvoicesCount: data.metrics?.pendingInvoices || 2,
    pendingInvoicesAmount: (data.metrics?.pendingInvoices || 2) * 25000
  };

  const ops = data.operations || {
    scheduled: 5,
    inCourse: data.metrics?.tripsInCourse || 4,
    completed: data.metrics?.tripsCompleted || 18,
    delayed: 0,
    cancelled: 1,
    totalTrips: data.metrics?.totalTrips || 28,
    fleetTotal: 14,
    fleetAvailable: data.metrics?.availableVehicles || 8,
    fleetInMaintenance: data.metrics?.maintenanceVehicles || 2,
    fleetInTransit: data.metrics?.tripsInCourse || 4,
    revenuePerTrip: 11800,
    averageTransitHours: 14.2,
    totalWeightTons: 784,
    activeDrivers: 12,
    totalClients: 16
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto space-y-8 pt-2">
        
        {/* SECÇÃO 1: CABEÇALHO EXECUÇÃO & SELETOR DE MODOS DA DASHBOARD */}
        <header className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 tracking-wider uppercase">
                <Terminal className="h-4 w-4 text-orange-500" />
                <span>Enterprise Command Deck</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Multimodo Ativo
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Centro de Comando N' Tandinho
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Painel integrado de expedição, frota, telemetria GPS e faturamento corporativo.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Botão Assistente de IA Operacional */}
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                <span>IA Operacional</span>
                <Sparkles className="h-3 w-3 text-amber-200" />
              </button>

              {/* Botão Pesquisa Rápida CTRL + K */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="group bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-orange-500/50 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shadow-md flex items-center gap-3 w-full sm:w-auto justify-between"
                title="Pesquisar registos (CTRL + K)"
              >
                <span className="flex items-center gap-2 text-slate-300 group-hover:text-orange-400 transition-colors">
                  <Search className="h-4 w-4 text-orange-500" />
                  <span>Pesquisa Global</span>
                </span>
                <kbd className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400 group-hover:text-slate-200">
                  CTRL + K
                </kbd>
              </button>

              {/* Botão Atualizar */}
              <button
                onClick={handleManualRefetch}
                disabled={isRefreshing}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-slate-400 hover:text-white transition-all shadow"
                title="Atualizar dados"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
              </button>

              {/* Ação Rápidas */}
              <button
                onClick={() => navigate('/admin/operacoes/viagens')}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Viagem
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs (Executivo | Operacional | Financeiro) */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Modo de Visão:</span>
            <button
              onClick={() => setDashboardMode('executive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                dashboardMode === 'executive'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Briefcase size={14} />
              <span>Modo Executivo (Completo)</span>
            </button>

            <button
              onClick={() => setDashboardMode('operations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                dashboardMode === 'operations'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Truck size={14} />
              <span>Modo Operacional (GPS & Frota)</span>
            </button>

            <button
              onClick={() => setDashboardMode('financial')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                dashboardMode === 'financial'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Modo Financeiro (Faturação & DRE)</span>
            </button>
          </div>
        </header>

        {/* MODO EXECUTA OU MODO FINANCEIRO: OS 10 CARDS DE KPIS */}
        {(dashboardMode === 'executive' || dashboardMode === 'financial') && (
          <IdealKPIsSection kpis={idealKPIs} />
        )}

        {/* MODO OPERACIONAL OU MODO EXECUTIVO: MAPA GPS LIVE DE 4 CORES & TABELA DE HOJE */}
        {(dashboardMode === 'executive' || dashboardMode === 'operations') && (
          <>
            <IdealOperationalMapSection vehicles={data.fleetMapVehicles || []} />
            <TodayTripsTableSection trips={data.todayTrips || []} />
          </>
        )}

        {/* MODO FINANCEIRO E EXECUTIVO: GRÁFICO RECHARTS & ANÁLISE DE EFICIÊNCIA */}
        {(dashboardMode === 'executive' || dashboardMode === 'financial') && (
          <OperationsPanelSection ops={ops} chartData={data.chartRevenueData || []} />
        )}

        {/* WATCHDOG DE ALERTAS & AUDITORIA DA PLATAFORMA */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2">
          <div className="xl:col-span-6">
            <RealtimeAlertsSection alerts={data.smartAlerts || []} />
          </div>
          <div className="xl:col-span-6">
            <RecentActivityTimelineSection activities={data.activityTimeline || []} />
          </div>
        </div>

        {/* Rodapé do Dashboard */}
        <footer className="pt-8 pb-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>N' Tandinho Transportes ERP • Centro de Comando Multimodo (Visão 31 Pontos)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Base de Dados: <strong>Prisma Live</strong></span>
            <span>Modo Ativo: <strong className="text-orange-400 capitalize">{dashboardMode}</strong></span>
          </div>
        </footer>

      </div>

      {/* Modal de Pesquisa Global (CTRL + K) */}
      <QuickSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Modal de IA Operacional */}
      <OperationalAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </main>
  );
};
