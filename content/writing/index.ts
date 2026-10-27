import buildingReactFromScratch from "./building-react-from-scratch";
// Unpublished until it is finished: import leetcodeInX8664Assembly from "./leetcode-in-x86-64-assembly";
import mvccInPostgres from "./mvcc-in-postgres";
import sshPortfolioGuide from "./ssh-portfolio-guide";
import whatIsAmazonAurora from "./what-is-amazon-aurora";
import type { WritingPost } from "./types";

const posts: WritingPost[] = [
  whatIsAmazonAurora,
  mvccInPostgres,
  buildingReactFromScratch,
  sshPortfolioGuide,
].sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));

export function getAllPosts() {
  return posts;
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
