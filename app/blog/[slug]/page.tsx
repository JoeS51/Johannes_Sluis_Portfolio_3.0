import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "../../../content/writing";
import { links, siteName, siteUrl } from "../../site";
import { MarkdownContent } from "../markdown-content";
import { TableOfContents } from "../table-of-contents";
import { formatEnglishDate } from "../format";
import "../writing.css";
import "../diagrams.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  const { title, description, date, tags } = post.frontmatter;
  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title, description, url: `/blog/${post.slug}`, publishedTime: date, authors: [siteName], tags },
  };
}

export default async function Page({ params }: PageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    keywords: post.frontmatter.tags.join(", "),
    url: `${siteUrl}/blog/${post.slug}`,
    image: `${siteUrl}/blog/${post.slug}/opengraph-image`,
    author: { "@type": "Person", name: siteName, url: siteUrl },
  };

  return (
    <div className="ink-article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <header className="ink-article-header">
        <p className="ink-post-meta" lang="ja">
          <time dateTime={post.frontmatter.date}>{formatEnglishDate(post.frontmatter.date)}</time>・{post.frontmatter.readingTime} min read
        </p>
        <h1 className="ink-article-title">{post.frontmatter.title}</h1>
        {post.frontmatter.subtitle && <p className="ink-article-subtitle">{post.frontmatter.subtitle}</p>}
        <hr className="ink-rule" />
      </header>

      <div className="blog-post-layout">
        <article className="blog-post-content">
          <MarkdownContent content={post.content} />
        </article>
        <TableOfContents />
      </div>

      <footer className="ink-article-footer">
        <span>{siteName}</span>
        <nav aria-label="Social and contact links">
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.558 21.922c.563.104.77-.244.77-.542v-2.097c-3.132.681-3.793-1.328-3.793-1.328-.512-1.3-1.25-1.646-1.25-1.646-1.022-.7.078-.686.078-.686 1.13.08 1.725 1.16 1.725 1.16 1.004 1.721 2.634 1.224 3.276.936.102-.728.393-1.224.715-1.506-2.5-.284-5.128-1.25-5.128-5.563 0-1.229.44-2.232 1.16-3.019-.116-.284-.503-1.428.11-2.978 0 0 .945-.303 3.094 1.153a10.79 10.79 0 0 1 5.63 0c2.148-1.456 3.091-1.153 3.091-1.153.615 1.55.228 2.694.112 2.978.722.787 1.158 1.79 1.158 3.019 0 4.324-2.632 5.276-5.14 5.555.404.35.765 1.04.765 2.097v3.078c0 .3.203.65.774.54A11.25 11.25 0 0 0 12 .75Z" /></svg>
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.8-1.52 3 0 3.57 1.98 3.57 4.55v5.22Z" /></svg>
          </a>
          <a href={`mailto:${links.email}`} aria-label="Email" title="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
          </a>
          <a href="/rss.xml" aria-label="RSS feed" title="RSS feed">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18" /><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56Zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9Z" /></svg>
          </a>
        </nav>
      </footer>
    </div>
  );
}
