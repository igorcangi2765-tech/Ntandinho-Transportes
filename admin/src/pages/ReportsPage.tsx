import React, { useState } from 'react';
import {
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  Truck,
  Fuel,
  DollarSign,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '../shared/stores/useNotificationStore';

export const ReportsPage: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const handleExport = (title: string, format: string) => {
    setGeneratingReport(`${title} (${format})`);
    setTimeout(() => {
      setGeneratingReport(null);
      if (format === 'print') {
        window.print();
      } else {
        addToast('Exportação Concluída', `Relatório "${title}" exportado com sucesso no formato ${format.toUpperCase()}!`, 'success');
      }
    }, 800);
  };

  const reportModules = [
    {
      id: 'fleet',
      title: 'Relatório Operacional de Frota',
      description: 'Análise de km percorridos, taxa de ocupação, custos por veículo e disponibilidade.',
      icon: Truck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      lastGenerated: 'Hoje, 09:30',
    },
    {
      id: 'finance',
      title: 'Relatório Financeiro & IVA',
      description: 'Resumo de receitas, margem bruta, pendentes de liquidação e mapas de IVA.',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      lastGenerated: 'Ontem, 17:45',
    },
    {
      id: 'fuel',
      title: 'Consumo & Custos de Combustível',
      description: 'Métricas de consumo médio L/100km por veículo, anomalias e abastecimentos.',
      icon: Fuel,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      lastGenerated: '04 de Ago, 14:15',
    },
    {
      id: 'trips',
      title: 'Desempenho de Rotas & Viagens',
      description: 'Tempos médios de viagem, cumprimento de horários e incidências por trajeto SADC.',
      icon: TrendingUp,
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10',
      lastGenerated: '01 de Ago, 10:00',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display flex items-center gap-2.5">
            <FileBarChart className="text-brand-orange" size={24} />
            Relatórios & Métricas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gere, visualize e exporte relatórios analíticos de gestão operacional e financeira.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800/80 rounded-lg p-1">
            <button
              onClick={() => {
                setSelectedPeriod('week');
                addToast('Filtro de Período', 'Relatórios filtrados para a Semana Atual.', 'info');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedPeriod === 'week'
                  ? 'bg-brand-orange text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => {
                setSelectedPeriod('month');
                addToast('Filtro de Período', 'Relatórios filtrados para o Mês Atual.', 'info');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedPeriod === 'month'
                  ? 'bg-brand-orange text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => {
                setSelectedPeriod('year');
                addToast('Filtro de Período', 'Relatórios filtrados para o Ano Atual.', 'info');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedPeriod === 'year'
                  ? 'bg-brand-orange text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ano Atual
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Faturado (Mês)
          </span>
          <div className="text-2xl font-bold text-white mt-2 font-display">4,850,000 MZN</div>
          <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1">
            <TrendingUp size={12} /> +14.2% em relação ao mês anterior
          </span>
        </div>

        <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Consumo Médio Frota
          </span>
          <div className="text-2xl font-bold text-white mt-2 font-display">32.4 L / 100km</div>
          <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1">
            <TrendingUp size={12} /> -2.1% (melhoria de eficiência)
          </span>
        </div>

        <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Viagens Concluídas
          </span>
          <div className="text-2xl font-bold text-white mt-2 font-display">148 Viagens</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-flex items-center gap-1">
            Taxa de pontualidade: 98.4%
          </span>
        </div>

        <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Manutenções Realizadas
          </span>
          <div className="text-2xl font-bold text-white mt-2 font-display">12 Intervenções</div>
          <span className="text-[11px] text-amber-400 mt-1 inline-flex items-center gap-1">
            2 pendentes nesta semana
          </span>
        </div>
      </div>

      {/* Relatórios Disponíveis */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Módulos de Relatório Disponíveis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportModules.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f172a] rounded-xl p-5 border border-slate-800/40 hover:border-slate-700/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${item.bgColor} ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> ÚLTIMO EMISSO: {item.lastGenerated}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Botões de Exportação */}
              <div className="mt-5 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">Exportar como:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport(item.title, 'pdf')}
                    disabled={generatingReport === `${item.title} (pdf)`}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <FileText size={13} className="text-rose-400" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport(item.title, 'excel')}
                    disabled={generatingReport === `${item.title} (excel)`}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <FileSpreadsheet size={13} className="text-emerald-400" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport(item.title, 'print')}
                    disabled={generatingReport === `${item.title} (print)`}
                    className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                    title="Imprimir Relatório"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
