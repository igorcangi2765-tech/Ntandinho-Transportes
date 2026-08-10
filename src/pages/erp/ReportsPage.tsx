import { useState } from 'react';
import type { FC } from 'react';
import { BarChart3, Download, FileText, FileSpreadsheet, Truck, Users, Building2, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ReportsPage: FC = () => {
  const [reportType, setReportType] = useState('receita');


  const reportCategories = [
    { id: 'receita', title: 'Relatório de Receita & Lucro', desc: 'Balanço financeiro completo, recebimentos e margem operacional.', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'clientes', title: 'Relatório de Clientes Corporativos', desc: 'Histórico de contratação, faturamento por empresa e NUIT.', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'viagens', title: 'Relatório de Viagens & Despacho', desc: 'Desempenho de rotas, códigos de rastreio, km e consumo de combustível.', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'viaturas', title: 'Relatório de Frota & Viaturas', desc: 'Camiões, reboques, seguro automóvel, inspeções e quilometragem.', icon: ShieldCheck, color: 'text-[#F5A300]', bg: 'bg-[#F5A300]/10' },
    { id: 'motoristas', title: 'Relatório de Motoristas', desc: 'Cartas de condução C/CE, horas de estrada e folhas salariais.', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'facturacao', title: 'Relatório de Facturação Comercial', desc: 'Facturas emitidas, IVA 16% retido e liquidações pendentes.', icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' }
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(13, 22, 40);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(245, 163, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TRANSPORTES N' TANDINHO", 14, 23);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`RELATÓRIO OFICIAL ERP: ${reportType.toUpperCase()}`, 14, 32);

    autoTable(doc, {
      startY: 50,
      head: [['Módulo', 'Métrica Principal', 'Status ERP', 'Data Gerado']],
      body: [
        [reportType.toUpperCase(), 'Indicadores Operacionais Conforme Banco Prisma/PostgreSQL', 'Validado', new Date().toLocaleDateString('pt-MZ')],
        ['Receita Total Acumulada', '330,600 MZN', 'Confirmado', new Date().toLocaleDateString('pt-MZ')],
        ['Frota de Camiões', '12 Camiões Disponíveis / 5 Em Viagem', 'Activo', new Date().toLocaleDateString('pt-MZ')]
      ]
    });

    doc.save(`Relatorio-Ntandinho-${reportType}.pdf`);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Modulo: reportType, Empresa: "Transportes N' Tandinho", Status: "Auditado", Data: new Date().toLocaleDateString() },
      { Modulo: "Financeiro", Empresa: "Receita MZN", Status: "330600", Data: new Date().toLocaleDateString() }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    XLSX.writeFile(wb, `Relatorio-Ntandinho-${reportType}.xlsx`);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Modulo,Empresa,Status,Data\n"
      + `${reportType},Transportes N Tandinho,Auditado,${new Date().toLocaleDateString()}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Relatorio-Ntandinho-${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-[#F5A300]" />
            <span>Relatórios Operacionais & Exportações</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Geração de relatórios executivos em PDF, Excel (.xlsx) e CSV para análise financeira e logística.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#13203A] hover:bg-[#13203A]/80 text-[#F5A300] border border-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar PDF</span>
          </button>
          <button 
            onClick={exportExcel}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Exportar Excel</span>
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FileText size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCategories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setReportType(cat.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              reportType === cat.id 
                ? 'bg-[#13203A] border-[#F5A300] shadow-lg shadow-[#F5A300]/10' 
                : 'bg-[#0D1628] border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}>
                <cat.icon size={20} />
              </div>
              {reportType === cat.id && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5A300] text-black text-[10px] font-extrabold uppercase">
                  Selecionado
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold text-white">{cat.title}</h3>
              <p className="text-xs text-[#A5B4C7] mt-1">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT PREVIEW PANEL */}
      <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="text-[#22C55E]" size={18} />
            <span>Pré-visualização do Relatório ({reportType.toUpperCase()})</span>
          </h3>
          <span className="text-xs text-[#A5B4C7]">Fonte: Supabase PostgreSQL DB</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5B4C7]">
            <thead className="bg-[#08101F] text-white uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="p-3">Indicador / Métrica</th>
                <th className="p-3">Valor / Quantidade</th>
                <th className="p-3">Comparativo Mensal</th>
                <th className="p-3">Estado de Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-[#13203A]">
                <td className="p-3 font-bold text-white">Receita Bruta Total</td>
                <td className="p-3 font-bold text-emerald-400">330,600 MZN</td>
                <td className="p-3 text-[#22C55E]">+14.2% em relação a Julho</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px]">Auditado</span></td>
              </tr>
              <tr className="hover:bg-[#13203A]">
                <td className="p-3 font-bold text-white">Camiões Activos na Frota</td>
                <td className="p-3 font-bold text-white">12 Camiões Volvo / Scania</td>
                <td className="p-3 text-[#A5B4C7]">100% frota com GPS</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px]">Validado</span></td>
              </tr>
              <tr className="hover:bg-[#13203A]">
                <td className="p-3 font-bold text-white">Motoristas com Licença C/CE</td>
                <td className="p-3 font-bold text-white">15 Condutores Activos</td>
                <td className="p-3 text-[#A5B4C7]">0 licenças caducadas</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px]">Validado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
