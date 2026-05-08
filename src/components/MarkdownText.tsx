import React from 'react';
import { validateUrl } from '../utils/url';


const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const FORMATTING_REGEX = /(\*\*.*?\*\*|\*.*?\*)/g;

export const MarkdownText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const parsedParts = React.useMemo(() => {
    // We must reset lastIndex since we are using global regexes
    // LINK_REGEX.lastIndex = 0;

    const parseFormatting = (str: string, keyPrefix: string) => {
      // Split does not use lastIndex, but it's safe to use a global regex in split
      const parts = str.split(FORMATTING_REGEX);
      return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={key}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={key}>{part}</React.Fragment>;
      });
    };

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = LINK_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseFormatting(text.substring(lastIndex, match.index), `text-${lastIndex}`));
      }

      // match[1] is text, match[2] is URL
      parts.push(
        <a
          key={`link-${match.index}`}
          href={validateUrl(match[2])}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tps-accent1 hover:text-tps-accent2 underline underline-offset-2 decoration-1"
        >
          {parseFormatting(match[1], `link-text-${match.index}`)}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(parseFormatting(text.substring(lastIndex), `text-${lastIndex}`));
    }

    return parts;
  }, [text]);

  return <span className={className}>{parsedParts}</span>;
};
