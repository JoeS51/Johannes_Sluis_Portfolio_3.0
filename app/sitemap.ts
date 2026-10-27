import type { MetadataRoute } from "next";
import { getAllPosts } from "../content/writing";
import { siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: siteUrl, lastModified: posts[0]?.frontmatter.date },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/blog`, lastModified: posts[0]?.frontmatter.date },
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.frontmatter.date })),
  ];
}
