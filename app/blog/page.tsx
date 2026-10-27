import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "../../content/writing";
import { InkTitle } from "../ink-specs";
import { formatJapaneseDate } from "./format";

const description = "Articles by Joe Sluis about databases, software internals, and side projects.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Writing", description, url: "/blog" },
};

export default function Page() {
  const posts = getAllPosts();
  return (
    <div className="ink-sheet">
      <InkTitle ja="ライティング" title="Writing" />
      <ol className="ink-posts">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <span className="ink-post-number">{String(posts.length - index).padStart(2, "0")}</span>
            <div>
              <Link className="ink-post-title" href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
              <p className="ink-post-meta" lang="ja">
                <time dateTime={post.frontmatter.date}>{formatJapaneseDate(post.frontmatter.date)}</time>・{post.frontmatter.readingTime}分
              </p>
              <p className="ink-post-description">{post.frontmatter.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
