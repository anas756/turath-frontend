export default function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  actionHref = '#',
  centered = false,
}) {
  return (
    <div className={`user-section-header${centered ? ' is-centered' : ''}`}>
      <div>
        {eyebrow && <p className="user-section-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>

      {actionLabel && (
        <a className="user-section-link" href={actionHref}>
          {actionLabel}
        </a>
      )}
    </div>
  );
}
