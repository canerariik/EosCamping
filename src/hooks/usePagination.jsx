import { useMemo } from 'react';

export function usePagination(data = [], currentPage = 1, itemsPerPage = 10) {
  const totalItems = data.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return data.slice(start, end);
  }, [data, safeCurrentPage, itemsPerPage]);

  return {
    totalItems,
    totalPages,
    currentPage: safeCurrentPage,
    paginatedData,
  };
}
