import { formatPublishedDate, getAllPosts, getPost } from "../../../content/writing";
import { ogCard, ogContentType, ogSize } from "../../_og/card";

export const alt = "An article by Joe Sluis";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)!;
  return ogCard({ eyebrow: `JOE SLUIS · ${formatPublishedDate(post.frontmatter.date).toUpperCase()}`, title: post.frontmatter.title, subtitle: post.frontmatter.description });
}
