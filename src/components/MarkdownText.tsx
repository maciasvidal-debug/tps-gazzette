import React from 'react';

const validateUrl = (url: string): string => {
  const sanitizedUrl = url.trim();

  // Allow relative paths (starting with / or ./)
  if (sanitizedUrl.startsWith('/') || sanitizedUrl.startsWith('./')) {
    return sanitizedUrl;
  }

  // Allow safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  try {
    const parsedUrl = new URL(sanitizedUrl);
    if (safeProtocols.includes(parsedUrl.protocol)) {
      return sanitizedUrl;
    }
  } catch {
    // If URL parsing fails, it might be a relative path or an invalid URL
    // We already checked for common relative path prefixes.
    // If it's something else that's not a valid absolute URL, it's safer to block it if it looks like a protocol
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(sanitizedUrl)) {
      return '#';
    }
    return sanitizedUrl;
  }

  return '#';
};

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

  return <span className={className}>{parts}</span>;
};
