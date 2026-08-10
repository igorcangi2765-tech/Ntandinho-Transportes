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
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeModule, setActiveModule, orders, trips, vehicles } = useData();
  const { currentUser, logout } = useAuth();
  const { canAccess } = usePermissions();

  const pendingOrdersCount = orders.filter((o) => o.status === 'NOVO' || o.status === 'EM_ANALISE').length;
  const activeTripsCount = trips.filter((t) => t.status === 'EM_TRANSITO').length;
  const maintenanceVehiclesCount = vehicles.filter((v) => v.status === 'MANUTENCAO').length;

  const navItems: { id: Module; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: PackageCheck, badge: pendingOrdersCount ? `${pendingOrdersCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'viagens', label: 'Viagens', icon: Truck, badge: activeTripsCount ? `${activeTripsCount}` : undefined, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'frota', label: 'Frota', icon: ShieldCheck, badge: maintenanceVehiclesCount ? `${maintenanceVehiclesCount} em man.` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'motoristas', label: 'Motoristas', icon: UserCheck },
    { id: 'servicos', label: 'Serviços', icon: Briefcase },
    { id: 'financeiro', label: 'Financeiro', icon: Wallet },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart2 },
    { id: 'utilizadores', label: 'Utilizadores', icon: UserCog },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const allowedNavItems = navItems.filter((item) => canAccess(item.id));

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 hidden md:flex ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between h-16">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F5A300] to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">
              <Truck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-100 tracking-tight leading-none">
                N' TANDINHO
              </h1>
              <span className="text-[10px] text-[#F5A300] font-semibold tracking-widest uppercase">
                TRANSPORTES
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#F5A300] flex items-center justify-center text-slate-950 font-extrabold">
              NT
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all relative group ${
                isActive
                  ? 'bg-slate-800 text-[#F5A300] shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#F5A300] rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F5A300]' : 'text-slate-400 group-hover:text-slate-200'}`} />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Clean User Footer Profile & Logout Button (No "Simular Perfil") */}
      <div className="p-4 border-t border-slate-800/80 bg-[#020817]/60 space-y-3">
        {!collapsed ? (
          <div className="space-y-3">
            {/* Logged User Info Box */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full border border-[#F5A300] object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</h4>
                <span className="text-[10px] text-[#F5A300] font-extrabold block uppercase tracking-wider">
                  {currentUser.role === 'ADMIN' ? 'ADMINISTRADOR' : currentUser.role}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair / Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-[#F5A300] object-cover"
              title={`${currentUser.name} (${currentUser.role})`}
            />
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Sair / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
