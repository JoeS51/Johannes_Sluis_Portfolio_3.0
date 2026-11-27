import { getAllPosts } from "../../content/writing";
import { siteName, siteUrl } from "../site";

// Built once per deploy from the same post list as /blog, so new posts show up here automatically.
export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const posts = getAllPosts();
  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    return `    <item>
      <title>${escape(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.frontmatter.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.frontmatter.description)}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)}</title>
    <link>${siteUrl}/blog</link>
    <description>Writing by ${escape(siteName)} usually about databases and systems programming.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
