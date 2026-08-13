import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useErpStore, CustomerItem, QuotationItem } from '../shared/stores/useErpStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { DetailDrawer } from '../components/ui/DetailDrawer';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { QuotationsFunnel } from '../components/ui/QuotationsFunnel';
import {
  Building2,
  Plus,
  Users,
  DollarSign,
  Download,
  Printer,
  FileSpreadsheet,
  Columns,
  List,
  ArrowRight,
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExporter';
import { printGeneralReport } from '../utils/documentPrinter';
import { formatCurrencyMzn } from '../utils/formatters';

export const CRMPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    customers,
    quotations,
    bookings,
    trips,
    invoices,
    payments,
    addCustomer,
    deleteCustomer,
    addQuotation,
    updateQuotationStatus,
    convertQuotationToBooking,
  } = useErpStore();
  const { addToast } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'customers' | 'quotations' | 'services'>('customers');
  const [quotationView, setQuotationView] = useState<'funnel' | 'list'>('list');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam === 'quotations' || tabParam === 'cotacoes') {
      setActiveTab('quotations');
    } else if (tabParam === 'services' || tabParam === 'servicos') {
      setActiveTab('services');
    } else {
      setActiveTab('customers');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'customers' | 'quotations' | 'services') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [selectedCustomerDrawer, setSelectedCustomerDrawer] = useState<CustomerItem | null>(null);
  const [selectedQuotationDrawer, setSelectedQuotationDrawer] = useState<QuotationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  // Customer Form State
  const [name, setName] = useState('');
  const [nuit, setNuit] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+258 84 ');
  const [address] = useState('');
  const [city] = useState('Maputo');
  const [isCorporate, setIsCorporate] = useState(true);

  // Quotation Form State
  const [qCustName, setQCustName] = useState('Cervejas de Moçambique');
  const [qOrigCity, setQOrigCity] = useState('Maputo');
  const [qDestCity, setQDestCity] = useState('Beira');
  const [qCargoDesc, setQCargoDesc] = useState('Mercadorias em paletes');
  const [qTotalPrice, setQTotalPrice] = useState(125000);

  // Computations
  const totalCorporateCount = customers.filter((c) => c.isCorporate).length;
  const totalParticularCount = customers.filter((c) => !c.isCorporate).length;
  const totalRevenueMzn = customers.reduce((acc, c) => acc + c.totalSpentMzn, 0);

  // Table Columns for Customers
  const customerColumns: Column<CustomerItem>[] = [
    {
      key: 'name',
      header: 'Cliente / Razão Social',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.city} • {row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'nuit',
      header: 'NUIT',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.nuit}</span>,
      sortable: true,
    },
    {
      key: 'type',
      header: 'Tipo de Cliente',
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            row.isCorporate
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          {row.isCorporate ? 'EMPRESA' : 'PARTICULAR'}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Telemóvel',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{row.phone}</span>,
    },
    {
      key: 'creditLimitMzn',
      header: 'Limite de Crédito',
      accessor: (row) => (
        <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
          {row.creditLimitMzn.toLocaleString('pt-MZ')} MZN
        </span>
      ),
      align: 'right',
    },
    {
      key: 'totalSpentMzn',
      header: 'Total Faturado',
      accessor: (row) => (
        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
          {row.totalSpentMzn.toLocaleString('pt-MZ')} MZN
        </span>
      ),
      sortable: true,
      align: 'right',
    },
  ];

  // Table Columns for Quotations
  const quotationColumns: Column<QuotationItem>[] = [
    {
      key: 'quotationNumber',
      header: 'Ref. Cotação',
      accessor: (row) => <span className="font-mono font-bold text-[#F6A823]">{row.quotationNumber}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Cliente Solicitante',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.customerName}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.cargoDescription}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'route',
      header: 'Rota Solicitada',
      accessor: (row) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {row.origin} ➔ {row.destination}
        </span>
      ),
    },
    {
      key: 'totalPrice',
      header: 'Orçamento Total',
      accessor: (row) => (
        <span className="font-mono font-black text-slate-900 dark:text-white">
          {row.totalPrice.toLocaleString('pt-MZ')} MZN
        </span>
      ),
      sortable: true,
      align: 'right',
    },
    {
      key: 'validUntil',
      header: 'Validade',
      accessor: (row) => <span className="font-mono text-slate-500 dark:text-slate-400">{row.validUntil}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addCustomer({
      name,
      nuit,
      email,
      phone,
      address,
      city,
      isCorporate,
      creditLimitMzn: isCorporate ? 5000000 : 200000,
    });
    addToast('Cliente Cadastrado com Sucesso', `O cliente ${name} foi registado na base de dados comercial.`, 'success');
    setIsAddModalOpen(false);
    setName('');
    setNuit('');
    setEmail('');
  };

  const handleCreateQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceSubtotal = Math.round(Number(qTotalPrice) / 1.16);
    addQuotation({
      customerId: `cli-${Date.now()}`,
      customerName: qCustName,
      origin: qOrigCity,
      destination: qDestCity,
      cargoDescription: qCargoDesc,
      weightKg: 20000,
      priceSubtotal,
      currency: 'MZN',
      validUntil: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    });
    setIsAddQuotationOpen(false);
  };

  const handleExportCSV = () => {
    if (activeTab === 'customers') {
      const headers = ['Cliente', 'NUIT', 'Tipo', 'Telemóvel', 'Limite Crédito', 'Total Faturado'];
      const rows = customers.map((c) => [c.name, c.nuit, c.isCorporate ? 'EMPRESA' : 'PARTICULAR', c.phone, `${c.creditLimitMzn} MZN`, `${c.totalSpentMzn} MZN`]);
      exportToCSV('clientes_crm_ntandinho', headers, rows);
    } else {
      const headers = ['Ref. Cotação', 'Cliente Solicitante', 'Origem', 'Destino', 'Orçamento Total', 'Validade', 'Estado'];
      const rows = quotations.map((q) => [q.quotationNumber, q.customerName, q.origin, q.destination, `${q.totalPrice} MZN`, q.validUntil, q.status]);
      exportToCSV('cotacoes_comercial_ntandinho', headers, rows);
    }
    addToast('Ficheiro CSV Gerado', 'Dados comerciais exportados.', 'success');
  };

  const handlePrintReport = () => {
    if (activeTab === 'customers') {
      const headers = ['Cliente', 'NUIT', 'Tipo de Cliente', 'Telemóvel', 'Total Faturado'];
      const rows = customers.map((c) => [c.name, c.nuit, c.isCorporate ? 'EMPRESA' : 'PARTICULAR', c.phone, `${c.totalSpentMzn.toLocaleString('pt-MZ')} MZN`]);
      printGeneralReport('Clientes & CRM', headers, rows);
    } else {
      const headers = ['Ref. Cotação', 'Cliente Solicitante', 'Origem', 'Destino', 'Orçamento Total', 'Validade', 'Estado'];
      const rows = quotations.map((q) => [q.quotationNumber, q.customerName, q.origin, q.destination, `${q.totalPrice.toLocaleString('pt-MZ')} MZN`, q.validUntil, q.status]);
      printGeneralReport('Cotações', headers, rows);
    }
    addToast('Relatório Gerado', 'Relatório enviado para impressão.', 'info');
  };

  return (
    <StandardPageLayout
      title="Comercial & Clientes"
      description="Gestão de clientes corporativos, cotações e catálogo de serviços."
      icon={Building2}
      actions={
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
          >
            <Printer size={14} />
            <span>Imprimir PDF</span>
          </button>

          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('customers')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto btn-micro ${
                activeTab === 'customers' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Clientes ({customers.length})
            </button>
            <button
              onClick={() => handleTabChange('quotations')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto btn-micro ${
                activeTab === 'quotations' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cotações ({quotations.length})
            </button>
            <button
              onClick={() => handleTabChange('services')}
              className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight sm:w-auto btn-micro ${
                activeTab === 'services' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Serviços
            </button>
          </div>



          {activeTab === 'customers' ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <Plus size={15} />
              <span>Novo Cliente</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddQuotationOpen(true)}
              className="h-9 px-4 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-micro"
            >
              <FileSpreadsheet size={15} />
              <span>Nova Cotação</span>
            </button>
          )}
        </div>
      }
      kpiCards={
        activeTab === 'customers' ? (
          <>
            <MetricCard
              title="Total Clientes"
              value={customers.length}
              subtext="Clientes no cadastro ERP"
              icon={Users}
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-900 dark:text-white"
            />
            <MetricCard
              title="Empresas S.A."
              value={totalCorporateCount}
              subtext="Contratos corporativos"
              icon={Building2}
              iconBg="bg-blue-50 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <MetricCard
              title="Particulares"
              value={totalParticularCount}
              subtext="Clientes individuais"
              icon={Users}
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              title="Faturação Comercial"
              value={formatCurrencyMzn(totalRevenueMzn)}
              subtext="Volume global de fretes"
              icon={DollarSign}
              iconBg="bg-emerald-50 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
          </>
        ) : activeTab === 'quotations' ? (
          <>
            <MetricCard
              title="Total Cotações"
              value={quotations.length}
              subtext="Orçamentos emitidos"
              icon={FileSpreadsheet}
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-900 dark:text-white"
            />
            <MetricCard
              title="Cotações Aceites"
              value={quotations.filter((q) => q.status === 'ACEITE').length}
              subtext="Aprovadas pelos clientes"
              icon={Building2}
              iconBg="bg-emerald-50 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              title="Em Análise"
              value={quotations.filter((q) => q.status === 'EM_ANALISE' || q.status === 'ENVIADA').length}
              subtext="Aguardam resposta"
              icon={Users}
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              title="Valor em Propostas"
              value={formatCurrencyMzn(quotations.reduce((acc, q) => acc + q.totalPrice, 0))}
              subtext="Volume total orçado"
              icon={DollarSign}
              iconBg="bg-purple-50 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />
          </>
        ) : (
          <>
            <MetricCard
              title="Serviços Oficiais"
              value="5 Especialidades"
              subtext="Catálogo de transporte N'Tandinho"
              icon={Building2}
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-900 dark:text-white"
            />
            <MetricCard
              title="Carga Pesada & SADC"
              value="Frota Dedicada"
              subtext="Contentores e carga seca"
              icon={DollarSign}
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </>
        )
      }
    >
      {activeTab === 'customers' ? (
        <DataTable
          data={customers}
          columns={customerColumns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => setSelectedCustomerDrawer(row)}
          searchPlaceholder="Pesquisar por nome de cliente, NUIT ou email..."
          filterOptions={[
            {
              label: 'Tipo',
              key: 'isCorporate',
              options: [
                { value: 'true', label: 'Empresas' },
                { value: 'false', label: 'Particulares' },
              ],
            },
          ]}
          quickActions={[
            {
              label: 'Ver Ficha & Histórico',
              onClick: (row) => setSelectedCustomerDrawer(row),
            },
            {
              label: 'Remover Cliente',
              isDestructive: true,
              onClick: (row) => setDeleteCustomerId(row.id),
            },
          ]}
        />
      ) : activeTab === 'quotations' ? (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setQuotationView('funnel')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  quotationView === 'funnel' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vista de Funil (Kanban)"
              >
                <Columns size={16} />
              </button>
              <button
                onClick={() => setQuotationView('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  quotationView === 'list' ? 'bg-slate-900 dark:bg-brand-orange text-white dark:text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vista em Lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {quotationView === 'list' ? (
            <DataTable
              data={quotations}
              columns={quotationColumns}
              keyExtractor={(row) => row.id}
              onRowClick={(row) => setSelectedQuotationDrawer(row)}
              searchPlaceholder="Pesquisar cotação por ref. ou cliente..."
              quickActions={[
                {
                  label: 'Ver Ficha da Cotação',
                  onClick: (row: QuotationItem) => setSelectedQuotationDrawer(row),
                },
                {
                  label: 'Marcar como Aceite pelo Cliente',
                  onClick: (row: QuotationItem) => updateQuotationStatus(row.id, 'ACEITE'),
                },
                {
                  label: 'Converter Cotação em Reserva',
                  icon: ArrowRight,
                  onClick: (row: QuotationItem) => convertQuotationToBooking(row.id),
                },
              ]}
            />
          ) : (
            <QuotationsFunnel
              quotations={quotations}
              onQuotationClick={(row: QuotationItem) => setSelectedQuotationDrawer(row)}
            />
          )}
        </div>
      ) : (
        /* TAB 3: SERVIÇOS OFICIAIS DO WEBSITE */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#F6A823]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">1. Transporte de Carga Pesada & Contentores</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transporte especializado de carga seca, contentores de 20ft e 40ft, mercadorias paletizadas e materiais industriais em todo o território nacional e corredores SADC.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#F6A823]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">2. Aluguer de Camiões & Frota Dedicada</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aluguer de frota pesada (Volvo, Scania, Mercedes-Benz) sob medida para contratos de média e longa duração, com motoristas credenciados e assistência 24h.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#F6A823]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">3. Logística Nacional (Moçambique)</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conexão diária entre Nampula, Porto de Nacala, Beira, Maputo, Pemba e Lichinga com gestão integrada de rotas e rastreio completo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#F6A823]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">4. Transporte Internacional SADC</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operações transfronteiriças autorizadas com vistos SADC para o Malawi (Blantyre/Lilongwe), Zâmbia (Lusaka) e Zimbabué (Harare).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#F6A823]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">5. Mobilidade Executiva & Transporte VIP</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Serviço de transporte executivo para equipas corporativas, delegações e suporte em terrenos de operação com viaturas 4x4.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CLIENTE DETAIL DRAWER COM 7 SEPARADORES */}
      {selectedCustomerDrawer && (
        <DetailDrawer
          isOpen={!!selectedCustomerDrawer}
          onClose={() => setSelectedCustomerDrawer(null)}
          title={`Ficha de Cliente — ${selectedCustomerDrawer.name}`}
          subtitle={`NUIT: ${selectedCustomerDrawer.nuit} • Tipo: ${selectedCustomerDrawer.isCorporate ? 'Empresa' : 'Particular'}`}
          width="xl"
          tabs={[
            {
              id: 'resumo',
              label: 'Resumo',
              content: (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Email de Contacto</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedCustomerDrawer.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Telemóvel / Directo</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCustomerDrawer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Morada Sede</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedCustomerDrawer.address}, {selectedCustomerDrawer.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Limite de Crédito Aprovado</span>
                      <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{selectedCustomerDrawer.creditLimitMzn.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'cotacoes',
              label: 'Cotações',
              badge: quotations.filter((q) => q.customerName === selectedCustomerDrawer.name).length,
              content: (
                <div className="space-y-2 text-xs">
                  {quotations
                    .filter((q) => q.customerName === selectedCustomerDrawer.name)
                    .map((q) => (
                      <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{q.quotationNumber}</span>
                          <span className="text-slate-700 dark:text-slate-300">{q.origin} ➔ {q.destination}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{q.totalPrice.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
            {
              id: 'reservas',
              label: 'Reservas',
              badge: bookings.filter((b) => b.customerName === selectedCustomerDrawer.name).length,
              content: (
                <div className="space-y-2 text-xs">
                  {bookings
                    .filter((b) => b.customerName === selectedCustomerDrawer.name)
                    .map((b) => (
                      <div key={b.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{b.bookingNumber}</span>
                          <span className="text-slate-700 dark:text-slate-300">{b.cargoDetails}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{b.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
            {
              id: 'viagens',
              label: 'Viagens',
              badge: trips.filter((t) => t.customerName === selectedCustomerDrawer.name).length,
              content: (
                <div className="space-y-2 text-xs">
                  {trips
                    .filter((t) => t.customerName === selectedCustomerDrawer.name)
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{t.tripNumber}</span>
                          <span className="text-slate-700 dark:text-slate-300">{t.origin} ➔ {t.destination}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.totalPriceMzn.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
            {
              id: 'faturas',
              label: 'Facturas',
              badge: invoices.filter((i) => i.customerName === selectedCustomerDrawer.name).length,
              content: (
                <div className="space-y-2 text-xs">
                  {invoices
                    .filter((i) => i.customerName === selectedCustomerDrawer.name)
                    .map((inv) => (
                      <div key={inv.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{inv.invoiceNumber}</span>
                          <span className="text-slate-700 dark:text-slate-300">{inv.status}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{inv.totalAmount.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
            {
              id: 'pagamentos',
              label: 'Pagamentos',
              badge: payments.filter((p) => p.customerName === selectedCustomerDrawer.name).length,
              content: (
                <div className="space-y-2 text-xs">
                  {payments
                    .filter((p) => p.customerName === selectedCustomerDrawer.name)
                    .map((p) => (
                      <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-orange mr-2">{p.paymentNumber}</span>
                          <span className="text-slate-700 dark:text-slate-300">{p.method} ({p.referenceNo})</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.amountMzn.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    ))}
                </div>
              ),
            },
            {
              id: 'historico',
              label: 'Histórico',
              content: (
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Cliente registado na base de dados N'Tandinho com teto de crédito verificado.</p>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* COTAÇÃO DETAIL DRAWER */}
      {selectedQuotationDrawer && (
        <DetailDrawer
          isOpen={!!selectedQuotationDrawer}
          onClose={() => setSelectedQuotationDrawer(null)}
          title={`Proposta Comercial — ${selectedQuotationDrawer.quotationNumber}`}
          subtitle={`Cliente: ${selectedQuotationDrawer.customerName} • Rota: ${selectedQuotationDrawer.origin} ➔ ${selectedQuotationDrawer.destination}`}
          width="lg"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() => {
                  printGeneralReport(
                    `Cotação ${selectedQuotationDrawer.quotationNumber}`,
                    ['Campo / Descrição', 'Valor / Especificação'],
                    [
                      ['Ref. Cotação', selectedQuotationDrawer.quotationNumber],
                      ['Cliente Solicitante', selectedQuotationDrawer.customerName],
                      ['Rota de Transporte', `${selectedQuotationDrawer.origin} ➔ ${selectedQuotationDrawer.destination}`],
                      ['Descrição da Carga', selectedQuotationDrawer.cargoDescription],
                      ['Subtotal Carga', `${selectedQuotationDrawer.priceSubtotal.toLocaleString('pt-MZ')} MZN`],
                      ['Imposto IVA (16%)', `${selectedQuotationDrawer.taxAmount.toLocaleString('pt-MZ')} MZN`],
                      ['Total Orçamentado', `${selectedQuotationDrawer.totalPrice.toLocaleString('pt-MZ')} MZN`],
                    ]
                  );
                }}
                className="h-8 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Printer size={14} />
                <span>Imprimir PDF</span>
              </button>
              {selectedQuotationDrawer.status !== 'ACEITE' && (
                <button
                  onClick={() => {
                    updateQuotationStatus(selectedQuotationDrawer.id, 'ACEITE');
                    setSelectedQuotationDrawer(null);
                  }}
                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Aprovar & Aceitar
                </button>
              )}
              <button
                onClick={() => {
                  convertQuotationToBooking(selectedQuotationDrawer.id);
                  setSelectedQuotationDrawer(null);
                }}
                className="h-8 px-3 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors flex items-center gap-1"
              >
                <ArrowRight size={14} />
                <span>Gerar Reserva</span>
              </button>
            </div>
          }
          tabs={[
            {
              id: 'detalhes',
              label: 'Resumo da Proposta',
              content: (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Cliente Solicitante</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedQuotationDrawer.customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Estado Atual</span>
                      <span className="font-bold text-brand-orange">{selectedQuotationDrawer.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Origem</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedQuotationDrawer.origin}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Destino</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedQuotationDrawer.destination}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 font-mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal Carga:</span>
                      <span>{selectedQuotationDrawer.priceSubtotal.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Imposto IVA (16%):</span>
                      <span>{selectedQuotationDrawer.taxAmount.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span>Total Orçamentado:</span>
                      <span className="text-brand-orange">{selectedQuotationDrawer.totalPrice.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* MODAL ADICIONAR CLIENTE */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Cadastrar Novo Cliente"
        subtitle="Registe cliente empresarial ou particular na base de dados N' Tandinho"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Nome Completo / Razão Social</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cervejas de Moçambique S.A."
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">NUIT</label>
              <input
                type="text"
                value={nuit}
                onChange={(e) => setNuit(e.target.value)}
                placeholder="Ex: 400192834"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tipo de Cliente</label>
              <select
                value={isCorporate ? 'EMPRESA' : 'PARTICULAR'}
                onChange={(e) => setIsCorporate(e.target.value === 'EMPRESA')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              >
                <option value="EMPRESA" className="dark:bg-slate-800">Empresa / Corporativo</option>
                <option value="PARTICULAR" className="dark:bg-slate-800">Particular / Individual</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="logistica@empresa.co.mz"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Telemóvel / Contacto</label>
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
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM MODAL REMOVER CLIENTE */}
      <ConfirmModal
        isOpen={!!deleteCustomerId}
        onClose={() => setDeleteCustomerId(null)}
        onConfirm={() => {
          if (deleteCustomerId) deleteCustomer(deleteCustomerId);
        }}
        title="Desativar e Remover Cliente"
        description="Tem a certeza de que deseja remover este cliente? O histórico financeiro será preservado na auditoria."
        confirmLabel="Remover Cliente"
        isDestructive={true}
      />

      {/* MODAL CRIAR COTAÇÃO */}
      <Modal
        isOpen={isAddQuotationOpen}
        onClose={() => setIsAddQuotationOpen(false)}
        title="Nova Cotação Comercial"
        subtitle="Orçamento formal de transporte de carga com cálculo automático de IVA (16%)"
        maxWidth="md"
      >
        <form onSubmit={handleCreateQuotationSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Cliente Solicitante *</label>
            <input
              type="text"
              required
              value={qCustName}
              onChange={(e) => setQCustName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Origem *</label>
              <input
                type="text"
                required
                value={qOrigCity}
                onChange={(e) => setQOrigCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Destino *</label>
              <input
                type="text"
                required
                value={qDestCity}
                onChange={(e) => setQDestCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Descrição da Carga</label>
            <input
              type="text"
              value={qCargoDesc}
              onChange={(e) => setQCargoDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Orçamento Total (MZN) *</label>
            <input
              type="number"
              required
              value={qTotalPrice}
              onChange={(e) => setQTotalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddQuotationOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 dark:bg-brand-orange hover:bg-slate-800 dark:hover:bg-brand-orange-hover text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-subtle cursor-pointer transition-colors"
            >
              Gerar Cotação
            </button>
          </div>
        </form>
      </Modal>
    </StandardPageLayout>
  );
};
