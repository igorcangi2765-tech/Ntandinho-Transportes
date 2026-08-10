import React, { useState } from 'react';
import { useErpStore, DocumentItem } from '../shared/stores/useErpStore';
import { StandardPageLayout } from '../components/ui/StandardPageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { DetailDrawer } from '../components/ui/DetailDrawer';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { exportToCSV } from '../utils/csvExporter';
import { printGeneralReport } from '../utils/documentPrinter';
import { FolderLock, Plus, ShieldCheck, AlertTriangle, FileText, Printer, Download } from 'lucide-react';

export const DocumentsCenterPage: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useErpStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocDrawer, setSelectedDocDrawer] = useState<DocumentItem | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [entityType, setEntityType] = useState<'EMPRESA' | 'VIATURA' | 'MOTORISTA' | 'CLIENTE'>('VIATURA');
  const [entityName, setEntityName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2027-01-01');
  const [fileCategory, setFileCategory] = useState<'Seguros' | 'Licenciamento' | 'Inspecções' | 'Contratos' | 'Certificados'>('Licenciamento');

  // Computations
  const validDocsCount = documents.filter((d) => d.status === 'VALIDO').length;
  const expiringDocsCount = documents.filter((d) => d.status === 'PROXIMO_VENCIMENTO').length;
  const expiredDocsCount = documents.filter((d) => d.status === 'EXPIRADO').length;

  const handleExportCSV = () => {
    const headers = ['Título Documento', 'Nº Documento', 'Entidade', 'Assunto', 'Categoria', 'Data Emissão', 'Data Expiração', 'Estado'];
    const rows = documents.map((d) => [d.title, d.docNumber, d.entityType, d.entityName, d.fileCategory, d.issueDate, d.expiryDate, d.status]);
    exportToCSV('central_documentos_ntandinho', headers, rows);
  };

  const handlePrintReport = () => {
    const headers = ['Título Documento', 'Nº Documento', 'Entidade', 'Categoria', 'Data Expiração', 'Estado'];
    const rows = documents.map((d) => [d.title, d.docNumber, `${d.entityType} (${d.entityName})`, d.fileCategory, d.expiryDate, d.status]);
    printGeneralReport('Central de Documentos & Validades de Frota', headers, rows);
  };

  // Columns for Documentos
  const docColumns: Column<DocumentItem>[] = [
    {
      key: 'title',
      header: 'Título do Documento',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.title}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.fileCategory} • {row.entityName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'docNumber',
      header: 'Nº do Documento',
      accessor: (row) => <span className="font-mono font-bold text-brand-orange">{row.docNumber}</span>,
      sortable: true,
    },
    {
      key: 'entityType',
      header: 'Entidade Assunto',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {row.entityType}
        </span>
      ),
    },
    {
      key: 'issueDate',
      header: 'Data Emissão',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-400">{row.issueDate}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Data Expiração',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.expiryDate}</span>,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Estado',
      isStatus: true,
    },
  ];

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !docNumber) return;
    addDocument({
      title,
      entityType,
      entityName: entityName || "N' Tandinho Transportes S.A.",
      docNumber,
      issueDate,
      expiryDate,
      fileCategory,
    });
    setIsAddModalOpen(false);
  };

  return (
    <StandardPageLayout
      title="Central de Documentos & Controlo de Expirações"
      description="Gestão de Alvarás, Seguros de Frota, Inspecções, Licenciamentos e Vistos SADC."
      icon={FolderLock}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir PDF</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-subtle cursor-pointer"
          >
            <Plus size={15} />
            Registar Documento
          </button>
        </div>
      }
      kpiCards={
        <>
          <MetricCard
            title="Total Documentos"
            value={documents.length}
            subtext="Ficheiros arquivados"
            icon={FileText}
            iconBg="bg-slate-100"
            iconColor="text-slate-900"
          />
          <MetricCard
            title="Válidos"
            value={validDocsCount}
            subtext="Em conformidade total"
            icon={ShieldCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Prestes a Vencer"
            value={expiringDocsCount}
            subtext="Necessita renovação"
            icon={AlertTriangle}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <MetricCard
            title="Expirados"
            value={expiredDocsCount}
            subtext="Urgência de regularização"
            icon={AlertTriangle}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
        </>
      }
    >
      <DataTable
        data={documents}
        columns={docColumns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Pesquisar por título, número ou entidade..."
        filterOptions={[
          {
            label: 'Estado',
            key: 'status',
            options: [
              { value: 'VALIDO', label: 'Válido' },
              { value: 'PROXIMO_VENCIMENTO', label: 'Prestes a Vencer' },
              { value: 'EXPIRADO', label: 'Expirado' },
            ],
          },
        ]}
        onRowClick={(row) => setSelectedDocDrawer(row)}
        quickActions={[
          {
            label: 'Ver Ficha de Documento',
            onClick: (row) => setSelectedDocDrawer(row),
          },
          {
            label: 'Eliminar Documento',
            isDestructive: true,
            onClick: (row) => setDeleteDocId(row.id),
          },
        ]}
      />

      {/* DETAIL DRAWER VER DOCUMENTO */}
      <DetailDrawer
        isOpen={!!selectedDocDrawer}
        onClose={() => setSelectedDocDrawer(null)}
        title={selectedDocDrawer?.title || 'Detalhes do Documento'}
        subtitle={`Registo Nº ${selectedDocDrawer?.docNumber}`}
      >
        {selectedDocDrawer && (
          <div className="space-y-4 p-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 font-medium block">Título do Ficheiro</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDocDrawer.title}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Número do Registo</span>
                <span className="font-mono font-bold text-brand-orange">{selectedDocDrawer.docNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Categoria</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedDocDrawer.fileCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Entidade Assunto</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDocDrawer.entityType} ({selectedDocDrawer.entityName})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Data de Emissão</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedDocDrawer.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Data de Expiração</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDocDrawer.expiryDate}</span>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* CONFIRM MODAL ELIMINAR */}
      <ConfirmModal
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={() => {
          if (deleteDocId) deleteDocument(deleteDocId);
        }}
        title="Eliminar Documento"
        description="Tem a certeza de que pretende eliminar este documento da central?"
        confirmLabel="Eliminar Ficheiro"
        isDestructive={true}
      />

      {/* MODAL ADICIONAR DOCUMENTO */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Registar Novo Documento"
        subtitle="Adicione contrato, seguro ou alvará à central documental N' Tandinho"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDocument} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Título do Documento</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Licença de Transporte Internacional SADC"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Número do Documento</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="Ex: ALV-2026-90123"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Categoria de Ficheiro</label>
              <select
                value={fileCategory}
                onChange={(e) => setFileCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                <option value="Licenciamento" className="dark:bg-slate-800">Licenciamento & Alvarás</option>
                <option value="Seguros" className="dark:bg-slate-800">Seguros de Frota</option>
                <option value="Inspecções" className="dark:bg-slate-800">Inspecções Periódicas</option>
                <option value="Contratos" className="dark:bg-slate-800">Contratos Corporativos</option>
                <option value="Certificados" className="dark:bg-slate-800">Certificados de Qualidade</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Entidade Assunto</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              >
                <option value="VIATURA" className="dark:bg-slate-800">Viatura / Camião Pesado</option>
                <option value="MOTORISTA" className="dark:bg-slate-800">Motorista Credenciado</option>
                <option value="EMPRESA" className="dark:bg-slate-800">Empresa Institucional</option>
                <option value="CLIENTE" className="dark:bg-slate-800">Cliente Corporativo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Nome da Entidade / Alocação</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Ex: Volvo ABM-849-MC"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Data de Emissão</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Data de Expiração</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400"
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
              Guardar Documento
            </button>
          </div>
        </form>
      </Modal>
    </StandardPageLayout>
  );
};
