import EmptyState from '../../components/user/EmptyState';
import { MediaFeature, MediaListItem } from '../../components/user/MediaFeature';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import { mediaItems } from '../../data/user/homeContent';

const mediaFilters = ['All', 'Videos', 'Audio', 'Images', 'Oral History'];

export default function UserMedia() {
  const featuredMedia = mediaItems.find((item) => item.featured) || mediaItems[0];
  const mediaListItems = featuredMedia
    ? mediaItems.filter((item) => item.id !== featuredMedia.id)
    : [];

  return (
    <section className="user-page media-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Media"
          title="Videos, audio, images, and oral histories"
          actionLabel="Newest Media"
          actionHref="#media-results"
        />

        <div className="user-page-toolbar">
          <input type="search" placeholder="Search media..." />
          <div>
            {mediaFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {featuredMedia ? (
          <>
            <div className="media-grid">
              <MediaFeature exhibit={featuredMedia} />

              <div className="media-list" aria-label="More media items">
                {mediaListItems.map((item) => (
                  <MediaListItem item={item} key={item.id} />
                ))}
              </div>
            </div>

            <div className="user-page-block" id="media-results">
              <SectionHeader eyebrow="All Media" title="Browse media records" />
              <ResourceShelf items={mediaItems} />
            </div>
          </>
        ) : (
          <EmptyState
            title="No media yet"
            message="Videos, audio, and image records can be rendered here once the API is connected."
          />
        )}
      </div>
    </section>
  );
}
