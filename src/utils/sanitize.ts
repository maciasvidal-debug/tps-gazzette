/**
 * Simple HTML sanitizer that allows a whitelist of tags and attributes.
 * Designed to be used with EditableText component to prevent XSS.
 * Uses DOMParser for robust tree-walking sanitization.
 */

/**
 * Declarative whitelist of allowed HTML tags.
 */
const ALLOWED_TAGS = new Set([
  'strong', 'em', 'div', 'span', 'ul', 'ol', 'li', 'br',
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'u'
]);

/**
 * Declarative whitelist of allowed attributes.
 */
const ALLOWED_ATTRIBUTES = new Set(['style', 'class']);

/**
 * Declarative whitelist of allowed CSS properties in the 'style' attribute.
 */
const ALLOWED_STYLE_PROPERTIES = new Set([
  'text-align',
  'font-size',
  'color',
  'font-family',
  'list-style-type',
  'margin-left',
  'line-height',
  'font-weight',
  'font-style',
  'text-decoration'
]);

/**
 * Sanitizes a style string by allowing only safe CSS properties and values.
 */
const sanitizeStyles = (styleString: string): string => {
  if (!styleString) return '';

  const styles = styleString.split(';').map(s => s.trim()).filter(Boolean);
  const sanitizedStyles = styles.filter(s => {
    const parts = s.split(':');
    if (parts.length !== 2) return false;

    const property = parts[0].trim().toLowerCase();
    const value = parts[1].trim().toLowerCase();

    // Check if property is allowed
    if (!ALLOWED_STYLE_PROPERTIES.has(property)) return false;

    // Strict value validation:
    // 1. Block parentheses to prevent function calls like expression(), url(), etc.
    // 2. Block backslashes to prevent CSS escape sequences.
    // 3. Block characters that could be used to break out of the style attribute.
    if (/[()\\<>]/.test(value) || value.includes('expression')) {
      return false;
    }

    return true;
  });

  return sanitizedStyles.length > 0 ? sanitizedStyles.join('; ') + ';' : '';
};

/**
 * Recursively sanitizes a DOM node.
 */
const sanitizeNode = (node: Node, targetDoc: Document): Node | null => {
  // TEXT_NODE
  if (node.nodeType === 3) {
    return targetDoc.createTextNode(node.textContent || "");
  }

  // ELEMENT_NODE
  if (node.nodeType === 1) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // If tag is not allowed, return a fragment containing its sanitized children
    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = targetDoc.createDocumentFragment();
      Array.from(el.childNodes).forEach(child => {
        const sanitizedChild = sanitizeNode(child, targetDoc);
        if (sanitizedChild) fragment.appendChild(sanitizedChild);
      });
      return fragment;
    }

    const newEl = targetDoc.createElement(tagName);

    // Sanitize attributes
    for (const attrName of ALLOWED_ATTRIBUTES) {
      const attrValue = el.getAttribute(attrName);
      if (attrValue !== null) {
        if (attrName === 'style') {
          const sanitized = sanitizeStyles(attrValue);
          if (sanitized) {
            newEl.setAttribute('style', sanitized);
          }
        } else {
          newEl.setAttribute(attrName, attrValue);
        }
      }
    }

    // Recurse on children
    Array.from(el.childNodes).forEach(child => {
      const sanitizedChild = sanitizeNode(child, targetDoc);
      if (sanitizedChild) newEl.appendChild(sanitizedChild);
    });

    return newEl;
  }

  // Other node types (comments, processing instructions, etc.) are discarded
  return null;
};

/**
 * Sanitizes an HTML string by allowing only a safe whitelist of tags and attributes.
 * @param html The HTML string to sanitize
 * @returns A sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  // Fallback for non-browser environments (like Bun tests)
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const resultDoc = parser.parseFromString("", "text/html");
    const resultFragment = resultDoc.createDocumentFragment();

    Array.from(doc.body.childNodes).forEach(child => {
      const sanitized = sanitizeNode(child, resultDoc);
      if (sanitized) resultFragment.appendChild(sanitized);
    });

    const container = resultDoc.createElement('div');
    container.appendChild(resultFragment);
    return container.innerHTML;
  } catch (error) {
    console.error('HTML Sanitization failed:', error);
    return '';
  }
};
