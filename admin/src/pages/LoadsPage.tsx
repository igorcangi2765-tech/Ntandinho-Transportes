import React, { useState } from 'react';
import { PackageSearch, Plus, MapPin, Truck, FileText, Navigation, Eye, UserCheck, PlayCircle } from 'lucide-react';
import { PageHeader } from '../shared/layouts/PageHeader';
import { FilamentTable, FilamentColumn, FilamentFilter } from '../shared/components/ui/FilamentTable';
import { SlideOverDrawer } from '../shared/components/ui/SlideOverDrawer';
import { RowActionsDropdown } from '../shared/components/ui/RowActionsDropdown';
import { GuiaTransporteModal } from '../components/fleet/GuiaTransporteModal';
import { GpsTrackingModal } from '../components/fleet/GpsTrackingModal';
import { NewLoadModal } from '../components/fleet/NewLoadModal';
import { LoadItem, useErpStore } from '../shared/stores/useErpStore';
import { useNotificationStore } from '../shared/stores/useNotificationStore';

export const LoadsPage: React.FC = () => {
  const { loads, advanceLoadStatus } = useErpStore();
  const { addToast } = useNotificationStore();

  const [selectedGuiaLoad, setSelectedGuiaLoad] = useState<LoadItem | null>(null);
  const [selectedGpsLoad, setSelectedGpsLoad] = useState<LoadItem | null>(null);
  const [drawerLoad, setDrawerLoad] = useState<LoadItem | null>(null);
  const [showNewLoadModal, setShowNewLoadModal] = useState(false);

  const handleExportCsv = () => {
    addToast('Exportar Cargas', 'Lista de ordens de carga exportada com sucesso (CSV)!', 'success');
  };

  // Hybrid 2-Line Grouped Columns
  const columns: FilamentColumn<LoadItem>[] = [
    {
      key: 'id',
      header: 'Guia & Cliente',
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-brand-orange text-xs flex items-center gap-1.5">
            <FileText size={13} className="text-slate-500 shrink-0" />
            {item.id}
          </span>
          <span className="font-bold text-white text-xs block truncate">{item.client}</span>
        </div>
      ),
    },
    {
      key: 'origin',
      header: 'Rota & Mercadoria',
      render: (item) => (
        <div className="space-y-0.5">
          <div className="text-xs flex items-center gap-1">
            <span className="text-slate-200 font-semibold">{item.origin}</span>
            <span className="text-slate-500">→</span>
            <span className="text-emerald-400 font-semibold">{item.destination}</span>
          </div>
          <span className="text-slate-400 text-[11px] block truncate max-w-[220px]">{item.cargo}</span>
        </div>
      ),
    },
    {
      key: 'truck',
      header: 'Camião & Motorista',
      render: (item) => (
        <div className="space-y-0.5 font-mono text-xs">
          <span className="text-white font-bold flex items-center gap-1">
            <Truck size={12} className="text-brand-orange shrink-0" /> {item.truck}
          </span>
          <span className="text-slate-400 font-sans text-[11px] block">{item.driver}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado & Previsão',
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
              item.status === 'EM_TRANSITO'
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                : item.status === 'CARREGAMENTO'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : item.status === 'ALFANDEGA'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
            <span>{item.statusLabel}</span>
          </span>
          <span className="font-mono text-slate-400 text-[11px] block">ETA: {item.eta}</span>
        </div>
      ),
    },
  ];

  const filters: FilamentFilter[] = [
    {
      key: 'status',
      label: 'Filtrar Estado',
      options: [
        { label: 'Em Trânsito', value: 'EM_TRANSITO' },
        { label: 'Carregamento', value: 'CARREGAMENTO' },
        { label: 'Alfândega SADC', value: 'ALFANDEGA' },
        { label: 'Concluído', value: 'CONCLUIDO' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Operações & Ordens de Carga"
        subtitle="Monitorização de transporte de mercadorias, emissão de Guias oficiais e rastreio GPS SADC."
        icon={PackageSearch}
        actions={
          <button
            onClick={() => setShowNewLoadModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={16} />
            <span>Emitir Nova Ordem de Carga</span>
          </button>
        }
      />

      {/* Enterprise Filament Hybrid Table */}
      <FilamentTable
        title="Ordens de Carga & Transportes Ativos"
        subtitle="Informação organizada em grupos operacionais de 2 linhas."
        columns={columns}
        data={loads}
        searchPlaceholder="Pesquisar por cliente, camião, guia..."
        searchFields={['id', 'client', 'truck', 'driver', 'origin', 'destination', 'cargo']}
        filters={filters}
        onExportCsv={handleExportCsv}
        actions={(load) => (
          <RowActionsDropdown
            items={[
              ...(load.status !== 'CONCLUIDO'
                ? [
                    {
                      label: 'Avançar Estado Operacional',
                      icon: PlayCircle,
                      variant: 'primary' as const,
                      onClick: () => advanceLoadStatus(load.id),
                    },
                  ]
                : []),
              {
                label: 'Guia de Transporte PDF',
                icon: FileText,
                onClick: () => setSelectedGuiaLoad(load),
              },
              {
                label: 'Rastreio GPS em Tempo Real',
                icon: Navigation,
                onClick: () => setSelectedGpsLoad(load),
              },
              {
                label: 'Ver Ficha Completa (Drawer)',
                icon: Eye,
                onClick: () => setDrawerLoad(load),
              },
            ]}
          />
        )}
      />

      {/* Slide-Over Detail Drawer */}
      <SlideOverDrawer
        isOpen={Boolean(drawerLoad)}
        onClose={() => setDrawerLoad(null)}
        title={`Detecção de Carga: ${drawerLoad?.id}`}
        subtitle="Ficha operacional completa da ordem de transporte"
        icon={PackageSearch}
      >
        {drawerLoad && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cliente Expedidor</span>
              <h3 className="text-base font-bold text-white">{drawerLoad.client}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Origem do Carregamento</span>
                <span className="font-semibold text-white mt-1 block flex items-center gap-1">
                  <MapPin size={12} className="text-brand-orange" /> {drawerLoad.origin}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Local de Descarregamento</span>
                <span className="font-semibold text-emerald-400 mt-1 block flex items-center gap-1">
                  <MapPin size={12} /> {drawerLoad.destination}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Detalhes da Mercadoria</span>
              <p className="font-semibold text-white">{drawerLoad.cargo}</p>
              <p className="text-slate-400">Especificação: Contentor 40ft Paletizado (32 Toneladas)</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Alocação de Camião & Motorista</span>
              <p className="font-mono font-bold text-brand-orange flex items-center gap-1.5">
                <Truck size={14} /> {drawerLoad.truck}
              </p>
              <p className="text-white flex items-center gap-1.5">
                <UserCheck size={14} className="text-slate-400" /> {drawerLoad.driver}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedGuiaLoad(drawerLoad);
                  setDrawerLoad(null);
                }}
                className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow cursor-pointer text-center"
              >
                Abrir Guia de Transporte PDF
              </button>
              <button
                onClick={() => {
                  setSelectedGpsLoad(drawerLoad);
                  setDrawerLoad(null);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer text-center"
              >
                Seguir Rastreio GPS
              </button>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Modals */}
      {selectedGuiaLoad && (
        <GuiaTransporteModal load={selectedGuiaLoad} onClose={() => setSelectedGuiaLoad(null)} />
      )}

      {selectedGpsLoad && (
        <GpsTrackingModal load={selectedGpsLoad} onClose={() => setSelectedGpsLoad(null)} />
      )}

      {showNewLoadModal && (
        <NewLoadModal onClose={() => setShowNewLoadModal(false)} onSuccess={() => setShowNewLoadModal(false)} />
      )}
    </div>
  );
};
