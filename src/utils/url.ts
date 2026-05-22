export const validateUrl = (url: string): string => {
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
    const stripped = sanitizedUrl.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(stripped)) {
      return '#';
    }
    return sanitizedUrl;
  }

  return '#';
};
