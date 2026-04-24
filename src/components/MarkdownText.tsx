import React from 'react';

export const MarkdownText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  // Simple parser for **bold**, *italic*, and [link](url)
  // Split by links first, then bold/italic
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  const parseFormatting = (str: string, keyPrefix: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
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

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormatting(text.substring(lastIndex, match.index), `text-${lastIndex}`));
    }

    // match[1] is text, match[2] is URL
    parts.push(
      <a
        key={`link-${match.index}`}
        href={match[2]}
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

  return <span className={className}>{parts}</span>;
};
