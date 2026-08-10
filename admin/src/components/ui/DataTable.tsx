import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Search,
  Filter,
} from 'lucide-react';
import { StatusBadge, StatusType } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { SkeletonLoader } from './SkeletonLoader';
import { Card } from './Card';
import { Pagination } from './Pagination';


export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  isStatus?: boolean;
}

export interface QuickAction<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (row: T) => void;
  isDestructive?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  quickActions?: QuickAction<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPageDefault?: number;
  filterOptions?: {
    label: string;
    key: keyof T;
    options: { value: string; label: string }[];
  }[];
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  quickActions,
  searchPlaceholder = 'Pesquisar registos...',
  searchFields,
  isLoading = false,
  emptyTitle = 'Nenhum registo encontrado',
  emptyDescription = 'Não existem dados correspondentes à pesquisa ou filtro.',
  itemsPerPageDefault = 10,
  filterOptions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Close quick action dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuRowId(null);
    if (activeMenuRowId) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [activeMenuRowId]);

  // Search filtering
  const filteredData = data.filter((row) => {
    // Check search query
    if (searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase();
      const matchesSearch = searchFields
        ? searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(queryLower))
        : Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(queryLower));

      if (!matchesSearch) return false;
    }

    // Check active filters
    for (const [filterKey, filterVal] of Object.entries(activeFilters)) {
      if (filterVal && filterVal !== 'TODOS') {
        if (String(row[filterKey]) !== filterVal) return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    const result = valA < valB ? -1 : 1;
    return sortDirection === 'asc' ? result : -result;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Tools Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-slate-400 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {filterOptions && filterOptions.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Filter size={14} className="text-slate-400 shrink-0" />
            {filterOptions.map((f) => (
              <select
                key={String(f.key)}
                value={activeFilters[String(f.key)] || 'TODOS'}
                onChange={(e) => {
                  setActiveFilters({ ...activeFilters, [String(f.key)]: e.target.value });
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="TODOS">{f.label}: Todos</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Card List View (< md screens) */}
      <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800">
        {isLoading ? (
          <div className="p-4"><SkeletonLoader count={3} /></div>
        ) : paginatedData.length === 0 ? (
          <div className="py-8"><EmptyState title={emptyTitle} description={emptyDescription} /></div>
        ) : (
          paginatedData.map((row) => {
            const rowId = keyExtractor(row);
            const firstCol = columns[0];
            const secondCol = columns[1];
            const otherCols = columns.slice(2);

            return (
              <div
                key={rowId}
                onClick={() => onRowClick && onRowClick(row)}
                className={`p-4 space-y-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 active:scale-[0.99] touch-manipulation ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {/* Header Row: Primary Field + Quick Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {firstCol && (
                      <div className="font-bold text-xs">
                        {firstCol.accessor ? firstCol.accessor(row) : String(row[firstCol.key] ?? '')}
                      </div>
                    )}
                    {secondCol && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                        {secondCol.accessor ? secondCol.accessor(row) : String(row[secondCol.key] ?? '')}
                      </div>
                    )}
                  </div>

                  {quickActions && quickActions.length > 0 && (
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => action.onClick(row)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                              action.isDestructive
                                ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400'
                                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                            title={action.label}
                          >
                            {Icon && <Icon size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Body Fields Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  {otherCols.map((col) => (
                    <div key={col.key} className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        {col.header}
                      </span>
                      <div className="text-slate-700 dark:text-slate-300 font-medium">
                        {col.accessor ? col.accessor(row) : col.isStatus ? <StatusBadge status={row[col.key] as StatusType} /> : String(row[col.key] ?? '—')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Main Table Content (>= md screens) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-[#16223B] border-b border-slate-200 dark:border-[#1C2A48] text-[11px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              {columns.map((col) => {
                const alignClass =
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';

                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3.5 px-4 ${alignClass} ${col.className || ''} ${
                      col.sortable ? 'cursor-pointer hover:bg-slate-200/60 dark:hover:bg-[#273759]/60 transition-colors' : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        alignClass === 'text-right' ? 'justify-end' : alignClass === 'text-center' ? 'justify-center' : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400 dark:text-slate-300">
                          {sortColumn === col.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp size={14} className="text-slate-900 dark:text-[#F6A823]" />
                            ) : (
                              <ChevronDown size={14} className="text-slate-900 dark:text-[#F6A823]" />
                            )
                          ) : (
                            <ChevronDown size={12} className="opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {quickActions && quickActions.length > 0 && (
                <th className="py-3 px-4 text-right">Acções</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70 font-sans">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (quickActions ? 1 : 0)} className="py-8 px-4">
                  <SkeletonLoader count={4} />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (quickActions ? 1 : 0)} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = keyExtractor(row);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                      const rawValue = row[col.key];

                      return (
                        <td key={col.key} className={`py-3.5 px-4 ${alignClass} ${col.className || ''}`}>
                          {col.accessor ? (
                            col.accessor(row)
                          ) : col.isStatus ? (
                            <StatusBadge status={rawValue as StatusType} />
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{rawValue != null ? String(rawValue) : '—'}</span>
                          )}
                        </td>
                      );
                    })}

                    {quickActions && quickActions.length > 0 && (
                      <td
                        className="py-3.5 px-4 text-right relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuRowId(activeMenuRowId === rowId ? null : rowId)
                            }
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Menu de Acções"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuRowId === rowId && (
                            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 font-medium text-xs text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              {quickActions.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      action.onClick(row);
                                      setActiveMenuRowId(null);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                                      action.isDestructive
                                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                                        : 'text-slate-700 dark:text-slate-200 font-semibold'
                                    }`}
                                  >
                                    {Icon && <Icon size={14} />}
                                    <span>{action.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && paginatedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          onItemsPerPageChange={(num) => {
            setItemsPerPage(num);
            setCurrentPage(1);
          }}
        />
      )}
    </Card>
  );
}
