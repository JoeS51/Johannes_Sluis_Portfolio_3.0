import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogCard = ({ post }) => {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-card-title">
        {post.title}
      </Link>

      <div className="blog-card-meta">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime} min read</span>
      </div>

      <p className="blog-card-description">{post.description}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="blog-card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="blog-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default BlogCard;
