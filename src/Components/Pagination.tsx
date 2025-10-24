/**
 * Reusable Pagination Component
 * 
 * Displays pagination controls with navigation buttons and page info
 */

import React from 'react';
import type { PaginationMeta } from '@/types/pagination.types';

interface PaginationProps {
  /** Pagination metadata from API */
  pagination: PaginationMeta | undefined;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  /** Show page numbers (default: true) */
  showPageNumbers?: boolean;
  
  /** Show results info (default: true) */
  showResultsInfo?: boolean;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Custom className */
  className?: string;
}

export function Pagination({
  pagination,
  onPageChange,
  showPageNumbers = true,
  showResultsInfo = true,
  isLoading = false,
  className = '',
}: PaginationProps) {
  if (!pagination) return null;

  const { page, totalPages, hasNextPage, hasPreviousPage, totalCount, limit } = pagination;

  // Calculate displayed range
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Max page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show subset with ellipsis
      if (page <= 3) {
        // Near start
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage || isLoading}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          ««
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          « Previous
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="hidden md:flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(pageNum as number)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pageNum === page ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Mobile: Current Page Display */}
        <div className="md:hidden px-4 py-2 text-sm text-gray-700 font-medium">
          {page} / {totalPages}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next »
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || isLoading}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          »»
        </button>
      </div>

      {/* Results Info */}
      {showResultsInfo && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </div>
      )}
    </div>
  );
}

/**
 * Simplified Pagination (arrows only)
 */
export function SimplePagination({
  pagination,
  onPageChange,
  isLoading,
  className = '',
}: PaginationProps) {
  if (!pagination) return null;

  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage || isLoading}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </button>

      <span className="px-4 py-2 text-gray-700 font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage || isLoading}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

/**
 * Compact Pagination (for mobile/tight spaces)
 */
export function CompactPagination({
  pagination,
  onPageChange,
  isLoading,
  className = '',
}: PaginationProps) {
  if (!pagination) return null;

  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage || isLoading}
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage || isLoading}
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
