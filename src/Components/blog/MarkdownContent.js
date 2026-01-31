import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const CodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="blog-code-block-wrapper">
      <button type="button" className="blog-code-copy" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="blog-code-block">
        <code {...props}>{code}</code>
      </pre>
    </div>
  );
};

const MarkdownContent = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => <h1 className="blog-heading-1">{children}</h1>,
        h2: ({ children }) => <h2 className="blog-heading-2">{children}</h2>,
        h3: ({ children }) => <h3 className="blog-heading-3">{children}</h3>,
        h4: ({ children }) => <h4 className="blog-heading-4">{children}</h4>,
        p: ({ children }) => <p className="blog-paragraph">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="blog-link"
            target={href && href.startsWith('http') ? '_blank' : undefined}
            rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="blog-list">{children}</ul>,
        ol: ({ children }) => <ol className="blog-ordered-list">{children}</ol>,
        li: ({ children }) => <li className="blog-list-item">{children}</li>,
        blockquote: ({ children }) => <blockquote className="blog-quote">{children}</blockquote>,
        code: ({ inline, className, children, ...props }) => {
          if (!inline) {
            return <CodeBlock {...props}>{children}</CodeBlock>;
          }

          return (
            <code className="blog-inline-code" {...props}>
              {children}
            </code>
          );
        },
        table: ({ children }) => <div className="blog-table-wrapper"><table>{children}</table></div>,
        thead: ({ children }) => <thead className="blog-table-head">{children}</thead>,
        th: ({ children }) => <th className="blog-table-header">{children}</th>,
        td: ({ children }) => <td className="blog-table-cell">{children}</td>,
        hr: () => <hr className="blog-divider" />,
        img: ({ src, alt }) => (
          <figure className="blog-figure">
            <img src={src} alt={alt} loading="lazy" />
            {alt && <figcaption>{alt}</figcaption>}
          </figure>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
