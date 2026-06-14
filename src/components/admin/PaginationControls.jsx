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
  const from = pagination?.from ?? (total ? (currentPage - 1) * Number(pagination?.per_page || 10) + 1 : 0);
  const to = pagination?.to ?? Math.min(currentPage * Number(pagination?.per_page || 10), total);

  if (!pagination || total === 0) return null;

  const pages = buildPageNumbers(currentPage, lastPage);

  return (
    <div style={styles.wrap}>
      <div style={styles.summary}>
        Showing {from}-{to} of {total}
      </div>
      {lastPage > 1 && (
        <div style={styles.buttons} aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading || currentPage <= 1}
            style={styles.navButton}
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading || page === currentPage}
              style={{
                ...styles.pageButton,
                ...(page === currentPage ? styles.activePageButton : {}),
              }}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading || currentPage >= lastPage}
            style={styles.navButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const baseButton = {
  border: '1px solid var(--surface-high)',
  borderRadius: '0.5rem',
  background: 'var(--surface-white)',
  color: 'var(--on-surface)',
  cursor: 'pointer',
  fontSize: '0.8rem',
  minHeight: '34px',
};

const styles = {
  wrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    padding: '1rem',
    borderTop: '1px solid var(--surface-low)',
  },
  summary: {
    color: 'var(--on-surface-muted)',
    fontSize: '0.8rem',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  navButton: {
    ...baseButton,
    padding: '0 0.75rem',
  },
  pageButton: {
    ...baseButton,
    width: '34px',
  },
  activePageButton: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: 'white',
    cursor: 'default',
  },
};
