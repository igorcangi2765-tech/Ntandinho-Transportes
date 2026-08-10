import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore, VehicleItem, MaintenanceLogItem, FuelLogItem } from '../shared/stores/useErpStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { DetailDrawer } from '../components/ui/DetailDrawer';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { exportToCSV } from '../utils/csvExporter';
import { printGeneralReport } from '../utils/documentPrinter';
import {
  Truck,
  Plus,
  Wrench,
  Fuel,
  CheckCircle2,
  Clock,
  Printer,
  Download,
} from 'lucide-react';

export const FleetPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    vehicles,
    maintenanceLogs,
    fuelLogs,
    trips,
    drivers,
    addVehicle,
    updateVehicleStatus,
    deleteVehicle,
    addMaintenanceLog,
    addFuelLog,
  } = useErpStore();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'vehicles' | 'maintenance' | 'fuel'>('vehicles');

  useEffect(() => {
    if (tabParam === 'maintenance' || tabParam === 'manutencao') setActiveTab('maintenance');
    else if (tabParam === 'fuel' || tabParam === 'abastecimento') setActiveTab('fuel');
    else setActiveTab('vehicles');
  }, [tabParam]);

  const handleTabChange = (tab: 'vehicles' | 'maintenance' | 'fuel') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleExportCSV = () => {
    if (activeTab === 'vehicles') {
      const headers = ['Matrícula', 'Marca', 'Modelo', 'Ano', 'Categoria', 'Quilometragem (km)', 'Motorista', 'Estado'];
      const rows = vehicles.map((v) => [v.plateNumber, v.make, v.model, v.year, v.category, v.mileageKm, v.driverName || 'Sem Atribuição', v.status]);
      exportToCSV('frota_viaturas_ntandinho', headers, rows);
    } else if (activeTab === 'maintenance') {
      const headers = ['Matrícula', 'Tipo Revisão', 'Descrição', 'Oficina', 'Custo (MZN)', 'Data'];
      const rows = maintenanceLogs.map((m) => [m.vehiclePlate, m.type, m.description, m.workshop, m.costMzn, m.date]);
      exportToCSV('manutencao_frota_ntandinho', headers, rows);
    } else {
      const headers = ['Matrícula', 'Motorista', 'Posto Emissor', 'Litros', 'Valor (MZN)', 'Data'];
      const rows = fuelLogs.map((f) => [f.vehiclePlate, f.driverName, f.stationName, f.liters, f.totalCostMzn, f.date]);
      exportToCSV('abastecimento_combustivel_ntandinho', headers, rows);
    }
  };

  const handlePrintReport = () => {
    if (activeTab === 'vehicles') {
      const headers = ['Matrícula', 'Marca & Modelo', 'Categoria', 'Quilometragem', 'Motorista', 'Estado'];
      const rows = vehicles.map((v) => [v.plateNumber, `${v.make} ${v.model} (${v.year})`, v.category, `${v.mileageKm.toLocaleString('pt-MZ')} km`, v.driverName || 'Sem Atribuição', v.status]);
      printGeneralReport('Frota de Camiões Pesados & Reboques', headers, rows);
    } else if (activeTab === 'maintenance') {
      const headers = ['Matrícula', 'Tipo Revisão', 'Descrição', 'Oficina', 'Custo Total', 'Data'];
      const rows = maintenanceLogs.map((m) => [m.vehiclePlate, m.type, m.description, m.workshop, `${m.costMzn.toLocaleString('pt-MZ')} MZN`, m.date]);
      printGeneralReport('Manutenção Preventiva & Oficinas', headers, rows);
    } else {
      const headers = ['Matrícula', 'Motorista', 'Posto Emissor', 'Litros', 'Valor Total', 'Data'];
      const rows = fuelLogs.map((f) => [f.vehiclePlate, f.driverName, f.stationName, `${f.liters} L`, `${f.totalCostMzn.toLocaleString('pt-MZ')} MZN`, f.date]);
      printGeneralReport('Abastecimentos & Vales de Combustível', headers, rows);
    }
  };

  // Drawers & Modals State
  const [selectedVehicleDrawer, setSelectedVehicleDrawer] = useState<VehicleItem | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isAddFuelOpen, setIsAddFuelOpen] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);

  // Form vehicle state
  const [plateNumber, setPlateNumber] = useState('');
  const [make, setMake] = useState('Volvo');
  const [model, setModel] = useState('FH16');
  const [year, setYear] = useState(2024);
  const [category, setCategory] = useState<'Camião Pesado' | 'Semi-Reboque' | 'Camião Basculante' | 'Carrinha Distribuição'>('Camião Pesado');

  // Form maintenance state
  const [maintVehiclePlate, setMaintVehiclePlate] = useState(vehicles[0]?.plateNumber || 'AFM-802-MC');
  const [maintType, setMaintType] = useState<'TROCA_OLEO' | 'SUBSTITUICAO_PNEUS' | 'REVISAO_TRAVOES' | 'INSPECAO_GERAL' | 'REPARACAO_MOTOR'>('INSPECAO_GERAL');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintWorkshop, setMaintWorkshop] = useState('Oficina Central Maputo');
  const [maintCost, setMaintCost] = useState(15000);

  // Form fuel state
  const [fuelVehiclePlate, setFuelVehiclePlate] = useState(vehicles[0]?.plateNumber || 'AFM-802-MC');
  const [fuelDriverName, setFuelDriverName] = useState(drivers[0]?.name || 'Carlos Sitoe');
  const [fuelStation, setFuelStation] = useState<'Petromoc' | 'Galp' | 'TotalEnergies' | 'Engen'>('Petromoc');
  const [fuelLiters, setFuelLiters] = useState(400);
  const [fuelCost, setFuelCost] = useState(34000);

  // Computations
  const operationalCount = vehicles.filter((v) => v.status === 'OPERACIONAL' || v.status === 'EM_VIAGEM').length;
  const inTripCount = vehicles.filter((v) => v.status === 'EM_VIAGEM').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'MANUTENCAO').length;
  const totalFuelCostMzn = fuelLogs.reduce((acc, f) => acc + f.totalCostMzn, 0);
  const totalMaintenanceCostMzn = maintenanceLogs.reduce((acc, m) => acc + m.costMzn, 0);

  // Columns for Viaturas
  const vehicleColumns: Column<VehicleItem>[] = [
    {
      key: 'plateNumber',
      header: 'Matrícula',
      accessor: (row) => <span className="font-mono font-black text-[#F6A823] text-xs">{row.plateNumber}</span>,
      sortable: true,
    },
    {
      key: 'model',
      header: 'Marca & Modelo',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.make} {row.model}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.category} ({row.year})</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'mileageKm',
      header: 'Quilometragem',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.mileageKm.toLocaleString('pt-MZ')} km</span>,
      sortable: true,
    },
    {
      key: 'driverName',
      header: 'Motorista Atribuído',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-medium">{row.driverName || 'Sem Atribuição Fixa'}</span>,
    },
    {
      key: 'status',
      header: 'Estado Operacional',
      accessor: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            row.status === 'OPERACIONAL'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/30'
              : row.status === 'EM_VIAGEM'
              ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 border border-sky-500/30'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/30'
          }`}
        >
          {row.status === 'OPERACIONAL' ? '● Operacional' : row.status === 'EM_VIAGEM' ? '🚚 Em Viagem' : '🔧 Manutenção'}
        </span>
      ),
      sortable: true,
    },
  ];

  // Columns for Manutenção
  const maintenanceColumns: Column<MaintenanceLogItem>[] = [
    {
      key: 'vehiclePlate',
      header: 'Matrícula Viatura',
      accessor: (row) => <span className="font-mono font-bold text-[#F6A823]">{row.vehiclePlate}</span>,
    },
    {
      key: 'type',
      header: 'Tipo Intervenção',
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">{row.type}</span>,
    },
    {
      key: 'description',
      header: 'Descrição da Revisão',
      accessor: (row) => <span className="text-slate-600 dark:text-slate-300 font-medium">{row.description}</span>,
    },
    {
      key: 'workshop',
      header: 'Oficina Credenciada',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-medium">{row.workshop}</span>,
    },
    {
      key: 'costMzn',
      header: 'Custo Total (MZN)',
      accessor: (row) => <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">{row.costMzn.toLocaleString('pt-MZ')} MZN</span>,
    },
    {
      key: 'date',
      header: 'Data Intervenção',
      accessor: (row) => <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{row.date}</span>,
    },
  ];

  // Columns for Abastecimento
  const fuelColumns: Column<FuelLogItem>[] = [
    {
      key: 'vehiclePlate',
      header: 'Matrícula Viatura',
      accessor: (row) => <span className="font-mono font-bold text-[#F6A823]">{row.vehiclePlate}</span>,
    },
    {
      key: 'driverName',
      header: 'Motorista',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.driverName}</span>,
    },
    {
      key: 'stationName',
      header: 'Posto Emissor',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-medium">{row.stationName}</span>,
    },
    {
      key: 'liters',
      header: 'Volume (Litros)',
      accessor: (row) => <span className="font-mono font-bold text-slate-900 dark:text-white">{row.liters} L</span>,
    },
    {
      key: 'totalCostMzn',
      header: 'Valor Emitido',
      accessor: (row) => <span className="font-mono font-extrabold text-purple-600 dark:text-purple-400">{row.totalCostMzn.toLocaleString('pt-MZ')} MZN</span>,
    },
    {
      key: 'date',
      header: 'Data Emissão',
      accessor: (row) => <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{row.date}</span>,
    },
  ];

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber) return;

    addVehicle({
      plateNumber,
      make,
      model,
      year: Number(year),
      category,
      mileageKm: 120000,
      driverName: 'Sem Atribuição',
      nextOilChangeKm: 135000,
      licenseExpiry: '2028-12-31',
      insuranceExpiry: '2028-12-31',
      inspectionExpiry: '2028-12-31',
    });

    setIsAddVehicleOpen(false);
    setPlateNumber('');
  };

  const handleAddMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintDesc) return;

    addMaintenanceLog({
      vehiclePlate: maintVehiclePlate,
      type: maintType,
      category: 'PREVENTIVA',
      description: maintDesc,
      workshop: maintWorkshop,
      costMzn: Number(maintCost),
      kmAtService: 125000,
    });

    setIsAddMaintenanceOpen(false);
    setMaintDesc('');
  };

  const handleAddFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addFuelLog({
      vehiclePlate: fuelVehiclePlate,
      driverName: fuelDriverName,
      stationName: fuelStation,
      liters: Number(fuelLiters),
      pricePerLiterMzn: 85,
      totalCostMzn: Number(fuelCost),
      currentKm: 120000,
    });

    setIsAddFuelOpen(false);
  };

  return (
    <StandardPageLayout
      title="Gestão de Frota, Camiões & Manutenção"
      description="Monitorização técnica da frota pesada, registo de serviços técnicos e controlo de vales de combustível."
      icon={Truck}
      actions={
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer size={14} />
            <span>Imprimir PDF</span>
          </button>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('vehicles')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'vehicles' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Viaturas ({vehicles.length})
            </button>
            <button
              onClick={() => handleTabChange('maintenance')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'maintenance' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Manutenção
            </button>
            <button
              onClick={() => handleTabChange('fuel')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight col-span-2 sm:col-span-1 sm:w-auto ${
                activeTab === 'fuel' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Abastecimento
            </button>
          </div>



          {/* DYNAMIC CONTEXTUAL ACTION BUTTON PER TAB */}
          {activeTab === 'vehicles' && (
            <button
              onClick={() => setIsAddVehicleOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Nova Viatura</span>
            </button>
          )}

          {activeTab === 'maintenance' && (
            <button
              onClick={() => setIsAddMaintenanceOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Wrench size={15} />
              <span>Registar Manutenção</span>
            </button>
          )}

          {activeTab === 'fuel' && (
            <button
              onClick={() => setIsAddFuelOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Fuel size={15} />
              <span>Registar Abastecimento</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        <>
          <MetricCard
            title="Frota Total"
            value={vehicles.length}
            subtext="Camiões e semi-reboques"
            icon={Truck}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Operacionais"
            value={operationalCount}
            subtext={`${inTripCount} em viagem activa`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Em Manutenção"
            value={maintenanceCount}
            subtext="Bloqueados em oficina"
            icon={Wrench}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <MetricCard
            title="Custo Manutenção"
            value={`${(totalMaintenanceCostMzn / 1000).toFixed(0)}k`}
            unit="MZN"
            subtext="Total em revisões"
            icon={Clock}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            title="Combustível Emitido"
            value={`${(totalFuelCostMzn / 1000).toFixed(0)}k`}
            unit="MZN"
            subtext="Vales Petromoc / Galp"
            icon={Fuel}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </>
      }
    >
      {/* TAB 1: VIATURAS */}
      {activeTab === 'vehicles' && (
        <DataTable
          data={vehicles}
          columns={vehicleColumns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => setSelectedVehicleDrawer(row)}
          searchPlaceholder="Pesquisar viatura por matrícula, marca ou modelo..."
          filterOptions={[
            {
              label: 'Estado',
              key: 'status',
              options: [
                { value: 'OPERACIONAL', label: 'Operacional' },
                { value: 'EM_VIAGEM', label: 'Em Viagem' },
                { value: 'MANUTENCAO', label: 'Manutenção' },
              ],
            },
          ]}
          quickActions={[
            {
              label: 'Ver Ficha Completa',
              onClick: (row) => setSelectedVehicleDrawer(row),
            },
            {
              label: 'Bloquear p/ Oficina (Manutenção)',
              onClick: (row) => updateVehicleStatus(row.id, 'MANUTENCAO'),
            },
            {
              label: 'Libertar (Marcar Operacional)',
              onClick: (row) => updateVehicleStatus(row.id, 'OPERACIONAL'),
            },
            {
              label: 'Remover Viatura',
              isDestructive: true,
              onClick: (row) => setDeleteVehicleId(row.id),
            },
          ]}
        />
      )}

      {/* TAB 2: MANUTENÇÃO */}
      {activeTab === 'maintenance' && (
        <DataTable
          data={maintenanceLogs}
          columns={maintenanceColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar manutenção..."
        />
      )}

      {/* TAB 3: ABASTECIMENTO */}
      {activeTab === 'fuel' && (
        <DataTable
          data={fuelLogs}
          columns={fuelColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar vales de combustível..."
        />
      )}

      {/* FICHA DA VIATURA EM DRAWER */}
      {selectedVehicleDrawer && (
        <DetailDrawer
          isOpen={!!selectedVehicleDrawer}
          onClose={() => setSelectedVehicleDrawer(null)}
          title={`Ficha da Viatura ${selectedVehicleDrawer.plateNumber}`}
          subtitle={`${selectedVehicleDrawer.make} ${selectedVehicleDrawer.model} (${selectedVehicleDrawer.year}) • Categoria: ${selectedVehicleDrawer.category}`}
          width="xl"
          tabs={[
            {
              id: 'resumo',
              label: 'Resumo Técnico',
              content: (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Matrícula</span>
                      <span className="font-mono font-extrabold text-brand-orange text-sm">{selectedVehicleDrawer.plateNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Estado Actual</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedVehicleDrawer.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Quilometragem Odómetro</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedVehicleDrawer.mileageKm.toLocaleString('pt-MZ')} km</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Motorista Atribuído</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedVehicleDrawer.driverName || 'Sem Atribuição Fixa'}</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'viagens',
              label: 'Histórico de Viagens',
              badge: trips.filter((t) => t.vehiclePlate === selectedVehicleDrawer.plateNumber).length,
              content: (
                <div className="space-y-2 text-xs">
                  {trips
                    .filter((t) => t.vehiclePlate === selectedVehicleDrawer.plateNumber)
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{t.tripNumber}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{t.customerName}</span>
                          <span className="text-slate-500 dark:text-slate-400 block mt-0.5">{t.origin} ➔ {t.destination}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{t.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
          ]}
        />
      )}

      {/* MODAL ADICIONAR VIATURA */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Cadastrar Nova Viatura na Frota"
        subtitle="Registo técnico de pesados e reboques"
        maxWidth="md"
      >
        <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Matrícula da Viatura *</label>
            <input
              type="text"
              required
              placeholder="Ex: AFG-940-MC"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Marca</label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Modelo</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Ano</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              >
                <option value="Camião Pesado">Camião Pesado</option>
                <option value="Semi-Reboque">Semi-Reboque</option>
                <option value="Camião Basculante">Camião Basculante</option>
                <option value="Carrinha Distribuição">Carrinha Distribuição</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Guardar Viatura
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL REGISTAR MANUTENÇÃO */}
      <Modal
        isOpen={isAddMaintenanceOpen}
        onClose={() => setIsAddMaintenanceOpen(false)}
        title="Registar Intervenção de Manutenção"
        subtitle="Agendamento técnico e bloqueio da viatura em oficina"
        maxWidth="md"
      >
        <form onSubmit={handleAddMaintenanceSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Selecionar Viatura *</label>
            <select
              value={maintVehiclePlate}
              onChange={(e) => setMaintVehiclePlate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-slate-400"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.plateNumber}>
                  {v.plateNumber} — {v.make} {v.model} ({v.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tipo de Intervenção</label>
              <select
                value={maintType}
                onChange={(e) => setMaintType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              >
                <option value="PREVENTIVA">Preventiva (Revisão)</option>
                <option value="CORRETIVA">Corretiva (Avaria)</option>
                <option value="REVISAO">Revisão Geral</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Custo Estimado (MZN)</label>
              <input
                type="number"
                value={maintCost}
                onChange={(e) => setMaintCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Descrição do Serviço *</label>
            <input
              type="text"
              required
              placeholder="Ex: Troca de óleo de motor, filtros de combustível e calços de travão"
              value={maintDesc}
              onChange={(e) => setMaintDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Oficina Credenciada</label>
            <input
              type="text"
              value={maintWorkshop}
              onChange={(e) => setMaintWorkshop(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddMaintenanceOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Registar Manutenção
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL REGISTAR ABASTECIMENTO */}
      <Modal
        isOpen={isAddFuelOpen}
        onClose={() => setIsAddFuelOpen(false)}
        title="Registar Abastecimento & Vale Combustível"
        subtitle="Lançamento de combustível emitido para viagens"
        maxWidth="md"
      >
        <form onSubmit={handleAddFuelSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Selecionar Viatura *</label>
            <select
              value={fuelVehiclePlate}
              onChange={(e) => setFuelVehiclePlate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-slate-400"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.plateNumber}>
                  {v.plateNumber} — {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Motorista Solicitante</label>
            <select
              value={fuelDriverName}
              onChange={(e) => setFuelDriverName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Posto Emissor</label>
            <select
              value={fuelStation}
              onChange={(e) => setFuelStation(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            >
              <option value="Petromoc">Petromoc</option>
              <option value="Galp">Galp</option>
              <option value="TotalEnergies">TotalEnergies</option>
              <option value="Engen">Engen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Volume (Litros)</label>
              <input
                type="number"
                value={fuelLiters}
                onChange={(e) => setFuelLiters(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Valor Total (MZN)</label>
              <input
                type="number"
                value={fuelCost}
                onChange={(e) => setFuelCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddFuelOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Registar Abastecimento
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM MODAL REMOVER VIATURA */}
      <ConfirmModal
        isOpen={!!deleteVehicleId}
        onClose={() => setDeleteVehicleId(null)}
        onConfirm={() => {
          if (deleteVehicleId) deleteVehicle(deleteVehicleId);
        }}
        title="Remover Viatura da Frota"
        description="Tem a certeza de que deseja remover esta viatura? A informação ficará preservada no histórico de auditoria."
        confirmLabel="Remover Viatura"
        isDestructive={true}
      />
    </StandardPageLayout>
  );
};
