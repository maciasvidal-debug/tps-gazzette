import { describe, it, expect } from 'bun:test';
import { sanitizePollEndpoint, sanitizePollText } from './pollSanitizer';

describe('pollSanitizer', () => {
  describe('sanitizePollEndpoint', () => {
    it('returns empty string for undefined or empty', () => {
      expect(sanitizePollEndpoint()).toBe('');
      expect(sanitizePollEndpoint('')).toBe('');
    });

    it('allows valid http/https URLs', () => {
      expect(sanitizePollEndpoint('https://api.example.com/poll')).toBe('https://api.example.com/poll');
      expect(sanitizePollEndpoint('http://localhost:3000')).toBe('http://localhost:3000');
    });

    it('blocks malicious URLs', () => {
      expect(sanitizePollEndpoint('javascript:alert(1)')).toBe('');
      expect(sanitizePollEndpoint('data:text/html;base64,...')).toBe('');
      expect(sanitizePollEndpoint('\x01javascript:alert(1)')).toBe('');
    });
  });

  describe('sanitizePollText', () => {
    it('returns empty string for undefined or empty', () => {
      expect(sanitizePollText()).toBe('');
      expect(sanitizePollText('')).toBe('');
    });

    it('strips HTML tags', () => {
      expect(sanitizePollText('<b>bold</b> and <script>alert(1)</script>')).toBe('bold and alert(1)');
    });

    it('trims whitespace', () => {
      expect(sanitizePollText('  hello  ')).toBe('hello');
    });
  });
});
