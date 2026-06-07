import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-sm ${
            currentPage === page
              ? 'bg-primary text-white shadow-sm'
              : typeof page === 'number'
              ? 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              : 'cursor-default text-gray-400'
          }`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
