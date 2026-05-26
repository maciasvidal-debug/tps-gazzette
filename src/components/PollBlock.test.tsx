import { describe, it, expect } from 'bun:test';
import { PollBlock } from './PollBlock';
import type { PollState } from '../types/gazzette';

// We must use Global jsdom mock or explicitly skip full dom tests if react testing library is missing from bun setup.
// For now, let's just do a simple string match against ReactDOMServer.

import { renderToString } from 'react-dom/server';

describe('PollBlock', () => {
  const mockPoll: PollState = {
    question: 'What is your favorite color?',
    endpoint: 'https://example.com/vote',
    options: [
      { id: '1', label: 'Red' },
      { id: '2', label: 'Blue' }
    ]
  };

  it('renders a safe table structure', () => {
    const html = renderToString(<PollBlock poll={mockPoll} />);
    expect(html).toContain('<table role="presentation"');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<form');
  });

  it('appends vote parameters to endpoints safely', () => {
    const html = renderToString(<PollBlock poll={mockPoll} />);
    expect(html).toContain('href="https://example.com/vote?vote=Red&amp;optionId=1"');
    expect(html).toContain('href="https://example.com/vote?vote=Blue&amp;optionId=2"');
  });

  it('does not render if no question or options', () => {
    const htmlEmptyOptions = renderToString(<PollBlock poll={{ ...mockPoll, options: [] }} />);
    expect(htmlEmptyOptions).toBe('');

    const htmlEmptyQuestion = renderToString(<PollBlock poll={{ ...mockPoll, question: '' }} />);
    expect(htmlEmptyQuestion).toBe('');
  });
});
