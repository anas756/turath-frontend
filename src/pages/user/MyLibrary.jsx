import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import { myLibraryItems } from '../../data/user/homeContent';

const myLibraryFilters = ['Saved', 'In Progress', 'Completed', 'Library', 'Media'];

export default function MyLibrary() {
  return (
    <section className="user-page my-library-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="My Library"
          title="Saved resources and progress"
          actionLabel="Reading History"
          actionHref="#saved-results"
        />

        <div className="user-page-toolbar">
          <input type="search" placeholder="Search saved resources..." />
          <div>
            {myLibraryFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div id="saved-results">
          <ResourceShelf items={myLibraryItems} columns={2} />
        </div>
      </div>
    </section>
  );
}
