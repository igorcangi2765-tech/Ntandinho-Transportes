import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Truck,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  X,
  User,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationStore } from '../../stores/useNotificationStore';

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number | null;
  badgeType?: 'default' | 'warning' | 'danger';
  subItems?: NavSubItem[];
}

export const navItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'operacoes',
    title: 'Operações',
    path: '/operations?tab=trips',
    icon: Briefcase,
    badge: '3',
    subItems: [
      { title: 'Viagens', path: '/operations?tab=trips' },
      { title: 'Reservas', path: '/operations?tab=bookings' },
      { title: 'Agenda Operacional', path: '/operations?tab=calendar' },
    ],
  },
  {
    id: 'frota',
    title: 'Frota',
    path: '/fleet?tab=vehicles',
    icon: Truck,
    badge: '14',
    subItems: [
      { title: 'Viaturas', path: '/fleet?tab=vehicles' },
      { title: 'Manutenção', path: '/fleet?tab=maintenance' },
      { title: 'Abastecimento', path: '/fleet?tab=fuel' },
    ],
  },
  {
    id: 'pessoas',
    title: 'Pessoas & Equipa',
    path: '/drivers-team?tab=drivers',
    icon: Users,
    badge: '2',
    subItems: [
      { title: 'Motoristas', path: '/drivers-team?tab=drivers' },
      { title: 'Equipa Interna', path: '/drivers-team?tab=team' },
    ],
  },
  {
    id: 'comercial',
    title: 'Comercial & CRM',
    path: '/crm?tab=customers',
    icon: TrendingUp,
    badge: '1',
    subItems: [
      { title: 'Clientes / CRM', path: '/crm?tab=customers' },
      { title: 'Cotações & Propostas', path: '/crm?tab=quotations' },
      { title: 'Serviços & Rotas', path: '/services-routes?tab=services' },
    ],
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    path: '/finance?tab=overview',
    icon: DollarSign,
    subItems: [
      { title: 'Visão Geral', path: '/finance?tab=overview' },
      { title: 'Faturas', path: '/finance?tab=invoices' },
      { title: 'Receitas & Despesas', path: '/finance?tab=expenses' },
    ],
  },
  {
    id: 'analise',
    title: 'Relatórios',
    path: '/reports',
    icon: BarChart3,
  },
  {
    id: 'documentos',
    title: 'Documentos',
    path: '/documents',
    icon: FileText,
  },
  {
    id: 'administracao',
    title: 'Configurações',
    path: '/settings?tab=company',
    icon: ShieldCheck,
    badge: '4',
    badgeType: 'warning',
    subItems: [
      { title: 'Perfil da Empresa', path: '/settings?tab=company' },
      { title: 'Utilizadores', path: '/settings?tab=users' },
      { title: 'Registo de Actividades', path: '/audit-logs' },
    ],
  },
];

