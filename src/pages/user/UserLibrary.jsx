import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import { libraryItems } from '../../data/user/homeContent';

const libraryFilters = ['All', 'Books', 'PDFs', 'Documents', 'Manuscripts', 'Articles'];

export default function UserLibrary() {
  return (
    <section className="user-page library-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Library"
          title="Books, PDFs, documents, and manuscripts"
          actionLabel="Latest Uploads"
          actionHref="#library-results"
        />

        <div className="user-page-toolbar">
          <input type="search" placeholder="Search the library..." />
          <div>
            {libraryFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div id="library-results">
          <ResourceShelf items={libraryItems} />
        </div>
      </div>
    </section>
  );
}
