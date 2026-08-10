import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore, ServiceItem, RouteItem } from '../shared/stores/useErpStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Route as RouteIcon, MapPin, Tag, Briefcase, Plus } from 'lucide-react';

export const ServicesAndRoutesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, routes, addService, deleteService, addRoute, deleteRoute } = useErpStore();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'servicos' | 'rotas'>('servicos');

  useEffect(() => {
    if (tabParam === 'routes' || tabParam === 'rotas') setActiveTab('rotas');
    else setActiveTab('servicos');
  }, [tabParam]);

  const handleTabChange = (tab: 'servicos' | 'rotas') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Service Modal State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [srvCode, setSrvCode] = useState('');
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceItem['category']>('Transporte de Mercadorias');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvPriceKm, setSrvPriceKm] = useState(180);

  // Route Modal State
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distanceKm, setDistanceKm] = useState(500);
  const [estHours, setEstHours] = useState(8);
  const [checkpoints, setCheckpoints] = useState('Nenhum');
  const [basePrice, setBasePrice] = useState(90000);

  // Confirm delete modals
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [deleteRouteId, setDeleteRouteId] = useState<string | null>(null);

  const handleCreateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName || !srvCode) return;
    addService({
      code: srvCode,
      name: srvName,
      category: srvCategory,
      description: srvDesc || 'Serviço logístico N\' Tandinho Transportes S.A.',
      pricePerKmMzn: Number(srvPriceKm),
      isActive: true,
    });
    setIsAddServiceOpen(false);
    setSrvCode('');
    setSrvName('');
  };

  const handleCreateRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName || !origin || !destination) return;
    addRoute({
      name: routeName,
      origin,
      destination,
      distanceKm: Number(distanceKm),
      estDurationHours: Number(estHours),
      borderCheckpoints: checkpoints,
      basePriceMzn: Number(basePrice),
    });
    setIsAddRouteOpen(false);
    setRouteName('');
    setOrigin('');
    setDestination('');
  };

  // Columns for Serviços
  const serviceColumns: Column<ServiceItem>[] = [
    {
      key: 'code',
      header: 'Código Serviço',
      accessor: (row) => <span className="font-mono font-extrabold text-brand-orange">{row.code}</span>,
      sortable: true,
    },
    {
      key: 'name',
      header: 'Nome do Serviço Oficial',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>,
      sortable: true,
    },
    {
      key: 'description',
      header: 'Descrição Técnica',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.description}</span>,
    },
    {
      key: 'pricePerKmMzn',
      header: 'Tarifa Base / km',
      accessor: (row) => <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{row.pricePerKmMzn} MZN / km</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'isActive',
      header: 'Estado',
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            row.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          {row.isActive ? 'ATIVO' : 'INATIVO'}
        </span>
      ),
    },
  ];

  // Columns for Rotas SADC
  const highestDistanceKm = routes.length ? Math.max(...routes.map((route) => route.distanceKm)) : 0;
  const averageServicePricePerKm = services.length
    ? Math.round(services.reduce((acc, item) => acc + item.pricePerKmMzn, 0) / services.length)
    : 0;

  const routeColumns: Column<RouteItem>[] = [
    {
      key: 'name',
      header: 'Nome do Corredor SADC',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <MapPin size={14} className="text-brand-orange" /> {row.name}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'trajectory',
      header: 'Origem ➔ Destino',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-semibold">{row.origin} ➔ {row.destination}</span>,
    },
    {
      key: 'distanceKm',
      header: 'Distância (km)',
      accessor: (row) => <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{row.distanceKm.toLocaleString('pt-MZ')} km</span>,
      sortable: true,
    },
    {
      key: 'estDurationHours',
      header: 'Duração Estimada',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">~{row.estDurationHours} horas</span>,
    },
    {
      key: 'borderCheckpoints',
      header: 'Postos de Fronteira',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">{row.borderCheckpoints}</span>,
    },
    {
      key: 'basePriceMzn',
      header: 'Preço Base de Frete',
      accessor: (row) => <span className="font-mono font-black text-slate-900 dark:text-white">{row.basePriceMzn.toLocaleString('pt-MZ')} MZN</span>,
      align: 'right',
    },
  ];

  return (
    <StandardPageLayout
      title="Catálogo de Serviços & Rotas"
      description="Tabela de preços base, tarifas por km e corredores SADC."
      icon={RouteIcon}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('servicos')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'servicos' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Serviços ({services.length})
            </button>
            <button
              onClick={() => handleTabChange('rotas')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'rotas' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Corredores / Rotas ({routes.length})
            </button>
          </div>



          {activeTab === 'servicos' ? (
            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Registar Serviço</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddRouteOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Registar Corredor SADC</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        <>
          <MetricCard
            title="Serviços Ativos"
            value={services.filter((s) => s.isActive).length}
            subtext="Modelos de transporte"
            icon={Briefcase}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Corredores SADC"
            value={routes.length}
            subtext="Rotas nacionais e regionais"
            icon={RouteIcon}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
          />
          <MetricCard
            title="Maior Distância"
            value={`${highestDistanceKm.toLocaleString('pt-MZ')} km`}
            subtext={routes.length > 0 ? routes.find((route) => route.distanceKm === highestDistanceKm)?.name : 'Sem rotas'}
            icon={MapPin}
            iconBg="bg-amber-50"
            iconColor="text-brand-orange"
          />
          <MetricCard
            title="Tarifa Média / km"
            value={`${averageServicePricePerKm.toLocaleString('pt-MZ')} MZN`}
            subtext="Tarifa média ponderada"
            icon={Tag}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </>
      }
    >
      {activeTab === 'servicos' ? (
        <DataTable
          data={services}
          columns={serviceColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar serviço por nome ou código..."
          quickActions={[
            {
              label: 'Eliminar Serviço',
              isDestructive: true,
              onClick: (row) => setDeleteServiceId(row.id),
            },
          ]}
        />
      ) : (
        <DataTable
          data={routes}
          columns={routeColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar corredor por nome ou rota..."
          quickActions={[
            {
              label: 'Eliminar Corredor Rota',
              isDestructive: true,
              onClick: (row) => setDeleteRouteId(row.id),
            },
          ]}
        />
      )}

      {/* MODAL CRIAR SERVIÇO */}
      <Modal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        title="Novo Serviço"
        subtitle="Defina o tipo de frete e a tarifa oficial por quilómetro"
        maxWidth="md"
      >
        <form onSubmit={handleCreateServiceSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Código do Serviço *</label>
              <input
                type="text"
                required
                placeholder="Ex: SRV-FRETE-01"
                value={srvCode}
                onChange={(e) => setSrvCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Categoria</label>
              <select
                value={srvCategory}
                onChange={(e) => setSrvCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                <option value="Transporte de Mercadorias" className="dark:bg-slate-800">Transporte de Mercadorias</option>
                <option value="Aluguer de Camiões" className="dark:bg-slate-800">Aluguer de Camiões</option>
                <option value="Logística Nacional" className="dark:bg-slate-800">Logística Nacional</option>
                <option value="Transporte Internacional SADC" className="dark:bg-slate-800">Transporte Internacional SADC</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Nome Oficial do Serviço *</label>
            <input
              type="text"
              required
              placeholder="Ex: Transporte de Carga Contentorizada 40ft"
              value={srvName}
              onChange={(e) => setSrvName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tarifa por km (MZN / km) *</label>
            <input
              type="number"
              required
              value={srvPriceKm}
              onChange={(e) => setSrvPriceKm(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Descrição Técnica</label>
            <input
              type="text"
              value={srvDesc}
              onChange={(e) => setSrvDesc(e.target.value)}
              placeholder="Especificações..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddServiceOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL CRIAR ROTA */}
      <Modal
        isOpen={isAddRouteOpen}
        onClose={() => setIsAddRouteOpen(false)}
        title="Novo Corredor SADC"
        subtitle="Adicionar nova rota comercial"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRouteSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Nome do Corredor *</label>
            <input
              type="text"
              required
              placeholder="Ex: Corredor de Beira (Maputo ➔ Harare)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cidade Origem *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Maputo"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cidade Destino *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Beira"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Distância (km) *</label>
              <input
                type="number"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Duração Est. (h) *</label>
              <input
                type="number"
                required
                value={estHours}
                onChange={(e) => setEstHours(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Preço Base (MZN) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Postos de Fronteira</label>
            <input
              type="text"
              value={checkpoints}
              onChange={(e) => setCheckpoints(e.target.value)}
              placeholder="Ex: Machipanda / Forbes Border"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddRouteOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Guardar Corredor
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM MODAL REMOVER SERVIÇO */}
      <ConfirmModal
        isOpen={!!deleteServiceId}
        onClose={() => setDeleteServiceId(null)}
        onConfirm={() => {
          if (deleteServiceId) deleteService(deleteServiceId);
        }}
        title="Remover Serviço do Catálogo"
        description="Tem a certeza de que deseja eliminar este serviço? As viagens em andamento não serão afetadas."
        confirmLabel="Remover Serviço"
        isDestructive={true}
      />

      {/* CONFIRM MODAL REMOVER ROTA */}
      <ConfirmModal
        isOpen={!!deleteRouteId}
        onClose={() => setDeleteRouteId(null)}
        onConfirm={() => {
          if (deleteRouteId) deleteRoute(deleteRouteId);
        }}
        title="Remover Corredor SADC"
        description="Tem a certeza de que deseja eliminar esta rota do tarifário oficial?"
        confirmLabel="Remover Corredor"
        isDestructive={true}
      />
    </StandardPageLayout>
  );
};
