import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  actionButton?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Pesquisar registos...',
  pageSize = 7,
  emptyTitle = 'Nenhum registo encontrado',
  emptyDescription = 'Não existem dados disponíveis para os critérios selecionados.',
  actionButton
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return Object.values(row).some((val) =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(search)
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortDirection === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="stripe-card overflow-hidden w-full max-w-full">
      {/* Top Bar with Search & Action - Generous padding & full-width search input */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#020817]/50 w-full">
        <div className="relative w-full sm:flex-1 sm:max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="stripe-input w-full pl-10 pr-4 py-2 text-xs sm:text-sm"
          />
        </div>

        {actionButton && <div className="w-full sm:w-auto shrink-0">{actionButton}</div>}
      </div>

      {/* Table Container - 100% width responsive layout */}
      <div className="w-full max-w-full overflow-x-auto">
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">{emptyTitle}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">{emptyDescription}</p>
          </div>
        ) : (
          <table className="w-full min-w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-[#020817] text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800 select-none">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortable && handleSort(col.accessorKey)}
                    className={`px-3.5 sm:px-5 py-3.5 ${col.sortable ? 'cursor-pointer hover:text-slate-100 transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown className="w-3 h-3 text-slate-500 shrink-0" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-3.5 sm:px-5 py-3.5 align-middle text-xs">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <div className="px-4 sm:px-5 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-[#020817]/50 w-full">
          <div>
            A mostrar{' '}
            <span className="font-semibold text-slate-200">
              {startIndex + 1}
            </span>{' '}
            a{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(startIndex + pageSize, sortedData.length)}
            </span>{' '}
            de <span className="font-semibold text-slate-200">{sortedData.length}</span> registos
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-200">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
