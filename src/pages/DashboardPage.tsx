import React from 'react';
import { useData } from '../context/DataContext';
import { StatsCard } from '../components/ui/StatsCard';
import { MozambiqueMap } from '../components/dashboard/MozambiqueMap';
import {
  DollarSign,
  PackageCheck,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
  UserCheck,
  Calendar as CalendarIcon,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    orders,
    trips,
    customers,
    vehicles,
    drivers,
    invoices,
    auditLogs,
    setActiveModule
  } = useData();

  // KPIs
  const totalRevenueMzn = invoices
    .filter((i) => i.status === 'PAGA')
    .reduce((acc, i) => acc + i.totalAmountMzn, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'NOVO' || o.status === 'EM_ANALISE').length;
  const inProgressTripsCount = trips.filter((t) => t.status === 'EM_TRANSITO').length;
  const completedTripsCount = trips.filter((t) => t.status === 'CONCLUIDA').length;
  const activeCustomersCount = customers.filter((c) => c.status === 'ATIVO').length;
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'DISPONIVEL').length;
  const availableDriversCount = drivers.filter((d) => d.status === 'DISPONIVEL').length;

  // Chart Data
  const monthlyRevenueData = [
    { month: 'Jan', receita: 4200000, despesas: 2800000 },
    { month: 'Fev', receita: 4800000, despesas: 3100000 },
    { month: 'Mar', receita: 5400000, despesas: 3300000 },
    { month: 'Abr', receita: 6100000, despesas: 3900000 },
    { month: 'Mai', receita: 5900000, despesas: 3700000 },
    { month: 'Jun', receita: 7200000, despesas: 4200000 },
    { month: 'Jul', receita: 8100000, despesas: 4600000 },
    { month: 'Ago', receita: 8450000, despesas: 4900000 }
  ];

  const tripsByStatusData = [
    { name: 'Em Trânsito', value: inProgressTripsCount, color: '#3B82F6' },
    { name: 'Concluídas', value: completedTripsCount, color: '#10B981' },
    { name: 'Agendadas', value: trips.filter((t) => t.status === 'AGENDADA').length, color: '#F5A300' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Painel Geral Operacional
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visão consolidada da operação, frota, viagens e faturação. Clique em qualquer cartão para abrir o módulo.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveModule('viagens')}
            className="stripe-button-secondary text-xs"
          >
            <Truck className="w-4 h-4 text-[#F5A300]" />
            <span>Gerir Expedições</span>
          </button>
          <button
            onClick={() => setActiveModule('pedidos')}
            className="stripe-button-primary text-xs"
          >
            <span>Ver Pedidos Pendentes ({pendingOrdersCount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: 7 KPI Interactive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          title="Receita Mensal (MZN)"
          value={`${(totalRevenueMzn || 8450000).toLocaleString()} MZN`}
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
          badgeText="MZN"
          highlightColor="orange"
          onClick={() => setActiveModule('financeiro')}
        />

        <StatsCard
          title="Pedidos Pendentes"
          value={pendingOrdersCount}
          change={`${pendingOrdersCount} novos`}
          isPositive={false}
          icon={PackageCheck}
          badgeText="Requer Aprovação"
          highlightColor="amber"
          onClick={() => setActiveModule('pedidos')}
        />

        <StatsCard
          title="Viagens em Curso"
          value={inProgressTripsCount}
          change="SADC & Nacional"
          isPositive={true}
          icon={Truck}
          highlightColor="blue"
          onClick={() => setActiveModule('viagens')}
        />

        <StatsCard
          title="Viagens Concluídas"
          value={completedTripsCount}
          change="100% no prazo"
          isPositive={true}
          icon={CheckCircle2}
          highlightColor="emerald"
          onClick={() => setActiveModule('viagens')}
        />

        <StatsCard
          title="Clientes Ativos"
          value={activeCustomersCount}
          change="Grandes Contas"
          isPositive={true}
          icon={Users}
          highlightColor="purple"
          onClick={() => setActiveModule('clientes')}
        />

        <StatsCard
          title="Caminhões Disponíveis"
          value={`${availableVehiclesCount} / ${vehicles.length}`}
          description="Prontos para serviço"
          icon={ShieldCheck}
          highlightColor="emerald"
          onClick={() => setActiveModule('frota')}
        />

        <StatsCard
          title="Motoristas Disponíveis"
          value={`${availableDriversCount} / ${drivers.length}`}
          description="Com licença SADC"
          icon={UserCheck}
          highlightColor="blue"
          onClick={() => setActiveModule('motoristas')}
        />
      </div>

      {/* Row 2: Faturação vs Despesas, Distribuição Operacional, e Mapa de Moçambique */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Faturação vs Despesas Operacionais (Area Chart Card) */}
        <div
          onClick={() => setActiveModule('financeiro')}
          className="stripe-card p-4 sm:p-5 flex flex-col space-y-4 cursor-pointer hover:border-[#F5A300]/50 transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 group-hover:text-[#F5A300] transition-colors">
                <TrendingUp className="w-4 h-4 text-[#F5A300]" />
                Faturação vs Despesas (MZN)
              </h3>
              <p className="text-xs text-slate-400">Evolução financeira acumulada</p>
            </div>
            <span className="text-xs text-[#F5A300] font-semibold bg-[#F5A300]/10 px-2 py-0.5 rounded border border-[#F5A300]/20 flex items-center gap-1">
              <span>2026</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>

          <div className="w-full h-48 sm:h-52 pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A300" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F5A300" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} MZN`, '']}
                />
                <Area type="monotone" dataKey="receita" stroke="#F5A300" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" name="Receita" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição Operacional (Pie/Doughnut Card) */}
        <div
          onClick={() => setActiveModule('viagens')}
          className="stripe-card p-4 sm:p-5 flex flex-col space-y-4 cursor-pointer hover:border-[#F5A300]/50 transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#F5A300] transition-colors">
                Distribuição Operacional
              </h3>
              <p className="text-xs text-slate-400">Estado das viagens ativas na frota</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="w-full h-36 sm:h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripsByStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tripsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            {tripsByStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Componente 3: Mapa Operacional Google Moçambique */}
        <div className="md:col-span-2 lg:col-span-1">
          <MozambiqueMap />
        </div>
      </div>

      {/* Row 3: Calendário Operacional, Audit Log & Viagens Recentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Widget 1: Calendário Operacional (4 viagens para emparelhamento perfeito) */}
        <div
          onClick={() => setActiveModule('viagens')}
          className="stripe-card p-4 sm:p-5 flex flex-col space-y-4 cursor-pointer hover:border-[#F5A300]/50 transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 group-hover:text-[#F5A300] transition-colors">
              <CalendarIcon className="w-4 h-4 text-[#F5A300]" />
              Calendário Operacional
            </h3>
            <span className="text-xs text-slate-400">Agosto 2026</span>
          </div>

          <div className="space-y-2.5">
            {trips.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-[#F5A300]/50 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F5A300]">{t.code}</span>
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-500/20">
                    {t.status}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{t.origin} → {t.destination}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                  <span className="truncate">Motorista: {t.driverName}</span>
                  <span className="shrink-0">{t.startDate.substring(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Registo de Últimas Atividades (Audit Log - 4 registos) */}
        <div
          onClick={() => setActiveModule('utilizadores')}
          className="stripe-card p-4 sm:p-5 flex flex-col space-y-4 cursor-pointer hover:border-[#F5A300]/50 transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 group-hover:text-[#F5A300] transition-colors">
              <Activity className="w-4 h-4 text-[#F5A300]" />
              Últimas Atividades (Audit Log)
            </h3>
            <span className="text-xs text-[#F5A300] font-semibold group-hover:underline">
              Ver Auditoria ➔
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-2 flex items-start justify-between gap-2 text-xs">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h5 className="font-bold text-slate-200 truncate">{log.action}</h5>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{log.details}</p>
                    <span className="text-[10px] text-slate-500 block truncate">Por: {log.userName}</span>
                  </div>
                  <span className="text-[10px] text-[#F5A300] font-mono shrink-0 font-bold bg-[#F5A300]/10 px-1.5 py-0.5 rounded border border-[#F5A300]/20">
                    {log.timestamp && log.timestamp.length > 10 ? log.timestamp.substring(11) : 'Agora'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhuma atividade registada no sistema.
              </div>
            )}
          </div>
        </div>

        {/* Widget 3: Viagens Recentes (4 viagens para emparelhamento perfeito) */}
        <div
          onClick={() => setActiveModule('viagens')}
          className="stripe-card p-4 sm:p-5 flex flex-col space-y-4 md:col-span-2 lg:col-span-1 cursor-pointer hover:border-[#F5A300]/50 transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 group-hover:text-[#F5A300] transition-colors">
              <Clock className="w-4 h-4 text-[#F5A300]" />
              Viagens Recentes
            </h3>
            <span className="text-xs text-[#F5A300] font-semibold group-hover:underline">
              Ver Todas ➔
            </span>
          </div>

          <div className="space-y-2.5">
            {trips.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs hover:bg-slate-800/70 transition-all"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-bold text-[#F5A300] block">{t.code}</span>
                  <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
                    {t.origin} → {t.destination}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    t.status === 'EM_TRANSITO'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : t.status === 'CONCLUIDA'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 truncate max-w-[100px]">{t.driverName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
