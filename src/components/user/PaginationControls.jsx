const buildPageNumbers = (currentPage, lastPage) => {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  );
};

export default function PaginationControls({
  pagination,
  onPageChange,
  loading = false,
}) {
  const currentPage = Number(pagination?.current_page || 1);
  const lastPage = Number(pagination?.last_page || 1);
  const total = Number(pagination?.total || 0);
  const perPage = Number(pagination?.per_page || 10);
  const from = pagination?.from ?? (total ? (currentPage - 1) * perPage + 1 : 0);
  const to = pagination?.to ?? Math.min(currentPage * perPage, total);

  if (!pagination || total === 0) return null;

  const pages = buildPageNumbers(currentPage, lastPage);

  return (
    <nav className="user-pagination" aria-label="Pagination">
      <p>Showing {from}-{to} of {total}</p>
      {lastPage > 1 && (
        <div>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading || currentPage <= 1}
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              type="button"
              key={page}
              className={page === currentPage ? 'is-active' : undefined}
              onClick={() => onPageChange(page)}
              disabled={loading || page === currentPage}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading || currentPage >= lastPage}
          >
            Next
          </button>
        </div>
      )}
    </nav>
  );
}
