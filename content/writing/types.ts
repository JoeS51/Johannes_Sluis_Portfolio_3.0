export type WritingPost = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    tags: string[];
    readingTime: number;
    cover: string | null;
  };
  content: string;
};
