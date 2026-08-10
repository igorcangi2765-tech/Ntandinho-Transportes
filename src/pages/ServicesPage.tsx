import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ServiceItem } from '../types';
import { Modal } from '../components/ui/Modal';
import { Briefcase, Plus, CheckCircle, Route, Tag, Edit, Globe2, Truck, Package, ShieldCheck } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, createService, updateService } = useData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [serviceForm, setServiceForm] = useState<{
    name: string;
    category: ServiceItem['category'];
    description: string;
    baseRatePerKmMzn: number;
    baseRatePerTonMzn: number;
  }>({
    name: '',
    category: 'Transporte de Mercadorias',
    description: '',
    baseRatePerKmMzn: 160,
    baseRatePerTonMzn: 950
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, serviceForm);
      setEditingService(null);
    } else {
      createService(serviceForm);
    }
    setIsCreateModalOpen(false);
    setServiceForm({
      name: '',
      category: 'Transporte de Mercadorias',
      description: '',
      baseRatePerKmMzn: 160,
      baseRatePerTonMzn: 950
    });
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Aluguer de Caminhões':
        return Truck;
      case 'Transporte de Mercadorias':
        return Package;
      case 'Carga Geral':
        return ShieldCheck;
      case 'Transporte Internacional (SADC)':
        return Globe2;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#F5A300]" />
            Catálogo de Serviços de Logística
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão dos 4 serviços prestados pela N' Tandinho Transportes em Moçambique e região SADC.
          </p>
        </div>

        <button onClick={() => setIsCreateModalOpen(true)} className="stripe-button-primary text-xs">
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Services Grid (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => {
          const Icon = getServiceIcon(srv.category);
          return (
            <div
              key={srv.id}
              className="stripe-card p-6 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-[#F5A300]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#F5A300] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#F5A300] uppercase tracking-wider block">
                        {srv.category}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-100">{srv.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingService(srv);
                      setServiceForm({
                        name: srv.name,
                        category: srv.category,
                        description: srv.description,
                        baseRatePerKmMzn: srv.baseRatePerKmMzn,
                        baseRatePerTonMzn: srv.baseRatePerTonMzn
                      });
                      setIsCreateModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{srv.description}</p>
              </div>

              {/* Rates & Stats */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tarifa Base / KM</span>
                    <span className="font-bold text-emerald-400">{srv.baseRatePerKmMzn} MZN / km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tarifa Base / Ton</span>
                    <span className="font-bold text-slate-100">{srv.baseRatePerTonMzn} MZN / ton</span>
                  </div>
                </div>

                {srv.popularRoutes && srv.popularRoutes.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Route className="w-3 h-3 text-[#F5A300]" />
                      Rotas Mais Solicitadas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {srv.popularRoutes.map((r, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create/Edit Service */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? `Editar Serviço: ${editingService.name}` : 'Cadastrar Novo Serviço de Logística'}
        subtitle="Defina as tarifas de referência e categorias de transporte"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nome do Serviço *</label>
            <input
              type="text"
              placeholder="Ex: Transporte de Mercadorias Perigosas"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Categoria Principal *</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
              className="stripe-input w-full"
            >
              <option value="Aluguer de Caminhões">Aluguer de Caminhões</option>
              <option value="Transporte de Mercadorias">Transporte de Mercadorias</option>
              <option value="Carga Geral">Carga Geral</option>
              <option value="Transporte Internacional (SADC)">Transporte Internacional (SADC)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Descrição Detalhada *</label>
            <textarea
              rows={3}
              placeholder="Explique o âmbito do serviço, equipamentos incluídos..."
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="stripe-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tarifa por Quilómetro (MZN/KM) *</label>
              <input
                type="number"
                value={serviceForm.baseRatePerKmMzn}
                onChange={(e) => setServiceForm({ ...serviceForm, baseRatePerKmMzn: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tarifa por Tonelada (MZN/TON) *</label>
              <input
                type="number"
                value={serviceForm.baseRatePerTonMzn}
                onChange={(e) => setServiceForm({ ...serviceForm, baseRatePerTonMzn: Number(e.target.value) })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingService(null);
              }}
              className="stripe-button-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="stripe-button-primary text-xs">
              {editingService ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
