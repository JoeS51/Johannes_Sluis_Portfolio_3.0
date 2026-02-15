import { useEffect, useRef, useState } from 'react';

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const activeIdRef = useRef('');
  const rafRef = useRef(0);

  const handleClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const headerOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  useEffect(() => {
    const article = document.querySelector('.blog-post-content');
    if (!article) return;

    const elements = article.querySelectorAll('h1, h2, h3');
    const headingsList = [];

    elements.forEach((element, index) => {
      const id = element.id || `heading-${index}`;
      if (!element.id) {
        element.id = id;
      }

      headingsList.push({
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName[1], 10),
      });
    });

    setHeadings(headingsList);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const nextId = entry.target.id;
          if (activeIdRef.current === nextId) return;

          if (rafRef.current) {
            window.cancelAnimationFrame(rafRef.current);
          }

          rafRef.current = window.requestAnimationFrame(() => {
            activeIdRef.current = nextId;
            setActiveId(nextId);
          });
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="blog-toc">
      <p className="blog-toc-title">Contents</p>
      <ul className="blog-toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={
              heading.level === 3
                ? 'blog-toc-item blog-toc-subitem'
                : heading.level === 2
                  ? 'blog-toc-item'
                  : 'blog-toc-item blog-toc-top'
            }
          >
            <a
              href={`#${heading.id}`}
              className={activeId === heading.id ? 'blog-toc-link active' : 'blog-toc-link'}
              onClick={(event) => handleClick(event, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
