import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Prism from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import MvccTransactionAnimation from './MvccTransactionAnimation';

const mvccSqlTransactions = [
  {
    title: 'Reader (READ COMMITTED)',
    blocks: [
      { type: 'line', text: 'BEGIN;' },
      { type: 'spacer', lines: 10 },
      { type: 'line', text: 'SELECT name, balance' },
      { type: 'line', text: 'FROM accounts;' },
      { type: 'line', text: '' },
      { type: 'line', text: ' name  | balance' },
      { type: 'line', text: '-------+---------' },
      { type: 'line', text: ' Alice |     100' },
      { type: 'line', text: ' Bob   |     100' },
      { type: 'line', text: '(2 rows)' },
      { type: 'line', text: '' },
      { type: 'line', text: '-- still open' },
    ],
  },
  {
    title: 'Transaction 101',
    blocks: [
      { type: 'line', text: 'BEGIN; -- txid 101' },
      { type: 'line', text: '' },
      { type: 'line', text: 'UPDATE accounts' },
      { type: 'line', text: 'SET balance = balance - 50' },
      { type: 'line', text: "WHERE name = 'Alice';" },
      { type: 'line', text: '' },
      { type: 'line', text: 'UPDATE accounts' },
      { type: 'line', text: 'SET balance = balance + 50' },
      { type: 'line', text: "WHERE name = 'Bob';" },
      { type: 'line', text: '' },
      { type: 'line', text: '-- still open' },
    ],
  },
];

const MvccSqlSplit = () => (
  <div className="mvcc-sql-split" aria-label="Transaction 100 and Transaction 101 SQL">
    {mvccSqlTransactions.map((transaction) => (
      <section key={transaction.title}>
        <p>{transaction.title}</p>
        <pre>
          <code>
            {transaction.blocks.map((block, index) =>
              block.type === 'spacer' ? (
                <span
                  key={`${transaction.title}-${index}`}
                  className="mvcc-sql-spacer"
                  style={{ '--mvcc-sql-spacer-lines': block.lines }}
                  aria-hidden="true"
                />
              ) : (
                <span key={`${transaction.title}-${index}`} className="mvcc-sql-line">
                  {block.text || '\u00a0'}
                </span>
              )
            )}
          </code>
        </pre>
      </section>
    ))}
  </div>
);

const CodeBlock = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');
  const isSingleLine = !code.includes('\n');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'javascript';
  const showCopyButton = language !== 'sql';

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
    <div className={`blog-code-block-wrapper language-${language}${isSingleLine ? ' is-single-line' : ''}`}>
      {showCopyButton && (
        <button type="button" className="blog-code-copy" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
      <Prism language={language} style={atomOneDark} {...props}>
        {code}
      </Prism>
    </div>
  );
};

const markdownComponents = {
        h1: ({ children }) => <h1 className="blog-heading-1">{children}</h1>,
        h2: ({ children }) => <h2 className="blog-heading-2">{children}</h2>,
        h3: ({ children }) => <h3 className="blog-heading-3">{children}</h3>,
        h4: ({ children }) => <h4 className="blog-heading-4">{children}</h4>,
        p: ({ children }) => {
          const hasFigure = React.Children.toArray(children).some(
            (child) => child?.type === 'figure'
          );

          if (hasFigure) {
            return <div className="blog-paragraph">{children}</div>;
          }

          return <p className="blog-paragraph">{children}</p>;
        },
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
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
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
      };

const MarkdownContent = ({ content }) => {
  const parts = content.split(/(\[\[MVCC_TRANSACTION_ANIMATION\]\]|\[\[MVCC_SQL_SPLIT\]\])/g);

  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={`${index}-${part.slice(0, 12)}`}>
            {part === '[[MVCC_TRANSACTION_ANIMATION]]' ? (
              <MvccTransactionAnimation />
            ) : part === '[[MVCC_SQL_SPLIT]]' ? (
              <MvccSqlSplit />
            ) : part ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {part}
              </ReactMarkdown>
            ) : null}
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
