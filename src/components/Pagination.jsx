export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3, 'dots', totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, 'dots', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      'dots-left',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'dots-right',
      totalPages,
    ];
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
      <div className="text-slate-400 text-sm">Toplam {totalItems} kayıt</div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40"
        >
          Önceki
        </button>

        {pages.map((page, index) => {
          if (
            page === 'dots' ||
            page === 'dots-left' ||
            page === 'dots-right'
          ) {
            return (
              <span key={`dots-${index}`} className="px-2 text-slate-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`min-w-[42px] px-4 py-2 rounded-lg transition ${
                currentPage === page
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
