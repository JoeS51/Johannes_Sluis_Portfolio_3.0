import { useEffect, useMemo, useState } from 'react';
import BlogCard from '../Components/blog/BlogCard';
import { getAllPosts, getAllTags } from '../lib/posts';
import Navigation from '../Components/Navigation.js';
import '../styles/blog.css';
import MarkdownContent from '../Components/blog/MarkdownContent';
const POSTS_PER_PAGE = 10;

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Blog | Johannes Sluis';
  }, []);

  const allPosts = getAllPosts();
  const allTags = getAllTags();

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      const matchesSearch =
        normalizedQuery === '' ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.description.toLowerCase().includes(normalizedQuery) ||
        (post.tags || []).some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [allPosts, searchQuery, selectedTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="blog-page">
      <Navigation />
      <main className="blog-main">
        <header className="blog-header">
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">Thoughts on design, development, and minimalism.</p>
        </header>

        <section className="blog-filters">
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {allTags.length > 0 && (
            <div className="blog-tags">
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className={selectedTag === null ? 'blog-tag-filter active' : 'blog-tag-filter'}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleSelectTag(tag)}
                  className={selectedTag === tag ? 'blog-tag-filter active' : 'blog-tag-filter'}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </section>

        {paginatedPosts.length === 0 ? (
          <div className="blog-empty">
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="blog-list">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="blog-pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="blog-pagination-button"
                >
                  ← Newer
                </button>
                <span className="blog-pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="blog-pagination-button"
                >
                  Older →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Blog;
