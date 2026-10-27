import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getAllPosts, getPost } from "../../../content/writing";
import { siteName, siteUrl } from "../../site";
import { MarkdownContent } from "../markdown-content";
import { TableOfContents } from "../table-of-contents";
import { formatJapaneseDate } from "../format";
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

  const { previous, next } = getAdjacentPosts(post.slug);
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
      <Link className="ink-back" href="/blog"><span aria-hidden="true">←</span> Writing</Link>
      <header className="ink-article-header">
        <p className="ink-post-meta" lang="ja">
          <time dateTime={post.frontmatter.date}>{formatJapaneseDate(post.frontmatter.date)}</time>・{post.frontmatter.readingTime}分
        </p>
        <h1 className="ink-article-title">{post.frontmatter.title}</h1>
        {post.frontmatter.tags.length > 0 && <p className="ink-article-tags">{post.frontmatter.tags.join(" / ")}</p>}
        <hr className="ink-rule" />
      </header>

      <div className="blog-post-layout">
        <article className="blog-post-content">
          <MarkdownContent content={post.content} />
        </article>
        <TableOfContents />
      </div>

      {(previous || next) && (
        <nav className="ink-article-nav" aria-label="More articles">
          {previous && <Link href={`/blog/${previous.slug}`}><span lang="ja">前へ</span><b>{previous.frontmatter.title}</b></Link>}
          {next && <Link className="next" href={`/blog/${next.slug}`}><span lang="ja">次へ</span><b>{next.frontmatter.title}</b></Link>}
        </nav>
      )}
    </div>
  );
}
