import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { FileBarChart2, Download, FileSpreadsheet, FileText, Calendar, Filter, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { customers, trips, vehicles, drivers, invoices, services } = useData();

  const [selectedModule, setSelectedModule] = useState<'VIAGENS' | 'CLIENTES' | 'FROTA' | 'MOTORISTAS' | 'FINANCEIRO' | 'SERVICOS'>('VIAGENS');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const handleExportPDF = () => {
    if (selectedModule === 'VIAGENS') {
      const headers = ['Código', 'Cliente', 'Motorista', 'Caminhão', 'Origem → Destino', 'Valor MZN', 'Estado'];
      const data = trips.map((t) => [t.code, t.customerName, t.driverName, t.vehiclePlate, `${t.origin} → ${t.destination}`, `${t.valueMzn.toLocaleString()} MZN`, t.status]);
      exportToPDF('Relatório de Viagens e Expedição', headers, data, 'Relatorio_Viagens');
    } else if (selectedModule === 'CLIENTES') {
      const headers = ['Cliente', 'Empresa', 'NUIT', 'Cidade', 'Viagens', 'Total Faturado', 'Rating'];
      const data = customers.map((c) => [c.name, c.companyName, c.nuit, c.city, c.totalTrips, `${c.totalSpentMzn.toLocaleString()} MZN`, c.rating]);
      exportToPDF('Relatório de Clientes e Faturação', headers, data, 'Relatorio_Clientes');
    } else if (selectedModule === 'FROTA') {
      const headers = ['Matrícula', 'Marca / Modelo', 'Capacidade', 'Quilometragem', 'Estado', 'Inspeção'];
      const data = vehicles.map((v) => [v.plate, `${v.brand} ${v.model}`, `${v.capacityTons} T`, `${v.mileageKm} KM`, v.status, v.inspectionExpiry]);
      exportToPDF('Relatório de Frota e Manutenção', headers, data, 'Relatorio_Frota');
    } else if (selectedModule === 'MOTORISTAS') {
      const headers = ['Motorista', 'Carta / Categoria', 'Caminhão', 'Viagens', 'Rating', 'Estado'];
      const data = drivers.map((d) => [d.name, `${d.licenseCategory} (${d.licenseNumber})`, d.assignedVehiclePlate || 'Nenhum', d.totalTrips, d.rating, d.status]);
      exportToPDF('Relatório do Quadro de Motoristas', headers, data, 'Relatorio_Motoristas');
    } else if (selectedModule === 'FINANCEIRO') {
      const headers = ['Fatura', 'Cliente', 'Emissão', 'Vencimento', 'Total MZN', 'Estado'];
      const data = invoices.map((i) => [i.code, i.customerName, i.issueDate, i.dueDate, `${i.totalAmountMzn.toLocaleString()} MZN`, i.status]);
      exportToPDF('Relatório Financeiro e Faturação', headers, data, 'Relatorio_Financeiro');
    } else if (selectedModule === 'SERVICOS') {
      const headers = ['Serviço', 'Categoria', 'Tarifa KM', 'Tarifa Tonelada', 'Pedidos Totais'];
      const data = services.map((s) => [s.name, s.category, `${s.baseRatePerKmMzn} MZN`, `${s.baseRatePerTonMzn} MZN`, s.totalOrdersCount]);
      exportToPDF('Relatório de Serviços de Logística', headers, data, 'Relatorio_Servicos');
    }
  };

  const handleExportExcel = () => {
    let exportData: any[] = [];
    if (selectedModule === 'VIAGENS') exportData = trips;
    else if (selectedModule === 'CLIENTES') exportData = customers;
    else if (selectedModule === 'FROTA') exportData = vehicles;
    else if (selectedModule === 'MOTORISTAS') exportData = drivers;
    else if (selectedModule === 'FINANCEIRO') exportData = invoices;
    else if (selectedModule === 'SERVICOS') exportData = services;

    exportToExcel(`Relatorio_${selectedModule}_NTandinho`, selectedModule, exportData);
  };

  const handleExportCSV = () => {
    let exportData: any[] = [];
    if (selectedModule === 'VIAGENS') exportData = trips;
    else if (selectedModule === 'CLIENTES') exportData = customers;
    else if (selectedModule === 'FROTA') exportData = vehicles;
    else if (selectedModule === 'MOTORISTAS') exportData = drivers;
    else if (selectedModule === 'FINANCEIRO') exportData = invoices;
    else if (selectedModule === 'SERVICOS') exportData = services;

    exportToCSV(`Relatorio_${selectedModule}_NTandinho`, exportData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <FileBarChart2 className="w-6 h-6 text-[#F5A300]" />
          Centro de Relatórios Executivos
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gere relatórios analíticos dinâmicos com exportação imediata para PDF, Excel (.xlsx) e CSV.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="stripe-card p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#F5A300]" />
          Parâmetros do Relatório
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Módulo de Dados *</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value as any)}
              className="stripe-input w-full font-semibold"
            >
              <option value="VIAGENS">Viagens & Expedição</option>
              <option value="CLIENTES">Clientes & Carteira</option>
              <option value="FROTA">Frota de Caminhões & Manutenção</option>
              <option value="MOTORISTAS">Motoristas & Qualificação</option>
              <option value="FINANCEIRO">Faturação & Finanças</option>
              <option value="SERVICOS">Serviços & Tarifas</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Data Inicial *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="stripe-input w-full"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Data Final *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="stripe-input w-full"
            />
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dados consolidados prontos para emissão corporativa.</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleExportCSV} className="stripe-button-secondary text-xs">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Exportar CSV</span>
            </button>
            <button onClick={handleExportExcel} className="stripe-button-secondary text-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel (.xlsx)</span>
            </button>
            <button onClick={handleExportPDF} className="stripe-button-primary text-xs">
              <FileText className="w-4 h-4" />
              <span>Gerar Relatório PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