// Precision helper to check route & query param active states
const isRouteActive = (targetPath: string, currentPathname: string, currentSearchStr: string) => {
  if (!targetPath) return false;

  const [targetBase, targetQuery] = targetPath.split('?');

  if (targetBase === '/' || targetBase === '/dashboard') {
    return currentPathname === '/' || currentPathname === '/dashboard';
  }

  // Cross-module child route handling
  if (targetBase === '/crm' && currentPathname.startsWith('/services-routes')) {
    if (targetPath.includes('/services-routes')) return true;
    return false;
  }

  if (targetBase === '/settings' && currentPathname.startsWith('/audit-logs')) {
    if (targetPath.includes('/audit-logs')) return true;
    return false;
  }

  if (currentPathname !== targetBase && !currentPathname.startsWith(targetBase + '/')) {
    return false;
  }

  // If target contains a query parameter (e.g., ?tab=bookings)
  if (targetQuery) {
    const targetParams = new URLSearchParams(targetQuery);
    const currentParams = new URLSearchParams(currentSearchStr);

    for (const [key, val] of targetParams.entries()) {
      const currentVal = currentParams.get(key);
      if (!currentVal) {
        // Map default tab when query parameter is omitted from URL
        const defaultTabs: Record<string, string> = {
          '/operations': 'trips',
          '/fleet': 'vehicles',
          '/drivers-team': 'drivers',
          '/crm': 'customers',
          '/finance': 'overview',
          '/settings': 'company',
          '/services-routes': 'services',
        };
        if (defaultTabs[targetBase] === val) return true;
        return false;
      }
      if (currentVal !== val) return false;
    }
    return true;
  }

  // If target has no query parameters, base route matching is sufficient
  return true;
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();
  const { logout } = useAuthStore();
  const { addToast } = useNotificationStore();

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    operacoes: true,
    frota: false,
    pessoas: false,
    comercial: false,
    financeiro: false,
    administracao: false,
  });

  // Auto-expand active parent submenu when route changes
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const isChildActive = item.subItems.some((sub) =>
          isRouteActive(sub.path, location.pathname, location.search)
        );
        const isParentBaseActive = isRouteActive(item.path, location.pathname, location.search);
        if (isChildActive || isParentBaseActive) {
          setOpenSubmenus((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [location.pathname, location.search]);

  const handleParentClick = (item: NavItem, e: React.MouseEvent, isMobileDrawer: boolean) => {
    e.stopPropagation();
    
    // Toggle accordion state for the clicked parent
    setOpenSubmenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));

    // Target the primary default subitem or base path
    const targetPath = item.subItems && item.subItems.length > 0 ? item.subItems[0].path : item.path;
    navigate(targetPath);

    if (isMobileDrawer) setMobileSidebarOpen(false);
  };

  const toggleSubmenuChevron = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    addToast('Sessão Encerrada', 'Até breve!', 'info');
    navigate('/login');
  };

  const renderSidebarContent = (isMobileDrawer = false) => {
    const isCollapsed = isMobileDrawer ? false : sidebarCollapsed;

    return (
      <aside
        className={cn(
          'h-full border-r border-slate-200 dark:border-[#16223B] bg-white dark:bg-[#0B132B] flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-sm z-30 shrink-0',
          isCollapsed ? 'w-20' : 'w-72 md:w-64'
        )}
      >
        {/* BRAND HEADER & LOGO */}
        <div className="flex flex-col">
          <div
            className={cn(
              'h-16 flex items-center border-b border-slate-200 dark:border-[#16223B] transition-all duration-300 relative',
              isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
            )}
          >
            <button
              type="button"
              className={cn(
                'flex items-center text-left cursor-pointer focus:outline-none rounded-xl transition-colors',
                isCollapsed
                  ? 'justify-center p-0'
                  : 'space-x-3 p-1 hover:bg-slate-100 dark:hover:bg-[#111D33]'
              )}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/');
                if (isMobileDrawer) setMobileSidebarOpen(false);
              }}
              title={isCollapsed ? "N' Tandinho ERP" : undefined}
            >
              {/* Logo Emblem */}
              <div className="w-10 h-10 rounded-xl bg-[#F6A823] flex items-center justify-center font-black text-[#0B132B] text-xl shadow-md shrink-0 ring-2 ring-[#F6A823]/20">
                <Truck size={20} className="text-[#0B132B]" strokeWidth={2.5} />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-display truncate">
                      N' Tandinho
                    </span>
                    <span className="bg-[#F6A823]/15 text-[#F6A823] text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#F6A823]/30">
                      ERP
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 truncate">
                    Transportes S.A.
                  </span>
                </div>
              )}
            </button>

            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className={cn(
                'hidden md:flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer z-40',
                isCollapsed
                  ? 'absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-[#111D33] border border-slate-200 dark:border-[#273759] rounded-full shadow-md hover:scale-110'
                  : 'p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#111D33]'
              )}
              title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSidebarOpen(false);
              }}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* USER PROFILE SUMMARY CARD */}
          {!isCollapsed && (
            <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#111D33] border border-slate-200/70 dark:border-[#16223B] flex items-center space-x-3">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#F6A823] border border-[#F6A823]/30 flex items-center justify-center font-extrabold text-xs">
                  <User size={16} className="text-[#F6A823]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0B132B] rounded-full" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">
                  Sérgio N'tandinho
                </span>
                <span className="text-[10px] font-semibold text-[#F6A823] truncate">
                  Administrador
                </span>
              </div>
            </div>
          )}

          {/* NAVIGATION MENU ITEMS */}
          <nav
            className={cn(
              'space-y-1 mt-1 max-h-[calc(100vh-210px)] overflow-y-auto custom-scrollbar',
              isCollapsed ? 'px-2 py-3' : 'p-3'
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              // Determine active state for parent
              const isMainActive = isRouteActive(item.path, location.pathname, location.search);
              const isAnySubActive =
                hasSubItems &&
                item.subItems!.some((sub) =>
                  isRouteActive(sub.path, location.pathname, location.search)
                );
              const isParentActive = isMainActive || isAnySubActive;

              const isSubOpen = !!openSubmenus[item.id];

              return (
                <div key={item.id} className="space-y-1 relative group">
                  {hasSubItems ? (
                    <div
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        'w-full group relative flex items-center rounded-xl font-extrabold text-xs transition-all duration-200 cursor-pointer active:scale-[0.98] touch-manipulation',
                        isCollapsed
                          ? 'h-10 w-10 mx-auto justify-center p-0'
                          : 'justify-between px-3 py-2.5',
                        isParentActive
                          ? 'bg-slate-100 dark:bg-[#111D33] text-slate-900 dark:text-white border border-slate-200 dark:border-[#273759] shadow-subtle font-black ' +
                              (isCollapsed
                                ? 'before:absolute before:-left-2 before:top-2 before:bottom-2 before:w-1 before:bg-[#F6A823] before:rounded-r-full'
                                : 'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#F6A823] before:rounded-r-full')
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111D33]'
                      )}
                      onClick={(e) => handleParentClick(item, e, isMobileDrawer)}
                    >
                      <div className="flex items-center justify-center">
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3',
                            isParentActive
                              ? 'text-[#F6A823]'
                              : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                          )}
                        />
                        {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
                      </div>

                      {/* Badges and Submenu Chevron */}
                      {!isCollapsed ? (
                        <div className="flex items-center gap-1.5 ml-auto shrink-0">
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border',
                                item.badgeType === 'warning'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  : 'bg-slate-200/60 dark:bg-[#16223B] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-[#273759]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => toggleSubmenuChevron(item.id, e)}
                            className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                            title={isSubOpen ? 'Recolher Submenu' : 'Expandir Submenu'}
                          >
                            <ChevronDown
                              size={14}
                              className={cn(
                                'transition-transform duration-200 text-slate-400',
                                isSubOpen && 'rotate-180'
                              )}
                            />
                          </button>
                        </div>
                      ) : (
                        /* Collapsed Badge Dot */
                        item.badge && (
                          <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F6A823]"></span>
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMobileDrawer) setMobileSidebarOpen(false);
                      }}
                      title={isCollapsed ? item.title : undefined}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center rounded-xl font-extrabold text-xs transition-all duration-200 cursor-pointer active:scale-[0.98] touch-manipulation',
                          isCollapsed
                            ? 'h-10 w-10 mx-auto justify-center p-0'
                            : 'justify-between px-3 py-2.5',
                          isActive || isMainActive
                            ? 'bg-slate-100 dark:bg-[#111D33] text-slate-900 dark:text-white border border-slate-200 dark:border-[#273759] shadow-subtle font-black ' +
                                (isCollapsed
                                  ? 'before:absolute before:-left-2 before:top-2 before:bottom-2 before:w-1 before:bg-[#F6A823] before:rounded-r-full'
                                  : 'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#F6A823] before:rounded-r-full')
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111D33]'
                        )
                      }
                    >
                      <div className="flex items-center justify-center">
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3',
                            isMainActive
                              ? 'text-[#F6A823]'
                              : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                          )}
                        />
                        {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
                      </div>

                      {!isCollapsed
                        ? item.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ml-auto',
                                item.badgeType === 'warning'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  : 'bg-slate-200/60 dark:bg-[#16223B] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-[#273759]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )
                        : item.badge && (
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F6A823]"></span>
                            </span>
                          )}
                    </NavLink>
                  )}

                  {/* Expanded Submenu Children Dropdown */}
                  {!isCollapsed && hasSubItems && isSubOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.subItems!.map((sub) => {
                        const isSubActive = isRouteActive(
                          sub.path,
                          location.pathname,
                          location.search
                        );

                        return (
                          <NavLink
                            key={sub.title}
                            to={sub.path}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isMobileDrawer) setMobileSidebarOpen(false);
                            }}
                            className={cn(
                              'block px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 active:scale-[0.98] touch-manipulation',
                              isSubActive
                                ? 'text-[#F6A823] font-extrabold bg-[#F6A823]/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111D33]'
                            )}
                          >
                            {sub.title}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}

                  {/* Collapsed Hover Popover for Subitems */}
                  {isCollapsed && hasSubItems && (
                    <div className="absolute left-full top-0 ml-3 hidden group-hover:flex flex-col bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-[#273759] rounded-xl shadow-xl py-2 px-1.5 min-w-[180px] z-50 animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-auto">
                      <div className="px-3 py-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 mb-1">
                        {item.title}
                      </div>
                      {item.subItems!.map((sub) => {
                        const isSubActive = isRouteActive(
                          sub.path,
                          location.pathname,
                          location.search
                        );

                        return (
                          <NavLink
                            key={sub.title}
                            to={sub.path}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isMobileDrawer) setMobileSidebarOpen(false);
                            }}
                            className={cn(
                              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap',
                              isSubActive
                                ? 'text-[#F6A823] bg-[#F6A823]/10 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111D33]'
                            )}
                          >
                            {sub.title}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* FOOTER ACTION: SAIR DO SISTEMA */}
        <div
          className={cn(
            'border-t border-slate-200 dark:border-[#16223B] bg-slate-50/50 dark:bg-[#070D1F]/50',
            isCollapsed ? 'p-2 flex justify-center' : 'p-3'
          )}
        >
          <button
            type="button"
            onClick={(e) => handleLogout(e)}
            className={cn(
              'flex items-center rounded-xl text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation',
              isCollapsed ? 'h-10 w-10 justify-center p-0 mx-auto' : 'w-full px-3 py-2.5 space-x-3'
            )}
            title="Sair do Sistema"
          >
            <LogOut
              size={18}
              className="shrink-0 text-slate-400 group-hover:text-rose-600 transition-colors"
            />
            {!isCollapsed && <span>Sair do Sistema</span>}
          </button>
        </div>
      </aside>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sidebar Container */}
      <div className="hidden md:block shrink-0">
        {renderSidebarContent(false)}
      </div>

      {/* Mobile Slide-Over Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSidebarOpen(false);
            }}
          />
          <div
            className="relative flex-1 max-w-xs w-full z-10 shadow-2xl animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
