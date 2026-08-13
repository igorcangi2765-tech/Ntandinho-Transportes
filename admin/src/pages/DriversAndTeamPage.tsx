import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore, DriverItem, EmployeeItem } from '../shared/stores/useErpStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { DetailDrawer } from '../components/ui/DetailDrawer';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { exportToCSV } from '../utils/csvExporter';
import { printGeneralReport } from '../utils/documentPrinter';
import {
  Users,
  Plus,
  Award,
  ShieldCheck,
  UserCheck,
  Printer,
  Download,
} from 'lucide-react';

export const DriversAndTeamPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { drivers, employees, addDriver, deleteDriver } = useErpStore();
  const { addToast } = useNotificationStore();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'motoristas' | 'equipa'>('motoristas');

  useEffect(() => {
    if (tabParam === 'team' || tabParam === 'equipa') setActiveTab('equipa');
    else setActiveTab('motoristas');
  }, [tabParam]);

  const handleTabChange = (tab: 'motoristas' | 'equipa') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const [selectedDriverDrawer, setSelectedDriverDrawer] = useState<DriverItem | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState<string | null>(null);

  // Form Driver State
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('+258 84 ');

  // Computations
  const availableDriversCount = drivers.filter((d) => d.isAvailable).length;
  const validSadcCount = drivers.filter((d) => d.docStatus === 'VALIDO').length;

  const handleExportCSV = () => {
    if (activeTab === 'motoristas') {
      const headers = ['Nome Motorista', 'Carta Condução', 'Exp. Carta', 'Visto SADC', 'Camião Alocado', 'Pontuação', 'Estado'];
      const rows = drivers.map((d) => [d.name, d.licenseNumber, d.licenseExpDate, d.sadcVisaExpDate, d.assignedVehiclePlate || 'Sem Alocação', d.ratingScore, d.status]);
      exportToCSV('motoristas_sadc_ntandinho', headers, rows);
    } else {
      const headers = ['Nome Funcionário', 'Cargo', 'Departamento', 'Email', 'Telemóvel', 'Estado'];
      const rows = employees.map((e) => [e.name, e.position, e.department, e.email, e.phone, e.isActive ? 'ACTIVO' : 'INACTIVO']);
      exportToCSV('equipa_colaboradores_ntandinho', headers, rows);
    }
    addToast('Ficheiro CSV Gerado', 'Dados exportados com sucesso.', 'success');
  };

  const handlePrintReport = () => {
    if (activeTab === 'motoristas') {
      const headers = ['Nome Motorista', 'Carta Condução', 'Visto SADC', 'Camião Alocado', 'Pontuação', 'Estado'];
      const rows = drivers.map((d) => [d.name, d.licenseNumber, `${d.sadcVisaExpDate} (${d.docStatus})`, d.assignedVehiclePlate || 'Sem Alocação', `${d.ratingScore} / 5.0`, d.status]);
      printGeneralReport('Ficha de Motoristas Credenciados SADC', headers, rows);
    } else {
      const headers = ['Nome Funcionário', 'Cargo', 'Departamento', 'Email', 'Telemóvel', 'Estado'];
      const rows = employees.map((e) => [e.name, e.position, e.department, e.email, e.phone, e.isActive ? 'ACTIVO' : 'INACTIVO']);
      printGeneralReport('Quadro de Colaboradores & Equipa ERP', headers, rows);
    }
    addToast('Impressão Iniciada', 'Relatório impresso enviado para o visualizador.', 'info');
  };

  // Columns for Motoristas
  const driverColumns: Column<DriverItem>[] = [
    {
      key: 'name',
      header: 'Nome Completo Motorista',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.phone}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'licenseNumber',
      header: 'Carta de Condução',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.licenseNumber} (Exp: {row.licenseExpDate})</span>,
      sortable: true,
    },
    {
      key: 'sadcVisaExpDate',
      header: 'Visto SADC (Internacional)',
      accessor: (row) => (
        <span
          className={`font-mono text-xs font-bold ${
            row.docStatus === 'VALIDO' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
          }`}
        >
          {row.sadcVisaExpDate} ({row.docStatus})
        </span>
      ),
    },
    {
      key: 'assignedVehiclePlate',
      header: 'Camião Pesado Alocado',
      accessor: (row) => (
        <span className="font-mono font-bold text-brand-orange">
          {row.assignedVehiclePlate || 'Sem Alocação Fixa'}
        </span>
      ),
    },
    {
      key: 'ratingScore',
      header: 'Pontuação RH',
      accessor: (row) => (
        <span className="font-mono font-black text-amber-600 flex items-center gap-1">
          <Award size={13} /> {row.ratingScore} / 5.0
        </span>
      ),
      align: 'right',
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  // Columns for Equipa
  const employeeColumns: Column<EmployeeItem>[] = [
    {
      key: 'name',
      header: 'Nome do Funcionário',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'position',
      header: 'Cargo / Função',
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.position}</span>,
      sortable: true,
    },
    {
      key: 'department',
      header: 'Departamento',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          {row.department}
        </span>
      ),
    },
    {
      key: 'branchCity',
      header: 'Delegação',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300 font-medium">{row.branchCity}</span>,
    },
    {
      key: 'phone',
      header: 'Telemóvel Directo',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.phone}</span>,
    },
  ];

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNumber) return;

    addDriver({
      name,
      licenseNumber,
      licenseExpDate: '2028-12-31',
      passportExpDate: '2029-12-31',
      sadcVisaExpDate: '2028-12-31',
      phone,
    });
    setIsAddDriverOpen(false);
  };

  return (
    <StandardPageLayout
      title="Gestão de Equipa"
      description="Controlo de motoristas, documentação e colaboradores internos."
      icon={Users}
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
              onClick={() => handleTabChange('motoristas')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'motoristas' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Motoristas ({drivers.length})
            </button>
            <button
              onClick={() => handleTabChange('equipa')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto ${
                activeTab === 'equipa' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Equipa Interna ({employees.length})
            </button>
          </div>



          {/* DYNAMIC CONTEXTUAL PRIMARY ACTION BUTTON PER TAB */}
          {activeTab === 'motoristas' && (
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Novo Motorista</span>
            </button>
          )}

          {activeTab === 'equipa' && (
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Novo Colaborador</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        activeTab === 'motoristas' ? (
          <>
            <MetricCard
              title="Total Motoristas"
              value={drivers.length}
              subtext="Condutores pesados credenciados"
              icon={Users}
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-900 dark:text-white"
            />
            <MetricCard
              title="Disponíveis"
              value={availableDriversCount}
              subtext="Prontos p/ despacho"
              icon={UserCheck}
              iconBg="bg-emerald-50 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              title="Visto SADC Válido"
              value={validSadcCount}
              subtext="Trânsito regional autorizado"
              icon={ShieldCheck}
              iconBg="bg-blue-50 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <MetricCard
              title="Pontuação Média"
              value="4.9 / 5.0"
              subtext="Avaliação operacional"
              icon={Award}
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </>
        ) : (
          <>
            <MetricCard
              title="Quadro de Pessoal"
              value={employees.length}
              subtext="Colaboradores internos"
              icon={UserCheck}
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-900 dark:text-white"
            />
            <MetricCard
              title="Delegações Activas"
              value="3 Sedes"
              subtext="Matola, Beira e Nacala"
              icon={ShieldCheck}
              iconBg="bg-purple-50 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />
          </>
        )
      }
    >
      {activeTab === 'motoristas' ? (
        <DataTable
          data={drivers}
          columns={driverColumns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => setSelectedDriverDrawer(row)}
          searchPlaceholder="Pesquisar por nome ou carta de condução..."
          quickActions={[
            {
              label: 'Ver Ficha Completa',
              onClick: (row) => setSelectedDriverDrawer(row),
            },
            {
              label: 'Remover Motorista',
              isDestructive: true,
              onClick: (row) => setDeleteDriverId(row.id),
            },
          ]}
        />
      ) : (
        <DataTable
          data={employees}
          columns={employeeColumns}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Pesquisar por nome ou cargo de funcionário..."
        />
      )}

      {/* DETAIL DRAWER MOTORISTA */}
      {selectedDriverDrawer && (
        <DetailDrawer
          isOpen={!!selectedDriverDrawer}
          onClose={() => setSelectedDriverDrawer(null)}
          title={`Ficha de Motorista — ${selectedDriverDrawer.name}`}
          subtitle={`Carta: ${selectedDriverDrawer.licenseNumber} • Telemóvel: ${selectedDriverDrawer.phone}`}
          tabs={[
            {
              id: 'dados',
              label: 'Dados do Condutor',
              content: (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Carta de Condução</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDriverDrawer.licenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Validade da Carta</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDriverDrawer.licenseExpDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Visto SADC (Internacional)</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedDriverDrawer.sadcVisaExpDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Passaporte</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDriverDrawer.passportExpDate}</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'desempenho',
              label: 'Desempenho & Avaliação',
              content: (
                <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Viagens Concluídas:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">{selectedDriverDrawer.totalTripsCompleted} viagens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Pontuação RH:</span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-500">{selectedDriverDrawer.ratingScore} / 5.0</span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* MODAL CADASTRAR MOTORISTA */}
      <Modal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        title="Credenciar Novo Motorista Pesado"
        subtitle="Registe condutor com validação de carta e visto SADC"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDriver} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Alberto Nhantumbo"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Número da Carta de Condução</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Ex: C-901234 (Pesados)"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Telemóvel de Contacto</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+258 84 000 0000"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddDriverOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Credenciar Motorista
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM MODAL REMOVER MOTORISTA */}
      <ConfirmModal
        isOpen={!!deleteDriverId}
        onClose={() => setDeleteDriverId(null)}
        onConfirm={() => {
          if (deleteDriverId) deleteDriver(deleteDriverId);
        }}
        title="Desativar e Remover Motorista"
        description="Tem a certeza de que deseja remover este motorista do cadastro? O histórico operacional será mantido na auditoria."
        confirmLabel="Remover Motorista"
        isDestructive={true}
      />
    </StandardPageLayout>
  );
};
