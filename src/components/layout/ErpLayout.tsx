import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Truck, 
  Users, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Wrench, 
  Fuel, 
  Briefcase, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Sun, 
  Moon, 
  FileSpreadsheet, 
  Image, 
  HelpCircle, 
  Building2, 
  History,
  MapPin,
  UserCheck,
  Package,
  FileCheck,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { QuickSearchModal } from '../dashboard/QuickSearchModal.js';
import { NotificationDrawer } from './NotificationDrawer.js';
import { QuickActionsFAB } from '../dashboard/QuickActionsFAB.js';
import { OperationalAIModal } from '../dashboard/OperationalAIModal.js';

export const ErpLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    operacoes: true,
    frota: true,
    financeiro: true,
    crm: false,
    rh: false,
    armazem: false,
    documentos: false,
    relatorios: false,
    cms: false,
    sistema: false
  });

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navCategories = [
    {
      key: 'operacoes',
      title: 'Operações & Logística',
      icon: Truck,
      items: [
        { label: 'Viagens & Despacho', icon: Truck, path: '/admin/operacoes/viagens' },
        { label: 'Reservas & Cotações', icon: Calendar, path: '/admin/operacoes/reservas' },
      ]
    },
    {
      key: 'frota',
      title: 'Frota & Telemetria',
      icon: Wrench,
      items: [
        { label: 'Gestão da Frota', icon: Truck, path: '/admin/operacoes/veiculos' },
        { label: 'Telemetria GPS Live', icon: MapPin, path: '/admin/operacoes/veiculos?tab=telemetry' },
        { label: 'Manutenção & Oficina', icon: Wrench, path: '/admin/operacoes/manutencao' },
        { label: 'Combustível & Abastecimento', icon: Fuel, path: '/admin/operacoes/combustivel' },
      ]
    },
    {
      key: 'crm',
      title: 'Clientes & CRM',
      icon: Building2,
      items: [
        { label: 'Clientes Corporativos', icon: Building2, path: '/admin/operacoes/clientes' },
      ]
    },
    {
      key: 'rh',
      title: 'Motoristas & RH',
      icon: Users,
      items: [
        { label: 'Cadastro de Motoristas', icon: UserCheck, path: '/admin/operacoes/motoristas' },
      ]
    },
    {
      key: 'financeiro',
      title: 'Financeiro & Faturação',
      icon: DollarSign,
      items: [
        { label: 'Facturas & Cobrança', icon: FileText, path: '/admin/financeiro/facturas' },
        { label: 'Pagamentos Recebidos', icon: DollarSign, path: '/admin/financeiro/pagamentos' },
        { label: 'Despesas Operacionais', icon: FileSpreadsheet, path: '/admin/financeiro/despesas' },
      ]
    },
    {
      key: 'armazem',
      title: 'Armazém & Stock',
      icon: Package,
      items: [
        { label: 'Stock & Peças', icon: Package, path: '/admin/armazem' },
      ]
    },
    {
      key: 'documentos',
      title: 'Gestão Documental',
      icon: FileCheck,
      items: [
        { label: 'CMR & Seguros', icon: FileCheck, path: '/admin/documentos' },
      ]
    },
    {
      key: 'relatorios',
      title: 'Relatórios & DRE',
      icon: PieChart,
      items: [
        { label: 'Relatórios Gerais', icon: PieChart, path: '/admin/relatorios' },
      ]
    },
    {
      key: 'cms',
      title: 'CMS Website',
      icon: Globe,
      items: [
        { label: 'Hero Section', icon: Image, path: '/admin/cms/hero' },
        { label: 'Sobre a Empresa', icon: BookOpen, path: '/admin/cms/about' },
        { label: 'Serviços', icon: Briefcase, path: '/admin/cms/services' },
        { label: 'Galeria', icon: Image, path: '/admin/cms/gallery' },
        { label: 'Parceiros', icon: Building2, path: '/admin/cms/partners' },
        { label: 'FAQ', icon: HelpCircle, path: '/admin/cms/faq' },
        { label: 'Blog', icon: FileText, path: '/admin/cms/blog' },
        { label: 'SEO & Meta Tags', icon: Search, path: '/admin/cms/seo' },
        { label: 'Website Settings', icon: Settings, path: '/admin/cms/settings' },
      ]
    },
    {
      key: 'sistema',
      title: 'Sistema & Segurança',
      icon: Settings,
      items: [
        { label: 'Utilizadores & Funções', icon: ShieldCheck, path: '/admin/utilizadores' },
        { label: 'Empresa & NUIT', icon: Building2, path: '/admin/sistema/empresa' },
        { label: 'Logs de Auditoria', icon: History, path: '/admin/sistema/logs' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* MOBILE OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/98 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-all duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-600/30 text-white font-bold text-xl shrink-0">
              NT
            </div>
            {sidebarOpen && (
              <div className="truncate">
                <span className="font-bold text-white tracking-wide text-sm block truncate">N' TANDINHO</span>
                <span className="text-[10px] text-orange-500 font-semibold tracking-wider uppercase block">ERP Backoffice</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {/* Main Dashboard Link */}
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              location.pathname === '/admin' 
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/20' 
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} className="shrink-0" />
            {sidebarOpen && <span>Dashboard Executivo</span>}
          </Link>

          {/* Categories Submenus */}
          {navCategories.map(cat => (
            <div key={cat.key} className="pt-2">
              <button
                onClick={() => toggleSubmenu(cat.key)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <cat.icon size={16} className="text-orange-500 shrink-0" />
                  {sidebarOpen && <span>{cat.title}</span>}
                </div>
                {sidebarOpen && (
                  openSubmenus[cat.key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
              </button>

              {(openSubmenus[cat.key] || !sidebarOpen) && (
                <div className="mt-1 space-y-1 pl-3">
                  {cat.items.map(item => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive 
                            ? 'bg-slate-800 text-orange-400 font-semibold border-l-2 border-orange-500' 
                            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <item.icon size={16} className="shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-orange-500/40 flex items-center justify-center font-bold text-white shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-100 truncate">{user?.name || 'Administrador'}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 uppercase tracking-wider">
                  {user?.role || 'Admin'}
                </span>
              </div>
            )}
            {sidebarOpen && (
              <button 
                onClick={logout}
                title="Sair da Conta"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* TOP HEADER */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              title="Alternar Menu Lateral"
            >
              <X size={20} className={sidebarOpen ? 'block' : 'hidden'} />
              <Search size={20} className={!sidebarOpen ? 'block' : 'hidden'} />
            </button>
            
            {/* Quick Search Trigger (CTRL + K) */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex items-center justify-between gap-3 w-72 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-orange-500" />
                <span>Pesquisar no ERP...</span>
              </div>
              <kbd className="text-[10px] font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                CTRL + K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-slate-400 hover:text-amber-400 p-2 rounded-xl hover:bg-slate-800 transition-colors"
              title="Alternar Tema (Dark/Light)"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors relative"
                title="Centro de Notificações"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              </button>
            </div>

            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            {/* Back to Website Button */}
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all"
            >
              <Globe size={14} className="text-orange-400" />
              <span className="hidden sm:inline">Ver Website Público</span>
            </a>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <QuickSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Floating Action Button (FAB) */}
      <QuickActionsFAB 
        onOpenAI={() => setIsAIModalOpen(true)}
      />

      {/* Operational AI Assistant Modal */}
      <OperationalAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
};
