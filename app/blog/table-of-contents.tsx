"use client";

import { useEffect, useRef, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  const activeIdRef = useRef("");

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".blog-post-content h1, .blog-post-content h2, .blog-post-content h3");
    const headingList = Array.from(elements).map((element, index) => {
      const id = element.id || `heading-${index}`;
      element.id = id;
      return { id, text: element.textContent ?? "", level: Number(element.tagName[1]) };
    });

    setHeadings(headingList);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible || visible.target.id === activeIdRef.current) return;
      activeIdRef.current = visible.target.id;
      setActiveId(visible.target.id);
    }, { rootMargin: "-100px 0px -66% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-title">Contents</p>
      <ul className="blog-toc-list">
        {headings.map((heading) => (
          <li className={`blog-toc-item${heading.level === 3 ? " blog-toc-subitem" : heading.level === 1 ? " blog-toc-top" : ""}`} key={heading.id}>
            <a
              className={`blog-toc-link${activeId === heading.id ? " active" : ""}`}
              href={`#${heading.id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.replaceState(null, "", `#${heading.id}`);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
