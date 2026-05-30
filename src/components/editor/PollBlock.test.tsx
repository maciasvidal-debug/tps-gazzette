import { describe, expect, it } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PollBlock } from './PollBlock';
import type { PollState } from '../../types/gazzette';

describe('PollBlock', () => {
  it('should render nothing if poll is undefined', () => {
    const html = renderToStaticMarkup(<PollBlock poll={undefined} />);
    expect(html).toBe('');
  });

  it('should render nothing if poll has no question or options', () => {
    const poll: PollState = { question: '', options: [], endpoint: '' };
    const html = renderToStaticMarkup(<PollBlock poll={poll} />);
    expect(html).toBe('');
  });

  it('should render a table with question and option links', () => {
    const poll: PollState = {
      question: 'What is your favorite color?',
      options: ['Red', 'Blue'],
      endpoint: 'https://example.com/vote'
    };
    const html = renderToStaticMarkup(<PollBlock poll={poll} />);

    // Test basic structural elements
    expect(html).toContain('<table role="presentation"');
    expect(html).toContain('What is your favorite color?');
    expect(html).toContain('Red');
    expect(html).toContain('Blue');

    // Check correct link rendering
    expect(html).toContain('href="https://example.com/vote?option=Red"');
    expect(html).toContain('href="https://example.com/vote?option=Blue"');

    // Must NOT contain scripts or forms
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<form');
  });

  it('should append parameters correctly if endpoint already has query params', () => {
    const poll: PollState = {
      question: 'Q',
      options: ['A'],
      endpoint: 'https://example.com/vote?id=123'
    };
    const html = renderToStaticMarkup(<PollBlock poll={poll} />);
    expect(html).toContain('href="https://example.com/vote?id=123&amp;option=A"');
  });

  it('should fallback to # if endpoint is invalid', () => {
    const poll: PollState = {
      question: 'Q',
      options: ['A'],
      endpoint: 'javascript:alert(1)'
    };
    const html = renderToStaticMarkup(<PollBlock poll={poll} />);
    expect(html).toContain('href="#"');
  });
});
