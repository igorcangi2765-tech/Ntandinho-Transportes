import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { searchService } from '../../services/search.service';
import { SearchResultItem } from '../../types/search.types';
import {
  Search,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  DollarSign,
  ShieldCheck,
  Settings,
  Plus,
  Bell,
  LogOut,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setNotificationDrawerOpen } = useAppStore();
  const { addToast } = useNotificationStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchService.search(query).then((res) => {
        setResults(res);
        setSelectedIndex(0);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  const quickNavItems = [
    { title: 'Painel Geral (Dashboard)', path: '/admin', icon: LayoutDashboard },
    { title: 'CRM & Cotações', path: '/admin/crm', icon: Users },
    { title: 'Gestão de Frota', path: '/admin/fleet', icon: Truck },
    { title: 'Operações & Despacho', path: '/operations', icon: Package },
    { title: 'Financeiro', path: '/admin/finance', icon: DollarSign },
    { title: 'Auditoria & Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    { title: 'Configurações', path: '/admin/settings', icon: Settings },
  ];

  const handleSelectNav = (path: string) => {
    setCommandPaletteOpen(false);
    navigate(path);
  };

  const handleAction = (type: string) => {
    setCommandPaletteOpen(false);
    if (type === 'new-op') {
      addToast('Nova Operação', 'Modal de abertura de nova operação iniciado.', 'info');
    } else if (type === 'notifications') {
      setNotificationDrawerOpen(true);
    } else if (type === 'logout') {
      logout();
      navigate('/admin/login');
      addToast('Sessão Terminada', 'Volte brevemente!', 'info');
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search size={20} className="text-brand-orange shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para pesquisar clientes, motoristas, cargas, faturas ou páginas... (Esc para fechar)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Dynamic Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Resultados da Pesquisa ({results.length})
              </h5>
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectNav(item.url)}
                      className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                        index === selectedIndex
                          ? 'bg-brand-orange/15 text-white border border-brand-orange/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{item.subtitle}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-brand-orange font-mono text-[10px] border border-slate-700">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight size={14} className="text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 p-4 text-center">Nenhum resultado encontrado para "{query}".</p>
              )}
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ações Rápidas
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAction('new-op')}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 flex items-center space-x-2.5 text-left text-white transition-all"
                  >
                    <Plus size={16} className="text-brand-orange" />
                    <span className="font-semibold">Nova Operação</span>
                  </button>
                  <button
                    onClick={() => handleAction('notifications')}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 flex items-center space-x-2.5 text-left text-white transition-all"
                  >
                    <Bell size={16} className="text-sky-400" />
                    <span className="font-semibold">Ver Notificações</span>
                  </button>
                  <button
                    onClick={() => handleAction('logout')}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-rose-500/10 border border-slate-700/50 flex items-center space-x-2.5 text-left text-rose-400 transition-all"
                  >
                    <LogOut size={16} />
                    <span className="font-semibold">Sair do Sistema</span>
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Navegação do ERP
                </h5>
                <div className="space-y-1">
                  {quickNavItems.map((nav) => {
                    const Icon = nav.icon;
                    return (
                      <div
                        key={nav.path}
                        onClick={() => handleSelectNav(nav.path)}
                        className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={16} className="text-slate-400" />
                          <span className="font-medium">{nav.title}</span>
                        </div>
                        <kbd className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                          {nav.path}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-navy-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↑</kbd>{' '}
              <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↓</kbd>{' '}
              Navegar
            </span>
            <span>
              <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↵</kbd>{' '}
              Selecionar
            </span>
          </div>
          <span>
            <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">Esc</kbd>{' '}
            Fechar
          </span>
        </div>
      </div>
    </div>
  );
};
