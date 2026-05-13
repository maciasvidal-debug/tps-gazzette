import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { validateUrl } from '../utils/url';

export const MarkdownText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <span className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children, ...rest }) => {
            const props = rest as Record<string, unknown>;
            delete props.node;
            return (
              <a
                href={href ? validateUrl(href) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tps-accent1 hover:text-tps-accent2 underline underline-offset-2 decoration-1"
                {...props}
              >
                {children}
              </a>
            );
          },
          p: ({ children, ...rest }) => {
            const props = rest as Record<string, unknown>;
            delete props.node;
            return <span {...props}>{children}</span>; // Inline paragraph so it doesn't break React DOM nesting
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </span>
  );
};
