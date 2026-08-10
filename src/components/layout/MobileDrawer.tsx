import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Module } from '../../permissions/rbacConfig';
import {
  LayoutDashboard,
  PackageCheck,
  Truck,
  Users,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Wallet,
  FileBarChart2,
  UserCog,
  Settings,
  X,
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { activeModule, setActiveModule, orders, trips, vehicles } = useData();
  const { currentUser, logout } = useAuth();
  const { canAccess } = usePermissions();

  if (!isOpen) return null;

  const pendingOrdersCount = orders.filter((o) => o.status === 'NOVO' || o.status === 'EM_ANALISE').length;
  const activeTripsCount = trips.filter((t) => t.status === 'EM_TRANSITO').length;
  const maintenanceVehiclesCount = vehicles.filter((v) => v.status === 'MANUTENCAO').length;

  const navItems: { id: Module; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: PackageCheck, badge: pendingOrdersCount ? `${pendingOrdersCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'viagens', label: 'Viagens', icon: Truck, badge: activeTripsCount ? `${activeTripsCount}` : undefined, badgeColor: 'bg-blue-500/20 text-blue-300' },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'frota', label: 'Frota', icon: ShieldCheck, badge: maintenanceVehiclesCount ? `${maintenanceVehiclesCount}` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'motoristas', label: 'Motoristas', icon: UserCheck },
    { id: 'servicos', label: 'Serviços', icon: Briefcase },
    { id: 'financeiro', label: 'Financeiro', icon: Wallet },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart2 },
    { id: 'utilizadores', label: 'Utilizadores', icon: UserCog },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const allowedNavItems = navItems.filter((item) => canAccess(item.id));

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed top-0 bottom-0 left-0 w-4/5 max-w-xs bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-4 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F5A300] to-amber-300 flex items-center justify-center text-slate-950 font-black">
                <Truck className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-slate-100 leading-none">N' TANDINHO</h1>
                <span className="text-[10px] text-[#F5A300] font-semibold tracking-widest uppercase">TRANSPORTES</span>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile info */}
          <div className="my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border border-[#F5A300] object-cover" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</h4>
              <span className="text-[10px] text-[#F5A300] font-semibold uppercase">{currentUser.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F5A300] text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full stripe-button-danger py-2.5 text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
