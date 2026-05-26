import { validateUrl } from './url';

export function sanitizePollEndpoint(url?: string): string {
  if (!url) return '';
  const sanitized = validateUrl(url);
  // validateUrl returns '#' for invalid/malicious URLs.
  if (sanitized === '#') return '';
  return sanitized;
}

export function sanitizePollText(text?: string): string {
  if (!text) return '';
  // Basic text sanitization: trim and strip HTML tags to prevent simple injection
  // in attributes and plain text areas. The DOM walker in sanitize.ts is for rich text.
  return text.replace(/<[^>]*>?/gm, '').trim();
}
