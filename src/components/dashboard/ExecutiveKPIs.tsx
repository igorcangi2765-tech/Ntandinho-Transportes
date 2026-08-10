import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Truck, 
  FileText, 
  ArrowUpRight, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { ExecutiveKPIs, RevenueChartData } from '../../types/dashboard.types';

interface ExecutiveKPIsProps {
  kpis: ExecutiveKPIs;
  chartData: RevenueChartData[];
}

export const ExecutiveKPIsSection: FC<ExecutiveKPIsProps> = ({ kpis, chartData }) => {
  const navigate = useNavigate();

  const formatMZN = (val: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(val || 0);
  };

  // Prepare mini sparklines from chartData
  const revenueSparkline = chartData?.map(item => ({ val: item.receita })) || [];
  const profitSparkline = chartData?.map(item => ({ val: item.lucro || (item.receita - item.despesas) })) || [];
  const tripSparkline = chartData?.map(item => ({ val: item.viagens || 10 })) || [];

  return (
    <section aria-label="KPIs Executivos de Command Deck" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Visão Geral Executiva
          </h2>
          <p className="text-xs text-slate-400">Indicadores financeiros e operacionais em tempo real da N' Tandinho Transportes</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Dados Sincronizados (Base de Dados Live)
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Faturação Hoje */}
        <div 
          onClick={() => navigate('/erp/payments')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-orange-500/40 transition-all duration-200 shadow-lg hover:shadow-orange-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Faturação Hoje</span>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {formatMZN(kpis.revenueToday)}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className={`font-semibold px-2 py-0.5 rounded ${kpis.revenueTodayChange.startsWith('-') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {kpis.revenueTodayChange}% vs Ontem
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-orange-400 transition-colors">
                Ver Entradas <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSparkline}>
                <Area type="monotone" dataKey="val" stroke="#f97316" fill="#f97316" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Faturação Este Mês */}
        <div 
          onClick={() => navigate('/erp/invoices')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all duration-200 shadow-lg hover:shadow-blue-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Faturação Mês Atual</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {formatMZN(kpis.revenueMonth)}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {kpis.revenueMonthChange}% vs Mês Ant.
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-blue-400 transition-colors">
                Ver Faturas <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSparkline}>
                <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Lucro Líquido e Margem */}
        <div 
          onClick={() => navigate('/erp/reports')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Lucro Líquido Atual</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <PieChart className="h-4 w-4" />
              </div>
            </div>
            <div className={`text-2xl lg:text-3xl font-bold tracking-tight ${kpis.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatMZN(kpis.netProfit)}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Margem {kpis.profitMargin}%
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-emerald-300 transition-colors">
                Relatórios <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitSparkline}>
                <Area type="monotone" dataKey="val" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Fluxo de Caixa */}
        <div 
          onClick={() => navigate('/erp/reports')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-lg hover:shadow-cyan-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Fluxo de Caixa Operacional</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {formatMZN(kpis.cashFlow)}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Liquidez Mês Atual
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-cyan-400 transition-colors">
                Análise Contabilística <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-800 pt-3 flex justify-between items-center text-xs text-slate-400">
            <span>Receitas: <strong className="text-slate-200">{formatMZN(kpis.totalRevenue)}</strong></span>
            <span>Despesas: <strong className="text-red-400/80">{formatMZN(kpis.totalExpenses)}</strong></span>
          </div>
        </div>

        {/* Card 5: Viagens em Curso */}
        <div 
          onClick={() => navigate('/erp/trips')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-orange-500/40 transition-all duration-200 shadow-lg hover:shadow-orange-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Viagens Em Curso</span>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                <Truck className="h-4 w-4 animate-bounce" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">{kpis.tripsInCourse}</span>
              <span className="text-xs font-medium text-slate-400">viaturas ativas</span>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                Monitorização GPS
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-orange-400 transition-colors">
                Ver no Mapa <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripSparkline}>
                <Area type="monotone" dataKey="val" stroke="#f97316" fill="#f97316" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 6: Faturas Pendentes */}
        <div 
          onClick={() => navigate('/erp/invoices')}
          className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200 shadow-lg hover:shadow-amber-500/5 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Cobrança Pendente</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {formatMZN(kpis.pendingInvoicesAmount)}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${kpis.pendingInvoicesCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {kpis.pendingInvoicesCount > 0 && <AlertCircle className="h-3 w-3" />}
                {kpis.pendingInvoicesCount} faturas aguardar
              </span>
              <span className="ml-2 text-slate-400 text-[11px] flex items-center group-hover:text-amber-400 transition-colors">
                Gerir Cobranças <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-800 pt-3 flex justify-between items-center text-xs text-slate-400">
            <span>Status de Liquidação:</span>
            <strong className={kpis.pendingInvoicesCount > 5 ? 'text-amber-400' : 'text-emerald-400'}>
              {kpis.pendingInvoicesCount > 5 ? 'Ação Necessária' : 'Controlado'}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
};
