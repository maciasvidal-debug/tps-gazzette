import { expect, test, describe } from 'bun:test';
import { sanitizePollState } from '../../src/utils/pollSanitizer';

describe('pollSanitizer', () => {
  test('returns undefined for empty input', () => {
    expect(sanitizePollState(undefined)).toBeUndefined();
  });

  test('sanitizes poll state successfully and idempotently', () => {
    const input = {
      question: '<strong>Best language?</strong>',
      endpoint: 'javascript:alert(1)',
      options: [
        { id: '1', label: 'TS <script>alert(1)</script>', link: 'https://example.com/ts' },
        { id: '2', label: 'Rust', link: 'javascript:evil()' }
      ]
    };

    const sanitized = sanitizePollState(input);

    expect(sanitized).toBeDefined();
    // Bun environment strips tags in sanitizeHtml because DOMParser is not available
    expect(sanitized?.question).toBe('Best language?');
    expect(sanitized?.endpoint).toBe('#');
    expect(sanitized?.options.length).toBe(2);

    // Check first option
    // In node/bun the fallback sanitizer replace(/<[^>]*>?/gm, '') is used which leaves inner text 'alert(1)'
    expect(sanitized?.options[0].label).toBe('TS alert(1)');
    expect(sanitized?.options[0].link).toBe('https://example.com/ts');

    // Check second option
    expect(sanitized?.options[1].label).toBe('Rust');
    expect(sanitized?.options[1].link).toBe('#');

    // Test idempotency
    const doubleSanitized = sanitizePollState(sanitized);
    expect(doubleSanitized).toEqual(sanitized);
  });

  test('handles missing properties', () => {
    const input = {
      question: 'Hello?',
    };
    const sanitized = sanitizePollState(input);
    expect(sanitized?.question).toBe('Hello?');
    expect(sanitized?.options).toEqual([]);
    expect(sanitized?.endpoint).toBeUndefined();
  });
});
