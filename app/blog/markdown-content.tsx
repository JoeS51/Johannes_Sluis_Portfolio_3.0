import { Children, Fragment, isValidElement, type ComponentType } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { AuroraArchitectureAnimation } from "./diagrams/aurora-architecture";
import { AuroraDsqlAnimation } from "./diagrams/aurora-dsql";
import { AuroraLimitlessAnimation } from "./diagrams/aurora-limitless";
import { MvccTransactionAnimation } from "./diagrams/mvcc-transaction";

const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "video", "source"],
  attributes: {
    ...defaultSchema.attributes,
    video: ["autoPlay", "className", "controls", "loop", "muted", "playsInline", "poster"],
    source: ["src", "type"],
  },
};

const diagrams: Record<string, ComponentType> = {
  "[[AURORA_ARCHITECTURE_ANIMATION]]": AuroraArchitectureAnimation,
  "[[AURORA_LIMITLESS_ANIMATION]]": AuroraLimitlessAnimation,
  "[[AURORA_DSQL_ANIMATION]]": AuroraDsqlAnimation,
  "[[MVCC_TRANSACTION_ANIMATION]]": MvccTransactionAnimation,
};

const components: Components = {
  h1: ({ children }) => <h1 className="blog-heading-1">{children}</h1>,
  h2: ({ children }) => <h2 className="blog-heading-2">{children}</h2>,
  h3: ({ children }) => <h3 className="blog-heading-3">{children}</h3>,
  h4: ({ children }) => <h4 className="blog-heading-4">{children}</h4>,
  p: ({ children }) => {
    const containsFigure = Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === "figure",
    );

    return containsFigure
      ? <div className="blog-paragraph">{children}</div>
      : <p className="blog-paragraph">{children}</p>;
  },
  a: ({ href, children }) => (
    <a className="blog-link" href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined}>
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <figure className="blog-figure">
      {/* Article images can be animated or SVG, so retain their native formats. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} loading="lazy" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),
  ul: ({ children }) => <ul className="blog-list">{children}</ul>,
  ol: ({ children }) => <ol className="blog-ordered-list">{children}</ol>,
  li: ({ children }) => <li className="blog-list-item">{children}</li>,
  blockquote: ({ children }) => <blockquote className="blog-quote">{children}</blockquote>,
  pre: ({ children }) => <div className="blog-code-block-wrapper"><pre>{children}</pre></div>,
  code: ({ children, className }) => <code className={className ?? "blog-inline-code"}>{children}</code>,
  table: ({ children }) => <div className="blog-table-wrapper"><table>{children}</table></div>,
  thead: ({ children }) => <thead className="blog-table-head">{children}</thead>,
  th: ({ children }) => <th className="blog-table-header">{children}</th>,
  td: ({ children }) => <td className="blog-table-cell">{children}</td>,
  hr: () => <hr className="blog-divider" />,
};

const markerPattern = /(\[\[(?:AURORA_ARCHITECTURE|AURORA_DSQL|AURORA_LIMITLESS|MVCC_TRANSACTION)_ANIMATION\]\])/g;

export function MarkdownContent({ content }: { content: string }) {
  return content.split(markerPattern).map((part, index) => {
    const Diagram = diagrams[part];

    if (Diagram) return <Diagram key={part} />;

    return part ? (
      <Fragment key={`${index}-${part.slice(0, 16)}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
          components={components}
        >
          {part}
        </ReactMarkdown>
      </Fragment>
    ) : null;
  });
}
