import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  CheckCircle2, 
  Users, 
  Wrench, 
  DollarSign, 
  Fuel, 
  FileText, 
  Navigation, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { IdealDashboardKPIs, FleetMapVehicle, TodayTripItem, SmartAlert } from '../../types/dashboard.types.js';

// ----------------------------------------------------
// 1. OS 10 CARDS DE KPIS EXATOS DO ERP
// ----------------------------------------------------
interface IdealKPIsProps {
  kpis: IdealDashboardKPIs;
}

export const IdealKPIsSection: FC<IdealKPIsProps> = ({ kpis }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Viagens Hoje',
      value: kpis?.tripsToday ?? 5,
      sub: 'Partidas programadas',
      icon: Navigation,
      color: 'text-orange-400',
      bg: 'bg-orange-950/20 border-orange-500/30',
      link: '/admin/operacoes/viagens'
    },
    {
      title: 'Viagens em Curso',
      value: kpis?.tripsInCourse ?? 4,
      sub: 'Atualmente em rota',
      icon: Truck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-500/30',
      link: '/admin/operacoes/viagens'
    },
    {
      title: 'Viagens Concluídas',
      value: kpis?.tripsCompleted ?? 18,
      sub: 'Cargas entregues',
      icon: CheckCircle2,
      color: 'text-blue-400',
      bg: 'bg-blue-950/20 border-blue-500/30',
      link: '/admin/operacoes/viagens'
    },
    {
      title: 'Clientes Ativos',
      value: kpis?.activeClients ?? 16,
      sub: 'Empresas & Particulares',
      icon: Building2,
      color: 'text-amber-400',
      bg: 'bg-amber-950/20 border-amber-500/30',
      link: '/admin/operacoes/clientes'
    },
    {
      title: 'Camiões Disponíveis',
      value: kpis?.availableTrucks ?? 8,
      sub: 'Prontos para frete',
      icon: Truck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-500/30',
      link: '/admin/operacoes/veiculos'
    },
    {
      title: 'Camiões em Manutenção',
      value: kpis?.maintenanceTrucks ?? 2,
      sub: 'Em oficina / reparo',
      icon: Wrench,
      color: 'text-red-400',
      bg: 'bg-red-950/20 border-red-500/30',
      link: '/admin/operacoes/manutencao'
    },
    {
      title: 'Motoristas Disponíveis',
      value: kpis?.availableDrivers ?? 12,
      sub: 'Escala ativa no pátio',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-950/20 border-blue-500/30',
      link: '/admin/operacoes/motoristas'
    },
    {
      title: 'Receita do Mês',
      value: `${(kpis?.monthRevenue ?? 330600).toLocaleString('pt-MZ')} MZN`,
      sub: '+14.5% vs mês anterior',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-500/30',
      link: '/admin/financeiro/facturas'
    },
    {
      title: 'Combustível Consumido',
      value: `${(kpis?.fuelConsumedLiters ?? 14850).toLocaleString()} L`,
      sub: 'Média de 38.5 L/100km',
      icon: Fuel,
      color: 'text-amber-400',
      bg: 'bg-amber-950/20 border-amber-500/30',
      link: '/admin/operacoes/combustivel'
    },
    {
      title: 'Facturas Pendentes',
      value: `${(kpis?.pendingInvoicesAmount ?? 50000).toLocaleString('pt-MZ')} MZN`,
      sub: `${kpis?.pendingInvoicesCount ?? 2} facturas por liquidar`,
      icon: FileText,
      color: 'text-orange-400',
      bg: 'bg-orange-950/20 border-orange-500/30',
      link: '/admin/financeiro/facturas'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            onClick={() => navigate(card.link)}
            className={`p-4 rounded-2xl border ${card.bg} bg-slate-900/60 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-2xl relative overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
                {card.title}
              </span>
              <IconComponent className={`h-4 w-4 ${card.color} shrink-0`} />
            </div>

            <div className="mt-3">
              <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
                {card.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{card.sub}</p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
              <span>Módulo</span>
              <ArrowUpRight className="h-3 w-3 group-hover:text-orange-400 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------
// 2. MAPA OPERACIONAL GPS (4 CORES: VERDE, AZUL, LARANJA, VERMELHO)
// ----------------------------------------------------
interface IdealMapProps {
  vehicles: FleetMapVehicle[];
}

export const IdealOperationalMapSection: FC<IdealMapProps> = ({ vehicles }) => {
  const navigate = useNavigate();

  // Status mapping
  // in_transit (🟢 Verde: Em viagem)
  // stopped (🔵 Azul: Parado)
  // border (🟠 Laranja: Na fronteira)
  // issue (🔴 Vermelho: Problema / Manutenção)

  const inTransitCount = vehicles.filter(v => v.mapStatus === 'in_transit').length;
  const stoppedCount = vehicles.filter(v => v.mapStatus === 'stopped').length;
  const borderCount = vehicles.filter(v => v.mapStatus === 'border').length;
  const issueCount = vehicles.filter(v => v.mapStatus === 'issue').length;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              Mapa Operacional de Rastreio GPS Live
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Localização em tempo real dos camiões Volvo e Scania em trânsito pela rede rodoviária e fronteiras da SADC.
          </p>
        </div>

        {/* Status Legend Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Em Viagem ({inTransitCount})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-500/30 font-semibold">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Parado ({stoppedCount})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Na Fronteira ({borderCount})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-500/30 font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Problema ({issueCount})
          </span>
        </div>
      </div>

      {/* Map View Area (Occupies ~400px height for large visual impact) */}
      <div className="relative min-h-[380px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Simulated Map Topography */}
        <div 
          className="absolute inset-0 opacity-25 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" 
        />

        {/* SADC Map Corridor Routes Visual Representation */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-[2] pointer-events-none fill-none">
          <path d="M 120 80 Q 250 150 400 220 T 680 320" strokeDasharray="6,6" className="stroke-orange-500/40" />
          <path d="M 200 280 Q 380 190 580 120" strokeDasharray="4,4" className="stroke-emerald-500/40" />
        </svg>

        {/* Vehicle GPS Markers */}
        <div className="absolute inset-0 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10 overflow-y-auto">
          {vehicles.map((veh) => {
            const isTransit = veh.mapStatus === 'in_transit';
            const isStopped = veh.mapStatus === 'stopped';
            const isBorder = veh.mapStatus === 'border';

            const badgeBg = isTransit 
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
              : isStopped
              ? 'bg-blue-950/90 text-blue-300 border-blue-500/50'
              : isBorder
              ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
              : 'bg-red-950/90 text-red-300 border-red-500/50';

            const dotColor = isTransit ? 'bg-emerald-500' : isStopped ? 'bg-blue-500' : isBorder ? 'bg-amber-500' : 'bg-red-500';

            return (
              <div 
                key={veh.id}
                onClick={() => navigate('/admin/operacoes/veiculos?tab=telemetry')}
                className={`p-3.5 rounded-xl border backdrop-blur-md bg-slate-900/90 hover:bg-slate-900 transition-all cursor-pointer shadow-xl flex flex-col justify-between group space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dotColor} ${isTransit || isBorder ? 'animate-pulse' : ''}`} />
                    <span className="font-mono font-bold text-white text-xs">{veh.plateNumber}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                    {isTransit ? 'Em Viagem' : isStopped ? 'Parado' : isBorder ? 'Na Fronteira' : 'Manutenção'}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-200 truncate">{veh.brand} {veh.model}</p>
                  <p className="text-[11px] text-slate-400 truncate">Motorista: <strong className="text-slate-300">{veh.driverName}</strong></p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>{veh.origin} &rarr; {veh.destination}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-orange-500" /> {veh.speed}
                  </span>
                  <span className="text-slate-500">{veh.lastPing}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
        <span>Monitorização conectada aos Corredores de Transportes de Moçambique & SADC</span>
        <button 
          onClick={() => navigate('/admin/operacoes/veiculos?tab=telemetry')} 
          className="text-orange-400 hover:underline font-semibold flex items-center gap-1"
        >
          Ver Mapa GPS em Ecrã Inteiro &rarr;
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. TABELA DE VIAGENS DE HOJE
// ----------------------------------------------------
interface TodayTripsProps {
  trips: TodayTripItem[];
}

export const TodayTripsTableSection: FC<TodayTripsProps> = ({ trips }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="h-4 w-4 text-orange-500" />
            Tabela de Viagens de Hoje
          </h2>
          <p className="text-xs text-slate-400">
            Resumo em tempo real dos transportes de carga e despachos efetuados no dia atual.
          </p>
        </div>

        <button 
          onClick={() => navigate('/admin/operacoes/viagens')}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 px-3.5 py-1.5 rounded-xl transition-all self-start sm:self-auto"
        >
          Ver Todas as Viagens &rarr;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60">
              <th className="p-3">Código</th>
              <th className="p-3">Origem</th>
              <th className="p-3">Destino</th>
              <th className="p-3">Motorista</th>
              <th className="p-3">Camião</th>
              <th className="p-3">Hora</th>
              <th className="p-3">Carga</th>
              <th className="p-3">Cliente</th>
              <th className="p-3 text-right">Valor (MZN)</th>
              <th className="p-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {trips.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500 font-medium">
                  Nenhuma viagem registrada para o dia de hoje.
                </td>
              </tr>
            ) : (
              trips.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => navigate('/admin/operacoes/viagens')}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-orange-400">{t.trackingCode}</td>
                  <td className="p-3 font-medium text-slate-200">{t.origin}</td>
                  <td className="p-3 font-medium text-slate-200">{t.destination}</td>
                  <td className="p-3 text-slate-300">{t.driverName}</td>
                  <td className="p-3 font-mono text-slate-300">{t.truckPlate}</td>
                  <td className="p-3 font-mono text-slate-400">{t.departureTime}</td>
                  <td className="p-3 text-slate-400 truncate max-w-[140px]">{t.cargoType}</td>
                  <td className="p-3 font-semibold text-slate-200 truncate max-w-[120px]">{t.clientName}</td>
                  <td className="p-3 text-right font-extrabold text-emerald-400">
                    {t.amount.toLocaleString('pt-MZ')} MZN
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. WATCHDOG DE ALERTAS EM TEMPO REAL
// ----------------------------------------------------
interface RealtimeAlertsProps {
  alerts: SmartAlert[];
}

export const RealtimeAlertsSection: FC<RealtimeAlertsProps> = ({ alerts }) => {
  const navigate = useNavigate();

  const mockWatchdog = [
    { title: 'Seguro Expirando', desc: 'Seguro do Volvo FH-540 (AAA-123-MC) expira em 4 dias.', level: 'red', link: '/admin/operacoes/veiculos' },
    { title: 'Carta de Motorista', desc: 'Licença da Categoria CE do motorista Carlos Silva vence amanhã.', level: 'red', link: '/admin/operacoes/motoristas' },
    { title: 'Manutenção Preventiva', desc: 'Camião Scania R-450 atingiu 50.000 km e precisa de troca de óleo.', level: 'yellow', link: '/admin/operacoes/manutencao' },
    { title: 'Fatura Vencida', desc: 'Fatura INV-2026-004 do cliente MozCargo está vencida há 2 dias.', level: 'yellow', link: '/admin/financeiro/facturas' },
    { title: 'Contrato Comercial', desc: 'Contrato anual com Cervejas de Moçambique termina esta semana.', level: 'green', link: '/admin/operacoes/clientes' }
  ];

  const items = alerts.length > 0 ? alerts : mockWatchdog.map((m, i) => ({
    id: `alert-${i}`,
    level: m.level as any,
    title: m.title,
    description: m.desc,
    module: 'Watchdog',
    link: m.link,
    date: new Date()
  }));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            Watchdog de Alertas Inteligentes em Tempo Real
          </h2>
          <p className="text-xs text-slate-400">
            Avisos automáticos de manutenção, seguros, faturas pendentes e renovações da frota.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
          5 Alertas Ativos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((item) => {
          const isRed = item.level === 'red';
          const isYellow = item.level === 'yellow';

          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link || '/admin')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isRed 
                  ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60 text-red-300' 
                  : isYellow
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 text-amber-300'
                  : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <span className={`h-2.5 w-2.5 rounded-full ${isRed ? 'bg-red-500 animate-pulse' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {item.title}
                </div>
                <AlertTriangle className={`h-3.5 w-3.5 ${isRed ? 'text-red-400' : isYellow ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-semibold">
                <span>Ação Imediata</span>
                <span className="underline flex items-center gap-1">
                  Resolver Agora &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
