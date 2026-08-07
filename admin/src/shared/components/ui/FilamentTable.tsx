import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet,
  PackageOpen,
} from 'lucide-react';

export interface FilamentColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface FilamentFilterOption {
  label: string;
  value: string;
}

export interface FilamentFilter {
  key: string;
  label: string;
  options: FilamentFilterOption[];
}

interface FilamentTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: FilamentColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filters?: FilamentFilter[];
  actions?: (item: T) => React.ReactNode;
  onExportCsv?: () => void;
  headerActions?: React.ReactNode;
  emptyMessage?: string;
  emptySubtitle?: string;
  pageSize?: number;
}

export function FilamentTable<T extends { id: string | number }>({
  title,
  subtitle,
  columns,
  data,
  searchPlaceholder = 'Pesquisar registos...',
  searchFields,
  filters = [],
  actions,
  onExportCsv,
  headerActions,
  emptyMessage = 'Nenhum registo encontrado',
  emptySubtitle = 'Tente ajustar os filtros ou pesquisar por outro termo.',
  pageSize = 10,
}: FilamentTableProps<T>) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        let matches = false;

        if (searchFields && searchFields.length > 0) {
          matches = searchFields.some((field) => {
            const val = item[field];
            return val ? String(val).toLowerCase().includes(query) : false;
          });
        } else {
          matches = Object.values(item as Record<string, any>).some((val) =>
            val ? String(val).toLowerCase().includes(query) : false
          );
        }

        if (!matches) return false;
      }

      // 2. Filter Dropdowns
      for (const filterKey of Object.keys(activeFilters)) {
        const filterVal = activeFilters[filterKey];
        if (filterVal && filterVal !== 'ALL') {
          const itemVal = (item as Record<string, any>)[filterKey];
          if (String(itemVal) !== filterVal) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, search, searchFields, activeFilters]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = (a as Record<string, any>)[sortKey];
      const valB = (b as Record<string, any>)[sortKey];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      
      const comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * perPage;
    return sortedData.slice(start, start + perPage);
  }, [sortedData, validCurrentPage, perPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="rounded-2xl bg-navy-900/90 border border-slate-800 shadow-glass overflow-hidden transition-all">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          {title && <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-orange/60 transition-all placeholder:text-slate-500 font-medium"
            />
          </div>

          {/* Filter Dropdowns */}
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter size={13} className="text-slate-500" />
              <select
                value={activeFilters[filter.key] || 'ALL'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="bg-transparent text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-slate-900 text-white">
                  {filter.label}: Todos
                </option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* CSV Export */}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Exportar dados para CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          )}

          {headerActions}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`p-2.5 align-middle whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        size={12}
                        className={sortKey === col.key ? 'text-brand-orange' : 'text-slate-600'}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="p-2.5 text-right align-middle whitespace-nowrap uppercase tracking-wider">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-navy-900/40">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-2.5 align-middle whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(item) : String((item as Record<string, any>)[col.key] ?? '-')}
                    </td>
                  ))}
                  {actions && <td className="p-2.5 text-right align-middle whitespace-nowrap shrink-0">{actions(item)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                      <PackageOpen size={24} />
                    </div>
                    <p className="text-sm font-bold text-white">{emptyMessage}</p>
                    <p className="text-xs text-slate-500 max-w-sm">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>A mostrar</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          <span>
            de <strong className="text-white">{sortedData.length}</strong> registos
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 font-mono text-slate-300 font-semibold">
              Página {validCurrentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
