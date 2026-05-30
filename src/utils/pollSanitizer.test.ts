import { describe, expect, it } from 'bun:test';
import { sanitizePoll } from './pollSanitizer';
import type { PollState } from '../types/gazzette';

describe('pollSanitizer', () => {
  it('should return undefined if poll is undefined', () => {
    expect(sanitizePoll(undefined)).toBeUndefined();
  });

  it('should strip HTML tags from question and options', () => {
    const input: PollState = {
      question: '<script>alert("xss")</script>What is your <b>favorite</b> color?',
      options: ['<i>Red</i>', 'Blue<img src="x" onerror="alert(1)">'],
      endpoint: 'https://example.com/vote'
    };

    const output = sanitizePoll(input);
    expect(output?.question).toBe('alert("xss")What is your favorite color?');
    expect(output?.options).toEqual(['Red', 'Blue']);
  });

  it('should invalidate unsafe endpoints', () => {
    const input: PollState = {
      question: 'Question',
      options: ['Option 1'],
      endpoint: 'javascript:alert("xss")'
    };

    const output = sanitizePoll(input);
    expect(output?.endpoint).toBe('');
  });

  it('should keep valid endpoints', () => {
    const input: PollState = {
      question: 'Question',
      options: ['Option 1'],
      endpoint: 'https://example.com/vote'
    };

    const output = sanitizePoll(input);
    expect(output?.endpoint).toBe('https://example.com/vote');
  });

  it('should remove empty options after trimming', () => {
     const input: PollState = {
      question: 'Question',
      options: ['Option 1', '   ', 'Option 2'],
      endpoint: 'https://example.com/vote'
    };

    const output = sanitizePoll(input);
    expect(output?.options).toEqual(['Option 1', 'Option 2']);
  });
});
