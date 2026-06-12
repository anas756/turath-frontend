export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className="user-empty-state">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
