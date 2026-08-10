import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Wifi, 
  Clock, 
  Search, 
  ArrowUpRight, 
  Gauge,
  Compass
} from 'lucide-react';
import { FleetMapVehicle } from '../../types/dashboard.types';

interface OperationalMapProps {
  vehicles: FleetMapVehicle[];
}

export const OperationalMapSection: FC<OperationalMapProps> = ({ vehicles }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetMapVehicle | null>(vehicles[0] || null);
  const navigate = useNavigate();

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = statusFilter === 'all' 
      || (statusFilter === 'active' && (v.status === 'Em Curso' || v.status === 'Em Viagem'))
      || (statusFilter === 'patio' && v.status === 'Disponivel')
      || (statusFilter === 'maintenance' && (v.status === 'Manutencao' || v.status === 'Manutenção'));
    const matchesSearch = v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <section aria-label="Monitorização Telemetria GPS e Frota" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <Wifi className="h-5 w-5 text-emerald-500 animate-pulse" />
            Telemetria & Monitorização GPS em Tempo Real
          </h2>
          <p className="text-xs text-slate-400">Rastreamento de corredores logísticos Nampula - Nacala - Beira e status de ignição</p>
        </div>

        {/* Filtros da Frota no Mapa */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${statusFilter === 'all' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
          >
            Todas ({vehicles.length})
          </button>
          <button 
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${statusFilter === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500' : 'bg-slate-900 text-blue-400 border-slate-800'}`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" /> Em Trânsito
          </button>
          <button 
            onClick={() => setStatusFilter('patio')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${statusFilter === 'patio' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-900 text-emerald-400 border-slate-800'}`}
          >
            Em Pátio (Disponíveis)
          </button>
          <button 
            onClick={() => setStatusFilter('maintenance')}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${statusFilter === 'maintenance' ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-slate-900 text-red-400 border-slate-800'}`}
          >
            Em Oficina
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Lista de Viaturas Monitorizadas (5 colunas) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between max-h-[500px] overflow-hidden">
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Filtrar por placa, motorista ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin scrollbar-thumb-slate-700">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Nenhuma viatura corresponde à pesquisa atual.
                </div>
              ) : (
                filteredVehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  const isMoving = v.status === 'Em Curso' || v.status === 'Em Viagem';

                  return (
                    <div 
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-2 ${isSelected ? 'bg-slate-800 border-orange-500/80 shadow-md' : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <Truck className={`h-4 w-4 ${isMoving ? 'text-blue-400' : 'text-emerald-400'}`} />
                          {v.plateNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${isMoving ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : v.status === 'Disponivel' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                          {v.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center justify-between">
                        <span className="truncate max-w-[180px] font-medium text-slate-400">
                          {v.driverName}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                          <Gauge className="h-3 w-3 text-orange-400" />
                          {v.speed}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2 text-center">
            <button 
              onClick={() => navigate('/erp/vehicles')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center justify-center gap-1 w-full"
            >
              Abrir Registo Completo da Frota no ERP <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Painel Direito: Radar de Rota e Detalhe de Telemetria (7 colunas) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
          {selectedVehicle ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white tracking-tight">{selectedVehicle.brand} {selectedVehicle.model}</span>
                    <span className="bg-slate-800 text-orange-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-700">
                      {selectedVehicle.plateNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Motorista Atribuído: <strong className="text-slate-200">{selectedVehicle.driverName}</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Ignição GPS</span>
                    <strong className={selectedVehicle.ignition === 'ON' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                      {selectedVehicle.ignition === 'ON' ? '● Ligada (Running)' : '○ Desligado (Off)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Visualizador Operacional de Corredor Rota */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-36 w-36 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute -left-10 -bottom-10 h-36 w-36 bg-orange-500/10 rounded-full blur-2xl" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1 text-blue-400 uppercase">
                      <Compass className="h-4 w-4" /> Corredor Logístico Ativo
                    </span>
                    <span>Ping GPS: {selectedVehicle.lastPing}</span>
                  </div>

                  {/* Linha Rota Simbolica */}
                  <div className="py-4 flex items-center justify-between relative">
                    <div className="flex flex-col items-start z-10">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-white">{selectedVehicle.origin}</span>
                      <span className="text-[10px] text-slate-400">Origem / Carga</span>
                    </div>

                    <div className="flex-1 px-4 flex flex-col items-center justify-center">
                      <div className="w-full border-t-2 border-dashed border-slate-700 relative">
                        {selectedVehicle.ignition === 'ON' ? (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white p-1 rounded-full shadow-lg shadow-orange-500/50 animate-bounce">
                            <Truck className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-700">
                            <Clock className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-orange-400 mt-3">{selectedVehicle.speed}</span>
                      <span className="text-[10px] text-slate-400">Velocidade Atual de Tráfego</span>
                    </div>

                    <div className="flex flex-col items-end z-10">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-white text-right">{selectedVehicle.destination}</span>
                      <span className="text-[10px] text-slate-400 text-right">Destino / Descarga</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores de Telemetria Detalhados */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[11px]">Odômetro (Quilometragem)</span>
                  <strong className="text-white text-sm sm:text-base">{selectedVehicle.currentKm?.toLocaleString('pt-PT') || '142,500'} km</strong>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[11px]">Capacidade de Carga</span>
                  <strong className="text-white text-sm sm:text-base">{selectedVehicle.capacity}</strong>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[11px]">Código Frete / Viagem</span>
                  <strong className="text-blue-400 text-sm sm:text-base">{selectedVehicle.tripCode || 'Sem Frete Ativo'}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Selecione uma viatura à esquerda para visualizar a telemetria em tempo real.
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Wifi className="h-4 w-4" /> Servidor GPS Sincronizado com Próxima Rota
            </span>
            <button 
              onClick={() => navigate(`/erp/vehicles?id=${selectedVehicle?.id}`)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              Aceder Ficha Técnica da Viatura <ArrowUpRight className="h-3.5 w-3.5 text-orange-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
