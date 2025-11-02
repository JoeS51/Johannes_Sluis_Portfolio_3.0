import posts from '../data/posts';

const WORDS_PER_MINUTE = 200;

const calculateReadingTime = (content) => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

const sortPosts = () => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
};

export const getAllPosts = () => {
  return sortPosts().map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    tags: post.frontmatter.tags || [],
    readingTime: post.frontmatter.readingTime || calculateReadingTime(post.content),
  }));
};

export const getAllTags = () => {
  const tags = new Set();
  posts.forEach((post) => {
    (post.frontmatter.tags || []).forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
};

export const getPostBySlug = (slug) => {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return null;

  return {
    ...post,
    readingTime: post.frontmatter.readingTime || calculateReadingTime(post.content),
  };
};

export const getAdjacentPosts = (slug) => {
  const sorted = sortPosts();
  const index = sorted.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = sorted[index - 1]
    ? {
        slug: sorted[index - 1].slug,
        title: sorted[index - 1].frontmatter.title,
      }
    : null;

  const next = sorted[index + 1]
    ? {
        slug: sorted[index + 1].slug,
        title: sorted[index + 1].frontmatter.title,
      }
    : null;

  return { prev, next };
};
