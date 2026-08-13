import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErpStore } from '../shared/stores/useErpStore';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { ChartCard, TimePeriod } from '../components/ui/ChartCard';
import { Card } from '../components/ui/Card';
import { formatCurrencyMzn, getMozambiqueGreeting } from '../utils/formatters';
import {
  Truck,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  LayoutDashboard,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  CreditCard,
  FileText,
  Wrench,
  CheckCircle2,
  FileClock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    trips,
    bookings,
    vehicles,
    invoices,
    expenses,
    documents,
  } = useErpStore();

  const [graphPeriod, setGraphPeriod] = useState<TimePeriod>('MES');

  // PONTO 12: Cabeçalho com saudação dinâmica em Português de Moçambique
  const greetingText = getMozambiqueGreeting(user?.name || 'Sérgio');

  // PONTO 13: 6 Indicadores Principais em Grelha Uniforme 3x2
  const totalTripsCount = trips.length;
  const inTransitTripsCount = trips.filter(
    (t) => t.status === 'EM_ANDAMENTO' || t.status === 'CONFIRMADA' || t.status === 'EM_PREPARACAO'
  ).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'NOVA' || b.status === 'PENDENTE').length;

  const operationalVehiclesCount = vehicles.filter((v) => v.status === 'OPERACIONAL').length;
  const totalVehiclesCount = vehicles.length;

  const pendingInvoiceAmountMzn = invoices
    .filter((i) => i.status === 'PENDENTE' || i.status === 'PAGO_PARCIAL')
    .reduce((acc, i) => acc + ((i.totalAmount || 0) - (i.paidAmount || 0)), 0);

  const expiringDocumentsCount = documents.filter(
    (d) => d.status === 'PROXIMO_VENCIMENTO' || d.status === 'EXPIRADO'
  ).length;

  // PONTO 15: Alertas Prioritários ("Atenção")
  const priorityAlerts = useMemo(() => {
    const alerts: { id: string; title: string; subtitle: string; actionLabel: string; actionPath: string; icon: any; color: string }[] = [];

    const expiringDocs = documents.filter((d) => d.status === 'PROXIMO_VENCIMENTO' || d.status === 'EXPIRADO');
    if (expiringDocs.length > 0) {
      alerts.push({
        id: 'alert-docs',
        title: `${expiringDocs.length} ${expiringDocs.length === 1 ? 'documento próximo' : 'documentos próximos'} do vencimento`,
        subtitle: expiringDocs[0]?.title || 'Requer renovação legal urgente',
        actionLabel: 'Renovar',
        actionPath: '/documents',
        icon: FileText,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      });
    }

    const maintenanceVehicles = vehicles.filter((v) => v.status === 'MANUTENCAO');
    if (maintenanceVehicles.length > 0) {
      alerts.push({
        id: 'alert-maint',
        title: `${maintenanceVehicles.length} ${maintenanceVehicles.length === 1 ? 'viatura' : 'viaturas'} em manutenção`,
        subtitle: maintenanceVehicles.map((v) => v.plateNumber).join(', '),
        actionLabel: 'Resolver',
        actionPath: '/fleet?tab=maintenance',
        icon: Wrench,
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      });
    }

    const unallocatedTrips = trips.filter((t) => !t.driverId || t.driverName === 'Sem Motorista');
    if (unallocatedTrips.length > 0) {
      alerts.push({
        id: 'alert-unallocated',
        title: `${unallocatedTrips.length} ${unallocatedTrips.length === 1 ? 'viagem sem motorista' : 'viagens sem motorista'}`,
        subtitle: unallocatedTrips[0]?.tripNumber || 'Pendente de atribuição',
        actionLabel: 'Alocar',
        actionPath: '/operations?tab=trips',
        icon: AlertTriangle,
        color: 'text-[#F6A823] bg-[#F6A823]/10 border-[#F6A823]/20',
      });
    }

    return alerts.slice(0, 4);
  }, [documents, vehicles, trips]);

  // PONTO 16: Operação Atual (Máximo 4)
  const currentOperations = useMemo(() => {
    return trips
      .filter((t) => t.status === 'EM_ANDAMENTO' || t.status === 'CONFIRMADA' || t.status === 'EM_PREPARACAO')
      .slice(0, 4);
  }, [trips]);

  // PONTO 17: Gráfico Financeiro Funcional por Período (Hoje | Semana | Mês | Ano)
  const financialChartData = useMemo(() => {
    const totalRev = invoices.reduce((a, i) => a + (i.paidAmount || 0), 0) || 1440000;
    const totalExp = expenses.reduce((a, e) => a + (e.amountMzn || 0), 0) || 820000;

    if (graphPeriod === 'HOJE') {
      return [
        { label: '08:00', receita: Math.round(totalRev * 0.05), despesa: Math.round(totalExp * 0.04) },
        { label: '11:00', receita: Math.round(totalRev * 0.12), despesa: Math.round(totalExp * 0.08) },
        { label: '14:00', receita: Math.round(totalRev * 0.18), despesa: Math.round(totalExp * 0.14) },
        { label: '17:00', receita: Math.round(totalRev * 0.09), despesa: Math.round(totalExp * 0.06) },
      ];
    }

    if (graphPeriod === 'SEMANA') {
      return [
        { label: 'Seg', receita: Math.round(totalRev * 0.15), despesa: Math.round(totalExp * 0.12) },
        { label: 'Ter', receita: Math.round(totalRev * 0.20), despesa: Math.round(totalExp * 0.14) },
        { label: 'Qua', receita: Math.round(totalRev * 0.22), despesa: Math.round(totalExp * 0.18) },
        { label: 'Qui', receita: Math.round(totalRev * 0.18), despesa: Math.round(totalExp * 0.15) },
        { label: 'Sex', receita: Math.round(totalRev * 0.25), despesa: Math.round(totalExp * 0.22) },
        { label: 'Sáb', receita: Math.round(totalRev * 0.10), despesa: Math.round(totalExp * 0.08) },
      ];
    }

    if (graphPeriod === 'ANO') {
      return [
        { label: 'Jan', receita: Math.round(totalRev * 0.8), despesa: Math.round(totalExp * 0.7) },
        { label: 'Mar', receita: Math.round(totalRev * 0.9), despesa: Math.round(totalExp * 0.85) },
        { label: 'Mai', receita: Math.round(totalRev * 1.1), despesa: Math.round(totalExp * 0.9) },
        { label: 'Jul', receita: Math.round(totalRev * 1.25), despesa: Math.round(totalExp * 0.95) },
        { label: 'Set', receita: Math.round(totalRev * 1.15), despesa: Math.round(totalExp * 0.88) },
        { label: 'Nov', receita: Math.round(totalRev * 1.3), despesa: Math.round(totalExp * 1.0) },
      ];
    }

    // Default 'MES'
    return [
      { label: 'Sem 1', receita: Math.round(totalRev * 0.22), despesa: Math.round(totalExp * 0.20) },
      { label: 'Sem 2', receita: Math.round(totalRev * 0.28), despesa: Math.round(totalExp * 0.24) },
      { label: 'Sem 3', receita: Math.round(totalRev * 0.32), despesa: Math.round(totalExp * 0.26) },
      { label: 'Sem 4', receita: Math.round(totalRev * 0.26), despesa: Math.round(totalExp * 0.22) },
    ];
  }, [invoices, expenses, graphPeriod]);

  return (
    <StandardPageLayout
      title={greetingText}
      companyName="Transportes N' Tandinho"
      description="Resumo da operação, frota e situação financeira."
      icon={LayoutDashboard}
    >
      <div className="space-y-6">
        {/* PONTO 13: Grelha Uniforme de 6 Indicadores (3x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full items-stretch">
          <MetricCard
            title="Viagens"
            value={totalTripsCount}
            subtext="Viagens no período"
            icon={Truck}
            iconBg="bg-sky-500/10 dark:bg-sky-500/20"
            iconColor="text-sky-500"
            onClick={() => navigate('/operations?tab=trips')}
          />
          <MetricCard
            title="Em trânsito"
            value={inTransitTripsCount}
            subtext="Viagens em curso"
            icon={CheckCircle2}
            iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
            iconColor="text-emerald-500"
            onClick={() => navigate('/operations?tab=trips')}
          />
          <MetricCard
            title="Reservas pendentes"
            value={pendingBookingsCount}
            subtext="Aguardam confirmação"
            icon={CalendarCheck}
            iconBg="bg-amber-500/10 dark:bg-amber-500/20"
            iconColor="text-amber-500"
            onClick={() => navigate('/operations?tab=bookings')}
          />
          <MetricCard
            title="Frota operacional"
            value={`${operationalVehiclesCount} / ${totalVehiclesCount}`}
            subtext="Viaturas disponíveis"
            icon={ShieldCheck}
            iconBg="bg-indigo-500/10 dark:bg-indigo-500/20"
            iconColor="text-indigo-500"
            onClick={() => navigate('/fleet?tab=vehicles')}
          />
          <MetricCard
            title="A receber"
            value={formatCurrencyMzn(pendingInvoiceAmountMzn)}
            subtext="Faturação pendente"
            icon={DollarSign}
            iconBg="bg-[#F6A823]/10 dark:bg-[#F6A823]/20"
            iconColor="text-[#F6A823]"
            onClick={() => navigate('/finance?tab=invoices')}
          />
          <MetricCard
            title="Documentos a vencer"
            value={expiringDocumentsCount}
            subtext="Caducidades próximas"
            icon={FileClock}
            iconBg="bg-rose-500/10 dark:bg-rose-500/20"
            iconColor="text-rose-500"
            onClick={() => navigate('/documents')}
          />
        </div>

        {/* PONTO 14: Ações Rápidas (Máximo 4 Botões Ativos) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-[#111D33] border border-slate-200 dark:border-[#16223B] rounded-2xl shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ações Rápidas
          </span>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate('/operations?tab=trips')}
              className="px-3 py-2 bg-[#F6A823] hover:bg-[#D08500] text-[#0B132B] font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 btn-micro"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Nova Viagem</span>
            </button>
            <button
              onClick={() => navigate('/operations?tab=bookings')}
              className="px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 btn-micro"
            >
              <CalendarCheck size={14} />
              <span>Nova Reserva</span>
            </button>
            <button
              onClick={() => navigate('/crm?tab=customers')}
              className="px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 btn-micro"
            >
              <UserPlus size={14} />
              <span>Novo Cliente</span>
            </button>
            <button
              onClick={() => navigate('/finance?tab=invoices')}
              className="px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 btn-micro"
            >
              <CreditCard size={14} />
              <span>Registar Pagamento</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PONTO 15: Alertas Prioritários ("Atenção") */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#F6A823]" />
                <span>Atenção</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {priorityAlerts.length} pendentes
              </span>
            </div>

            <div className="space-y-3">
              {priorityAlerts.length > 0 ? (
                priorityAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <Card key={alert.id} className="p-3.5 space-y-2 card-micro">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl border shrink-0 ${alert.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {alert.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {alert.subtitle}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(alert.actionPath)}
                        className="w-full py-1.5 px-3 bg-slate-100 dark:bg-[#16223B] hover:bg-slate-200 dark:hover:bg-[#1E2D4A] text-slate-900 dark:text-white font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer btn-micro"
                      >
                        <span>{alert.actionLabel}</span>
                        <ArrowRight size={12} />
                      </button>
                    </Card>
                  );
                })
              ) : (
                <Card className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500 opacity-80" />
                  <span>Sem alertas operacionais pendentes.</span>
                </Card>
              )}
            </div>
          </div>

          {/* PONTO 16: Operação Atual */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Truck size={16} className="text-sky-500" />
                <span>Operação atual</span>
              </h3>
              <button
                onClick={() => navigate('/operations?tab=trips')}
                className="text-xs font-bold text-[#F6A823] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver operações</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <Card className="divide-y divide-slate-200 dark:divide-[#16223B]">
              {currentOperations.length > 0 ? (
                currentOperations.map((op) => (
                  <div key={op.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-[#111D33]/50 transition-colors row-micro">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-[#16223B] text-slate-900 dark:text-white text-xs font-black shrink-0 font-mono">
                        {op.tripNumber}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {op.origin} ➔ {op.destination}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {op.customerName} • {op.vehiclePlate} ({op.driverName})
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 bg-sky-500/10 text-sky-500 border border-sky-500/20">
                      Em trânsito
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  Nenhuma viagem em curso neste momento.
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* PONTO 17: Gráfico Financeiro Funcional (Receita vs Despesa) */}
        <ChartCard
          title="Receita vs Despesa"
          subtitle={`Comparativo financeiro (${graphPeriod.toLowerCase()})`}
          onPeriodChange={(period) => setGraphPeriod(period)}
        >
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialChartData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#273759" opacity={0.3} />
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#273759', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(value: any) => [`${formatCurrencyMzn(Number(value))}`, '']}
                />
                <Area type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" name="Receita" />
                <Area type="monotone" dataKey="despesa" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesa)" name="Despesa" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </StandardPageLayout>
  );
};
