import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blogs' },
  { href: '/ssh-portfolio', label: 'SSH' },
];

const Navigation = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useDarkMode();

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }

    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <header className="blog-nav">
      <div className="blog-nav-inner">
        <Link to="/" className="blog-nav-logo">
          Johannes Sluis
        </Link>
        <div className="blog-nav-actions">
          <nav className="blog-nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={isActive(link.href) ? 'blog-nav-link active' : 'blog-nav-link'}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="blog-theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
