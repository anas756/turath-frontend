function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function MediaFeature({ exhibit }) {
  const image = exhibit.image || exhibit.thumbnail || exhibit.coverImage;
  const title = exhibit.title;
  const eyebrow = exhibit.eyebrow || exhibit.type || exhibit.format;

  return (
    <article
      className="media-feature"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(28, 28, 24, 0.05), rgba(28, 28, 24, 0.82)), url(${image})`,
        backgroundPosition: exhibit.imagePosition || 'center',
      }}
    >
      <button
        type="button"
        className="media-play media-play--large"
        aria-label={`Play ${title}`}
      >
        <PlayIcon />
      </button>

      <div className="media-feature__caption">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        {exhibit.summary && <p>{exhibit.summary}</p>}
      </div>
    </article>
  );
}

export function MediaListItem({ item }) {
  const image = item.image || item.thumbnail || item.coverImage;
  const duration = item.duration || item.length;

  return (
    <article className="media-list-item">
      <div className="media-list-item__thumb">
        <img
          src={image}
          alt=""
          style={{ objectPosition: item.imagePosition || 'center' }}
        />
        <button
          type="button"
          className="media-play media-play--small"
          aria-label={`Play ${item.title}`}
        >
          <PlayIcon />
        </button>
      </div>

      <div>
        <span>{duration}</span>
        <h3>{item.title}</h3>
        {item.category && <p>{item.category}</p>}
      </div>
    </article>
  );
}
