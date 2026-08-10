import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  Layers, 
  Users, 
  Package, 
  ArrowRight,
  Navigation
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { OperationsMetrics, RevenueChartData } from '../../types/dashboard.types';

interface OperationsPanelProps {
  ops: OperationsMetrics;
  chartData: RevenueChartData[];
}

export const OperationsPanelSection: FC<OperationsPanelProps> = ({ ops, chartData }) => {
  const navigate = useNavigate();

  const formatMZN = (val: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(val || 0);
  };

  const statusList = [
    { label: 'Em Curso (Ativas)', count: ops.inCourse, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Truck, link: '/erp/trips?status=Em%20Curso' },
    { label: 'Agendadas Pátio', count: ops.scheduled, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, link: '/erp/trips?status=Agendada' },
    { label: 'Concluídas Mês', count: ops.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, link: '/erp/trips?status=Finalizada' },
    { label: 'Em Manutencão', count: ops.fleetInMaintenance, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Wrench, link: '/erp/maintenance' }
  ];

  return (
    <section aria-label="Operações e Eficiência Logística" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500" />
            Operações & Eficiência da Frota
          </h2>
          <p className="text-xs text-slate-400">Controlo instantâneo das viagens em curso, status mecânico e produtividade</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/erp/trips')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1"
          >
            Gestão de Viagens <ArrowRight className="h-3 w-3 text-slate-400" />
          </button>
          <button 
            onClick={() => navigate('/erp/vehicles')}
            className="text-xs bg-orange-600 hover:bg-orange-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-orange-500/20"
          >
            Frota ({ops.fleetTotal}) <Truck className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bloco Operacional da Frota (7 colunas) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-orange-400" />
              Estado Instantâneo de Operações e Frota
            </h3>

            {/* Grada de 4 Status Principais */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statusList.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div 
                    key={i}
                    onClick={() => navigate(st.link)}
                    className={`p-4 rounded-xl border ${st.border} ${st.bg} hover:brightness-110 transition-all cursor-pointer flex flex-col justify-between space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`p-1.5 rounded-lg bg-slate-900/60 ${st.color}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={`text-2xl font-bold ${st.color}`}>{st.count}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-300 leading-tight">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo de Disponibilidade de Viaturas */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Disponibilidade Mecânica da Frota ({ops.fleetAvailable} de {ops.fleetTotal} operacionais)</span>
              <span className="text-emerald-400 font-bold">
                {ops.fleetTotal > 0 ? Math.round((ops.fleetAvailable / ops.fleetTotal) * 100) : 100}% Prontas a Circular
              </span>
            </div>
            
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${ops.fleetTotal > 0 ? (ops.fleetAvailable / ops.fleetTotal) * 100 : 100}%` }} 
                className="bg-emerald-500 h-full transition-all duration-500" 
                title="Viaturas Disponíveis"
              />
              <div 
                style={{ width: `${ops.fleetTotal > 0 ? (ops.fleetInTransit / ops.fleetTotal) * 100 : 0}%` }} 
                className="bg-blue-500 h-full transition-all duration-500" 
                title="Viaturas em Trânsito"
              />
              <div 
                style={{ width: `${ops.fleetTotal > 0 ? (ops.fleetInMaintenance / ops.fleetTotal) * 100 : 0}%` }} 
                className="bg-red-500 h-full transition-all duration-500" 
                title="Viaturas em Oficina"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Disponíveis: <strong className="text-slate-200">{ops.fleetAvailable}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Em Trânsito: <strong className="text-slate-200">{ops.fleetInTransit}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>Oficina: <strong className="text-slate-200">{ops.fleetInMaintenance}</strong></span>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos Operacionais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <button 
              onClick={() => navigate('/erp/drivers')} 
              className="bg-slate-800/60 hover:bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-400" />
                Motoristas Ativos
              </span>
              <strong className="text-white bg-slate-900 px-2 py-0.5 rounded">{ops.activeDrivers}</strong>
            </button>

            <button 
              onClick={() => navigate('/erp/clients')} 
              className="bg-slate-800/60 hover:bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                Carteira Clientes
              </span>
              <strong className="text-white bg-slate-900 px-2 py-0.5 rounded">{ops.totalClients}</strong>
            </button>

            <button 
              onClick={() => navigate('/erp/trips')} 
              className="col-span-2 sm:col-span-1 bg-slate-800/60 hover:bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-400" />
                Volume Carga
              </span>
              <strong className="text-white bg-slate-900 px-2 py-0.5 rounded">{ops.totalWeightTons} Ton</strong>
            </button>
          </div>
        </div>

        {/* Bloco Eficiência Logística & Rentabilidade (5 colunas) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-blue-400" />
                Evolução Mensal de Desempenho
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">2026</span>
            </div>

            {/* Gráfico de Barras Minimalista (Receita vs Despesas) */}
            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: number) => [formatMZN(val), '']}
                  />
                  <Bar dataKey="receita" name="Receitas" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === (chartData.length - 1) ? '#f97316' : '#3b82f6'} />
                    ))}
                  </Bar>
                  <Bar dataKey="despesas" name="Despesas" fill="#64748b" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Indicadores de Rentabilidade Logística */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Receita Média por Viagem</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400 block">{formatMZN(ops.revenuePerTrip)}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Eficiência financeira por frete</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Tempo Médio em Trânsito</span>
              <span className="text-lg sm:text-xl font-bold text-orange-400 block">{ops.averageTransitHours} Horas</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Rotas Nampula / Nacala / Beira</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
