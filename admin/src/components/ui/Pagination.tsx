import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#111D33] border-t border-slate-200 dark:border-[#16223B] text-xs text-slate-500 dark:text-slate-400 font-medium select-none">
      <div className="flex items-center gap-2">
        <span>
          Mostrando <strong className="text-slate-900 dark:text-white font-bold">{startItem}</strong> a{' '}
          <strong className="text-slate-900 dark:text-white font-bold">{endItem}</strong> de{' '}
          <strong className="text-slate-900 dark:text-white font-bold">{totalItems}</strong> registos
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1 ml-4">
            <span>Por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-slate-400 font-semibold cursor-pointer"
            >
              <option value={5} className="dark:bg-slate-800">5</option>
              <option value={10} className="dark:bg-slate-800">10</option>
              <option value={20} className="dark:bg-slate-800">20</option>
              <option value={50} className="dark:bg-slate-800">50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 cursor-pointer"
          title="Página Anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
          .map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#F6A823] text-[#0B132B] shadow-sm font-black'
                  : 'border border-slate-200 dark:border-[#16223B] hover:bg-slate-100 dark:hover:bg-[#16223B] text-slate-700 dark:text-slate-300'
              }`}
            >
              {page}
            </button>
          ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 cursor-pointer"
          title="Próxima Página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
