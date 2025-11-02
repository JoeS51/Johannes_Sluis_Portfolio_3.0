import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../Components/Navigation';
import MarkdownContent from '../Components/blog/MarkdownContent';
import TableOfContents from '../Components/blog/TableOfContents';
import { getAdjacentPosts, getPostBySlug } from '../lib/posts';
import '../styles/blog.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.frontmatter.title} | Blog`;
    }
  }, [post]);

  if (!slug || !post) {
    return <Navigate to="/blog" replace />;
  }

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className="blog-page">
      <Navigation />
      <main className="blog-post-main">
        <div className="blog-back">
          <Link to="/blog" className="blog-back-link">
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>
        </div>

        <article className="blog-post-header">
          <h1 className="blog-post-title">{post.frontmatter.title}</h1>
          <div className="blog-post-meta">
            <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <div className="blog-post-layout">
          <div className="blog-post-content">
            <MarkdownContent content={post.content} />
          </div>
          <TableOfContents />
        </div>

        {(prev || next) && (
          <nav className="blog-post-nav">
            {prev && (
              <Link to={`/blog/${prev.slug}`} className="blog-post-nav-card">
                <p className="blog-post-nav-label">← Previous</p>
                <h3 className="blog-post-nav-title">{prev.title}</h3>
              </Link>
            )}
            {next && (
              <Link to={`/blog/${next.slug}`} className="blog-post-nav-card next">
                <p className="blog-post-nav-label">Next →</p>
                <h3 className="blog-post-nav-title">{next.title}</h3>
              </Link>
            )}
          </nav>
        )}
      </main>
    </div>
  );
};

export default BlogPost;
