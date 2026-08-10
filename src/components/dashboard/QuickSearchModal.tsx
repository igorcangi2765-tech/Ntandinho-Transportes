import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Users, 
  Truck, 
  Car, 
  UserCheck, 
  FileText, 
  Shield, 
  Grid, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { searchGlobal } from '../../services/dashboard.api';
import { SearchResultItem } from '../../types/dashboard.types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounce API search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Erro na pesquisa rápida:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((item: SearchResultItem) => {
    onClose();
    navigate(item.link);
  }, [navigate, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="h-4 w-4 text-blue-400" />;
      case 'truck': return <Truck className="h-4 w-4 text-orange-400" />;
      case 'car': return <Car className="h-4 w-4 text-emerald-400" />;
      case 'user-check': return <UserCheck className="h-4 w-4 text-cyan-400" />;
      case 'file-text': return <FileText className="h-4 w-4 text-amber-400" />;
      case 'shield': return <Shield className="h-4 w-4 text-red-400" />;
      case 'grid': default: return <Grid className="h-4 w-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Barra de Entrada do Pesquisa */}
        <div className="relative border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar faturas, viaturas, motoristas ou clientes... (Ex: Nacala, FT-2026, Volvo)"
            className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-500 focus:outline-none"
          />
          {loading ? (
            <Loader2 className="h-5 w-5 text-orange-500 animate-spin flex-shrink-0" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200 p-1">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
              ESC para fechar
            </kbd>
          )}
        </div>

        {/* Corpo dos Resultados */}
        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {!query || query.trim().length < 2 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <p className="font-medium text-slate-300">Centro de Comando & Pesquisa Instantânea N' Tandinho</p>
              <p>Digite pelo menos 2 caracteres para localizar registos em toda a base de dados do ERP.</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>Nenhum resultado encontrado para "<strong className="text-white">{query}</strong>".</p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected ? 'bg-slate-800 border border-slate-700 text-white shadow' : 'hover:bg-slate-800/60 text-slate-300'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0">
                      {getCategoryIcon(item.icon)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold truncate text-white">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs flex items-center gap-1 font-medium transition-opacity flex-shrink-0 ${isSelected ? 'opacity-100 text-orange-400' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`}>
                    Aceder <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé Dicas Rápido */}
        <div className="border-t border-slate-800 px-4 py-2 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>Use as setas <strong className="text-slate-200">↑</strong> e <strong className="text-slate-200">↓</strong> para navegar e <strong className="text-slate-200">ENTER</strong> para selecionar</span>
          <span className="text-emerald-400 font-semibold">● Busca em Tempo Real (Prisma DB)</span>
        </div>
      </div>
    </div>
  );
};
