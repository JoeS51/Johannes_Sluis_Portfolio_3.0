import { Link, useLocation } from 'react-router-dom';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/random', label: 'Random' },
];

const Navigation = () => {
  const location = useLocation();

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
      </div>
    </header>
  );
};

export default Navigation;
