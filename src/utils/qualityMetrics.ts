export function getWordCount(text: string): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function getReadingTime(text: string): number {
  const wordCount = getWordCount(text);
  const wordsPerMinute = 225;
  return Math.ceil(wordCount / wordsPerMinute);
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

export function getFleschKincaidScore(text: string): number {
  if (!text.trim()) return 0;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const syllablesCount = words.reduce((acc, word) => acc + countSyllables(word), 0);

  const score = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllablesCount / wordCount);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10)); // Clamp between 0 and 100
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const lum1 = getLuminance(...rgb1);
    const lum2 = getLuminance(...rgb2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return Math.round(ratio * 100) / 100;
  } catch (e) {
    return 1; // Fallback
  }
}

export function passesWCAGAA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? contrastRatio >= 3.0 : contrastRatio >= 4.5;
}

export interface QualityIssue {
  type: 'error' | 'warning';
  message: string;
  field?: string;
}

import type { GazzetteState } from '../types/gazzette';

export function validateGazzette(state: GazzetteState): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // 1. Accessibility (WCAG AA Contrast)
  const paperColor = '#FCFAF5';
  const colorChecks = [
    { name: 'Primary', hex: state.themeColors?.primary || '#3c2065' },
    { name: 'Accent 1', hex: state.themeColors?.accent1 || '#5e3898' },
    { name: 'Text', hex: state.themeColors?.text || '#1f2937' },
  ];

  for (const color of colorChecks) {
    const contrast = getContrastRatio(color.hex, paperColor);
    if (!passesWCAGAA(contrast, false)) {
      issues.push({
        type: 'error',
        message: `${color.name} color (${color.hex}) does not meet WCAG AA contrast against background.`,
        field: 'themeColors'
      });
    }
  }

  // 2. Completeness (Mandatory fields)
  if (!state.masthead.title.trim()) {
    issues.push({ type: 'error', message: 'Masthead Title is required.', field: 'masthead.title' });
  }
  if (!state.featureStory.headline.trim()) {
    issues.push({ type: 'error', message: 'Feature Story Headline is required.', field: 'featureStory.headline' });
  }
  if (state.featureStory.paragraphs.length === 0 || !state.featureStory.paragraphs.some(p => p.trim().length > 0)) {
    issues.push({ type: 'error', message: 'Feature Story Content cannot be empty.', field: 'featureStory.paragraphs' });
  }

  // 3. Readability Check
  const allText = [
    state.masthead.title,
    state.featureStory.headline,
    state.featureStory.paragraphs.join(' '),
    state.secondaryArticle1.headline,
    state.secondaryArticle1.content,
    state.secondaryArticle2.headline,
    state.secondaryArticle2.content,
    state.quote.text
  ].join(' ');

  const score = getFleschKincaidScore(allText);
  if (score < 30) {
    issues.push({
      type: 'warning',
      message: `Readability score is very low (${score}). The text may be too complex for a general audience.`,
      field: 'readability'
    });
  }

  return issues;
}
