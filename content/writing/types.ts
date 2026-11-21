export type WritingPost = {
  slug: string;
  frontmatter: {
    title: string;
    subtitle?: string;
    description: string;
    date: string;
    tags: string[];
    readingTime: number;
    cover: string | null;
  };
  content: string;
};
