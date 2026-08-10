import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, LayoutDashboard, PackageCheck, Truck, Users, ShieldCheck, UserCheck, Wallet, ArrowRight, X } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, setActiveModule, orders, trips, customers, vehicles, drivers } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const navigateTo = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsSearchModalOpen(false);
    setQuery('');
  };

  const filteredOrders = query ? orders.filter((o) => o.code.toLowerCase().includes(query.toLowerCase()) || o.customerName.toLowerCase().includes(query.toLowerCase())) : [];
  const filteredTrips = query ? trips.filter((t) => t.code.toLowerCase().includes(query.toLowerCase()) || t.driverName.toLowerCase().includes(query.toLowerCase())) : [];
  const filteredCustomers = query ? customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase())) : [];
  const filteredVehicles = query ? vehicles.filter((v) => v.plate.toLowerCase().includes(query.toLowerCase()) || v.brand.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#020817]">
          <Search className="w-5 h-5 text-[#F5A300]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar pedidos, viagens, clientes, frota ou módulos..."
            className="bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none flex-1"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Navigation Shortcuts */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!query ? (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Navegação Rápida por Módulo
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'pedidos', label: 'Pedidos de Transporte', icon: PackageCheck },
                  { id: 'viagens', label: 'Viagens & Expedição', icon: Truck },
                  { id: 'clientes', label: 'Clientes & Empresas', icon: Users },
                  { id: 'frota', label: 'Frota de Caminhões', icon: ShieldCheck },
                  { id: 'motoristas', label: 'Motoristas', icon: UserCheck },
                  { id: 'financeiro', label: 'Faturação & Finanças', icon: Wallet }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-[#F5A300] text-xs font-medium transition-all text-left"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="flex-1">{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Pedidos</h4>
                  {filteredOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => navigateTo('pedidos')}
                      className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer text-slate-200"
                    >
                      <span className="font-semibold text-[#F5A300]">{o.code}</span>
                      <span className="text-slate-400">{o.customerName}</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredTrips.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">Viagens</h4>
                  {filteredTrips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigateTo('viagens')}
                      className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer text-slate-200"
                    >
                      <span className="font-semibold text-blue-400">{t.code}</span>
                      <span className="text-slate-400">{t.origin} → {t.destination} ({t.driverName})</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredCustomers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Clientes</h4>
                  {filteredCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigateTo('clientes')}
                      className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer text-slate-200"
                    >
                      <span className="font-semibold text-emerald-400">{c.name}</span>
                      <span className="text-slate-400">{c.city}</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredVehicles.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">Frota</h4>
                  {filteredVehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => navigateTo('frota')}
                      className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs cursor-pointer text-slate-200"
                    >
                      <span className="font-semibold text-purple-400">{v.plate}</span>
                      <span className="text-slate-400">{v.brand} {v.model} ({v.status})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
