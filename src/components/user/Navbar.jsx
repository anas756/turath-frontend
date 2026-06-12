import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/services/reduxTollkit/asyncThunks/AuthThunk';

const navItems = [
  { label: 'Discover', href: '#discover', active: true },
  { label: 'Library', href: '#library' },
  { label: 'Media', href: '#media' },
  { label: 'Collections', href: '#collections' },
  { label: 'My Library', href: '#my-library' },
];

const getInitials = (name) => {
  if (!name) return 'U';

  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const displayName = user?.name || user?.userName || user?.username || 'Heritage Reader';
  const displayEmail = user?.email || 'reader@turath.ma';
  const initials = getInitials(displayName);

  useEffect(() => {
    if (!isProfileOpen) return undefined;

    const handleDocumentClick = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="user-navbar">
      <NavLink to="/user/home" className="user-navbar__brand">
        Turath
      </NavLink>

      <nav className="user-navbar__nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={item.active ? 'is-active' : undefined}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="user-profile-menu" ref={profileRef}>
        <button
          type="button"
          className="user-navbar__profile"
          aria-label="Open profile menu"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
          onClick={() => setIsProfileOpen((current) => !current)}
        >
          <span>{initials}</span>
        </button>

        {isProfileOpen && (
          <div className="user-profile-dropdown" role="menu">
            <div className="user-profile-summary">
              <span className="user-profile-avatar">{initials}</span>
              <div>
                <strong>{displayName}</strong>
                <small>{displayEmail}</small>
              </div>
            </div>

            <a href="#my-library" role="menuitem" onClick={() => setIsProfileOpen(false)}>
              My Library
            </a>
            <a href="#library" role="menuitem" onClick={() => setIsProfileOpen(false)}>
              Reading History
            </a>
            <a href="#settings" role="menuitem" onClick={() => setIsProfileOpen(false)}>
              Profile Settings
            </a>

            <button type="button" role="menuitem" onClick={handleLogout} disabled={loading}>
              {loading ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
