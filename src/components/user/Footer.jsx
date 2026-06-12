const footerColumns = [
  {
    title: 'Explore',
    links: ['Digital Library', 'Media Center', 'Collections'],
  },
  {
    title: 'Heritage Topics',
    links: ['Architecture', 'Amazigh Culture', 'Oral Traditions'],
  },
  {
    title: 'Account',
    links: ['My Library', 'Bookmarks', 'Reading History'],
  },
];

export default function Footer() {
  return (
    <footer className="user-footer">
      <div className="user-footer__inner">
        <div className="user-footer__brand">
          <a href="#top">Turath</a>
          <p>
            Preserving the vibrant mosaic of Moroccan identity through digital
            stewardship and immersive storytelling.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div className="user-footer__column" key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <p className="user-footer__legal">
        &copy; 2024 Turath Moroccan Heritage. Preserving the past for the
        future.
      </p>
    </footer>
  );
}
